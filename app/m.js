var _ = require('underscore')
    , each = require('async-each-series')
    , async = require('async')
    , fs = require('fs')
    , mkdirp = require('mkdirp')
    , config = require('../app/config')
    , redis = require('../app/redis');

function res_send(status, obj, res) {

    var params = _.extend({
            data: obj,
            success: status == 200
        }, {
            server_response_time: new Date().getTime() - res._start_time
        }
    )
    if (status != 200) {
        params.error = params.error || params.data;
        delete params.data;
    }

    //if (res._token_end_time) {
    //    params.server_token_checking_time = res._token_end_time - res._token_start_time
    //}
    res.status(status).send(params)
}

function ecb(status, obj, cb) {
    if (typeof cb == 'function') {
        cb(status, obj)
    } else if (cb && cb.send) {
        res_send(status, obj, cb)
    }
}

function scb(obj, cb) {
    if (typeof cb == 'function') {
        cb(obj)
    } else if (cb && cb.send) {
        res_send(200, obj, cb)
    }
}

function found_scb(obj, text, cb) {
    if (typeof cb == 'function') {
        cb(obj)
    } else if (cb && cb.send) {
        if (obj.length) {
            res_send(200, obj, cb)
        } else {
            res_send(200, text, cb)
        }
    }
}

function _mongoose_cb_handler(err, data, _ecb, _scb, params) {
    if (err) {
        ecb(398, err, _ecb)
    } else if (!data) {
        params = params || {};
        err = params['not_found'] ? params['not_found'] : 'Item not found'
        console.log('ERR1',err, _ecb)
        ecb(397, err, _ecb)
    } else {
        scb(data, _scb)
    }
}

function distinct(model, query, fieldName, _ecb, _scb) {
    if (!model) {
        ecb(399, 'Model not found', _ecb)
        return;
    }
    model.find(query).select(fieldName).exec(function (err, items) {
        _mongoose_cb_handler(err, _.map(items, function (item) {
            return item[fieldName]
        }), _ecb, _scb)
    })
}

function find(model, query, _ecb, _scb, params) {
    params = params || {};
    params.skip = +params.skip;
    params.limit = +params.limit;
    if (!model) {
        ecb(399, 'Model not found', _ecb);
        return;
    }
    model
        .find(query)
        .sort(params.sort)
        .skip(params.skip)
        .limit(params.limit)
        .select(params.select || params.fields)
        .populate(params.populate || '')
        .exec(function (err, items) {
            _mongoose_cb_handler(err, items, _ecb, _scb, params)
        })
}

function findLean(model, query, _ecb, _scb, params) {
    params = params || {};
    params.skip = parseInt(params.skip);
    params.limit = parseInt(params.limit);
    if (!model) {
        ecb(399, 'Model not found', _ecb)
        return;
    }
    model
        .find(query)
        .sort(params.sort)
        .skip(params.skip)
        .limit(params.limit)
        .select(params.select || params.fields)
        .populate(params.populate || '')
        .lean()
        .exec(function (err, items) {
            _mongoose_cb_handler(err, items, _ecb, _scb, params)
        })
}
function permission_err (res, mess) {
    res.status(350).send({
        data: {
            permission_error: true,
            mess: mess
        },
        permission_error: true
    })
}
function save(model, _ecb, _scb, params) {
    params = params || {};
    model.save(function (err, data) {
        data = data && data.publish && params.publish ? data.publish() : data
        _mongoose_cb_handler(err, data, _ecb, _scb, params)
    })
}

