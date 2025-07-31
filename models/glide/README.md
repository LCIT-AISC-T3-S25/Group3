# Group3 - Glide

# Model Deployment API

---

## How to Run (Locally)

1. **Install Python 3.10+ and dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

2. **Start the API server:**

    ```bash
    uvicorn app:app --host 0.0.0.0 --port 8000
    ```

3. **Test the API:**

    Open your browser or use curl/Postman:

    ```
    POST http://localhost:8000/predict
    Content-Type: application/json

    {
      "text": "Sample input text"
    }
    ```

    Example using `curl`:

    ```bash
    curl -X POST "http://localhost:8000/predict" -H "Content-Type: application/json" -d '{"text":"Hello"}'
    ```

    - The API returns a JSON with predicted class and scores.

---

## How to Run with Docker

1. **Build the Docker image:**

    ```bash
    docker build -t glide-api .
    ```

2. **Run the container:**

    ```bash
    docker run -d -p 8000:8000 --name mymodelcontainer glide-api
    ```

3. **(Optional) Mount a volume for persistent data (if needed):**

    ```bash
    docker run -d -p 8000:8000 -v %cd%/model:/app/model --name mymodelcontainer glide-api
    ```

4. **Test the API:**

    Visit or POST to:

    ```
    http://localhost:8000/predict
    ```

    - Each POST request returns the model prediction JSON.

---

## API Documentation

- **Endpoint:** `/predict`  
- **Method:** POST  
- **Description:** Takes JSON with a `"text"` field and returns the predicted class and probabilities.

- **Request JSON format:**

    ```json
    {
      "text": "Your input text here"
    }
    ```

- **Response Example:**

    ```json
    {
      "class": 1,
      "scores": [[0.05, 0.95]]
    }
    ```

---

## Deliverables Checklist

- [x] `app.py` FastAPI application  
- [x] `Dockerfile` for containerization  
- [x] `glide_model.py` for model loading and utilities  
- [x] `requirements.txt` with all dependencies  
- [x] `.dockerignore` file  
- [x] Instructions to run locally and with Docker

---

## Contact / Integration

- API developed and maintained by **Om Patel**  
- For integration, connect to the `/predict` endpoint with POST requests containing JSON text input.  
- For issues or support, please contact **your.email@example.com**

---

