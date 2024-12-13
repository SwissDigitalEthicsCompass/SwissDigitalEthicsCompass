from langchain_ollama import ChatOllama

local_llm = "aiden_lu/minicpm-v2.6:Q4_K_M"
llm = ChatOllama(model=local_llm, temperature=0)
llm_json_mode = ChatOllama(model=local_llm, temperature=0, format="json")

import os

os.environ["TOKENIZERS_PARALLELISM"] = "true"

# Define the directory where PDF files are stored
pdf_dir = "data_RAG"
output_dir = "extracted_images_pdf"

#from langchain import hub
#from langchain_community.vectorstores import SKLearnVectorStore
from langchain_nomic.embeddings import NomicEmbeddings
from langchain_unstructured import UnstructuredLoader
from langchain_chroma import Chroma
#from langchain_core.output_parsers import StrOutputParser
#from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.utils import filter_complex_metadata
from langchain_community.document_loaders import DirectoryLoader
from chromadb.config import Settings
from langchain.storage import InMemoryByteStore
from langchain.retrievers.multi_vector import MultiVectorRetriever
import uuid
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
import json
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.schema.output_parser import StrOutputParser
import chromadb
chromadb.api.client.SharedSystemClient.clear_system_cache()
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from langchain_community.storage import RedisStore
from langchain_community.utilities.redis import get_client
from IPython.display import HTML, display, Image
from PIL import Image
import base64
from io import BytesIO

# Load documents from PDFs
docs = []
"""
for pdf_file in os.listdir(pdf_dir):
    pdf_path = os.path.join(pdf_dir, pdf_file)
    loader_local = UnstructuredLoader(file_path=pdf_path, strategy="hi_res")
    docs.append(loader_local.load())
"""
loader = DirectoryLoader(pdf_dir, glob="**/*.pdf", use_multithreading=True, loader_cls=UnstructuredLoader,
    loader_kwargs={
        "strategy": "hi_res",  # Document processing strategy
        "extract_images_in_pdf": True,  # Extract images from PDF
        "include_page_breaks": False,  # Whether to include page breaks
#        "infer_table_structure": True,  # Whether to infer table structures
        "max_characters": 1200,  # Max characters in a chunk
        "new_after_n_chars": 1000,  # Create new chunks after a certain length
        "combine_text_under_n_chars": 250,  # Combine text if under a certain limit
        "chunking_strategy": "by_title",  # How to chunk the text
        "starting_page_number": 1,  # Starting page number
        "extract_image_block_output_dir": output_dir,  # Directory to save extracted images
    },
)
docs = loader.load()

# Create a dictionary to store counts of each type
category_counts = {}

for element in docs:
    category = element.metadata.get("category")
    if category in category_counts:
        category_counts[category] += 1
    else:
        category_counts[category] = 1

# Unique_categories will have unique elements
#unique_categories = set(category_counts.keys())
#print("category_counts: ", category_counts)
#print("unique_categories: ", unique_categories)

# Flatten the list of documents
# Iterate over each sublist in docs

#docs_list = []
#for sublist in docs:
    # Iterate over each item in the sublist
#    for item in sublist:
#        docs_list.append(item)  # Append the item to docs_list

# Split documents
##text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
#    chunk_size=1000, chunk_overlap=200
#)
#doc_splits = text_splitter.split_documents(docs)

# Sometiems for Chroma the docuemnts ahve to be filtered

# Add to vectorDB


client = chromadb.HttpClient(
    host="localhost",
    port=8000,
#    ssl=False,
#    headers=None,
    settings=Settings(allow_reset=True),
#    tenant=DEFAULT_TENANT,
#    database=DEFAULT_DATABASE,
)


client.reset()  # resets the database
collection = client.get_or_create_collection("test_my_rag")

vectorstore = Chroma(
    client=client,
    collection_name=collection,
#    documents=metafiltered_docs,
    embedding_function=NomicEmbeddings(model="nomic-embed-text-v1.5", inference_mode="local"),
    persist_directory="backend/chroma_langchain_rag_db_test",  # Optional: directory to store the Chroma database
    client_settings=Settings(anonymized_telemetry=False, allow_reset=True),
)

# The storage layer for the parent documents
# Initialize the storage layer - to store raw images, text and tables
redis_url="redis://:mypassword@localhost:6379/0"

redis_client = get_client(redis_url)
redis_client.flushall()

redis_store = RedisStore(client=redis_client) # you can use filestore, memorystore, any other DB store also

id_key = "doc_id"

