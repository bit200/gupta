/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('jobCtrl', ['$scope', '$rootScope', '$location', '$http', 'parseType', '$q', 'getContent', '$stateParams', 'ModalService', '$timeout',
    function (scope, rootScope, location, http, parseType, $q, getContent, stateParams, ModalService, $timeout) {

        scope.onSucc = function(data) {
            console.log("on succccccccc", data, data.data)
            scope.resp = data.data
            scope.succ_resp = true
        }

        scope.estimations = [
            'Less then 1 week',
            'Less then 1 month',
            '1 to 3 months',
            '3 to 6 months',
            'More than 6 months'
        ]

        scope.types = [
            'Agency',
            'Freelancer'
        ]

        scope.i = getContent.i
        console.log("ahdfhashdfhasdhfahsdfhashdfhasdhfasfd get content", scope.i, getContent)
        scope.contentTypes = getContent.contentType.data.data;
        scope.locations = getContent.locations.data.data;

        if (stateParams.id) {
            var job = getContent.job.data.data[0];
            job.date_of_completion = new Date(job.date_of_completion);
            scope.job = job;
            if (getContent.apply) {
                scope.isApply = getContent.apply.data.data[0];
                scope.new_apply = scope.isApply || {budget: job.budget}
                console.log("new", scope.new_apply)
            }

            scope.job.type_checkbox = parseEdit(scope.job.types);
            scope.job.content = parseEdit(scope.job.content_types);
            scope.job.location = parseEdit(scope.job.local_preference);
            if (getContent.stats) {
                scope.stats = getContent.stats.data.data;
                console.log('rere', scope.stats)
                scope.job.stats = []
                scope.job.stats.push(scope.stats.interviews == 1 ? {
                    count: scope.stats.interviews,
                    name: 'Interviews'
                } : {count: scope.stats.interviews, name: 'Interview'});
                scope.job.stats.push(scope.stats.applicants == 1 ? {
                    count: scope.stats.applicants,
                    name: 'Applicants'
                } : {count: scope.stats.applicants, name: 'Applicant'});
                scope.job.stats.push(scope.stats.hired == 1 ? {
                    count: scope.stats.hired,
                    name: 'Hired'
                } : {count: scope.stats.hired, name: 'Hired'});
            }
            scope.job.job_visibility ? scope.job.job_visibility = 'true' : scope.job.job_visibility = 'false'
        } else {
            scope.job = {
                job_visibility: 'true',
                type: 'Agency',
                title: 'hi'
            }
        }

        scope.scrollToErr = function () {
            $timeout(function () {
                angular.element("body").animate({scrollTop: angular.element('.has-error').eq(0).offset().top - 100}, "slow");
            }, 500)
        };
        scope.applyJob = function (id) {
            ModalService.showModal({
                templateUrl: "template/modal/applyJob.html",
                controller: function ($scope, $element) {
                    $scope.onSendApply = function (text, type) {
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

        scope.create_job = function (invalid, job) {
            if (invalid) {
                rootScope.scrollToErr()
                return;
            }
            console.log("job before", job)
            job.content_types = parseType.get(job.content, scope.contentTypes);
            job.local_preference = parseType.get(job.location, scope.locations);
            job.types = parseType.get(job.type_checkbox, scope.types);
            console.log("job after", job.types, job.type)

            http.post('/job', job).success(scope.onSucc).error(rootScope.onError)
        };

        scope.update_job = function (invalid, job) {
            if (invalid) {
                rootScope.scrollToErr()
                return;
            }
            console.log('hahahahahahah', job)
            job.content_types = parseType.get(job.content, scope.contentTypes);
            job.local_preference = parseType.get(job.location, scope.locations);
            job.types = parseType.get(job.type_checkbox, scope.types);
            console.log('hahahahahahah after', job)

            http.put('/api/job', job).success(scope.onSucc).error(rootScope.onError)
        };
        function sendApply(text, type, $element) {
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
                    $scope.onSendApply = function (text, type) {
                        sendApply(text, type, $element)
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        }


        scope.sendApplyNew = function (params) {
            params.job = scope.job._id
            console.log('params', params)
            http
                .post('/api/job-apply', params)
                .success(function (data) {
                    console.log("fhfhfhfhfhfhhf", data)
                    scope.isApply = data.data;
                }).error(function (err) {

            })
        }
    }]);