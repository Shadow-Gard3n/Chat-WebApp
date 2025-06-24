const express = require('express');
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const corsconfig = require('./config/cors');
const connectDB = require('./config/dbconfig')
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./sockets/sockethandler');
const socketAuthMiddleware = require('./sockets/socketAuthMiddleware');

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

// important middleware
app.use(cors(corsconfig))
app.use(express.json())
app.use(cookieParser());

app.use((req,res,next)=>{
  console.log(`${req.url} ${req.method}`)
  next();
})

// all the backend outes
app.use('/api',require('./routes/authRoutes'))
app.use(verifyJWT)
app.use('/api/user',require('./routes/userRoutes'))

// socket io server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3500",           
  "http://localhost:5173",
  "https://echoconverse.netlify.app",          
  process.env.CLIENT_ORIGIN ], // react frontend
    methods: ['GET', 'POST'],
    credentials: corsconfig.credentials
  }
});

socketAuthMiddleware(io);
socketHandler(io);

mongoose.connection.once('open',()=>{
  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
})
