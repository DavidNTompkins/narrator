# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Build the app
RUN npm run build

# Install a simple server for serving static content
RUN npm install -g serve

# Copy serve configuration
COPY serve.json .

# Expose the port the app runs on
EXPOSE 3003

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "3003"]