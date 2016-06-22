'use strict';

angular.module('XYZCtrls').controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', 'safeApply', function (scope, rootScope, location, http, safeApply) {
    scope.setAuth = function () {
        rootScope.auth123 = window.localStorage.getItem('accessToken');

        safeApply.run(rootScope);
    }
    rootScope.$on("$routeChangeStart", function (event, next, current) {
        //..do something
        scope.setAuth()
        //event.stopPropagation();  //if you don't want event to bubble up
    });

    scope.formCorrect = false;
    scope.setAuth()


    scope.logout = function () {
        localStorage.clear();
        scope.setAuth()
        location.path('/login')
    };

    scope.homePage = function () {
        location.path('/home')
    };

    scope.showMessage = false;
    scope.startInput = function () {
        if (!scope.loginForm) scope.loginForm = {};
        scope.loginForm.$invalid = false;
        scope.error = "";
        scope.errL = false;
        scope.errP = false;
        scope.submitted = false;
    }
}]);
