const Message = require('./../model/chat');

const onlineUsers = new Map();
const userSocketMap = {}; 

function socketHandler(io) {
  io.on('connection', (socket) => {
    const username = socket.user.username;
    
    // to map online user
    if (username) {
        onlineUsers.set(username, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    }

    userSocketMap[username] = socket.id;
    console.log(`${username} connected with socket id ${socket.id}`);

    socket.on('chat message', async (msg) => {
        console.log(`📨 Message from ${socket.user.username}:`, msg);

        try {
            const newMessage = await Message.create({
                sender: socket.user.username,
                receiver: msg.receiver,     
                content: msg.content,
            });

            // to sender
            socket.emit("chat message", {
                ...newMessage.toObject()
            });

            // to receiver
            const receiverSocketId = userSocketMap[msg.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("chat message", {
                    ...newMessage.toObject()
                });
            }


            } catch (err) {
                console.error("Failed to save message:", err.message);
            }
            });


    socket.on('disconnect', () => {
        delete userSocketMap[username];
        onlineUsers.delete(username);             
        io.emit("online-users", Array.from(onlineUsers.keys())); 
        console.log(`${username} disconnected`);
    });
  });
}

module.exports = socketHandler;
