// backend/socket.js
let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
      }
    });
    
    io.on('connection', (socket) => {
      console.log('✅ Cliente conectado:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
      });
    });
    
    return io;
  },
  
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io no inicializado');
    }
    return io;
  }
};
