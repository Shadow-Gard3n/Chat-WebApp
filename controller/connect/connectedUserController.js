const ConnectedUsers = require('./../../model/connectedUser');

const connectedUserHandler = async(req, res)=>{
    try {
      const { username } = req.params;
      if (!username) return res.status(400).json({ error: "Username parameter is required" });

      // find the user 
      const userConnections = await ConnectedUsers.findOne({ username });
      if (!userConnections) return res.status(404).json({ message: "User not found or no connections" });
      return res.status(200).json({ friends: userConnections.connectedUsers });
      
    } catch (err) {
      console.error("Error fetching connected users:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = connectedUserHandler;