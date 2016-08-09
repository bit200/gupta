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
    
    scope.setActiveProvider = function(key, provider){

        $rootScope.activeProvider = {
            name: angular.copy(key),
            values: angular.copy(provider)
        };



    };

    scope.goCategories = function(){
        // if ($state.current.name != 'categories')
            var obj = {};
            if ($rootScope.activeProvider.name)
                obj.type = $rootScope.activeProvider.name.split(' ').join('-').toLowerCase();
                obj.filter = $rootScope.activeProvider.subName ? $rootScope.activeProvider.subName.split(' ').join('-').toLowerCase():'';
            $state.go('categories',obj)
    };

    scope.checkCategoryPage = function(){
        
    }
}]);


/*

Слушай, щас будет странный вопрос, мне интересен ответ. Вопрос чисто информационного характера, ничего и никого он не изменит.  Только прошу ответить максимально честно. Нравлюсь ли я тебе как парень?
 */