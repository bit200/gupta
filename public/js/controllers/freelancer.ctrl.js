/* Controllers */

angular.module('XYZCtrls').controller('freelancerCtrl', ['$scope', '$rootScope', '$location', '$http', '$q', '$timeout', 'getContent', '$stateParams', 'ngDialog', 'notify', 'Upload', '$filter',
    function (scope, rootScope, location, http, $q, $timeout, getContent, stateParams, ngDialog, notify, Upload, $filter) {
        scope.freelancer = {
            isagency: true,
            work: {}
        };
        rootScope.globalFiles = [];
        scope.industry = getContent.industry.data.data;
        scope.content = getContent.content.data.data;
        scope.language = getContent.languages.data.data;
        scope.freelancerType = getContent.freelancerType.data.data;
        scope.locations = getContent.locations.data.data;
        scope.experience = _.range(51);
        scope.showLink = false;
        rootScope.globalImg = [];
        scope.newPackage = {
            package: {}
        };
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

        scope.contentModel = scope.content;


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
        };

        scope.addPkgFile = function(file){
            Upload.dataUrl(file, true).then(function(url){
                scope.newPackage.file = file;
                scope.newPackage.tempPreview = url;
            });
        };
        
        scope.submitPackage = function (invalid) {
            if (invalid) return;
            var index = angular.copy(scope.newPackage).index;
            Upload.upload({
                url: '/api/package',
                data: JSON.parse(angular.toJson(scope.newPackage.package)),
                file: scope.newPackage.file
            }).then(function (resp) {
                scope.freelancer.service_packages = scope.freelancer.service_packages || [];
                if ($filter('filter')(scope.freelancer.service_packages, {_id: resp.data._id}).length){
                    scope.freelancer.service_packages[index] = resp.data;
                }else{
                    scope.freelancer.service_packages.push(resp.data)
                };
            }, function (resp) {
            }, function (evt) {
            });
            scope.newPackage = {
                package: {},
                tempPreview: ''
            };
            scope.show.pkgModal = false;
        };

        scope.editPackage = function(pkg,num){
            scope.newPackage ={
                package: angular.copy(pkg),
                index: num
            };
        };

        scope.delete_package = function (item) {
            var index = scope.freelancer.service_packages.indexOf(item);
            scope.freelancer.service_packages.splice(index, 1);
            http.delete('/api/package/'+item._id).success(function(){})
        };

        scope.addPkgFile = function(file){
            Upload.dataUrl(file, true).then(function(url){
                scope.newPackage.file = file;
                scope.newPackage.tempPreview = url;
            });
        };

        scope.work_previews = [];
        scope.addWorkFiles = function(files){
            scope.work_previews = scope.work_previews.concat(files);
        };
        
        scope.deleteWorkFile = function(id){
            http.delete('/api/work/attachment/'+id)
        };
        scope.croppedProfilePreview = '';
        scope.submitWork = function(){
            if (Object.keys(scope.freelancer.work).length === 0) {
                scope.activeTab = 'contact';
                return;
            }

            Upload.upload({
                url: '/api/work',
                data: JSON.parse(angular.toJson(scope.freelancer.work)),
                file: scope.work_previews
            }).then(function (resp) {
                scope.work_previews = [];
                scope.freelancer.work = resp.data;
                scope.activeTab = 'contact';
            }, function (resp) {
            }, function (evt) {
            });

        };

        scope.addContactDetailPreview = function(file){
            scope.contactDetailPreview = file;
        };
        
        scope.addContactDetails = function(invalid){
            if (invalid) return;
            http.post('/api/freelancer/contact_detail', scope.freelancer.contact_detail).success(function(resp){
                scope.freelancer.contact_detail = resp.data;
                if (scope.freelancer.work && !scope.freelancer.work._id)
                    delete scope.freelancer.work
                http.post('/api/freelancer/request', scope.freelancer).success(function(resp){
                    var has_sent = ngDialog.open({
                        template: 'has_sent',
                        className: 'ngdialog-theme-default',
                    });
                    has_sent.closePromise.then(function(){
                        rootScope.go('/')
                    });
                });
            });
        };

    }]);
