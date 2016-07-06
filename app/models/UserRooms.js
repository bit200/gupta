var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var UserRoomsSchema = mongoose.Schema({
    rooms: Array,
    user: {
        type: Number,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


UserRoomsSchema.plugin(autoIncrement.plugin, {
    model: 'UserRooms',
    field: '_id',
    startAt: 100000
});

mongoose.model('UserRooms', UserRoomsSchema);