function findOneEmpty(model, query, _ecb, _scb, params) {
    findOne(model, query, function(){
        scb(null, _scb)
    }, _scb, params)
}
function findOneOwner(model, query, _ecb, _scb, params) {
    findOne(model, query, _ecb, function(item){
        console.log('is owner', item, params.userId)
        var req = params.req
        var userId = params.userId || req.userId

        if (isOwner(item, userId)) {
            scb(item, _scb)
        } else {
            scb({
                data: {
                    permission_error: true
                },
                permission_error: true
            }, _scb)
        }
    }, params)
}
function findOne(model, query, _ecb, _scb, params) {
    params = params || {};
    if (!model) {
        ecb(399, 'Model not found', _ecb);
        return;
    }
    model
        .findOne(query)
        .sort(params.sort)
        .select(params.select || params.fields)
        .populate(params.populate || '')
        .exec(function (err, data) {
            data = data && data.publish && params.publish ? data.publish() : data
            _mongoose_cb_handler(err, data, _ecb, _scb, params)
        })
}

function count(model, new_params, _ecb, _scb, params) {
    if (!model) {
        ecb(399, 'Model not found', _ecb);
        return;
    }
    model.count(new_params, function (err, data) {
        _mongoose_cb_handler(err, data, _ecb, _scb, params)
    })
}

function create(model, new_params, _ecb, _scb, params) {
    params = params || {};
    new_params = new_params || [];
    model.create(new_params, function (err, data) {
        data = data && data.publish && params.publish ? data.publish() : data
        _mongoose_cb_handler(err, data, _ecb, _scb, params)
    })
}

function insertMany(model, new_params, _ecb, _scb, params) {
    if (!model) {
        ecb(399, 'Model not found', _ecb);
        return;
    }
    var err
    var arrOfResults = new_params || [];

    var N = 2500;
    var count = 0;
    var c = Math.round(arrOfResults.length / N) + 1;
    var l = arrOfResults.length;
    var fakeArr = [];
    fakeArr.length = c;

    each(fakeArr, function (item, callback) {
        var sliced = arrOfResults.slice(count, count + N);
        count = count + N;
        if (sliced.length != 0) {
            model.create(sliced, function (_err, data) {
                err = _err || err;
                log('Insert Items', count, ' / ', l);
                setTimeout(function () {
                    callback()
                }, 250)
            })
        } else {
            callback()
        }
    }, function (e) {
        if (err) {
            ecb(398, err, _ecb)
        } else {
            scb({count: arrOfResults.length}, _scb)
        }
    });
}

function findUpdate2(model, query, new_params, _ecb, _scb, params) {
    findOne(model, query, _ecb, function (item) {
        item = _.extend(item, new_params);
        save(item, _ecb, _scb, params)
    })

}

function findUpdate(model, query, new_params, _ecb, _scb, params) {
    params = params || {};
    var publish
    if (params.publish){
        publish = true
        delete params.publish
    }
    findOne(model, query, _ecb, function (item) {
        item = _.extend(item, new_params);
        save(item, _ecb, function(item){
            if (params.populate) {
                item.populate(params.populate, function(err, b) {
                    if (publish)
                        delete item.password
                    if (err) {
                        ecb(398, item, _ecb)
                    } else {
                        scb(item, _scb)
                    }
                })
            } else {
                scb(item, _scb)
            }
        }, params)
    }, params);
}


function findUpdateWithToken(model, _token, query, new_params, _ecb, _scb, params) {
    redis.get('token_' + _token, function (err, r) {
        if (err || !r) {
            return res.status(401).send({
                success: false,
                message: "Failed to authenticate the token."
            });
        }
        var arr = r.split('_');

        var token = _token;
        var userId = arr[0];
        var userRole = arr[1];
        if (userRole != 'ADMIN') {
            query = _.extend(query, {contributer_user: userId})
        }
        findOne(model, query, _ecb, function (item) {
            item = _.extend(item, new_params);
            save(item, _ecb, _scb, params)
        }, params)
    })
}
function getId (item) {
    return item ? item._id || item : item
}
function isOwner (item, user1, user2) {
    user1 = getId(user1)
    user2 = getId(user2)
    var users_arr = []
    if (user1) {
        users_arr.push(user1)
    }
    if (user2) {
        users_arr.push(user2)
    }
    var flag
    _.each(['freelancer', 'buyer', 'seller', 'user'], function(field){
        var _item = item[field]
        var _item_id = getId(_item)

        _.each(users_arr, function(id){
            if (id == _item_id) {
                flag = true
            }
        })
    })
    return flag
}

