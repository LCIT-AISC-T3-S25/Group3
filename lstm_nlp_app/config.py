import os

APP_HOST = os.environ.get("APP_HOST", "0.0.0.0")
APP_PORT = int(os.environ.get("APP_PORT", 5000))
MODEL_PATH = os.environ.get("MODEL_PATH", "tuned_lstm_word2vec_model.h5")
