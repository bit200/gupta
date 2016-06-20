var mongoose = require('mongoose')
var randomstring = require("randomstring");
var client = require("../redis");
// var _day = 1000 ;
var _day = 1000 * 60 * 60 *  24;
var live_period = 10 * _day;

var AccessToken = mongoose.Schema({
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
        default: live_period
    },
    expire_date: Date
});

function publish_expire (_this) {
    return Math.round(_this.expire_in / 1000)
}

AccessToken.methods.publish = function(){
    return {
        value: this.value,
        role: this.role,
        expire_in: publish_expire(this)
    }
};

AccessToken.pre('save', function (next) {
    if (this.isNew) {
        this.value = randomstring.generate(48);
        this.expire_date = new Date(this.createdAt) + this.expire_in;
        
        var key = 'token_' + this.value;
        var userId = this.user ? this.user._id || this.user : this.user;

        client.set(key, userId + '_' + this.role);
        client.expire(key, publish_expire(this));
    }
    next()
})

AccessToken.pre('remove', function (next) {
    client.del('token_' + this.value)
    next()
})

mongoose.model('AccessToken', AccessToken);
