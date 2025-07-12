#!/bin/bash

# USIME.AI Azure Deployment Script
echo "🚀 Starting USIME.AI Azure Deployment Preparation..."

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: requirements.txt not found. Please run this script from the project root."
    exit 1
fi

# Build React App
echo "📦 Building React application..."
cd my-react-app

# Install dependencies
echo "📥 Installing React dependencies..."
npm install

# Build the app
echo "🔨 Building React app for production..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: React build failed. Please check for errors above."
    exit 1
fi

echo "✅ React app built successfully!"

# Go back to root
cd ..

# Create deployment package
echo "📋 Creating deployment package..."

# Ensure uploads directory exists
mkdir -p Backend/uploads

# Create a deployment info file
cat > deployment-info.txt << EOF
USIME.AI Deployment Package
Generated: $(date)
Version: 1.0

Files included:
- Backend/ (Python Flask application)
- my-react-app/build/ (React production build)
- requirements.txt (Python dependencies)
- web.config (Azure configuration)
- startup.txt (Azure startup command)

Environment Variables Required:
- SECRET_KEY
- AZURE_OPENAI_ENDPOINT
- AZURE_OPENAI_API_KEY
- DATABASE_URL (optional, defaults to SQLite)

Deployment Steps:
1. Upload all files to Azure Web App
2. Configure environment variables in Azure Portal
3. Set startup command: cd Backend && python server.py
4. Restart the application

For detailed instructions, see AZURE_DEPLOYMENT_GUIDE.md
EOF

echo "✅ Deployment package ready!"
echo ""
echo "📋 Next Steps:"
echo "1. Commit all changes to your repository"
echo "2. Follow the Azure Portal deployment guide"
echo "3. Configure environment variables in Azure"
echo "4. Deploy your application"
echo ""
echo "📖 See AZURE_DEPLOYMENT_GUIDE.md for detailed instructions" 