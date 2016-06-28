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
        if (getContent.stats) {
            scope.stats = getContent.stats.data.data;
            console.log('rere', scope.stats)
            scope.job.stats = []
            scope.job.stats.push(scope.stats.interviews == 1 ? {count: scope.stats.interviews, name: 'Interviews'} : {count: scope.stats.interviews, name: 'Interview'});
            scope.job.stats.push(scope.stats.applicants == 1 ? {count: scope.stats.applicants, name: 'Applicants'} : {count: scope.stats.applicants, name: 'Applicant'});
            scope.job.stats.push(scope.stats.hired == 1 ? {count: scope.stats.hired, name: 'Hired'} : {count: scope.stats.hired, name: 'Hired'});
        }
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
            controller: function ($scope, $element) {
                $scope.onSendApply = function(text, type) {
                    sendApply(text, type, $element)
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
    function sendApply (text, type, $element) {
        console.log('hahahahahahahahahah', text)
        http[type]('/api/job-apply', {job: scope.job._id, message: text}).then(function (resp) {
            console.log("fhfhfhfhfhfhhf", resp)
            scope.isApply = resp.data.data;
            $element.modal('hide');
        })
    }
    scope.showApplyInfo = function () {
        ModalService.showModal({
            templateUrl: "template/modal/applyJob.html",
            controller: function ($scope, $element) {
                $scope.isApply = true
                $scope.text = scope.isApply.message;
                $scope.onSendApply = function(text, type) {
                    sendApply(text, type, $element)
                }
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
            });

        });
    }
}]);