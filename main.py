from fastapi import FastAPI, File, UploadFile, Form
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.vgg16 import preprocess_input
from PIL import Image
import numpy as np
import io

app = FastAPI()
model = None  # DO NOT load at startup!

def get_model():
    global model
    if model is None:
        model = load_model("vgg16_meta_model.h5")
    return model

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    file_size: float = Form(...),
    modified_time: float = Form(...)
):
    img = Image.open(io.BytesIO(await file.read()))
    img = img.resize((224, 224))
    img = np.array(img)
    if img.shape[-1] == 4:
        img = img[..., :3]
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    meta = np.array([[file_size, modified_time]], dtype='float32')
    model = get_model()  # Model loads here, only when first called!
    pred = model.predict([img, meta])
    predicted_class = int(np.argmax(pred, axis=1)[0])
    probability = float(np.max(pred))
    return {"predicted_class": predicted_class, "probability": probability}
