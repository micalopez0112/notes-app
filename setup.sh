#!/bin/bash

# Exit on error
set -e

echo "Setting up backend..."

# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Set up the database schema
npx sequelize-cli db:migrate

# Start the backend server
npm start &

# Sleep for a moment to allow the backend to start before moving to the frontend setup
sleep 5

echo "Setting up frontend..."

# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Start the frontend server
npm start

echo "Setup completed successfully."
