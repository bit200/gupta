XYZCtrls.directive('jobsList', function (jobInformation) {
    return {
        restrict: 'E',
        scope: {
            url: '@',
            showLoading: '@',
            TotalItems: '@',
            nf: '@',
            template: '@',
            header: '@',
            info: '@'
        },
        templateUrl: 'js/directives/jobs-list/jobs-list.html',
        controller: ['$scope', '$http', 'parseTime', '$rootScope', '$location', 'ModalService', function (scope, http, parseTime, rootScope, location, ModalService) {
            scope.templateHeader = ['js/directives/jobs-list/', scope.template, '/header.html'].join('');
            scope.templateItem = ['js/directives/jobs-list/', scope.template, '/item.html'].join('');

            scope.$watch('$parent.$parent._keywords', function(val){
                scope.search = {job:{title:val}}
            });

            console.log(scope);
            scope.configPagination = {
                currentPage: 1,
                countByPage: 12
            };

            // jobInformation.registerObserverCallback(function(data){
            //     console.log(data)
            // });
            

            scope.acceptJob = function (job, freelancer, user) {
                ModalService.showModal({
                    templateUrl: "template/modal/createContract.html",
                    controller: function ($scope, $http, $element, close) {
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
            };

            scope.cb = function(a){
                scope.configPagination.currentPage = a;
                scope.render()
            };
            
            scope.render = function (params) {
                scope.showLoading = true;
                var obj = {
                    skip: (scope.configPagination.currentPage - 1) * scope.configPagination.countByPage,
                    limit: scope.configPagination.countByPage
                };

                var index = 0;
                function cb() {
                    if (++index == 2) {
                        scope.showLoading = false;
                    }
                } 
            rootScope.$on('job-changed', function(e,data){
                console.log('data changedchangedchanged', data)
                scope.items = data;
            });

                http.get(scope.url, {params: obj}).success(function (data) {
                        cb();
                        scope.items = data.data;
                    }, function (err) {
                        scope.error = 'An error. Please try again later';
                        cb();
                    });

                http.get(scope.url + '/count', {params: obj}).then(function (resp) {
                        cb();
                        scope.configPagination.totalCount = resp.data.data;
                        scope.TotalItems = resp.data.data;
                    }
                    , function (err) {
                        scope.TotalItems = 0;
                        cb();
                    })
            };

            scope.render();


            // scope.accept = function() {
            //     //console.log('accept')
            // };

        }]
    };
});