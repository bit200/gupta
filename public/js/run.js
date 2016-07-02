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
            if (el && el.offest && el.offset()) {
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

        function gid (name) {
            return scope[name] ? scope[name]._id || -1 : -1
        }

        return {
            'contract_create_fn': {
                name: 'Create Contract',
                fn: scope.contract_create,
            },
            'contract_preview_fn': {
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
            },

            'apply_create': {
                name: 'Apply for the job',
                ui_sref: sref('root.apply_create', {job: gid('job')}),
            },
            'apply_create_fn': {
                name: 'Send apply',
                fn: scope.apply_create
            },
            'apply_edit': {
                name: 'Edit your apply',
                ui_sref: sref('root.apply_edit', {job: gid('job')}),
            },
            'apply_edit_fn': {
                name: 'Submit changes',
                fn: scope.apply_edit
            },
            'apply_detailed': {
                name: 'View your apply (pub)',
                ui_sref: sref('root.apply_detailed', {apply: gid('apply')}),
            },
            'job_create_fn': {
                name: 'Job Create',
                fn: scope.job_create,
            },
            'job_edit_fn': {
                name: 'Edit Job',
                fn: scope.job_edit
            },
            'job_edit': {
                name: 'Job Edit Link',
                ui_sref: sref('root.job_edit', {job: gid('job')}),
            }
        }
    }


    rootScope.generate_links_list = function (scope, ModalService) {
        return {
            'jobs_buyer_open': {
                name: 'View my active jobs',
                ui_sref: sref('jobs_list.buyer_open'),
                default: true

            },
            'job_detailed': {
                name: 'View job posting',
                ui_sref: 'root.job_detailed',
                ui_params: function(){
                    return {job: getId(scope.job)}
                },

            }
        }
    }
    var ARR_RESOLVES = ['apply_by_id', 'job', 'freelancer', 'buyer', 'suggest', 'contract', 'apply', 'i']

    $rootScope.each_scope = function (scope, cb) {
        _.each(ARR_RESOLVES, function (item) {
            cb && cb(item, scope[item])
        })
    }
    $rootScope.extend_scope = function (scope, getContent) {
        scope.onErr = rootScope.onError
        scope.onSucc = function (data) {
            scope.succ_data = {
                data: data,
                cd: new Date().getTime()
            }
        }
        _.each(ARR_RESOLVES, function (item) {
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
        var def = null
        return item ? item._id || def : def
    }

    function sref(name, params) {
        name += '({';
        _.each(params, function (value, key) {
            name += [key, ':', value, ','].join('');
        });
        if (name.slice(-1) == ',') {
            name = name.slice(0, -1);
            name += '})';
        } else {
            name = name.slice(0, -2);

        }

        return name
    }

});