var OpenGemeenten = OpenGemeenten || {};

/**
 * Create a player from a container
 *
 * Defines if audio or video player
 *
 * Changes button title and aria-label attributes depending on their state
 *
 * @param {Element} container
 * @returns {{initializeAudioPlayer: initializeAudioPlayer, initializeVideoPlayer: initializeVideoPlayer}}
 * @constructor
 * @todo Fix the focus order of the closed captions
 */
OpenGemeenten.MediaPlayer = function (container) {
    /**
     * The current player
     *
     * @type {MediaElementPlayer}
     */
    var player;

    /**
     * The play button element
     *
     * @type {Element}
     */
    var playButton;

    /**
     * The time slider element
     *
     * @type {Element}
     */
    var timeSlider;

    /**
     * The volume button element
     *
     * @type {Element}
     */
    var volumeButton;

    /**
     * The closed captions button element
     *
     * @type {Element}
     */
    var closedCaptionsButton;

    /**
     * The audio description button element
     *
     * @type {Element}
     */
    var audioDescriptionButton;

    /**
     * The video description button element
     *
     * @type {Element}
     */
    var videoDescriptionButton;

    /**
     * The full screen button element
     *
     * @type {Element}
     */
    var fullScreenButton;

    /**
     * Create a video player
     *
     * @param {Element} mediaElement
     */
    var createVideoPlayer = function (mediaElement) {
        player = new MediaElementPlayer(mediaElement, {
            alwaysShowControls: true,
            features: [
                'playpause',
                'current',
                'progress',
                'duration',
                'volume',
                'tracks',
                'a11y',
                'fullscreen'
            ],
            iconSprite: '/Resources/Public/Icons/mejs-controls-5.1.0.svg',
            poster: mediaElement.dataset.poster,
            toggleCaptionsButtonWhenOnlyOne: true,
            useFakeFullscreen: true,
            success: function (mediaElementWrapper, originalNode, instance) {
                var mediaElementContainer = instance.container;

                defineControlElements();
                addControlButtonsEventListeners(mediaElementWrapper);
                addContainerEventListeners(mediaElementContainer);
                setInitialA11yButtonLabels();
            }
        });

    };

    /**
     * Create an audio player
     *
     * @param {Element} mediaElement
     */
    var createAudioPlayer = function (mediaElement) {
        player = new MediaElementPlayer(mediaElement, {
            alwaysShowControls: true,
            features: [
                'playpause',
                'current',
                'progress',
                'duration',
                'volume'
            ],
            success: function(mediaElementWrapper, originalNode, instance) {
                var mediaElementContainer = instance.container;

                defineControlElements();
                addControlButtonsEventListeners(mediaElementWrapper);
                addContainerEventListeners(mediaElementContainer);
                setInitialA11yButtonLabels();
            }
        });
    };

    /**
     * Defines the button elements
     */
    var defineControlElements = function () {
        timeSlider = container.querySelector('.mejs__time-slider');
        volumeButton = container.querySelector('.mejs__volume-button button');
        closedCaptionsButton = container.querySelector('.mejs__captions-button button');
        audioDescriptionButton = container.querySelector('.mejs__audio-description-button button');
        videoDescriptionButton = container.querySelector('.mejs__video-description-button button');
        fullScreenButton = container.querySelector('.mejs__fullscreen-button button');
    };

    /**
     * Add event listeners to the control buttons
     *
     * @param {Element} mediaElementWrapper
     */
    var addControlButtonsEventListeners = function (mediaElementWrapper) {
        mediaElementWrapper.addEventListener('captionschange', setA11yClosedCaptionsButtonLabel);

        if (audioDescriptionButton) {
            audioDescriptionButton.addEventListener('click', setA11yAudioDescriptionButtonLabel);
        }
        if (videoDescriptionButton) {
            videoDescriptionButton.addEventListener('click', setA11yVideoDescriptionButtonLabel);
        }
    };

    /**
     * Add event listeners to the media element container
     *
     * @param {Element} mediaElementContainer
     */
    var addContainerEventListeners = function (mediaElementContainer) {
        mediaElementContainer.addEventListener('exitedfullscreen', setA11yFullScreenButtonLabel);
        mediaElementContainer.addEventListener('enteredfullscreen', setA11yFullScreenButtonLabel);
        mediaElementContainer.addEventListener('keydown', useKeyboardOnlyOnFocusedUserInterfaceElements);
    }

    /**
     * Set the initial a11y button labels
     */
    var setInitialA11yButtonLabels = function () {
        setA11yClosedCaptionsButtonLabel();
        setA11yAudioDescriptionButtonLabel();
        setA11yVideoDescriptionButtonLabel();
        setA11yFullScreenButtonLabel();
    };

    /**
     * Set the a11y closed captions button label based on state
     *
     * @param {Event|undefined} event
     */
    var setA11yClosedCaptionsButtonLabel = function (event) {
        if (closedCaptionsButton) {
            switch (getEventType(event)) {
                case 'captionschange':
                    if (event.detail) {
                        if (event.detail.caption) {
                            changeA11yLabels(closedCaptionsButton, 'disable-closed-captions');
                        } else {
                            changeA11yLabels(closedCaptionsButton, 'enable-closed-captions');
                        }
                    }
                    break;
                default:
                    changeA11yLabels(closedCaptionsButton, 'enable-closed-captions');
            }
        }
    }

    /**
     * Set the a11y audio description button label based on state
     *
     * @param {Event|undefined} event
     */
    var setA11yAudioDescriptionButtonLabel = function (event) {
        if (audioDescriptionButton) {
            var classList = audioDescriptionButton.parentElement.classList;

            if (classList.contains('audio-description-enabled')) {
                classList.remove('audio-description-enabled');
                changeA11yLabels(audioDescriptionButton,'disable-audio-description');
            } else {
                classList.add('audio-description-enabled');
                changeA11yLabels(audioDescriptionButton, 'enable-audio-description');
            }
        }
    }

    /**
     * Set the a11y video description button label based on state
     *
     * @param {Event|undefined} event
     */
    var setA11yVideoDescriptionButtonLabel = function (event) {
        if (videoDescriptionButton) {
            var classList = videoDescriptionButton.parentElement.classList;

            if (classList.contains('video-description-enabled')) {
                classList.remove('video-description-enabled');
                changeA11yLabels(videoDescriptionButton,'disable-video-description');
            } else {
                classList.add('video-description-enabled');
                changeA11yLabels(videoDescriptionButton, 'enable-video-description');
            }
        }
    }

    /**
     * Set the a11y full screen button label based on state
     *
     * @param {Event|undefined} event
     */
    var setA11yFullScreenButtonLabel = function (event) {
        if (fullScreenButton) {
            switch (getEventType(event)) {
                case 'enteredfullscreen':
                    changeA11yLabels(fullScreenButton, 'disable-full-screen');
                    break;
                default:
                    changeA11yLabels(fullScreenButton, 'enable-full-screen');
            }
        }
    }

    /**
     * Remove the non-accessible keyboard triggers
     *
     * Removes the 'F' for fullscreen when no focus on the fullscreen button
     * Removes the 'M' for muting sound when no focus on the volume button
     *
     * This is done because of speech software.
     * When you say 'F' you do not want to switch into fullscreen.
     * Textual keys should only trigger when focus on a user interface element.
     * The whole video is not considered a user interface element.
     * Each control (buttons, slider) is a user interface element.
     * Arrow keys are okay, since they do not print anything.
     *
     * @param event
     * @returns {boolean}
     */
    var useKeyboardOnlyOnFocusedUserInterfaceElements = function (event) {
        if (
            (
                event.keyCode === 70
                && fullScreenButton !== document.activeElement
            ) || (
                event.keyCode === 77
                && volumeButton !== document.activeElement
            )
        ) {
            event.stopPropagation();
            return false;
        }
    }

    /**
     * Change the title and aria-label of an element
     *
     * @param {Element} element
     * @param {string} labelId
     */
    var changeA11yLabels = function (element, labelId) {
        setAttributes(element, {
            'title': mejs.i18n.t('mejs.' + labelId),
            'aria-label': mejs.i18n.t('mejs.' + labelId)
        });
    }

    /**
     * Set multiple attributes at once
     *
     * @param {Element} element
     * @param {Array} attributes
     */
    var setAttributes = function (element, attributes) {
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
    }

    /**
     * Get the event type
     *
     * @param event
     * @returns {string}
     */
    var getEventType = function (event) {
        var eventType = '';

        if (typeof event === 'object'
            && event.type
        ) {
            eventType = event.type;
        }

        return eventType;
    }

    return {
        /**
         * Initialize video player
         *
         * @param {Element} video
         */
        initializeVideoPlayer: function (video) {
            createVideoPlayer(video);
        },

        /**
         * Initialize audio player
         *
         * @param {Element} audio
         */
        initializeAudioPlayer: function (audio) {
            createAudioPlayer(audio);
        }
    };
};

/**
 * Construct and initialize the media player
 *
 * Find all instances of media player and initialize the according player for it
 */
document.addEventListener('DOMContentLoaded', function () {
    var selector = '.mediaplayer',
        containers = document.querySelectorAll(selector);

    for (i = 0; i < containers.length; ++i) {
        var container = containers[i],
            video = container.querySelector('video'),
            audio = container.querySelector('audio'),
            mediaPlayer = new OpenGemeenten.MediaPlayer(container);

        if (video) {
            mediaPlayer.initializeVideoPlayer(video);
        } else if (audio) {
            mediaPlayer.initializeAudioPlayer(audio);
        }
    }
});
