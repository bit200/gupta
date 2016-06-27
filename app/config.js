var ip = require('ip')
isInTest = typeof global.it === 'function';
var path = require('path');

var resObj = {
    root: path.normalize(__dirname + '/../'),
    root_app: __dirname + '/',
    'secret': 'iamyoursecret',
    'database': 'mongodb://localhost/XYZ',
    'isInTest': isInTest,
    isLocalhost: ip.address().indexOf('192.168.') > -1,
    noreply : 'The Media Ant <noreply@themediaant.com>',
    help : 'The Media Ant <help@themediaant.com>',
    m20Help : 'M20 <help@m20.in>',
    appHost : 'http://localhost:8080',
    apiHost : "http://139.162.29.37:9000",
    adminJWTSecret: 'asdasdADS23432dsfds1111',
    adminEmail: 'roruslanvl@gmail.com',
    smtp:{
        host: "smtp.gmail.com",
        auth: {
            user: "themediaant777@gmail.com",
            pass: "xyzonline"
        }
    }
};

if (process.env.NODE_ENV=='production'){
    resObj.appHost = 'http://52.221.227.52:8080',
    resObj.apiHost = "http://52.221.227.52:8080"
}

module.exports = resObj;
