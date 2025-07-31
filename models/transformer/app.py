import os
import json
import pickle
import numpy as np
from flask import Flask, request, jsonify
import keras
from keras.models import load_model
from keras.utils import pad_sequences
from keras import layers
from keras import saving
import tensorflow as tf
import config
import traceback

# =======================
# Custom Layer
# =======================
@saving.register_keras_serializable()
class PositionalEmbedding(layers.Layer):
    def __init__(self, max_len=128, d_model=256, **kwargs):
        super().__init__(**kwargs)
        self.max_len = max_len
        self.d_model = d_model
        # Create the embedding weights immediately (must match training definition)
        self.pos_embedding = self.add_weight(
            name="pos_embedding",
            shape=(1, self.max_len, self.d_model),
            dtype=tf.float32,
            initializer="uniform",
            trainable=True,
        )

    def call(self, inputs):
        seq_len = tf.shape(inputs)[1]
        return inputs + self.pos_embedding[:, :seq_len, :]

    def get_config(self):
        config = super().get_config()
        config.update({
            "max_len": self.max_len,
            "d_model": self.d_model
        })
        return config


# =======================
# Paths
# =======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKENIZER_PATH = os.path.join(BASE_DIR, "tokenizer.pkl")
MODEL_PATH = os.path.join(BASE_DIR, config.MODEL_PATH)

print(f"Current directory: {BASE_DIR}")
print(f"Tokenizer path: {TOKENIZER_PATH}")
print(f"Model path: {MODEL_PATH}")

# =======================
# Load model and tokenizer
# =======================
model = load_model(
    MODEL_PATH,
    custom_objects={"PositionalEmbedding": PositionalEmbedding},
    compile=False
)

tokenizer = None
if os.path.exists(TOKENIZER_PATH):
    with open(TOKENIZER_PATH, "rb") as handle:
        tokenizer = pickle.load(handle)
    print(f"Tokenizer loaded from {TOKENIZER_PATH}")
else:
    print(f"WARNING: Tokenizer not found at {TOKENIZER_PATH}")

# =======================
# Flask app
# =======================
app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return {
        "message": "API is running",
        "expected_input_shape": str(model.input_shape),
        "tokenizer_loaded": bool(tokenizer)
    }

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print(f"Received data: {data}")

        if "text" in data:
            if not tokenizer:
                return jsonify({"error": "Tokenizer not available"}), 400
            seq = tokenizer.texts_to_sequences([data["text"]])
            padded = pad_sequences(seq, maxlen=128, padding="post")
            input_data = padded
        elif "input" in data:
            input_data = np.array(data["input"])
        else:
            return jsonify({"error": "Provide 'text' or 'input' key"}), 400

        if len(input_data.shape) == 1:
            input_data = np.expand_dims(input_data, axis=0)

        preds = model.predict(input_data)
        return jsonify({
            "prediction": preds.tolist(),
            "processed_shape": input_data.shape
        })

    except Exception as e:
        error_text = traceback.format_exc()
        print(f"ERROR: {error_text}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host=config.HOST, port=config.PORT)
