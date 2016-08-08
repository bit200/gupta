XYZCtrls.directive('freelancer', function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            withPhoto: '=',
            seller: '@'
        },
        template: '<a href="#/profile/{{seller.user}}"><img ng-if="withPhoto" ng-src="{{seller.img || default_img}}">{{seller.name}}</a>',
        controller: ['$scope', function (scope) {
            scope.default_img = '/img/avatar.jpeg';
            scope.seller = scope.item ? scope.item.freelancer || scope.item : null
        }]
    };
});