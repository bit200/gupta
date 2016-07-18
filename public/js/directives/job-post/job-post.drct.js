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
        controller: ['$scope', 'Upload', function (scope, Upload) {
            scope.jobs_area = {};
            scope.job.preview = [];
            scope.job.attach = [];
            scope.attach = [];
            scope.menu = {
                activeItem: {},
                subName: {}
            };
            scope.addFiles = function ($file) {
                if ($file && $file != null) {
                    scope.attach.push($file);
                    Upload.upload({
                        url: '/api/job/attach',
                        data: {name:$file.name},
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
                if ($file && $file != null) {
                    scope.preview = $file;
                    Upload.upload({
                        url: '/api/job/attach',
                        data: {name:$file.name},
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