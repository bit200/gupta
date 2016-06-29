angular.module('XYZApp').run(function ($timeout, $rootScope, $location, AuthService, $state) {
    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.isLogged = AuthService.isLogged;

    $rootScope.$state = $state
    
    $rootScope.go = function (path) {
        $location.path(path)
    }
    
    $rootScope.getContent = function(getContent, field) {
        return getContent[field] && getContent[field].data ? getContent[field].data.data : null
    }

    $rootScope.scrollToErr = function () {
        $timeout(function () {
            angular.element("body").animate({scrollTop: angular.element('.has-error').eq(0).offset().top - 100}, "slow");
        }, 500)
    };

    $rootScope.getBuyerName = function(buyer) {
        return buyer.first_name && buyer.last_name ? [buyer.first_name, buyer.last_name].join(' ') : ''
    }
   
});