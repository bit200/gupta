var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var UploadFileSchema = mongoose.Schema({
    originalName: String,
    title: String,
    url: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

UploadFileSchema.plugin(autoIncrement.plugin, {
    model: 'Package',
    field: '_id',
    startAt: 100000
});

mongoose.model('UploadFile', UploadFileSchema);
