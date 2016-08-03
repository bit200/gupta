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
    //confirm: swig.compileFile(config.root + '/public/mailTemplate/register.html'),
    confirm: swig.compileFile(config.root + '/public/mailTemplate/mailTemplate.html'),

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
    //newRegistration_admin: swig.compileFile(config.root + '/public/mailTemplate/newRegistration_admin.html'),
    newRegistration_admin: swig.compileFile(config.root + '/public/mailTemplate/mailTemplate.html'),
    newClaim: swig.compileFile(config.root + '/public/mailTemplate/newClaim.html'),
    claimApproved: swig.compileFile(config.root + '/public/mailTemplate/claimApproved.html'),
    claimRejected: swig.compileFile(config.root + '/public/mailTemplate/claimRejected.html')
    
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

//???????????????????????????????????????????????????????????????????
function send_restore(user, _ecb, _scb) {
    user = user.toJSON();
    //var _options = options('Reset Your Password - The Media Ant', user.email, tpl.restore({
    //    user: user,
    //    appHost: config.appHost
    //}));
    var _options = options('Reset Your Password - 12TH Cross',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Your Job was rejected.',
        message:'You are receiving this mail to reset your password. \n' +
        'In order to reset your password click on the button below. \n' +
        'Ignore this mail if you have not sent this request.',
        link:'#/forgot/restore/'+user.restore_code,
        link_name:'Reset My Password',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//???????????????????????????????????????????????????????????????????????????????????????/
function send_confirm(user, _ecb, _scb) {
    user = user.toJSON();
    user.confirm_code = 15;
    //console.log('Sign uppppppppppppppppppppppppppppppppppppppppppppppppppppppp',user);
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
        message:" Thank you for creating an account with us. \n" +
        "Please click on the button below to verify your email address.\n",
        link:'#/confirm/'+user.confirm_code,
        link_name:'Verify My Account',
        appHost: config.appHost
    }));
    //var _options = options('One Last Step To Create Your Account!', user.email, tpl.confirm({
    //    email: user.email,
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    confirm_code: user.confirm_code,
    //    userId: user._id,
    //    emailHash: md5(user.email),
    //    appHost: config.appHost
    //}));
    _send(_options, _ecb, _scb)
}

