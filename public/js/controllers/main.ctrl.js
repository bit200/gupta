'use strict';

angular.module('XYZCtrls').controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', 'safeApply', function (scope, rootScope, location, http, safeApply) {
    scope.headerSearch = '';

    scope.headerSubmit = function (search) {
        location.path('/category/' + search);
        scope.headerSearch = ''
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
