var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var CommentsSchema = mongoose.Schema({
    contract: {
        type: Number,
        ref: 'Contract'
    },
    type: String,
    text: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


CommentsSchema.plugin(autoIncrement.plugin, {
    model: 'Comments',
    field: '_id',
    startAt: 100000
});

mongoose.model('Comments', CommentsSchema);