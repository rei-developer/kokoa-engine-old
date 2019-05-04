module.exports = {
  start: io => {
    io.on('connection', socket => {
      socket.on('newTopic', data => io.sockets.emit('newTopic', data))
      socket.on('join', id => socket.join(id))
      socket.on('leave', id => socket.leave(id))
      // socket.on('disconnect', () => {})
    })
  },
  newBest: (io, title) => io.sockets.emit('newBest', { title }),
  newTopic: (io, title) => io.sockets.emit('newTopic', { title }),
  newPost: (io, id) => io.sockets.in(id).emit('newPost'),
  vote: (io, id, likes, hates) => io.sockets.in(id).emit('vote', { likes, hates })
}