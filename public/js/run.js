angular.module('XYZApp').run(["safeApply", "$timeout", "$rootScope", "$location", "AuthService", "$state", "$http", 
    function (safeApply, $timeout, $rootScope, $location, AuthService, $state, $http) {
    var rootScope = $rootScope
    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.isLogged = AuthService.isLogged;

    $rootScope.closePopupFn = function(is_digest) {
        $rootScope.closePopup = {
            cd: new Date().getTime()
        };
        if (is_digest) {
            $rootScope.$digest()
        }
    };
    angular.element('body').on('click', $rootScope.closePopupFn)

    
    $rootScope.$state = $state

    $rootScope.go = function (path) {
        $location.path(path)
    };

    $rootScope.getContent = function (getContent, field) {
        return getContent[field] && getContent[field].data ? getContent[field].data.data : null
    };
    $rootScope.scrollToErr = function () {
        $timeout(function () {
            var el1 = angular.element('.md-input-invalid').eq(0).parent()
            var el2 = angular.element('.md-datepicker-invalid').eq(0).parent().parent()
            var el = el1.offset() ? el1 : el2.offset() ? el2 : null
            // console.log('erl', el, el)
            if (el && el.offset && el.offset()) {
                angular.element("body").animate({scrollTop: el.offset().top - 100}, "slow");
            }
        }, 500)
    };
    window.ee = $rootScope.scrollToErr

    $rootScope.getBuyerName = function (buyer) {
        return buyer && buyer.first_name && buyer.last_name ? [buyer.first_name, buyer.last_name].join(' ') : ''
    }

    $rootScope.onError = function (err) {
        // console.log('on error', err)

        $rootScope.err_resp = {
            message: err ? err.message : null,
            cd: new Date().getTime()
        }

    }

    rootScope.generate_btns_list = function (scope, ModalService) {

        function gid(name) {
            return scope[name] ? scope[name]._id || -1 : -1
        }

        return {
            'contract_create_fn': {
                name: 'Create Contract',
                fn: scope.contract_create,
            },
            'contract_reject_by_seller_fn': {
                name: 'Reject',
                fn: scope.contract_reject_by_seller,
            },
            'contract_reject_by_buyer_fn': {
                name: 'Reject (inactivate)',
                fn: scope.contract_reject_by_buyer,
            },
            'contract_pause_fn': {
                name: 'Pause Contract',
                fn: scope.contract_pause,
            },
            'contract_resume_fn': {
                name: 'Resume Contract',
                fn: scope.contract_resume,
            },
            'contract_approve_fn': {
                name: 'Approve',
                fn: scope.contract_approve,
            },
            'contract_approve_suggestion_fn': {
                name: 'Approve',
                fn: scope.contract_approve_suggestion,
            },
            'contract_close_fn': {
                name: 'Close',
                fn: scope.contract_close,
            },
            'contract_suggest_approve_fn': {
                name: 'Accept Suggestion',
                fn: scope.contract_suggest_approve,
            },
            'contract_edit_fn': {
                name: 'Update Contract',
                fn: scope.contract_update,
            },
            'udpate_suggestion_fn': {
                name: 'Update Terms',
                fn: scope.update_suggest,
            },
            'contract_edit_terms_fn': {
                name: 'Update Contract Terms',
                fn: scope.update_contract_terms,
            },


            'contract_pause': {
                name: 'Pause Contract',
                ui_sref: sref('root.contract_pause'),
                ui_params: function (){
                    return {contract: gid('contract')}
                }
            },
            'contract_create': {
                name: 'Create Contract',
                ui_sref: sref('root.contract_create'),
                ui_params: function (){
                    return {job: gid('job'), freelancer: gid('freelancer')}
                }
            },
            'contract_reject': {
                name: 'Reject',
                ui_sref: sref('root.contract_reject'),
                ui_params: function (){
                    return {contract: gid('contract')}
                }
            },
            'contract_resume': {
                name: 'Resume Contract',
                ui_sref: sref('root.contract_resume'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },
            'contract_edit_terms': {
                name: 'Edit Trems',
                ui_sref: sref('root.contract_edit_terms'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },
            'contract_approve': {
                name: 'Approve Contract',
                ui_sref: sref('root.contract_approve'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },
            'contract_accept': {
                name: 'Accept Contract',
                ui_sref: sref('root.contract_accept'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },
            'contract_edit': {
                name: 'Update Contract',
                ui_sref: sref('root.contract_edit'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },
            'contract_suggest': {
                name: 'Suggest Terms',
                ui_sref: sref('root.contract_suggest'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },
            'contract_detailed': {
                name: 'Contract Detailed',
                ui_sref: sref('root.contract_detailed'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
            },

            'contract_suggest_fn': {
                name: 'Suggest Terms',
                fn: function(){}('root.contract_suggest'),
                ui_params: function () {
                    return {contract: gid('contract')}
                }
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
                name: 'View your apply',
                ui_sref: sref('root.apply_detailed'),
                ui_params: function () {
                    return {apply: getId(scope.new_apply || scope.apply)}
                }
            },


            'job_create_fn': {
                name: 'Post Job',
                fn: scope.job_create,
            },
            'job_edit_fn': {
                name: 'Edit Job',
                fn: scope.job_edit
            },
            'job_recreate': {
                name: 'Recreate Job',
                ui_sref: sref('root.job_recreate', {job: gid('job')}),
            },
            'job_edit': {
                name: 'Job Edit Link',
                ui_sref: sref('root.job_edit', {job: gid('job')}),
            },
            'jobs_list.buyer_open': {
                name: 'View my active jobs',
                ui_sref: sref('jobs_list.buyer_open')
            },

            'jobs_list.buyer_ongoing': {
                name: 'View ongoing jobs',
                ui_sref: sref('jobs_list.buyer_ongoing')
            },
            'jobs_list.buyer_closed': {
                name: 'View closed jobs',
                ui_sref: sref('jobs_list.buyer_closed')
            },
            'jobs_list.seller_open': {
                name: 'View my open jobs',
                ui_sref: sref('jobs_list.seller_open')
            },
            'jobs_list.seller_ongoing': {
                name: 'View my ongoing jobs',
                ui_sref: sref('jobs_list.seller_ongoing')
            },
            'jobs_list.seller_closed': {
                name: 'View closed jobs',
                ui_sref: sref('jobs_list.seller_closed')
            },
            'job_detailed': {
                name: 'View job posting',
                ui_sref: 'root.job_detailed',
                ui_params: function () {
                    return {job: getId(scope.job)}
                }

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
        })
        scope.i = getContent.i
    }

    $rootScope.gid = function(item) {
        return item ? item._id || item || -3 : -3
    }

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
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            gapi.auth2.init({
                client_id: '1017461938122-hqu19cjkjtc73sjt8lg8igdnacmsmvj3.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                // Request scopes in addition to 'profile' and 'email'
                scope: 'profile email'
            });
        });

    if (localStorage.getItem('commonFilters')){
        $rootScope.commonFilters = JSON.parse(localStorage.getItem('commonFilters'))
    }else
        $rootScope.commonFilters = [];
    $http.get('/api/common_filters').success(function (resp){
        $rootScope.commonFilters = resp;
        // console.log(resp)
        localStorage.setItem('commonFilters', JSON.stringify(resp))
    });
    $rootScope.isLoadingPage = false;
}]);