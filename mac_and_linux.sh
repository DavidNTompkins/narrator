#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Function to create .env file
create_env_file() {
    echo "Creating .env file..."
    echo "Please enter your API keys:"
    read -p "OpenRouter Key: " openrouter_key
    read -p "SD Key: " sd_key
    read -p "FAL Key Secret: " fal_key_secret

    cat > ./narrator_backend/.env << EOF
openrouter_key=$openrouter_key
sd_key=$sd_key
FAL_KEY_SECRET=$fal_key_secret
PORT=3000
local_listen=local
NODE_DEBUG=http,https
EOF
}

# Check if the Docker images exist
if ! docker image inspect narrator_frontend:latest &> /dev/null || ! docker image inspect narrator_backend:latest &> /dev/null; then
    echo "One or more Docker images are missing. Building images..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ./narrator_backend/.env ]; then
        create_env_file
    else
        echo "Using existing .env file."
    fi

    # Build the Docker images
    docker-compose build
else
    echo "Docker images already exist. Skipping build."

    # Check if .env file exists, create if it doesn't
    if [ ! -f ./narrator_backend/.env ]; then
        create_env_file
    else
        echo "Using existing .env file."
    fi
fi

# Start the Docker containers
echo "Starting the application..."
echo "The application will run until you press Ctrl+C or close this window."
echo "Access the frontend at: http://localhost:3003"

# Run docker-compose up without the -d flag to keep it in the foreground
docker-compose up

# This part will execute when the user terminates the script (Ctrl+C or closing the window)
echo "Shutting down the application..."
docker-compose down

echo "Application has been shut down."