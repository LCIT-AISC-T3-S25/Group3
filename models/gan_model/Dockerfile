# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all files from your gan_model folder
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5002 (Flask API)
EXPOSE 5002

# Command to run your app
CMD ["python", "app.py"]
