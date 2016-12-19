/* global mixitupReact */

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = mixitupReact;
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return mixitupReact;
    });
} else if (window.mixitup && typeof window.mixitup === 'function') {
    mixitupReact(window.mixitup);
} else {
    throw new Error('[MixItUp React] MixItUp core not found');
}