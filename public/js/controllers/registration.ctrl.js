/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('RegistrationCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.registration = function (invalid, data) {
        if (invalid) return;
        http.post('/sign-up', data).then(function (resp) {
                location.path('/')
            }, function (err, r) {
            }
        )
    };
}]);