angular.module('XYZApp').run(function ($rootScope, $location, AuthService) {
    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.isLogged = AuthService.isLogged;
    $rootScope.go = function (path) {
        $location.path(path)
    }

   
});