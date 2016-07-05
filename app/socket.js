(function () {
    var socket = require('socket.io');
    var m = require('../app/m');
    // var io = false;

    exports.boot = function (server) {
        io = socket(server);
        var models = require('../app/db');
        io.on('connection', function (socket) {


            socket.on('join room', function (obj) {
                log('obj',obj)
                m.findCreate(models.ChatRoom, obj, {}, function () {
                    io.emit('error', "can't create")
                }, function (resp) {
                    socket.join(resp._id);
                    socket.emit('join room', {status: 'success', id: resp._id})
                })
            });


            socket.on('post msg', function (msg) {
                console.log('msg', msg);
                m.findOne(models.ChatRoom, {_id: msg.room}, {}, function (chat) {
                   chat.messages.push(msg.msg)
                    m.findUpdate(models.ChatRoom, {_id: msg.room}, {messages:chat.messages})
                });
                socket.in(msg.room).broadcast.emit('w8 msg', msg.msg);
            });
        });
    };

    exports.getIo = function () {
        return io;
    };

}).call(this);