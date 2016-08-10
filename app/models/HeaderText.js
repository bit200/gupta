var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var HeaderTextSchema = mongoose.Schema({
    type: String,
    title: String,
    description: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


HeaderTextSchema.plugin(autoIncrement.plugin, {
    model: 'HeaderTextSchema',
    field: '_id',
    startAt: 100000
});

mongoose.model('HeaderText', HeaderTextSchema);