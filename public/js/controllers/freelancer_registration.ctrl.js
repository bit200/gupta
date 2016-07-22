/* Controllers */

angular.module('XYZCtrls').controller('FreelancerRegistrationCtrl', ['$scope', '$rootScope', '$location', '$q', '$timeout', '$stateParams', 'ngDialog', 'notify', 'Upload', '$filter', '$http', 'AuthService',
    function (scope, rootScope, location, $q, $timeout, stateParams, ngDialog, notify, Upload, $filter, http, AuthService) {
        scope.contentReady = false;
        var q = {
            languages: http.get('/get-content', {
                params: {
                    name: 'Filters',
                    query: {type: 'Content Writing', filter: 'Languages'},
                    distinctName: 'name'
                }
            }),
            industry: http.get('/get-content', {
                params: {
                    name: 'Filters',
                    query: {type: 'Content Writing', filter: 'Industry Expertise'},
                    distinctName: 'name'
                }
            }),
            content: http.get('/get-content', {
                params: {
                    name: 'Filters',
                    query: {type: 'Content Writing', filter: 'Content Type'},
                    distinctName: 'name'
                }
            }),
            locations: http.get('/get-content', {
                params: {
                    name: 'Location',
                    query: {},
                    distinctName: 'name'
                }
            })
        }

        if (AuthService.isLogged()) {
            q.freelancer = http.get('/api/freelancer/me')
        }

        $q.all(q).then(function (getContent) {
            scope.freelancer_area = {
                croppedProfile: '',
                profilePreview: ''
            }
            scope.contentReady = true;
            scope.freelancer = {
                isagency: true,
                work: {}
            };
            if (getContent.freelancer && getContent.freelancer.data)
                scope.freelancer = getContent.freelancer.data

            scope.toggleService = function (service_provider, filter, name) {
                var tQ = {
                    type: service_provider,
                    filter: filter ? filter : '!true',
                    name: name ? name : '!true'
                };
                var t = $filter('filter')(scope.freelancer.service_providers, tQ)
                if (t && t.length) {

                    scope.freelancer.service_providers = scope.freelancer.service_providers.filter(function (v) {
                        var condition = v.type == service_provider && v.filter == filter && v.name == name;
                        if (!name)
                            condition = v.type == service_provider && v.filter == filter
                        if (!name && !filter)
                            condition = v.type == service_provider
                        return !condition
                    });
                } else {
                    scope.freelancer.service_providers = scope.freelancer.service_providers || [];
                    scope.freelancer.service_providers.push({
                        type: service_provider,
                        filter: filter,
                        name: name
                    })
                }
            };

            scope.existsService = function (service_provider, filter, name) {
                var tQ = {
                    type: service_provider,
                    filter: filter ? filter : '!true',
                    name: name ? name : '!true'
                };
                var t = $filter('filter')(scope.freelancer.service_providers, tQ)
                return !!(t && t.length)
            };

            rootScope.globalFiles = [];
            scope.language = getContent.languages.data.data;
            scope.locations = getContent.locations.data.data;
            scope.industry = getContent.industry.data.data;
            scope.content = getContent.content.data.data;
            scope.experience = _.range(51);
            scope.showLink = false;
            rootScope.globalImg = [];
            scope.newPackage = {
                package: {}
            };
            scope.show = {};


            scope.scrollToErr = function () {
                $timeout(function () {
                    angular.element("body").animate({scrollTop: angular.element('.has-error').eq(0).offset().top - 100}, "slow");

                }, 500)
            };

            scope.clearSearchTerm = function () {
                scope.searchTerm = '';
            };

            scope.contentModel = scope.content;


            scope.addExtra = function (obj) {
                obj = obj || {}
                if (!scope.newPackage.package) scope.newPackage.package = {};
                scope.newPackage.package.extras = scope.newPackage.package.extras || [];
                if (obj.description && obj.price)
                    scope.newPackage.package.extras.push(obj)
            };

            scope.createPackage = function () {
                scope.newPackage = {};
                scope.show.pkgModal = true;
            };

            scope.addPkgFile = function (file) {
                Upload.dataUrl(file, true).then(function (url) {
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
                    if ($filter('filter')(scope.freelancer.service_packages, {_id: resp.data._id}).length) {
                        scope.freelancer.service_packages[index] = resp.data;
                    } else {
                        scope.freelancer.service_packages.push(resp.data)
                    }
                    ;

                    if (scope.freelancer._id)
                        http.post('/api/freelancer/request', scope.freelancer)
                }, function (resp) {
                }, function (evt) {
                });
                scope.newPackage = {
                    package: {},
                    tempPreview: ''
                };
                scope.show.pkgModal = false;
            };

            scope.editPackage = function (pkg, num) {
                scope.newPackage = {
                    package: angular.copy(pkg),
                    index: num
                };
            };

            scope.delete_package = function (item) {
                var index = scope.freelancer.service_packages.indexOf(item);
                scope.freelancer.service_packages.splice(index, 1);
                http.delete('/api/package/' + item._id).success(function () {
                })
            };

            scope.addPkgFile = function (file) {
                Upload.dataUrl(file, true).then(function (url) {
                    scope.newPackage.file = file;
                    scope.newPackage.tempPreview = url;
                });
            };

            //work

            scope.new_sample = {
                preview_attachments: []
            };

            scope.newPastClient = {};

            scope.freelancer_area.submittedSample = false;
            scope.addSampleWorkFiles = function ($files) {
                scope.new_sample.preview_attachments = scope.new_sample.preview_attachments.concat($files)
            };

            scope.addPastClientFile = function ($file) {
                scope.newPastClient.preview_attachment = $file
            };
            scope.potential_clients = [];
            $('body').click(function(e){
                scope.viewClient = false;
                scope.potential_clients = [];
                scope.$apply()
            });

            scope.focusin = function(){
                scope.viewClient = true;
                scope.getClients(scope.newPastClient.name)
            };

            scope.choiceClient = function(e,item){
                e.preventDefault()
                scope.newPastClient = {};
                scope.freelancer.past_clients = scope.freelancer.past_clients || [];
                scope.freelancer.past_clients.push(item);
                scope.potential_clients = [];
            };
            scope.$watch('newPastClient.name', function (e, data) {
                if (e) {
                    scope.getClients(e)
                }
            });

            scope.getClients = function(name){
                http.get('/api/get-clients', {params: {name: name}}).then(function (resp) {
                    scope.potential_clients = resp.data.data;
                }, function (err) {
                    console.log('err', err)
                })
            };

            scope.addClient = function () {
                if (!scope.newPastClient.name) return;
                Upload.upload({
                    url: '/api/freelancer/past_client',
                    data: JSON.parse(angular.toJson(scope.newPastClient)),
                    file: scope.newPastClient.preview_attachment
                }).then(function (resp) {
                    scope.newPastClient = {};
                    scope.freelancer.past_clients = scope.freelancer.past_clients || [];
                    scope.freelancer.past_clients.push(resp.data);
                }, function (resp) {
                }, function (evt) {
                });

            };

            scope.deletePastClient = function (id) {
                http.delete('/api/freelancer/past_client/' + id)
            };

            scope.submitSample = function (invalid) {
                if (invalid) return;
                scope.freelancer_area.submittedSample = false;
                Upload.upload({
                    url: '/api/work/sample_work',
                    data: JSON.parse(angular.toJson(scope.new_sample)),
                    file: scope.new_sample.preview_attachments
                }).then(function (resp) {
                    scope.new_sample = {
                        preview_attachments: []
                    };
                    scope.freelancer.work.work_samples = scope.freelancer.work.work_samples || [];
                    scope.freelancer.work.work_samples.push(resp.data);
                }, function (resp) {
                }, function (evt) {
                });
            };

            scope.submitWork = function () {
                if (Object.keys(scope.freelancer.work).length === 0) {
                    scope.freelancer_area.activeTab = 'contact';
                    return;
                }
                http.post('/api/work', JSON.parse(angular.toJson(scope.freelancer.work))).success(function (resp) {
                    scope.freelancer.work = resp;
                    scope.freelancer_area.activeTab = 'contact';
                });
            };

            scope.deleteSampleWork = function (id) {
                http.delete('/api/work/sample_work/' + id)
            };
            scope.addContactDetailPreview = function (file) {
                scope.contactDetailPreview = file;
            };

            scope.addContactDetails = function (invalid) {
                if (invalid) return;
                http.post('/api/freelancer/contact_detail', scope.freelancer.contact_detail).success(function (resp) {
                    scope.freelancer.contact_detail = resp.data;
                    if (scope.freelancer.work && !scope.freelancer.work._id)
                        delete scope.freelancer.work

                    http.post('/api/freelancer/request', scope.freelancer).success(function (resp) {
                        if (scope.freelancer._id) {
                            notify({message: 'Profile has been updated!', duration: 3000, position: 'right', classes: "alert-success"});
                        } else {
                            var has_sent = ngDialog.open({
                                template: 'has_sent',
                                className: 'ngdialog-theme-default',
                            });
                            has_sent.closePromise.then(function () {
                                rootScope.go('/')
                            });
                        }
                    });
                });
            };
        });

        scope.setProfileTempPreview = function (file) {
            Upload.dataUrl(file, true).then(function (url) {
                scope.freelancer_area.profilePreview = url
            })
        };

        scope.submitCropped = function (croppedImg) {
            if (croppedImg) {
                scope.freelancer.contact_detail.preview = croppedImg;
                scope.show.profilePreview = false;
                scope.freelancer_area.croppedProfile = '';
            }
        }

    }]);
