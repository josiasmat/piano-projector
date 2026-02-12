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

import '../components.js';

import { settings } from '../settings.js';
import { triggerPanic } from '../panic.js';
import { updateOnboardingTour } from '../onboarding.js';
import { setHiddenAttr } from '../common.js';

import { attachToolbarControlEventListeners, updateControlButton } from './toolbar-control.js';
import { attachToolbarSoundEventListeners, updateSoundButton } from './toolbar-sound.js';
import { attachToolbarTransposeEventListeners, updateTransposeButton } from './toolbar-transpose.js';
import { attachToolbarSizeEventListeners } from './toolbar-size.js';
import { attachToolbarAppearanceEventListeners } from './toolbar-appearance.js';
import { attachToolbarPedalsEventListeners, updatePedalsButton } from './toolbar-pedals.js';
import { attachToolbarLabelsEventListeners, updateLabelsButton } from './toolbar-labels.js';
import { attachToolbarStickersEventListeners, updateStickersButton } from './toolbar-stickers.js';
import { attachToolbarToggleEventListeners, updateToolbarToggleButton } from './toolbar-toggle.js';

export * from './toolbar-control.js';
export * from './toolbar-sound.js';
export * from './toolbar-transpose.js';
export * from './toolbar-size.js';
export * from './toolbar-appearance.js';
export * from './toolbar-pedals.js';
export * from './toolbar-labels.js';
export * from './toolbar-stickers.js';
export * from './toolbar-toggle.js';


/**
 * The toolbar object is a lazily-initialized singleton that provides centralized access to all 
 * toolbar-related DOM elements and some functions.
 * 
 * Structure:
 * - Elements are organized into logical groups (dropdowns, buttons, menus, leds, resize)
 * - Each element reference is wrapped with helper functions (_id, _selectorFirst, _selectorAll)
 * - These helpers return objects with a __f property containing a function that performs the actual DOM query
 * - This lazy evaluation pattern defers DOM queries until the initialization phase, which runs after DOM load.
 * 
 * The initializeToolbar() function converts all lazy-evaluated properties into direct element references.
 * This ensures that after initialization, toolbar properties directly reference DOM elements for efficient access.
 */
