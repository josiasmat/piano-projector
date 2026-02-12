/*
Piano Projector
Copyright (C) 2025 Josias Matschulat

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

import { 
    midi, connectInput, midiWatchdog, 
    MIDI_WATCHDOG_SLOW_INTERVAL 
} from "./connect.js";

import { 
    is_mobile, is_safari, 
    setDisabledAttr, setHiddenAttr 
} from "./common.js";

import { 
    settings, settings_storage, loadSettings, 
    saveGraphicsQualitySetting,
    setGraphicsQuality
} from "./settings.js";

import { 
    toolbar, updateToolbar, enable20KeysBtn,
    updateToolbarBasedOnWidth
} from "./toolbar/toolbar.js";

import { 
    prepareOnboardingTour, startOnboardingTour 
} from "./onboarding.js";

import { 
    createPianoKeyboard, updatePianoPosition, 
    attachPianoPointerAndTouchHandlers,
    attachPianoResizeObserver
} from "./piano/piano.js";

import { 
    attachKeyboardHandlers, hideKbdNavigator, 
    initializeKbdNavigator, showKbdNavigator 
} from "./keyboard.js";

import { changeLanguage } from "./settings.js";
import { getUrlQueryValue } from "./lib/utils.js";
import { sound } from "./sound.js";
import { i18n } from "./lib/i18n.js";
import { initializeToolbar } from "./toolbar/toolbar.js";


/** @typedef {import("@shoelace-style/shoelace").SlTooltip} SlTooltip */


// Initialize app

disableContextMenu();
loadSettings();
checkUrlQueryStrings();


// Wait for custom elements to be defined
await Promise.allSettled([
    customElements.whenDefined('sl-dropdown'),
    customElements.whenDefined('sl-button'),
    customElements.whenDefined('sl-button-group'),
    customElements.whenDefined('sl-dialog'),
    customElements.whenDefined('sl-icon'),
    customElements.whenDefined('sl-menu'),
    customElements.whenDefined('sl-menu-item'),
    customElements.whenDefined('sl-tooltip'),
    customElements.whenDefined('sl-visually-hidden')
]);

// Run initialization routine after document is loaded
if ( document.readyState != "complete" )
    window.addEventListener("load", initializeApp, { once: true });
else
    initializeApp();


/** Must run after DOM loaded */
async function initializeApp() {

    initializeToolbar();

    await loadLocalizationFiles();
    changeLanguage(settings.language ?? i18n.getPreferredLanguage());

    const onboardingTourPromise = prepareOnboardingTour();

    if ( is_mobile ) {
        document.documentElement.classList.add("mobile");
        toolbar.buttons.show_toolbar.classList.add("mobile");
        // Disable tooltips
        setDisabledAttr(toolbar.buttons.panic.parentElement);
        setDisabledAttr(toolbar.buttons.hide_toolbar.parentElement);
        setDisabledAttr(toolbar.buttons.show_toolbar.parentElement);
        // Enable selection of keyboard with 20 keys
        enable20KeysBtn();
    }

    initializeSound();
    createPianoKeyboard();
    attachPianoResizeObserver();
    updateToolbar();
    
    document.body.classList.add('ready');
    
    updateToolbarBasedOnWidth();
    updatePianoPosition();
    
    if ( !is_mobile ) {
        initializeKbdNavigator();
        await onboardingTourPromise;
        startOnboardingTour({
            onStepChange: (step) => {
                switch ( step ) {
                    case 11:
                        showKbdNavigator();
                        document.getElementById("keyboard-navigator").style.visibility = "hidden";
                        break;
                    case 12:
                        document.getElementById("keyboard-navigator").style.removeProperty("visibility");
                }
            },
            onFinish: () => {
                hideKbdNavigator();
                attachKeyboardHandlers();
                attachPianoPointerAndTouchHandlers();
                connectInputStartup();
            }
        });
    } else {
        attachKeyboardHandlers();
        attachPianoPointerAndTouchHandlers();
        connectInputStartup();
    }

    midiWatchdog();
    midi.setWatchdog(MIDI_WATCHDOG_SLOW_INTERVAL);

}


function checkUrlQueryStrings() {
    const perf_mode = getUrlQueryValue("mode").toLowerCase();
    switch ( perf_mode ) {
        case "lq":
        case "lp":
        case "lowperf":
            setGraphicsQuality(0, true); break;
        case "mq":
        case "mp":
        case "medperf":
        case "mediumperf":
            setGraphicsQuality(1, true); break;
        case "hq":
        case "hp":
        case "highperf":
            setGraphicsQuality(2, true);
    }

    const lang = getUrlQueryValue("lang", "").toLowerCase();
    if ( lang ) {
        settings.language = lang;
    }
}


async function loadLocalizationFiles() {
    // Get localization files from html file
    const files = Array.from(document.head.querySelectorAll("link[href^='i18n/'][href$='.json']"))
                       .map((elm) => elm.getAttribute("href"));

    await Promise.all(files.map(
        (datafile) => i18n.fetchDataFile(datafile)
    ));
}


/** Prevents context menu on right-click, except on links */
function disableContextMenu() {
    document.body.addEventListener("contextmenu", e => {
        if ( e.target.tagName !== "A" ) 
            e.preventDefault();
    }, { capture: true });
}


function showMobileTouchTooltip() {
    const connect_tooltip = document.getElementById("dropdown-connect-tooltip");
    const connect_tooltip_text = connect_tooltip.querySelector("span[slot='content']");
    connect_tooltip_text.setAttribute("i18n", "connect-tooltip-touch");
    connect_tooltip_text.textContent = i18n.get("connect-tooltip-touch",
        "Play your keyboard using your fingers! " +
        "Or change the input method by tapping this button."
    );
    connect_tooltip.open = true;
    window.addEventListener("touchstart", 
        () => connect_tooltip.hide(), 
        {capture: true, once: true, passive: true}
    );
}


function connectInputStartup() {
    if ( !settings.device_name && is_mobile ) {
        // Select touch input by default on mobile
        connectInput("touch", true);
        if ( settings.first_time )
            showMobileTouchTooltip();
        
    } else {
        // Connect input stored in settings
        if ( ["pckbd","touch"].includes(settings.device_name) )
            connectInput(settings.device_name);
        else
            midi.queryAccess((access) => {
                if ( access == "granted" )
                    connectInput(settings.device_name);
            });
    }
}


function initializeSound() {
    if ( is_safari ) {
        // For now, disable sound button on Safari browser
        setHiddenAttr(toolbar.dropdowns.sound);
    } else {
        toolbar.menus.sound.unavailable.hidden = true;
        toolbar.menus.sound.items.forEach((item) => { item.hidden = false; });
        if ( is_mobile && settings.sound ) sound.load(settings.sound);
    }
}
