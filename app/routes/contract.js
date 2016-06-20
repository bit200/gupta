'use strict';
var contract = require('../controllers/contract');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/contract/create', auth.token, contract.create_contract);
    app.post('/contract/update', auth.token, contract.update_contract);
    app.post('/contract/delete', auth.token, contract.delete_contract);
};