log = console.log;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var express = require('express')
    , app  = express()
    , cors = require('cors')
    , http = require('http').Server(app)
    , socket = require('./app/socket')
    , mail = require('./app/mail')
    , bodyParser = require('body-parser')
    , morgan = require('morgan')
    , mongoose    = require('mongoose')
    , config = require('./app/config')
    , path = require('path')
    , consolidate = require('consolidate')
    , port = process.env.PORT || 8080
    , fs = require('fs')
    , autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect(config.database);
autoIncrement.initialize(connection);

var models_path = __dirname + '/app/models';
var walkModels = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walkModels(newPath);
        }
    });
};
walkModels(models_path);

app.use(cors());
app.use(function(req, res, next){
    res._start_time = new Date().getTime();
    next()
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.set('views', __dirname + '/public');
app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.use('/', express.static(__dirname + '/public'));

var routes_path = __dirname + '/app/routes';
var walkRoutes = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(app);
            }
        } else if (stat.isDirectory() && file !== 'middlewares') {
            walkRoutes(newPath);
        }
    });
};
walkRoutes(routes_path);

require('./scripts/set-filters')(function(){
    socket.boot(http);

    http.listen(port,function() {
        console.log('Listening on port '+port+'...')
    });


    var cron = require('./app/cron');
});


module.exports = app;

