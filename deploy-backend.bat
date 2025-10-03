@echo off
echo 🚀 Deploying Backend to Vercel...

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Navigate to backend directory
cd backend

REM Login to Vercel (if not already logged in)
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo Please login to Vercel:
    vercel login
)

REM Deploy to Vercel
echo 📦 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 📝 Don't forget to:
echo    1. Set environment variables in Vercel dashboard
echo    2. Update frontend NEXT_PUBLIC_API_URL
echo    3. Test your API endpoints

pause
