'use strict';

/* Directives */
XYZCtrls.service('safeApply', function () {
    return {
        run: function ($scope, type) {
            type = type || '$apply'
            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this[type](fn);
                }
            };
        }
    }
});
XYZCtrls.service('parseType', function () {
    return {
        get: function (item, Arr) {
            var arr = [];
            _.forEach(item, function (value, key) {
                _.forEach(Arr, function (el) {
                    if (el.indexOf(key) > -1 && value) {
                        arr.push(el);
                    }
                })
            });
            return arr
        },

        getByNumber: function (item, Arr) {
            var arr = [];
            _.forEach(item, function (value, key) {
                if (value) {
                    arr.push(Arr[key]);
                }
            });
            return arr
        },

        getModel: function (Arr) {
            var arr = [];
            _.forEach(Arr, function (item) {
                arr.push(item.split(' ').shift())

            });
            return arr
        },

        agency: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                var obj = {
                    Logo: elem.logo || null,
                    'Agency Name': elem.name || null,
                    'Service Category': elem.category || null,
                    Address: elem.number_street + ', ' + elem.street + ', ' + elem.city,
                    Status: elem.status || false
                };
                arr.push(obj)

            });
            return arr
        },

        contract: function (item) {
            item.expected_start = new Date(item.expected_start);
            item.expected_completion = new Date(item.expected_completion);
            return item
        },

        openJob: function (jobs, parseTime) {
            var arr = [];
            _.forEach(jobs, function (job) {
                var obj = {
                    elem: job,
                    data: {
                        title: job.title || null,
                        service_provider: job.name || null,
                        response: job.response || null,
                        status: job.status || null,
                        date: parseTime.date(job.created_at) || null
                    }
                };
                arr.push(obj)
            });
            return arr
        },

        ongoingJob: function (jobs) {
            var arr = [];
            _.forEach(jobs, function (job) {
                var obj = {
                    elem: job,
                    data: {
                        title: job.title || null,
                        service_provider: job.name || null,
                        complection: job.date_of_completion || null,
                        contract_amount: job.contract && job.contract.final_amount || null,
                        pending_amount: job.pending_amount || 0
                    }
                };
                arr.push(obj)
            });
            return arr
        },

        closedJob: function (jobs) {
            var arr = [];
            _.forEach(jobs, function (job) {
                var obj = {
                    elem: job,
                    data: {
                        title: job.title || null,
                        service_provider: job.name || null,
                        close_job: job.closed_date || null,
                        status: job.status || null,
                        amount: job.disbursed || '-'
                    }
                };
                arr.push(obj)
            });
            return arr
        }

    }
});

XYZCtrls.service('parseTime', function () {
    return {
        date: function (date) {
            var today = new Date(date);
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return (mm + '-' + dd + '-' + yyyy);
        }
    }
})

XYZCtrls.service('parseRating', function () {
    return {
        rating: function (Arr) {
            _.forEach(Arr, function (item) {
                var arr = [0, 0, 0, 0, 0];
                if (item.rating > 5)
                    item.rating = 5;
                for (var i = 0; i < item.rating; i++) {
                    arr[i] = 1;
                }
                item.ratingArr = arr;
            });
            return Arr;
        },
        popularity: function (Arr) {
            _.forEach(Arr, function (item) {
                var arr = [0, 0, 0, 0];
                if (item.popularity > 4) {
                    item.popularity = 4;
                }
                for (var i = 0; i < item.popularity; i++) {
                    arr[i] = 1;
                }
                item.popularityArr = arr;
            });
            return Arr;
        }
    }
});
