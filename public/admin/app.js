angular.module('admin', [
    'admin.login',
    'admin.sellers',
    'admin.categories',
    'admin.locations',
    'admin.all_profile',
    'admin.all_project',
    'admin.business_accounts',
    'angular-jwt',
    'angular-storage',
    'angularModalService',
    'ngDialog',
    'cgNotify',
    'ngFileUpload',
    'ngMaterial',
    'angular-loading-bar',
    'smart-table',
    'admin.jobs'
])
    .config(["$urlRouterProvider", "jwtInterceptorProvider", "$httpProvider", function myAppConfig($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/all_profile');

        jwtInterceptorProvider.tokenGetter = function (store) {
            return store.get('jwt');
        };

        $httpProvider.interceptors.push('jwtInterceptor');
    }])

    .run(["$rootScope", "$state", "store", "jwtHelper", function ($rootScope, $state, store, jwtHelper) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (to.data && to.data.requiresLogin) {
                if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                    e.preventDefault();
                    window.location = '/admin/login';
                    $rootScope.isLogged = false;
                } else
                    $rootScope.isLogged = true;
            }
        });
    }])
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
    .controller('AppCtrl', ["$scope", "$location", '$rootScope', "$state", 'store', function AppCtrl($scope, $location, $rootScope, $state, store) {
        $scope.$state = $state
        $scope.logout = function () {
            $rootScope.isLogged = false;
            store.remove('jwt');
            window.location = '/admin/login';
        }
    }])

