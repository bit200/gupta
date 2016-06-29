/* Controllers */

angular.module('XYZCtrls').controller('freelancerCtrl', ['$scope', '$rootScope', '$location', '$http', 'parseType', '$q', '$timeout', 'getContent',
    '$routeParams', 'ngDialog', 'notify', function (scope, rootScope, location, http, parseType, $q, $timeout, getContent, routeParams, ngDialog, notify) {
        scope.freelancer = {isagency: true};
        rootScope.globalFiles = [];
        scope.industry = getContent.industry.data.data;
        scope.content = getContent.content.data.data;
        scope.language = getContent.languages.data.data;
        scope.freelancerType = getContent.freelancerType.data.data;
        scope.locations = getContent.locations.data.data;
        scope.experience = _.range(51);
        scope.showLink = false;
        rootScope.globalImg = [];
        scope.newPackage = {};
        scope.show = {};
        scope.arrayProviders = getContent.service.data.data;



        scope.scrollToErr = function(){
            $timeout(function(){
                angular.element("body").animate({scrollTop: angular.element('.has-error').eq(0).offset().top - 100}, "slow");

            },500)
        };

        scope.clearSearchTerm = function () {
            scope.searchTerm = '';
        };

        scope.contentModel = parseType.getModel(scope.content);

        scope.sendRequest = function (freelancer,files,img) {
            var arrayIdFiles = [];
            for(var i = 0 ; i<files.length;i++){
                arrayIdFiles.push(files[i].result.data._id);
            }
            freelancer.Attachments = freelancer.Attachments || [];
            freelancer.Attachments = freelancer.Attachments.concat(arrayIdFiles)
            if (img && img.length){
                freelancer.poster = img[0].data._id;
            }
            http.post('/api/freelancer/request', freelancer).then(function (resp) {
                rootScope.globalFiles = [];
                var has_sent = ngDialog.open({
                    template: 'has_sent',
                    className: 'ngdialog-theme-default',
                });
                has_sent.closePromise.then(function(){
                    rootScope.go('/')
                });
            }, function (err, r) {
            })
        };


        scope.addExtra = function(obj){
            obj = obj || {}
            if (!scope.newPackage.package) scope.newPackage.package = {};
            scope.newPackage.package.extras = scope.newPackage.package.extras || [];
            if (obj.description && obj.price)
                scope.newPackage.package.extras.push(obj)
        };

        scope.createPackage = function(){
            scope.newPackage={};
            scope.show.pkgModal=true;
        }
        
        scope.submitPackage = function (invalid) {
            if (invalid) return;
            scope.freelancer.newPackages = scope.freelancer.newPackages || [];
            if (scope.newPackage.index || scope.newPackage.index == 0){
                scope.freelancer.newPackages[scope.newPackage.index] = angular.copy(scope.newPackage.package);
            }
            else
                scope.freelancer.newPackages.push(angular.copy(scope.newPackage.package));
            scope.show.pkgModal = false;
            scope.newPackage = {};
        };

        scope.editPackage = function($index, pkg){
            scope.newPackage ={
                package: angular.copy(pkg),
                index: $index
            }
            console.log(scope.newPackage.index)
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
