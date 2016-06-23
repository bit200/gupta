var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', 'ModalService', '$rootScope', 'AuthService',
    function (scope, $location, http, ModalService, $rootScope, AuthService) {

    scope.logout = function(){
      AuthService.logout();
    };

    scope.showAuth = function(redirectTo){
        ModalService.showModal({
            templateUrl: "template/modal/auth.html",
            controller: function ($scope, close, $element) {
                var q = {};
                if (redirectTo) q = {redirectTo: redirectTo}
                $scope.signin = function (invalid, data) {
                    $scope.loginError = '';
                    if (invalid) return;
                    http.get('/sign-in', {params: {login: data.login, password: data.password}}).success(function (resp) {
                        AuthService.setTokens({
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
                $scope.signup = function (invalid, data) {
                    $scope.emailError = '';
                    if (invalid) return;
                    http.post('/sign-up', data).success(function (resp) {
                        AuthService.setTokens({
                            accessToken: resp.data.accessToken.value,
                            refreshToken: resp.data.refreshToken.value
                        });
                        $scope.close(q)
                    }).error(function (err) {
                        if (err.errors.email)
                            $scope.emailError = 'The email already in use'
                    })
                };
                $scope.close = function(res){
                    $element.modal('hide');
                    close(res, 200)
                }
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result.redirectTo)
                    $location.path(result.redirectTo)

            });
        });
    };
    $rootScope.$on('show-auth', function(event, args){
        scope.showAuth(args.redirectTo)
    });
}]);
