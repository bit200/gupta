var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('loginCtrl', ['$scope', '$http', 'AuthService', '$state', function ($scope, $http, AuthService, $state) {
        $scope.signin = function (invalid, data) {
            $scope.loginError = '';
            if (invalid) return;
            $http.get('/sign-in', {params: {email: data.email, password: data.password}}).success(function (resp) {
                AuthService.setTokens({
                    accessToken: resp.data.accessToken.value,
                    refreshToken: resp.data.refreshToken.value
                });
                $state.go('home');
            }).error(function (err) {
                if (err.error == 'Item not found')
                    $scope.loginError = 'User with this login not found';
                else
                    $scope.loginError = 'Password not correct'
        });
    };
}]);
