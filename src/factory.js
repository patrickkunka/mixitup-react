/* global mixitup */

mixitup.constructor.registerAction('afterUse', 'react', function(extension) {
    if (
        typeof extension === 'object' &&
        typeof extension.render === 'function' &&
        typeof extension.findDOMNode === 'function' &&
        typeof extension.unmountComponentAtNode === 'function'
    ) {
        mixitup.libraries.ReactDOM = extension;
    }

    if (
        typeof extension === 'object' &&
        typeof extension.Component === 'function' &&
        typeof extension.createClass === 'function' &&
        typeof extension.createElement === 'function' &&
        typeof extension.DOM === 'object'
    ) {
        mixitup.libraries.React = extension;
    }
});