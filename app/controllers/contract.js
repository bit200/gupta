var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , async = require('async')
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
    var STATUS = 'Seller approving';
    params.status = STATUS;
    var query = {
        freelancer: params.freelancer,
        buyer: params.buyer,
        job: params.job
    };

    if (query.buyer != req.userId) {
        m.permission_err(res, 'Another buyer');
        return;
    }

    m.findCreateUpdate(models.Contract, query, params, res, function (contract) {
        models.Contract.findOne({_id:contract._id}).populate([{
            path:'buyer',
            select:'email first_name last_name'},{
            path:'seller',
            select:'email first_name last_name'
        }]).exec(function(err,data){
            if (err) console.log('Create contract error',err);
            if (data)
                mail.contractCreate(data,' created');
        });
        updateJobApply(contract, {status: STATUS, contract: contract._id}, res, function (jobApply) {
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
    };

    m.findUpdate(models.Contract, query, {status: 'Ongoing'}, res, function (contract) {
        updateJobApply(contract, {status: 'Contract started'}, res, function () {
            res.send({
                data: contract
            });
            mail.contractApprove(contract, contract._id);
        });
    }, {populate: 'buyer seller'})
};

exports.reject_apply = function (req, res) {
    var params = m.getBody(req);
    var STATUS = 'Rejected by buyer'
    console.log("parmassssss", params)
    m.findUpdate(models.JobApply, {_id: req.params._id}, {
        status: STATUS,
        reject_reason: params.reject_reason
    }, res, function (jobApply) {
        m.findRemove(models.Contract, {job: jobApply.job, freelancer: jobApply.freelancer}, res, function (data) {
            res.send({
                data: jobApply
            })
        });

        // mail.contractReject(contract.seller, contract._id, params.text, res, m.scb(contract, res))
    }, {populate: 'seller'})
};


exports.reject_contract = function (req, res) {
    var params = m.getBody(req);
    var STATUS = 'Rejected by seller'
    m.findUpdate(models.Contract, {_id: req.params._id, seller: req.userId}, {
        status: STATUS,
        reject_reason: params.reject_reason
    }, res, function (contract) {
        updateJobApply(contract, {status: STATUS}, res, function () {
            res.send({
                data: contract
            })
        });
        mail.contractReject(contract, contract._id, params.reject_reason, '', '')
    }, {populate: 'buyer seller'})
};

exports.pause_contract = function (req, res) {
    var params = m.getBody(req);
    // console.log('asdfasdfasdfasdf', params, req.params)
    var STATUS = 'Paused'
    m.findUpdate(models.Contract, {_id: req.params._id, buyer: req.userId}, {
        status: STATUS,
        pause_reason: params.pause_reason
    }, res, function (contract) {
        res.send('ok')
        mail.contractAction(contract.seller, contract.buyer,'paused', contract._id, params.pause_reason)
    }, {populate: 'seller buyer'})
};

exports.resume_contract = function (req, res) {
    var params = m.getBody(req);
    var STATUS = 'Ongoing'
    console.log('apramaa', params)
    m.findUpdate(models.Contract, {_id: req.params._id, buyer: req.userId}, {
        status: STATUS,
        resume_reason: params.resume_reason
    }, res, function (contract) {
        res.send('ok')
        mail.contractAction(contract.seller, contract.buyer,'resumed', contract._id,params.resume_reason)
    }, {populate: 'seller buyer'})
};

exports.contract_suggest_approve = function (req, res) {
    var params = m.getBody(req);
    var STATUS = 'Ongoing'
    params = _.extend(params, params.suggest, {status: STATUS})
    console.log('Suggest ', params)
    m.findCreateUpdate(models.Contract, {_id: params._id}, params, res, function (contract) {
        updateJobApply({job: contract.job, seller: contract.seller}, {status: 'Contract started'}, res, function () {
            res.send({
                data: contract
            })
        });
        // res.send({
        //     data: contract
        // })
    })
};

exports.initial_payment = function(req,res){
    var params = m.getBody(req);
    console.log(params);
    res.send(200);
};

exports.contract_mark_complete = function (req, res) {
    var STATUS = 'Marked as completed';
    var params = m.getBody(req);
    params.status = STATUS;
    var rating = params.review || {};
    //m.findCreateUpdate(models.Contract, {_id: req.params._id}, params, res, function (contract) {
    models.Contract.findOne({_id: req.params._id}).populate([{path:'buyer'},{path:'seller'}]).exec(function(err,contract){
        contract.status = STATUS;
        contract.save();
        console.log('contract @@@', JSON.stringify(contract));
        //console.log('params @@@', params);
        var sumRating = Math.floor(_.reduce(_.values(rating), function (memo, num) {
            return memo + num
        }, 0) / 3);
        rating.buyer = contract.buyer._id;
        rating.freelancer = contract.freelancer;
        mail.contractAction(contract.buyer,contract.seller,' marked as completed',contract._id, contract.complete_comment);
        m.findCreate(models.SetRating, rating, {}, res, function (setRating) {
                m.findOne(models.User, {_id: contract.buyer._id}, res, function (buyer) {
                    m.find(models.SetRating, {buyer: buyer._id, fromType: "Seller"}, res, function (allRating) {
                        var arrFunc = [];
                        arrFunc.push(function (cb) {
                            var array = _.map(allRating, function (item) {
                                var sum = 0;
                                if(item['buyer_communication']){sum += item['buyer_communication'];}
                                if(item['job_described']){sum += item['job_described'];}
                                if(item['would_recommend']){sum += item['would_recommend'];}
                                  return parseInt(((sum) / 3).toFixed(0));
                            });
                            sumRating = (_.reduce(array, function (memo, num) {
                                return memo + num
                            }, 0) / allRating.length).toFixed(0);
                            cb()
                        });
                        async.parallel(arrFunc, function (e, r) {
                            buyer.rating = sumRating;
                            buyer.ratingCount = allRating.length;
                            m.findUpdate(models.User, {_id: contract.buyer._id}, buyer, res, function (buyer_) {
                                    m.scb(contract, res)
                            });
                        })
                    });
                });
        });
    })
};

exports.contract_edit_terms = function (req, res) {
    var params = m.getBody(req);
    var STATUS = 'Seller terms approving'
    params = _.extend(params, {status: STATUS, suggest: null})
    console.log("params", params)
    m.findCreateUpdate(models.Contract, {_id: params._id}, params, res, function (contract) {
        console.log('Contract after approve', contract)
        updateJobApply({job: m.getId(params.job), seller: m.getId(params.seller)}, {status: STATUS}, res, function () {
            res.send({
                data: contract
            })
        })

    })
};

exports.suggest_contract = function (req, res) {
    var params = m.getBody(req);
    delete params._id;
    var STATUS = 'Buyer suggest approving'
    var contractId = m.getId(params.contract)
    console.log('Suggest ', params, contractId)
    m.findCreateUpdate(models.SuggestContract, {contract: m.getId(params.contract)}, params, res, function (suggest) {
        m.findUpdate(models.Contract, {_id: contractId}, {
            suggest: suggest._id,
            status: STATUS
        }, res, function (contract) {
            updateJobApply({job: m.getId(params.job), seller: m.getId(params.seller)}, {status: STATUS}, res, function () {
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
    params.status = 'Closed';
    var rating =  params.review || {};
    m.findUpdate(models.Contract, {_id: req.params._id}, params, res, function (contract) {
        console.log('Contract',JSON.stringify(contract))
        var sumRating = Math.floor(_.reduce(_.values(rating), function (memo, num) {
            return memo + num
        }, 0) / 3);
        log('1');
        mail.contractAction(contract.seller, contract.buyer,'closed', contract._id, params.closure_comment);
        rating.buyer = contract.buyer;
        rating.freelancer = contract.freelancer;
        m.findCreate(models.SetRating, rating, {}, res, function (setRating) {
            m.findCreate(models.ReviewContract, {contract: contract._id, rating: setRating._id}, {}, {}, function () {
                m.findOne(models.Freelancer, {_id: contract.freelancer}, res, function (freelancer) {
                    m.find(models.SetRating, {freelancer: freelancer._id, fromType:{$exists:false}}, res, function (allRating) {
                        var arrFunc = [];
                        arrFunc.push(function (cb) {
                            var array = _.map(allRating, function (item) {
                                var sum = 0;
                                if(item['seller_communication']){sum += item['seller_communication'];}
                                if(item['service_and_described']){sum += item['service_and_described'];}
                                if(item['would_recommend']){sum += item['would_recommend'];}
                                    return parseInt(((sum) / 3).toFixed(0));
                            });
                            sumRating = (_.reduce(array, function (memo, num) {
                                return memo + num
                            }, 0) / allRating.length).toFixed(0);
                            cb()
                        });
                        async.parallel(arrFunc, function (e, r) {
                            freelancer.rating = sumRating;
                            freelancer.ratingCount = allRating.length;
                            m.findUpdate(models.Freelancer, {_id: contract.freelancer}, freelancer, res, function (freelancer) {
                                m.findUpdate(models.JobApply, {contract: contract._id}, {status: 'closed'}, res, function (job) {
                                    m.scb(contract, res)
                                })
                            });
                        })
                    });
                });
            });
        })
    },{populate:'buyer seller'})
};

exports.update_contract = function (req, res) {
    var params = m.getBody(req);
    var id = params._id;
    delete params._id;
    m.findUpdate(models.Contract, {_id: id, buyer: req.userId}, params, res, function (contract) {
        mail.contractCreate(contract,' updated',res,res);
    }, {populate: 'seller buyer'})
};

exports.delete_contract = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Contract, {_id: params._id, buyer: req.userId}, res, res)
};


exports.detailed = function (req, res) {
    var params = req.params

    m.findOneOwner(models.Contract, {_id: params._id}, res, function (contract) {
        res.send({
            data: contract
        })
    }, {req: req, populate: 'buyer seller freelancer job suggest'})
};

exports.findContract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Contract, {job: params.job, freelancer: params.freelancer}, res, function (contract) {
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

exports.reviewContract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.ReviewContract, {contract: params._id}, res, res, {populate: 'rating'})
};


exports.addReview = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.ReviewContract, {_id: params._id}, res, function (contract) {
        contract.messages.push(params.text)
        m.findUpdate(models.ReviewContract, {_id: params._id}, {messages: contract.messages}, res, res)
    })
};

exports.rejectJob = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Contract, {_id: params._id, seller: req.userId}, {status: 'approve'}, res, function (contract) {
        m.findUpdate(models.Job, {contract: contract._id}, {status: 'applied'}, res, function () {
            res.send({
                data: contract
            });
            mail.job_reject_buyer(contract.seller, res, m.scb(contract))
        })
    }, {populate: 'seller'})

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
        m.findOneOwner(models.Contract, {_id: params.id, buyer: req.userId}, res, function (contract) {
            mail.suggestCancel(contract.seller, contract._id, res, m.scb(contract, res))
        }, {req: req, populate: 'seller'})
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
    var params = m.getBody(req)
    console.log('@@@@@@@@@@@@@@@@', params)
    m.findOne(models.SuggestContract, {_id: params.suggest}, res, res, {populate: 'contract'})
};