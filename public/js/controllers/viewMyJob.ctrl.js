/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('ViewMyJobCtrl', ['$scope', 'info', '$rootScope', function (scope, info, rootScope) {
    var user_type = info.user_type
    var job_type = info.job_type
    

    info.template = info.template || [user_type, job_type].join('-')
    info.header = info.header || job_type + ' jobs'
    info.url = info.url || ['/api', 'jobs', user_type, job_type].join('/')
    scope.info = info
    // scope.selected = info
    rootScope.info = info
    
}]);
