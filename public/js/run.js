angular.module('XYZApp').run(function ($rootScope, $location, AuthService, $route) {
    $rootScope.isLogged = AuthService.isLogged;
    $rootScope.go = function (path) {
        $location.path(path)
    }
});