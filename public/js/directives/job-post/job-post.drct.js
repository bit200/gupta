XYZCtrls.directive('jobPost', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/job-post/job-post.html',
        link: function (scope, el, attrs) {
            scope.attrs = attrs;
            scope.title = attrs.title;
            scope.btns = attrs.btns || attrs.list
        },
        controller: ['$scope', 'Upload', '$http', '$rootScope', '$element',  function (scope, Upload, $http, $rootScope, element) {

            scope.jobs_area = {};
            scope.attach = [];

            scope.menu = {
                activeItem: {},
                subName: {}
            };

            // scope.$watch('job.title', function(text, item){
            //     if(text){
            //     if(text.split(' ').length > 10)
            //         scope.job.title = item
            //     }
            // });
            scope.searchTerm;
            scope.clearSearchTerm = function() {
                scope.searchTerm = '';
            };
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
            });
            scope.subFilters;

            scope.choiceType = function (category, type) {
                if(type){
                    delete scope.subFilters;
                    delete scope.job.type_name
                }
                if (scope.commonFilters[category] && scope.commonFilters[category].length > 1) {
                    scope.subFilters = [];
                    _.each(scope.commonFilters[category], function (item) {
                        scope.subFilters.push(item.name)
                    })
                }
                $http.get('/api/questionnaire', {params: {type: 'post', service_provider: category}}).then(function (resp) {
                    scope.job.questionnaries = resp.data.data
                })
            };
            

            scope.addFiles = function ($file) {
                scope.job.attach = scope.job.attach || [];
                if ($file && $file != null) {
                    scope.attach.push($file);
                    Upload.upload({
                        url: '/api/job/attach/' + scope.job._id,
                        data: {name: $file.name},
                        file: $file
                    }).then(function (resp) {
                        scope.job.attach.push(resp.data.data.file._id);
                        scope.job._id = resp.data.data.job;
                    }, function (resp) {
                    }, function (evt) {
                    });
                }
            };

            scope.deleteAttachFile = function (index) {
                scope.attach.splice(index, 1);
                scope.job.attach.splice(index, 1);
            };


            scope.addImage = function ($file) {
                scope.job.preview = scope.job.preview || [];
                if ($file && $file != null) {
                    scope.preview = $file;
                    Upload.upload({
                        url: '/api/job/attach/' + scope.job._id,
                        data: {name: $file.name},
                        file: $file
                    }).then(function (resp) {
                        scope.job.preview = resp.data.data.file._id;
                        scope.job._id = resp.data.data.job;
                    }, function (resp) {
                    }, function (evt) {
                    });
                }
            };

            scope.deleteImg = function (index) {
                delete scope.preview;
                delete scope.job.preview;
            };


        }]
    };
});