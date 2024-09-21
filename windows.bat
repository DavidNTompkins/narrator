@echo off
  setlocal enabledelayedexpansion

  REM Check if Docker is installed
  where docker >nul 2>nul
  if %errorlevel% neq 0 (
      echo Docker is not installed or not in the system PATH.
      pause
      exit /b 1
  )

  REM Check if Docker is running
  docker info >nul 2>&1
  if %errorlevel% neq 0 (
      echo Docker Desktop is not running. Please start Docker and try again.
      pause
      exit /b 1
  )

  REM Check if the Docker image exists
  docker image inspect narrator_backend:latest >nul 2>&1
  if %errorlevel% neq 0 (
      echo Docker image not found. Building the images...
      docker-compose build
  )

  REM Check if .env file exists
  if not exist "narrator_backend\.env" (
      echo .env file not found. Creating one...

      echo Please provide the following information:
      set /p openrouter_key="Enter openrouter_key: "
      set /p sd_key="Enter sd_key: "
      set /p FAL_KEY_SECRET="Enter FAL_KEY_SECRET: "

      REM Write user input to .env file
      (
          echo openrouter_key=!openrouter_key!
          echo sd_key=!sd_key!
          echo FAL_KEY_SECRET=!FAL_KEY_SECRET!
      ) > "narrator_backend\.env"
  )

  REM Run docker-compose up
  echo Starting the application...
  docker-compose up

  REM After docker-compose up exits
  echo Shutting down the application...
  docker-compose down

  endlocal
  pause