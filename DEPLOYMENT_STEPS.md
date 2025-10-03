# Backend Deployment to Vercel - Step by Step

## Prerequisites
✅ You have MongoDB Atlas connection string
✅ You have all environment variables ready
✅ Your backend code is ready

## Step 1: Deploy Backend to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Link to existing project" or create new
   - Set framework: "Other"
   - Set build command: `npm run build`
   - Set output directory: `dist`

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Set **Root Directory** to `backend`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`

## Step 2: Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
MONGODB_URI=mongodb+srv://WieEsprit:RqEDd95eD9JMuvO1@cluster0.lzwzxeu.mongodb.net/agrihope?retryWrites=true&w=majority
JWT_SECRET=yourSecretKey
PORT=3001
NODE_ENV=production
JWT_EXPIRES_IN=7d
DATABASE_NAME=agrihope
STRIPE_SECRET_KEY=sk_test_51SCiShRtX2XsjpDxKo7mYpwlLoul9r4G5LoCqQljdHh1bvLdoatTPeW9ITW7OU8lqpgGYeMhNWBkxR38100h1pJo00bj3H9XCt
STRIPE_WEBHOOK_SECRET=whsec_m3CS67aZzSzSC1gvxwWEK1Kbizr7ZOam
```

## Step 3: Update Frontend Environment Variables

In your **frontend** Vercel project:

1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL` to your backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-project-name.vercel.app/api
   ```

## Step 4: Test Your Deployment

1. **Test Backend API**:
   - Visit: `https://your-backend-url.vercel.app/api/marketplaces`
   - Should return JSON with marketplaces

2. **Test Frontend**:
   - Visit your frontend URL
   - Check if marketplaces and products load

## Step 5: Seed Your Database (Optional)

If you need to add sample data:

```bash
cd backend
node seed-marketplaces.js
node seed-products.js
```

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check Vercel build logs
2. **Database Connection**: Verify MongoDB URI is correct
3. **CORS Errors**: Already fixed in the code
4. **Environment Variables**: Make sure all are set in Vercel

### Check Logs:
- Vercel Dashboard → Functions → View Function Logs
- Look for any error messages

## Expected Result

After deployment:
- Backend API accessible at: `https://your-backend.vercel.app/api`
- Frontend can fetch data from backend
- Marketplaces and products display correctly
