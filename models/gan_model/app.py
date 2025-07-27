import torch
from flask import Flask, jsonify
from torchvision.utils import save_image
import os, uuid
from generator import Generator

app = Flask(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
z_dim = 100  # This matches your training
generator = Generator(z_dim=z_dim).to(device)
generator.load_state_dict(torch.load("wgangp_generator.pth", map_location=device))
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
    app.run(host='0.0.0.0', port=5002)
