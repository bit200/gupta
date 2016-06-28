XYZCtrls.directive('jobsList', function () {
    return {
        restrict: 'E',
        scope: {
            url: '@',
            showLoading: '@',
            template: '@',
            header: '@'
        },
        templateUrl: 'js/directives/jobs-list/jobs-list.html',
        controller: ['$scope', '$http', 'parseTime', '$rootScope', '$location', 'ModalService', function (scope, http, parseTime, rootScope, location, ModalService) {
            console.log("directive", scope.header)
            scope.templateHeader = ['js/directives/jobs-list/templates/', scope.template, '/header.html'].join('')
            scope.templateItem = ['js/directives/jobs-list/templates/', scope.template, '/item.html'].join('')

            var actions = {
                'buyer-open': ['Comunicate', 'Accept', 'Reject']
            }
            scope.actions = actions[scope.template]
            scope.doAction = function(action, item) {
                console.log('action , item', action , item)
                scope.acceptJob(item.job, item.freelancer, item.user)
            }
            
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

            scope.acceptJob = function (job, freelancer, user) {
                ModalService.showModal({
                    templateUrl: "template/modal/createContract.html",
                    controller: function ($scope, $http, $element, close) {
                        console.log("jobjobjobjobjob", job)
                        $scope.contract = {};
                        $scope.contract.title = job.title;
                        $scope.contract.information = job.description;
                        $scope.contract.buyer_name = freelancer.name;
                        $scope.contract.buyer_company_name = job.company_name;
                        $scope.contract.payment_basis = job.budget;
                        $scope.contract.final_amount = job.budget;
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
                            data.seller = user;
                            data.freelancer = freelancer._id;
                            data.job = job._id;

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

            scope.render = function (params) {
                scope.showLoading = true;
                var obj = {};

                var index = 0;

                function cb() {
                    if (++index == 2) {
                        scope.showLoading = false;
                    }
                }

                http.get(scope.url, {params: obj}).success(function (data) {
                        cb();
                        scope.items = data.data;
                        console.log("itemsmsmsmsmmsms", scope.items)
                        console.log("itemsmsmsmsmmsms", scope.items[0])
                    }, function (err) {
                        scope.error = 'An error. Please try again later';
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


            scope.accept = function() {
                console.log('accept')
            }
            // scope.header = 'Header page'
            // scope.header = 'View My Jobs - ' + scope.typeUser + ' views';
            // scope.maxSize = 5;
            // scope.TotalItems = 0;
            // scope.currentPage = 1;
            // scope.limit = 5;
            // console.log('scope', scope.typeUser)
            // var last_press;
            // var timer = 500;
            // scope.trueSearch = function (search) {
            //     if (!search)
            //         search = ' ';
            //     last_press = new Date().getTime();
            //     var cur_press = last_press;
            //     setTimeout(function () {
            //         if (cur_press === last_press) {
            //             scope.currentPage = 1;
            //             scope.render({'search': search})
            //         }
            //     }, timer)
            //
            // };
            //
            // scope.data = {view : scope.typeUser};
            // if(scope.data.view == 'All')
            //     scope.data.view = 'Buyer';
            // scope.changePage = function (page) {
            //     scope.render({page: page});
            // };
            //
            // scope.switchRole = function() {
            //
            //   location.path('/jobs/'+scope.data.view.toLowerCase()+'/open')
            // };
            //
            // scope.enterSearch = function (search) {
            //     if (!search)
            //         search = ' ';
            //     scope.currentPage = 1;
            //     scope.render(search)
            // };
            //

            //
            // scope.render = function (params) {
            //     scope.showLoading = true;
            //     var obj = create_obj(params);
            //     var index = 0;
            //
            //     function cb() {
            //
            //         if (++index == 2) {
            //             scope.showLoading = false;
            //         }
            //     }
            //
            //     http.get(scope.url, {params: obj}).then(function (resp) {
            //         cb();
            //         scope.body = [];
            //         // console.log('sfsdfsdxcvnmhuiku', resp.data.data)
            //         if (scope.typeUser == 'Buyer') {
            //             _.each(resp.data.data, function (job) {
            //                 var obj = {
            //                     elem: job,
            //                     data: {
            //                         title: job.job.title || null,
            //                         service_provider: job.freelancer.name || null,
            //                         response: job.message || null,
            //                         status: job.status || null,
            //                         date: parseTime.date(job.created_at) || null
            //                     }
            //                 };
            //                 scope.body.push(obj)
            //             });
            //         }
            //         if (scope.typeUser == 'All') {
            //             _.each(resp.data.data, function (job) {
            //                 var obj = {
            //                     elem: job,
            //                     data: {
            //                         title: job.title || null,
            //                         service_provider: job.name || null,
            //                         response: job.message || null,
            //                         status: job.status || null,
            //                         date: parseTime.date(job.created_at) || null
            //                     }
            //                 };
            //                 scope.body.push(obj)
            //             });
            //         }
            //     }, function (err) {
            //         console.log('asdsa', err)
            //         if (err.status = 403)
            //             scope.error = 'Error';
            //         cb();
            //     });
            //     http.get(scope.url + '/count', {params: obj}).then(function (resp) {
            //             cb();
            //             scope.TotalItems = resp.data.data;
            //         }
            //         , function (err) {
            //             scope.TotalItems = 0;
            //             cb();
            //         })
            // };
            //
            // scope.render();

        }]
    };
});