var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', 'ModalService', '$rootScope', 'AuthService', '$mdMenu',
    function (scope, $location, http, ModalService, $rootScope, AuthService, $mdMenu) {
        scope.logout = AuthService.logout;
        scope.showAuth = AuthService.showLogin;
        scope.arrayProviders = [];
        http.get('/get-content', {
            params: {
                name: 'ServiceProvider',
                query: {},
                distinctName: 'name'
            }
        }).then(function(resp){
            scope.arrayProviders = resp.data.data;
        }, function(err){
        });
        http.get('/get-filters').then(function(resp){
            scope.filters = resp.data.data;
        }, function(err){
        });
        
        scope.getKey = function(obj){
            return Object.keys(obj)[0]
        }
        
       

    }]);
