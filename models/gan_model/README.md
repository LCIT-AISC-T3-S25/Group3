
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

## Creating and running venv for Gan Model

- python -m venv gan_venv # creating venv for gan_model
- source gan_venv/Script/activate
(gan_venv)

## Creating .env (for removing hardcoding)
- nano .env

## Creating .gitignore
- adding .env, .gitignore, and gan_venv inside .gitignore file

## Updating app.py model file replacing hard coded parameters loading config from .env
load_dotenv()
## Load config from .env
APP_HOST = os.getenv("APP_HOST")
APP_PORT = int(os.getenv("APP_PORT"))
GENERATOR_PATH = os.getenv("GENERATOR_PATH")
DEVICE_TYPE = os.getenv("DEVICE", "cpu")

APP_HOST=0.0.0.0
APP_PORT=5002
DEVICE=cpu
GENERATOR_PATH=wgangp_generator.pth
CRITIC_PATH=wgan_gp_critic.pth

	