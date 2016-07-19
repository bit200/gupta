'use strict';

angular.module('XYZCtrls').controller('MainCtrl', ['$scope', '$rootScope', '$location', '$state', function (scope, $rootScope, location, $state) {
    scope.headerSearch = '';
    // function fbEnsureInit(callback) {
    //     if(!window.fbApiInit) {
    //         setTimeout(function() {fbEnsureInit(callback);}, 50);
    //     } else {
    //         if(callback) {
    //             callback();
    //         }
    //     }
    // }
    // fbEnsureInit(function() {
    // });

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
