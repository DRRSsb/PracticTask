FROM python:3.11 AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade -r requirements.txt

COPY . .

EXPOSE 8000

RUN mkdir static/images

CMD uvicorn app:app --reload --host 0.0.0.0 --port 8000
