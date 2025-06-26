from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
from config import APP_HOST, APP_PORT

# Load tokenizer
with open('tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Load model
model = load_model('gru_model.keras')

# Sentiment mapping
sentiment_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}

# Flask setup
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

@app.route('/')
def home():
    return 'GRU Sentiment Model is ready! Send POST request to /predict'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Input validation
    if not data or 'text' not in data:
        return jsonify({'error': 'Please provide input text under the "text" key'}), 400

    text = data['text']

    # Preprocess
    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=100)

    # Predict
    prediction = model.predict(padded)
    sentiment = np.argmax(prediction)

    return jsonify({
        'text': text,
        'predicted_class': int(sentiment),
        'prediction': sentiment_map[sentiment],
        'raw_scores': prediction.tolist()
    })

if __name__ == '__main__':
    app.run(host=APP_HOST, port=APP_PORT, debug=True)

