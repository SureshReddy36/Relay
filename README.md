# Relay 🚀

**Relay** is a modern, high-performance, full-stack realtime messaging and community platform. Built with React Native (Expo) and Node.js, Relay delivers seamless communication, end-to-end secret chats, rich multimedia sharing, WebRTC calling, 24-hour stories, interactive AI bots, and group party games.

---

## ✨ Features

### 💬 Realtime Messaging & Chat
- **Instant Messaging**: Low-latency communication powered by WebSocket (Socket.IO).
- **Rich Media Sharing**: High-resolution images, videos, voice notes, audio tracks, and documents uploaded via Cloudinary.
- **Message Controls**: Edit sent messages, delete for everyone, delete for me, and forward with attribution.
- **Replies & Reactions**: Contextual thread replies and live emoji reactions.
- **Interactive Polls**: Create single or multiple-choice polls directly within chats with live vote tallies.
- **Live Typing & Status**: Realtime typing indicators, delivered/read receipts (double blue checks), online/offline status, and camera activity.

### 🔒 Privacy & Secret Chats
- **End-to-End Encryption (E2EE)**: Dedicated encrypted secret chat sessions.
- **Disappearing Media & Self-Destructing Messages**: Set timers on messages and photos that automatically erase after being viewed.
- **Screen Capture Protection**: Configurable privacy protection against screenshots and screen recording.

### 📖 Stories & Status
- **24-Hour Ephemeral Stories**: Post photos, videos, and text updates with captions.
- **Story Viewer & Analytics**: Smooth full-screen media carousel with view counters.
- **Story Replies**: Reply directly to a user's story into a direct chat thread.

### 👥 Groups & Communities
- **Group Channels**: Large group conversations with member management, custom avatars, and admin controls.
- **Group Invite Links**: Shareable invite links with preview screens before joining.
- **Custom Game Settings**: Configure per-group entertainment bots and games.

### 🤖 Interactive AI & Platform Bots
- **✨ Mica Bot (`@mica_bot`)**: The friendly community AI assistant powered by LLMs. Helps summarize chat history, answers questions, and facilitates group games.
- **🔥 Mars Bot (`@mars_bot`)**: The witty, sarcastic game bot built for competitive banter and trivia challenges.
- **📢 Relay Bot (`@relay_bot`)**: Official platform bot that automatically announces changelogs, system notices, and Over-The-Air (OTA) updates.

### 🎮 In-Chat Group Games
- **Party Games**: Play Mafia, Word Scramble, Trivia, and Riddles directly inside group chats.
- **Leaderboards & Player Stats**: Track wins, points, and standings across your community.

### 📞 Audio & Video Calling
- **WebRTC Peer-to-Peer Calling**: High-definition audio and video calling between users.
- **Call Signaling**: Realtime incoming call alerts, call acceptance, rejection, and ICE candidate negotiation.

### 🛡️ Security & Account Protection
- **Multi-Device Management**: View all active login sessions with IP, device name, and location; remotely revoke unauthorized devices.
- **Encrypted Security Keys**: AES-256 encrypted recovery keys for secure password resets without relying solely on email.
- **Rate Limiting & Security Headers**: Express rate limiting, Helmet.js header protection, and bcrypt password hashing (12 rounds).
- **Background Notifications**: Firebase Cloud Messaging (FCM) and Notifee for reliable background notifications even when the app is closed.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Mobile App (Frontend)** | React Native, Expo SDK 54, React Navigation v7 |
| **Styling** | NativeWind / Tailwind CSS |
| **State Management** | Zustand |
| **Backend API** | Node.js, Express |
| **Realtime Engine** | Socket.IO |
| **Database** | MongoDB Atlas, Mongoose |
| **Cloud Storage** | Cloudinary (Images, Video, Voice Notes, Documents) |
| **Push Notifications** | Firebase Cloud Messaging (FCM), Expo Notifications, Notifee |
| **AI Integration** | Groq SDK / Cloud AI |
| **Deployment** | Render (Backend Web Service), Expo EAS (Android APK & OTA Updates) |

---

## 📁 Project Architecture