export const toolbar = {
    self: _id("top-toolbar"),
    title: _id("toolbar-title"),
    dropdowns: {
        control: _id("dropdown-connect"),
        sound: _id("dropdown-sound"),
        transpose: _id("dropdown-transpose"),
        size: _id("dropdown-size"),
        appearance: _id("dropdown-colors"),
        pedals: _id("dropdown-pedals"),
        labels: _id("dropdown-labels"),
        stickers: _id("dropdown-stickers"),
        /** @returns {HTMLElement[]} */
        get all() { return [
            this.control, this.sound, this.transpose,
            this.size, this.appearance, this.pedals, 
            this.labels, this.stickers
        ]; },
        /** @returns {void} */
        closeAll() {
            for ( const dropdown of this.all )
                dropdown.hide();
        },
        /** @returns {HTMLElement|null} */
        getOpen() {
            return this.all.find(dropdown => dropdown.open) ?? null;
        }
    },
    buttons: {
        control: _id("btn-connect"),
        sound: _id("btn-sound"),
        transpose: _id("btn-transpose"),
        size: _id("btn-size"),
        appearance: _id("btn-colors"),
        pedals: _id("btn-pedals"),
        labels_group: _id("btn-labels-group"),
        labels_left: _id("btn-labels-switch"),
        labels_right: _id("btn-labels-dropdown"),
        stickers_group: _id("btn-stickers-group"),
        stickers_left: _id("btn-stickers-switch"),
        stickers_right: _id("btn-stickers-dropdown"),
        panic: _id("btn-panic"),
        hide_toolbar: _id("btn-hide-toolbar"),
        show_toolbar: _id("btn-show-toolbar")
    },
    menus: {
        control: {
            top: _id("midi-connection-menu"),
            divider: _selectorFirst("#midi-connection-menu sl-divider"),
            denied: _id("menu-connect-item-midi-denied"),
            unavailable: _id("menu-connect-item-midi-unavailable"),
            prompt: _id("menu-connect-item-midi-prompt"),
            kbd: _id("menu-connect-item-computer-keyboard"),
            touch: _id("menu-connect-item-touch"),
            template: _id("menu-connect-item-midi-port-template"),
            /** @type {() => HTMLElement[]} */
            getMidiItems: _f(_selectorAll(".menu-connect-item-midi-input"))
        },
        sound: {
            top: _id("menu-sound"),
            unavailable: _id("menu-sound-item-unavailable"),
            items: _selectorAll(".menu-sound-item")
        },
        transpose: {
            top: _id("menu-transpose"),
            semitones: {
                input: _id("input-semitones"),
                btn_minus: _id("btn-semitone-minus"),
                btn_plus: _id("btn-semitone-plus"),
            },
            octaves: {
                input: _id("input-octaves"),
                btn_minus: _id("btn-octave-minus"),
                btn_plus: _id("btn-octave-plus"),
            },
            item_reset: _id("reset-transpose")
        },
        size: _id("menu-size"),
        appearance: {
            top: _id("menu-colors"),
            highlight_opacity: _id("menu-highlight-opacity"),
            picker_color_white: _id("color-white"),
            picker_color_black: _id("color-black"),
            picker_color_pressed: _id("color-pressed"),
            item_perspective: _id("menu-perspective"),
            item_top_felt: _id("menu-top-felt"),
            graphics_quality: _id("menu-graphics-quality")
        },
        labels: {
            top: _id("menu-labels-top"),
            labeling_mode: _id("menu-labeling-mode"),
            played: _id("menu-labels-played-keys"),
            type: _id("menu-labels-type"),
            type_badge: _id("menu-labels-type-badge"),
            tonic: _id("menu-labels-tonic"),
            // tonic_badge: _id("menu-labels-tonic-badge"),
            octave: _id("menu-item-labels-octave"),
            clear: _id("menu-labels-clear"),
        },
        stickers: {
            top: _id("menu-stickers-top"),
            clear: _id("menu-stickers-clear")
        },
        pedals: {
            top: _id("pedal-menu"),
            item_follow: _id("menu-pedal-follow"),
            item_dim: _id("menu-pedal-dim")
        } 
    },
    leds: {
        control: _id("connection-power-icon"),
        transpose: _id("transpose-power-icon"),
        sound: _id("sound-power-icon"),
        labels: _id("labels-power-icon"),
        stickers: _id("stickers-power-icon"),
        pedal_r: _id("pedr"),
        pedal_m: _id("pedm"),
        pedal_l: _id("pedl")
    },
    tooltips: {
        connect: _id("dropdown-connect-tooltip"),
        labels: _id("btn-labels-tooltip")
    },
    resize: {
        observer: undefined,
        timeout: undefined
    }
};


// Toolbar definition helper functions

/** @param {Function} f  @returns {Function} */
function _lazy(f) {
    return { __f: f };
}

/** @param {string} id  @returns {HTMLElement} */
function _id(id) {
    return _lazy(() => document.getElementById(id));
}

/** @param {string} q  @returns {HTMLElement} */
function _selectorFirst(q) {
    return _lazy(() => document.querySelector(q));
}

/** @param {string} q  @returns {HTMLElement[]} */
function _selectorAll(q) {
    return _lazy(() => Array.from(document.querySelectorAll(q)));
}

/** @param {{__lazy: Function}} helper_obj  @returns {Function} */
function _f(helper_obj) {
    return _lazy(() => helper_obj.__f);
}


const toolbar_shrink_list = [
    { elm: () => toolbar.title,                  action: "hide-elm" },
    { elm: () => toolbar.buttons.sound,          action: "hide-label" },
    { elm: () => toolbar.buttons.control,        action: "hide-label" },
    { elm: () => toolbar.buttons.pedals,         action: "hide-label" },
    { elm: () => toolbar.buttons.transpose,      action: "hide-label" },
    { elm: () => toolbar.buttons.stickers_left,  action: "hide-label" },
    { elm: () => toolbar.buttons.labels_left,    action: "hide-label" },
    { elm: () => toolbar.dropdowns.appearance,   action: "hide-elm" },
    { elm: () => toolbar.dropdowns.size,         action: "hide-elm" },
    { elm: () => toolbar.dropdowns.sound,        action: "hide-elm" },
    { elm: () => toolbar.dropdowns.pedals,       action: "hide-elm" },
    { elm: () => toolbar.buttons.stickers_group, action: "hide-elm" },
    { elm: () => toolbar.buttons.labels_group,   action: "hide-elm" },
    { elm: () => toolbar.buttons.panic,          action: "hide-elm" },
    { elm: () => toolbar.self,                   action: "hide-elm" }
];


