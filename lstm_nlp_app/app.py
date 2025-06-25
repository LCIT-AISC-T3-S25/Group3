from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

# ✅ Define app and enable CORS
app = Flask(__name__)
CORS(app)  # ✅ Allow CORS for all routes and origins

# Load trained model
model = load_model("tuned_lstm_word2vec_model.h5")

# Load tokenizer
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

# Configuration
MAX_LEN = 100
labels = ['negative', 'neutral', 'positive']

# Root route for browser check
@app.route("/", methods=["GET"])
def home():
    return "LSTM Sentiment Model is ready! Send POST to /predict"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid or missing JSON in request"}), 400

        text = data.get("text", "")
        if not text:
            return jsonify({"error": "Missing 'text' field"}), 400

        seq = tokenizer.texts_to_sequences([text])
        if not seq or not seq[0]:
            return jsonify({"error": "Input text could not be tokenized"}), 400

        padded = pad_sequences(seq, maxlen=MAX_LEN)
        probs = model.predict(padded)[0]

        if probs[0] > 0.6:
            sentiment = "positive"
        elif probs[0] < 0.4:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        return jsonify({
            "input": text,
            "sentiment": sentiment,
            "probability": float(probs[0])
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
