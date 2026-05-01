FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Create a non-root user
RUN useradd -m -u 1000 user
WORKDIR /home/user/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# Note: We copy the requirements from the backend folder
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the entire backend folder content into the app directory
COPY backend/ .

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Command to run the application
# We run from the app directory where main.py is located
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