export function updateToolbar() {
    if ( !setHiddenAttr(toolbar.self, !settings.toolbar) ) {
        updateControlButton();
        updateSoundButton();
        updateTransposeButton();
        updatePedalsButton();
        updateLabelsButton();
        updateStickersButton();
    }
    updateToolbarToggleButton();
}


export function updateToolbarBasedOnWidth() {
    // Reset all elements to full width
    toolbar_shrink_list.forEach(item => {
        const classList = item.action === "hide-elm" ? "condensed-toolbar-hidden-elm" : "condensed-toolbar-hidden-label";
        item.elm().classList.remove(classList);
    });

    // Progressively hide elements if toolbar overflows
    for (const item of toolbar_shrink_list) {
        if (toolbar.self.scrollWidth <= toolbar.self.clientWidth) break;
        const classList = item.action === "hide-elm" ? "condensed-toolbar-hidden-elm" : "condensed-toolbar-hidden-label";
        item.elm().classList.add(classList);
    }
}


export function getOpenDropdowns() {
    return toolbar.dropdowns.getOpen();
}


export function blinkMidiPanicButton() {
    toolbar.buttons.panic.setAttribute("variant", "danger");
    setTimeout(() => { toolbar.buttons.panic.removeAttribute("variant"); }, 1000);
}


export function handleToolbarResize() {
    if ( toolbar.resize.timeout ) clearTimeout(toolbar.resize.timeout);
    toolbar.resize_timeout = setTimeout(() => {
        updateToolbarBasedOnWidth();
        updateOnboardingTour();
        toolbar.resize.timeout = null;
    }, (settings.graphics_quality === 0) ? 50 : 5);
}


export function changeLed(elm, state, color=null) {
    elm.classList.toggle("active", state);
    if ( state && color )
        elm.style.color = color;
    else 
        elm.style.removeProperty("color");
    elm.style.setProperty("--led-intensity", `${state*100}%`);
}


/**
 * The initializeToolbar() function converts all lazy-evaluated properties of the toolbar object into direct 
 * element references, attaches toolbar-related event listeners and attaches an resize observer.
 * 
 * Lazy-evaluated properties are converted into direct references by:
 * 1. Recursively traversing the toolbar object
 * 2. Detecting properties with __f functions (indicating lazy queries)
 * 3. Executing these functions to retrieve actual DOM elements
 * 4. Replacing the wrapper objects with the resolved element references
 */
export function initializeToolbar() {

    const isGetter = (obj, prop) => {
        const desc = Object.getOwnPropertyDescriptor(obj, prop);
        return !!desc && typeof desc.get === "function";
    }

    // Convert toolbar properties into element references
    const recurse = (obj) => {
        for ( const [key, val] of Object.entries(obj) ) {
            if ( typeof(val) === "object" && typeof(val.__f) === "function" )
                obj[key] = val.__f();
            // // If it's a function, call it and replace with the result
            // if ( typeof(val) === "function" )
            //     obj[key] = val();
            // If it's an object, recurse into it
            else if ( typeof(val) === "object" && !isGetter(obj, key) )
                recurse(obj[key]);
        }
    }
    recurse(toolbar);

    // Attach toolbar-related event listeners

    attachToolbarControlEventListeners();
    attachToolbarSoundEventListeners();
    attachToolbarTransposeEventListeners();
    attachToolbarSizeEventListeners();
    attachToolbarAppearanceEventListeners();
    attachToolbarPedalsEventListeners();
    attachToolbarLabelsEventListeners();
    attachToolbarStickersEventListeners();
    attachToolbarToggleEventListeners();

    const dropdown_show_handler = (e) => {
        e.currentTarget.querySelector("sl-button")
            .setAttribute("variant", "neutral");
    };
    
    const dropdown_hide_handler = (e) => {
        const btn = e.currentTarget.querySelector("sl-button");
        btn.setAttribute("variant", "default");
        btn.blur();
    };
    
    for ( const dropdown of toolbar.dropdowns.all ) {
        dropdown.addEventListener("sl-show", dropdown_show_handler);
        dropdown.addEventListener("sl-hide", dropdown_hide_handler);
    }

    toolbar.buttons.panic.addEventListener("click", triggerPanic);
    toolbar.title.addEventListener("click", () => document.getElementById("dialog-about").show());

    // Attach resize observer
    toolbar.resize.observer = new ResizeObserver(handleToolbarResize);
    toolbar.resize.observer.observe(toolbar.self);
    
}
