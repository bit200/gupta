XYZCtrls.directive('applyPost', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/apply-post/apply-post.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.title = attrs.title
            scope.btns = attrs.btns || attrs.list
        },
        controller: ['$scope', function (scope) {
            //console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});