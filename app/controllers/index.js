var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('underscore')
    , fs = require('fs')
    , async = require('async')
    , path = require('path')
    , nodeExcel = require('excel-export');


exports.dev = function (req, res) {
    res.render('../public/index.dev.html')
};
exports.get_locations = function (req, res) {
    models.Location.find({}).exec(function (err, result) {
        res.jsonp(result)
    });
};
exports.get_languages = function (req, res) {
    models.Languages.find({}).exec(function (err, result) {
        res.jsonp(result)
    });
};
exports.common_filters = function (req, res) {
    models.Filters.find().lean().exec(function (err, filters) {
        var resObj = _.groupBy(filters, 'type');
        _.each(resObj, function (value, key) {
            var tArr = _.groupBy(value, 'filter');
            resObj[key] = [];
            _.each(tArr, function (v, k) {
                if (!k) {
                } else {
                    resObj[key].push({
                        name: v[0].filter,
                        order: v[0].order,
                        filter_order: v[0].filter_order

                    });
                }
            })
        });
        res.jsonp(resObj);
    });
};

exports.excel = function (req, res) {
    var params = m.getBody(req);
    var query = {};
    if(params.type != 'user'){
        query.type = params.type
    }
    m.find(models[params.model], query, res, function (resp) {
        var conf = {};
        // conf.stylesXmlFile = "../styles.xml";
        conf.name = "sheet";
        conf.rows = [];
        if (params.model == 'Freelancer') {
            conf.cols = [
                {caption: '_id', width: 30},
                {caption: 'Name', width: 30},
                {caption: 'Actual Name', width: 30},
                {caption: 'Type', width: 30},
                {caption: 'Introduction', width: 30},
                {caption: 'Description', width: 30},
                {caption: 'Location', width: 30},
                {caption: 'Cities', width: 30},
                {caption: 'Experience', width: 30},
                {caption: 'Languages', width: 30},
                {caption: 'Url', width: 30},
                {caption: 'Address', width: 30},
                {caption: 'Phone', width: 30},
                {caption: 'Employees', width: 30},
                {caption: 'Admin notes', width: 30},
                {caption: 'Sorted', width: 30},
                {caption: 'Price', width: 30},
                {caption: 'Price description', width: 30},
                {caption: 'Price rate', width: 30},
                {caption: 'Translation', width: 30},
                {caption: 'Profile', width: 30},
                {caption: 'Verified', width: 30},
                {caption: 'Number employees', width: 30},
                {caption: 'Registration status', width: 30},
                {caption: 'Status', width: 30},
                {caption: 'Reject reason', width: 30},
                {caption: 'isActive', width: 30},
                {caption: 'Rating', width: 30},
                {caption: 'Rating count', width: 30},
                {caption: 'Popularity', width: 30},
                {caption: 'Views', width: 30},
                {caption: 'Created at', width: 30}
            ];
            _.each(resp, function (data) {
                conf.rows.push(parseFreelacer(data));
            });
        } else {
            conf.cols = [
                {caption: '_id', width: 30},
                {caption: 'Email', width: 30},
                {caption: 'First Name', width: 30},
                {caption: 'Last Name', width: 30},
                {caption: 'Type', width: 30},
                {caption: 'Restore code', width: 30},
                {caption: 'Phone number', width: 30},
                {caption: 'Admin notes', width: 30},
                {caption: 'Company name', width: 30},
                {caption: 'Status', width: 30},
                {caption: 'Rating', width: 30},
                {caption: 'Rating count', width: 30},
                {caption: 'First Sign in', width: 30},
                {caption: 'Created at', width: 30}
            ];
            _.each(resp, function (data) {
                conf.rows.push(parseUser(data));
            });
        }
        var result = nodeExcel.execute(conf);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "table.xlsx");
        res.end(result, 'binary');
    }, {populate: 'past_clients service_packages work contact_detail user business_account'})
};


function parseUser(user) {
    var obj = {
        id: user._id || '-',
        email: user.email || '-',
        first_name: user.first_name || '-',
        last_name: user.last_name || '-',
        type: user.type || '-',
        restore_code: user.restore_code || '-',
        phone: user.phone || '-',
        admin_notes: user.admin_notes || '-',
        company_name: user.company_name || '-',
        status: user.status || '-',
        rating: (user.rating || 0).toString(),
        ratingCount: (user.ratingCount).toString(),
        first_signin: (user.first_signin).toString(),
        created_at: user.created_at || '-'
    };
    return _.toArray(obj)
}
function parseFreelacer(freelancer) {
    var obj = {
        id: freelancer._id || "-",
        name: freelancer.name || "-",
        actual_name: freelancer.actual_name || "-",
        type: freelancer.type || "-",
        introduction: freelancer.introduction || "-",
        description: freelancer.description || "-",
        location: freelancer.location || "-",
        cities: freelancer.cities.join(', ') || "-",
        experience: (freelancer.experience || '-').toString(),
        languages: freelancer.languages.join(', ') || "-",
        url: freelancer.url || "-",
        address: freelancer.address || "-",
        phone: freelancer.phone || "-",
        employees: (freelancer.employees || 0).toString(),
        admin_notes: freelancer.admin_notes || "-",
        sorted: (freelancer.sorted || 0).toString(),
        price: (freelancer.price.price || 0).toString(),
        price_description: freelancer.price.description || "-",
        price_rate: (freelancer.price_rate || 0).toString(),
        translation: freelancer.translation.join(', ') || "-",
        profile: freelancer.profile || "-",
        verified: freelancer.verified || false,
        number_employees: (freelancer.number_employees || 0).toString(),
        registrationStatus: (freelancer.registrationStatus || 0).toString(),
        status: freelancer.status || " ",
        reject_reason: freelancer.reject_reason || " ",
        isActive: (freelancer.isActive || 0).toString(),
        rating: (freelancer.rating || 0).toString(),
        ratingCount: (freelancer.ratingCount || 0).toString(),
        popularity: (freelancer.popularity || 0).toString(),
        views: (freelancer.views || 0).toString(),
        created_at: freelancer.created_at || " "
    };
    return _.toArray(obj)

}

