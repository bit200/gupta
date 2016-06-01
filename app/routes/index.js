'use strict';
var index = require('../controllers/index');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/doc',  index.doc);
    app.get('/', index.index);
    app.get('/unit-tests', index.unit_tests);
    app.get('/run-tests', index.run_test);
};

