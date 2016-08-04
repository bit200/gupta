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
                requiresLogin: true
            },
            resolve: {
                getContent: ['$q', '$http', function($q,$http){
                    return $q.all({
                        commonFilter:$http.get('/api/common_filters')
                    })
                }]
            }
            
        });
    })
    .controller('QuestionnaireCtrl', function AllProjectController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {
        $scope.commonFilters = getContent.commonFilter.data;
        console.log(_.keys($scope.commonFilters)[0])
        $scope.active_tab = _.keys($scope.commonFilters)[0];
        $scope.questions = [];
        $scope.getQuestions = function(type){
            $scope.isLoading = true;
            $http.get('/admin/api/questionnaires', {params:{service_provider:type,limit:$scope.configPagination.countByPage,
                skip:($scope.configPagination.currentPage-1) *$scope.configPagination.countByPage}}).then(function(resp){
                $scope.isLoading = false;
                $scope.questions = resp.data.data.data;
                $scope.configPagination.totalCount = resp.data.data.count;
                console.log($scope.questions)
            }, function(err){
                $scope.isLoading = false;
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })
        };
        function refresh(type){
            $scope.getQuestions(type);
        }

        $scope.cb = function () {
            if($scope.active_tab)
                $scope.getQuestions($scope.active_tab)
        };

        $scope.add_question = function(active){
            ModalService.showModal({
                templateUrl: "questionnaire/question.modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.question = {service_provider:active};
                    $scope.isNew = true;
                    $scope.submit = function (question) {
                        question.items = _.pluck(question.items, 'item');
                        $http.post('/admin/api/question', question).then(function(resp){
                            refresh(active);
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
            countByPage: 1,
            totalCount: 0
        };

        $scope.choice = function(key){
            $scope.active_tab = key;
            $scope.getQuestions(key)
        };
    });
