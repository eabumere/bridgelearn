#!/bin/bash
# ==============================
# BridgeLearn Dev Environment Reset Script
# Run => chmod +x reset-dev.sh
# Run => ./reset-dev.sh
# ==============================

set -e

echo "🧹 Stopping and removing containers, networks, and volumes..."
sudo docker compose down -v --remove-orphans || true

echo "🧽 Cleaning up dangling images and volumes..."
sudo docker system prune -f
sudo docker volume prune -f

echo "🔨 Rebuilding containers from scratch..."
sudo docker compose build --no-cache

echo "🚀 Starting up all services..."
sudo docker compose up -d

echo "🩺 Checking service health..."
sudo docker ps

echo "📜 Tailing frontend logs..."
sudo docker compose logs -f frontend
