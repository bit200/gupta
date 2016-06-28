/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('myProfileCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'notify', '$rootScope',
    function (scope, location, http, $q, getContent, notify, $rootScope) {
    $rootScope.globalImg = [];
    scope.profile = getContent.user.data.data;

    $rootScope.profile_area = {}
    $rootScope.$watchCollection('globalImg', function(imgs){
        if (imgs && imgs.length){
            http.put('/api/user/profile', {poster: imgs[0].data._id}).then(function (resp) {
                notify({message: 'Profile Image has been updated', duration: 1000, position: 'right', classes: "alert-success"});
                $rootScope.profile_area.changeImage = false;
                scope.profile.poster = imgs[0].data
                $rootScope.globalImg = [];
            }, function (err) {
                console.log('err', err)
            })
        }
    });

    var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            scope.$apply(function(scope){
                scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    scope.save = function (invalid, profile) {
        if (invalid) return;
        http.put('/api/user/profile', profile).then(function (resp) {
            notify({message: 'Profile has been updated', duration: 1000, position: 'right', classes: "alert-success"});
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    };

    scope.showModal = function (bol) {
        scope.changePassword = bol
    };

    scope.change = function (invalid, password) {
        if (invalid) return;
        if (password.newPassword != password.confirm_password) {
            scope.failPassword = true
        }
        if (password.newPassword == password.confirm_password) {
            scope.failPassword = false;
            http.post('/api/user/update-password', password).then(function (resp) {
                scope.changePassword = false;
                notify({message: 'Password was changed!', duration: 1000, position: 'right', classes: "alert-success"});
            }, function (err) {
                if (err.data.error == "Wrong password")
                    scope.wrongPassword = true;
            })
        }
    }
}]);
