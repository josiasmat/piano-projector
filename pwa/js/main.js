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

import { 
    piano, createPianoKeyboard, updatePianoPosition, 
    handlePianoContainerResize 
} from "./piano.js";

import { sound } from "./sound.js";
import { getUrlQueryValue } from "./lib/utils.js";
import { initializeKbdNavigator } from "./keyboard.js";


// Initialization

Promise.allSettled([
    customElements.whenDefined('sl-dropdown'),
    customElements.whenDefined('sl-button'),
    customElements.whenDefined('sl-button-group'),
    customElements.whenDefined('sl-icon'),
    customElements.whenDefined('sl-menu'),
    customElements.whenDefined('sl-menu-item')
]).finally(initializeApp);


// Init functions

function initializeApp() {

    loadSettings();
    checkUrlQueryStrings();

    document.body.classList.add('ready');
    
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

    if ( !settings.device_name ) {
        const connect_tooltip = document.getElementById("dropdown-connect-tooltip");
        if ( is_mobile ) {
            // Select touch input by default on mobile
            connectInput("touch", true);
            connect_tooltip.setAttribute("content", 
                "Play your keyboard using your fingers! " +
                "Or change the input method by tapping this button."
            );
        } else {
            connect_tooltip.setAttribute("content", 
                "Click on this button to select an input method."
            );
        }
        connect_tooltip.open = true;
        window.addEventListener("click", () => {
            connect_tooltip.open = false;
        }, { once: true });
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
        updateToolbarBasedOnWidth();
        toolbar.resize.observer = new ResizeObserver(handleToolbarResize);
        toolbar.resize.observer.observe(toolbar.self);
        updatePianoPosition();
        piano.resize.observer = new ResizeObserver(handlePianoContainerResize);
        piano.resize.observer.observe(piano.container);
        initializeKbdNavigator();
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
}
