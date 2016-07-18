XYZCtrls.directive('filterCategory', function () {
    return {
        restrict: 'E',
        scope: {
            choiceCategory: '=ngModel'
        },
        templateUrl: 'js/directives/category-job/category.html',
        controller: ['$scope', '$rootScope', function (scope, $rootScope) {
            scope.choiceCategory = scope.choiceCategory || {};
            scope.choiceItem = '';
            scope.items = [];
            scope.keyFilters = [];
            scope.parseFilter = function (filters, type) {
                return _.map(filters, function (filter) {
                    if (filter.subFilter) {
                        scope.parseFilter(filter.arr);
                        return {name: filter.subFilter, type: type || ''}
                    } else {
                        return {name: filter.name, type: type || ''}
                    }
                })
            };
            $rootScope.$watchCollection('commonFilters', function (val) {
                    if (val) {
                        _.each(val, function(key, value){
                            scope.keyFilters.push({name:value, type:'category'})
                        })
                        scope.filters = $rootScope.commonFilters;
                    }
                }
            );
            scope.$on('choice-item', function (e, filter) {
                if (!scope.choiceCategory.category) {
                    scope.items.push(filter);
                    scope.saveChoice(scope.choiceCategory, filter);
                    scope.keyFilters = scope.parseFilter(scope.filters[filter]);
                    console.log('1213', scope.choiceCategory)
                } else {
                    console.log('go', scope.choiceCategory)
                    scope.items.push(filter);
                    scope.saveChoice(scope.choiceCategory, filter);
                }
            });


            scope._choice = function () {
                console.log('1', scope.choiceItem);

            };

            scope.saveChoice = function (model, item) {
                console.log('model', model);
                if (!model.category) {
                    model.category = item;
                    return
                }

                if (!model.sub_category) {

                    model.sub_category = item;
                    console.log('zxcxzcz', model);
                    return
                }
                if (!model.sub_sub_category) {
                    model.sub_sub_category = item;
                    return
                }
            };

            scope.changeKeyFilters = function (item) {
                scope.filters[item];
            }
        }]
    }
})
;