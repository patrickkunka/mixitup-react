/* global mixitupReact, mixitup, h */

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
}