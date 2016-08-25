var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('loginCtrl', ['$scope', '$http', 'AuthService', '$state', 'loginSocial', 'ModalService', function ($scope, $http, AuthService, $state, loginSocial, ModalService) {
    $scope.signin = function (invalid, data) {
        $scope.loginError = '';
        if (invalid) return;
        $http.get('/sign-in', {params: {email: data.email, password: data.password}}).success(function (resp) {
            if (!resp.data.user.first_singin) {
                AuthService.setTokens({
                    accessToken: resp.data.accessToken.value,
                    refreshToken: resp.data.refreshToken.value
                });
                window.location.replace("http://www.themediaant.com/12thcross");
                // $state.go('home');
            } else {
                ModalService.showModal({
                    templateUrl: "template/modal/changePassword.html",
                    controller: function ($scope, $element, $http, notify, AuthService, $state) {
                        $scope.changePass = function (invalid, password) {
                            if (invalid) return;
                            if (password.newPassword != password.confirm_password) {
                                $scope.failPassword = true
                            }
                            if (password.newPassword == password.confirm_password) {
                                $scope.failPassword = false;
                                password.userId = resp.data.user._id;
                                $http.post('/api/user/first-update-password', password).then(function (data) {
                                    $scope.changePassword = false;
                                    notify({message: 'Password was changed!', duration: 3000, position: 'right', classes: "alert-success"});
                                    AuthService.setTokens({
                                        accessToken: resp.data.accessToken.value,
                                        refreshToken: resp.data.refreshToken.value
                                    });
                                    $element.modal('hide');
                                    $state.go('home');
                                }, function (err) {
                                    if (err.data.error == "Wrong password")
                                        $scope.wrongPassword = true;
                                })
                            }
                        };

                        $scope.continue = function () {
                            $http.get('/api/user/first-signIn', {params: {userId: resp.data.user._id}}).then(function (data) {
                                AuthService.setTokens({
                                    accessToken: resp.data.accessToken.value,
                                    refreshToken: resp.data.refreshToken.value
                                });
                                $element.modal('hide');
                                $state.go('home');
                            })
                        }
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {

                    });

                });
            }
        }).error(function (err) {
            if (err.error == 'Item not found')
                $scope.loginError = 'User with this login not found';
            else
                $scope.loginError = 'Password not correct'
        });
    };

    
    $scope.login_google = function () {
        var element = (document.getElementById('customBtn'));
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.attachClickHandler(element, {},
            function (googleUser) {
                loginSocial(googleUser.wc.hg, googleUser.wc.Za, googleUser.wc.Na, googleUser.wc.Ph)
            }, function (error) {
            });
    };


    IN.Event.on(IN, "auth", getProfileData);
    function getProfileData() {
        IN.API.Raw("/people/~").result(function(resp){console.log('r',resp)}).error(function(err){console.log('e', err)});
    }
    $scope.LinkedIn = function () {
        if (IN && IN.User && IN.User.isAuthorized()) {
            // IN.API.Raw("/people/~").result(function (resp) {
            //     console.log('resp', resp)
            // }).error(function (err) {
            //     console.log('err', err)
            // });
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

    $scope.login = function () {
        FB.init({
            appId      : '930075280420914',
            xfbml      : true,
            version    : 'v2.5'
        });
        FB.login(function (response) {
            if (response.status === 'connected') {
                FB.api('/me?fields=id,email,name,picture', function (data) {
                    var name = data.name.split(' ');
                    loginSocial(data.email, name[0], name[1], data.picture.data.url)
                })
            }
        }, {scope: 'email'});
    };


}]);
