const express = require('express');
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const corsconfig = require('./config/cors');
const connectDB = require('./config/dbconfig')

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
app.use(cors(corsconfig))
app.use(express.json())

app.use((req,res,next)=>{
  console.log(`${req.url} ${req.method}`)
  next();
})

app.use('/',require('./routes/rootRoutes'))

mongoose.connection.once('open',()=>{
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
