# Azure Web App Deployment Guide for USIME.AI

## Prerequisites
- Azure subscription
- GitHub repository with your code (recommended)
- Azure OpenAI Service configured (for AI features)

## Step 1: Prepare Your Repository

### 1.1 Build the React App
```bash
cd my-react-app
npm install
npm run build
```

### 1.2 Ensure All Files Are Committed
Make sure your repository includes:
- `Backend/` directory with all Python files
- `my-react-app/build/` directory (after building)
- `requirements.txt`
- `web.config`
- `startup.txt`

## Step 2: Create Azure Web App

### Option A: Using Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App" and select it
4. Fill in the basics:
   - **Resource Group**: Create new or use existing
   - **Name**: `usime-ai` (or your preferred name)
   - **Publish**: Code
   - **Runtime stack**: Python 3.9 (or higher)
   - **Operating System**: Linux
   - **Region**: Choose closest to your users
5. Click "Review + create" then "Create"

### Option B: Using Azure CLI
```bash
# Login to Azure
az login

# Create resource group
az group create --name usime-ai-rg --location eastus

# Create web app
az webapp create \
  --resource-group usime-ai-rg \
  --plan usime-ai-plan \
  --name usime-ai \
  --runtime "PYTHON|3.9"
```

## Step 3: Configure Environment Variables

In Azure Portal:
1. Go to your Web App
2. Navigate to "Settings" → "Configuration"
3. Add these Application settings:

| Name | Value |
|------|-------|
| `AZURE_OPENAI_ENDPOINT` | `https://mr-summarizer2.openai.azure.com/` |
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI API key |
| `SECRET_KEY` | Generate a random string (32+ characters) |
| `PORT` | `8000` |

## Step 4: Configure Startup Command

1. In your Web App, go to "Settings" → "General settings"
2. Set "Startup Command" to: `./startup.sh`

## Step 5: Deploy Your Code

### Option A: Using Azure CLI
```bash
# Deploy from your project directory
az webapp up --name usime-ai --resource-group usime-ai-rg
```

### Option B: Using GitHub Actions
1. Push your code to GitHub
2. In Azure Portal, go to "Deployment Center"
3. Choose "GitHub" as source
4. Connect your repository
5. Azure will automatically deploy on commits

### Option C: Using VS Code
1. Install Azure App Service extension
2. Right-click your project folder
3. Select "Deploy to Web App"

## Step 6: Test Your Application

Once deployed, your app will be available at:
`https://your-app-name.azurewebsites.net`

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are in `requirements.txt`
2. **Environment variables not working**: Restart the web app after adding them
3. **Static files not serving**: Ensure React build files are in `Backend/static/`
4. **Database issues**: The app uses SQLite by default, which works for basic deployments

### Logs:
- View logs in Azure Portal: "Monitoring" → "Log stream"
- Or use Azure CLI: `az webapp log tail --name usime-ai --resource-group usime-ai-rg`

## Scaling Considerations

For production use, consider:
- Using Azure Database for PostgreSQL instead of SQLite
- Setting up Azure CDN for static files
- Configuring custom domain and SSL
- Setting up monitoring and alerts

## Cost Optimization

- Use Basic or Standard tier for development
- Consider App Service Plan sharing for multiple apps
- Monitor usage in Azure Cost Management

## Security Best Practices

- Use Azure Key Vault for sensitive environment variables
- Enable HTTPS only
- Configure IP restrictions if needed
- Regular security updates

---

Your USIME.AI application is now ready for Azure deployment! 🚀 