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
    settings, settings_storage, loadSettings 
} from "./settings.js";

import { 
    toolbar, updateToolbar, enable20KeysBtn,
    handleToolbarResize, updateToolbarBasedOnWidth
} from "./toolbar.js";

import { prepareOnboardingTour, startOnboardingTour, updateOnboardingTour } from "./onboarding.js";

import { 
    piano, createPianoKeyboard, updatePianoPosition, 
    handlePianoContainerResize, 
    attachPianoPointerAndTouchHandlers
} from "./piano.js";

import { sound } from "./sound.js";
import { getUrlQueryValue } from "./lib/utils.js";
import { attachKeyboardHandlers, hideKbdNavigator, initializeKbdNavigator, showKbdNavigator } from "./keyboard.js";
import { i18n } from "./lib/i18n.js";
import { changeLanguage } from "./settings.js";
import { SlTooltip } from "@shoelace-style/shoelace";


// Initialization

const I18N_FILES = Array.from(document.head.querySelectorAll("link"))
                    .map((elm) => elm.getAttribute("href"))
                    .filter((href) => href?.startsWith("i18n/") && href?.endsWith(".json"));

Promise.allSettled([
    customElements.whenDefined('sl-dropdown'),
    customElements.whenDefined('sl-button'),
    customElements.whenDefined('sl-button-group'),
    customElements.whenDefined('sl-icon'),
    customElements.whenDefined('sl-menu'),
    customElements.whenDefined('sl-menu-item'),
    Promise.all(I18N_FILES.map(
        (datafile) => i18n.fetchDataFile(datafile)
    ))
]).finally(initializeApp);


// Init functions

function initializeApp() {

    loadSettings();
    checkUrlQueryStrings();
    changeLanguage(settings.language ?? i18n.getPreferredLanguage());

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

    if ( is_safari ) {
        // For now, disable sound button on Safari browser
        setHiddenAttr(toolbar.dropdowns.sound);
    } else {
        document.getElementById("menu-sound-item-unavailable").hidden = true;
        toolbar.menus.sound.items.forEach((item) => { item.hidden = false; });
        if ( is_mobile && settings.sound ) sound.load(settings.sound);
    }

    updateToolbar();
    createPianoKeyboard();
    prepareOnboardingTour();

    if ( !settings.device_name ) {
        /** @type {SlTooltip} */
        const connect_tooltip = document.getElementById("dropdown-connect-tooltip");
        const connect_tooltip_text = connect_tooltip.querySelector("span[slot='content']");
        if ( is_mobile ) {
            // Select touch input by default on mobile
            connectInput("touch", true);
            connect_tooltip_text.setAttribute("i18n", "connect-tooltip-touch");
            connect_tooltip_text.textContent = i18n.get("connect-tooltip-touch",
                "Play your keyboard using your fingers! " +
                "Or change the input method by tapping this button."
            );
            connect_tooltip.open = true;
        }
        
    } else {
        if ( ["pckbd","touch"].includes(settings.device_name) )
            connectInput(settings.device_name);
        else
            midi.queryAccess((access) => {
                if ( access == "granted" )
                    connectInput(settings.device_name);
            });
    }

    const postInit = () => {
        document.body.classList.add('ready');
        updateToolbarBasedOnWidth();
        toolbar.resize.observer = new ResizeObserver(handleToolbarResize);
        toolbar.resize.observer.observe(toolbar.self);
        updatePianoPosition();
        piano.resize.observer = new ResizeObserver(handlePianoContainerResize);
        piano.resize.observer.observe(piano.container);
        if ( !is_mobile ) {
            initializeKbdNavigator();
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
                }
            });
        } else {
            attachPianoPointerAndTouchHandlers();
        }
    };

    if ( document.readyState != "complete" )
        window.addEventListener("load", postInit, { once: true });
    else
        postInit();

    midiWatchdog();
    midi.setWatchdog(MIDI_WATCHDOG_SLOW_INTERVAL);

}


function checkUrlQueryStrings() {
    const perf_mode = getUrlQueryValue("mode").toLowerCase();
    if ( ["lp","lowperf"].includes(perf_mode) ) {
        settings.lowperf = true;
        settings_storage.writeBool("lowperf", true);
    }
    else if ( ["hp","highperf"].includes(perf_mode) ) {
        settings.lowperf = false;
        settings_storage.writeBool("lowperf", false);
    }
    const lang = getUrlQueryValue("lang", "").toLowerCase();
    if ( lang ) {
        settings.language = lang;
    }
}
