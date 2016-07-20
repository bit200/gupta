XYZCtrls.directive('listCategory', function () {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            choiceItem: '=ngModel'
        },
        templateUrl: 'js/directives/category-list/category-list.html',
        controller: ['$scope', '$rootScope', function (scope, $rootScope) {
                scope.choiceFilter = function(item){
                    console.log('item', item);
                    scope.choiceItem = item;
                    scope.$emit('choice-item', scope.choiceItem)
                }
        }]
    }
})
;