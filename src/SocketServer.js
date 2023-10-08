function SocketServer(socket, io) {
  // JOIN ROOM
  socket.on('join', converstionId => {
    socket.join(converstionId)
    const room = io.sockets.adapter.rooms.get(converstionId);
    const numUsers = room ? room.size : 0;
    console.log(`Total people in room ${converstionId} : `, numUsers)
  });
  // FINISH JOIN ROOM

  // SEND MESSAGES
  socket.on("send-message", (data) => {
    const { message, conversationId, members, senderId } = JSON.parse(data);
    console.log("🚀 ~ file: SocketServer.js:14 ~ socket.on ~ members:", members)
    // if (members.some(item => item.userId === senderId)) return;
    // socket.in(conversationId).emit('reciever-message', message);
  })
  // FINISH SEND MESSAGES
}

module.exports = {
  SocketServer
}