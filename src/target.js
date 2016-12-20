/* global mixitup, h */

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