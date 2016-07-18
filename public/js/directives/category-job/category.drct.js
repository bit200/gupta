XYZCtrls.directive('filterCategory', function () {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            choiceFilter: '=ngModel'
        },
        templateUrl: 'js/directives/category-job/category.html',
        controller: ['$scope', '$rootScope', function (scope, $rootScope) {
            scope.jobs_area = {};

            scope.menu = {
                activeItem: {},
                subName: {}
            }
            
        }]
    }
})
;