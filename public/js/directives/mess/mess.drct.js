XYZCtrls.directive('mess', function () {
    return {
        restrict: 'E',
        scope: {
            type: '@',
            status: '@',
            text: '@'
        },
        template: '<div>{{text}}</div>',
        controller: ['$scope', function (scope) {
            if (!scope.text) {
                scope.text = ['Your', scope.type, 'has successfully', scope.status || 'sent'].join(' ')
            }
        }]
    };
});