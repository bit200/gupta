var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('chatCtrl', ['$scope', '$location', '$http', '$timeout', 'socket', '$state', 'AuthService', 'getContent', function (scope, location, http, $timeout, socket, state, AuthService, getContent) {
    scope.rooms = getContent.rooms.data.data;
    if (localStorage.getItem('currentChat')) {
        scope.chat = localStorage.getItem('currentChat');
        scope.active = localStorage.getItem('currentChat');
    } else {
        scope.chat = '';
    }
    scope.click = function (item) {
        scope.chat = false;
        $timeout(function () {
            scope.active = item;
            scope.chat = item;
        }, 0)
    };
}]);