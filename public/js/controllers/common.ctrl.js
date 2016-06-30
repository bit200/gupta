/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('commonCtrl', ['$scope', 'getContent', function (scope, getContent) {
    scope.getContent = getContent
}]);
