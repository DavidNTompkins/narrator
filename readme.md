# Open Source Playnarrator

Welcome to the open-source version of [playnarrator.com](https://playnarrator.com), an AI-powered RPG created by David Tompkins. This repository contains the code for running Playnarrator locally using Docker, with a React frontend and Node.js backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Getting API Keys](#getting-api-keys)
4. [Running the Application](#running-the-application)
5. [Stopping the Application](#stopping-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/downloads) (optional, for cloning the repository)

## Installation

1. Clone this repository or download it as a ZIP file and extract it.

```
git clone https://github.com/DavidNTompkins/narrator.git
cd narrator
```

2. If you haven't installed Docker yet, follow these steps:

   - For Windows and Mac:
     - Download Docker Desktop from the [official Docker website](https://www.docker.com/products/docker-desktop)
     - Follow the installation wizard to install Docker Desktop
     - After installation, start Docker Desktop

   - For Linux:
     - Follow the instructions for your specific Linux distribution on the [official Docker documentation](https://docs.docker.com/engine/install/)

3. Verify Docker installation by opening a terminal or command prompt and running:

```
docker --version
```

If you see a version number, Docker is installed correctly.

## Getting API Keys

You'll need API keys for OpenRouter, Stability AI, and FAL AI. Here's how to obtain them:

1. OpenRouter API Key:
   - Go to [OpenRouter](https://openrouter.ai/)
   - Sign up for an account
   - Navigate to your dashboard and find your API key

2. Stability AI API Key:
   - Visit [Stability AI](https://beta.dreamstudio.ai/generate)
   - Create an account or log in
   - Go to your account settings to find your API key

3. FAL AI API Key:
   - Go to [FAL AI](https://www.fal.ai/)
   - Sign up for an account
   - In your account dashboard, locate your API key

Keep these API keys handy; you'll need them when running the application.

## Running the Application

1. For Windows users:
   - Double-click the `windows.bat` file in the root directory of the project

2. For Mac and Linux users:
   - Open a terminal in the root directory of the project
   - Run the following command:
     ```
     chmod +x mac_and_linux.sh
     ./mac_and_linux.sh
     ```

3. If this is your first time running the application, you'll be prompted to enter your API keys. The script will create a `.env` file with these keys.

4. The script will build the Docker images (if necessary) and start the application.

5. Once the application is running, you can access the frontend by opening a web browser and navigating to:
   ```
   http://localhost:3003
   ```

## Stopping the Application

To stop the application:

1. If you're running it in a terminal window, press `Ctrl+C`
2. The script will automatically run `docker-compose down` to stop and remove the containers

## Troubleshooting

If you encounter any issues:

1. Ensure Docker is running before starting the application
2. Check that you've entered the correct API keys
3. If you modify the code, rebuild the Docker images by running:
   ```
   docker-compose build
   ```
4. For Windows users, make sure you're running the `.bat` file as an administrator
5. For Mac/Linux users, ensure the `.sh` file has execute permissions

## Contributing

We welcome contributions to the Open Source Playnarrator! If you'd like to contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with a clear message
4. Push your changes to your fork
5. Create a pull request to the main repository

Please ensure your code adheres to the existing style and includes appropriate tests.

## License
This project is released under the Unlicense. This means you can do whatever you want with this code - use it, modify it, distribute it, or even sell it. There are no restrictions whatsoever. It's all yours!
Here's a summary of what this means:

You can use this code for any purpose, including commercial applications.
You don't need to provide attribution or include any license notice.
You can modify the code and distribute your modifications.
You can sublicense the code under any license you choose.


## Contact

For any additional questions or support, please open an issue in this repository or contact David Tompkins through his website: [david.tompkins.computer](https://david.tompkins.computer)

---

Thanks for playing!