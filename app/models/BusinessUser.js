var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var BusinessUserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    phone: String,
    role: String,
    reject_reason: String,
    isActive: {
        type: Boolean,
        default: true
    },
    // 0 pending, 1 approved, 2 rejected
    status: {
        type: Number,
        default: 0
    },
    user: {
      type: Number,
      ref: 'User'
    },
    agency: {
        type: Number,
        ref: 'Freelancer'
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