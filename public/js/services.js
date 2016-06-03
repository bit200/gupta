'use strict';

/* Directives */
XYZCtrls.service('parseType', function() {
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
        }
    }
});