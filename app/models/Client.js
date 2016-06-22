var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ClientSchema = mongoose.Schema({
    name: String,
    img: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ClientSchema.plugin(autoIncrement.plugin, {
    model: 'Client',
    field: '_id',
    startAt: 100000
});

mongoose.model('Client', ClientSchema);