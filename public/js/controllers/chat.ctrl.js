var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('chatCtrl', ['$scope', '$location', '$http', '$timeout', 'socket', '$state', 'AuthService', 'getContent', function (scope, location, http, $timeout, socket, state, AuthService, getContent) {
    scope.rooms = getContent.rooms.data.data;
    scope.chat = '';
    scope.click = function (item) {
        scope.chat = false;
        $timeout(function(){
            scope.chat = item;

        },0)
    };
}]);