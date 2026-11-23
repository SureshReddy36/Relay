# Relay — Production Deployment Guide

## Architecture
```
Mobile App (Expo APK / EAS)  ──►  Render (Relay Backend API + WebSocket)  ──►  MongoDB Atlas + Cloudinary
```
No tunnels. Fully public cloud-hosted infrastructure for all users.

---

## Step 1 — Push Backend to GitHub

1. Go to [github.com](https://github.com) → **New Repository** → name it `relay-backend` (or push the entire monorepo).
2. If pushing the backend repository:

```bash
cd backend
git init
git add .
git commit -m "Initial Relay backend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/relay-backend.git
git push -u origin main
```

> ✅ The `.gitignore` excludes `.env` — your production credentials remain secure.

---

## Step 2 — Deploy to Render

1. Go to [render.com](https://render.com) → Log in.
2. Click **New → Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Name**: `relay-backend` (e.g. `https://relay-ih1k.onrender.com`)
   - **Root Directory**: `backend` *(if deploying from monorepo; leave empty if deploying a standalone backend repo)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### 5. Set Environment Variables in Render Dashboard

| Key | Value / Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://<username>:<password>@cluster0.../relay?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your_super_secret_jwt_key_here` |
| `JWT_EXPIRES_IN` | `30d` |
| `SECURITY_KEY_SECRET` | `your_security_key_secret_here` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` |
| `CLIENT_URL` | `*` |
| `FIREBASE_SERVICE_ACCOUNT` | *(Optional JSON string of your Firebase Service Account for background notifications)* |
| `GROQ_API_KEY` | *(Optional: Groq API key for AI assistant features)* |

6. Click **Deploy Web Service**.
7. Test the health check:
   Open `https://relay-ih1k.onrender.com/health` in your browser.
   It should return:
   ```json
   {"status":"OK","app":"Relay API"}
   ```

> ⚠️ **Free tier cold starts**: Free web services sleep after 15 minutes of inactivity. The first request after a sleep period takes ~30–50 seconds.

---

## Step 3 — Configure Frontend URL

In `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=https://relay-ih1k.onrender.com/api
EXPO_PUBLIC_SOCKET_URL=https://relay-ih1k.onrender.com
```

Clear the local Metro cache and restart Expo:
```bash
cd frontend
npx expo start -c
```

---

## Step 4 — Build Android APK (EAS Build)

```bash
cd frontend
# 1. Login to your Expo account (one-time)
eas login

# 2. Build standalone APK for direct installation
eas build -p android --profile preview

# 3. For Google Play Store submission (AAB)
eas build -p android --profile production
```

---

## Step 5 — One-Click OTA Updates & Bot Broadcasts

Relay includes a custom utility to push instant Over-The-Air (OTA) updates and notify all active users through `@relay_bot`:

```bash
# Run from the root Relay directory
node publishUpdate.js
```
This automatically publishes the update across `production` and `preview` branches and broadcasts a notification to all users.

---

## MongoDB Atlas Network Access

> [!IMPORTANT]
> MongoDB Atlas by default restricts connections by IP address.
> 1. Go to **MongoDB Atlas** → **Network Access**.
> 2. Click **Add IP Address**.
> 3. Select **Allow Access from Anywhere** (`0.0.0.0/0`).
> 4. Save changes.

