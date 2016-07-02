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

XYZCtrls.directive('equals', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function() {
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
            };
        }
    }
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
                        console.log(origin, viewValue, scope.passwordVerify);

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




XYZCtrls.directive('openJobSeller', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            jobs: '='
        },
        templateUrl: 'template/directive/templateJobSeller.html',
        controller: ['$scope', '$http', 'ModalService', '$location', '$timeout', function (scope, http, ModalService, location, $timeout) {
            scope.open = ['Job Title', 'Client name', 'View Application', 'Status', 'Date Applied', 'Action'];
            scope.action = function (id, type) {
                console.log('da', id, type)
            };


        }]
    };
});


XYZCtrls.directive('openJobBuyer', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            jobs: '='
        },
        templateUrl: 'template/directive/templateJobBuyer.html',
        controller: ['$scope', '$http', 'ModalService', '$location', '$timeout', function (scope, http, ModalService, location, $timeout) {
            scope.open = ['Job Title', 'Service Provider', 'View Response', 'Status', 'Date Applied', 'Action'];
            scope.action = function (id, type) {
                console.log('da', id, type)
            };
            scope.rejectJob = function (id) {
                http.get('/api/job-apply/reject/' + id).then(function (resp) {
                    console.log('resp', resp)
                    scope.jobs = resp.data.data
                }, function (err) {
                    console.log('err', err)
                })
            };

            scope.acceptJob = function (job) {
                ModalService.showModal({
                    templateUrl: "template/modal/createContract.html",
                    controller: function ($scope, $http, $element, close) {
                        $scope.contract = {};
                        $scope.contract.title = job.elem.job.title;
                        $scope.contract.information = job.elem.job.description;
                        $scope.contract.buyer_name = job.elem.freelancer.name;
                        $scope.contract.buyer_company_name = job.elem.job.company_name;
                        $scope.contract.payment_basis = job.elem.job.budget;
                        $scope.contract.final_amount = job.elem.job.budget;
                        $scope.contract.expected_start = new Date();
                        $scope.contract.expected_completion = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                        $scope.openUrl = function () {
                            $element.modal('hide');
                            $timeout(function () {
                                location.path('contract/' + $scope.contract_id)
                            }, 100)
                        };
                        $scope.createContract = function (invalid, type, data) {
                            if (invalid) return;
                            $scope.showLoading = true;
                            data.seller = job.elem.user;
                            data.freelancer = job.elem.freelancer._id;
                            data.job = job.elem.job._id;
                            // console.log(data);
                            $http.post('/api/contract/', data).then(function (resp) {
                                $scope.showLoading = false;
                                $scope.isCreated = true;
                                // $scope.contract_id = resp.data.data._id;

                            }, function (err) {
                                if (err.status = 404) {
                                    $scope.error = 'Buyer/Seller not found';
                                } else {
                                    $scope.error = err.error
                                }
                                $scope.showLoading = false;
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

XYZCtrls.directive('allJobsBuyer', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            jobs: '='
        },
        templateUrl: 'template/directive/templateJobBuyer.html',
        controller: ['$scope', '$http', 'ModalService', '$location', '$timeout', function (scope, http, ModalService, location, $timeout) {
            scope.open = ['Job Title', 'Service Provider', 'View Response', 'Status', 'Date Applied', 'Action'];
            scope.action = function (id, type) {
                console.log('da', id, type)
            };
            scope.rejectJob = function (id) {
                http.get('/api/job-apply/reject/' + id).then(function (resp) {
                    console.log('resp', resp)
                    scope.jobs = resp.data.data
                }, function (err) {
                    console.log('err', err)
                })
            };

            scope.acceptJob = function (job) {
                ModalService.showModal({
                    templateUrl: "template/modal/createContract.html",
                    controller: function ($scope, $http, $element, close) {
                        $scope.contract = {};
                        // console.log('job', job)
                        $scope.contract.title = job.elem.title;
                        $scope.contract.information = job.elem.description;
                        $scope.contract.buyer_name = job.elem.name;
                        $scope.contract.buyer_company_name = job.elem.company_name;
                        $scope.contract.payment_basis = job.elem.budget;
                        $scope.contract.final_amount = job.elem.budget;
                        $scope.contract.expected_start = new Date();
                        $scope.contract.expected_completion = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                        // console.log('asdasd',$scope.contract)
                        $scope.closeModal = function () {
                            $element.modal('hide');
                            $timeout(function () {
                                location.path('contract/' + $scope.contract_id)
                            }, 100)
                        };
                        $scope.createContract = function (invalid, type, data) {
                            if (invalid) return;
                            $scope.showLoading = true;
                            data.seller = job.elem.user;
                            data.freelancer = job.elem.freelancer._id;
                            // console.log(data);
                            $http.post('/api/contract/', data).then(function (resp) {
                                $scope.showLoading = false;
                                $scope.isCreated = true;
                                // $scope.contract_id = resp.data.data._id;

                            }, function (err) {
                                if (err.status = 404) {
                                    $scope.error = 'Buyer/Seller not found';
                                } else {
                                    $scope.error = err.error
                                }
                                $scope.showLoading = false;
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

XYZCtrls.directive('flexMenu', function ($timeout) {
    return {
        scope: {
            flexMenu: '='
        },
        link: function (scope, element, attrs) {
            scope.$watchCollection('flexMenu', function(arr){
                if (arr && arr.length){
                    $timeout(function(){
                        $(element).flexMenu();
                    },100)
                }
            })
        }
    }
});

console.log('customPagination')

XYZCtrls.directive("customPagination", function() {
    return {
        restrict: "A",
        scope: {
            customPagination: "=",
            cb: "&"
        },
        template: '' +
                '<ul class="pagination-control pagination">' +
                    '<li>' +
                        '<button type="button" class="btn btn-primary"  ng-disabled="customPagination.currentPage == 0" ' +
                            'ng-click="customPagination.currentPage=customPagination.currentPage-1">PREV</button>' +
                    '</li>' +
                    '<li>' +
                        '<span>Page {{customPagination.currentPage + 1}} of {{ numberOfPages() }}</span>' +
                    '</li>' +
                    '<li>' +
                        '<button type="button"  class="btn btn-primary" ng-disabled="customPagination.currentPage >= customPagination.totalCount/customPagination.countByPage - 1" ' +
                            'ng-click="customPagination.currentPage=customPagination.currentPage+1">NEXT </button>' +
                    '</li>' +
                '</ul>',
        link: function(scope, element, attrs) {
            if (!scope.customPagination) scope.customPagination = {};
            scope.customPagination.currentPage = scope.customPagination.currentPage || 0;
            scope.customPagination.countByPage = scope.customPagination.countByPage || 10;
            scope.$watch('customPagination.currentPage', function(val){
                if (val && parseInt(val))
                    scope.cb({currentPage: val});
            })
            scope.numberOfPages = function(){
                return Math.ceil(scope.customPagination.totalCount/scope.customPagination.countByPage);
            }
        }
//        replace: true
    };
});