exports.admin = function (req, res) {
    res.render('admin/index')
};
exports.admin_login = function (req, res) {
    res.render('admin/login/login')
};

exports.get_content = function (req, res) {
    var params = m.getBody(req);
    m.distinct(models[params.name], JSON.parse(params.query), params.distinctName, res, res)
};

exports.get_filters = function (req, res) {
    m.find(models.Filters, {}, res, function (Arr) {
        var arr = []
        _.each(Arr, function (item) {
            //Create obj by type service provider
            if (checkObj(arr, item.type) < 0) {
                var obj = {};
                obj[item.type] = {arr: []};
                arr.push(obj)
            }
            //Create obj if type have filter
            if (item.filter) {
                if (!_.has(arr[checkObj(arr, item.type)][item.type], item.filter)) {
                    var obj = {};
                    arr[checkObj(arr, item.type)][item.type][item.filter] = {arr: []};
                }

                if (item.isActive) {
                    arr[checkObj(arr, item.type)][item.type][item.filter].arr.push(item.name)
                }
            } else {
                if (item.isActive) {
                    arr[checkObj(arr, item.type)][item.type].arr.push(item.name)
                }
            }
        });
        m.scb(arr, res)
    })
};

function checkObj(arr, objName) {
    var result = -1;

    _.each(arr, function (obj, i) {
        if (_.has(obj, objName)) {
            result = i

        }
    });

    return result;
}

exports.header_text = function (req, res) {
    var params = m.getBody(req);
    if (!params.type) {
        m.findOne(models.Filters, {order: 0}, {}, function (filter) {
            m.findOne(models.HeaderText, {type: filter.type}, res, res)
        })
    } else {
        m.findOne(models.HeaderText, {type: params.type}, res, res)
    }

};

exports.get_client = function (req, res) {
    m.find(models.Client, {}, res, res)
};

exports.search = function (req, res) {
    var result = {};
    async.parallel([
        function (cb) {
            models.Filters.find({name: new RegExp(req.query.query, "i")}).exec(function (err, filters) {
                result.filters = _.map(filters, function (item) {
                    return {
                        displayTitle: item.type + (item.filter ? ' > ' + item.filter : '') + ' > ' + item.name,
                        filter_name: item.name,
                        service_provider: item.type,
                        filter_type: item.filter,
                        type: 'filters'
                    }
                });
                cb();
            })
        },
        function (cb) {
            models.Filters.find({type: new RegExp(req.query.query, "i")}).distinct('type', function (err, services) {
                result.services = _.map(services, function (item) {
                    return {
                        displayTitle: item,
                        type: 'service_provider'
                    }
                });
                cb();
            })
        },
        function (cb) {
            models.Freelancer.find({name: new RegExp(req.query.query, "i")}).select('name').limit(5).exec(function (err, freelancers) {
                result.freelancers = _.map(freelancers, function (item) {
                    return {
                        _id: item._id,
                        displayTitle: item.name,
                        type: 'freelancers'
                    }
                });
                cb();
            })
        },
        function (cb) {
            models.Job.find({title: new RegExp(req.query.query, "i")}).select('title').limit(5).exec(function (err, jobs) {
                result.jobs = _.map(jobs, function (item) {
                    return {
                        _id: item._id,
                        displayTitle: item.title,
                        type: 'jobs'
                    }
                });
                cb();
            })
        }
    ], function () {
        res.jsonp(result)
    })
};

exports.get_agency = function (req, res) {
    async.waterfall([
        function (cb) {
            if (!req.userId) return cb(null, [])
            models.BusinessUser.find({user: req.userId}).exec(function (err, businessUsers) {
                cb(null, _.map(businessUsers, function (businessUser) {
                    return businessUser.agency
                }))
            });
        },
        function (linkedAgencies, cb) {
            models.Freelancer.find({type: 'agency'}).populate('poster contact_detail').exec(function (err, freelancers) {
                res.json({
                    linkedAgencies: linkedAgencies || [],
                    agencies: freelancers
                });
                cb()
            });
        }
    ]);
};
