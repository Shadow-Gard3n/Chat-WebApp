# 💬 ChatWebApp

A real-time chat web application with friend system, online status, and message history — built using **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**.

---

## 📸 Preview
  <img src="https://github.com/user-attachments/assets/fed91e5f-37c2-4ce8-b571-59aac6f42343" width="600"/>
  <img src="https://github.com/user-attachments/assets/05ea8d04-d995-4dcf-b2b6-4fd0ac24324f" width="600"/>
  <img src="https://github.com/user-attachments/assets/b6a5743b-ec3b-4074-8a37-1027c8f071b3" width="600"/>

---

## 🌐 Live Website

👉 [https://echoconverse.netlify.app/login](https://echoconverse.netlify.app/login)

---

## ✨ Features

- 🔒 JWT-based authentication with cookie sessions
- 🧑‍🤝‍🧑 Friend request system (Send / Accept / Reject)
- 🔍 User search with live status (online/offline)
- 💬 Real-time chat with Socket.IO
- 💾 Chat message history stored in MongoDB
- 🎨 Modern and responsive UI with Tailwind CSS
- ✅ Protected routes via React Router

---

## 🛠️ Tech Stack

### 🔧 Backend (Node.js + Express)

- Express 5
- MongoDB + Mongoose
- JWT + cookie-session
- Socket.IO
- Dotenv, CORS, Bcrypt
- **🔗 Deployed on: Render**

### 💻 Frontend (React + Vite)

- React 19
- React Router v7
- Tailwind CSS
- Lucide-react
- Socket.IO Client
- JWT Decode
- **🚀 Deployed on: Netlify**

---

## 📁 Folder Structure

```
📦 CHATWEBAPP
├── client                     # React frontend
│   ├── public
│   ├── src
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components (e.g., Home, Chat)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── context/           # Context providers (e.g., AuthContext)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server                    # Express backend
│   ├── config/               # Database connection and environment setup
│   ├── controller/           # Route handler logic (auth, chat, users)
│   ├── middleware/           # Authentication and error-handling middleware
│   ├── model/                # Mongoose schemas and models
│   ├── routes/               # API endpoint definitions
│   ├── sockets/              # Socket.IO event handlers
│   ├── server.js             # Main Express app entry point
│   └── .env                  # Environment variables
├── README.md
```
### ⚙️ Backend Setup

```bash
# From root directory
npm install
npm run dev      # Runs server with nodemon
```
### .env 
```
REFRESH_TOKEN_KEY=refresh_secret_key
ACCESS_TOKEN_KEY=access_secret_key
DATABASE_URL=mongo_db
CLIENT_ORIGIN=frontent_domain
```

### ⚙️ Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts React app on localhost:5173





