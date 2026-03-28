# Quick Setup Guide for Windows

Follow these steps to get the Creature Collector application running on your Windows machine.

## Prerequisites Check

First, verify that Node.js and npm are installed:

```powershell
node --version
npm --version
```

If not installed, download from https://nodejs.org/ (LTS version recommended)

## Step 1: Backend Setup

Open PowerShell in the backend directory:

```powershell
cd c:\Users\esaar\material6thsem\webProgramming\mernstacklab\creature-collector-backend

# Install all dependencies
npm install

# Start the backend server
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

**Keep this terminal open** - the server needs to keep running.

## Step 2: Frontend Setup

Open a **NEW** PowerShell window and navigate to the frontend:

```powershell
cd c:\Users\esaar\material6thsem\webProgramming\mernstacklab\creature-collector-client

# Install all dependencies
npm install

# Start the frontend development server
npm start
```

This should automatically open http://localhost:3000 in your browser.
If not, open it manually.

## Step 3: Test the Application

1. **Register a new user**
   - Enter a username (e.g., "ash")
   - Enter a password (e.g., "pikachu")
   - Click Register
   - You should see a success message

2. **Login with your credentials**
   - Enter the same username and password
   - Click Login
   - You should be redirected to the Dashboard

3. **Add a creature**
   - In the "Catch a New Creature" form
   - Enter a name (e.g., "Pikachu")
   - Enter a power (e.g., "Electric")
   - Click "Add Creature"

4. **Delete a creature**
   - Find the creature in the list
   - Click the "Delete" button next to it

5. **Logout**
   - Click the "Logout" button in the top-right
   - You should be back to the login screen

## MongoDB Setup

If you don't have MongoDB running locally:

### Option 1: Install MongoDB Locally
Download from https://www.mongodb.com/try/download/community

### Option 2: Use MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env` in backend folder:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creatureDB
   ```

## Troubleshooting on Windows

### Issue: "npm: The term 'npm' is not recognized"
- Restart PowerShell or Command Prompt
- Or restart your computer
- Or add Node to PATH manually

### Issue: Port 5000 or 3000 already in use
**For Backend (Port 5000):**
- Edit `.env` and change PORT=5001

**For Frontend (Port 3000):**
- In PowerShell, set the port:
  ```powershell
  $env:PORT=3001
  npm start
  ```

### Issue: MongoDB connection fails
Make sure MongoDB is running:
```powershell
# Check if MongoDB is running (it should be a Windows Service)
Get-Service MongoDB # or similar service name
```

Or start MongoDB from installation folder:
```powershell
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

### Issue: "Cannot find module" errors
This usually means `npm install` didn't complete successfully.
Try:
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

## Environment Variables

Both `.env` files have been created with default values. 
- **Backend (.env)**: Located in `creature-collector-backend/.env`
- These values should work for local development

## File Locations

- **Backend files**: `c:\Users\esaar\material6thsem\webProgramming\mernstacklab\creature-collector-backend\`
- **Frontend files**: `c:\Users\esaar\material6thsem\webProgramming\mernstacklab\creature-collector-client\`

## Testing with Postman (Optional)

If you want to test APIs directly without the UI:

1. Download Postman from https://www.postman.com/downloads/
2. Create requests to test endpoints (see README.md for endpoints)
3. Important: After login, Postman will save the authentication cookie in Cookies

## Stopping the Servers

- **Backend**: Press `Ctrl+C` in the backend PowerShell window
- **Frontend**: Press `Ctrl+C` in the frontend PowerShell window

## Next Steps

Once the app is running, explore the code and understand:
- How React components work
- How Express routes handle requests
- How MongoDB stores and retrieves data
- How JWT authentication works
- How sessions are managed

Good luck! 🎮
