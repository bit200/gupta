XYZCtrls.directive('budget', function () {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<span ng-if="value">${{value}}</span><span ng-if="!value">-</span>',
        controller: ['$scope', function (scope) {
            //console.log('scope job directive', scope.value)

        }]
    };
});