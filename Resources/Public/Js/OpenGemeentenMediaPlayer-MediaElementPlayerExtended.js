var OpenGemeenten = OpenGemeenten || {};

/**
 * Extend MediaElementPlayer
 *
 * @returns {{initialize: initialize}}
 * @constructor
 */
OpenGemeenten.MediaElementPlayerExtended = function () {
    /**
     * Extend MediaElementPlayer
     */
    var initializeMediaElementPlayer = function () {
        if (typeof MediaElementPlayer === 'function') {
            extendI18N();
        }
    };

    /**
     * Add/override language labels coming from TYPO3 for any language
     *
     * Language labels are in mejs.i18n.[languageID]
     */
    var extendI18N = function () {
        if (typeof OpenGemeenten.opengemeenten_mediaplayer.i18n !== 'undefined') {
            mergeObjects(mejs.i18n, OpenGemeenten.opengemeenten_mediaplayer.i18n);

            var language = Object.keys(OpenGemeenten.opengemeenten_mediaplayer.i18n)[0];
            mejs.i18n.language(language);
        }
    };

    /**
     * Merge two objects
     *
     * @param {object} extendableObject
     * @param {object} extend
     */
    var mergeObjects = function (extendableObject, extend) {
        for (var property in extend) {
            if (extend.hasOwnProperty(property)) {
                extendableObject[property] = extend[property];
            }
        }
    };

    return {
        /**
         * Initialize
         */
        initialize: function () {
            document.addEventListener('DOMContentLoaded', initializeMediaElementPlayer);
        }
    };
};

MediaElementPlayerExtended = new OpenGemeenten.MediaElementPlayerExtended();
MediaElementPlayerExtended.initialize();
