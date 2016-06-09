var XYZAdminCtrls = angular.module('XYZAdminCtrls', [])

XYZAdminCtrls.controller('loginCtrl', ['$location', '$timeout', '$scope', '$http',
    function ($location, $timeout, scope, $http) {
        scope.auth = localStorage.getItem('accessToken') ? $location.path('/main') : false;
        scope.login = {};
        scope.loginSend = function (data) {
            $('.login-login').removeClass('failed');
            $('.login-password').removeClass('failed');

            $http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
                localStorage.setItem("accessToken", resp.data.data.accessToken.value);
                localStorage.setItem("refreshToken", resp.data.data.refreshToken.value);
                scope.auth = true;
                scope.MainContentLoaded = true;
                $location.path('/main')
            }, function (error) {
                $location.path('/login');
                if (error.data.error == 'Item not found') {
                    $('.login-login').addClass('failed');
                }
                if (error.data.error == 'Wrong password') {
                    $('.login-password').addClass('failed')
                }
                scope.MainContentLoaded = true

            });
            scope.login.password = '';
        };
        scope.logout = function (e) {
            localStorage.clear();
            scope.auth = false;
        };
    }]);

XYZAdminCtrls.controller('mainCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope', '$q', 'getContent', 'parseType',
    function ($location, $timeout, scope, $http, rs, $q, getContent, parseType) {
        scope.isActive = {
            users:true,
            claim: false
        };

        scope.choice = function(choice){
            _.forEach(scope.isActive, function(value, key){
                scope.isActive[key] = false
            });
            scope.isActive[choice] = true;
        };

        scope.logout = function (e) {
            localStorage.clear();
            scope.auth = false;
        };
        scope.resObj = {};
        scope.delete = false;
        scope.users = parseType.users(getContent.users.data.data);
        scope.agency = parseType.claim(getContent.agency.data.data);
        scope.approved = function (user, i) {
            $http.get('/approved', {params: {username: user.username}}).then(function (resp) {
                scope.users[i] = parseType.users([resp.data.data])[0];
            }, function (err) {
            })
        };

        scope.rejectUser = function (data, i) {
            $http.get('/reject', {params: {username: scope.check.user.username, reject_reason: data}}).then(function(resp) {
                scope.users[scope.check.i] = parseType.users([resp.data.data])[0];
                scope.reject = false;
            }, function(err){
                console.log(err)
            })
        };

        scope.showReject = function (bol, user, i) {
            scope.reject_text = '';
            scope.reject = bol;
            scope.check = {
                user: user,
                i: i
            }
        };

    }]);

