function SocketServer(socket, io) {
  // JOIN ROOM
  socket.on("join", (data) => {
    const conversationId = JSON.parse(data).conversationId;
    socket.join(conversationId);
    const room = io.sockets.adapter.rooms.get(conversationId);
    const numUsers = room ? room.size : 0;
    console.log(`Total people in room ${conversationId}: `, numUsers);
    socket.emit("join-success", { msg: "OK" });
  });

  // SEND MESSAGES
  socket.on("send-message", (data) => {
    const { message, conversationId, senderId } = JSON.parse(data);
    console.log(
      "🚀 ~ file: SocketServer.js:15 ~ socket.on ~ message:",
      message
    );
    const room = io.sockets.adapter.rooms.get(conversationId);
    console.log("🚀 ~ file: SocketServer.js:22 ~ socket.on ~ room:", room);

    socket.broadcast.to(conversationId).emit("receiver-message", {
      content: message,
      userId: senderId,
      createdAt: new Date(),
    });
  });
}
// FINISH SEND MESSAGES
module.exports = {
  SocketServer,
};
