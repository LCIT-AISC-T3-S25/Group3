import os

APP_HOST = os.environ.get("APP_HOST", "0.0.0.0")
APP_PORT = int(os.environ.get("APP_PORT", 5004))
MODEL_PATH = os.environ.get("MODEL_PATH", "model/cnn_model_yelp.h5")
