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
            title: i18n.get("onboarding-main-intro-title", ""),
            content: i18n.get("onboarding-main-intro-text", ""),
            target: document.body
        },
        {
            i18n: "onboarding-main-piano",
            group: "main",
            title: i18n.get("onboarding-main-piano-title", ""),
            content: i18n.get("onboarding-main-piano-text", ""),
            target: piano.svg
        },
        {
            i18n: "onboarding-main-control",
            group: "main",
            title: i18n.get("onboarding-main-control-title", ""),
            content: i18n.get("onboarding-main-control-text", ""),
            target: toolbar.buttons.connect
        },
        {
            i18n: "onboarding-main-sound",
            group: "main",
            title: i18n.get("onboarding-main-sound-title", ""),
            content: i18n.get("onboarding-main-sound-text", ""),
            target: toolbar.buttons.sound
        },
        {
            i18n: "onboarding-main-transpose",
            group: "main",
            title: i18n.get("onboarding-main-transpose-title", ""),
            content: i18n.get("onboarding-main-transpose-text", ""),
            target: toolbar.buttons.transpose
        },
        {
            i18n: "onboarding-main-size",
            group: "main",
            title: i18n.get("onboarding-main-size-title", ""),
            content: i18n.get("onboarding-main-size-text", ""),
            target: toolbar.buttons.size
        },
        {
            i18n: "onboarding-main-appearance",
            group: "main",
            title: i18n.get("onboarding-main-appearance-title", ""),
            content: i18n.get("onboarding-main-appearance-text", ""),
            target: toolbar.buttons.colors
        },
        {
            i18n: "onboarding-main-pedals",
            group: "main",
            title: i18n.get("onboarding-main-pedals-title", ""),
            content: i18n.get("onboarding-main-pedals-text", ""),
            target: toolbar.buttons.pedals
        },
        {
            i18n: "onboarding-main-labels",
            group: "main",
            title: i18n.get("onboarding-main-labels-title", ""),
            content: i18n.get("onboarding-main-labels-text", ""),
            target: toolbar.buttons.labels_group
        },
        {
            i18n: "onboarding-main-stickers",
            group: "main",
            title: i18n.get("onboarding-main-stickers-title", ""),
            content: i18n.get("onboarding-main-stickers-text", ""),
            target: toolbar.buttons.stickers_group
        },
        {
            i18n: "onboarding-main-panic",
            group: "main",
            title:  i18n.get("onboarding-main-panic-title", ""),
            content: i18n.get("onboarding-main-panic-text", ""),
            target: toolbar.buttons.panic
        },
        {
            i18n: "onboarding-main-toggle-toolbar",
            group: "main",
            title: i18n.get("onboarding-main-toggle-toolbar-title", ""),
            content: i18n.get("onboarding-main-toggle-toolbar-text", ""),
            target: toolbar.buttons.hide_toolbar
        },
        {
            i18n: "onboarding-main-kbdnav",
            group: "main",
            title: i18n.get("onboarding-main-kbdnav-title", ""),
            content: i18n.get("onboarding-main-kbdnav-text", ""),
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
    // Skip tour if content is missing
    if ( !tg.tourSteps[0].title ) return;
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
