'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Controllers */
var XYZCtrls = angular.module('XYZCtrls', []);

XYZCtrls.controller('MainCtrl', ['$scope', '$rootScope', '$http', function (scope, rootScope, http) {
    scope.signin = function(data){
        console.log('DATA', data);
        http.get('/sign-in', {params:{login:data.login, password:data.password}}).then(function(resp){
            console.log("RESPPPSPS", resp)
        })
    };

    scope.registration = function(data) {
        http.post('/sign-up', data).then(function(resp){
            console.log("RESPPPSPS", resp),function(err, r){
                console.log('dlkjgsl', err,r)
            }
        })
    }

    scope.arrayProviders = ['Content Writing', 'Creative and Ad Making', 'Public Relations', 'Bloggers and Influencers',
    'Digital Marketing', 'Branding Services', 'Event Management', 'Direct Marketing', 'Media Planning', 'Media B']
}]);




