var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ChatAttachSchema = mongoose.Schema({
    room: {
        type: Number,
        ref: 'ChatRoom'
    },
    users: {
        type: Number,
        ref: 'User'
    },
    attach: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ChatAttachSchema.plugin(autoIncrement.plugin, {
    model: 'ChatAttach',
    field: '_id',
    startAt: 100000
});

mongoose.model('ChatAttach', ChatAttachSchema);