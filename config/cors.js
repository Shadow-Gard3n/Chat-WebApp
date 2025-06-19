const originlist = ["https://www.google.com", "http://localhost:3500"];

const corsconfig = {
  origin: (origin, callback)=>{
    if (!origin || originlist.includes(origin)){
      callback(null, true)
    }
    else{
      callback(new Error("Not allowed "))
    }
  }
}

module.exports = corsconfig;
