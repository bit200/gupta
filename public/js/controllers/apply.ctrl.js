/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('applyCtrl', ['$scope', '$rootScope', '$location', '$http', 'getContent', 'ModalService', '$timeout', function (scope, rootScope, location, http, getContent, ModalService, $timeout) {
    console.log("get contntntntntntntnt", getContent)

    scope.estimations = [
        'Less then 1 week',
        'Less then 1 month',
        '1 to 3 months',
        '3 to 6 months',
        'More than 6 months'
    ]

    scope.types = [
        'Agency',
        'Freelancer'
    ]

    
    scope.new_apply = rootScope.getContent(getContent, 'apply')
    scope.new_job = scope.new_apply.job

    scope.i = getContent.i
    
    console.log("scope APPLY CTRL", scope.apply, scope.job)


}]);
