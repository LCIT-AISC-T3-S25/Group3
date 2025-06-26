#!/usr/bin/env python
# coding: utf-8

# In[ ]:





# In[ ]:


import os
print("Current working directory:", os.getcwd())


# In[7]:


import os

os.makedirs("model", exist_ok=True)
print(" model/ folder created in:", os.getcwd())


# In[8]:


fastapi_code = '''
from fastapi import FastAPI, UploadFile, File
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

app = FastAPI()

#  Load your trained CNN model
model = load_model("model/cnn_model_yelp.h5")

#  Preprocess image to match model input
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).resize((128, 128))  # Change if your model expects different size
    img_array = np.array(image) / 255.0
    img_array = img_array.reshape(1, 128, 128, 3)  # Ensure it matches model input shape
    return img_array

#  Define prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = preprocess_image(contents)
    prediction = model.predict(image)
    return {"prediction": prediction.tolist()}
'''

# Save the FastAPI app to main.py in your current working directory
with open("main.py", "w") as f:
    f.write(fastapi_code)

print(" main.py created successfully in:", os.getcwd())


# In[9]:


from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

# Load the model
model = load_model("model/cnn_model_yelp.h5")

# Show architecture
model.summary()

# # Optional: Try a test prediction
# img = Image.open("your_test_image.jpg").resize((128, 128))
# arr = np.array(img) / 255.0
# arr = arr.reshape(1, 128, 128, 3)

# prediction = model.predict(arr)
# print("Raw Prediction:", prediction)
# print("Predicted class index:", np.argmax(prediction))


# In[10]:


# View weights of a specific layer (example: output layer)
output_weights = model.layers[-1].get_weights()
print("Output layer weights shape:", [w.shape for w in output_weights])


# In[12]:


import json

with open("label_map.json", "w") as f:
    json.dump(label_map, f)

print("label_map.json created successfully!")

