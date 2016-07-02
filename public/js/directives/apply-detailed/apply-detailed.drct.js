XYZCtrls.directive('applyDetailed', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/apply-detailed/apply-detailed.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.title = attrs.title
            scope.btns = attrs.btns
        },
        controller: ['$scope', function (scope) {
            console.log('@@@ Scope detailed directive', scope.attrs)
        }]
    };
});