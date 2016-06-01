(function() {
    var socket = require('socket.io');
    var io = false;

    exports.boot = function(server) {
        io = socket(server);
         io.on('connection', function(socket) {
             socket.emit('id',socket.id);
             socket.join(socket.id);
        });
    };

    exports.getIo = function() {
        return io;
    };

}).call(this);