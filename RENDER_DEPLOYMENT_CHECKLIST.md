# USIME AI - Render.com Deployment Checklist

## Pre-Deployment Checklist

### 1. Code Preparation
- [x] Updated Flask server to serve React build from `static_folder`
- [x] Removed CORS dependency (no longer needed for single-origin)
- [x] Updated all API endpoints to use `/api/` prefix
- [x] Updated React frontend to use relative URLs (no hardcoded localhost)
- [x] Created production build scripts
- [x] Added gunicorn to requirements.txt
- [x] Added psycopg2-binary for PostgreSQL support

### 2. Environment Configuration
- [x] Flask configured to use environment variables
- [x] Production-ready server configuration
- [x] Database initialization script ready
- [x] Upload directory handling

### 3. Build Process
- [x] React app builds successfully (`npm run build`)
- [x] Flask server serves React build correctly
- [x] All API endpoints work with new URLs
- [x] Authentication flow works with relative URLs

## Render.com Setup

### 1. Service Configuration
```
Name: usime-ai
Environment: Python 3
Build Command: ./render-deploy.sh
Start Command: cd Backend && gunicorn --bind 0.0.0.0:$PORT server:app
```

### 2. Environment Variables
Add these in Render dashboard:
```
SECRET_KEY=your-secret-key-here-make-it-long-and-random
DATABASE_URL=postgresql://user:password@host:port/database
AZURE_OPENAI_ENDPOINT=https://your-service.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
FLASK_ENV=production
```

### 3. Database Setup
1. Create PostgreSQL database in Render
2. Copy connection string to DATABASE_URL
3. Database will be initialized automatically on first run

## Deployment Steps

### Step 1: Push to Repository
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Web Service
1. Go to Render dashboard
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure as shown above

### Step 3: Set Environment Variables
- Add all required environment variables
- Ensure DATABASE_URL points to your PostgreSQL database
- Set strong SECRET_KEY

### Step 4: Deploy
- Click "Create Web Service"
- Monitor build logs
- Wait for deployment to complete

## Post-Deployment Testing

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Document upload works
- [ ] Document history displays
- [ ] Document deletion works
- [ ] Mobile responsiveness

### 2. API Endpoints
- [ ] POST /api/register
- [ ] POST /api/login
- [ ] POST /api/logout
- [ ] GET /api/check-auth
- [ ] POST /api/upload
- [ ] GET /api/documents
- [ ] GET /api/documents/:id
- [ ] DELETE /api/documents/:id

### 3. Error Handling
- [ ] Proper error messages for invalid uploads
- [ ] Authentication redirects work
- [ ] 404 handling for non-existent documents
- [ ] Network error handling

## Common Issues & Solutions

### Build Fails
- Check that Node.js is available in build environment
- Ensure all dependencies are in requirements.txt
- Verify render-deploy.sh has correct permissions

### Database Connection Issues
- Ensure DATABASE_URL is correctly formatted
- Check PostgreSQL database is running
- Verify credentials and connection string

### OpenAI API Issues
- Check environment variables are set
- Verify Azure OpenAI service is active
- Test API key separately

### Static Files Not Loading
- Ensure React build completed successfully
- Check Flask static_folder configuration
- Verify build directory exists

## Security Notes

- Use strong SECRET_KEY (at least 32 characters)
- Never commit sensitive data to repository
- Use environment variables for all secrets
- HTTPS is automatically handled by Render
- Consider implementing rate limiting

## Monitoring

- Check Render logs for errors
- Monitor database usage
- Watch for OpenAI API quota limits
- Monitor application performance

## Backup Strategy

- Database backups through Render
- Keep environment variables documented securely
- Regular code backups in Git repository
- Document deployment process

---

## Quick Commands for Local Testing

```bash
# Build React app
cd my-react-app
npm run build

# Test with gunicorn (production server)
cd ../Backend
gunicorn --bind 0.0.0.0:5000 server:app

# Initialize database
python init_db.py
```

## Support

If you encounter issues:
1. Check Render logs first
2. Verify all environment variables are set
3. Test locally with production configuration
4. Check this deployment guide for common solutions
