# Document Upload and Summarization

This project allows users to upload PDF documents and get AI-generated summaries.

## Quick Start

### Prerequisites
- Install all dependencies for both backend and frontend (see detailed setup below)
- Set Azure OpenAI environment variables in your system or terminal session:
  ```powershell
  $env:AZURE_OPENAI_ENDPOINT = "your-azure-openai-endpoint"
  $env:AZURE_OPENAI_API_KEY = "your-azure-openai-api-key"
  ```

### Starting the Application
You can start both the backend and frontend servers at once using one of the following methods:

#### Option 1: Using the Batch File (Windows)
Double-click the `start_app.bat` file or run it from Command Prompt:
```
start_app.bat
```

#### Option 2: Using the PowerShell Script (Windows)
Run the PowerShell script (right-click and select "Run with PowerShell" or execute from PowerShell):
```powershell
.\start_app.ps1
```

## Detailed Setup Instructions

### Backend Setup (Flask)

1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set environment variables for Azure OpenAI:
   ```
   # Windows PowerShell
   $env:AZURE_OPENAI_ENDPOINT = "your-azure-openai-endpoint"
   $env:AZURE_OPENAI_API_KEY = "your-azure-openai-api-key"
   ```

4. Start the Flask server:
   ```
   python server.py
   ```
   The server will run at http://localhost:5000

### Frontend Setup (React)

1. Navigate to the my-react-app directory:
   ```
   cd my-react-app
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```
   The frontend will run at http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Navigate to the Document Upload page
3. Upload a PDF file
4. Click "Analyze Documents" to process the file
5. The summary will appear below the upload area

## Important Notes

### Python Environment
If you're using a virtual environment, activate it before running the launcher scripts:

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Or from Command Prompt
.\.venv\Scripts\activate.bat
```

## Troubleshooting

If you encounter issues running both services simultaneously:

1. **Port conflicts**: Make sure ports 3000 and 5000 are not in use by other applications
2. **Missing environment variables**: Ensure Azure OpenAI credentials are set correctly
3. **Server errors**: Check the terminal windows for error messages
4. **CORS issues**: If you see CORS errors in the browser console, ensure the Flask server is running and has CORS enabled
5. **Python dependency issues**: If you encounter module import errors, ensure your virtual environment is activated and all dependencies are installed with `pip install -r Backend/requirements.txt`

## Notes

- Only PDF files are supported
- Make sure both the frontend and backend servers are running
- The backend server must have access to the Azure OpenAI API
- The PowerShell script offers guided setup for Azure credentials
