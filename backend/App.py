from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi.responses import JSONResponse, Response

app = FastAPI(title="Unified AI Backend")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Unified AI backend is running."}

# ---------------- GAN ----------------
@app.get("/gan/generate")
def gan_generate():
    try:
        response = requests.get("http://gan_model:5002/generate")
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# ---------------- GLIDE ----------------
@app.post("/glide/generate")
async def glide_generate(request: Request):
    try:
        body = await request.json()
        response = requests.post("http://glide_model:8000/generate", json=body)
        return Response(content=response.content, media_type=response.headers.get("content-type"))
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# ---------------- RAG ----------------
@app.post("/rag/chat")
async def rag_chat(request: Request):
    try:
        body = await request.json()
        response = requests.post("http://rag_model:5000/chat", json=body)
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
