#!/bin/bash

# Deploy Frontend to Azure Static Web Apps
echo "🚀 Starting frontend deployment to Azure Static Web Apps..."

# Navigate to the React app directory
cd my-react-app

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the React app
echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed! build directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

# Get the resource group name (you can modify this or set as environment variable)
RESOURCE_GROUP=${RESOURCE_GROUP:-"usime-ai-rg"}
STATIC_WEB_APP_NAME=${STATIC_WEB_APP_NAME:-"usime-ai-frontend"}

echo "📋 Using resource group: $RESOURCE_GROUP"
echo "📋 Using static web app name: $STATIC_WEB_APP_NAME"

# Check if the static web app exists
if ! az staticwebapp show --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "❌ Static web app '$STATIC_WEB_APP_NAME' not found in resource group '$RESOURCE_GROUP'"
    echo "   Please create it first or check the name and resource group."
    exit 1
fi

# Deploy to Azure Static Web Apps
echo "🌐 Deploying to Azure Static Web Apps..."
az staticwebapp create --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --source . --location "East US" --branch main --app-location "/" --api-location "" --output-location "build"

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your app should be available at: https://$STATIC_WEB_APP_NAME.azurestaticapps.net"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 Frontend deployment complete!" 