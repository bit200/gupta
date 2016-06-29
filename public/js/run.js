angular.module('XYZApp').run(function ($rootScope, $location, AuthService) {
    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.isLogged = AuthService.isLogged;
    $rootScope.go = function (path) {
        $location.path(path)
    }
    
    $rootScope.getContent = function(getContent, field) {
        return getContent[field].data.data
    }

    $rootScope.getBuyerName = function(buyer) {
        return buyer.first_name && buyer.last_name ? [buyer.first_name, buyer.last_name].join(' ') : ''
    }
   
});