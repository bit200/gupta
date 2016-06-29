var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', 'ModalService', '$rootScope', 'AuthService',
    function (scope, $location, http, ModalService, $rootScope, AuthService) {
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
    }]);
