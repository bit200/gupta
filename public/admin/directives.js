angular.module('directive', [])
    .directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        text = text.toString();
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('phoneNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9,+,-,-,(,)]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive("customPagination", ["$location", function ($location) {
        return {
            restrict: "A",
            scope: {
                customPagination: "=",
                cb: "&"
            },
            template: '' +
            '<ul class="pagination-control pagination" ng-show="customPagination.totalCount && numberOfPages()>1">' +
            '<li>' +
            '<button type="button" class="btn btn-primary"  ng-disabled="customPagination.currentPage == 1" ' +
            'ng-click="customPagination.currentPage=customPagination.currentPage-1" style="float: left">PREV</button>' +
            '</li>' +
            '<li>' +
            '<span>Page {{customPagination.currentPage}} of {{ numberOfPages() }}</span>' +
            '</li>' +
            '<li>' +
            '<button type="button"  class="btn btn-primary" ng-disabled="customPagination.currentPage >= customPagination.totalCount/customPagination.countByPage" ' +
            'ng-click="customPagination.currentPage=customPagination.currentPage+1">NEXT </button>' +
            '</li>' +
            '</ul>',
            link: function (scope, element, attrs) {
                if (!scope.customPagination) scope.customPagination = {};
                scope.customPagination.currentPage = parseInt(scope.customPagination.currentPage || 1);
                scope.customPagination.countByPage = parseInt(scope.customPagination.countByPage || 10);
                scope.customPagination.totalCount = parseInt(scope.customPagination.totalCount || 0);
                scope.$watch('customPagination.currentPage', function (val) {
                    if (val && parseInt(val)) {
                        $location.search('page', val > 1 ? val : null);
                        scope.cb({currentPage: val});
                    }
                })
                scope.numberOfPages = function () {
                    return Math.ceil(scope.customPagination.totalCount / scope.customPagination.countByPage);
                }
            }
//        replace: true
        };
    }])
    .directive('filterCategory', function () {
        return {
            restrict: 'E',
            scope: {
                filters: '=',
                choiceFilter: '=ngModel'
            },
            templateUrl: '/js/directives/category-job/category.html',
            controller: ['$scope', '$http', function (scope, $http) {
                scope.jobs_area = {};

                scope.menu = {
                    activeItem: {},
                    subName: {}
                }

            }]
        }
    })
    .directive('loading', function () {
        return {
            restrict: 'E',
            templateUrl: '/template/directive/loading.html',
            scope: {
                w: "=?",
                h: "=?",
                marginTop: "=?",
                marginBottom: "=?"
            }
        }
    })
    .directive('dashboardBlock', function () {
        return {
            restrict: 'E',
            templateUrl: '/admin/dashboard/dashboard.directive.html',
            scope: {
                total: "=",
                urlCount: "=",
                urlModel: "="
            },
            controller: ['$scope', '$http', function (scope, $http) {
                $http.get(scope.urlCount, scope.urlModel).then(function (resp) {
                    console.log(resp)
                    scope.count = resp.data.data
                })
            }]
        }
    })
    .directive('questions', function () {
        return {
            restrict: 'E',
            scope: {
                question: '=ngModel',
                createNew: '='
            },
            templateUrl: 'questionnaire/questions.directive.html',
            controller: ['$scope', '$http', function (scope, $http) {
                scope.question.row_number = 1;
                scope.arrItems = scope.question.items || [{}];
                scope.question.table = scope.question.table || [{}];
                scope.question.items = scope.question.items || [''];
                scope.type = scope.question.items.length > 0 ? 'list' : scope.question.table.length > 0 ? 'table' : 'list';
                console.log(scope.question.items, scope.question.items.length)
                if (scope.type == 'list')
                    scope.list_type = (scope.question.items[0] != '' && scope.question.items.length > 0) ? 'checkbox' : 'question';
                scope.rows = function (bool, elem) {
                    if (bool) {
                        elem = elem || {};
                        elem.row = elem.row || [];
                        elem.row.push({})
                    } else {
                        delete elem.row
                    }
                };

                scope.deleteItem = function (items, index) {
                    console.log('fsdhf', items, index)
                    items.splice(index, 1)
                    console.log('fsdhf', items, index)
                };
                scope.maxRoute = function (max) {
                    if (scope.question.row_number < max) {
                        scope.question.row_number = max
                    }
                };
            }]
        }
    });