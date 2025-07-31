FROM python:3.10-slim

WORKDIR /app

# Optional: Install git (if needed)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# ✅ Direct copy by absolute path — this avoids missing file issues
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the app
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
