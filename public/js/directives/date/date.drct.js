XYZCtrls.directive('date', function () {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: "<span ng-if='value'>{{value | date:'dd MMM yyyy'}}</span><span ng-if='!value'>-</span>",
        controller: ['$scope', function(scope){
            if (scope.value == 'Invalid Date') {
                scope.value = null
            }
            //console.log('date directive', scope)

        }]
    };
});