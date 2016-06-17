'use strict';

/* Directives */
XYZCtrls.service('safeApply', function () {
    return {
        run: function($scope, type) {
            type = type || '$apply'
            console.log('safeapply', type)
            $scope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if(phase == '$apply' || phase == '$digest') {
                    if(fn && (typeof(fn) === 'function')) {
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
                console.log(elem);
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
        }
    }
});

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
