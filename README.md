# 💬 ChatWebApp

A real-time chat web application with friend system, online status, and message history — built using **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**.

---

## 📸 Preview

> Add your images below in the `images/` directory or anywhere public and replace the links here.

<p float="left">
  ![image](https://github.com/user-attachments/assets/fed91e5f-37c2-4ce8-b571-59aac6f42343)
  ![image](https://github.com/user-attachments/assets/05ea8d04-d995-4dcf-b2b6-4fd0ac24324f)
  ![image](https://github.com/user-attachments/assets/b6a5743b-ec3b-4074-8a37-1027c8f071b3)
</p>

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

### 💻 Frontend (React + Vite)

- React 19
- React Router v7
- Tailwind CSS
- Lucide-react
- Socket.IO Client
- JWT Decode

---

## 📁 Folder Structure

```
📦 CHATWEBAPP
├── client # React frontend
│ ├── public
│ ├── src
│ ├── index.html
│ └── vite.config.js
├── config # Database config and environment
├── controller # Controllers for auth, chat, users
├── middleware # Auth middleware, token verification
├── model # Mongoose models
├── routes # API routes
├── sockets # Socket.IO logic
├── server.js # Main Express app
├── .env
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
```

### ⚙️ Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts React app on localhost:5173