```
Relay/
├── backend/
│   ├── config/              # MongoDB connection, Cloudinary, Socket.IO handler
│   ├── controllers/         # Auth, User, Chat, Message, Story controllers
│   ├── middlewares/         # JWT verification, Error handlers, Multer upload
│   ├── models/              # User, Chat, Message, Story, Game schemas
│   ├── routes/              # Express API route endpoints
│   ├── scripts/             # Bot setup, broadcasting, DB maintenance scripts
│   ├── utils/               # Bot helpers, encryption utilities, Cloudinary wrappers
│   ├── .env.example         # Backend environment variables template
│   └── server.js            # Express & Socket.IO server entry point
├── frontend/
│   ├── assets/              # App icons, splash screens, notification audio
│   ├── src/
│   │   ├── components/      # Message bubbles, media viewers, chat list items
│   │   ├── navigation/      # Stack, Tab, and Auth navigators
│   │   ├── screens/         # Chat, Stories, Communities, Profile, Settings screens
│   │   ├── services/        # Axios API client, Socket.IO client, WebRTC services
│   │   ├── store/           # Zustand state stores (auth, chats, settings)
│   │   └── theme/           # Color palettes and global styling
│   ├── app.json             # Expo application manifest
│   ├── eas.json             # EAS build profiles (Preview APK, Production AAB)
│   └── index.js             # Mobile application entry point
├── broadcast.js             # Interactive CLI utility to broadcast messages to users
├── publishUpdate.js         # Automated script: pushes OTA update + broadcasts changelog
├── relay_commands.txt       # Master cheat sheet for commands and troubleshooting
├── relay_deployment_guide.md# Complete guide for deploying Relay on Render & EAS
└── render.yaml              # Render blueprint specification
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm or yarn
- Expo CLI (`npm install -g eas-cli`)
- MongoDB Atlas cluster
- Cloudinary account

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary, and Firebase keys

# Start in development mode (with auto-restart)
npm run dev

# Or start in production mode
npm start
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables in .env:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api             # For Android Emulator
# EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api # For Production Backend
# EXPO_PUBLIC_SOCKET_URL=https://your-backend.onrender.com

# Start Expo development server (clearing cache)
npx expo start -c
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/relay?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=30d
SECURITY_KEY_SECRET=your_aes_security_key_encryption_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=*
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### Frontend (`frontend/.env`)
```env
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

---

## 🌐 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate with username or email |
| `POST` | `/api/auth/forgot-password`| Reset password using security key |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile & active devices |
| `GET`  | `/api/users/search?q=` | Search users by username or display name |
| `GET`  | `/api/chats` | Retrieve conversation list |
| `POST` | `/api/chats` | Start or access 1-on-1 chat |
| `POST` | `/api/chats/group` | Create group chat |
| `GET`  | `/api/messages/:chatId` | Retrieve paginated chat history |
| `POST` | `/api/messages` | Send message (text, media, polls, voice notes) |
| `PUT`  | `/api/messages/:id` | Edit message content |
| `DELETE` | `/api/messages/:id` | Delete message for everyone |
| `POST` | `/api/messages/:id/react` | Add or toggle emoji reaction |
| `GET`  | `/api/stories` | Retrieve active 24-hour stories feed |
| `POST` | `/api/stories` | Upload photo/video story |
| `GET`  | `/health` | Server health check endpoint |

---

## ⚡ Socket.IO Events

| Event | Direction | Purpose |
|---|---|---|
| `setup` | Client → Server | Connect user & authenticate socket session |
| `join_chat` | Client → Server | Join chat room for realtime stream |
| `typing` / `stop_typing` | Client ⇄ Server | Broadcast typing indicators |
| `message_sent` | Server → Client | Deliver new incoming message to recipient(s) |
| `mark_read` | Client → Server | Mark messages as read |
| `mark_delivered` | Client → Server | Mark messages as received |
| `camera_active` | Client ⇄ Server | Broadcast camera in-use status |
| `call_user` | Client → Server | Initiate WebRTC audio/video call |
| `answer_call` | Client → Server | Answer incoming call |
| `end_call` | Client ⇄ Server | Terminate active call |
| `ice_candidate` | Client ⇄ Server | WebRTC network candidate exchange |

---

## 📦 Building & Publishing

### Build Android APK
```bash
cd frontend
eas build -p android --profile preview
```

### One-Click OTA Updates & Bot Notification
Publish instant app updates over the air and alert all users automatically:
```bash
node publishUpdate.js
```

---

## 📄 License
ISC License. Built for the Relay community.
