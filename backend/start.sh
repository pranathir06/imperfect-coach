#!/bin/bash

# Start the FastAPI backend server
echo "🚀 Starting backend server..."
cd "$(dirname "$0")"
uvicorn main:app --reload --port 8000
