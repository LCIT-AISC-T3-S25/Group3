
# LSTM Sentiment Analysis API

This project provides a Dockerized Flask API to perform sentiment analysis on text using a trained LSTM model.

It classifies text as:
- Positive
- Neutral
- Negative

---

## Files Included

Ensure the following files are in the project folder:

```
.
├── app.py                         # Flask API
├── Dockerfile                     # Docker build config
├── requirements.txt               # Python dependencies
├── tuned_lstm_word2vec_model.h5   # Trained LSTM model
├── tokenizer.pkl                  # Tokenizer used during training
```

---

## How to Run the API (Using Docker)

### Step 1: Open Terminal

Open **Command Prompt / PowerShell / Windows Terminal** and navigate to the project folder:

```bash
cd path\to\project\folder
```

---

### Step 2: Build the Docker Image

```bash
docker build -t lstm-sentiment-model .
```

This creates a Docker image named `lstm-sentiment-model`.

---

### Step 3: Run the API Container

```bash
docker run -p 5000:5000 lstm-sentiment-model
```

The API will now be running on:
```
http://localhost:5000/predict
```

---

## How to Test the API (with Postman or Curl)

### Method: `POST`  
### URL:
```
http://localhost:5000/predict
```

### Headers:
```
Content-Type: application/json
```

### Body (raw JSON):
```json
{
  "text": "I love this product!"
}
```

### Sample Response:
```json
{
  "input": "I love this product!",
  "sentiment": "positive",
  "probability": 0.872
}
```

---

## Example Inputs

### Positive:
```json
{ "text": "Amazing service and great experience!" }
```

### Neutral:
```json
{ "text": "I received the item yesterday." }
```

### Negative:
```json
{ "text": "Terrible quality and poor customer support." }
```

---

## Notes

- Make sure **Docker Desktop** is running before starting.
- If needed, clean up space with:
  ```bash
  docker system prune -a
  ```

---

## Questions?

Contact the original developer or open an issue if sharing on GitHub.

---
