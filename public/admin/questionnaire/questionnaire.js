angular.module('admin.questionnaire', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('questionnaire', {
            url: '/questionnaire',
            controller: 'QuestionnaireCtrl',
            templateUrl: 'questionnaire/questionnaire.html',
            data: {
                requiresLogin: true,
                name: 'Questionnaires'
            },
            resolve: {
                getContent: ['$q', '$http', function ($q, $http) {
                    return $q.all({
                        commonFilter: $http.get('/api/common_filters')
                    })
                }]
            }

        });
    })
    .controller('QuestionnaireCtrl', function AllProjectController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {
        $scope.commonFilters = getContent.commonFilter.data;
        $scope.active_tab = _.keys($scope.commonFilters)[0];
        $scope.type = 'post';
        $scope.questions = [];
        $scope.getQuestions = function (service, type) {
            $scope.isLoading = true;
            $http.get('/admin/api/questionnaires', {
                params: {
                    service_provider: service, type: type, limit: $scope.configPagination.countByPage,
                    skip: ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage
                }
            }).then(function (resp) {
                $scope.isLoading = false;
                $scope.questions = resp.data.data.data;
                $scope.configPagination.totalCount = resp.data.data.count;
            }, function (err) {
                $scope.isLoading = false;
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })
        };

        function refresh(service, type) {
            $scope.getQuestions(service, type);
        }

        $scope.cb = function () {
            $scope.getQuestions($scope.active_tab, $scope.type)
        };


        function spliceItem(index){
            $scope.questions.splice(index, 1);
        }

        $scope.delete_question = function (item, index) {
            ModalService.showModal({
                templateUrl: "delete_modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.submit = function () {
                        $http.delete('/admin/api/questionnaire', {params: {_id: item._id}}).then(function(){
                            spliceItem(index);
                            $scope.close();
                        })
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


        $scope.add_question = function (active, type) {
            ModalService.showModal({
                templateUrl: "questionnaire/question.modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.question = {service_provider: active, type: type};
                    $scope.isNew = true;
                    $scope.submit = function (question) {
                        if(question.items[0].length >0) {
                            question.items = _.values(question.items);
                        } else {
                            delete question.items
                        }
                        if(question.table[0].length > 0) {
                            question.table = _.values(question.table);
                        } else {
                            delete question.table
                        }
                        $http.post('/admin/api/question', question).then(function (resp) {
                            refresh(active, type);
                            $scope.close();
                        })
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

        $scope.changeInformation = function (item, active, type) {
            ModalService.showModal({
                templateUrl: "questionnaire/question.modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.question = angular.copy(item);
                    $scope.isNew = true;
                    $scope.submit = function (question) {
                        question.items = _.values(question.items);
                        $http.post('/admin/api/question', question).then(function (resp) {
                            refresh(active, type);
                            $scope.close();
                        })
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

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        $scope.check = function (type) {
            $scope.type = type;
            $scope.getQuestions($scope.active_tab, type)
        };

        $scope.choice = function (key) {
            $scope.active_tab = key;
            $scope.getQuestions(key, $scope.type)
        };

        $scope.addRow = function(elem){
            elem = [{}]
        };

        $scope.getQuestions($scope.active_tab,$scope.type)

    });
