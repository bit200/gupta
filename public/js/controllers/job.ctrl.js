/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', '$routeParams', function (scope, location, http, parseType, $q, getContent, routeParams) {
    scope.job = {
        public: true,
        agency: true
    };
    if (routeParams.id) {
        scope.job = getContent.job.data.data
    }

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