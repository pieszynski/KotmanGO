
var $ = simpleQuery = (function (document, undefined) {
    'use strict';
    function $(selector) {
        var found = document.querySelector(selector);
        return found;
    }

    function strObj(obj) {
        return 'string' === typeof(obj)
            ? $(obj)
            : obj;
    }


    $.on = function onAttachEvent(obj, eventName, callback) {
        obj = strObj(obj);
        obj.addEventListener(eventName, callback, false);
    }

    $.onTouch = function onTouchEvent(obj, callback) {
        $.on(obj, 'click', callback);
        $.on(obj, 'touchend', callback);
    }

    $.off = function onRemoveEvent(obj, eventName, callback) {
        obj = strObj(obj);
        obj.removeEventListener(eventName, callback, false);
    }

    $.cssAdd = function onCssClassAdd(obj, cssClass) {
        obj = strObj(obj);
        obj.classList.add(cssClass);
    }

    $.cssRemove = function onCssClassRemove(obj, cssClass) {
        obj = strObj(obj);
        obj.classList.remove(cssClass);
    }

    $.cssToggle = function onCssClassToggle(obj, cssClass) {
        obj = strObj(obj);
        obj.classList.toggle(cssClass);
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
        elem.style.left = (settings.segment*x) + 'px';
        elem.style.top = (settings.segment*y) + 'px';
    }

    function markerTo(settings, selector, x, y) {
        var elem = $(selector);
        if (x === undefined) {
            $.cssAdd(elem, 'hide');
            elem.point = undefined;
            return
        }

        $.cssRemove(elem, 'hide');
        elem.style.left = (settings.margin - 2 - settings.point/2 + settings.segment*x) + 'px';
        elem.style.top = (settings.margin - 2 - settings.point/2 + settings.segment*y) + 'px';
        elem.point = [x,y];
    }

    function getSettings() {
        var cssRules = getStyle('.params');

        var settings = {
            segment: toNum(cssRules.width),
            margin: toNum(cssRules.margin),
            point: toNum(cssRules["background-size"]),
            cat: { initX: 0, initY: 2, x: 0, y: 2 },
            dog: { initX: 2, initY: 4, initPrevX: 2, initPrevY: 3, x: 2, y: 4, prevX: 2, prevY: 3 },
            mouse: {x: 2, y: 1 },
            catAllowed: [],
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

    function setCatMarkers(settings, points) {
        settings.catAllowed = [];
        for (var i = 0; i < 4; i++) {
            if (undefined === points[i]) {
                markerTo(settings, '.marker' + i);
                continue;
            }

            markerTo(settings, '.marker' + i, points[i][0], points[i][1]);
            settings.catAllowed.push([points[i][0], points[i][1]]);
        };
    }

    function nextOnVector(possible, x, y, dX, dY) {
        var hasX = x + dX,
            hasY = y + dY;
            newPoint = undefined;

        for(var idd = 0; idd < 2; idd++) {

            for (var i = 0; i < possible.length; i++) {
                if (hasX === possible[i][0] && hasY === possible[i][1]) {
                    newPoint = { x: possible[i][0], y: possible[i][1] };
                    break;
                }
            };

            hasX = x - dX;
            hasY = y - dY;

            if (undefined !== newPoint)
                break;
        }

        return newPoint;
    }

    function moveDogs(settings) {
        var possible = where(settings.arena, settings.dog.x, settings.dog.y);

        var dX = settings.dog.x - settings.dog.prevX,
            dY = settings.dog.y - settings.dog.prevY;

        var nextXY = nextOnVector(possible, settings.dog.x, settings.dog.y, dX, dY);

        settings.dog.prevX = settings.dog.x;
        settings.dog.prevY = settings.dog.y;
        settings.dog.x = nextXY.x;
        settings.dog.y = nextXY.y;

        moveTo(settings, '.dog', settings.dog.x, settings.dog.y);

        return settings.cat.x === settings.dog.x && settings.cat.y === settings.dog.y;
    }

    function playerMoveTo(x, y) {
        moveTo(settings, '.cat', x, y);
        settings.cat.x = x;
        settings.cat.y = y;
        setCatMarkers(settings,[]);

        var isMouseCatched = settings.cat.x === settings.mouse.x && settings.cat.y === settings.mouse.y;
        if (isMouseCatched) {
            gameOver(settings, true);
            return;
        }

        var isDead = moveDogs(settings);
        if (isDead) {
            gameOver(settings, false);
        } else {
            setCatMarkers(settings, where(settings.arena, x, y));
        }
    }

    function gameOver(settings, isWin) {
        if (isWin) {
            $.cssAdd('.dog', 'anim-game-over');
            $.cssAdd('.mouse', 'anim-game-over');
        } else {
            $.cssAdd('.cat', 'anim-game-over');
            $.cssAdd('.mouse', 'anim-game-over');
        }

        setTimeout(function() { restart(settings); }, 2000);
    }

    function restart(settings) {

        settings.cat.x = settings.cat.initX;
        settings.cat.y = settings.cat.initY;
        settings.dog.x = settings.dog.initX;
        settings.dog.y = settings.dog.initY;
        settings.dog.prevX = settings.dog.initPrevX;
        settings.dog.prevY = settings.dog.initPrevY;

        moveTo(settings, '.cat', settings.cat.x, settings.cat.y);
        moveTo(settings, '.dog', settings.dog.x, settings.dog.y);
        moveTo(settings, '.mouse', settings.mouse.x, settings.mouse.y);

        $.cssRemove('.cat', 'anim-game-over');
        $.cssRemove('.dog', 'anim-game-over');
        $.cssRemove('.mouse', 'anim-game-over');

        setCatMarkers(settings, where(settings.arena, settings.cat.x, settings.cat.y));
    }

    function onMarker(evt) {
        playerMoveTo(this.point[0], this.point[1]);
    }

    function onMouseTap(evt) {
        var mPos = undefined;
        for (var i = 0; i < settings.catAllowed.length; i++) {
            var allow = settings.catAllowed[i];
            if (allow[0] === settings.mouse.x && allow[1] === settings.mouse.y) {
                mPos = allow;
                break;
            }
        };

        if (undefined !== mPos)
            playerMoveTo(allow[0], allow[1]);
    }

    function init(settings) {
        restart(settings);

        $.onTouch('.marker0', onMarker);
        $.onTouch('.marker1', onMarker);
        $.onTouch('.marker2', onMarker);
        $.onTouch('.marker3', onMarker);
        $.onTouch('.mouse', onMouseTap);
    }

    var settings = getSettings();
    init(settings);

//})(document, window, simpleQuery);
