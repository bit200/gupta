XYZCtrls.directive('jobDetailed', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/job-detailed/job-detailed.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.title = attrs.title
            scope.btns = attrs.btns
        },
        controller: ['$scope', function (scope) {
            //console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});