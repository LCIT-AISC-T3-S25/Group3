FROM python:3.10.13-slim

WORKDIR /app

COPY . .

ENV PIP_DEFAULT_TIMEOUT=100

RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.org/simple

EXPOSE 8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
