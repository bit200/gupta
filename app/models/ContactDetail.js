var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ContactDetailSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    poster: {
        type: Number,
        ref: 'UploadFile'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


ContactDetailSchema.plugin(autoIncrement.plugin, {
    model: 'ContactDetail',
    field: '_id',
    startAt: 100000
});

mongoose.model('ContactDetail', ContactDetailSchema);