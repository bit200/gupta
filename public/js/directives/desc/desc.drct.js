XYZCtrls.directive('desc', function () {
    return {
        restrict: 'E',
        scope: {
            type: '@',
            status: '@',
            text: '@'
        },
        template: '{{text}}',
        controller: ['$scope', function (scope) {
            if (!scope.text) {
                scope.text = ['Your', scope.type, 'has successfully', scope.status || 'sent'].join(' ')
            }

        }]
    };
});