function findCreateUpdate(model, query, new_params, _ecb, _scb, params) {
    new_params = _.extend({}, query, new_params);
    findOne(model, query, function (code, err) {
        if (code == 397) {
            create(model, new_params, _ecb, _scb, params)
        } else {
            ecb(code, err, _ecb)
        }
    }, function (item) {
        item = _.extend(item, new_params);
        save(item, _ecb, _scb, params)
    })
}


function _findCreateUpdate(model, query, _ecb, _scb, params, upsert) {
    upsert = upsert || true;
    model.update(query, {$inc: params}, {upsert: upsert}, function (err, item) {
            if (err) {
                ecb(398, err, _ecb)
            } else {
                scb(item, _scb)
            }
        }
    )
}


function findCreate(model, query, new_query, _ecb, _scb, params) {
    new_query = _.extend({}, query, new_query);
    findOne(model, query, function (code, err) {
        if (code == 397 || query == {}) {
            create(model, new_query, _ecb, _scb, params)
        } else {
               ecb(code, err, _ecb)
        }
    }, _scb)
}

function findRemove(model, query, _ecb, _scb) {
    find(model, query, _ecb, function (items) {
        var _err;
        var _data = [];
        var index = -1;
        var count = items.length;

        cb()

        items && items.forEach(function (item) {
            item.remove(function (err) {
                if (err) {
                    _err = err;
                    item = item.toJSON();
                    item.REMOVE_ERROR = true;
                }
                _data.push(item)
                cb()
            })
        });


        function cb() {
            index++;
            if (index == count) {
                _mongoose_cb_handler(_err, _data, _ecb, _scb);
            }
        }
    })
}

function getUserIDByToken(token) {
    redis.get('token_' + token, function (err, r) {
        if (err || !r) {
            return false
        }
        var arr = r.split('_');
        return arr[0];
    })
}

function redis_pub(item, bad_list, white_list) {
    var obj_pub = {};
    bad_list = _.union(bad_list, ['__v', 'created_at']);
    if (white_list) {
        for (var key in item) {
            if (white_list.indexOf(key) > -1) {
                obj_pub[key] = item[key]
            }
        }
        return obj_pub;
    }
    for (var key in item) {
        if (bad_list.indexOf(key) < 0) {
            obj_pub[key] = item[key]
        }
    }
    return obj_pub;
}


function parallel_limit(params) {
    params = params || {};
    var fn = params.fn,
        items = params.items,
        limit = params.limit,
        timeout = params.timeout,
        mcb = params.cb,
        arr = [];

    items && items.forEach(function (item, i) {
        arr.push(function (callback) {
            if (timeout) {
                setTimeout(function () {
                    fn && fn(callback, item, i)
                }, timeout)
            } else {
                fn && fn(callback, item, i)
            }
        })
    });

    async.parallelLimit(arr, limit,
        function (err, results) {
            mcb && mcb(err, results)
        });
}

function redisHgetall(arr, query, text, _ecb, _scb, params) {
    params = params || {};
    arr = arr || [];
    var response = [];
    var count = 0;
    if (!arr.length) {
        found_scb([], text, _scb)
    }
    _.each(arr, function (id) {
        redis.hgetall(query.name + '|' + id[query.key], function (e, r) {
            if (e) {
                ecb(390, e, _ecb)
            }
            response.push(r);
            count++;
            if (count == arr.length) {
                if (params.skip) {
                    response = response.slice(params.skip)
                }
                if (params.limit) {
                    if (response.length > params.limit) {
                        response = response.slice(0, params.limit)
                    }
                }
                if (params.fields) {
                    params.fields = params.fields.split(',');
                    response = _.map(response, function (item) {
                        return _.pick(item, params.fields)
                    })
                }
                found_scb(response, text, _scb)
            }
        })
    });
}

