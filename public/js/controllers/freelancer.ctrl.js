/* Controllers */

angular.module('XYZCtrls').controller('freelancerCtrl', ['$scope', '$rootScope', '$location', '$http', 'parseType', '$q', '$timeout', 'getContent',
    '$routeParams', 'ngDialog', 'Upload', function (scope, rootScope, location, http, parseType, $q, $timeout, getContent, routeParams, ngDialog, Upload) {
        scope.freelancer = {isagency: true};
        rootScope.globalFiles = [];
        scope.industry = getContent.industry.data.data;
        scope.content = getContent.content.data.data;
        scope.language = getContent.languages.data.data;
        scope.freelancerType = getContent.freelancerType.data.data;
        scope.locations = getContent.locations.data.data;
        scope.clients = getContent.clients.data.data;
        scope.experience = _.range(51);
        scope.extras = [];
        scope.new_services = [];
        scope.showLink = false;
        rootScope.globalImg = [];

        if (routeParams.id) {
            http.get('/freelancer', {params: {_id: routeParams.id}}).then(function (resp) {
                scope.freelancer = resp.data.data[0]
            })
        }
        scope.clearSearchTerm = function () {
            scope.searchTerm = '';
        };


        scope.contentModel = parseType.getModel(scope.content);

        scope.register = function (invalid, freelancer,files,img) {
            if (invalid) return;
            var arrayIdFiles = [];
            for(var i = 0 ; i<files.length;i++){
                arrayIdFiles.push(files[i].result.data._id);
            }
            if (freelancer.service_price) freelancer.service_price = freelancer.price[freelancer.service_type]
            freelancer.attachments = arrayIdFiles;
            // freelancer.profile = img[0].data._id;
            http.post('/freelancer', freelancer).then(function (resp) {
                    location.path('/home')
                }, function (err, r) {
                }
            )
        };

        scope.addPackage = function (bol) {
            scope.viewModal = bol
        };

        scope.custom = {};
        scope.submitExtra = function (invalid, extra) {
            if (invalid) return;
            scope.extras.push(extra);
            scope.custom = {};
        };

        scope.createPackage = function (invalid, service) {
            if (invalid) return;
            scope.freelancer.service_packages = scope.freelancer.service_packages || [];
            service.extras = scope.extras;
            http.post('/add-package', service).then(function (resp) {
                    scope.viewModal = false;
                    scope.new_services.push(resp.data.data);
                    scope.freelancer.service_packages.push(resp.data.data._id)
                }, function (err, r) {
                }
            )
        };

        scope.delete_package = function (item) {
            var index = scope.new_services.indexOf(item);
            scope.new_services.splice(index, 1);
            scope.freelancer.service_packages.splice(index, 1);
        };


        scope.deleteNewFile = function (file_id, index) {
            http({
                url: '/deleteFile',
                method: 'DELETE',
                data: {_id: file_id},
                headers: {"Content-Type": "application/json;charset=utf-8"}
            }).success(function (res) {
                console.log(res)
            });
            rootScope.globalFiles.splice(index, 1);
        };

        scope.deleteNewImg = function (file_id) {
            http({
                url: '/deleteFile',
                method: 'DELETE',
                data: {_id: file_id},
                headers: {"Content-Type": "application/json;charset=utf-8"}
            }).success(function (res) {
                console.log(res)
            });
            scope.showLink = false;
            rootScope.globalImg = [];

        };

        scope.downloadPicProfile = function () {
            ngDialog.open({
                template: 'attachImgProfile',
                className: 'ngdialog-theme-default',
                controller: 'uploadFile'
            })
        };


        scope.$watchCollection('globalFiles', function () {
            console.log(rootScope.globalFiles);
            ngDialog.closeAll();
        });
        scope.$watchCollection('globalImg', function () {
            if (rootScope.globalImg) {
                scope.showLink = true;
                ngDialog.closeAll();
            }
        });

        scope.attachFile = function () {
            ngDialog.open({
                template: 'attachFile',
                className: 'ngdialog-theme-default',
                controller: 'uploadFile'
            })
        }
    }]);
