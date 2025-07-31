def get_answer(qa_pipeline, question: str) -> str:
    return qa_pipeline.run(question)
