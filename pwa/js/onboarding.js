/*
Piano Projector
Copyright (C) 2026 Josias Matschulat

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour";

import { toolbar } from "./toolbar.js";
import { piano } from "./piano.js";


const tg = new TourGuideClient({
    completeOnFinish: true,
    exitOnEscape: true,
    exitOnClickOutside: false,
    hidePrev: true,
    activeStepInteraction: false,
    allowDialogOverlap: true,
});


export function createOnboardingTour() {
    tg.addSteps([
        {
            group: "main",
            order: 0,
            content: "This short tour will help you learn how to use the app. "+
                     "Follow the steps to get started.",
            title: "Welcome to Piano Projector!",
            target: document.body
        },
        {
            group: "main",
            order: 1,
            content: "<p>Click the Control button to choose how you want to play "+
                     "the piano. You can use a MIDI keyboard, your mouse or touch "+
                     "screen, or your computer keyboard.</p><p>The first time you "+
                     "click this button, your browser will ask for permission to "+
                     "access MIDI devices. After permission is granted and the "+
                     "connection is successful, a green light will turn on.</p>",
            title: "Control button",
            target: toolbar.buttons.connect
        },
        {
            group: "main",
            order: 2,
            content: "Click the Sound button to choose a sound for the piano. If you "+
                     "prefer a silent keyboard, or if you already have sound on your "+
                     "controller, you can leave this turned off.",
            title: "Sound button",
            target: toolbar.buttons.sound
        },
        {
            group: "main",
            order: 3,
            content: "<p>Click the Transpose button to transpose by semitones or octaves. "+
                    "You can also use Page Up and Page Down; hold Shift to transpose by "+
                    "octaves.</p><p>When transposed, a yellow light will turn on.</p>",
            title: "Transpose button",
            target: toolbar.buttons.transpose
        },
        {
            group: "main",
            order: 4,
            content: "Click the Size button to change how many keys are shown on the "+
                     "screen or how tall the keys appear.",
            title: "Size button",
            target: toolbar.buttons.size
        },
        {
            group: "main",
            order: 5,
            content: "Click the Appearance button to change the colors of the keys and "+
                     "other visual details.",
            title: "Appearance button",
            target: toolbar.buttons.colors
        },
        {
            group: "main",
            order: 6,
            content: "Click the Pedals button to control how the app reacts to pedal "+
                     "input. The app supports both sustain and sostenuto pedals.",
            title: "Pedals button",
            target: toolbar.buttons.pedals
        },
        {
            group: "main",
            order: 7,
            content: "<p>Click the Labels button (or press F2) to turn on Labeling mode. Then "+
                     "click any key to show or hide its label.</p><p>Hold Ctrl while clicking "+
                     "to apply the label to that same note in all octaves.</p><p>Use the menu "+
                     "next to the button to choose from several label formats, such as English, "+
                     "German, Italian, pitch class, MIDI note number, or frequency.</p>",
            title: "Labels button",
            target: toolbar.buttons.labels_group
        },
        {
            group: "main",
            order: 8,
            content: "<p>Click the Stickers button (or press F3) to turn on Sticker mode. Then "+
                     "click a key to place or remove a colored sticker. Hold Ctrl while clicking "+
                     "to apply a sticker to that same note in all octaves.</p><p>Use the menu "+
                     "next to the button to choose the sticker color.</p>",
            title: "Stickers button",
            target: toolbar.buttons.stickers_group
        },
        {
            group: "main",
            order: 9,
            content: "If a key seems stuck or a note keeps sounding, click the Panic button "+
                     "(or press Esc). This will reset the keyboard.",
            title: "Panic button",
            target: toolbar.buttons.panic
        },
        {
            group: "main",
            order: 10,
            content: "You can hide the top toolbar by clicking the small button on its right "+
                     "side or by pressing F9. To show it again, move the mouse to the top-right "+
                     "corner of the screen.",
            title: "Hide toolbar button",
            target: toolbar.buttons.hide_toolbar
        },
        {
            group: "main",
            order: 11,
            content: "<p>This is the piano projection area. When connected to a MIDI "+
                     "controller, the keys you play are highlighted here.</p><p>Click and drag "+
                     "the piano up or down to change its position on the screen. If you are "+
                     "using Touch control mode, you can still move the keyboard with the middle "+
                     "or right mouse button.</p><p>Use the mouse wheel to zoom in or out.</p>",
            title: "Piano projection",
            target: piano.svg
        },
        {
            group: "main",
            order: 12,
            content: "<p>Hold the Alt key to show the keyboard navigation bar. This lets you "+
                     "move through the app's functionality using your computer keyboard.</p>",
            title: "Keyboard navigation",
            target: document.getElementById("keyboard-navigator")
        },
    ]);
}


/**
 * 
 * @param {object} [options] 
 * @param {boolean} options.force
 * @param {()} options.onFinish
 * @param {(step: number)} options.onStepChange
 */
export function startOnboardingTour(options = {}) {
    if ( options.force || !tg.isFinished("main") ) {
        if ( options.onFinish ) 
            tg.onAfterExit(options.onFinish);
        if ( options.onStepChange )
            tg.onAfterStepChange(() => options.onStepChange(tg.activeStep));
        tg.start("main");
    } else {
        options.onFinish();
    }
}


export function updateOnboardingTour() {
    if ( tg.isVisible )
        tg.updatePositions();
}
