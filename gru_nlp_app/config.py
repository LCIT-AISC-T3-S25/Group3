import os

APP_HOST = os.environ.get("APP_HOST", "0.0.0.0")
APP_PORT = int(os.environ.get("APP_PORT", 5001))
MODEL_PATH = os.environ.get("MODEL_PATH", "gru_model.keras")
