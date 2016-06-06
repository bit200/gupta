var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var LocationSchema = mongoose.Schema({
    name: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


LocationSchema.plugin(autoIncrement.plugin, {
    model: 'Location',
    field: '_id',
    startAt: 100000
});

mongoose.model('Location', LocationSchema);