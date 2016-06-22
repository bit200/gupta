/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('viewMyJobCtrl', ['$scope', '$location', '$http', 'getContent','parseType','parseTime',  function (scope, location, http, getContent, parseType,parseTime) {
    scope.jobs = {}
    console.log(getContent.jobs.data.data)
    scope.jobs.Open = parseType.openJob(getContent.jobs.data.data, parseTime);
    scope.jobs.Ongoing = parseType.ongoingJob(getContent.jobs.data.data);
    scope.jobs.Closed = parseType.closedJob(getContent.jobs.data.data);
    scope.status = 'Open';
}]);
