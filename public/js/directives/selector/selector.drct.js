XYZCtrls.directive('selector', function () {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            value: '@',
            className: '=',
            open: '@'
        },
        templateUrl: 'js/directives/selector/selector.html',
        controller: ['$scope', function (scope) {
            //console.log('scope job directive', scope.selected)
            scope.selected = scope.value || scope.items[0]

            scope.onSelect = function (item) {
                scope.selected = item
                scope.open = false
            }
        }]
    };
});