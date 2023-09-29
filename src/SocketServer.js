function SocketServer(socket, io) {
  socket.on('join', user => {
    console.log(user);
  });
}

module.exports = {
  SocketServer
}