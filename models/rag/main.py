from flask import Flask, request, jsonify
from app.rag_pipeline import query_rag
from app.utils.logging_utils import logger
import os

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    logger.info(f"Received question: {question}")
    answer = query_rag(question)

    return jsonify({"answer": answer})

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    app.run(host=host, port=port)
