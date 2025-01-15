from langchain_ollama import ChatOllama

local_llm = "aiden_lu/minicpm-v2.6:Q4_K_M"
llm = ChatOllama(model=local_llm, temperature=0)
llm_json_mode = ChatOllama(model=local_llm, temperature=0, format="json")

import os

os.environ["TOKENIZERS_PARALLELISM"] = "true"

# Define the directory where PDF files are stored
pdf_dir = "backend/data_RAG"
output_dir = "backend/extracted_images_pdf"

#from langchain import hub
#from langchain_community.vectorstores import SKLearnVectorStore
from langchain_nomic.embeddings import NomicEmbeddings
#from langchain_unstructured import UnstructuredLoader
from langchain_chroma import Chroma
from langchain_core.runnables import RunnablePassthrough
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
from chromadb import HttpClient
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from langchain_community.storage import RedisStore
from langchain_community.utilities.redis import get_client



client = HttpClient(
    host="localhost",
    port=8000,
    ssl=False,
    headers=None,
    settings=Settings(allow_reset=True),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)


#client.reset()  # resets the database
collection_name = "test_my_rag"  # Use collection name as a string
collection = client.get_or_create_collection(collection_name)

# Initialize the Chroma vector store
vectorstore = Chroma(
    client=client,
    collection_name=collection_name,  # Pass the collection name as a string
    embedding_function=NomicEmbeddings(model="nomic-embed-text-v1.5", inference_mode="local"),
    persist_directory="./chroma_langchain_rag_db_test",  # Optional: directory to store the Chroma database
    client_settings=Settings(anonymized_telemetry=False, allow_reset=True),
)


# The storage layer for the parent documents
# Initialize the storage layer - to store raw images, text and tables
redis_url="redis://:mypassword@localhost:6379/0"

redis_client = get_client(redis_url)
redis_store = RedisStore(client=redis_client) # you can use filestore, memorystore, any other DB store also

#byte_store = InMemoryByteStore()

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

import re
from IPython.display import HTML, display, Image
from PIL import Image
import base64
from io import BytesIO

def plt_img_base64(img_base64):
    """Disply base64 encoded string as image"""
    # Decode the base64 string
    img_data = base64.b64decode(img_base64)
    # Create a BytesIO object
    img_buffer = BytesIO(img_data)
    # Open the image using PIL
    img = Image.open(img_buffer)
    display(img)

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


from operator import itemgetter
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.messages import HumanMessage
import htmltabletomd

def multimodal_prompt_function(data_dict):
    """
    Create a multimodal prompt with both text and image context.
    This function formats the provided context from `data_dict`, which contains
    text, tables, and base64-encoded images. It joins the text (with table) portions
    and prepares the image(s) in a base64-encoded format to be included in a 
    message.
    The formatted text and images (context) along with the user question are used to
    construct a prompt for LLM
    """
    formatted_texts = "\n".join(data_dict["context"]["texts"])
    messages = []
    
    # Adding image(s) to the messages if present
    if data_dict["context"]["images"]:
        for image in data_dict["context"]["images"]:
            image_message = {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{image}"},
            }
            messages.append(image_message)
    
    # Adding the text for analysis
    text_message = {
        "type": "text",
        "text": (
            f"""You are an analyst tasked with understanding detailed information 
                from text documents, data tables, and charts and graphs in images.
                You will be given context information below which will be a mix of 
                text, tables, and images usually of charts or graphs.
                Use this information to provide answers related to the user 
                question.
                Do not make up answers, use the provided context documents below and 
                answer the question to the best of your ability.
                
                User question:
                {data_dict['question']}
                
                Context documents:
                {formatted_texts}
                
                Answer:
            """
        ),
    }
    messages.append(text_message)
    return [HumanMessage(content=messages)]

# Create RAG chain
multimodal_rag = (
        {
            "context": itemgetter('context'),
            "question": itemgetter('input'),
        }
            |
        RunnableLambda(multimodal_prompt_function)
            |
        llm
            |
        StrOutputParser()
)

# Pass input query to retriever and get context document elements
retrieve_docs = (itemgetter('input')
                    |
                retriever
                    |
                RunnableLambda(split_image_text_types))

# Below, we chain `.assign` calls. This takes a dict and successively
# adds keys-- "context" and "answer"-- where the value for each key
# is determined by a Runnable (function or chain executing at runtime).
# This helps in having the retrieved context along with the answer generated by MLLM
multimodal_rag_w_sources = (RunnablePassthrough.assign(context=retrieve_docs)
                                               .assign(answer=multimodal_rag)
)

# Prompt template
template = """Answer the question based only on the following context:
{context}
Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

# RAG pipeline
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

def multimodal_rag_qa(query):
    # Invoke the model with the input query
    response = multimodal_rag_w_sources.invoke({'input': query})
    text_sources = response['context']['texts']
    img_sources = response['context']['images']
    # Return the structured response
    return {
        'answer': response['answer'],
        'text_sources': text_sources,
        'img_sources': img_sources
    }

while True:
    input_console = input("\nAsk question: ")
    if input_console.lower() == "exit":
        break
    result = multimodal_rag_qa(input_console)

    # Print the answer
    print('==' * 50)
    print('Answer:')
    print(result['answer'])
    print('--' * 50)

    # Print the sources
    print('Sources:')
    text_sources = result['text_sources']
    img_sources = result['img_sources']

    for text in text_sources:
        print(text)
    for img in img_sources:
        plt_img_base64(img)
    print('==' * 50)
