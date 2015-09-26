
var $ = simpleQuery = (function(document, undefined) {
    "use strict";

    var $ = function querySelector(selector) {
        var response = document.querySelector(selector);
        return response;
    }

    return $;
})(document);

//(function (document, window, $, undefined) {
    "use strict";

    function getStyle(name) {
        var allStyles = document.styleSheets[0].rules || document.styleSheets[0].cssRules;

        for (var i = 0; i < allStyles.length; i++) {
            var style = allStyles[i];
            if (style.selectorText !== name)
                continue;

            return style.style;
        };
    }

    function toNum(value) {
        return parseInt(value);
    }

    function moveTo(settings, selector, x, y) {
        var elem = $(selector);
        elem.style.left = (settings.margin + settings.segment*x) + 'px';
        elem.style.top = (settings.margin + settings.segment*y) + 'px';
    }

    function getSettings() {
        var cssRules = getStyle('.params');

        var settings = {
            segment: toNum(cssRules.width),
            margin: 0,//toNum(cssRules.margin),
            cat: { x: 0, y: 2 },
            dog: { x: 2, y: 4 },
            mouse: {x: 2, y: 1 },
            // graf połączeń bez powtórzeń
            arena: [
                [0,2,1,2],
                [1,2,2,2],
                [2,2,2,3],
                [2,3,2,4],
                [2,2,3,2],
                [3,2,3,1],
                [3,1,3,0],
                [3,0,2,0],
                [2,0,2,1]
            ]
        };

        return settings;
    }

    function init(settings) {

        moveTo(settings, '.cat', settings.cat.x, settings.cat.y);
        moveTo(settings, '.dog', settings.dog.x, settings.dog.y);
        moveTo(settings, '.mouse', settings.mouse.x, settings.mouse.y);
    }

    function where(arena, x, y) {
        var avail = [];
        for (var i = 0; i < arena.length; i++) {
            var ar = arena[i];

            if (x === ar[0] && y === ar[1])
                avail.push([ar[2],ar[3]]);

            if (x === ar[2] && y === ar[3])
                avail.push([ar[0],ar[1]]);
        };

        return avail;
    }

    var settings = getSettings();
    init(settings);

//})(document, window, simpleQuery);
