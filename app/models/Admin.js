var mongoose = require('mongoose')
    , md5 = require('md5')
    , autoIncrement = require('mongoose-auto-increment')
    , randomstring = require('randomstring')
    , uniqueValidator = require('mongoose-unique-validator')
    , mail = require('../mail')
    , m = require('../m');

var AdminSchema = mongoose.Schema({
    email: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


AdminSchema.pre('save', function (next) {
    if (this.password) this.password = md5(this.password);
    next()
});

AdminSchema.methods.publish = function () {
    var _this = this.toJSON();
    delete _this.password;
    delete _this.__v;
    return _this
};

AdminSchema.plugin(uniqueValidator, {
    message: 'The {PATH} is already in use'
});

AdminSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: '_id',
    startAt: 100000
});

mongoose.model('Admin', AdminSchema);
