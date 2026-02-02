# Quick Start: Vercel Deployment

## 🚀 Quick Deploy

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Click Deploy

3. **Add Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:
   
   | Variable | Value | Example |
   |----------|-------|---------|
   | `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
   | `JWT_SECRET` | Your JWT secret | `MyRandomSuperSecretKey123456` |
   | `CLIENT_URL` | Your Vercel app URL | `https://your-app.vercel.app` |

4. **Redeploy**
   - After adding `CLIENT_URL`, trigger a new deployment

## 📝 Important Notes

> [!IMPORTANT]
> **First Deployment**: After your first deployment, you'll get a Vercel URL. Add this as `CLIENT_URL` environment variable and redeploy.

> [!TIP]
> **Client Code Update**: Your client code currently has hardcoded API URLs. To use the dynamic configuration, update your fetch calls to use the `getApiUrl` helper from `src/config/api.js`. See [API_CONFIG.md](client/API_CONFIG.md) for details.

## 🔧 What Was Configured

- ✅ Root `vercel.json` for monorepo setup
- ✅ Server CORS for production
- ✅ Serverless function entry point (`server/api/index.js`)
- ✅ Client API configuration with environment variables
- ✅ `.vercelignore` to exclude unnecessary files

## 📚 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide and troubleshooting.

## 🧪 Test Locally

**Client:**
```bash
cd client
pnpm dev
```

**Server:**
```bash
cd server
pnpm dev
```

## 🌐 After Deployment

Test these endpoints:
- `https://your-app.vercel.app` - Client homepage
- `https://your-app.vercel.app/api` - API health check
- `https://your-app.vercel.app/api/users/...` - Your API routes
