XYZCtrls.directive('budget', function () {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<span>${{value}}</span>',
        controller: ['$scope', function (scope) {
            console.log('scope job directive', scope.value)

        }]
    };
});