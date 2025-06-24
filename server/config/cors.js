const originlist = ["http://localhost:3500",           
  "http://localhost:5173",
  "https://chattrix-f6oz7t82y-shadow-gard3ns-projects.vercel.app",           
  process.env.CLIENT_ORIGIN ];

const corsconfig = {
  origin: (origin, callback)=>{
    if (!origin || originlist.includes(origin)){
      callback(null, true)
    }
    else{
      callback(new Error("Not allowed "))
    }
  },
  credentials: true
}

module.exports = corsconfig;
