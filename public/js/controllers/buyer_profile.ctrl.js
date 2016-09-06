/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('BuyerProfileCtrl', ['$scope', '$location', '$http', '$q', 'notify', '$rootScope', 'AuthService', 'Upload',
    function (scope, location, http, $q, notify, $rootScope, AuthService, Upload) {
    $rootScope.globalImg = [];
    scope.profile = AuthService.currentUser();

    scope.image = {
        originalImage: '',
        croppedImage: ''
    };
    scope.profile_area = {};

    scope.dropImage = function(file){
        Upload.dataUrl(file, true).then(function(url){
            scope.image.originalImage = url
        });
    }

    scope.showUpdatePic = function(){
        scope.profile_area.changeImage=true;
        if (scope.profile.preview)
            scope.image.originalImage = angular.copy(scope.profile.preview)
    };

    scope.setEditedProfile = function(){
        scope.profile_area.editedProfile=angular.copy(scope.profile)
    }
    scope.updateProfile = function(img, invalid, editedProfile){
         if (invalid) return
         if (img)
             scope.profile.preview = img;
        var data = angular.copy(JSON.parse(angular.toJson(scope.profile)))
        if (editedProfile)
            data = editedProfile
        http.put('/api/user/profile', data).success(function(resp){
            scope.profile = resp.data;
            AuthService.setCurrentUser(resp);
            scope.profile_area.changeImage=false;
            scope.image = {
                originalImage: '',
                croppedImage: ''
            };
            notify({message: 'Profile has been updated!', duration: 3000, position: 'right', classes: "alert-success"});
            scope.submitted=false;
            scope.profile_area.editProfile = false;
            scope.profile_area.editedProfile = '';
        });
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
                notify({message: 'Password was changed!', duration: 3000, position: 'right', classes: "alert-success"});
            }, function (err) {
                if (err.data.error == "Wrong password")
                    scope.wrongPassword = true;
            })
        }
    }

      
}]);
