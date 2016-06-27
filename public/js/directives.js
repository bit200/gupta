'use strict';

/* Directives */
XYZCtrls.directive('ngEnter', function () {
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
});

XYZCtrls.directive('shakeThat', ['$animate', function ($animate) {
    return {
        require: '^form',
        scope: {
            submit: '&',
            submitted: '='
        },
        link: function (scope, element, attrs, form) {
            // listen on submit event
            element.on('submit', function () {
                // tell angular to update scope
                scope.$apply(function () {
                    // everything ok -> call submit fn from controller
                    scope.$watch(function () {
                        return form.$invalid
                    }, function (newElement, oldElement) {

                        //element.find('input').removeClass('shake')
                        if (newElement) {
                            element.find('input').addClass('shake');

                            scope.submitted = true;
                            //setTimeout(function () {
                            //
                            //    element.find('input').addClass('shake')
                            //
                            //})
                        }

                    });

                });
            });
        }
    };

}]);

XYZCtrls.directive('numbersOnly', function () {
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
});
XYZCtrls.directive('phoneNumber', function () {
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
});

XYZCtrls.directive("passwordVerify", function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                var combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});

XYZCtrls.directive('uniqueUsername', function ($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (element.val().length < 4) return;
                ngModel.$loading = true;

                $http.get("/api/checkUnique?username=" + element.val()).success(function (data) {
                    ngModel.$loading = false;
                    ngModel.$setValidity('unique', !data.count);
                });
            });
        }
    };
})
XYZCtrls.directive('uniqueEmail', function ($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (element.val().length < 4) return;
                ngModel.$loading = true;

                $http.get("/api/checkUnique?email=" + element.val()).success(function (data) {
                    ngModel.$loading = false;
                    ngModel.$setValidity('unique', !data.count);
                });
            });
        }
    };
})

XYZCtrls.directive('uniqueName', function ($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (element.val().length < 4) return;
                ngModel.$loading = true;

                $http.get("/api/uniqueName/?name=" + element.val()).success(function (data) {
                    ngModel.$loading = false;
                    ngModel.$setValidity('unique', !data.count);
                });
            });
        }
    };
})


XYZCtrls.directive('toggle', function () {
    return {
        scope: {
            toggle: '='
        },
        link: function (scope, elem, attrs) {
            scope.$watch('toggle', function (val) {
                if (typeof val === 'boolean')
                    elem.slideToggle();
            })
        }
    }
});


XYZCtrls.directive('viewMyJob', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            typeJob: '=',
            typeUser: '='
        },
        templateUrl: 'template/templateViewMyJob.html',
        controller: ['$scope', '$http', 'parseTime', function (scope, http, parseTime) {
            scope.header = 'View My Jobs - ' + scope.typeUser + ' views'
            scope.maxSize = 5;
            scope.TotalItems = 0;
            scope.CurrentPage = 1;
            var last_press;
            var timer = 500
            scope.trueSearch = function(search){
                last_press = new Date().getTime();
                var cur_press = last_press;
                setTimeout(function(){
                    if (cur_press === last_press) {
                        scope.search(search)
                    }
                }, timer)

            };

            scope.search = function (search) {
                http.get(scope.url, {params: {search: search}}).then(function (resp) {
                    console.log('resp', resp);
                    scope.body = [];
                    _.each(resp.data.data, function (job) {
                        var obj = {
                            title: job.title || null,
                            service_provider: job.name || null,
                            response: job.response || null,
                            status: job.status || null,
                            date: parseTime.date(job.created_at) || null
                        }
                        scope.body.push(obj)
                    });

                    http.get(scope.url + '/count', {params: {search: search}}).then(function (resp) {
                        scope.TotalItems = resp.data.data;
                    })
                })
            }
        }]
    };
});

XYZCtrls.directive('openJob', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            jobs: '='
        },
        templateUrl: 'template/templateJob.html',
        controller: ['$scope', '$http', function (scope, http) {
            scope.open = ['Job Title', 'Service Provider', 'View Response', 'Status', 'Date Applied', 'Action'];
            scope.openSelect = ['Communicate', 'Accept', 'Reject']
        }]
    };
});

XYZCtrls.directive('myJob', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            typeJob: '='
        },
        templateUrl: 'template/templateJob.html',
        link: function (scope, element, attrs) {

        },
        controller: ['$scope', '$http', function (scope, http) {
            var params = {
                query: {},
                params: {
                    limit: 20,
                    skip: 0
                }
            };

            $http.get($scope.url, params).then(function (resp) {
                console.log('resp', resp)
            });

            var open = ['Job Title', 'Service Provider', 'View Response', 'Status', 'Date Applied', 'Action'];
            var ongoing = ['Job Title', 'Service Provider', 'Expected Completion Date', 'Contract Amount (Rs.)', 'Pending Amount', 'Action'];
            var closed = ['Job Title', 'Service Provider', 'Job Closed Date', 'Status when closed', 'Amount Disbursed (Rs.)', 'Action'];

            var openSelect = ['Communicate', 'Accept', 'Reject']

        }]
    };
});
