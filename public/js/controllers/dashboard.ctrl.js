/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', 'AuthService',
    function (scope, rootScope, $http, AuthService) {
        scope.currentFreelancer = AuthService.currentFreelancer;

        function changeLinks(bol){
            if(bol){
                $http.get('/api/count/buyer', {params:{id:AuthService.userId()}}).then(function(resp){
                    scope.count = resp.data.data
                });
                scope.job_open = 'jobs_list.buyer_open';
                scope.job_ongoing = 'jobs_list.buyer_ongoing';
                scope.job_closed = 'jobs_list.buyer_closed';
            } else {
                $http.get('/api/count/seller', {params:{id:AuthService.userId()}}).then(function (resp) {
                    scope.count = resp.data.data
                });
                scope.job_open = 'jobs_list.seller_open';
                scope.job_ongoing = 'jobs_list.seller_ongoing';
                scope.job_closed = 'jobs_list.seller_closed';
            }
        }

        changeLinks(rootScope.asView.buyer);
        rootScope.$watch('asView.buyer', function(e,data){
            changeLinks(e)
        }, 0)
    }]);
