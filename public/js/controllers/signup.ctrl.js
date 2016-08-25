var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('signupCtrl', ['$scope', '$state', 'AuthService', '$http', 'loginSocial', function ($scope, $state, AuthService, $http, loginSocial) {
    var q = {};

    $scope.signup = function (invalid, data) {
        $scope.emailError = '';
        if (invalid) return;
        $http.post('/sign-up', data).success(function (resp) {
            AuthService.setTokens({
                accessToken: resp.data.accessToken.value,
                refreshToken: resp.data.refreshToken.value
            });
            AuthService.isFreelancer = fasle;
            $state.go('home')
        }).error(function (err) {
            if (err.errors && err.errors.email)
                $scope.emailError = 'The email already in use'
        })
    };

    $scope.login_google = function () {
        var element = (document.getElementById('customBtn'));
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.attachClickHandler(element, {},
            function (googleUser) {
                loginSocial(googleUser.wc.hg, googleUser.wc.Za, googleUser.wc.Na, googleUser.wc.Ph)
            }, function (error) {
            });
    }

    $scope.LinkedIn = function () {
        if (IN.User.isAuthorized()) {
            IN.API.Profile("me").fields("first-name", "last-name", "email-address", "picture-url").result(function (data) {
                var user = data.values[0];
                loginSocial(user.emailAddress, user.firstName, user.lastName, user.pictureUrl || ' ');
            }).error(function (data) {
            });
        } else {
            IN.User.authorize(function () {
                IN.API.Profile("me").fields("first-name", "last-name", "email-address").result(function (data) {
                    var user = data.values[0];
                    loginSocial(user.emailAddress, user.firstName, user.lastName, user.pictureUrl || ' ');
                }).error(function (data) {
                    console.log(data);
                });
            }, {});
        }

    };
    $(document).on( "fbInit", function() {
        $scope.login = function () {
            FB.login(function (response) {
                if (response.status === 'connected') {
                    FB.api('/me?fields=id,email,name,picture', function (data) {
                        var name = data.name.split(' ');
                        loginSocial(data.email, name[0], name[1], data.picture.data.url)
                    })
                }
            }, {scope: 'email'});
        };
    });

}]);
