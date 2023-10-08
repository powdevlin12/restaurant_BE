function SocketServer(socket, io) {
  socket.on('join', converstionId => {
    socket.join(converstionId)
    const room = io.sockets.adapter.rooms.get(converstionId);
    const numUsers = room ? room.size : 0;
    console.log(`Total people in room ${converstionId} : `, numUsers)
  });
}

module.exports = {
  SocketServer
}