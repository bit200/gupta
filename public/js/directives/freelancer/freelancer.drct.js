XYZCtrls.directive('freelancer', function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            seller: '@'
        },
        template: '<a href="#/profile/user/{{seller.user}}">{{seller.name}}</a>',
        controller: ['$scope', function (scope) {
            scope.seller = scope.item.freelancer || scope.item
        }]
    };
});