var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var BusinessUserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    role: String,
    isActive: Boolean,
    agency:{
        type:Number,
        ref: 'Agency'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

BusinessUserSchema.plugin(autoIncrement.plugin, {
    model: 'BusinessUser',
    field: '_id',
    startAt: 100000
});

mongoose.model('BusinessUser', BusinessUserSchema);