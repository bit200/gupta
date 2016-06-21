'use strict';
var contract = require('../controllers/contract');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/contract/create', auth.token, contract.create_contract);
    app.get('/contract/approve', auth.token, contract.approve_contract);
    app.post('/contract/update', auth.token, contract.update_contract);
    app.post('/contract/delete', auth.token, contract.delete_contract);
    app.post('/contract/reject', auth.token, contract.reject_contract);
    app.post('/contract/suggest', auth.token, contract.suggest_contract);
    app.get('/contract', auth.token, contract.get_contract);
};