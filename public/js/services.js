'use strict';

/* Directives */
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