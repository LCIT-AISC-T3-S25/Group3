print("=== Starting FastAPI app ===")

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware  # ✅ Add this
print("=== Imported FastAPI ===")
from tensorflow.keras.models import load_model
print("=== Imported load_model ===")
import numpy as np
from PIL import Image
import io

class_names = ['drink', 'food', 'inside', 'menu', 'outside']

print("=== About to load model ===")
model = load_model("vgg16_meta_model.h5")
print("=== Model loaded! ===")

app = FastAPI()

# ✅ Enable CORS for all domains and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "VGG16 meta model loaded successfully!"}

@app.post("/predict/")
async def predict_image(
    file: UploadFile = File(...),
    file_size: float = Form(None),
    modified_time: float = Form(None)
):
    print("=== Received prediction request ===")
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    from tensorflow.keras.applications.vgg16 import preprocess_input
    img_array = preprocess_input(img_array)

    # Provide dummy metadata if missing
    if file_size is None or modified_time is None:
        meta_array = np.array([[0.0, 0.0]], dtype=np.float32)
    else:
        meta_array = np.array([[file_size, modified_time]], dtype=np.float32)

    preds = model.predict([img_array, meta_array])
    probs = preds[0]
    top_idx = np.argmax(probs)
    top_label = class_names[top_idx]
    top_prob = float(probs[top_idx])

    print(f"Predicted: {top_label} (prob {top_prob:.4f})")

    return {
        "predicted_class": top_label,
        "probability": top_prob,
        "all_probabilities": {class_names[i]: float(probs[i]) for i in range(len(class_names))}
    }
