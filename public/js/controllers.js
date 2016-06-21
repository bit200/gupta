// 'use strict';
// String.prototype.replaceAll = function (search, replacement) {
//     var target = this;
//     return target.split(search).join(replacement);
// };
//
// /* Controllers */
// var XYZCtrls = angular.module('XYZCtrls', []);
//
//
// XYZCtrls.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', 'safeApply', function (scope, rootScope, location, http, safeApply) {
//     scope.setAuth = function () {
//         rootScope.auth123 = window.localStorage.getItem('accessToken');
//
//         safeApply.run(rootScope);
//     }
//     rootScope.$on("$routeChangeStart", function (event, next, current) {
//         //..do something
//         scope.setAuth()
//         //event.stopPropagation();  //if you don't want event to bubble up
//     });
//
//     scope.formCorrect = false;
//     scope.setAuth()
//
//     scope.signin = function (invalid, data) {
//
//         if (invalid) {
//             scope.formCorrect = true;
//             return;
//         }
//         http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
//                 if (resp.status == 200) {
//                     localStorage.setItem('accessToken', resp.data.data.accessToken.value);
//                     localStorage.setItem('refreshToken', resp.data.data.refreshToken.value);
//                     location.path('home')
//                 }
//             },
//             function (err) {
//                 if (err.data.error == 'Item not found') {
//                     scope.error = 'User with this login not found';
//                     scope.errL = true;
//                     scope.loginForm.$invalid = true;
//                 } else {
//                     scope.errP = true;
//                     scope.loginForm.$invalid = true;
//                     scope.error = 'Password not correct'
//                 }
//             })
//     };
//
//     scope.logout = function () {
//         localStorage.clear();
//         scope.setAuth()
//         location.path('/login')
//     };
//
//     scope.homePage = function () {
//         location.path('/home')
//     };
//
//     scope.showMessage = false;
//     scope.startInput = function () {
//         scope.loginForm.$invalid = false;
//         scope.error = "";
//         scope.errL = false;
//         scope.errP = false;
//         scope.submitted = false;
//     }
// }]);
//
// XYZCtrls.controller('RegistrationCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
//     scope.registration = function (invalid, data) {
//         if (invalid) return;
//         http.post('/sign-up', data).then(function (resp) {
//                 location.path('/')
//             }, function (err, r) {
//             }
//         )
//     };
// }]);
//
// XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', function (scope, location, http, q, getContent) {
//
//
//     scope.cancelRegistration = function () {
//         location.path('/')
//     };
//
// }]);
//
// XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', function (scope, location, http, $q, getContent) {
//
//
//     scope.link = function (url) {
//         location.path(url)
//     };
//
//
//     scope.arrayProviders = getContent.service.data.data;
//
//     scope.profiles = [
//         {
//             poster: 'http://www.gizmonews.ru/wp-content/uploads/2013/01/gold-shirt-guy-550x699.jpg',
//             name: 'Darshit Lal',
//             rating: [1, 1, 1, 1, 0],
//             popularity: [1, 1, 0, 0]
//         },
//         {
//             poster: 'http://www.vokrug.tv/pic/product/5/1/8/b/medium_518b990ee260dea2fa9b3df92a7a4020.png',
//             name: 'Madhup Nanda',
//             rating: [1, 1, 1, 0, 0],
//             popularity: [1, 1, 1, 0]
//         }
//         ,
//         {},
//         {}
//     ];
//
//     scope.jobs = [
//         {
//             'Job Title': 'Hard job',
//             'Job Category': 'hard',
//             'Job Specifics': 'Nothing',
//             'Location Preference': '1 24rw r124rwrq',
//             'Budget(max)': 20
//         },
//         {
//             'Job Title': 'Easy job',
//             'Job Category': 'easy',
//             'Job Specifics': 'Just do it',
//             'Location Preference': 'i76iuy iy7iy',
//             'Budget(max)': 9999999999999
//         }
//     ]
//
//
// }]);
//
//
// XYZCtrls.controller('userCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'ngDialog', function (scope, location, http, $q, getContent, ngDialog) {
//     scope.arrayProviders = getContent.service.data.data;
//     scope.arrayTopics = getContent.topic.data.data;
//     scope.user = getContent.user.data.data;
//
//
//     ngDialog.open({
//         template: 'templateId',
//         className: 'ngdialog-theme-default',
//         controller: function ctrl(dep) {
//
//
//         },
//         resolve: {
//             dep: function depFactory() {
//                 return
//             }
//         }
//
//
//     });
//     scope.socialNetworks = [
//         {
//             name: 'Facebook',
//             model: 'facebook'
//         }, {
//             name: 'Twitter',
//             model: 'twitter'
//         }, {
//             name: 'Google+',
//             model: 'google'
//         }, {
//             name: 'LinkedIn',
//             model: 'linkedin'
//         }, {
//             name: 'Instragram',
//             model: 'instragram'
//         }, {
//             name: 'Flickr',
//             model: 'flickr'
//         }, {
//             name: 'Pinterest',
//             model: 'pinterest'
//         }
//     ];
//
//     scope.closeMenu = function () {
//         if (!scope.close.social) {
//             scope.close.social = true;
//         }
//         else scope.close.social = false;
//     }
//     scope.slider = {
//         video: {
//             minValue: 20000,
//             maxValue: 800000,
//             options: {
//                 floor: 0,
//                 ceil: 1000000,
//                 step: 1,
//                 noSwitching: true,
//                 showSelectionBar: true,
//                 getPointerColor: function (value) {
//                     return '#B9B6B9';
//                 },
//                 getSelectionBarColor: function (value) {
//                     return '#B9B6B9';
//                 },
//                 translate: function (value) {
//                     if (value < 1000) {
//                         return value
//                     }
//                     if (value < 1000000) {
//                         return value / 1000 + 'k'
//                     }
//
//                     return value / 1000000 + 'm';
//                 }
//             }
//         },
//         web: {
//             minValue: 20000,
//             maxValue: 800000,
//             options: {
//                 floor: 0,
//                 ceil: 1000000,
//                 step: 1,
//                 noSwitching: true,
//                 showSelectionBar: true,
//                 getPointerColor: function (value) {
//                     return '#B9B6B9';
//                 },
//                 getSelectionBarColor: function (value) {
//                     return '#B9B6B9';
//                 },
//                 translate: function (value) {
//                     if (value < 1000) {
//                         return value
//                     }
//                     if (value < 1000000) {
//                         return value / 1000 + 'k'
//                     }
//
//                     return value / 1000000 + 'm';
//                 }
//             }
//         }
//     }
// }]);
//
//
// XYZCtrls.controller('categoryCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', function (scope, location, http, parseRating, $q, getContent) {
//     scope.arrayProviders = getContent.service.data.data;
//     scope.arrayTopics = getContent.topic.data.data;
//     scope.arrayContent = getContent.content.data.data;
//     scope.arrayLanguages = getContent.languages.data.data;
//     scope.arrayLocations = getContent.locations.data.data;
//     scope.freelancer = parseRating.rating(getContent.freelancer.data.data);
//     scope.freelancer = parseRating.popularity(getContent.freelancer.data.data);
//     scope.slider = {
//         experience: {
//             value: 3,
//             options: {
//                 floor: 0,
//                 ceil: 15,
//                 step: 1,
//                 showSelectionBar: true,
//                 getPointerColor: function (value) {
//                     return '#B9B6B9';
//                 },
//                 getSelectionBarColor: function (value) {
//                     return '#B9B6B9';
//                 },
//                 translate: function (value) {
//                     if (value == 0) {
//                         return value
//                     }
//                     if (value == 1) {
//                         return value + ' year'
//                     }
//                     if (value == 15) {
//                         return value + '+ year'
//                     }
//                     return value + ' years';
//                 }
//             }
//         }
//     }
//
// }]);
//
//
// XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', '$routeParams', function (scope, location, http, parseType, $q, getContent, routeParams) {
//     scope.job = {
//         public: true,
//         agency: true
//     };
//     if (routeParams.id) {
//         http.get('/get-job', {params: {_id: routeParams.id}}).then(function (resp) {
//             scope.job = resp.data.data[0]
//         })
//     }
//     scope.contentTypes = getContent.contentType.data.data;
//     scope.locations = getContent.locations.data.data;
//
//     scope.arrayProvidersModel = parseType.getModel(scope.contentTypes);
//
//     scope.addJob = function (invalid, job) {
//         if (invalid) return;
//         job.content_types = parseType.get(job.content, scope.contentTypes);
//         job.local_preference = parseType.get(job.location, scope.locations);
//         http.post('/job', job).then(function (resp) {
//                 location.path('/home')
//             }, function (err, r) {
//             }
//         )
//     };
// }]);
//
//
// XYZCtrls.controller('profileCtrl', ['$scope', '$location', '$http', '$routeParams', 'parseRating', function (scope, location, http, $routeParams, parseRating) {
//     http.get('/get-user', {params: {id: $routeParams.id}}).then(function (resp) {
//         scope.profile = parseRating.rating([resp.data.data])[0];
//     })
// }]);
//
//
// XYZCtrls.controller('viewMyJobCtrl', ['$scope', '$location', '$http', '$routeParams', 'parseRating', function (scope, location, http, $routeParams, parseRating) {
//     http.get('/get-user', {params: {id: $routeParams.id}}).then(function (resp) {
//         scope.profile = parseRating.rating([resp.data.data])[0];
//     })
// }]);
//
//
// XYZCtrls.controller('forgotCtrl', ['$scope', '$location', '$http', '$routeParams', function (scope, location, http, routeParams) {
//     scope.send = true;
//     scope.submitted = false;
//     scope.button = 'Send';
//     scope.restore = function (invalid, email) {
//         scope.error = "";
//         if (invalid) return;
//         scope.button = 'Wait';
//         http.get('/send-restore', {params: {email: email}}).then(function (resp) {
//             scope.send = false;
//         }, function (err) {
//             scope.button = 'Send';
//             scope.error = "Email not found!"
//         })
//     };
//     scope._restore = false;
//     scope.restorePassword = function (password) {
//         http.get('/restore', {
//             params: {
//                 restore_code: routeParams.restoreCode,
//                 password: password
//             }
//         }).then(function (resp) {
//             scope._restore = true;
//             scope.restoreText = 'Password have been changed.'
//         }, function (err) {
//             scope.restoreText = 'Password was changed by this restore code'
//         })
//     }
// }]);
//
//
// XYZCtrls.controller('confirmCtrl', ['$scope', '$location', '$http', '$routeParams', 'ngDialog', function (scope, location, http, routeParams, ngDialog) {
//     http.get('/confirm', {params: {confirm_code: routeParams.confirmCode}}).then(function (resp) {
//         scope.text = 'Congratulations, you have verified your account';
//     }, function (err) {
//         scope.error = true;
//         scope.text = "Oops! Verification already carried out or an invalid verification code."
//     });
// }]);
//
// XYZCtrls.controller('freelancerCtrl', ['$scope', '$rootScope', '$location', '$http', 'parseType', '$q', '$timeout', 'getContent',
//     '$routeParams', 'ngDialog', 'Upload', function (scope, rootScope, location, http, parseType, $q, $timeout, getContent, routeParams, ngDialog, Upload) {
//         scope.freelancer = {isagency: true};
//         rootScope.globalFiles = [];
//         scope.industry = getContent.industry.data.data;
//         scope.content = getContent.content.data.data;
//         scope.language = getContent.languages.data.data;
//         scope.freelancerType = getContent.freelancerType.data.data;
//         scope.locations = getContent.locations.data.data;
//         scope.experience = _.range(51);
//         scope.extras = [];
//         scope.new_services = [];
//
//         if (routeParams.id) {
//             http.get('/freelancer', {params: {_id: routeParams.id}}).then(function (resp) {
//                 scope.freelancer = resp.data.data[0]
//             })
//         }
//         scope.clearSearchTerm = function () {
//             scope.searchTerm = '';
//         };
//
//
//
//         scope.contentModel = parseType.getModel(scope.content);
//
//         scope.register = function (invalid, freelancer) {
//             if (invalid) return;
//             if (freelancer.service_price) freelancer.service_price = freelancer.price[freelancer.service_type]
//             http.post('/freelancer', freelancer).then(function (resp) {
//                     location.path('/home')
//                 }, function (err, r) {
//                 }
//             )
//         };
//
//         scope.addPackage = function (bol) {
//             scope.viewModal = bol
//         };
//
//         scope.custom = {};
//         scope.submitExtra = function (invalid, extra) {
//             if (invalid) return;
//             scope.extras.push(extra);
//             scope.custom = {};
//         };
//
//         scope.createPackage = function (invalid, service) {
//             if (invalid) return;
//             scope.freelancer.service_packages = scope.freelancer.service_packages || [];
//             service.extras = scope.extras;
//             http.post('/add-package', service).then(function (resp) {
//                     scope.viewModal = false;
//                     scope.new_services.push(resp.data.data);
//                     scope.freelancer.service_packages.push(resp.data.data._id)
//                 }, function (err, r) {
//                 }
//             )
//         };
//
//         scope.delete_package = function (item) {
//             var index = scope.new_services.indexOf(item);
//             scope.new_services.splice(index, 1);
//             scope.freelancer.service_packages.splice(index, 1);
//         };
//
//
//         scope.deleteNewFile = function (file_id, index) {
//             http({
//                 url:'/deleteFile',
//                 method:'DELETE',
//                 data: {_id: file_id},
//                 headers: {"Content-Type": "application/json;charset=utf-8"}
//             }).success(function (res) {
//                 console.log(res)
//             });
//             rootScope.globalFiles.splice(index, 1);
//         };
//
//         scope.$watchCollection('globalFiles', function () {
//             console.log(rootScope.globalFiles);
//             ngDialog.closeAll();
//         });
//
//         scope.attachFile = function () {
//             ngDialog.open({
//                 template: 'attachFile',
//                 className: 'ngdialog-theme-default',
//                 controller: 'uploadFile'
//             })
//         }
//     }]);
//
// XYZCtrls.controller('uploadFile', ['$scope', '$rootScope', '$http', '$location', '$timeout', 'Upload', 'ngDialog',
//     function (scope, rootScope, http, location, $timeout, Upload, ngDialog) {
//         // scope.picFile = {};
//         ////
//         //scope.$watch("picFile", function (newvalue, oldvalue) {
//         //     console.log(newvalue,oldvalue)
//         //}, true);
//         // scope.uploader = new FileUploader({url:'/uploadFile'});
//
//         //console.log(scope.uploader);
//
//         scope.open = function (url) {
//
//             console.log(url.$ngfBlobUrl.toString());
//             var win = window.open(url.$ngfBlobUrl, '_blank');
//             win.focus();
//         };
//
//         scope.uploadPic = function (file) {
//             file.upload = Upload.upload({
//                 url: 'http://localhost:8080/uploadFile', //webAPI exposed to upload the file
//                 data: {file: file} //pass file as data, should be user ng-model
//             });
//             file.upload.then(function (response) {
//                 $timeout(function () {
//                     file.result = response.data;
//                 });
//             }, function (response) {
//                 if (response.status > 0)
//                     scope.errorMsg = response.status + ': ' + response.data;
//             }, function (evt) {
//                 file.progress = Math.min(100, parseInt(100.0 *
//                 evt.loaded / evt.total));
//             });
//         };
//
//
//         scope.showDrop = true;
//         scope.$watch('picFile', function (newValue, oldValue) {
//             if (newValue != undefined) {
//                 scope.showDrop = false;
//                 scope.uploadPic(newValue);
//                 rootScope.globalFiles.push(newValue);
//
//             }
//         });
//
//         scope.uploadPic = function (file) {
//
//             file.upload = Upload.upload({
//                 url: 'http://localhost:8080/uploadFile', //webAPI exposed to upload the file
//                 data: {file: file} //pass file as data, should be user ng-model
//             });
//
//             file.upload.then(function (response) {
//                 $timeout(function () {
//                     file.result = response.data;
//                 });
//             }, function (response) {
//                 if (response.status > 0)
//                     scope.errorMsg = response.status + ': ' + response.data;
//             }, function (evt) {
//                 file.progress = Math.min(100, parseInt(100.0 *
//                     evt.loaded / evt.total));
//             });
//
//         }
// //    then(function (resp) { //upload function returns a promise
// //        if(resp.data.error_code === 0){ //validate success
// //            $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
// //        } else {
// //            $window.alert('an error occured');
// //        }
// //    }, function (resp) { //catch error
// //        console.log('Error status: ' + resp.status);
// //        $window.alert('Error status: ' + resp.status);
// //    }, function (evt) {
// //        console.log(evt);
// //        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
// //        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
// //        scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
// //    });
// //};
//
// //console.log(scope.picFile);
//
//
// //scope.uploadPic = function(file) {
// //    Upload.base64DataUrl(file).then(function (url) {
// //        http.post('/uploadFile', {img: url}).success(function (res) {
// //            console.log(res)
// //        })
// //
// //    });
// //};
//
// //scope.uploadPic = function(files){
// //    var data = "s";
// //    Upload.upload({
// //        url: '/uploadFile',
// //        method: 'POST',
// //        data: data, // Any data needed to be submitted along with the files
// //        file: files
// //    });
// //};
//
// //scope.file = {}; //Модель
// //scope.options = {
// //    //Вызывается для каждого выбранного файла
// //    change: function (file) {
// //        //В file содержится информация о файле
// //        //Загружаем на сервер
// //        file.$upload('/uploadFile', scope.file)
// //    }
// //}
//
//
// //scope.uploadPic =function(file){
// //    Upload.upload({
// //        url:'/uploadFile',
// //        data:  Upload.base64DataUrl(file)
// //    }).then(function (resp) {
// //        $timeout(function () {
// //            scope.result = resp.data;
// //        });
// //    }, function (response) {
// //        if (response.status > 0) scope.errorMsg = response.status
// //        + ': ' + response.data;
// //    }, function (evt) {
// //        scope.progress = parseInt(100.0 * evt.loaded / evt.total);
// //    });
// //};
//
//
//     }])
// ;
//
// XYZCtrls.controller('myProfileCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'notify', function (scope, location, http, $q, getContent, notify) {
//     scope.profile = getContent.user.data.data;
//     scope.save = function (edit, invalid, profile) {
//         if (edit || invalid) return;
//         http.post('/upload-profile', profile).then(function (resp) {
//             console.log('resp', resp)
//         }, function (err) {
//             console.log('err', err)
//         })
//     };
//
//     scope.showModal = function (bol) {
//         scope.changePassword = bol
//     };
//
//     scope.change = function (invalid, password) {
//         if (invalid) return;
//         if (password.newPassword != password.confirm_password) {
//             scope.failPassword = true
//         }
//         if (password.newPassword == password.confirm_password) {
//             scope.failPassword = false;
//             http.post('/update-password', password).then(function (resp) {
//                 scope.changePassword = false;
//                 notify({message: 'Password was changed!', duration: 1000, position: 'right', classes: "alert-success"});
//             }, function (err) {
//                 if (err.data.error == "Wrong password")
//                     scope.wrongPassword = true;
//             })
//         }
//     }
// }]);
//
//
//
// XYZCtrls.controller('contractCtrl', ['$scope', '$location', '$http', 'getContent', 'ModalService', function (scope, location, http, getContent, ModalService) {
//     scope.contract = getContent.contract.data.data;
//     scope.createContract = function (invalid, type, data) {
//         http.post('/contract/' + type, data).then(function (resp) {
//             type == 'delete' ? location.path('/home') : location.path('/home');
//             console.log('resp', resp)
//         }, function (err) {
//             console.log('err', err)
//         })
//     }
//
//     scope.preview = function () {
//         ModalService.showModal({
//             templateUrl: "template/modal/previewContract.html",
//             controller: function ($scope) {
//                 $scope.contract = scope.contract;
//                 $scope.contract.expected_start = parseDate($scope.contract.expected_start);
//                 $scope.contract.expected_completion = parseDate($scope.contract.expected_completion);
//                 function parseDate(date) {
//                     var today = new Date(date);
//                     var dd = today.getDate();
//                     var mm = today.getMonth() + 1; //January is 0!
//                     var yyyy = today.getFullYear();
//
//                     if (dd < 10) {
//                         dd = '0' + dd
//                     }
//
//                     if (mm < 10) {
//                         mm = '0' + mm
//                     }
//
//                     return (mm + '-' + dd + '-' + yyyy);
//                 }
//
//             }
//         }).then(function (modal) {
//             modal.element.modal();
//             modal.close.then(function (result) {
//             });
//
//         });
//     }
// }]);
//
// XYZCtrls.controller('contractApproveCtrl', ['$scope', '$location', '$http', 'getContent', '$routeParams', 'parseType', 'ModalService', function (scope, location, http, getContent, routeParams, parseType, ModalService) {
//     scope.contract = parseType.contract(getContent.contract.data.data);
//     scope.createContract = function (invalid, type, data) {
//         http.post('/contract/' + type, data).then(function (resp) {
//             type == 'delete' ? location.path('/home') : location.path('/home');
//             console.log('resp', resp)
//         }, function (err) {
//             console.log('err', err)
//         })
//     };
//
//     scope.respond = function (type) {
//         switch (type) {
//             case 'approve':
//                 approve();
//                 break;
//             case 'reject':
//                 reject();
//                 break;
//             case 'suggest':
//                 suggest();
//                 break;
//         }
//         function approve() {
//             console.log('1')
//             http.get('/contract/approve', {params: {_id: scope.contract._id}}).then(function (resp) {
//                 console.log(resp)
//             }, function (err) {
//                 console.log('err', err)
//             })
//         }
//
//         function reject() {
//             ModalService.showModal({
//                 templateUrl: "template/modal/rejectContract.html",
//                 controller: function ($scope) {
//                     $scope.send = function (text) {
//                         scope.contract.reject_reason = text
//                         http.post('/contract/reject', scope.contract).then(function (resp) {
//                             console.log(resp)
//                         }, function (err) {
//                             console.log('err', err)
//                         })
//                     }
//                 }
//             }).then(function (modal) {
//                 modal.element.modal();
//                 modal.close.then(function (result) {
//                 });
//
//             });
//
//         }
//
//         function suggest() {
//             ModalService.showModal({
//                 templateUrl: "template/modal/suggestContract.html",
//                 controller: function ($scope) {
//                     $scope.contract = scope.contract;
//                     $scope.send = function (model) {
//                         model.contract = scope.contract._id;
//                         http.post('/contract/suggest', model).then(function (resp) {
//                             console.log(resp)
//                         }, function (err) {
//                             console.log('err', err)
//                         })
//                     }
//                 }
//             }).then(function (modal) {
//                 modal.element.modal();
//                 modal.close.then(function (result) {
//                 });
//
//             });
//
//         }
//
//
//     }
// }]);
//
// XYZCtrls.controller('agencyCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
//     scope.requestBusiness = false;
//     scope.agency = parseType.agency(getContent.agency.data.data);
//     scope.claim = function (agency, bol) {
//         scope.choiceAgency = agency;
//         scope.requestBusiness = bol;
//     };
//
//     scope.sendRequest = function (invalid, data) {
//
//         if (invalid) return;
//         scope.req = {
//             data: data,
//             agency: scope.choiceAgency
//         };
//
//         http.post('/request-business', scope.req).then(function (resp) {
//             scope.requestBusiness = false;
//             _.forEach(scope.agency, function (item) {
//                 if (item['Agency Name'] == scope.choiceAgency) {
//                     item.Status = true
//                 }
//             })
//         })
//     };
// }]);
//
//
// XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
//     scope.isAuth = function () {
//         return true;
//         //return getContent.user.data.data;
//
//     }
//
// }]);
