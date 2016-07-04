angular.module( 'admin.jobs', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
]).config(function($stateProvider) {
        $stateProvider.state('jobs', {
            url: '/jobs',
            controller: 'JobsCtrl',
            templateUrl: 'jobs/jobs.html',
            data: {
                requiresLogin: true
            },
            resolve: {
                jobs: function($http){
                    return $http.get('/admin/api/jobs');
                }
            }
        });
    })
    .controller( 'JobsCtrl', function JobsController( $scope, $http, store, jwtHelper, jobs, ModalService, cfpLoadingBar, notify) {
        $scope.jobs = jobs.data;
        $scope.job_area = {};

        $scope.reject = function(job, $index){
            $scope.job_area.rejectedItemIndex = $index;
            ModalService.showModal({
                templateUrl: "jobs/reject.modal.html",
                controller: ['$scope', '$element', 'close', function (scope, $element, close) {
                    scope.job = job
                    scope.submit = function(invalid, rejectReason){
                        if (invalid) return
                        scope.close(rejectReason)
                    }
                    scope.close = function(reject_reason){
                        $element.modal('hide');
                        close(reject_reason, 500)
                    };
                }]
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (rejected_reason) {
                    $scope.job_area.rejectedItemIndex = undefined;
                    if (rejected_reason){
                        $scope.rejectApproveJob('reject',job._id, $index, {reject_reason: rejected_reason})
                    }
                });
            });
        };

        $scope.rejectApproveJob = function(status, jobId, $index, body){
            cfpLoadingBar.start();
            $http.post('/admin/api/jobs/'+status+'/'+jobId, body || {}).success(function(){
                cfpLoadingBar.complete()
                notify({message: 'job with id ' + jobId + ' has been succesfully '+ (status == 'reject' ? 'rejected' : 'approved'), position: 'right'});
                $scope.jobs.splice($index,1)
            })
        };
    });
