# 🧠 ML Models Dashboard (Frontend)

A modern Next.js dashboard to interact with 4 deployed ML models: CNN, VGG16, GRU, and LSTM – with rich visualizations and LIME/SHAP-based interpretability.

---

## 🌐 Live Links

- **Frontend**: http://104.197.94.208:3000

**API Endpoints**:

| Model      | Endpoint                                 | Method | Input Format      |
|------------|------------------------------------------|--------|-------------------|
| CNN        | http://104.197.94.208:8001/predict       | POST   | FormData (image)  |
| VGG16      | http://104.197.94.208:8004/predict       | POST   | FormData (image + meta) |
| GRU        | http://104.197.94.208:8002/predict       | POST   | JSON (text)       |
| LSTM       | http://104.197.94.208:8003/predict       | POST   | JSON (text)       |

---

## ⚙️ Model Responses

<details>
<summary>CNN</summary>

```json
{
  "Prediction": "inside 🪑",
  "Confidence Score": "0.83"
}
```
</details>

<details>
<summary>VGG16</summary>

```json
{
  "predicted_class": "food",
  "probability": 0.8673,
  "all_probabilities": {
    "drink": 0.021,
    "food": 0.8673,
    "inside": 0.05,
    "menu": 0.03,
    "outside": 0.031
  }
}
```
</details>

<details>
<summary>GRU</summary>

```json
{
  "predicted_class": 1,
  "prediction": "Neutral",
  "raw_scores": [
    [0.0048, 0.9942, 0.0008]
  ],
  "text": "hello world, this is gru"
}
```
</details>

<details>
<summary>LSTM</summary>

```json
{
  "input": "Hello World, this is LSTM",
  "probability": 0.0008,
  "sentiment": "negative"
}
```
</details>

---

## 📁 Setup Instructions

```bash
# Take clone of the repo
git clone https://github.com/LCIT-AISC-T3-S25/Group3.git

#Change to Deployment branch
git checkout dep-assignment-1

#Take Pull
git pull

#Go in Front-End Directory
cd front-end

# Install dependencies
npm install --legacy-peer-deps

# Run locally
npm run dev
```

Then visit: `http://localhost:3000`

---

## 🛠️ Configuration

Update API endpoints inside:
```ts
const models = [
  { name: "CNN", endpoint: "http://104.197.94.208:8001/predict", type: "image" },
  { name: "GRU", endpoint: "http://104.197.94.208:8002/predict", type: "text" },
  { name: "LSTM", endpoint: "http://104.197.94.208:8003/predict", type: "text" },
  { name: "VGG", endpoint: "http://104.197.94.208:8004/predict", type: "image" }
]
```

---

## 🐳 Docker Deployment

### Build
```bash
docker build -t ml-dashboard .
```

### Run
```bash
docker run -p 3000:3000 ml-dashboard
```

Or use Docker Compose:
```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    restart: always
```

---

## 💡 Features at a Glance

- Responsive dashboard layout
- Interactive visualizations (Pie, Bar)
- LIME for GRU/LSTM (text)
- SHAP for CNN/VGG (image)
- Individual dashboards with charts + predictions
- Fully containerized with Docker

---

## 🧪 Test API Manually (Postman or cURL)

**Example (GRU):**
```bash
curl -X POST http://104.197.94.208:8002/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world"}'
```

**Example (CNN):**
```bash
curl -X POST http://104.197.94.208:8001/predict \
  -F "file=@path/to/image.jpg"
```

---

**Made with ❤️ for interactive ML model deployment**
