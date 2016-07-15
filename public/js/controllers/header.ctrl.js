var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', 'ModalService', '$rootScope', 'AuthService', 'socket', 'breadCrumbs', '$state',
    function (scope, $location, http, ModalService, $rootScope, AuthService, socket, breadCrumbs, $state) {
        scope.logout = AuthService.logout;
        //scope.showAuth = AuthService.showLogin;
        scope.showAuth = function (text) {
            $location.path('/' + text)
        };
        scope.arrayProviders = [];
        http.get('/get-content', {
            params: {
                name: 'ServiceProvider',
                query: {},
                distinctName: 'name'
            }
        }).then(function (resp) {
            scope.arrayProviders = resp.data.data;
        }, function (err) {
        });

        scope.getKey = function (obj) {
            return Object.keys(obj)[0]
        };
        var id = AuthService.userId();
        
        socket.emit('i online', id);
        setInterval(function () {
            socket.emit('ping online', id)
        }, 5000);

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                scope.subway = breadCrumbs.returnWay(toState.name, $rootScope.asView.buyer ? 'Buyer' : 'Seller')
            })
    }]);
