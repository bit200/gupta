/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCloseCtrl', ['$scope', '$location', '$http', 'getContent', function (scope, location, http, getContent) {
    scope.job = getContent.job.data.data;
    scope.send = function(comments){
        comments.id = scope.job.contract;
        http.post('/contract/close', comments).then(function(resp){
            console.log('resp',resp)
        }, function(err){
            console.log('err',err)
        })
    }
}]);
