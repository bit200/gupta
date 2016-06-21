/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.isAuth = function () {
        return true;
        //return getContent.user.data.data;

    }

}]);
