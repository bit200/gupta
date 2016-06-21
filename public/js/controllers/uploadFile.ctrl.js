/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('uploadFile', ['$scope', '$rootScope', '$http', '$location', '$timeout', 'Upload', 'ngDialog',
    function (scope, rootScope, http, location, $timeout, Upload, ngDialog) {

        scope.open = function (url) {

            console.log(url.$ngfBlobUrl.toString());
            var win = window.open(url.$ngfBlobUrl, '_blank');
            win.focus();
        };

        scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'http://localhost:8080/uploadFile', //webAPI exposed to upload the file
                data: {file: file} //pass file as data, should be user ng-model
            });
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                evt.loaded / evt.total));
            });
        };


        scope.showDrop = true;
        scope.$watch('picFile', function (newValue, oldValue) {
            if (newValue != undefined) {
                scope.showDrop = false;
                scope.uploadPic(newValue);
                rootScope.globalFiles.push(newValue);

            }
        });

        scope.uploadPic = function (file) {

            file.upload = Upload.upload({
                url: 'http://localhost:8080/uploadFile', //webAPI exposed to upload the file
                data: {file: file} //pass file as data, should be user ng-model
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                evt.loaded / evt.total));
            });

        }

    }]);
