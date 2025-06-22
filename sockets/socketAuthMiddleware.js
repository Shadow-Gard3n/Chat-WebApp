const jwt = require("jsonwebtoken");

const socketAuthMiddleware = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token not provided"));

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      socket.user = decoded;
      next();
    } catch (err) {
      console.log("JWT error:", err.message);
      return next(new Error("Unauthorized"));
    }
  });
};

module.exports = socketAuthMiddleware;
