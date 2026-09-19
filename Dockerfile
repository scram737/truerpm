# Use official lightweight Python image
FROM python:3.11-alpine

# Set working directory
WORKDIR /app

# TrueRPM uses standard library only; no pip dependencies required
COPY . /app

# Expose server port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/index.html')" || exit 1

# Start TrueRPM intelligence server
CMD ["python", "server.py"]
