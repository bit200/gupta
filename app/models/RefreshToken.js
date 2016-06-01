var mongoose = require('mongoose')
var randomstring = require('randomstring')
var _month = 1000 * 60 * 60 *  24 * 30;

var RefreshToken = mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    value: String,
    role: String,
    user: {
        type: Number,
        ref: 'User'
    },
    expire_in: {
        type: Number,
        default: _month
    },
    expire_date: Date
});

RefreshToken.methods.publish = function () {
    return {
        value: this.value,
        expire_in: Math.round(this.expire_in / 1000)
    }
}

RefreshToken.pre('save', function (next) {
    if (this.isNew) {
        this.value = randomstring.generate(48);
        this.expire_date = new Date(this.createdAt) + this.expire_in;
    }

    next()
})

mongoose.model('RefreshToken', RefreshToken);
