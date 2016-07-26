'use strict';

angular.module('XYZCtrls').controller('MainCtrl', ['$scope', '$rootScope', '$location', '$state', 'cfpLoadingBar', function (scope, $rootScope, location, $state, cfpLoadingBar) {
    scope.headerSearch = '';
    scope.headerSubmit = function (search) {
        location.path('/category/' + search);
        scope.headerSearch = '';
    };
    $rootScope.activeProvider = {};
    
    scope.showMessage = false;
    scope.startInput = function () {
        if (!scope.loginForm) scope.loginForm = {};
        scope.loginForm.$invalid = false;
        scope.error = "";
        scope.errL = false;
        scope.errP = false;
        scope.submitted = false;
    }

    scope.setSubMenu = function(filter){
        $rootScope.activeProvider.subName = filter;
    };
    
    scope.setSubSubMenu = function(subV){
        $rootScope.activeProvider.subSubName = subV;
    };
    
    scope.setActiveProvider = function(key, provider){
        $rootScope.activeProvider = {
            name: angular.copy(key),
            values: angular.copy(provider)
        };
    };

    scope.goCategories = function(){
        if ($state.current.name != 'categories')
            $state.go('categories')
    };

    scope.checkCategoryPage = function(){
        
    }
}]);
