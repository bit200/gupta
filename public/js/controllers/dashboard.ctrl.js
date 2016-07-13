/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', 'AuthService',
    function (scope, rootScope, $http, AuthService) {
        scope.currentFreelancer = AuthService.currentFreelancer
    }]);
