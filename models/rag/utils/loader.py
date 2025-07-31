import os
import yaml
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA

CONFIG_PATH = "./config/config.yaml"

def load_config():
    with open(CONFIG_PATH, "r") as f:
        return yaml.safe_load(f)

def init_pipeline():
    cfg = load_config()

    # Load embeddings
    embeddings = HuggingFaceEmbeddings(model_name=cfg["embedding_model"])
    
    # Load FAISS (allow dangerous deserialization because index is trusted)
    vectorstore = FAISS.load_local(
        cfg["faiss_path"], 
        embeddings,
        allow_dangerous_deserialization=True
    )

    # Load Groq Chat model
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model=cfg["groq_model"],
        temperature=0
    )

    # Create RAG QA
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": cfg["retriever"]["k"]})
    )

    return qa
