var mongoose = require('mongoose')
    , md5 = require('md5')
    , autoIncrement = require('mongoose-auto-increment')
    , randomstring = require('randomstring')
    , uniqueValidator = require('mongoose-unique-validator')
    , mail = require('../mail')
    , m = require('../m');

var UserSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    password: String,
    restore_code: String,
    first_name: String,
    last_name: String,
    phone: String,
    admin_notes: String,
    company_name: String,
    preview: String,
    online: Boolean,
    status: String,
    rating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    first_singin: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


UserSchema.methods.send_restore = function (ecb, scb) {
    this.restore_code = this.restore_code || randomstring.generate(30);
    m.save(this, ecb, function (_this) {
        mail.send_restore(_this, ecb, scb)
    })
};

UserSchema.pre('save', function (next) {
    if (!this._id && this.password)
        this.password = md5(this.password);
    next()
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    var isEqual = md5(candidatePassword) == this.password;
    cb(isEqual ? null : 'Wrong password', isEqual)
};

function validateEmail(email) {
    if (!email) {
        return true;
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
};

UserSchema.methods.publish = function () {
    var _this = this.toJSON();
    delete _this.password;
    delete _this.confirm_code;
    delete _this.__v;
    return _this
};
//
// UserSchema.plugin(uniqueValidator, {
//     message: 'The {PATH} is already in use'
// });

UserSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: '_id',
    startAt: 100000
});

// UserSchema.plugin(autoIncrement.plugin, {
//     model: 'User',
//     field: 'username',
//     startAt: 100000
// });

mongoose.model('User', UserSchema);
