var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', 'ModalService', '$rootScope', 'AuthService',
    function (scope, $location, http, ModalService, $rootScope, AuthService) {

    scope.logout = AuthService.logout;
    scope.showAuth = AuthService.showLogin;
}]);
