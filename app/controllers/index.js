var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , Mocha = require('mocha')
    , fs = require('fs')
    , path = require('path');

exports.doc = function (req, res) {
    res.render('index')
};

exports.index = function (req, res) {
    res.render('src')
};

exports.unit_tests = function (req, res) {
    res.render('unit-tests/unit-tests.html')
};

exports.run_test = function (req, res) {
    var mocha = new Mocha({
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: 'public/unit-tests',
            reportName: 'unit-tests',
            reportTitle: 'Unit tests What-Song-API'
        }
    });
    mocha.addFile(
        path.join('test', 'AllTest.js')
    );

    mocha.run(function (err) {
        m.scb({err: err}, res)
    })
};