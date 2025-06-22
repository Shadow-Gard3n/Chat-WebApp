const Message = require('./../model/chat');

const getChatHandler = async(req, res)=>{
    const { sender, receiver } = req.params;
    try{
        const messages = await Message.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ timestamp: 1 });

    res.json(messages);

    }catch(err){
        console.error("Error fetching messages:", err.message);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}

module.exports = getChatHandler;