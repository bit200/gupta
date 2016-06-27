var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ChatRoomSchema = mongoose.Schema({
    name: String,
    buyer: Number,
    seller: Number,
    job: Number,
    message: Array,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ChatRoomSchema.plugin(autoIncrement.plugin, {
    model: 'ChatRoom',
    field: '_id',
    startAt: 100000
});

mongoose.model('ChatRoom', ChatRoomSchema);