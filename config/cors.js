const originlist = ["http://localhost:3500", "http://localhost:5173"];

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
