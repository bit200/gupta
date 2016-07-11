var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('chatCtrl', ['$scope', '$location', '$http', '$timeout', 'socket', '$state', 'AuthService', 'getContent', function (scope, location, http, $timeout, socket, state, AuthService, getContent) {
    scope.rooms = getContent.rooms.data.data;
    scope.currentFreelancer = AuthService.currentFreelancer();
    scope.checkContract = function(job, freelancer){
        http.get('/api/contract/find', {params:{job:job,freelancer:freelancer}}).then(function(resp){
            scope.contract = {
                url: '/#/contract/'+resp.data.data._id,
                text: 'View detail contract'
            }
        }, function(err){
            scope.contract = {
                url: '/#/contract/create/'+job + '/' +freelancer,
                text: 'Create contract'
            }
        })
    };

    if (localStorage.getItem('currentChat')) {
        var item = localStorage.getItem('currentChat');
        scope.chat = item;
        scope.active = item;
        scope.currentJob = _.find(scope.rooms, function(num){ return num._id == item}).job;
        scope.checkContract(scope.currentJob._id, scope.currentFreelancer._id)
    } else {
        scope.chat = '';
    }
    scope.click = function (item) {
        scope.chat = false;
        scope.currentJob = _.find(scope.rooms, function(num){ return num._id == item; }).job;
        scope.checkContract(scope.currentJob._id, scope.currentFreelancer._id);
        $timeout(function () {
            scope.active = item;
            scope.chat = item;
            localStorage.setItem('currentChat', item);
        }, 0)
    };


}]);