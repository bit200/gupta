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
        http.get('/get-filters').then(function(resp){
            scope.filters = resp.data.data;
            console.log(scope.filters)
        }, function(err){
            console.log('error',err)
        });

        this.settings = {
            printLayout: true,
            showRuler: true,
            showSpellingSuggestions: true,
            presentationMode: 'edit'
        };

        this.sampleAction = function(name, ev) {
            $mdDialog.show($mdDialog.alert()
                .title(name)
                .textContent('You triggered the "' + name + '" action')
                .ok('Great')
                .targetEvent(ev)
            );
        };
    }]);
