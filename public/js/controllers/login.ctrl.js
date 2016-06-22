angular.module('XYZCtrls').controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$http',
    function (scope, rootScope, location, http) {
        scope.signin = function (invalid, data) {

            if (invalid) {
                scope.formCorrect = true;
                return;
            }
            http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
                    if (resp.status == 200) {
                        localStorage.setItem('accessToken', resp.data.data.accessToken.value);
                        localStorage.setItem('refreshToken', resp.data.data.refreshToken.value);
                        location.path('home')
                    }
                },
                function (err) {
                    if (err.data.error == 'Item not found') {
                        scope.error = 'User with this login not found';
                        scope.errL = true;
                        scope.loginForm.$invalid = true;
                    } else {
                        scope.errP = true;
                        scope.loginForm.$invalid = true;
                        scope.error = 'Password not correct'
                    }
                })
        };

    }]);