function redisMembers(name, type, _ecb, _scb) {
    var count = 0
        , response = [];
    redis.multi()
        .smembers(name)
        .exec(function (err, r) {
            r = _.flatten(r);
            _.each(r, function (el) {
                redis.hgetall(type + '|' + el[0], function (e, res) {
                    if (e) {
                        ecb(390, e, _ecb)
                    }
                    res = _.extend(res, {_id: el[0]});
                    response.push(res);
                    count++;
                    if (count == r.length) {
                        _scb(response)
                    }
                })
            });
        });
}

function getIDs(name, field, id, _cb) {
    var count = 0
        , arr = [];
    fs.readFile(config.root + 'public/api/' + name + '/0', 'utf8', function (err, data) {
        if (data.length <= 2) {
            return _cb && _cb(null, []);
        }
        data = JSON.parse(data);
        _.each(data, function (el) {
            count++
            if (el[field] && el[field] == id) {
                arr.push(el)
            }
            if (data.length == count) {
                _cb && _cb(null, arr)
            }
        });

    })
}


function deleteRedis(name, cb) {
    redis.del(name, cb)
}

function putInRedisOneItem(item, name, cb) {
    var bad_list = ['__v', '$__', '_posts', '_pres', 'collection', 'db', '_doc', 'isNew',
        'errors', 'discriminators', 'id', 'schema'];
    bad_list = _.union(bad_list, _.functions(item));
    if (item && item._id) {
        var arr = [];
        for (var key in redis_pub(item, bad_list)) {
            if (key && item[key]) {
                arr.push(key.toString());
                if (item[key] && item[key].toString().match(/(\w{3})(\s)(\w{3})(\s)(\w{2})(\s)(\w{4})(\s)(\w{2})(:)(\w{2})(:)(\w{2})(\s)(\w{3})(\+)(\w{4})(\s)(\()(\w{3})(\))/i)) {
                    arr.push(new Date(item[key].toString()).getTime().toString())
                } else {
                    arr.push(item[key].toString())
                }
            }
        }
        async.parallel([
            function (_cb) {
                redis.hmset(name + '|' + item._id.toString(), arr, _cb)
            },
            function (_cb) {
                redis.sadd(name + 's_ids', item._id, _cb);
            }
        ], cb)
    } else {
        cb && cb()
    }
}


function putInRedis(model, name, _scb) {
    findLean(model, {}, null, function (items) {
        parallel_limit({
            fn: function (mcb, item, i) {
                log('iteration', i);
                var bad_list = ['__v', '$__', '_posts', '_pres', 'collection', 'db', '_doc']
                if (item && item._id) {
                    var arr = [];
                    for (var key in redis_pub(item, bad_list)) {
                        if (key && item[key]) {
                            arr.push(key.toString())
                            if (item[key] && item[key].toString().match(/(\w{3})(\s)(\w{3})(\s)(\w{2})(\s)(\w{4})(\s)(\w{2})(:)(\w{2})(:)(\w{2})(\s)(\w{3})(\+)(\w{4})(\s)(\()(\w{3})(\))/i)) {
                                arr.push(new Date(item[key].toString()).getTime().toString())
                            } else {
                                arr.push(item[key].toString())
                            }
                        }
                    }
                    async.parallel([
                        function (_cb) {
                            redis.hmset(name + '|' + item._id.toString(), arr, _cb)
                        },
                        function (_cb) {
                            redis.sadd(name + 's_ids', item._id, _cb);
                        }
                    ], mcb)
                } else {
                    mcb && mcb()
                }
            },
            items: items,
            limit: 2000,
            cb: function (e, r) {
                scb('done', _scb)
            }
        })
    });
}

