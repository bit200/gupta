/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', '$routeParams', 'ModalService', function (scope, location, http, parseType, $q, getContent, routeParams, ModalService) {
    scope.job = {
        public: true,
        agency: true
    };
    if (routeParams.id) {
        var job = getContent.job.data.data[0];
        job.date_of_completion = new Date(job.date_of_completion);
        scope.job = job
    }

    scope.arrayProvidersModel = parseType.getModel(scope.contentTypes);

    scope.applyJob = function (id) {
        ModalService.showModal({
            templateUrl: "template/modal/applyJob.html",
            controller: function ($scope, $http) {
                $scope.close = function(text){
                    $http.post('/api/job-apply', {job:id, message:text}).then(function(resp){
                        console.log('resp', resp)
                    })
                }
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
            });

        });
    };
    scope.addJob = function (invalid, job) {
        if (invalid) return;
        job.content_types = parseType.get(job.content, scope.contentTypes);
        job.local_preference = parseType.get(job.location, scope.locations);
        http.post('/job', job).then(function (resp) {
                location.path('/home')
            }, function (err, r) {
            }
        )
    };
}]);