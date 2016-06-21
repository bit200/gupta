/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('forgotCtrl', ['$scope', '$location', '$http', '$routeParams', function (scope, location, http, routeParams) {
    scope.send = true;
    scope.submitted = false;
    scope.button = 'Send';
    scope.restore = function (invalid, email) {
        scope.error = "";
        if (invalid) return;
        scope.button = 'Wait';
        http.get('/send-restore', {params: {email: email}}).then(function (resp) {
            scope.send = false;
        }, function (err) {
            scope.button = 'Send';
            scope.error = "Email not found!"
        })
    };
    scope._restore = false;
    scope.restorePassword = function (password) {
        http.get('/restore', {
            params: {
                restore_code: routeParams.restoreCode,
                password: password
            }
        }).then(function (resp) {
            scope._restore = true;
            scope.restoreText = 'Password have been changed.'
        }, function (err) {
            scope.restoreText = 'Password was changed by this restore code'
        })
    }
}]);
