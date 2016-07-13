XYZCtrls.directive('jobPost', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/job-post/job-post.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.title = attrs.title
            scope.btns = attrs.btns || attrs.list
        },
        controller: ['$scope', function (scope) {
            //console.log('@@@ Scope Post directive', scope.attrs)
            // console.log(getContent)
            // scope.contentType = getContent.contentType.data.data
            // scope.location = getContent.location.data.data
        }]
    };
});