//ok
function job_apply(obj, _ecb, _scb) {
    //console.log('Job Apply');
    //console.log('AAAA'+JSON.stringify(obj));
    var _options = options('Apply your Job!', obj.job.email, tpl.confirm({
        email: obj.user.email,
        name: {
            first: obj.user.first_name,
            last: obj.user.last_name
        },
        userId: obj.user._id,
        subMessage:"Job "+obj.job._id+"  was applied.",
        message:"Job title: " + obj.title,
        link:'/#/jobs/buyer/open',
        link_name:'Check it.',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//Ok
function job_approve(job, _ecb, _scb) {

    //console.log('Job Approve');
    //console.log('AAAA'+JSON.stringify(job));
    job = job.toJSON();
    var _options = options('Your Job was approved!', job.user.email, tpl.confirm({
        email: job.user.email,
        name: {
            first: job.user.first_name,
            last: job.user.last_name
        },
        userId: job.user._id,
        subMessage:'Your Job was approved!',
        link:'#/job/'+job._id,
        link_name:'Go to site',
        appHost: config.appHost
    }));
    //var _options = options('Approve your Job!', user.email, tpl.jobApprove({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    appHost: config.appHost
    //}));
    _send(_options, _ecb, _scb)
}

function job_reject_buyer(user, _ecb, _scb) {
    user = user.toJSON();
    //console.log('AAAA'+JSON.stringify(user));
    var _options = options('Your Job was rejected',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Your Job was rejected.',
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//ok
function job_created(params, _ecb, _scb) {

    //console.log('AAAA'+JSON.stringify(params));
    var _options = options('New Job was created.',config.adminEmail, tpl.confirm({
        name: {
            first: 'Admin'
        },
        subMessage:'New Job was created.',
        message:'Buyer id: ' + params.user + '\n' +
        'Job title: ' + params.title + '\n' +
        'Company name: ' + params.company_name,
        link:'admin/#/jobs',
        link_name:'Check it.',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//Ok
function job_reject(user, reason, _ecb, _scb) {
    user = user.toJSON();
    //var _options = options('Your Job was rejected', user.email, tpl.jobReject({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    reject_reason: reason,
    //    appHost: config.appHost
    //}));
    //console.log('AAAA'+JSON.stringify(user));

    var _options = options('Your Job was rejected',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Your Job was rejected.',
        message:'Reason: \n' +
        ' '+reason,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function job_edit(user, reject_reason, id, _ecb, _scb) {
    user = user.toJSON();
//options = options('Your Job was rejected to edit', user.email, tpl.jobEdit({
//        name: {
//            first: user.first_name,
//            last: user.last_name
//        },
//        reject_reason: reject_reason,
//        id: id,
//        appHost: config.appHost
//    }));
//    console.log('AAAA'+JSON.stringify(user));
    var _options = options('Your Job was rejected to edit',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Your Job was rejected.',
        message:'Reason: \n' +
        ' '+reject_reason,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//ok   //create and update
function contractCreate(contract, action, _ecb, _scb) {
    contract = contract.toJSON();
    //console.log('AAAA'+JSON.stringify(contract));
    //var _options = options('Contract ' + contractID + ' created!', user.email, tpl.contractCreate({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    contractID: contractID,
    //    appHost: config.appHost
    //}));
    var _options = options('Contract ' + contract._id +' was '+ action +'!',contract.buyer.email, tpl.confirm({
        name: {
            first: contract.buyer.first_name,
            last: contract.buyer.last_name
        },
        subMessage:'You successfully '+ action + ' contract ' + contract._id + ' .',
        link:'#/jobs/buyer/open',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb);
    //console.log('AAAA'+JSON.stringify(contract));
    var freelancerMsg = action == ' created'?'You apply has been accepted!':'Contract with you has been updated.';
     _options = options('Contract ' + contract._id +' was '+ action +'!',contract.seller.email, tpl.confirm({
        name: {
            first: contract.seller.first_name,
            last: contract.seller.last_name
        },
        subMessage:freelancerMsg,
        message:action == ' created'?'Was '+ action +' contract '+ contract._id + '.':'',
        link:'/#/contract/approve/'+contract._id ,
        link_name:' Go to approve or reject',
        appHost: config.appHost
    }));
    _send(_options, '', '')
}

//ok
function contractApprove(user, contractID, _ecb, _scb) {
    //user = user.toJSON();

    //var _options = options('Contract ' + contractID + ' was approved!', user.email, tpl.contractApprove({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    contractID: contractID,
    //    appHost: config.appHost
    //}));
    var _options = options('Contract ' + contractID + ' was approved!',user.buyer.email, tpl.confirm({
        name: {
            first: user.buyer.first_name,
            last: user.buyer.last_name
        },
        subMessage:'Contract ' + contractID + ' was approved.',
        link:'#/jobs/buyer/ongoing',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb);
    _options = options(' Congratulations. Contract ' + contractID + ' was started!',user.seller.email, tpl.confirm({
        name: {
            first: user.seller.first_name,
            last: user.seller.last_name
        },
        subMessage:'You have approved contract ' + contractID + '.',
        link:'#/jobs/seller/ongoing',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//Ok
function contractReject(user, contractID, reason_reject, _ecb, _scb) {
    user = user.toJSON();

    //var _options = options('Contract ' + contractID + ' was rejected!', user.email, tpl.contractReject({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    reason_reject: reason_reject,
    //    contractID: contractID,
    //    appHost: config.appHost
    //}));
    //console.log('contractReject'+JSON.stringify(user));
    var _options = options('Contract ' + contractID + ' was rejected!',user.buyer.email, tpl.confirm({
        name: {
            first: user.buyer.first_name,
            last: user.buyer.last_name
        },
        subMessage:'Contract ' + contractID + ' was rejected.',
        message:'Reason reject:\n' +
        ' '+reason_reject,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
    _options = options('Contract ' + contractID + ' was rejected!',user.seller.email, tpl.confirm({
        name: {
            first: user.seller.first_name,
            last: user.seller.last_name
        },
        subMessage:'You rejected the contract  ' + contractID + '.',
        message:'Reason reject:\n' +
        ' '+reason_reject,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}


//Ok
function contractAction(user,buyer, action,  contractID, reason_reject, _ecb, _scb) {
    //user = user.toJSON();

    //console.log('contractAction'+action, JSON.stringify(user,null,2),JSON.stringify(buyer,null,2));
    var _options = options('Contract ' + contractID + ' was '+action,user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Contract ' + contractID + ' was '+action+'.',
        message:action != ' marked as completed'? 'Reason:\n' +
        ' '+reason_reject:'Comment:\n '+reason_reject,
        link:action != ' marked as completed'?action == 'closed'?'#/jobs/seller/closed':'#/jobs/seller/ongoing':'#/jobs/buyer/ongoing',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb);
    _options = options('Contract ' + contractID + ' was '+action,buyer.email, tpl.confirm({
        name: {
            first: buyer.first_name,
            last: buyer.last_name
        },
        subMessage:'You have '+action+' the contract ' + contractID + '.',
        message:action != ' marked as completed'? 'Reason:\n' +
        ' '+reason_reject:'Comment:\n '+reason_reject,
        link:action != ' marked as completed'?action == 'closed'?'#/jobs/buyer/closed':'#/jobs/buyer/ongoing':'#/jobs/seller/ongoing',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//ok
function chatMessage(user, job, _ecb, _scb) {
    

    var _options = options('You have a message.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:job._id?'You have a message about job  ' + job._id + '.':'You have a message from another user.',
        message:job._id?'Job title: '+job.title:'',
        link:'#/messages',
        link_name:' Go to chat',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function contractSuggest(user, contractID, suggestID, _ecb, _scb) {
    user = user.toJSON();

    //var _options = options('Contract was suggested edit', user.email, tpl.contractSuggest({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    contractID: contractID,
    //    suggestID: suggestID,
    //    appHost: config.appHost
    //}));
    //console.log('AAAA'+JSON.stringify(user));
    var _options = options('Contract was suggested edit.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Contract ' + contractID + ' was suggest edit.',
        link:'#/contract/suggest/'+contractID,
        link_name:' Go to approve or reject',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function initialPayment(user,contract,payment_sum, _ecb, _scb) {
    //console.log('initialPayment'+JSON.stringify(user));
    var _options = options('Initial payment.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'You made initial payment on contract  ' + contract._id + '.',
        message:'Sum payment: '+payment_sum,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}


function invitePayment(user, _ecb, _scb) {
    user = user.toJSON();
    //console.log('AAAA'+JSON.stringify(user));
    //var _options = options('Invite payment', user.email, tpl.invitePayment({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    appHost: config.appHost
    //}));
    var _options = options('Invite payment.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        link:'#/',
        link_name:'Invite payment',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function suggestCancel(user, contractID, _ecb, _scb) {
    user = user.toJSON();

    //var _options = options('Your suggested changes was canceled', user.email, tpl.contractSuggestCancel({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    contractID:contractID,
    //    appHost: config.appHost
    //}));
    //console.log('AAAA'+JSON.stringify(user));
    var _options = options('Your suggested changes was canceled.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Your suggested changes in contract ' + contractID + ' was canceled.',
        link:'#/contract/approve/'+contractID,
        link_name:' Go to approve or reject',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function suggestApply(user, contractID, suggestID, _ecb, _scb) {
    user = user.toJSON();

    //var _options = options('Your suggested changes was applied', user.email, tpl.contractSuggestApply({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    contractID:contractID,
    //    appHost: config.appHost
    //}));
    //console.log('AAAA'+JSON.stringify(user));
    var _options = options('Your suggested changes was applied.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Your suggested changes in contract ' + contractID + ' was applied.',
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

function contractClose(user, contractID, closure, _ecb, _scb) {
    user = user.toJSON();

    //var _options = options('Contract was closed', user.email, tpl.contractClose({
    //    name: {
    //        first: user.first_name,
    //        last: user.last_name
    //    },
    //    closure_comment: closure,
    //    contractID:contractID,
    //    appHost: config.appHost
    //}));
    //console.log('AAAA'+JSON.stringify(user));
    var _options = options('Contract was closed.',user.email, tpl.confirm({
        name: {
            first: user.first_name,
            last: user.last_name
        },
        subMessage:'Contract ' + contractID + ' was closed.',
        message:'Closure comment: \n' +
        ' '+closure,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//????????????????????????????????????????????????????????????????????????????????/
function registrationSeller(freelancer, name,  _ecb, _scb) {
    freelancer = freelancer.toJSON();
    //var _options = options('Congratulations', user.email, tpl.registrationSeller({
    //    name: name,
    //    freelancer: freelancer,
    //    appHost: config.appHost
    //}));
    var _options = options('Congratulations.',user.email, tpl.confirm({
        name: {
            first: name.name
        },
        subMessage:'Thank you for registration by seller.\n' +
        "It's your new",
        registration:{
            email:user.login,
            password:user.password
        },
        link:'#/login',
        link_name:'Go to Login',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}


//ok
function newRegistration_admin(freelancer, _ecb, _scb) {
    freelancer = freelancer.toJSON();
    //var _options = options('New registration come up', config.adminEmail, tpl.newRegistration_admin({
    //    freelancer: freelancer,
    //    appHost: config.appHost
    //}));
    var _options = options('New registration come up', config.adminEmail, tpl.confirm({
        email: config.adminEmail,
        name: {
            first: 'Admin'
        },
        subMessage:'New registration come up',
        message:'Name:'+freelancer.name,
        link:'admin/#/sellers',
        link_name:'Check it',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}
//ok
function rejectAgencyRegistration(obj, _ecb, _scb) {
    //var _options = options('Registration rejected', obj.freelancer.contact_detail.email, tpl.rejectAgencyRegistration({
    //    obj: obj,
    //    appHost: config.appHost
    //}));
    var _options = options('Registration rejected.',obj.freelancer.contact_detail.email, tpl.confirm({
        name: {
            first: obj.freelancer.name
        },
        subMessage:'Your registration has been rejected!',
        message:'Reason reject:\n' +' '+ obj.freelancer.reject_reason,
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//ok
function approveAgencyRegistration(obj, email, _ecb, _scb) {
    //var _options = options('Registration approved', email, tpl.approveAgencyRegistration({
    //    obj: obj,
    //    appHost: config.appHost
    //}));

    var _options = options('Registration approved', email, tpl.confirm({
        name: {
            first: obj.freelancer.name
        },
        subMessage:'Congratulations! Your registration has been confirmed!',
        link:'#/',
        registration:{
            email:obj.email,
            password:obj.password
        },
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}
// Ok
function newClaim(obj, _ecb, _scb) {
    //var _options = options('New claim for agency', config.adminEmail, tpl.newClaim({
    //    obj: obj,
    //    appHost: config.appHost
    //}));
    var _options = options('New claim for agency', config.adminEmail, tpl.confirm({
        name: {
            first: "Admin"
        },
        subMessage:'New agency claim come up',
        link:'admin/#/business_accounts',
        link_name:'Check it',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}
//ok
function claimApproved(obj, _ecb, _scb) {
    //var _options = options('Your agency claim has been approved', obj.email, tpl.claimApproved({
    //    obj: obj,
    //    appHost: config.appHost
    //}));
    var _options = options('Your agency claim has been approved',obj.email, tpl.confirm({
        name: {
            first: obj.first_name,
            last: obj.last_name
        },
        subMessage:'Congratulations! Your agency has been claimed by you!',
        link:'#/',
        link_name:'Go to site',
        appHost: config.appHost
    }));
    _send(_options, _ecb, _scb)
}

//OK
function claimRejected(obj, _ecb, _scb) {
    //var _options = options('Your agency claim has been approved', obj.email, tpl.claimRejected({
    //    obj: obj,
    //    appHost: config.appHost
    //}));
    var _options = options('Your agency claim has been rejected.',obj.email, tpl.confirm({
        name: {
            first: obj.first_name,
            last: obj.last_name
        },
        subMessage:'Your claim has been rejected!',
        link:'#/',
        link_name:'Go to site',
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
    approveAgencyRegistration: approveAgencyRegistration,
    newClaim: newClaim,
    claimApproved: claimApproved,
    job_apply: job_apply,
    chatMessage: chatMessage,
    job_created:job_created,
    initialPayment:initialPayment,
    contractAction:contractAction,
    job_reject_buyer: job_reject_buyer,
    claimRejected: claimRejected

};