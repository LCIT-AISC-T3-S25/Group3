# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files
COPY requirements.txt .
COPY app.py .
COPY config.py .
COPY causal_transformer_model.keras .
COPY tokenizer.pkl .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5001

# Run using gunicorn
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5001", "app:app"]
