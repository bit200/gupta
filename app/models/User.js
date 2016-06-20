var mongoose = require('mongoose')
    , md5 = require('md5')
    , autoIncrement = require('mongoose-auto-increment')
    , randomstring = require('randomstring')
    , uniqueValidator = require('mongoose-unique-validator')
    , mail = require('../mail')
    , m = require('../m');

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        default: 'USER'
    },
    type: String,
    first_name: String,
    last_name: String,
    password: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    emailHash: String,
    confirm_code: {
        type: String,
        default: randomstring.generate(30)
    },
    restore_code: String,
    admin_approved: {
        type: Number,
        default: 0
    },
        reject_reason: String,
    sex: String,
    thumbnail: String,
    facebookId: String,
    linkedinId: String,
    googleId: String,
    phone: String,
    isActive: {
        type:Number,
        default: 0
    },
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    work: {
        type: Number,
        ref: 'Work'
    },
    contact_detail:{
        type: Number,
        ref: 'ContactDetail'
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
    var user = this;
    if (user.password_plain) {
        user.password = md5(user.password_plain);
    }

    next()
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    log(candidatePassword)
    var isEqual = md5(candidatePassword) == this.password;
    log(md5(candidatePassword) == this.password)

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

UserSchema.plugin(uniqueValidator, {
    message: 'The {PATH} is already in use'
});

UserSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: '_id',
    startAt: 100000
});

mongoose.model('User', UserSchema);
