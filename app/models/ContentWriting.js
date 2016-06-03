var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ContentWritingSchema = mongoose.Schema({
    name: String,
    filter: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ContentWritingSchema.plugin(autoIncrement.plugin, {
    model: 'ContentWriting',
    field: '_id',
    startAt: 100000
});

mongoose.model('ContentWriting', ContentWritingSchema);