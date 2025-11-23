# Piano Projector

A tool to display a music keyboard on screen and control it through a MIDI controller.

![Screenshot](/home/screenshot.png)

## Online usage

Visit: https://pianoprojector.app

## Usage instructions

The user interface is mostly self-explanatory. The browser will ask for MIDI access permission before you can use any MIDI device.

You can change the keyboard position by dragging it with the mouse. When touch/mouse input is selected, it is yet possible to move the keyboard using the right or middle mouse buttons. Rotate the mouse wheel over the keyboard to zoom in and out.

Pressing the **ALT** key will open a keyboard navigation menu; press the underlined characters to navigate, while holding **ALT**.

**F2** toggles Labeling mode, and **F3** toggles Sticker mode (with the last used sticker color). Clicking on a key while holding **CTRL** in one of these modes marks all octaves.

**ESC** triggers the MIDI Panic button. This is useful mainly for resetting stuck keys.

**F9** toggles the toolbar visibility.

## Low performance mode

Append `/?mode=lp` to the URL to enable low-performance mode, with simplified graphics.

To switch back to normal mode, append `/?mode=hp` to the URL.

The mode setting is saved, so it is not necessary to always change the URL.

## Known issues

- MIDI doesn't work in Safari browser, as the browser does not support the Web Midi API.
- MIDI doesn't work on iOS-based devices (iPhone/iPad), because any browser distributed through Apple's App Store have to use Safari's engine. Sound doesn't work either (apparently a bug in the smplr library).
- On Ubuntu (and perhaps other Linux distributions), browsers installed via Snap packages (e.g. the default installation of Mozilla Firefox) may come with MIDI access disabled by default. To resolve this, you need to go into your system settings and enable browser's permission to access media input devices. Or, install a browser using a native package (.deb/.rpm).

## More info

Feel free to contact me: josiasmatschulat@outlook.com

Copyright 2025 Josias Matschulat

This software is licensed under the terms of the [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html).

### 3rd-party libraries used:

- [Shoelace](https://github.com/shoelace-style/shoelace)
- [smplr](https://github.com/danigb/smplr)
