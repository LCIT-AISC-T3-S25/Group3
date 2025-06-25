from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import io

app = FastAPI(
    title="Image Classifier",
    description="""
    Welcome to the stylish image classifier!  
    Upload a photo and the app will tell you if it's:
    - Food  
    - Drink  
    - Menu  
    - Inside  
    - Outside  
    """,
    version="1.0"
)

# ✅ CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # Allow all domains
    allow_credentials=True,
    allow_methods=["*"],         # Allow all HTTP methods
    allow_headers=["*"],         # Allow all headers
)

# Load the trained CNN model
model = tf.keras.models.load_model("model/cnn_model_yelp.h5")

# Label mapping
label_map = {
    0: "inside 🪑",
    1: "food 🍕",
    2: "outside 🌇",
    3: "drink 🥤",
    4: "menu 📄"
}

# ✅ Home Route (custom welcome message)
@app.get("/")
def read_root():
    return {
        "message": "Your Stylish CNN Image Classifier is running!",
        "hint": "Visit /docs to use the visual interface and test image prediction."
    }

# ✅ Optional redirect to Swagger UI
@app.get("/redirect")
def redirect_to_docs():
    return RedirectResponse(url="/docs")

# ✅ Prediction Route
@app.post("/predict", tags=["Predict"])
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((128, 128))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        prediction = model.predict(image_array)
        predicted_class = label_map[np.argmax(prediction)]
        confidence = float(np.max(prediction))

        return JSONResponse(content={
            "Prediction": predicted_class,
            "Confidence Score": f"{confidence:.2f}"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
