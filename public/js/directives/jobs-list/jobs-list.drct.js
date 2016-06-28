XYZCtrls.directive('viewMyJob', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            typeJob: '=',
            typeUser: '=',
            header: '='
        },
        templateUrl: 'js/directive/jobs-list/jobs-list.html',
        controller: ['$scope', '$http', 'parseTime', '$rootScope','$location', function (scope, http, parseTime, rootScope, location) {
            console.log("directive", scope.header)
            // scope.header = 'Header page'
            // scope.header = 'View My Jobs - ' + scope.typeUser + ' views';
            // scope.maxSize = 5;
            // scope.TotalItems = 0;
            // scope.currentPage = 1;
            // scope.limit = 5;
            // console.log('scope', scope.typeUser)
            // var last_press;
            // var timer = 500;
            // scope.trueSearch = function (search) {
            //     if (!search)
            //         search = ' ';
            //     last_press = new Date().getTime();
            //     var cur_press = last_press;
            //     setTimeout(function () {
            //         if (cur_press === last_press) {
            //             scope.currentPage = 1;
            //             scope.render({'search': search})
            //         }
            //     }, timer)
            //
            // };
            //
            // scope.data = {view : scope.typeUser};
            // if(scope.data.view == 'All')
            //     scope.data.view = 'Buyer';
            // scope.changePage = function (page) {
            //     scope.render({page: page});
            // };
            //
            // scope.switchRole = function() {
            //
            //   location.path('/jobs/'+scope.data.view.toLowerCase()+'/open')
            // };
            //
            // scope.enterSearch = function (search) {
            //     if (!search)
            //         search = ' ';
            //     scope.currentPage = 1;
            //     scope.render(search)
            // };
            //
            // function create_obj(params) {
            //     params = params || {};
            //     scope.Page = params.page || scope.currentPage;
            //     scope.search = params.search || scope.search;
            //     var obj = {};
            //
            //     if (scope.currentPage) {
            //         obj.skip = (scope.Page - 1) * scope.limit;
            //         obj.limit = scope.limit;
            //     }
            //
            //     if (scope.search && scope.search != ' ') {
            //         obj.search = scope.search
            //     }
            //     return obj;
            //
            // }
            //
            // scope.render = function (params) {
            //     scope.showLoading = true;
            //     var obj = create_obj(params);
            //     var index = 0;
            //
            //     function cb() {
            //
            //         if (++index == 2) {
            //             scope.showLoading = false;
            //         }
            //     }
            //
            //     http.get(scope.url, {params: obj}).then(function (resp) {
            //         cb();
            //         scope.body = [];
            //         // console.log('sfsdfsdxcvnmhuiku', resp.data.data)
            //         if (scope.typeUser == 'Buyer') {
            //             _.each(resp.data.data, function (job) {
            //                 var obj = {
            //                     elem: job,
            //                     data: {
            //                         title: job.job.title || null,
            //                         service_provider: job.freelancer.name || null,
            //                         response: job.message || null,
            //                         status: job.status || null,
            //                         date: parseTime.date(job.created_at) || null
            //                     }
            //                 };
            //                 scope.body.push(obj)
            //             });
            //         }
            //         if (scope.typeUser == 'All') {
            //             _.each(resp.data.data, function (job) {
            //                 var obj = {
            //                     elem: job,
            //                     data: {
            //                         title: job.title || null,
            //                         service_provider: job.name || null,
            //                         response: job.message || null,
            //                         status: job.status || null,
            //                         date: parseTime.date(job.created_at) || null
            //                     }
            //                 };
            //                 scope.body.push(obj)
            //             });
            //         }
            //     }, function (err) {
            //         console.log('asdsa', err)
            //         if (err.status = 403)
            //             scope.error = 'Error';
            //         cb();
            //     });
            //     http.get(scope.url + '/count', {params: obj}).then(function (resp) {
            //             cb();
            //             scope.TotalItems = resp.data.data;
            //         }
            //         , function (err) {
            //             scope.TotalItems = 0;
            //             cb();
            //         })
            // };
            //
            // scope.render();

        }]
    };
});