# Setup MultiVectorRetriever with byte_store
retriever = MultiVectorRetriever(
    vectorstore=vectorstore,
    docstore=redis_store,
#    byte_store=redis_store,
    id_key=id_key,
#    search_type="similarity",  # Specify the search type as needed
#    k=3  # Number of results to retrieve
)


#doc_ids = [str(uuid.uuid4()) for _ in docs]
# The splitter to use to create smaller chunks
#child_text_splitter = RecursiveCharacterTextSplitter(chunk_size=400)

#sub_docs = []
#for i, doc in enumerate(docs):
#    _id = doc_ids[i]
#    _sub_docs = child_text_splitter.split_documents([doc])
#    for _doc in _sub_docs:
#        _doc.metadata[id_key] = _id
#    sub_docs.extend(_sub_docs)

# Create retriever
# retriever = vectorstore.as_retriever(k=3)
#retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
#doc_splits_filtered = filter_complex_metadata(sub_docs)

# Create a dictionary to store counts of each type
category_counts = {}

for element in docs:
    category = element.metadata.get("category")
    if category in category_counts:
        category_counts[category] += 1
    else:
        category_counts[category] = 1


# Categorize text elements by type
texts = []
tables = []
for element in docs:
    category = element.metadata.get("category")
    if category == "CompositeElement":
        texts.append(element)
    elif category == "Table":
        tables.append(element)

# Define the instruction prompt for summarizing
def make_prompt(element):
    return f"""You are an assistant tasked with summarizing tables and text for retrieval. \
    These summaries will be embedded and used to retrieve the raw text or table elements. \
    Give a concise summary of the table or text that is well optimized for retrieval. Table or text: {element} """

messages = [
    (
        "system",
        "You are an assistant tasked with summarizing tables and text for retrieval. \
    These summaries will be embedded and used to retrieve the raw text or table elements. \
    Give a concise summary of the table or text that is well optimized for retrieval. Table or text: ",
    ),
    ("human", "I love programming."),
]


