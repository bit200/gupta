XYZCtrls.directive('date', function () {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: "<span>{{value | date:'dd MMM yyyy'}}</span>"
    };
});