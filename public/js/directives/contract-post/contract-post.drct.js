XYZCtrls.directive('contractPost', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/contract-post/contract-post.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.title = attrs.title
            scope.btns = attrs.btns || attrs.list
            scope.is_suggest = attrs.suggest
        },
        controller: ['$scope', function (scope) {
            //console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});