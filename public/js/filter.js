Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

XYZCtrls.filter('highlight', function () {
    function escapeRegexp(queryToEscape) {
        return ('' + queryToEscape).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function (matchItem, query) {
        return query && matchItem ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
    };
});

XYZCtrls.filter('rexExpEmailPhone', function () {
    return function (text) {
        var email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        return text.replace(email_regex, '************')
    }

});

XYZCtrls.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

XYZCtrls.filter('objectKeys', function () {
    return function (obj) {
        return Object.keys(obj || {});
    };
});
