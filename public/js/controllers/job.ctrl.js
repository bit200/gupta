/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', '$routeParams', 'ModalService', '$timeout',
    function (scope, location, http, parseType, $q, getContent, routeParams, ModalService, $timeout) {
    scope.contentTypes = getContent.contentType.data.data;
    scope.locations = getContent.locations.data.data;
    if (routeParams.id) {
        var job = getContent.job.data.data[0];
        job.date_of_completion = new Date(job.date_of_completion);
        scope.job = job;
        if (getContent.apply)
            scope.isApply = getContent.apply.data.data[0];
        scope.job.content = parseEdit(scope.job.content_types);
        scope.job.location = parseEdit(scope.job.local_preference);
        scope.stats = getContent.stats.data.data;
        scope.job.job_visibility ? scope.job.job_visibility = 'true' : scope.job.job_visibility = 'false'
    } else {
        scope.job = {
            job_visibility: 'true',
            type: 'Agency'
        }
    }

    scope.scrollToErr = function(){
        $timeout(function(){
            angular.element("body").animate({scrollTop: angular.element('.has-error').eq(0).offset().top - 100}, "slow");

        },500)
    };
    scope.applyJob = function (id) {
        ModalService.showModal({
            templateUrl: "template/modal/applyJob.html",
            controller: function ($scope, $http) {
                $scope.close = function (text) {
                    $http.post('/api/job-apply', {job: id, message: text}).then(function (resp) {
                        console.log('resp', resp);
                        scope.isApply = resp.data.data;
                    })
                }
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
            });

        });
    };
    function parseEdit(array) {
        var obj = {};
        _.each(array, function (item) {
            obj[item] = true;
        });
        return obj
    }

    scope.addJob = function (invalid, job) {
        if (invalid) {
            scope.scrollToErr()
            return;
        }
        job.content_types = parseType.get(job.content, scope.contentTypes);
        job.local_preference = parseType.get(job.location, scope.locations);
        http.post('/job', job).then(function (resp) {
                scope.isCreated = true;
                scope.job_id = resp.data.data._id;
                $("html, body").animate({scrollTop: 0}, "fast");
            }, function (err) {
                if (err.status = 404) {
                    scope.error = 'Job can\'t created. Try again';
                } else {
                    scope.error = err.error
                }
            }
        )
    };

    scope.editJob = function (invalid, job) {
        if (invalid) return;
        job.content_types = parseType.get(job.content, scope.contentTypes);
        job.local_preference = parseType.get(job.location, scope.locations);
        http.put('/api/job', job).then(function (resp) {
            }, function (err, r) {
            }
        )
    };

    scope.showApplyInfo = function (id) {
        ModalService.showModal({
            templateUrl: "template/modal/applyJob.html",
            controller: function ($scope, $http) {
                $scope.isApply = true
                $scope.text = scope.isApply.message;
                $scope.close = function (text) {
                    $http.post('/api/job-apply', {job: id, message: text}).then(function (resp) {
                        console.log('resp', resp)
                        scope.isApply = resp.data.data;
                    })
                }
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
            });

        });
    }
}]);