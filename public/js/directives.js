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
        templateUrl: 'template/directive/templateViewMyJob.html',
        controller: ['$scope', '$http', 'parseTime', '$rootScope', function (scope, http, parseTime, rootScope) {
            scope.header = 'View My Jobs - ' + scope.typeUser + ' views'
            scope.maxSize = 5;
            scope.TotalItems = 0;
            scope.currentPage = 1;
            scope.limit = 5;
            var last_press;
            var timer = 500;
            scope.trueSearch = function (search) {
                if (!search)
                    search = ' ';
                console.log("searchsearchsearchsearchsearch", search)
                last_press = new Date().getTime();
                var cur_press = last_press;
                setTimeout(function () {
                    if (cur_press === last_press) {
                        scope.currentPage = 1;
                        scope.render({'search': search})
                    }
                }, timer)

            };

            scope.changePage = function (page) {
                scope.render({page: page});
            };

            scope.enterSearch = function (search) {
                if (!search)
                    search = ' ';
                scope.currentPage = 1;
                scope.render(search)
            };

            function create_obj(params) {
                params = params || {};
                scope.Page = params.page || scope.currentPage;
                scope.search = params.search || scope.search;
                var obj = {};

                if (scope.currentPage) {
                    obj.skip = (scope.Page - 1) * scope.limit;
                    obj.limit = scope.limit;
                }

                if (scope.search && scope.search != ' ') {
                    obj.search = scope.search
                }
                return obj;

            }

            scope.render = function (params) {
                scope.showLoading = true;
                var obj = create_obj(params);
                var index = 0;

                function cb() {

                    if (++index == 2) {
                        scope.showLoading = false;
                    }
                }

                http.get(scope.url, {params: obj}).then(function (resp) {
                    cb();

                    scope.body = [];

                    _.each(resp.data.data, function (job) {
                        var obj = {
                            elem: job,
                            data: {
                                title: job.title || null,
                                service_provider: job.name || null,
                                response: job.response || null,
                                status: job.status || null,
                                date: parseTime.date(job.created_at) || null
                            }
                        };
                        scope.body.push(obj)
                    });


                }, function (err) {
                    cb();
                });
                http.get(scope.url + '/count', {params: obj}).then(function (resp) {
                        cb();
                        scope.TotalItems = resp.data.data;
                    }
                    , function (err) {
                        scope.TotalItems = 0;
                        cb();
                    })
            };

            scope.render();

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
        templateUrl: 'template/directive/templateJob.html',
        controller: ['$scope', '$http', 'ModalService', function (scope, http, ModalService) {
            scope.open = ['Job Title', 'Service Provider', 'View Response', 'Status', 'Date Applied', 'Action'];
            scope.action = function (id, type) {
                console.log('da', id, type)
            };
            scope.acceptJob = function (job) {
                ModalService.showModal({
                    templateUrl: "template/modal/createContract.html",
                    controller: function ($scope, $http, $element) {
                        $scope.contract = {};
                        $scope.contract.title = job.elem.title;
                        $scope.contract.information = job.elem.description;
                        $scope.contract.buyer_name = job.elem.name;
                        $scope.contract.buyer_company_name = job.elem.company_name;
                        $scope.contract.payment_basis = job.elem.budget;
                        $scope.contract.final_amount = job.elem.budget;
                        $scope.contract.expected_start = new Date();
                        $scope.contract.expected_completion = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                        $scope.createContract = function (invalid, type, data, modal) {
                            if (invalid) return;
                            $element.modal('hide');
                            data.seller_id = 0;
                            $http.post('/api/contract/', data).then(function (resp) {
                                console.log('resp', resp)
                            }, function (err) {
                                console.log('err', err)
                            })
                        }
                    }
                }).then(function (modal) {
                    modal.element.modal();
                });
            }
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
        templateUrl: 'template/directive/templateJob.html',
        link: function (scope, element, attrs) {

        },
        controller: ['$scope', '$http', function (scope, http) {

            var open = ['Job Title', 'Service Provider', 'View Response', 'Status', 'Date Applied', 'Action'];
            var ongoing = ['Job Title', 'Service Provider', 'Expected Completion Date', 'Contract Amount (Rs.)', 'Pending Amount', 'Action'];
            var closed = ['Job Title', 'Service Provider', 'Job Closed Date', 'Status when closed', 'Amount Disbursed (Rs.)', 'Action'];

            var openSelect = ['Communicate', 'Accept', 'Reject']

        }]
    };
});

XYZCtrls.directive('loading', function () {
    return {
        restrict: 'E',
        templateUrl: 'template/directive/loading.html',
        scope: {
            w: "=?",
            h: "=?",
            marginTop: "=?",
            marginBottom: "=?"
        }
    }
});

XYZCtrls.directive('text-animation', function () {
    return {
        restrict: 'E',
        templateUrl: 'template/directive/textAnimation.html',
        scope: {
            text: "="
        }
    }
});

