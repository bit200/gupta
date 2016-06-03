var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('underscore')
    , fs = require('fs')
    , asyc = require('async')
    , path = require('path');


exports.index = function (req, res) {
    res.render('src')
};

exports.create_filter = function (req, res) {
    var arrFunc = [];
    arrFunc.push(function (cb) {
        var arr = ['Blogs and Articles', 'Copywriting / Web Content', 'Technical Writing', 'Press Release Writing', 'Proof Reading', 'Books and Magazines', 'Translation'];
        findCreateFilter('ContentWriting', 'Content Type', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel & Tourism', 'Education', 'Technology', 'Science', 'Real Estate',
            'Automotive', 'Food and Beverages', 'Media and Entertainment', 'Lifestyle'];
        findCreateFilter('ContentWriting', 'Industry Expertise', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
            'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];
        findCreateFilter('ContentWriting', 'Languages', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel and Tourism', 'Education',
        'Technology', 'Science', 'Real Estate', 'Automotive', 'Food and Beverages', 'Lifestyle', 'Mobile and Gadgets',
        'Fashion and Beauty', 'Cooking', 'Vernacular Language', 'Books and Reading'];
        findCreateFilter('BloggersAndInfluencers', 'Industry Expertise', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Web Blog', 'Video Blog', 'Social Influencer'];
        findCreateFilter('BloggersAndInfluencers', 'Blog Type', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
            'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];
        findCreateFilter('Country','', arr, cb)
    });

    asyc.parallel(arrFunc, function(e,r){
        m.scb('done', res)
    })
};

exports.get_content = function (req, res) {
    var params = m.getBody(req);
    m.distinct(models[params.name], JSON.parse(params.query), params.distinctName, res, res)
};


function findCreateFilter(name, filter, arr, cb) {
    var count = 0;
    _.forEach(arr, function (item) {
        m.findCreate(models[name], {name: item}, {filter: filter, isActive: true}, {}, function(){
            count++;
            if(arr.length == count){
                cb()
            }
        })
    });
}

//exports.unit_tests = function (req, res) {
//    res.render('unit-tests/unit-tests.html')
//};
//
//exports.run_test = function (req, res) {
//    var mocha = new Mocha({
//        reporter: 'mochawesome',
//        reporterOptions: {
//            reportDir: 'public/unit-tests',
//            reportName: 'unit-tests',
//            reportTitle: 'Unit tests What-Song-API'
//        }
//    });
//    mocha.addFile(
//        path.join('test', 'AllTest.js')
//    );
//
//    mocha.run(function (err) {
//        m.scb({err: err}, res)
//    })
//};