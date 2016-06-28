/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('viewMyJobCtrl', ['$scope', '$location', '$http', 'getContent', 'parseType', 'parseTime', function (scope, location, http, getContent, parseType, parseTime) {
    scope.jobs = {}
    scope.jobs.Open = parseType.openJob(getContent.jobs.data.data, parseTime);
    scope.jobs.Ongoing = parseType.ongoingJob(getContent.jobs.data.data);
    scope.jobs.Closed = parseType.closedJob(getContent.jobs.data.data);
    scope.status = 'Open';



    scope.totalItems = 64;
    scope.currentPage = 4;

    scope.setPage = function (pageNo) {
        scope.currentPage = pageNo;
    };

    scope.pageChanged = function() {
        $log.log('Page changed to: ' + scope.currentPage);
    };

    scope.maxSize = 7;
    scope.bigTotalItems = 6555;
    scope.bigCurrentPage = 20 ;


}]);
