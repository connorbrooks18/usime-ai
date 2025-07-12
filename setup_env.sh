#!/bin/bash

echo "🔧 USIME.AI Environment Setup"
echo "=============================="
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
    echo "Current environment variables:"
    grep -E "(AZURE_OPENAI|SECRET_KEY)" .env 2>/dev/null || echo "No Azure OpenAI variables found"
    echo ""
    read -p "Do you want to update the environment variables? (y/n): " update_env
    if [ "$update_env" != "y" ]; then
        echo "Environment setup skipped."
        exit 0
    fi
fi

echo "📋 Setting up Azure OpenAI credentials..."
echo ""

# Get Azure OpenAI Endpoint
read -p "Enter your Azure OpenAI Endpoint (e.g., https://your-resource.openai.azure.com/): " endpoint

# Get Azure OpenAI API Key
read -s -p "Enter your Azure OpenAI API Key: " api_key
echo ""

# Generate a secret key
secret_key=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

# Create .env file
cat > .env << EOF
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=$endpoint
AZURE_OPENAI_API_KEY=$api_key

# Flask Configuration
SECRET_KEY=$secret_key

# Database Configuration (optional - defaults to SQLite)
# DATABASE_URL=postgresql://username:password@host:port/database
EOF

echo ""
echo "✅ Environment variables set successfully!"
echo "📁 Created .env file with your credentials"
echo ""
echo "🔒 Security Note: The .env file contains sensitive information."
echo "   Make sure it's in your .gitignore file and never commit it to version control."
echo ""

# Check if .gitignore includes .env
if grep -q "\.env" .gitignore 2>/dev/null; then
    echo "✅ .env is already in .gitignore"
else
    echo "⚠️  Warning: .env is not in .gitignore"
    echo "   Adding .env to .gitignore..."
    echo ".env" >> .gitignore
    echo "✅ Added .env to .gitignore"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Restart your Flask server to load the new environment variables"
echo "2. Test the AI features in your application"
echo "3. For production deployment, set these variables in your hosting platform" 