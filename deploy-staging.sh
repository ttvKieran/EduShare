#!/bin/bash

set -e 

echo "Deploying EduShare to STAGING"

# Variables từ GitLab CI/CD
REGISTRY_IMAGE="${CI_REGISTRY_IMAGE}"
IMAGE_TAG="${CI_COMMIT_TAG}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/edushare}"

# Tạo thư mục deploy
mkdir -p "${DEPLOY_PATH}"
cd "${DEPLOY_PATH}"

# Tạo file .env từ variables
echo "Creating .env file..."
cat > .env << EOF
# ApplicationC
NODE_ENV=production
APP_PORT=${APP_PORT:-8081}

# MongoDB
MONGO_USER=${MONGO_USER:-admin}
MONGO_PASSWORD=${MONGO_PASSWORD}
MONGO_DATABASE=${MONGO_DATABASE:-edushare}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_HOST=${MONGO_HOST}
MONGO_URL=${MONGO_URL}

# Redis
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_HOST=${REDIS_HOST}

# Cloudinary
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# JWT
SALT_ROUNDS=${SALT_ROUNDS}
ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
ACCESS_TOKEN_LIFE=${ACCESS_TOKEN_LIFE}
REFRESH_TOKEN_LIFE=${REFRESH_TOKEN_LIFE}

# MinIO
MINIO_ROOT_USER=${MINIO_ROOT_USER:-minioadmin}
MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
MINIO_PORT=${MINIO_PORT:-9000}
MINIO_CONSOLE_PORT=${MINIO_CONSOLE_PORT:-9001}

# Docker Image
REGISTRY_IMAGE=${REGISTRY_IMAGE}
IMAGE_TAG=${IMAGE_TAG}
EOF

echo ".env file created"

# Login vào GitLab Container Registry
echo "${CI_REGISTRY_PASSWORD}" | docker login -u "${CI_REGISTRY_USER}" --password-stdin "${CI_REGISTRY}"

docker pull "${REGISTRY_IMAGE}:${IMAGE_TAG}"
docker compose -f docker-compose.staging.yml down || true
docker compose -f docker-compose.staging.yml up -d

sleep 10

echo "Container status:"
docker compose -f docker-compose.staging.yml ps

echo "Recent logs:"
docker compose -f docker-compose.staging.yml logs --tail=20 app

echo "Health check..."
if docker compose -f docker-compose.staging.yml ps | grep -q "Up"; then
    echo "Services URLs:"
    echo "   - Application: http://$(hostname):${APP_PORT:-8081}"
    echo "   - MinIO Console: http://$(hostname):${MINIO_CONSOLE_PORT:-9001}"
    echo "   - MongoDB: mongodb://$(hostname):${MONGO_PORT:-27017}"
    echo "   - Redis: redis://$(hostname):${REDIS_PORT:-6379}"
else
    echo "Deployment failed! Check logs:"
    docker compose -f docker-compose.staging.yml logs app
    exit 1
fi