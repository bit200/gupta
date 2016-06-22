var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var CommentsSchema = mongoose.Schema({
    job: {
        type: Number,
        ref: 'Job'
    },
    closure: String,
    rating: Number,
    review: String,
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