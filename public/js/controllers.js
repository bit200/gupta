'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Controllers */
var XYZCtrls = angular.module('XYZCtrls', []);


XYZCtrls.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', 'safeApply', function (scope, rootScope, location, http, safeApply) {
    scope.setAuth = function () {
        rootScope.auth123 = window.localStorage.getItem('accessToken');

        safeApply.run(rootScope);
    }
    rootScope.$on("$routeChangeStart", function (event, next, current) {
        //..do something
        console.log('starttttt')
        scope.setAuth()
        //event.stopPropagation();  //if you don't want event to bubble up
    });

    scope.formCorrect = false;
    scope.setAuth()

    scope.signin = function (invalid, data) {

        if (invalid) {
            scope.formCorrect = true;
            return;
        }
        http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
                if (resp.status == 200) {
                    localStorage.setItem('accessToken', resp.data.data.accessToken.value);
                    localStorage.setItem('refreshToken', resp.data.data.refreshToken.value);
                    location.path('home')
                }
            },
            function (err) {
                if (err.data.error == 'Item not found') {
                    scope.error = 'User with this login not found';
                    scope.errL = true;
                    scope.loginForm.$invalid = true;
                } else {
                    scope.errP = true;
                    scope.loginForm.$invalid = true;
                    scope.error = 'Password not correct'
                }
            })
    };

    scope.logout = function () {
        localStorage.clear();
        scope.setAuth()
        location.path('/login')
    };

    scope.homePage = function () {
        location.path('/home')
    };

    scope.showMessage = false;
    scope.startInput = function () {
        scope.loginForm.$invalid = false;
        scope.error = "";
        scope.errL = false;
        scope.errP = false;
        scope.submitted = false;
    }
}]);

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', function (scope, location, http) {

    scope.registration = function (invalid, data) {
        console.log(invalid)
        if (invalid) return;
        http.post('/sign-up', data).then(function (resp) {
                location.path('/')
            }, function (err, r) {
            }
        )
    };

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };


    //scope.arrayProviders = getContent.service.data.data;


    scope.profiles = [
        {
            poster: 'http://www.gizmonews.ru/wp-content/uploads/2013/01/gold-shirt-guy-550x699.jpg',
            name: 'Darshit Lal',
            rating: [1, 1, 1, 1, 0],
            popularity: [1, 1, 0, 0]
        },
        {
            poster: 'http://www.vokrug.tv/pic/product/5/1/8/b/medium_518b990ee260dea2fa9b3df92a7a4020.png',
            name: 'Madhup Nanda',
            rating: [1, 1, 1, 0, 0],
            popularity: [1, 1, 1, 0]
        }
        ,
        {},
        {}
    ];

    scope.jobs = [
        {
            'Job Title': 'Hard job',
            'Job Category': 'hard',
            'Job Specifics': 'Nothing',
            'Location Preference': '1 24rw r124rwrq',
            'Budget(max)': 20
        },
        {
            'Job Title': 'Easy job',
            'Job Category': 'easy',
            'Job Specifics': 'Just do it',
            'Location Preference': 'i76iuy iy7iy',
            'Budget(max)': 9999999999999
        }
    ]


}]);


XYZCtrls.controller('userCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'ngDialog', function (scope, location, http, $q, getContent, ngDialog) {
    scope.arrayProviders = getContent.service.data.data;
    scope.arrayTopics = getContent.topic.data.data;
    scope.user = getContent.user.data.data;

    console.log(scope.arrayTopics);

    ngDialog.open({
        template: 'templateId',
        className: 'ngdialog-theme-default',
        controller: function ctrl(dep) {


        },
        resolve: {
            dep: function depFactory() {
                return
            }
        }


    });
    scope.socialNetworks = [
        {
            name: 'Facebook',
            model: 'facebook'
        }, {
            name: 'Twitter',
            model: 'twitter'
        }, {
            name: 'Google+',
            model: 'google'
        }, {
            name: 'LinkedIn',
            model: 'linkedin'
        }, {
            name: 'Instragram',
            model: 'instragram'
        }, {
            name: 'Flickr',
            model: 'flickr'
        }, {
            name: 'Pinterest',
            model: 'pinterest'
        }
    ];

    scope.closeMenu = function () {
        if (!scope.close.social) {
            scope.close.social = true;
        }
        else scope.close.social = false;
    }
    scope.slider = {
        video: {
            minValue: 20000,
            maxValue: 800000,
            options: {
                floor: 0,
                ceil: 1000000,
                step: 1,
                noSwitching: true,
                showSelectionBar: true,
                getPointerColor: function (value) {
                    return '#B9B6B9';
                },
                getSelectionBarColor: function (value) {
                    return '#B9B6B9';
                },
                translate: function (value) {
                    if (value < 1000) {
                        return value
                    }
                    if (value < 1000000) {
                        return value / 1000 + 'k'
                    }

                    return value / 1000000 + 'm';
                }
            }
        },
        web: {
            minValue: 20000,
            maxValue: 800000,
            options: {
                floor: 0,
                ceil: 1000000,
                step: 1,
                noSwitching: true,
                showSelectionBar: true,
                getPointerColor: function (value) {
                    return '#B9B6B9';
                },
                getSelectionBarColor: function (value) {
                    return '#B9B6B9';
                },
                translate: function (value) {
                    if (value < 1000) {
                        return value
                    }
                    if (value < 1000000) {
                        return value / 1000 + 'k'
                    }

                    return value / 1000000 + 'm';
                }
            }
        }
    }
}]);


