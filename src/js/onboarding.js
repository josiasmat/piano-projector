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

import { i18n } from "./lib/i18n.js";
import { toolbar } from "./toolbar.js";
import { piano } from "./piano.js";


var tg = new TourGuideClient({
    completeOnFinish: true,
    exitOnEscape: true,
    exitOnClickOutside: false,
    hidePrev: true,
    activeStepInteraction: false,
    allowDialogOverlap: true,
});


export function prepareOnboardingTour() {
    tg.addSteps(getTourSteps()).then(() => updateOnboardingTour());
}


function getTourSteps() {
    return [
        {
            i18n: "onboarding-main-intro",
            group: "main",
            title: "Welcome to Piano Projector!",
            content: 
                "This short tour will help you learn how to use the app. "+
                "Follow the steps to get started.",
            target: document.body
        },
        {
            i18n: "onboarding-main-piano",
            group: "main",
            title: "Piano projection",
            content: 
                "This is the piano projection area. When connected to a MIDI controller, "+
                "the keys you play are highlighted here.\n"+
                "Click and drag the piano up or down to change its position on the screen. "+
                "If you are using Touch control mode, you can still move the keyboard with "+
                "the middle or right mouse button.\n"+
                "Use the mouse wheel to zoom in or out.",
            target: piano.svg
        },
        {
            i18n: "onboarding-main-control",
            group: "main",
            title: "Control button",
            content: 
                "Click the Control button to choose how you want to play the piano. You can "+
                "use a MIDI keyboard, your mouse or touch screen, or your computer keyboard.\n"+
                "The first time you click this button, your browser will ask for permission to "+
                "access MIDI devices. After permission is granted and the connection is "+
                "successful, a green light will turn on.",
            target: toolbar.buttons.connect
        },
        {
            i18n: "onboarding-main-sound",
            group: "main",
            title: "Sound button",
            content: 
                "Click the Sound button to choose a sound for the piano. If you prefer a "+
                "silent keyboard, or if you already have sound on your controller, you can "+
                "leave this turned off.",
            target: toolbar.buttons.sound
        },
        {
            i18n: "onboarding-main-transpose",
            group: "main",
            title: "Transpose button",
            content: 
                "Click the Transpose button to transpose by semitones or octaves. You can "+
                "also use Page Up and Page Down; hold Shift to transpose by octaves.\n"+
                "When transposed, a yellow light will turn on.",
            target: toolbar.buttons.transpose
        },
        {
            i18n: "onboarding-main-size",
            group: "main",
            title: "Size button",
            content: 
                "Click the Size button to change how many keys are shown on the screen or "+
                "how tall the keys appear.",
            target: toolbar.buttons.size
        },
        {
            i18n: "onboarding-main-appearance",
            group: "main",
            title: "Appearance button",
            content: 
                "Click the Appearance button to change the colors of the keys and other "+
                "visual details.",
            target: toolbar.buttons.colors
        },
        {
            i18n: "onboarding-main-pedals",
            group: "main",
            title: "Pedals button",
            content: 
                "Click the Pedals button to control how the app reacts to pedal input. "+
                "The app supports both sustain and sostenuto pedals.\n"+
                "When you press a pedal, the corresponding pedal indicator lights up on "+
                "the button.",
            target: toolbar.buttons.pedals
        },
        {
            i18n: "onboarding-main-labels",
            group: "main",
            title: "Labels button",
            content: 
                "Click the Labels button (or press F2) to turn on Labeling mode. Then click "+
                "any key to show or hide its label.\n"+
                "Hold Ctrl while clicking to apply the label to that same note in all octaves.\n"+
                "Use the menu next to the button to choose from several label formats, such as "+
                "English, German, Italian, pitch class, MIDI note number, or frequency.",
            target: toolbar.buttons.labels_group
        },
        {
            i18n: "onboarding-main-stickers",
            group: "main",
            title: "Stickers button",
            content: 
                "Click the Stickers button (or press F3) to turn on Sticker mode. Then "+
                "click a key to place or remove a colored sticker. Hold Ctrl while clicking "+
                "to apply a sticker to that same note in all octaves.\n"+
                "Use the menu next to the button to choose the sticker color.",
            target: toolbar.buttons.stickers_group
        },
        {
            i18n: "onboarding-main-panic",
            group: "main",
            title:  "Panic button",
            content: 
                "If a key seems stuck or a note keeps sounding, click the Panic button "+
                "(or press Esc). This will reset the keyboard.",
            target: toolbar.buttons.panic
        },
        {
            i18n: "onboarding-main-toggle-toolbar",
            group: "main",
            title: "Hide and show toolbar",
            content: 
                "You can hide the top toolbar by clicking the small button on its right "+
                "side or by pressing F9. To show it again, move the mouse to the top-right "+
                "corner of the screen.",
            target: toolbar.buttons.hide_toolbar
        },
        {
            i18n: "onboarding-main-kbdnav",
            group: "main",
            title: "Keyboard navigation",
            content: 
                "Hold the Alt key to show the keyboard navigation bar. This lets you "+
                "move through the app's functionality using your computer keyboard.",
            target: document.getElementById("keyboard-navigator")
        },
    ];
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
    for ( const item of tg.tourSteps ) {
        const new_title = i18n.get(item.i18n+"-title", null);
        if ( new_title ) {
            item.title = new_title;
        }
        const new_content = i18n.get(item.i18n+"-text", null);
        if ( new_content )
            item.content = replaceNewLineWithParagraphTags(new_content);
    }
    tg.options.nextLabel = i18n.get("onboarding-next-label", "Next");
    tg.options.finishLabel = i18n.get("onboarding-finish-label", "Finish");
    if ( tg.isVisible )
        tg.refresh();
}


/** @param {string} str */
function replaceNewLineWithParagraphTags(str) {
    return str.split('\n').map((s) => '<p>'+s+'</p>').join('');
}
