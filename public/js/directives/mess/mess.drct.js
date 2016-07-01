XYZCtrls.directive('mess', function () {
    return {
        restrict: 'E',
        scope: {
            type: '@',
            status: '@',
            text: '@'
        },
        template: '<h2>{{text}}</h2>',
        controller: ['$scope', function (scope) {
            if (!scope.text) {
                scope.text = ['Your', scope.type, 'has successfully', scope.status || 'sent'].join(' ')
            }

        }]
    };
});