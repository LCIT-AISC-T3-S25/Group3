import os
from flask import Flask, request, jsonify
from utils.loader import init_pipeline
from utils.inference import get_answer
from dotenv import load_dotenv
load_dotenv()

# Load pipeline once
qa_pipeline = init_pipeline()

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        question = data.get("question", "")

        if not question:
            return jsonify({"error": "Missing question"}), 400

        answer = get_answer(qa_pipeline, question)
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    app.run(host=host, port=port)
