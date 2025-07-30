import torch
from flask import Flask, jsonify
from torchvision.utils import save_image
import os, uuid
from generator import Generator
from dotenv import load_dotenv

load_dotenv()

# Load config from .env
APP_HOST = os.getenv("APP_HOST")
APP_PORT = int(os.getenv("APP_PORT"))
GENERATOR_PATH = os.getenv("GENERATOR_PATH")
DEVICE_TYPE = os.getenv("DEVICE", "cpu")

app = Flask(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
z_dim = 100  # This matches your training
generator = Generator(z_dim=z_dim).to(device)
generator.load_state_dict(torch.load(GENERATOR_PATH, map_location=device))
generator.eval()

@app.route('/generate', methods=['GET'])
def generate_image():
    z = torch.randn(1, z_dim).to(device)
    with torch.no_grad():
        fake_img = generator(z)
    os.makedirs("outputs", exist_ok=True)
    filename = f"outputs/generated_{uuid.uuid4().hex[:8]}.png"
    save_image(fake_img, filename, normalize=True)
    return jsonify({"status": "success", "file": filename})

if __name__ == '__main__':
    app.run(host=APP_HOST, port=APP_PORT)
