var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ChatMessageSchema = mongoose.Schema({
    room: {
        type: Number,
        ref: 'ChatRoom'
    },
    users: {
        type: Number,
        ref: 'User'
    },
    message: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ChatMessageSchema.plugin(autoIncrement.plugin, {
    model: 'ChatMessage',
    field: '_id',
    startAt: 100000
});

mongoose.model('ChatMessage', ChatMessageSchema);