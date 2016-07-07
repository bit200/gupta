'use strict';
var chat = require('../controllers/chat');


module.exports = function (app) {
    app.post('/chatMessage', chat.createMsg);
    app.get('/chatMessage/:id', chat.getMsg);
    app.get('/chat/:id', chat.allMsgs);
    app.get('/api/create/chat', chat.createRoom);
    app.post('/api/chat/attach', chat.attachFiles);

};