XYZCtrls.controller('categoryCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', function (scope, location, http, parseRating, $q, getContent) {
    scope.arrayProviders = getContent.service.data.data;
    scope.arrayTopics = getContent.topic.data.data;
    scope.arrayContent = getContent.content.data.data;
    scope.arrayLanguages = getContent.languages.data.data;
    scope.arrayLocations = getContent.locations.data.data;
    scope.freelancer = parseRating.rating(getContent.freelancer.data.data);
    scope.freelancer = parseRating.popularity(getContent.freelancer.data.data);
    scope.slider = {
        experience: {
            value: 3,
            options: {
                floor: 0,
                ceil: 15,
                step: 1,
                showSelectionBar: true,
                getPointerColor: function (value) {
                    return '#B9B6B9';
                },
                getSelectionBarColor: function (value) {
                    return '#B9B6B9';
                },
                translate: function (value) {
                    if (value == 0) {
                        return value
                    }
                    if (value == 1) {
                        return value + ' year'
                    }
                    if (value == 15) {
                        return value + '+ year'
                    }
                    return value + ' years';
                }
            }
        }
    }

}]);


XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.job = {
        public: true,
        agency: true
    };
    scope.contentTypes = getContent.contentType.data.data;
    scope.locations = getContent.locations.data.data;

    scope.arrayProvidersModel = parseType.getModel(scope.contentTypes);

    scope.addJob = function (invalid, job) {
        if (invalid) return;
        job.content_types = parseType.get(job.content, scope.contentTypes);
        job.local_preference = parseType.get(job.location, scope.locations);
        http.post('/job', job).then(function (resp) {
                location.path('/home')
            }, function (err, r) {
            }
        )
    };
}]);


XYZCtrls.controller('profileCtrl', ['$scope', '$location', '$http', '$routeParams', 'parseRating', function (scope, location, http, $routeParams, parseRating) {
    http.get('/get-user', {params: {id: $routeParams.id}}).then(function (resp) {
        scope.profile = parseRating.rating([resp.data.data])[0];
        console.log(scope.profile)
    })
}]);


XYZCtrls.controller('forgotCtrl', ['$scope', '$location', '$http', '$routeParams', function (scope, location, http, routeParams) {
    scope.send = true;
    scope.submitted = false;
    scope.button = 'Send';
    scope.restore = function (invalid, email) {
        scope.error = "";
        if (invalid) return;
        scope.button = 'Wait';
        http.get('/send-restore', {params: {email: email}}).then(function (resp) {
            scope.send = false;
        }, function (err) {
            scope.button = 'Send';
            scope.error = "Email not found!"
        })
    };
    scope._restore = false;
    scope.restorePassword = function (password) {
        http.get('/restore', {
            params: {
                restore_code: routeParams.restoreCode,
                password: password
            }
        }).then(function (resp) {
            console.log('resp', resp);
            scope._restore = true;
            scope.restoreText = 'Password have been changed.'
        }, function (err) {
            scope.restoreText = 'Password was changed by this restore code'
        })
    }
}]);


XYZCtrls.controller('confirmCtrl', ['$scope', '$location', '$http', '$routeParams', function (scope, location, http, routeParams) {
    http.get('/confirm', {params: {confirm_code: routeParams.confirmCode}}).then(function (resp) {
        scope.text = 'Congratulations, you have verified your account';
    }, function (err) {
        scope.error = true;
        scope.text = "Oops! Verification already carried out or an invalid verification code."
    });
}]);

XYZCtrls.controller('freelancerCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.freelancer = {isagency: true};
    scope.industry = getContent.industry.data.data;
    scope.content = getContent.content.data.data;
    scope.language = getContent.languages.data.data;
    scope.freelancerType = getContent.freelancerType.data.data;
    scope.locations = getContent.locations.data.data;
    scope.experience = _.range(51);
    scope.extras = [];
    scope.clearSearchTerm = function () {
        scope.searchTerm = '';
    };
    scope.contentModel = parseType.getModel(scope.content);

    scope.register = function (invalid, freelancer) {
        if (invalid) return;
        freelancer.service_price = freelancer.price[freelancer.service_type]
        http.post('/freelancer', freelancer).then(function (resp) {
                location.path('/home')
            }, function (err, r) {
            }
        )
    };

    scope.addPackage = function (bol) {
        scope.viewModal = bol
    }
    scope.custom = {};
    scope.submitExtra = function (invalid, extra) {
        if (invalid) return;
        scope.extras.push(extra);
        scope.custom = {};
    }
}]);

XYZCtrls.controller('agencyCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.requestBusiness = false;
    scope.agency = parseType.agency(getContent.agency.data.data);
    scope.claim = function (agency, bol) {
        scope.choiceAgency = agency;
        scope.requestBusiness = bol;
    };

    scope.sendRequest = function (invalid, data) {
        if (invalid) return
        scope.req = {
            data: data,
            agency: scope.choiceAgency
        };
        http.post('/request-business', scope.req).then(function (resp) {
            scope.requestBusiness = false;
            _.forEach(scope.agency, function (item) {
                if (item['Agency Name'] == scope.choiceAgency) {
                    item.Status = true
                }
            })
        })
    };
}]);


XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    console.log("okokkokok true")
    scope.isAuth = function () {
        console.log("ahdfhfhashdfhasdfhashdfhasdfhahsdfh true")
        return true
        //return getContent.user.data.data;

    }

}]);