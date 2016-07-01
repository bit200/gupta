XYZCtrls.filter('highlight', function() {
    function escapeRegexp(queryToEscape) {
        return ('' + queryToEscape).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
        return query && matchItem ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
    };
});

XYZCtrls.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
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

XYZCtrls.filter('keyboardShortcut', function($window) {
    return function(str) {
        if (!str) return;
        var keys = str.split('-');
        var isOSX = /Mac OS X/.test($window.navigator.userAgent);

        var seperator = (!isOSX || keys.length > 2) ? '+' : '';

        var abbreviations = {
            M: isOSX ? '' : 'Ctrl',
            A: isOSX ? 'Option' : 'Alt',
            S: 'Shift'
        };

        return keys.map(function(key, index) {
            var last = index == keys.length - 1;
            return last ? key : abbreviations[key];
        }).join(seperator);
    };
})
