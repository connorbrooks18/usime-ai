#!/bin/bash

# Deploy React frontend to Azure Static Web Apps
echo "Deploying React frontend to Azure Static Web Apps..."

# Get the deployment token
echo "Getting deployment token..."
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name usime-frontend --resource-group usime-ai --query "properties.apiKey" -o tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo "Error: Could not get deployment token"
    exit 1
fi

echo "Deployment token obtained successfully"

# Deploy the built React app
echo "Deploying built React app..."
cd my-react-app/build

# Use curl to upload files to Static Web App
find . -type f -exec curl -X POST \
    -H "Authorization: Bearer $DEPLOYMENT_TOKEN" \
    -H "Content-Type: application/octet-stream" \
    --data-binary @{} \
    "https://usime-frontend.scm.azurestaticapps.net/api/zipdeploy" \;

echo "Frontend deployment complete!"
echo "Your frontend is available at: https://kind-wave-03b01640f.1.azurestaticapps.net" 