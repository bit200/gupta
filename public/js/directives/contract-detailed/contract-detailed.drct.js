XYZCtrls.directive('contractDetailed', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/contract-detailed/contract-detailed.html',
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