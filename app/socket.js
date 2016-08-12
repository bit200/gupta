(function () {
    var socket = require('socket.io');
    var m = require('../app/m'),
    mail = require('../app/mail');
    // var io = false;

    exports.boot = function (server) {
        io = socket(server);
        var models = require('../app/db');
        io.on('connection', function (socket) {
            socket.on('join room', function (obj) {
                m.findOne(models.ChatRoom, {_id:obj.join}, function () {
                    io.emit('error', "can't create")
                }, function (resp) {
                    socket.join(resp._id);
                    var user;
                    if (resp.seller != obj.userID)
                        user=resp.seller;
                    if (resp.buyer != obj.userID)
                        user = resp.buyer;
                    socket.emit('joined', {status: 'success', id: resp._id, user:user})
                })
            });

            socket.on('watch-online', function (userID) {
                socket.join('user:' + userID.id)
            });

            socket.on('i online', function (id) {
                m.findUpdate(models.User, {_id: id}, {online: true}, {}, function () {
                    socket.broadcast.to('user:' + id).emit('user online', true);
                });
            });
            var time = new Date().getTime();

            socket.on('ping online', function (id) {
                time = new Date().getTime();
                setTimeout(function () {
                    var newTime = new Date().getTime();
                    if ((new Date().getTime() - time) > 7000) {
                        online(false, id)
                    } else {
                        socket.broadcast.to('user:' + id).emit('user online', true);
                    }
                }, 10000)
            });

            socket.on('post msg', function (msg) {
                m.findOne(models.ChatRoom, {_id: msg.room}, {}, function (chat) {
                    chat.messages.push(msg.msg);
                    log('qweqe2qq2eq2eq2eqe', msg)
                    m.findUpdate(models.ChatRoom, {_id: msg.room}, {messages: chat.messages}, {}, function(chat){
                        mail.chatMessage()
                    })
                });
                socket.broadcast.to(msg.room).emit('w8 msg', msg.msg);
            });

            function online(online, id) {
                m.findUpdate(models.User, {_id: id}, {online: online});
                socket.broadcast.to('user:' + id).emit('user online', online);
            }
        });


    };

    exports.getIo = function () {
        return io;
    };

}).call(this);