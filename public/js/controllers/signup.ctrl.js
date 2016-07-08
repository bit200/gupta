var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('signupCtrl', ['$scope', '$state', 'AuthService', '$http', function ($scope, $state, AuthService, $http) {
    var q = {};

    $scope.signup = function (invalid, data) {
        $scope.emailError = '';
        if (invalid) return;
        $http.post('/sign-up', data).success(function (resp) {
            AuthService.setTokens({
                accessToken: resp.data.accessToken.value,
                refreshToken: resp.data.refreshToken.value
            });
            $state.go('home')
        }).error(function (err) {
            if (err.errors && err.errors.email)
                $scope.emailError = 'The email already in use'
        })
    };
}])
