const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const createMessage = (name, text, id) => ({name, text, id});

io.on('connection', socket => {
  socket.on('userJoined', (data, callback) => {
    if (!data.name || !data.room) {
      return callback('Данные некорректны.');
    }
    socket.join(data.room);
    callback({userId: socket.id});
    socket.emit('newMessage', createMessage('admin', `Добро пожаловать ${data.name}`));
    socket.broadcast
      .to(data.room)
      .emit('newMessage', createMessage('admin', `Пользователь ${data.name} зашел`));
  });

  socket.on('createMessage', data => {
    setTimeout(() => {
      socket.emit('newMessage', {
        text: data.text + ' - SERVER'
      });
    }, 500);
  });
});

module.exports = {
  app, server
};
