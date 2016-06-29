XYZCtrls.directive('acts', function () {
    return {
        restrict: 'E',
        scope: true,
        // transclude: true
        template: '<a class="action" ng-click="doAction(action, item)" ng-repeat="action in actions">{{action}}</a>',
        controller: ['$scope', function (scope) {

        }]
    };
});