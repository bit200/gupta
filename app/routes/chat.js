'use strict';
var chat = require('../controllers/chat');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/chatMessage', chat.createMsg);
    app.get('/chatMessage/:id', chat.getMsg);
    app.get('/chat/:id', auth.token, chat.allMsgs);
    app.get('/api/chat/rooms', auth.token, chat.allRooms);
    app.post('/api/create/chat',  chat.createRoom);
    app.post('/api/chat/attach', auth.token, chat.attachFiles);

};