/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('jobCtrl', ['$state', 'AuthService', '$scope', '$rootScope', '$location', '$http', 'parseType', '$q', 'getContent', '$stateParams', 'ModalService', '$timeout',
    function ($state, AuthService, scope, rootScope, location, http, parseType, $q, getContent, stateParams, ModalService, $timeout) {
        rootScope.extend_scope(scope, getContent)
        scope.userId = AuthService.userId()
        scope.estimations = [
            'Less then 1 week',
            'Less then 1 month',
            '1 to 3 months',
            '3 to 6 months',
            'More than 6 months'
        ];

        function delete_null_properties(obj) {
            for (var i in obj) {
                if (!obj[i]) {
                    delete obj[i];
                }
            }
            return obj
        }

        http.get('/api/common_filters').then(function (resp) {
            scope.commonFilters = resp.data
        });

        var user = AuthService.currentUser() || {};
        scope.types = [
            'Agency',
            'Freelancer'
        ];

        scope.isApply = scope.apply || scope.apply_by_id;
        if (getContent.contentType)
            scope.contentTypes = getContent.contentType.data.data;

        if (getContent.locations)
            scope.locations = getContent.locations.data.data;

        if (scope.job) {
            var job = scope.job;
            job.date_of_completion = new Date(job.date_of_completion);
            job.job_visibility_plain = job.job_visibility ? 'Public' : 'Private';
            scope.job = job;
            scope.checkFavorited = function () {
                http.get('/job/check_favorite', {params: {job: scope.job._id}}).success(function (resp) {
                    scope.jobFavorited = resp
                });
            };
            scope.addFavorite = function () {
                http.get('/job/favorite/add', {params: {_id: scope.job._id}});
                scope.jobFavorited = true
            };

            scope.removeFavorite = function () {
                http.get('/job/favorite/remove', {params: {_id: scope.job._id}});
                scope.jobFavorited = false
            };
            scope.new_job = job;
            if (scope.job.types.length) {
                var obj = {}
                _.each(scope.job.types, function (key, value) {
                    obj[key] = true
                })
                scope.job.content_types = obj;
            }
            scope.job.type_checkbox = parseEdit(scope.job.types);
            scope.job.content = parseEdit(scope.job.content_types);
            // scope.job.location = parseEdit(scope.job.local_preference);
            if (getContent.stats) {
                scope.stats = getContent.stats.data.data;
                scope.job.stats = [];
                scope.job.stats.push(scope.stats.applicants !== 1 ? {
                    count: scope.stats.applicants,
                    name: 'Applicants'
                } : {count: scope.stats.applicants, name: 'Applicant'});
                scope.job.stats.push(scope.stats.hired !== 1 ? {
                    count: scope.stats.hired,
                    name: 'Hired'
                } : {count: scope.stats.hired, name: 'Hired'});

            }
            scope.job.job_visibility ? scope.job.job_visibility = 'true' : scope.job.job_visibility = 'false';
        } else if (scope.apply_by_id) {
            scope.job = scope.apply_by_id.job
        } else {
            user = AuthService.currentUser() || {};

            scope.job = scope.job || _.extend({
                    email: AuthService.currentUser().email,
                    job_visibility: 'true',
                    date_of_completion: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000)
                }, {
                    mobile: user.phone,
                    client_name: AuthService.userName(),
                    company_name: user.company_name,
                    website: user.website
                })
        }
        scope.job = scope.job || {};
        scope.new_apply = scope.isApply || {
                budget: scope.job.budget
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

        scope.job_create = function (invalid, type, job) {
            if (invalid) {
                rootScope.scrollToErr()
                return;
            }
            job = scope.job;
            // job.job_visibility = (job.job_visibility_plain != 'Private');
            // job.local_preference = parseType.get(job.location, scope.locations);
            // job.local_preference = parseType.get(job.location, scope.locations);

            job.types = [];
            if (job.content_types.freelancer)
                job.types.push('freelancer');
            if (job.content_types.agency)
                job.types.push('agency');
            job.questionnaries = _.map(job.questionnaries, function (item) {
                return {
                    question: item.question,
                    answer: item.answer,
                    // answer_items: delete_null_properties(item.answer_items),
                    answer_items: item.answer_items,
                    items: item.items
                }
            });
            // _.each(job.questionnaire, function (item) {
            //     if (typeof(item.answer) == 'object') {
            //         item.answer = [];
            //         item.answer = parseType.getKey(item.answer);
            //     }
            // });
            if (job.preview == '')
                delete job.preview;

            http.post('/job', job).success(function (data) {
                scope.job = data.data;
                scope.onSucc(data)
            }).error(scope.onErr)
        };

        scope.job_edit = function (invalid, job) {
            if (invalid) {
                rootScope.scrollToErr();
                return;
            }
            job = scope.job;
            job.job_visibility = job.job_visibility_plain == 'Public';
            job.types = [];
            if (job.content_types.freelancer)
                job.types.push('freelancer');
            if (job.content_types.agency)
                job.types.push('agency');
            // job.local_preference = parseType.get(job.location, scope.locations);
            job.questionnaries = _.map(job.questionnaries, function (item) {
                return {
                    question: item.question,
                    answer: item.answer,
                    // answer_items: delete_null_properties(item.answer_items),
                    answer_items: item.answer_items,
                    items: item.items
                }
            });
            if (job.preview && !job.preview.length || job.preview == '')
                delete job.preview;
            http.put('/api/job', job).success(function () {
                scope.onSucc()
            }).error(scope.onErr)
        };

        function sendApply(text, type, $element) {
            http[type]('/api/job-apply', {job: scope.job._id, message: text}).then(function (resp) {
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
        };


        scope.delete_job = function (invalid) {
            scope.new_apply.job = scope.job._id;
            scope.new_apply.user = scope.userId;
            scope.new_apply.reason_delete = scope.job.reason_delete;
            http
                .post('/api/job-delete', scope.new_apply)
                .success(function () {
                    $state.go('jobs_list.all')
                }).error(scope.onErr)
        };


        scope.apply_create = function (invalid) {
            scope.new_apply.job = scope.job._id;
            http
                .post('/api/job-apply', scope.new_apply)
                .success(function () {
                    $state.go('jobs_list.seller_open')
                }).error(scope.onErr)
        };

        scope.apply_edit = function (invalid) {
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