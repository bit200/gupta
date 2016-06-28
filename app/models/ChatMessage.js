var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ChatMessageSchema = mongoose.Schema({
    room: {
        type: Number,
        ref: 'ChatRoom'
    },
    job: {
        type: Number
    },
    from: {
        type: Number,
        ref: 'User'
    },
    to: {
        type: Number,
        ref: 'User'
    },
    read: {
        type:Boolean,
        default:false
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