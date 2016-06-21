/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('confirmCtrl', ['$scope', '$location', '$http', '$routeParams', 'ngDialog', function (scope, location, http, routeParams, ngDialog) {
    http.get('/confirm', {params: {confirm_code: routeParams.confirmCode}}).then(function (resp) {
        scope.text = 'Congratulations, you have verified your account';
    }, function (err) {
        scope.error = true;
        scope.text = "Oops! Verification already carried out or an invalid verification code."
    });
}]);
