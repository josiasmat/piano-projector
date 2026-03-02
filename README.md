# Piano Projector

A tool to display a music keyboard on screen and control it through a MIDI controller.

![Screenshot](/landing/screenshot.webp)

## Online usage

Visit: https://pianoprojector.app

Usage instructions are available in the app's landing page, and in the onboarding tour.

### URL query parameters

The app (`/pwa`) accepts the following URL query parameters:

- `lang` - sets the app's language (example: `/pwa?lang=en`).
- `mode` - sets graphics quality: `lq` (low), `mq` (medium) or `hq` (high).

### Known issues

- MIDI doesn't work in Safari browser, as the browser does not support the Web Midi API.
- MIDI doesn't work on iOS-based devices (iPhone/iPad), because any browser distributed through Apple's App Store have to use Safari's engine. Sound doesn't work either (apparently a bug in the smplr library).
- On Ubuntu (and perhaps other Linux distributions), browsers installed via Snap packages (e.g. the default installation of Mozilla Firefox) may come with MIDI access disabled by default. To resolve this, you need to go into your system settings and enable browser's permission to access media input devices. Or, install a browser using a native package (.deb/.rpm).

## Build and development

[Node.js](https://nodejs.org/) is required to build this app.

To build the app, clone the repository or download the source code, then run:
```
npm install
npm run build
```

To run a development server, run:
```
npm run dev
```

The development server will watch for file changes and rebuild automatically.

## Copyright and license

Copyright 2025-2026 Josias Matschulat

This software is licensed under the terms of the [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html).

### Contact info

Feel free to contact me: josias.matschulat@unila.edu.br

### 3rd-party libraries used:

- [Shoelace](https://github.com/shoelace-style/shoelace)
- [smplr](https://github.com/danigb/smplr)
- [soundfont2](https://github.com/Mrtenz/soundfont2)
- [TinyColor](https://bgrins.github.io/TinyColor/)
- [TourGuide JS](https://tourguidejs.com/)
