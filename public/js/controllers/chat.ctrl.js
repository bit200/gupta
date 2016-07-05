
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('chatCtrl', ['$scope', '$location', '$http', 'socket','$state', 'AuthService', function (scope, location, http, socket, state, AuthService) {
        console.log(AuthService.currentUser());
        scope.join = {_id:state.params._id};
}]);