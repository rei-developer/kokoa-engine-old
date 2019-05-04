module.exports = {
  start: io => {
    io.on('connection', socket => {
      socket.on('newTopic', data => io.emit('newTopic', data))
      socket.on('join', id => socket.join(id))
      socket.on('leave', id => socket.leave(id))
      socket.on('disconnect', () => console.log('소켓 연결 종료'))
    })
  },
  newBest: (io, title) => io.emit('newBest', { title }),
  newTopic: (io, title) => io.emit('newTopic', { title }),
  newPost: (io, id) => io.sockets.in(id).emit('newPost'),
  vote: (io, id, likes, hates) => io.sockets.in(id).emit('vote', { likes, hates })
}