# Deploying Mentora to Vercel

This guide will walk you through deploying your Mentora application (React client + Express server) to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel CLI installed (optional): `npm install -g vercel`

## Project Structure

Your project is configured as a monorepo with:
- **Client**: React + Vite application in `/client`
- **Server**: Express.js API in `/server` (deployed as serverless functions)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**
   
   In your Vercel project settings, add these environment variables:
   
   **For the Server (API):**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `CLIENT_URL` - Your Vercel client URL (e.g., `https://your-app.vercel.app`)
   
   > [!IMPORTANT]
   > After your first deployment, you'll get a Vercel URL. Add this URL as the `CLIENT_URL` environment variable and redeploy.

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts to link your project.

4. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add CLIENT_URL
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### 1. Update CLIENT_URL Environment Variable

After your first deployment:

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to your Vercel project settings → Environment Variables
3. Add or update `CLIENT_URL` with your deployment URL
4. Redeploy the project

### 2. Update Client API Configuration (Optional)

If you want to use a custom API URL in production:

1. In Vercel project settings → Environment Variables
2. Add `VITE_API_URL` with your API URL (e.g., `/api` for same domain)

### 3. Test Your Deployment

Visit your deployed URL and test:
- ✅ Homepage loads correctly
- ✅ User signup/login works
- ✅ API endpoints respond correctly
- ✅ Database connections work

## Important Notes

> [!WARNING]
> **Environment Variables**: Never commit `.env` files to Git. Always add sensitive data through Vercel's dashboard.

> [!TIP]
> **Custom Domain**: You can add a custom domain in Vercel project settings → Domains.

> [!NOTE]
> **Serverless Functions**: Your Express server runs as serverless functions on Vercel. Each API request spins up a new instance.

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` environment variable is set correctly
- Check that your deployed client URL matches the CORS configuration

### Database Connection Issues
- Verify `MONGODB_URI` is set correctly in Vercel
- Ensure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges

### API Routes Not Working
- Check that API routes start with `/api/`
- Verify `server/api/index.js` exists and exports the Express app

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

## Local Development

To test locally with the production-like setup:

1. **Client** (in `/client` directory):
   ```bash
   pnpm install
   pnpm dev
   ```

2. **Server** (in `/server` directory):
   ```bash
   pnpm install
   pnpm dev
   ```

The client will run on `http://localhost:5173` and the server on `http://localhost:5000`.

## Updating Your Deployment

To update your deployment:

1. Make changes to your code
2. Commit and push to Git
3. Vercel will automatically redeploy

Or use the CLI:
```bash
vercel --prod
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Deploying Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Environment Variables on Vercel](https://vercel.com/docs/environment-variables)
