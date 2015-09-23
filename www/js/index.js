var simpleQuery = (function (document, undefined) {
    'use strict';
    function $(selector) {
        var found = document.querySelector(selector);
        return found;
    }

    $.on = function onAttachEvent(obj, eventName, callback) {
        obj.addEventListener(eventName, callback, false);
    }

    $.off = function onRemoveEvent(obj, eventName, callback) {
        obj.removeEventListener(eventName, callback, false);
    }

    $.cssAdd = function onCssClassAdd(obj, cssClass) {
        obj.classList.add(cssClass);
    }

    $.cssRemove = function onCssClassRemove(obj, cssClass) {
        obj.classList.remove(cssClass);
    }

    $.cssToggle = function onCssClassToggle(obj, cssClass) {
        obj.classList.toggle(cssClass);
    }

    return $;
})(document);

(function($, undefined) {
    "use strict";

    var aSquare = $('.a'),
        bCircle = $('.b'),
        dArrows = $('.arr');

    //$.cssAdd(aSquare, 'platform-pops');
    //$.cssAdd(bCircle, 'platform-pops');

    $.on(aSquare, 'animationstart', onAnimationStart);
    $.on(aSquare, 'animationend', onAnimationTouchEnd);
    $.on(aSquare, 'click', onElementTouch);
    $.on(aSquare, 'touchend', onElementTouch);

    $.on(bCircle, 'animationstart', onAnimationStart);
    $.on(bCircle, 'animationend', onAnimationTouchEnd);
    $.on(bCircle, 'click', onElementTouch);
    $.on(bCircle, 'touchend', onElementTouch);

    function onAnimationStart(evt) {
        $.cssAdd(this, 'platform-final');
    }

    function onAnimationTouchEnd(evt) {
        $.cssRemove(this, 'touchme');
        $.cssRemove(this, 'platform-pops');
        $.cssRemove(dArrows, 'hide');
        //console.log('anim end', evt.animationName, evt, this);

        if (this === bCircle && 'pops' === evt.animationName) {
            $.on(bCircle, 'click', circleMoveTouch);
            $.on(bCircle, 'touchend', circleMoveTouch);
        }
    }

    function onElementTouch(evt) {
        $.cssAdd(this, 'touchme');
    }

    var state = {
        pos: 50,
        add: 200
    };

    function circleMoveTouch(evt) {
        state.pos = state.pos + state.add;
        state.add = -state.add;

        bCircle.style.top = state.pos + 'px';

        if (100 < state.pos)
            $.cssAdd(dArrows, 'arr-180');
        else
            $.cssRemove(dArrows, 'arr-180');
    }

})(simpleQuery);
