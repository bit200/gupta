XYZCtrls.directive('succ', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/succ/succ.html',
        link: function(scope, el, attrs) {
            var $el = $('#succ_modal')
            scope.attrs = attrs
            console.log('@@@@ LNKS DIR', scope.attrs)
            scope.mess_title = attrs.title
            scope.mess_desc = attrs.desc
            scope.links_plain = eval(attrs.links)
            scope.mess_links = []

            _.each(scope.links_plain, function(name){
                var _link = scope.btns_list_for_dir[name]
                if (_link) {
                    scope.mess_links.push(_link)
                } else {
                    console.log("@@@ NOT FOUND LNKS FOR DIRECTIVE", name, scope.links_list_for_dir)
                }
            })

            scope.hide_modal = function(){
                console.log('click on the element')
                $el.modal('hide')
                $('.modal-backdrop').remove()
                $('body').removeClass('modal-open')
            }
            scope.$watch('succ_data', function(data){
                console.log('data', data)
                if (data && data.cd) {
                    $el.modal('show')
                    $el.on('hidden.bs.modal', function () {
                        console.log('close modal close modal', scope.mess_links)
                        scope.active_link = scope.mess_links[scope.mess_links.length - 1]
                        // _.each(scope.mess_links, function(data){
                        //     if (data.default) {
                        //         scope.active_link = data
                        //     }
                        // })
                        scope.goTo(scope.active_link)
                    })
                }
            })
        },
        controller: ['$scope', '$state', function (scope, $state) {
            console.log('@@@ Scope Post directive', scope.attrs)
            scope.goTo = function(link) {
                var params = link.ui_params ? link.ui_params() : null
                $state.go(link.ui_sref, params)
            }
        }]
    };
});