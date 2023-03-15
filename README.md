# OpenGemeenten Media Player

This is an accessible media player for websites based on [MediaElement.js](https://github.com/mediaelement/mediaelement)
and the [accessibility plugin](https://github.com/mediaelement/mediaelement-plugins/tree/master/src/a11y) for 
MediaElement.

## Accessibility features
- Keyboard support
- Visible focus indicator
- Clear labels
- Sufficient contrast between colors for text, controls and backgrounds
- Transcripts
- Closed Captioning
- Audio description
- Sign language

## Why some kind of fork of MediaElement?
Although the accessibility plugin is used, some enhancements have been made to make it even more accessible.
We will return these changes to the MediaElement project in time. These enhancements are:
- Change button labels when functionality enabled/disabled.
- Use keyboard controls only when the focus is on user interface (UI) elements, like `F` for fullscreen or `M` for 
  muting sound. It is wrong to have these controls enabled in the whole media player.
- Adding the transcript below the media player in a collapsible panel.

OpenGemeenten is using the content management system (CMS) [TYPO3](https://typo3.org) for most of its customers 
websites. Since we want to have control over the language labels as is usual in TYPO3, provided by XLF files, we changed 
the method to inject these labels into MediaElement.
