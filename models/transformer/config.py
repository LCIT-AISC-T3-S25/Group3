# config.py
import os

# Default configuration
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", 5001))
MODEL_PATH = os.environ.get("MODEL_PATH", "causal_transformer_model.keras")
