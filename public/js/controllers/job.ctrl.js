/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('jobCtrl', ['$state', 'AuthService', '$scope', '$rootScope', '$location', '$http', 'parseType', '$q', 'getContent', '$stateParams', 'ModalService', '$timeout',
    function ($state, AuthService, scope, rootScope, location, http, parseType, $q, getContent, stateParams, ModalService, $timeout) {

        console.log('GET CONTENT', getContent, AuthService.currentUser())
        rootScope.extend_scope(scope, getContent)

        
        scope.estimations = [
            'Less then 1 week',
            'Less then 1 month',
            '1 to 3 months',
            '3 to 6 months',
            'More than 6 months'
        ]

        var user = AuthService.currentUser() || {}
        scope.types = [
            'Agency',
            'Freelancer'
        ]

        scope.isApply = scope.apply || scope.apply_by_id;
        console.log('is Apply', scope.apply_by_id)


        if (scope.job) {
            var job = scope.job
            job.date_of_completion = new Date(job.date_of_completion);
            scope.job = job;
            scope.new_job = job;
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
            console.log("GET CONTETNT STEP2", scope.job, scope.new_apply, getContent)
        } else if (scope.apply_by_id) {
            scope.job = scope.apply_by_id.job
        } else {
            user = AuthService.currentUser() || {};

            scope.job = scope.job || _.extend({
                job_visibility: 'true',
                title: 'hi',
                description: 'test',
                budget: 1000,
                date_of_completion: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000)
            }, {
                mobile: user.phone,
                client_name: AuthService.userName(),
                company_name: user.company_name,
                website: user.website
            })
        }
        scope.job = scope.job || {}
        scope.new_apply = scope.isApply || {budget: scope.job.budget}



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

        scope.job_create = function (invalid, type, job) {
            console.log('invalid', invalid)
            if (invalid) {
                console.log('ahahahaha')
                
                // rootScope.scrollToErr()
                return;
            }
            job = scope.job
            console.log("job before", job)
            job.content_types = parseType.get(job.content, scope.contentTypes);
            job.local_preference = parseType.get(job.location, scope.locations);
            job.types = parseType.get(job.type_checkbox, scope.types);
            console.log("job after", job.types, job.type)

            http.post('/job', job).success(function(data){
                console.log('ahahahhaahhhhhhhhhhhhhhhhhhh', data)
                scope.job = data.data
                scope.onSucc(data)
            }).error(scope.onErr)
        };

        scope.job_edit = function (invalid, job) {
            if (invalid) {
                rootScope.scrollToErr()
                return;
            }
            console.log('hahahahahahah', job)
            job = scope.job
            job.content_types = parseType.get(job.content, scope.contentTypes);
            job.local_preference = parseType.get(job.location, scope.locations);
            job.types = parseType.get(job.type_checkbox, scope.types);
            console.log('hahahahahahah after', job)

            http.put('/api/job', job).success(function(){
                scope.onSucc()
            }).error(scope.onErr)
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


        scope.apply_create = function (invalid) {
            console.log('scope.apply', invalid, scope.new_apply, scope.job, scope.apply)
            scope.new_apply.job = scope.job._id
            http
                .post('/api/job-apply', scope.new_apply)
                .success(function(){
                    $state.go('jobs_list.seller_open')
                }).error(scope.onErr)
        }
        
        scope.apply_edit = function (invalid) {
            console.log('scope.apply', invalid, scope.new_apply, scope.job, scope.apply)
            scope.new_apply.job = scope.job._id
            http
                .post('/api/job-apply', scope.new_apply)
                // .success(function(){
                //     $state.go('root.apply_detailed', {apply: scope.new_apply._id})
                // })
                .success(scope.onSucc)
                .error(scope.onErr)
        }

        scope.btns_list_for_dir = rootScope.generate_btns_list(scope, ModalService)
        
        
    }]);