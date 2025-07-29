#!/bin/bash
# Build image
docker build -t habitarium-app .

# Authenticate to registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Tag and push
docker tag habitarium-app us-central1-docker.pkg.dev/habitarium-466912/habitarium-repo/habitarium:latest
docker push us-central1-docker.pkg.dev/habitarium-466912/habitarium-repo/habitarium:latest

# Manual deploy to Cloud Run
gcloud run deploy habitarium-app \
  --image us-central1-docker.pkg.dev/habitarium-466912/habitarium-repo/habitarium:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars \
     PORT=8080,\
     FIREBASE_PROJECT_ID=your-project-id,\
     FIREBASE_CLIENT_EMAIL=your-email,\
     FIREBASE_DATABASE_URL=https://habitarium-d1aab-default-rtdb.firebaseio.com