XYZCtrls.directive('shortPreview', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            isVisible: '@',
            limit: '@',
            open: '@'
        },
        template: '<div ng-if="!open">{{short_view}}' +
        '<span ng-if="isVisible">... <a ng-click="onOpen(true)">more</a></span></div>' +
        '<div ng-if="open">{{value}} <a ng-click="onOpen(false)">less</a></div>',
        controller: ['$scope', function (scope) {
            scope.value = ''
            for (var i = 0; i < 2; i++) {
                scope.value += 'asdfas '
            }
            scope.onOpen = function(status) {
                scope.open = status
            }

            scope.short_view = scope.value.slice(0, scope.limit)
            scope.isVisible = scope.short_view.length == scope.limit
            console.log("@@@@", scope.short_view, '##', scope.short_view.length > scope.limit, scope.isVisible)
        }]
    };
});