# Prepare the message for ChatOllama
def prepare_message(element):
    prompt = make_prompt(element)
    return [{"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}]


doc_summary_instructions = """
You are an assistant tasked with summarizing tables and text particularly for semantic retrieval.
These summaries will be embedded and used to retrieve the raw text or table elements
Give a detailed summary of the table or text below that is well optimized for retrieval.
For any tables also add in a one line description of what the table is about besides the summary.
Do not add additional words like Summary: etc.
Table or text chunk:
{element}
"""
doc_texts = """Here is the text: \n\n {text}."""

def generate_text_summaries(texts, tables, summarize_texts = False):
    """
    Summarize text elements
    Args:
        texts: List of str
        tables: List of str
        summarize_texts: Bool to summarize texts
    """

    # Initialize empty summaries
    text_summaries = []
    table_summaries = []

    # Apply to text if texts are provided and summarization is requested
    if texts:
        if summarize_texts:
            for text in texts:
                prompt = [SystemMessage(content=doc_summary_instructions), HumanMessage(content=text)]
                #prompt_formatted = doc_summary_instructions.format(context=text, text=text)
                response = llm.invoke(prompt)
                text_summaries.append(response)
        else:
            text_summaries = texts

    # Apply to tables if tables are provided
    if tables:
        for table in tables:
                prompt = [SystemMessage(content=doc_summary_instructions), HumanMessage(content=table)]
                #prompt_formatted = doc_summary_instructions.format(context=text, text=text)
                response = llm.invoke([HumanMessage(content=prompt)])
                table_summaries.append(response)

    return text_summaries, table_summaries

prompt = ChatPromptTemplate.from_template(doc_summary_instructions)

summarize_chain = {"element": lambda x: x} | prompt | llm | StrOutputParser()

#text_summaries, table_summaries = generate_text_summaries(
#    texts, tables, summarize_texts=False
#)

# Apply to text
# Typically this is reccomended only if you have large text chunks
text_summaries = texts # Skip it

# Apply to tables
table_summaries = summarize_chain.batch(tables, {"max_concurrency": 5})

# create a function to encode images
def encode_image(image_path):
    """Getting the base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# create a function to summarize the image by passing a prompt to GPT-4o
def image_summarize(img_base64, prompt):
    """Make image summary"""

    msg = llm.invoke(
        [
            HumanMessage(
                content=[
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": 
                                     f"data:image/jpeg;base64,{img_base64}"},
                    },
                ]
            )
        ]
    )
    return msg.content

def generate_img_summaries(path):
    """
    Generate summaries and base64 encoded strings for images
    path: Path to list of .jpg files extracted by Unstructured
    """
    # Store base64 encoded images
    img_base64_list = []
    # Store image summaries
    image_summaries = []
    
    # Prompt
    prompt = """You are an assistant tasked with summarizing images for retrieval.
                Remember these images could potentially contain graphs, charts or 
                tables also.
                These summaries will be embedded and used to retrieve the raw image 
                for question answering.
                Give a detailed summary of the image that is well optimized for 
                retrieval.
                Do not add additional words like Summary: etc.
             """
    
    # Apply to images
    for img_file in sorted(os.listdir(path)):
        if img_file.endswith(".jpg"):
            img_path = os.path.join(path, img_file)
            base64_image = encode_image(img_path)
            img_base64_list.append(base64_image)
            image_summaries.append(image_summarize(base64_image, prompt))
    return img_base64_list, image_summaries

# Image summaries
imgs_base64, image_summaries = generate_img_summaries(output_dir) 

import re

# helps in detecting base64 encoded strings
def looks_like_base64(sb):
    """Check if the string looks like base64"""
    return re.match("^[A-Za-z0-9+/]+[=]{0,2}$", sb) is not None

# helps in checking if the base64 encoded image is actually an image
def is_image_data(b64data):
    """
    Check if the base64 data is an image by looking at the start of the data
    """
    image_signatures = {
        b"\xff\xd8\xff": "jpg",
        b"\x89\x50\x4e\x47\x0d\x0a\x1a\x0a": "png",
        b"\x47\x49\x46\x38": "gif",
        b"\x52\x49\x46\x46": "webp",
    }
    try:
        header = base64.b64decode(b64data)[:8]  # Decode and get the first 8 bytes
        for sig, format in image_signatures.items():
            if header.startswith(sig):
                return True
        return False
    except Exception:
        return False

# returns a dictionary separating images and text (with table) elements
def split_image_text_types(docs):
    """
    Split base64-encoded images and texts (with tables)
    """
    b64_images = []
    texts = []
    for doc in docs:
        # Check if the document is of type Document and extract page_content if so
        if isinstance(doc, Document):
            doc = doc.page_content.decode('utf-8')
        else:
            doc = doc.decode('utf-8')
        if looks_like_base64(doc) and is_image_data(doc):
            b64_images.append(doc)
        else:
            texts.append(doc)
    return {"images": b64_images, "texts": texts}

# Unique_categories will have unique elements
unique_categories = set(category_counts.keys())
print("category_counts: ", category_counts)
print("unique_categories: ", unique_categories)

# Add texts
doc_ids = [str(uuid.uuid4()) for _ in texts]
summary_texts = [
    Document(page_content=s.page_content, metadata={id_key: doc_ids[i]})
    for i, s in enumerate(text_summaries)
]
retriever.vectorstore.add_documents(summary_texts)

texts_temp = [doc.page_content for doc in texts]
retriever.docstore.mset(list(zip(doc_ids, texts_temp)))

# Add tables
table_ids = [str(uuid.uuid4()) for _ in tables]
summary_tables = [
    Document(page_content=s, metadata={id_key: table_ids[i]})
    for i, s in enumerate(table_summaries)
]
retriever.vectorstore.add_documents(summary_tables)
table_docs = [table.page_content for table in tables]  #  this step is needed if we want to use docstore instead of bytestore in multivectorretriever
retriever.docstore.mset(list(zip(table_ids, table_docs)))

# add images
doc_ids = [str(uuid.uuid4()) for _ in imgs_base64]
image_summary_docs = [
    Document(page_content=s, metadata={id_key: doc_ids[i]})
    for i, s in enumerate(image_summaries)
]
imgs_base64_docs = [Document(id=doc_id, page_content=img_base64) for doc_id, img_base64 in zip(doc_ids, imgs_base64)]

retriever.vectorstore.add_documents(image_summary_docs)
retriever.docstore.mset(list(zip(doc_ids, imgs_base64)))

def plt_img_base64(img_base64):
    """Disply base64 encoded string as image"""
    # Decode the base64 string
    img_data = base64.b64decode(img_base64)
    # Create a BytesIO object
    img_buffer = BytesIO(img_data)
    # Open the image using PIL
    img = Image.open(img_buffer)
    display(img)


while True:
    input_console = input("\nAsk question: ")
    if input_console == "exit":
        break

    retrieved_docs = retriever.invoke(input_console)
    print("retrieved_docs: \n", retrieved_docs)
    print(len(retrieved_docs))

    if (is_image_data(retrieved_docs[2])):
        plt_img_base64(retrieved_docs[2])

    #for s in retrieved_docs:
    #    print("Page content: ", s.page_content)

    # Print or use the retrieved documents
   #for doc in retrieved_docs:
    #    print(doc.page_content)