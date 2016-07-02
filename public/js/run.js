angular.module('XYZApp').run(function ($timeout, $rootScope, $location, AuthService, $state) {
    var rootScope = $rootScope
    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.isLogged = AuthService.isLogged;

    $rootScope.$state = $state

    $rootScope.go = function (path) {
        $location.path(path)
    }

    $rootScope.getContent = function (getContent, field) {
        return getContent[field] && getContent[field].data ? getContent[field].data.data : null
    }

    $rootScope.scrollToErr = function () {
        $timeout(function () {
            var el1 = angular.element('.has-error').eq(0)
            var el2 = angular.element('.ng-invalid-required').eq(0)
            var el = el1.offset() ? el1 : el2.offset() ? el2 : null
            if (el.offset()) {
                angular.element("body").animate({scrollTop: el.offset().top - 100}, "slow");
            }
        }, 500)
    };

    $rootScope.getBuyerName = function (buyer) {
        return buyer.first_name && buyer.last_name ? [buyer.first_name, buyer.last_name].join(' ') : ''
    }

    $rootScope.onError = function (err) {
        console.log('on error', err)
        $rootScope.err_resp = {
            message: err,
            cd: new Date().getTime()
        }

    }

    rootScope.generate_btns_list = function (scope, ModalService) {
        return {
            'contract_create': {
                name: 'Create Contract',
                fn: scope.contract_create,
                model: scope.contract,
                validate: true
            },
            'contract_preview': {
                name: 'Preview',
                fn: function () {
                    ModalService.showModal({
                        templateUrl: "template/modal/previewContract.html",
                        scope: scope,
                        controller: function ($scope) {
                            $scope.contract = scope.contract;
                        }
                    }).then(function (modal) {
                        modal.element.modal();
                        modal.close.then(function (result) {
                        });
                    });
                }
            }
        }
    }
    rootScope.generate_links_list = function (scope, ModalService) {
        return {
            'jobs_buyer_open': {
                name: 'View my active jobs',
                ui_sref: sref('jobs_list.buyer_open')
            },
            'job_detailed': {
                name: 'View job posting',
                ui_sref_fn: function () {
                    return sref('root.job_detailed', {job: getId(scope.job)})
                }
            }
        }
    }
    $rootScope.extend_scope = function (scope, getContent) {
        scope.onErr = rootScope.onError
        scope.onSucc = function (data) {
            console.log("on succccccccc data", data, data.data)
            scope.resp = data.data
            scope.succ_resp = true
        }

        _.each(['job', 'freelancer', 'buyer', 'suggest', 'contract', 'apply', 'i'], function (item) {
            scope[item] = rootScope.getContent(getContent, item)
            console.log('@@ COMMON CTRL CTRL CTRL ', item, ':', scope[item])
        })


        scope.i = getContent.i

    }


    var asView = localStorage.getItem('asView');
    $rootScope.asView = asView ? JSON.parse(asView) : {buyer: true};

    $rootScope.$watch('asView', function (val) {
        if (val) {
            localStorage.setItem('asView', JSON.stringify(val))
        }
    }, true)

    $rootScope.default_empty = 'Please fill this field'

    var getId = function (item) {
        return item ? item._id || item : null
    }

    function sref(name, params) {
        name += '({';
        _.each(params, function (value, key) {
            name += [key, ':', value, ','].join('');
        });
        if (name.slice(-1) == ',') {
            name = name.slice(0, -1);
        }
        name += '})';

        return name
    }

});