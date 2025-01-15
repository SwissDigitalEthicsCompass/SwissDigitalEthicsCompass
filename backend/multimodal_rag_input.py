def multimodal_rag_qa(query, llm):
    # Invoke the model with the input query
    response = llm.invoke({'input': query})
    text_sources = response['context']['texts']
    img_sources = response['context']['images']
    # Return the structured response
    return {
        'answer': response['answer'],
        'text_sources': text_sources,
        'img_sources': img_sources
    }