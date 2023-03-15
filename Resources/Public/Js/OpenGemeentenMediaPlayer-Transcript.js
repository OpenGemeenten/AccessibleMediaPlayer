var OpenGemeenten = OpenGemeenten || {};

/**
 * Handles stand-alone and grouped transcripts
 *
 * The content container should not contain any padding, because the height is calculated.
 *
 * The content container gets a display: none; when closed.
 * This is done to prevent the focus is getting into the closed container.
 *
 * @returns {{initialize: initialize}}
 * @constructor
 */
OpenGemeenten.Transcript = function () {
    /**
     * All the transcripts on the page
     *
     * @type {NodeListOf<Element>}
     */
    var transcripts;

    /**
     * The transition duration
     *
     * @type {number}
     */
    var duration = 500;

    /**
     * Hide all transcript panels. (Done for Readspeaker)
     *
     * Add the click event listener on the transcript button
     */
    var initializeTranscript = function () {
        transcripts = document.querySelectorAll('.transcript');

        for (i = 0; i < transcripts.length; ++i) {
            var transcript = transcripts[i],
                trigger = transcript.querySelector('.' + transcript.dataset.transcriptTrigger),
                target = transcript.querySelector('.' + transcript.dataset.transcriptTarget);

            target.style.height = '0px';
            target.style.display = 'none';
            transcript.classList.remove('transcript--open');
            trigger.setAttribute('aria-expanded', false);
            trigger.addEventListener('mousedown', toggle);
            trigger.addEventListener('focus', focus);
            trigger.addEventListener('keypress', keyPress);
        }

        window.addEventListener('resize', resize);
    };

    /**
     * Capture pressing enter key on the trigger
     *
     * @param event
     */
    var keyPress = function (event) {
        if (event.which === 13) {
            var trigger = event.target,
                toggleEvent = new CustomEvent('mousedown');

            trigger.dispatchEvent(toggleEvent);
        }
    };

    /**
     * Only open a transcript when it gets focus, no closing
     *
     * @param event
     */
    var focus = function (event) {
        var trigger = event.target,
            transcript = trigger.closest('.transcript'),
            target = transcript.querySelector('.' + transcript.dataset.transcriptTarget),
            toggleEvent = new CustomEvent('mousedown');

        if (!isOpen(target)) {
            trigger.dispatchEvent(toggleEvent);
        }
    };

    /**
     * Make sure the height of the panel is calculated from the content when resizing
     *
     * @param event
     */
    var resize = function (event) {
        for (i = 0; i < transcripts.length; ++i) {
            var transcript = transcripts[i],
                target = transcript.querySelector('.' + transcript.dataset.transcriptTarget);

            if (isOpen(target)) {
                target.style.height = '0px';
                var height = target.scrollHeight;
                target.style.height = height + 'px';
            }
        }
    };

    /**
     * Toggle the transcript
     *
     * If the transcript is within a group and opened, it will close the others
     *
     * @param event
     */
    var toggle = function (event) {
        var trigger = event.target,
            transcript = trigger.closest('.transcript'),
            target = transcript.querySelector('.' + transcript.dataset.transcriptTarget),
            transcriptGroup = transcript.closest('.transcript__group');

        if (transcriptGroup) {
            if (!isOpen(target)) {
                var groupTranscripts = transcriptGroup.querySelectorAll('.transcript');

                for (i = 0; i < groupTranscripts.length; ++i) {
                    var groupTranscript = groupTranscripts[i],
                        groupTarget = groupTranscript.querySelector('.' + groupTranscript.dataset.transcriptTarget);

                    if (isOpen(groupTarget)) {
                        slideUp(groupTarget, groupTranscript, trigger);
                    }
                }

                slideDown(target, transcript, trigger);
            } else {
                slideUp(target, transcript, trigger);
            }
        } else {
            if (!isOpen(target)) {
                slideDown(target, transcript, trigger);
            } else {
                slideUp(target, transcript, trigger);
            }
        }
    };

    /**
     * Slide the transcript down
     *
     * @param target
     * @param transcript
     * @param trigger
     */
    var slideDown = function (target, transcript, trigger) {
        transcript.classList.add('transcript--open');
        trigger.setAttribute('aria-expanded', true);
        target.style.display = 'block';

        var height = target.scrollHeight;

        setTransition(target, height);
    };

    /**
     * Slide the transcript up
     *
     * @param target
     * @param transcript
     * @param trigger
     */
    var slideUp = function (target, transcript, trigger) {
        var height = 0;

        setTransition(target, height);

        transcript.classList.remove('transcript--open');
        trigger.setAttribute('aria-expanded', false);
    };

    /**
     * Returns true when the transcript is open
     *
     * @param target
     * @returns {boolean}
     */
    var isOpen = function (target) {
        return (target.style.height !== '0px'
            && target.style.height !== ''
        );
    };

    /**
     * Set the transition styles
     *
     * @param target
     * @param height
     * @param height
     */
    var setTransition = function (target, height) {
        target.addEventListener('transitionend', hideElemant);

        var style = target.style;

        style.display = 'block';
        style.transitionProperty = 'all';
        style.transitionDuration = duration + 'ms';
        style.transitionTimingFunction = 'ease-out';
        style.height = height + 'px';
    };

    /**
     * Hide element after it has been closed and transition is done
     *
     * @param event
     */
    var hideElemant = function (event) {
        var target = event.target,
            style = target.style;

        if (!isOpen(target)) {
            style.display = 'none';
        }

        style.transitionProperty = '';
        style.transitionDuration = '';
        style.transitionTimingFunction = '';
    };

    return {
        /**
         * Initialize transcripts
         */
        initialize: function () {
            document.addEventListener('DOMContentLoaded', initializeTranscript);
        }
    };
};

/**
 * Construct and initialize the transcripts
 */
var Transcript = new OpenGemeenten.Transcript();
Transcript.initialize();
