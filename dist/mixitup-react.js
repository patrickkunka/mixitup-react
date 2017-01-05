/**!
 * MixItUp React v3.0.0-beta
 * A lightweight shim between the MixItUp Dataset API and React
 * Build cdc8ba5b-2bdf-4365-aa3a-7868080056f6
 *
 * Requires mixitup.js ^3.1.4
 *
 * @copyright Copyright 2014-2017 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link
 *
 * @license   Commercial use requires a commercial license.
 *            undefinedlicenses/
 *
 *            Non-commercial use permitted under same terms as  license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */
(function(window) {
    'use strict';

    var mixitupReact = function(mixitup) {
        var h = mixitup.h;

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

        mixitup.Target.registerAction('afterConstruct', 'react', function() {
            this.reactComponent     = null;
            this.reactContainerFrag = document.createDocumentFragment();
        });

        mixitup.Target.registerFilter('renderRender', 'react', function(render, data) {
            var self            = this,
                React           = mixitup.libraries.React,
                ReactDOM        = mixitup.libraries.ReactDOM,
                Component       = null;

            if (React && Object.getPrototypeOf(render) === React.Component) {
                Component = render;

                return function() {
                    var props        = {},
                        reactElement = null,
                        didMount     = Component.prototype.componentDidMount,
                        placeholder  = null,
                        el           = null;

                    // Proxy the call to `componentDidMount()`

                    Component.prototype.componentDidMount = function() {
                        this.props.onMixitupTargetMounted();

                        if (typeof didMount === 'function') {
                            didMount.apply(this, arguments);
                        }

                        self.reactComponent = this;
                    };

                    props.onMixitupTargetMounted = function() {
                        // Cache component reference

                        self.reactComponent = this;
                    };

                    h.extend(props, data);

                    reactElement = React.createElement(Component, props);

                    if (self.reactComponent) {
                        if (self.dom.el.parentElement === self.mixer.dom.parent) {
                            // Replace the node with a placeholder if currently in DOM

                            placeholder = document.createComment('mixitup-target');

                            self.mixer.dom.parent.replaceChild(placeholder, self.dom.el);
                        }

                        // Return the node to its birthplace for diffing

                        self.reactContainerFrag.appendChild(self.dom.el);
                    }

                    // Render to fragment and return DOM node

                    ReactDOM.render(reactElement, self.reactContainerFrag);

                    el = self.reactContainerFrag.childNodes[0];

                    if (placeholder) {
                        self.mixer.dom.parent.replaceChild(el, placeholder);
                    }

                    return el;
                };
            }

            return render;
        });

        mixitup.Target.registerAction('afterUnbindEvents', 'react', function() {
            var self     = this,
                ReactDOM = mixitup.libraries.ReactDOM;

            if (ReactDOM && self.reactComponent) {
                ReactDOM.unmountComponentAtNode(self.dom.el);
            }
        });

        if (
            !mixitup.CORE_VERSION ||
            !h.compareVersions(mixitupReact.REQUIRE_CORE_VERSION, mixitup.CORE_VERSION)
        ) {
            throw new Error(
                '[MixItUp React] MixItUp React ' +
                mixitupReact.EXTENSION_VERSION +
                ' requires at least MixItUp ' +
                mixitupReact.REQUIRE_CORE_VERSION
            );
        }    };

    mixitupReact.TYPE                    = 'mixitup-extension';
    mixitupReact.NAME                    = 'mixitup-react';
    mixitupReact.EXTENSION_VERSION       = '3.0.0-beta';
    mixitupReact.REQUIRE_CORE_VERSION    = '^3.1.4';

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
    }})(window);