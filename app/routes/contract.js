'use strict';
var contract = require('../controllers/contract');


module.exports = function (app) {
    var auth = require('./middlewares/auth');

    app.get('/contract/approve', auth.token, contract.approve_contract);
    app.post('/contract/update', auth.token, contract.update_contract);
    app.post('/contract/delete', auth.token, contract.delete_contract);
    app.post('/contract/reject', auth.token, contract.reject_contract);

    app.post('/api/contract/approve/:_id', auth.token, contract.approve_contract);
    app.post('/api/contract/reject/:_id', auth.token, contract.reject_contract);
    app.post('/api/job-apply/reject/:_id', auth.token, contract.reject_apply);
    app.post('/api/contract/pause/:_id', auth.token, contract.pause_contract);
    app.post('/api/contract/resume/:_id', auth.token, contract.resume_contract);
    app.post('/api/contract/suggest', auth.token, contract.suggest_contract);

    app.post('/api/contract/close/:_id', auth.token, contract.close_contract);
    app.post('/contract/suggest', auth.token, contract.suggest_contract);
    app.post('/contract/close', auth.token, contract.close_contract);
    app.post('/contract/suggest-apply', auth.token, contract.suggest_contract_apply);
    app.get('/contract/suggest-cancel', auth.token, contract.suggest_contract_cancel);
    app.get('/contract', auth.token, contract.get_contract);
    app.get('/api/suggest', auth.token, contract.get_suggest);
    app.post('/api/contract', auth.token, contract.create_contract);
    app.get('/api/contract/detailed/:_id', auth.freelancer_token, contract.detailed);
    app.get('/api/contract/suggest-from-seller/detailed/:_id', auth.freelancer_token, contract.detailed);

};