/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('myProfileCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'notify', function (scope, location, http, $q, getContent, notify) {
    scope.profile = getContent.user.data.data;
    scope.save = function (edit, invalid, profile) {
        if (edit || invalid) return;
        http.post('/upload-profile', profile).then(function (resp) {
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
            http.post('/update-password', password).then(function (resp) {
                scope.changePassword = false;
                notify({message: 'Password was changed!', duration: 1000, position: 'right', classes: "alert-success"});
            }, function (err) {
                if (err.data.error == "Wrong password")
                    scope.wrongPassword = true;
            })
        }
    }
}]);
