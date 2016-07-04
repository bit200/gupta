var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('underscore');

function updateJobApply(contract, params, ecb, scb) {
    var query = {
        job: m.getId(contract.job),
        // contract: contract._id,
        seller: m.getId(contract.seller)
    }
    m.findCreateUpdate(models.JobApply, query, params, ecb, scb)
}

exports.create_contract = function (req, res) {
    var params = m.getBody(req);
    params.status = 'seller approving'
    var query = {
        freelancer: params.freelancer,
        buyer: params.buyer,
        job: params.job
    }

    if (query.buyer != req.userId) {
        m.permission_err(res, 'Another buyer')
        return;
    }

    console.log("craete contractttttttt", query)
    m.findCreateUpdate(models.Contract, query, params, res, function (contract) {
        console.log('contractttttttttt', contract)
        updateJobApply(contract, {status: 'seller approving', contract: contract._id}, res, function(jobApply){
            console.log("seller approving", jobApply)
            res.send({
                data: contract
            })
        })
    })
};

exports.approve_contract = function (req, res) {
    var query = {
        _id: req.params._id,
        seller: req.userId
    }

    m.findUpdate(models.Contract, query, {status: 'ongoing'}, res, function (contract) {
        updateJobApply(contract, {status: 'contract started'}, res, function(){
            res.send({
                data: contract
            })
        })
    }, { populate: 'buyer' })
};

exports.reject_apply = function (req, res) {
    var params = m.getBody(req);
    console.log("parmassssss", params)
    m.findUpdate(models.JobApply, {_id: req.params._id}, {
        status: 'rejected',
        reject_reason: params.reject_reason
    }, res, function (jobApply) {
        res.send({
            data: jobApply
        })
        // mail.contractReject(contract.seller, contract._id, params.text, res, m.scb(contract, res))
    }, {populate: 'seller'})
};


exports.reject_contract = function (req, res) {
    var params = m.getBody(req);

    m.findUpdate(models.Contract, {_id: req.params._id, seller: req.userId}, {
        status: 'rejected',
        reject_reason: params.reject_reason
    }, res, function (contract) {
        updateJobApply(contract, {status: 'contract rejected'}, res, function(){
            res.send({
                data: contract
            })
        })
        // mail.contractReject(contract.seller, contract._id, params.text, res, m.scb(contract, res))
    }, {populate: 'seller'})
};

exports.pause_contract = function (req, res) {
    var params = m.getBody(req);
    console.log('asdfasdfasdfasdf', params, req.params)
    m.findUpdate(models.Contract, {_id: req.params._id, buyer: req.userId}, {
        status: 'paused',
        pause_reason: params.pause_reason
    }, res, function (contract) {
        res.send('ok')
        // mail.contractReject(contract.seller, contract._id, params.text, res, m.scb(contract, res))
    }, {populate: 'seller'})
};

exports.resume_contract = function (req, res) {
    var params = m.getBody(req);
    console.log('apramaa', params)
    m.findUpdate(models.Contract, {_id: req.params._id, buyer: req.userId}, {
        status: 'ongoing',
        resume_reason: params.resume_reason
    }, res, function (contract) {
        res.send('ok')
        // mail.contractReject(contract.seller, contract._id, params.text, res, m.scb(contract, res))
    }, {populate: 'seller'})
};

exports.suggest_contract = function (req, res) {
    var params = m.getBody(req);
    delete params._id;
    var STATUS = 'suggest approving'
    console.log('Suggest ', params)
    m.findCreateUpdate(models.SuggestContract, {contract: m.getId(params.contract)}, params, res, function (suggest) {
        m.findUpdate(models.Contract, {_id: params.contract}, {
            suggest: suggest._id,
            status: STATUS
        }, res, function (contract) {
            updateJobApply(contract, {status: STATUS}, res, function(){
                res.send({
                    data: suggest
                })
            })
        })
    })
};

exports.close_contract = function (req, res) {
    var params = m.getBody(req);
    delete params._id;
    params.status = 'closed'
    m.findUpdate(models.Contract, {_id: req.params._id, buyer: req.userId}, params, res, function (contract) {
        m.findUpdate(models.Job, {contract: contract._id}, {status: 'closed'}, res, function (job) {
            params.job = job._id;
            m.create(models.Comments, params, res, function () {
                mail.contractClose(contract.seller, contract._id, params.closure, res, m.scb(contract, res))
            })
        })
    }, {populate: 'seller'})
};

exports.update_contract = function (req, res) {
    var params = m.getBody(req);
    var id = params._id;
    delete params._id;
    m.findUpdate(models.Contract, {_id: id, buyer: req.userId}, params, res, function (contract) {
        mail.contractCreate(contract.seller, contract._id, res, m.scb(contract, res))
    }, {populate: 'seller'})
};

exports.delete_contract = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Contract, {_id: params._id, buyer: req.userId}, res, res)
};



exports.detailed = function (req, res) {
    var params = req.params

    m.findOne(models.Contract, {_id: params._id}, res, function (contract) {

        if (m.isOwner(contract, req.userId, req.freelancerId)) {
            res.send({
                data: contract
            })
        } else {
            res.status(400).send({
                data: 'Another owner'
            })
        }
    }, {populate: 'buyer seller freelancer job suggest'})

};

exports.rejectJob = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Contract, {_id: params._id, seller: req.userId}, {status: 'approve'}, res, function (contract) {
        m.findUpdate(models.Job, {contract: contract._id}, {status: 'applied'}, res, function () {
            res.send({
                data: contract
            })
            // mail.invitePayment(contract.buyer, res, m.scb(contract))
        })
    }, {populate: 'buyer'})

};



exports.suggest_contract_apply = function (req, res) {
    var params = m.getBody(req);
    delete params.suggest._id;
    var item = _.extend(params.suggest.contract, params.suggest);
    m.findUpdate(models.Contract, {
        _id: params.suggest.contract._id,
        buyer: req.userId
    }, item, res, function (contract) {
        m.findOne(models.Job, {contract: contract._id}, res, function () {
            mail.suggestApply(contract.seller, contract._id, res, m.scb(contract, res))
        })
    }, {populate: 'seller'})
};

exports.suggest_contract_cancel = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.SuggestContract, {_id: params.id}, res, function () {
        m.findOne(models.Contract, {_id: params.id, buyer: req.userId}, res, function (contract) {
            mail.suggestCancel(contract.seller, contract._id, res, m.scb(contract, res))
        }, {populate: 'seller'})
    })
};


exports.get_contract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Contract, {
        _id: params._id, $or: [
            {seller: req.userId},
            {buyer: req.userId}
        ]
    }, res, res)
};


exports.get_suggest = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.SuggestContract, {_id: params._id}, res, res, {populate: 'contract'})
};