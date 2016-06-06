var XYZAdminCtrls = angular.module('XYZAdminCtrls', [])

XYZAdminCtrls.controller('loginCtrl', ['$location', '$timeout', '$scope', '$http',
    function ($location, $timeout, scope, $http) {
        scope.auth = localStorage.getItem('accessToken') ? true : false;
        scope.login = {};
        scope.loginSend = function (data) {
            $('.login-login').removeClass('failed');
            $('.login-password').removeClass('failed');

            $http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
                localStorage.setItem("accessToken", resp.data.data.accessToken.value);
                localStorage.setItem("refreshToken", resp.data.data.refreshToken.value);
                scope.auth = true;
                scope.MainContentLoaded = true

            }, function (error) {


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

XYZAdminCtrls.controller('mainCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope',
    function ($location, $timeout, scope, $http, rs) {
        scope.resObj = {};
        scope.delete = false;

        scope.users = [{name:'q',email:'asdasd@asdasd.er', isConfirm:true},{name:'q',email:'asdasd@asdasd.er', isConfirm:true},{name:'q',email:'asdasd@asdasd.er', isConfirm:true}]
    }])
;

