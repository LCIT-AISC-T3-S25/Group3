# 🧠 AI Model Deployment Dashboard – GCP VM Hosted

This project hosts and serves four AI models (3 NLP/CV + 1 UI frontend) using Docker containers on a GCP Compute Engine VM. A unified frontend interacts with all the model APIs.

### Dashboard For all 4 models: **https://tinyurl.com/model-dashboard**

---

## ✅ Services

| Service         | Port | URL                                    | Endpoint     | Description                            |
|-----------------|------|-----------------------------------------|--------------|----------------------------------------|
| `cnn_cv_app`    | 8001 | http://104.197.94.208:8001     | `/predict`   | CNN model for image classification     |
| `gru_nlp_app`   | 8002 | http://104.197.94.208:8002     | `/predict`   | GRU model for sentiment analysis       |
| `lstm_nlp_app`  | 8003 | http://104.197.94.208:8003     | `/predict`   | LSTM model for sentiment analysis      |
| `vgg_cv_app`    | 8004 | http://104.197.94.208:8004     | `/predict`   | VGG16 + metadata model (image + meta)  |
| `UI Dashboard`  | 3000 | http://104.197.94.208:3000     | `/`          | Next.js frontend interacting with APIs |


---

## 🔧 Setup Summary (June 25)

### 🐳 Dockerization
- Dockerized all models with individual `Dockerfile`s.
- Built unified `docker-compose.yml` with all 5 services.
- Frontend built using multi-stage Dockerfile for Next.js.
- Removed unnecessary config references (`next.config.js`).
- Added port `3000` exposure for frontend.

### 🌐 GCP Firewall Rules
- Allowed the following ports in Compute Engine → VM → "Edit":
  - ✅ `3000`
  - ✅ `8001`, `8002`, `8003`, `8004`

### ⚙️ VM Steps
```bash
# 1. SSH into VM
gcloud compute ssh <instance-name>

# 2. Go to project directory
cd ~/model-deployment-dashboard

# 3. Start all services
docker-compose up --build -d

# 4. View running containers
docker ps

# 5. View logs (e.g., frontend)
docker logs nextjs_frontend
```

## 🧪 API Testing Guide

---

### 🖼️ CNN Image Classification  
**🔗 POST** `http://104.197.94.208:8001/predict`  

**Form Data:**
- `image`: (image file, required)

**Response:**
```json
{
  "Prediction": "inside 🪑",
  "Confidence Score": "0.83"
}
```

---

### 💬 GRU Sentiment Analysis  
**🔗 POST** `http://104.197.94.208:8002/predict`  

**JSON Body:**
```json
{
  "text": "hello world, this is gru"
}
```

**Response:**
```json
{
  "predicted_class": 1,
  "prediction": "Neutral",
  "raw_scores": [
    [0.004897132050246, 0.9942702054977417, 0.0008326537208631635]
  ],
  "text": "hello world, this is gru"
}
```

---

### 💬 LSTM Sentiment Analysis  
**🔗 POST** `http://104.197.94.208:8003/predict`  

**JSON Body:**
```json
{
  "text": "Hello World, this is LSTM"
}
```

**Response:**
```json
{
  "input": "Hello World, this is LSTM",
  "probability": 0.0008197383722290397,
  "sentiment": "negative"
}
```

---

### 🖼️📊 VGG16 + Metadata Classification  
**🔗 POST** `http://104.197.94.208:8004/predict/`

**Form Data (multipart/form-data):**
- `file`: (image file, required)
- `file_size`: (float, optional)
- `modified_time`: (float, optional)

**Response:**
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

---



## 🧼 Reset & Clean Up

```
# Stop containers
docker-compose down

# Remove unused images
docker image prune -a

# Restart all
docker-compose up --build -d
```

## 🗂 Folder Structure

```ruby
model-deployment-dashboard/
├── cnn_cv_app/
├── gru_nlp_app/
├── lstm_nlp_app/
├── vgg_cv_app/
├── front-end/               # Next.js app
│   └── Dockerfile
├── docker-compose.yml
```

## 🚀 Live Application

### 🌐 Frontend Dashboard  
🔗 **[http://104.197.94.208:3000](http://104.197.94.208:3000)**  
Next.js UI to interact with all AI models.

---



