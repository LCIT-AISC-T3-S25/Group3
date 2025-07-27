
---

## How to Run (Locally)

1. **Install Python 3.10+ and dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

2. **Start the API server:**

    ```bash
    python app.py
    ```

3. **Generate a test image:**

    Open your browser or use curl/Postman:

    ```
    http://localhost:5002/generate
    ```

    - The API returns the file path of the generated PNG (saved in `outputs/`).

---

## How to Run with Docker

1. **Build the Docker image:**

    ```bash
    docker build -t gan-app .
    ```

2. **Run the container:**

    ```bash
    docker run -p 5002:5002 gan-app
    ```

    - (Optional) To save images directly to your PC, use:

      ```bash
      docker run -p 5002:5002 -v %cd%/outputs:/app/outputs gan-app
      ```

3. **Test the API:**

    Visit [http://localhost:5002/generate](http://localhost:5002/generate)  
    Each call generates a new image in the `outputs/` folder.

---

## API Documentation

- **Endpoint:** `/generate`
- **Method:** GET
- **Description:** Generates a new 64x64 RGB image using the WGAN-GP model and saves it in `outputs/`.
- **Response Example:**
    ```json
    {
      "status": "success",
      "file": "outputs/generated_xxxxxxxx.png"
    }
    ```

---

## Deliverables Checklist

- [x] `gan_model/` folder with all code and weights
- [x] Dockerfile for containerization
- [x] requirements.txt with compatible versions
- [x] Flask API with `/generate` endpoint
- [x] Generator class (`generator.py`)
- [x] Sample images in `outputs/` (test images)

---

## Contact / Integration

- API developed and maintained by **Advait Pandit**
- For UI integration, connect to `/generate` (returns a PNG file path)
- For any issues, please check requirements or contact Advait

---
