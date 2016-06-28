/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('ViewMyJobCtrl', ['$scope', 'info', function (scope, info) {
    scope.info = info
}]);
