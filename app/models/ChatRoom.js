var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ChatRoomSchema = mongoose.Schema({
    name: String,
    buyer: {
        type:Number,
        ref: 'User'
    },
    seller: {
        type: Number,
        ref: 'User'
    },
    job: {
        type:Number,
        ref:'Job'
    },
    messages: Array,
    unreadMessages:{
        status: Boolean,
        date: Date //date last unread message
    },
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