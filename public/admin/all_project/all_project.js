angular.module('admin.all_project', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('all_project', {
            url: '/all_project',
            controller: 'AllProjectCtrl',
            templateUrl: 'all_project/all_project.html',
            data: {
                requiresLogin: true,
                name: 'Projects'
            },
            resolve: {
                getContent: ["$q", "$http", function ($q, $http) {
                    return $q.all({
                        locations: $http.get('/get-content', {
                            params: {
                                name: 'Location',
                                query: {},
                                distinctName: 'name'
                            }
                        })
                    })
                }]
            }
        });
    })
    .controller('AllProjectCtrl', function AllProjectController($scope, $http, store, jwtHelper, ModalService, getContent, notify, Upload) {
        $scope.selectFilter = 'pending';
        $scope.sortBy = '';
        $scope.searchObj = '';
        $scope.changeSort = function (type) {
            $scope.sortBy = type;
            $scope.getAllProject();
            $scope.configPagination.currentPage = 1;
        };

        $scope.search = function (text) {
            $scope.searchObj = text;
            $scope.searchTrue = true;
            $scope.getAllProject();
        };

        $scope.getAllProject = function (skip, cb) {
            var _skip = skip ? (skip - 1) * $scope.configPagination.countByPage : 0;
            $http.post('/admin/api/all', {model: 'Job', search: $scope.searchObj, query: {sort: $scope.sortBy || 'statusRating', limit: $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.all_projects = resp.data.data.data;
                if ($scope.configPagination.totalCount != resp.data.data.count) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
                cb
            }, function (err) {
                if ($scope.searchTrue) {
                    $scope.all_projects = [];
                    $scope.configPagination.totalCount = 0;
                } else {
                    notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
                }
            })
        };


        $scope.cb = function (page) {
            $scope.getAllProject(page)
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 15,
            totalCount: 0
        };
        function refreshForModel(cb) {
            $scope.getAllProject($scope.configPagination.currentPage, cb)
        }

        $scope.showQuestionnaire = function (questionnaire) {
            ModalService.showModal({
                templateUrl: "all_project/all_project.question.html",
                controller: function ($scope, $element, $http) {
                    $scope.questionnaires = questionnaire;
                    $scope.rows = function (item, num) {
                        if (num)
                            item.row_number = new Array(num);
                    };

                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        };

        $scope.getInformation = function (change, job, index, jobs) {
            $scope.showModal = true;
            $scope.job = angular.copy(job);
            $scope.change = change;
            $scope.submit = function (job) {
                $http.post('/admin/api/job/update', {job: job}).then(function (resp) {
                    console.log(jobs, index, jobs[index])
                    jobs[index] = resp.data.data;
                    $scope.close()
                })
            };
            $scope.close = function (res) {
                $scope.showModal = false
            }
        }

        $scope.add_job = function () {
            $http.get('/api/common_filters').then(function (commonFilters) {

                $scope.showModal = true;
                $scope.add = true;
                $scope.locations = getContent.locations.data.data;
                $scope.commonFilters = commonFilters.data;
                $scope.job = {};
                $scope.jobs_area = {};
                $scope.job.preview = [];
                $scope.job.attach = [];
                $scope.types = ['Agency', 'Freelancer'];
                $scope.attach = [];
                $scope.menu = {
                    activeItem: {},
                    subName: {}
                };
                $scope.subFilters;

                $scope.choiceType = function (category, type) {
                    if(type){
                        delete $scope.subFilters;
                        delete $scope.job.type_name
                    }
                    if ($scope.commonFilters[category] && $scope.commonFilters[category].length > 1) {
                        $scope.subFilters = [];
                        _.each($scope.commonFilters[category], function (item) {
                            $scope.subFilters.push(item.name)
                        })
                    }
                    $http.get('/api/questionnaire', {params: {type: 'post', service_provider: category}}).then(function (resp) {
                        $scope.job.questionnaries = resp.data.data
                    })
                };
          
                $scope.addFiles = function ($file) {
                    if ($file && $file != null) {
                        $scope.attach.push($file);
                        Upload.upload({
                            url: '/api/job/attach/' + $scope.job._id,
                            data: {name: $file.name},
                            file: $file
                        }).then(function (resp) {
                            $scope.job.attach.push(resp.data.data.file._id);
                            $scope.job._id = resp.data.data.job;
                        }, function (resp) {
                        }, function (evt) {
                        });
                    }
                };
                $scope.deleteAttachFile = function (index) {
                    $scope.attach.splice(index, 1);
                    $scope.job.attach.splice(index, 1);
                };


                $scope.addImage = function ($file) {
                    if ($file && $file != null) {
                        $scope.preview = $file;
                        Upload.upload({
                            url: '/api/job/attach/' + $scope.job._id,
                            data: {name: $file.name},
                            file: $file
                        }).then(function (resp) {
                            $scope.job.preview = resp.data.data.file._id;
                            $scope.job._id = resp.data.data.job;
                        }, function (resp) {
                        }, function (evt) {
                        });
                    }
                };
                $scope.deleteImg = function (index) {
                    delete $scope.preview;
                    delete $scope.job.preview;
                };
                $scope.createJob = function (job) {
                    if (job.preview && !job.preview.length) {
                        delete job.preview
                    }
                    if (job.attach && !job.attach.length) {
                        delete job.attach
                    }
                    if (!_.isEmpty(job)) {
                        $http.post('/admin/api/job/add', {job: job, adminID: store.get('id')}).then(function (resp) {
                            refreshForModel($scope.close())
                        }, function (err) {
                            notify({message: 'Some fields are filled in not correctly', duration: 3000, position: 'right', classes: "alert-error"});
                        })
                    } else {
                        notify({message: 'Not one fields not filled', duration: 3000, position: 'right', classes: "alert-error"});
                    }
                };
                $scope.close = function (res) {
                    $scope.showModal = false;
                    $scope.add = false;
                }
            })
        };

        $scope.reject = function (item, index) {
            var isAdmin = confirm('Are you sure?');
            if (isAdmin) {
                $scope.all_projects.splice(index, 1);
                $http.delete('/admin/api/delete', {params: {model: 'Job', _id: item._id}}).then(function () {
                    $http.post('/admin/api/all', {
                        model: 'Job',
                        limit: $scope.configPagination.countByPage,
                        skip: ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage
                    }).then(function (resp) {
                        $scope.all_projects = resp.data.data.data;
                        $scope.configPagination.totalCount = resp.data.data.count;
                    }, function (err) {
                        notify({
                            message: 'Error request, try again',
                            duration: 3000,
                            position: 'right',
                            classes: "alert-error"
                        });
                    })
                })
            }
        }

    })
;