function getJson(model_name, name, query, params, _cb) {
    var models = require('../app/db');
    query = query || {};
    params = params || {};
    params.limit = params.limit || 250;
    find(models[model_name], query, null, function (items) {
        mkdirp(config.root + 'public/api/' + name, function (e, r) {
            fs.writeFile(config.root + 'public/api/' + name + '/0',
                JSON.stringify(items), function (err) {
                    _cb && _cb()
                });
        });
    }, params);
}

function historyIP(ip, cb) {
    redis.hgetall('history|' + ip, function (e, r) {
        if (!r) {
            redis.hmset('history|' + ip, ['data', _.now()], cb([_.now()]));
            redis.sadd('history_ips', ip);
        }
        var data = r.data.split('|');
        if (data.length = config.number) {
            data.pop()
        }

        data.unshift(_.now());
        redis.hmset('history|' + ip, ['data', data.join('|')], cb(data));
        redis.sadd('history_ips', ip);
    });
}

function isBan(ip, cb) {
    historyIP(ip, function (data) {
        if (_.first(data) - _.last(data) < config.requestTime) {
            redis.hmset('ban|' + ip, ['timeBan', _.now()], cb);
            redis.sadd('ban_ips', ip);
        } else {
            cb()
        }
    })
}

function banIP(ip, _ecb, cb) {
    redis.hgetall('ban|' + ip, function (e, r) {
        if (r == null) {
            cb()
        } else {
            if ((_.now() - r.timeBan) < config.timeBan) {
                ecb(350, 'ban', _ecb)
            } else {
                cb()
            }
        }
    })
}


function isEmptyObj(v) {
    try {
        r = Object.keys(v).length < 1;
    } catch (e) {
        return true;
    }
    return r;
}

function getBody(req) {
    return isEmptyObj(req.query) ? req.body || {} : req.query
}


function _findRemove(model, query, _ecb, _scb, params) {
    model.remove(query, function (err, result) {
        if (err) {
            ecb(398, err, _ecb)
        } else {
            scb(result, _scb)
        }
    })
}

function createToken(models, user, _ecb, _scb) {
    var query = {user: user._id, role: 'user'}
    findCreate(models.AccessToken, query, null, _ecb, function (accessToken) {
        findCreate(models.RefreshToken, query, null, _ecb, function (refreshToken) {
            scb({
                accessToken: accessToken.publish(),
                refreshToken: refreshToken.publish(),
                user: user.publish()
            }, _scb)
        })
    })
}



module.exports = {
    res_send: res_send,
    ecb: ecb,
    scb: scb,
    found_scb: found_scb,
    getBody: getBody,

    count: count,
    find: find,
    distinct: distinct,
    findLean: findLean,
    findOneEmpty: findOneEmpty,
    findOneOwner: findOneOwner,
    findUpdate2: findUpdate2,
    findOne: findOne,
    save: save,
    create: create,
    insertMany: insertMany,
    findRemove: findRemove,
    _findRemove: _findRemove,
    redis_pub: redis_pub,
    parallel_limit: parallel_limit,
    redisHgetall: redisHgetall,
    redisMembers: redisMembers,
    getIDs: getIDs,
    getId: getId,
    putInRedis: putInRedis,
    putInRedisOneItem: putInRedisOneItem,
    deleteRedis: deleteRedis,
    getJson: getJson,
    isBan: isBan,
    banIP: banIP,
    getUserIDByToken: getUserIDByToken,

    isOwner: isOwner,
    permission_err: permission_err,
    permission_error: permission_err,

    findUpdate: findUpdate,
    // findUpdateOwner: findUpdateOwner,
    findUpdateWithToken: findUpdateWithToken,
    _findCreateUpdate: _findCreateUpdate,
    findCreateUpdate: findCreateUpdate,
    findCreate: findCreate,
    createToken: createToken
};