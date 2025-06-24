from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

# Load tokenizer
with open('tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Load model
model = load_model('gru_model.keras')

# Flask setup
app = Flask(__name__)

@app.route('/')
def home():
    return 'GRU Sentiment Model is ready! Send POST to /predict'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data['text']

    # Preprocess
    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=100)

    # Predict
    prediction = model.predict(padded)
    sentiment = np.argmax(prediction)

    sentiment_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}

    return jsonify({
        'text': text,
        'prediction': sentiment_map[sentiment],
        'raw_scores': prediction.tolist()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)