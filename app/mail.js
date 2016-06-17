var nodemailer = require('nodemailer')
    , _ = require('underscore')
    , smtpTransport = require('nodemailer-smtp-transport')
    , swig = require('swig')
    , md5 = require('md5')
    , config = require('./config')
    , m = require('./m');

// Compile a file and store it, rendering it later
var tpl = {
    restore: swig.compileFile(config.root + '/public/mailTemplate/forgotPassword.html'),
    confirm: swig.compileFile(config.root + '/public/mailTemplate/register.html'),
    jobApprove: swig.compileFile(config.root + '/public/mailTemplate/jobApprove.html'),
    jobReject: swig.compileFile(config.root + '/public/mailTemplate/jobReject.html'),
    jobEdit: swig.compileFile(config.root + '/public/mailTemplate/jobEdit.html')
};

var transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.mailgun.org',
    port: 587,
    secure: true, // use SSL
    auth: {
        user: 'postmaster@themediaant.mailgun.org',
        pass: '42w5ehl0f6e8'
    }
});

transporter = nodemailer.createTransport(
    smtpTransport('smtps://postmaster@themediaant.mailgun.org:42w5ehl0f6e8@smtp.mailgun.org')
);

function options(subject, to, html_options) {
    var defaultOpts = {
        from: config.noreply,
        subject: subject,
        to: to,
        html: html_options
    };
    return defaultOpts;
}

function _send(mailOptions, _ecb, _scb) {
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            m.ecb(350, err, _ecb)
        } else {
            m.scb(info, _scb)
        }
    });
}

function _pub(v) {
    return v < 10 ? '0' + v : v
}


function pub_date(v, delta_in_days) {
    var date = v ? new Date(v) : new Date();

    if (delta_in_days) {
        date = new Date(date.getTime() + delta_in_days * 24 * 3600 * 1000)
    }

    return [_pub(date.getDate()), _pub(date.getMonth() + 1), date.getFullYear()].join('.')
}

function send_restore(user, _ecb, _scb) {
    user = user.toJSON();
    var _options = options('Reset Your Password - The Media Ant', user.email, tpl.restore({
        user: user,
        appHost: config.appHost
    }));

    _send(_options, _ecb, _scb)
}


function send_confirm(user, _ecb, _scb) {
    user = user.toJSON();
    if (!user.confirm_code) {
        return m.ecb(351, 'Already confirmed', _ecb)
    }
    var _options = options('One Last Step To Create Your Account!', user.email, tpl.confirm({
        email: user.email,
        name: {
            first: user.first_name,
            last: user.last_name
        },
        confirm_code: user.confirm_code,
        userId: user._id,
        emailHash: md5(user.email),
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function job_approve(user, _ecb, _scb) {
    user = user.toJSON();
    if (!user.confirm_code) {
        return m.ecb(351, 'Already confirmed', _ecb)
    }
    var _options = options('Approve your Job!', user.email, tpl.jobApprove({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function job_reject(user, reason, _ecb, _scb) {
    user = user.toJSON();
    if (!user.confirm_code) {
        return m.ecb(351, 'Already confirmed', _ecb)
    }
    var _options = options('Your Job was rejected', user.email, tpl.jobReject({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        reject_reason: reason,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function job_edit(user, reject_reason, id, _ecb, _scb) {
    user = user.toJSON();
    if (!user.confirm_code) {
        return m.ecb(351, 'Already confirmed', _ecb)
    }
    var _options = options('Your Job was rejected to edit', user.email, tpl.jobEdit({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        reject_reason: reject_reason,
        id: id,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}


module.exports = {
    send: _send,
    send_restore: send_restore,
    send_confirm: send_confirm,
    job_approve: job_approve,
    job_reject: job_reject,
    job_edit: job_edit
};