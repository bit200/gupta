var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('loginCtrl', ['$scope', '$location', '$http', '$stateParams', function ($scope, location, http, stateParams) {
        var q = {};
        $scope.signin = function (invalid, data) {
            $scope.loginError = '';
            if (invalid) return;
            $http.get('/sign-in', {params: {email: data.email, password: data.password}}).success(function (resp) {
                resObj.setTokens({
                    accessToken: resp.data.accessToken.value,
                    refreshToken: resp.data.refreshToken.value
                });
                $scope.close(q)
            }).error(function (err) {
                if (err.error == 'Item not found')
                    $scope.loginError = 'User with this login not found';
                else
                    $scope.loginError = 'Password not correct'
            });
        };
}])
