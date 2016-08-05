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

                scope.rows = function (bool, elem) {
                    if (bool) {
                        elem = elem || {};
                        elem.rows = elem.rows || [];
                        elem.rows.push({})
                    } else {
                        delete elem.rows
                    }
                };
                scope.maxRoute = function (max) {
                    if (scope.question.row_number < max) {
                        scope.question.row_number = max
                        console.log(scope.question, max)
                    }
                };
            }]
        }
    });