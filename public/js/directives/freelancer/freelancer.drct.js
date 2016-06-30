XYZCtrls.directive('freelancer', function () {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            seller: '@'
        },
        template: '<a href="#/profile/user/{{seller.user}}"><img ng-src="{{seller.img || default_img}}">{{seller.name}}</a>',
        controller: ['$scope', function (scope) {
            scope.default_img = '/img/avatar.jpeg'
            scope.seller = scope.item ? scope.item.freelancer || scope.item : null
            console.log('hahahahhaha freelancer', scope.seller)
        }]
    };
});