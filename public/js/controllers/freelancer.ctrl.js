/* Controllers */

angular.module('XYZCtrls').controller('freelancerCtrl', ['$scope', '$rootScope', '$location', '$http', 'parseType', '$q', '$timeout', 'getContent',
    '$routeParams', 'ngDialog', 'AuthService', function (scope, rootScope, location, http, parseType, $q, $timeout, getContent, routeParams, ngDialog, AuthService) {
        scope.freelancer = {isagency: true};
        rootScope.globalFiles = [];
        scope.industry = getContent.industry.data.data;
        scope.content = getContent.content.data.data;
        scope.language = getContent.languages.data.data;
        scope.freelancerType = getContent.freelancerType.data.data;
        scope.locations = getContent.locations.data.data;
        scope.clients = getContent.clients.data.data;
        scope.experience = _.range(51);
        scope.showLink = false;
        rootScope.globalImg = [];
        scope.package = {};
        scope.show = {};

        scope.scrollToErr = function(){
            $timeout(function(){
                angular.element("body").animate({scrollTop: angular.element('.has-error').eq(0).offset().top - 100}, "slow");

            },500)
        };

        if (AuthService.currentUser().freelancer){
            scope.freelancer = AuthService.currentUser().freelancer;
        }
        scope.clearSearchTerm = function () {
            scope.searchTerm = '';
        };

        scope.contentModel = parseType.getModel(scope.content);

        scope.register = function (invalid, freelancer,files,img) {
            if (invalid) {
                scope.scrollToErr()
                return;
            }
            var arrayIdFiles = [];
            for(var i = 0 ; i<files.length;i++){
                arrayIdFiles.push(files[i].result.data._id);
            }
            if (freelancer.service_price) freelancer.service_price = freelancer.price[freelancer.service_type]
            freelancer.Attachments = freelancer.Attachments || [];
            freelancer.Attachments = freelancer.Attachments.concat(arrayIdFiles)
            if (img && img.length)
                freelancer.poster = img[0].data._id;
            http.post('/freelancer', freelancer).then(function (resp) {
                rootScope.globalFiles = [];
                AuthService.setCurrentUser()
                location.path('/')
            }, function (err, r) {
            })
        };

        scope.addExtra = function(obj){
            obj = obj || {}
            scope.package.extras = scope.package.extras || [];
            if (obj.description && obj.price)
                scope.package.extras.push(obj)
        };

        scope.createPackage = function(){
            scope.priceHour=false; 
            scope.priceWord=false; 
            scope.freelancer.price=[]; 
            scope.addService=true;
            scope.package={};
            scope.show.pkgModal=true;
        }
        
        scope.submitPackage = function (invalid, service) {
            if (invalid) return;
            http.post('/add-package', service).then(function (resp) {
                angular.extend(scope.freelancer,resp.data)
                scope.show.pkgModal = false;
            }, function (err, r) {

            })
        };

        scope.editPackage = function(pkg){
            scope.package = angular.copy(pkg);
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
