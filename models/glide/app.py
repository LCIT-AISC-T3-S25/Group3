from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import FileResponse
import uuid
import os

from glide_model import generate_image

app = FastAPI()

class CaptionInput(BaseModel):
    caption: str    # This line must be indented inside the class

@app.get("/")
def root():
    return {"message": "GLIDE model API is running"}

@app.post("/generate")
def generate(caption: CaptionInput):
    filename = f"img_{uuid.uuid4().hex[:8]}.png"
    output_path = os.path.join("outputs", filename)

    try:
        generate_image(caption.caption, output_path)
        return FileResponse(output_path, media_type="image/png", filename=filename)
    except Exception as e:
        return {"error": str(e)}
