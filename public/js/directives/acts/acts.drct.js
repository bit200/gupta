XYZCtrls.directive('acts', function () {
    return {
        restrict: 'E',
        scope: true,
        // transclude: true
        template: '<a class="action" href="{{fn[action](item)}}" ng-repeat="action in acts track by $index">{{action}}</a>',
        controller: ['$scope', '$location', function (scope, $location) {
            function getInfo (item, field) {
                return item[field] || item
            }
            function getId (item) {
                return item._id || item
            }

            scope.fn = {
                'Accept': function(item){
                    var job = getInfo(item, 'job')
                        , freelancer = getInfo(item, 'freelancer')
                    return '#/contract/create/' + getId(job) + '/' + getId(freelancer)
                },
                'View Contract': function(item) {
                    return '#/contract/' + getId(item)
                },
                'Edit Contract': function(item) {
                    return '#/contract/edit/' + getId(item)
                }
            }

            console.log("ahahahahahhahah -----", scope.acts)
        }]
    };
});