var CronJob = require('cron').CronJob
    , models = require('./db')
    , async = require('async')
    , _ = require('underscore')
    , m = require('./m');


new CronJob('* * * * * 5', clear_tokens, null, true);


function clear_tokens() {
    m.findRemove(models.AccessToken, {
        expire_date: {$lte: new Date()}
    }, null, function (items) {
    })

    m.findRemove(models.RefreshToken, {
        expire_date: {$lte: new Date()}
    }, null, function (items) {
    })
}


module.exports = {
    clear_tokens: clear_tokens
};