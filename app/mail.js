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
    jobEdit: swig.compileFile(config.root + '/public/mailTemplate/jobEdit.html'),
    contractCreate: swig.compileFile(config.root + '/public/mailTemplate/contractCreate.html'),
    contractApprove: swig.compileFile(config.root + '/public/mailTemplate/contractApprove.html'),
    contractReject: swig.compileFile(config.root + '/public/mailTemplate/contractReject.html'),
    contractSuggest: swig.compileFile(config.root + '/public/mailTemplate/contractSuggest.html'),
    invitePayment: swig.compileFile(config.root + '/public/mailTemplate/invitePayment.html'),
    contractSuggestApply: swig.compileFile(config.root + '/public/mailTemplate/contractSuggestApply.html'),
    contractSuggestCancel: swig.compileFile(config.root + '/public/mailTemplate/contractSuggestCancel.html'),
    contractClose: swig.compileFile(config.root + '/public/mailTemplate/contractClose.html'),
    registrationSeller: swig.compileFile(config.root + '/public/mailTemplate/registerSeller.html'),
    registrationSellerEdit: swig.compileFile(config.root + '/public/mailTemplate/registerSellerEdit.html'),



    approveAgencyRegistration: swig.compileFile(config.root + '/public/mailTemplate/approveAgencyRegistration.html'),
    rejectAgencyRegistration: swig.compileFile(config.root + '/public/mailTemplate/rejectAgencyRegistration.html'),
    newRegistration_admin: swig.compileFile(config.root + '/public/mailTemplate/newRegistration_admin.html')
    
};

var transporter = require('nodemailer').createTransport(smtpTransport({
    host: config.smtp.host,
    secure: false,
    port: 25,
    auth: config.smtp.auth,
    tls: {
        rejectUnauthorized: false
    }
}));

function options(subject, to, html_options) {
    return {
        from: config.adminEmail,
        subject: subject,
        to: to,
        html: html_options
    };
}

function _send(mailOptions, _ecb, _scb) {
    transporter.sendMail(mailOptions, function (err, info) {
        console.log(err, info)
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
options = options('Your Job was rejected to edit', user.email, tpl.jobEdit({
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

function contractCreate(user, contractID, _ecb, _scb) {
    user = user.toJSON();
    var _options = options('Contract ' + contractID + ' created!', user.email, tpl.contractCreate({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        contractID: contractID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function contractApprove(user, contractID, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Contract ' + contractID + ' was approved!', user.email, tpl.contractApprove({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        contractID: contractID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function contractReject(user, contractID, reason_reject, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Contract ' + contractID + ' was rejected!', user.email, tpl.contractReject({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        reason_reject: reason_reject,
        contractID: contractID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function contractSuggest(user, contractID, suggestID, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Contract was suggested edit', user.email, tpl.contractSuggest({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        contractID: contractID,
        suggestID: suggestID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function invitePayment(user, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Invite payment', user.email, tpl.invitePayment({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function suggestCancel(user, contractID, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Your suggested changes was canceled', user.email, tpl.contractSuggestCancel({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        contractID:contractID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function suggestApply(user, contractID, suggestID, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Your suggested changes was applied', user.email, tpl.contractSuggestApply({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        contractID:contractID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function contractClose(user, contractID, closure, _ecb, _scb) {
    user = user.toJSON();

    var _options = options('Contract was closed', user.email, tpl.contractClose({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        closure_comment: closure,
        contractID:contractID,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function registrationSeller(freelancer, name,  _ecb, _scb) {
    freelancer = freelancer.toJSON();
    var _options = options('Congratulations', user.email, tpl.registrationSeller({
        name: name,
        freelancer: freelancer,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}



function newRegistration_admin(freelancer, _ecb, _scb) {
    freelancer = freelancer.toJSON();
    var _options = options('New registration come up', config.adminEmail, tpl.newRegistration_admin({
        freelancer: freelancer,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function rejectAgencyRegistration(obj, _ecb, _scb) {
    var _options = options('Registration rejected', obj.freelancer.contact_detail.email, tpl.rejectAgencyRegistration({
        obj: obj,
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function approveAgencyRegistration(obj, _ecb, _scb) {
    var _options = options('Registration approved', obj.freelancer.contact_detail.email, tpl.approveAgencyRegistration({
        obj: obj,
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
    job_edit: job_edit,
    contractCreate: contractCreate,
    contractApprove: contractApprove,
    contractReject: contractReject,
    contractSuggest: contractSuggest,
    invitePayment: invitePayment,
    suggestCancel: suggestCancel,
    suggestApply: suggestApply,
    contractClose: contractClose,
    registrationSeller: registrationSeller,

    newRegistration_admin: newRegistration_admin,
    rejectAgencyRegistration: rejectAgencyRegistration,
    approveAgencyRegistration: approveAgencyRegistration

};