XYZCtrls.directive('acts', function () {
    return {
        restrict: 'E',
        scope: true,
        // transclude: true
        template: '<a class="action" ng-click="doAction(action, item)" ng-repeat="action in acts track by $index">{{action}}</a>',
        controller: ['$scope', function (scope) {
            console.log("ahahahahahhahah", scope.acts)
        }]
    };
});