/* Controllers */

angular.module('XYZCtrls').controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', 'safeApply', function (scope, rootScope, location, http, safeApply) {
    scope.setAuth = function () {
        rootScope.auth123 = window.localStorage.getItem('accessToken');

        safeApply.run(rootScope);
    }
    rootScope.$on("$routeChangeStart", function (event, next, current) {
        scope.setAuth()
    });

    scope.formCorrect = false;
    scope.setAuth()

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

    scope.logout = function () {
        localStorage.clear();
        scope.setAuth();
        location.path('/login')
    };

    scope.homePage = function () {
        location.path('/home')
    };

    scope.showMessage = false;
    scope.startInput = function () {
        scope.loginForm.$invalid = false;
        scope.error = "";
        scope.errL = false;
        scope.errP = false;
        scope.submitted = false;
    }
}]);