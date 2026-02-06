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

// Shoelace localization files
import '@shoelace-style/shoelace/dist/translations/en.js';
import '@shoelace-style/shoelace/dist/translations/pt.js';

// Shoelace components
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/color-picker/color-picker.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/visually-hidden/visually-hidden.js';

// Shoelace set base path
import { setBasePath as shoelaceSetBaseBath } 
    from '@shoelace-style/shoelace/dist/utilities/base-path.js';
shoelaceSetBaseBath('assets/shoelace');

import { 
    is_mobile, setCheckedAttr, setDisabledAttr, setHiddenAttr, setLoadingAttr 
} from './common.js';

import { 
    settings, setKeyDepth, setNumberOfKeys, 
    saveDeviceSetting, saveAppearanceSettings,
    saveLabelsAndStickersSettings, savePedalSettings,
    writeSessionSettings
} from './settings.js';

import { sound } from "./sound.js";
import { triggerPanic } from './panic.js';
import { KbdNotes } from './lib/kbdnotes.js';
import { Midi } from './lib/libmidi.js';
import { cloneTemplate } from './lib/utils.js';
import { setTransposition } from './transpose.js';

import { 
    midi, MIDI_WATCHDOG_FAST_INTERVAL, MIDI_WATCHDOG_SLOW_INTERVAL, toggleInput, togglePcKeyboardConnection, toggleTouchConnection 
} from './connect.js';

import { 
    clearStickers, clearLabels, isLabelingModeOn, isStickerModeOn, setLabelsType, 
    toggleLabelingMode, toggleLabelsOctave, toggleLabelsPlayed, toggleStickerMode 
} from './markings.js';

import { 
    createPianoKeyboard, touch, updatePianoKeys, updatePianoPosition, updatePianoTopFelt 
} from './piano.js';
import { updateOnboardingTour } from './onboarding.js';


export const toolbar = {
    self: document.getElementById("top-toolbar"),
    title: document.getElementById("toolbar-title"),
    dropdowns: {
        connect: document.getElementById("dropdown-connect"),
        sound: document.getElementById("dropdown-sound"),
        transpose: document.getElementById("dropdown-transpose"),
        size: document.getElementById("dropdown-size"),
        colors: document.getElementById("dropdown-colors"),
        pedals: document.getElementById("dropdown-pedals"),
        labels: document.getElementById("dropdown-labels"),
        stickers: document.getElementById("dropdown-stickers"),
        get all() {
            return [
                this.connect, this.sound, this.transpose,
                this.size, this.colors, this.pedals, 
                this.labels, this.stickers
            ];
        },
        closeAll() {
            for ( const dropdown of this.all )
                dropdown.hide();
        },
        getOpen() {
            return this.all.find(dropdown => dropdown.open) ?? null;
        }
    },
    buttons: {
        connect: document.getElementById("btn-connect"),
        sound: document.getElementById("btn-sound"),
        transpose: document.getElementById("btn-transpose"),
        size: document.getElementById("btn-size"),
        colors: document.getElementById("btn-colors"),
        pedals: document.getElementById("btn-pedals"),
        labels_group: document.getElementById("btn-labels-group"),
        labels_left: document.getElementById("btn-labels-switch"),
        labels_right: document.getElementById("btn-labels-dropdown"),
        stickers_group: document.getElementById("btn-stickers-group"),
        stickers_left: document.getElementById("btn-stickers-switch"),
        stickers_right: document.getElementById("btn-stickers-dropdown"),
        panic: document.getElementById("btn-panic"),
        hide_toolbar: document.getElementById("btn-hide-toolbar"),
        show_toolbar: document.getElementById("btn-show-toolbar")
    },
    menus: {
        connect: {
            top: document.getElementById("midi-connection-menu"),
            divider: document.querySelector("#midi-connection-menu sl-divider"),
            denied: document.getElementById("menu-connect-item-midi-denied"),
            unavailable: document.getElementById("menu-connect-item-midi-unavailable"),
            prompt: document.getElementById("menu-connect-item-midi-prompt"),
            kbd: document.getElementById("menu-connect-item-computer-keyboard"),
            touch: document.getElementById("menu-connect-item-touch"),
            template: document.getElementById("menu-connect-item-midi-port-template"),
            getMidiItems: () => Array.from(
                toolbar.menus.connect.top.querySelectorAll(".menu-connect-item-midi-input")
            )
        },
        sound: {
            top: document.getElementById("menu-sound"),
            items: Array.from(document.querySelectorAll(".menu-sound-item"))
        },
        transpose: {
            top: document.getElementById("menu-transpose"),
            semitones: {
                input: document.getElementById("input-semitones"),
                btn_minus: document.getElementById("btn-semitone-minus"),
                btn_plus: document.getElementById("btn-semitone-plus"),
            },
            octaves: {
                input: document.getElementById("input-octaves"),
                btn_minus: document.getElementById("btn-octave-minus"),
                btn_plus: document.getElementById("btn-octave-plus"),
            },
            item_reset: document.getElementById("reset-transpose")
        },
        size: document.getElementById("menu-size"),
        colors: {
            top: document.getElementById("menu-colors"),
            highlight_opacity: document.getElementById("menu-highlight-opacity"),
            picker_color_white: document.getElementById("color-white"),
            picker_color_black: document.getElementById("color-black"),
            picker_color_pressed: document.getElementById("color-pressed"),
            item_perspective: document.getElementById("menu-perspective"),
            item_top_felt: document.getElementById("menu-top-felt"),
        },
        labels: {
            top: document.getElementById("menu-labels-top"),
            labeling_mode: document.getElementById("menu-labeling-mode"),
            played: document.getElementById("menu-labels-played-keys"),
            // presets: document.getElementById("menu-labels-which"),
            type: document.getElementById("menu-labels-type"),
            octave: document.getElementById("menu-item-labels-octave"),
            clear: document.getElementById("menu-labels-clear")
        },
        stickers: {
            top: document.getElementById("menu-stickers-top"),
            clear: document.getElementById("menu-stickers-clear")
        },
        pedals: {
            top: document.getElementById("pedal-menu"),
            item_follow: document.getElementById("menu-pedal-follow"),
            item_dim: document.getElementById("menu-pedal-dim")
        } 
    },
    leds: {
        control: document.getElementById("connection-power-icon"),
        transpose: document.getElementById("transpose-power-icon"),
        sound: document.getElementById("sound-power-icon"),
        labels: document.getElementById("labels-power-icon"),
        stickers: document.getElementById("stickers-power-icon"),
        pedal_r: document.getElementById("pedr"),
        pedal_m: document.getElementById("pedm"),
        pedal_l: document.getElementById("pedl"),
    },
    resize: {
        observer: null,
        timeout: null
    }
};

const toolbar_shrink_list = [
    { elm: toolbar.title,                  action: "hide-elm" },
    { elm: toolbar.buttons.sound,          action: "hide-label" },
    { elm: toolbar.buttons.connect,        action: "hide-label" },
    { elm: toolbar.buttons.pedals,         action: "hide-label" },
    { elm: toolbar.buttons.transpose,      action: "hide-label" },
    { elm: toolbar.buttons.stickers_left,  action: "hide-label" },
    { elm: toolbar.buttons.labels_left,    action: "hide-label" },
    { elm: toolbar.dropdowns.colors,       action: "hide-elm" },
    { elm: toolbar.dropdowns.size,         action: "hide-elm" },
    { elm: toolbar.dropdowns.sound,        action: "hide-elm" },
    { elm: toolbar.dropdowns.pedals,       action: "hide-elm" },
    { elm: toolbar.buttons.stickers_group, action: "hide-elm" },
    { elm: toolbar.buttons.labels_group,   action: "hide-elm" },
    { elm: toolbar.buttons.panic,          action: "hide-elm" },
    { elm: toolbar.self,                   action: "hide-elm" }
];


export function updateToolbar() {
    changeLed(toolbar.leds.control, 
        ( settings.pc_keyboard_connected || touch.enabled 
          || ( settings.device_name && Midi.getConnectedPort() )));
    changeLed(toolbar.leds.transpose, ( settings.transpose != 0 ));
    changeLed(toolbar.leds.sound, sound.led, (sound.led == 1 ? "red" : null));
    changeLed(toolbar.leds.labels, isLabelingModeOn());
    changeLed(toolbar.leds.stickers, isStickerModeOn(), {
        red: "red", yellow: "yellow", green: "#0b0", blue: "blue", violet: "violet"
    }[settings.stickers.color]);
    setHiddenAttr(toolbar.self, !settings.toolbar);
    setHiddenAttr(toolbar.buttons.show_toolbar, settings.toolbar);
    setHiddenAttr(toolbar.dropdowns.pedals, touch.enabled);
    updatePedalIcons();
    // updateToolbarBasedOnWidth();
}


export function updateToolbarBasedOnWidth() {
    // Reset all to know full width
    for ( const item of toolbar_shrink_list ) {
        if ( item.action == "hide-elm" )
            item.elm.classList.toggle("condensed-toolbar-hidden-elm", false);
        else if ( item.action == "hide-label" )
            item.elm.classList.toggle("condensed-toolbar-hidden-label", false);
    }
    // Try to reduce toolbar elements as needed
    for ( const item of toolbar_shrink_list ) {
        if ( toolbar.self.scrollWidth <= toolbar.self.clientWidth )
            break;
        if ( item.action == "hide-elm" )
            item.elm.classList.toggle("condensed-toolbar-hidden-elm", true);
        else if ( item.action == "hide-label" )
            item.elm.classList.toggle("condensed-toolbar-hidden-label", true);
    }
}


export function updateConnectionMenu() {

    setHiddenAttr(toolbar.menus.connect.denied, midi.access != "denied");
    setHiddenAttr(toolbar.menus.connect.unavailable, is_mobile || midi.access != "unavailable");
    setHiddenAttr(toolbar.menus.connect.prompt, midi.access != "prompt");
    setHiddenAttr(toolbar.menus.connect.divider, 
        (midi.access == "granted" && !midi.ports?.length) 
        || ( is_mobile && midi.access == "unavailable")
    );

    setCheckedAttr(toolbar.menus.connect.kbd, settings.pc_keyboard_connected);
    setCheckedAttr(toolbar.menus.connect.touch, touch.enabled);

    if ( midi.access != "granted" ) {
        midi.clearMenuItems();
        return;
    }

    // Add menu items for new ports
    for ( const port of midi.ports ?? [] ) {
        if ( !midi.menu_items.some((menu_item) =>
                port.name == menu_item.value,
        ) ) {
            const new_menu_item = cloneTemplate(
                toolbar.menus.connect.template, 
                { value: port.name }, port.name
            );
            // menu item click event handler
            new_menu_item.addEventListener("click", (e) => {
                toggleInput(e.currentTarget.value, true);
            });
            toolbar.menus.connect.top
            .insertBefore(new_menu_item, toolbar.menus.connect.divider);
        }
    }

    // Check/uncheck menu items, and remove obsolete ports
    for ( const menu_item of midi.menu_items ?? [] ) {
        if ( midi.ports.some((port) => menu_item.value == port.name) ) {
            setCheckedAttr(menu_item, menu_item.value == midi.connected_port?.name);
        } else{
            menu_item.remove();
        }
    }

}


export function updateSoundMenu() {
    if ( sound.loading ) {
        for ( const item of toolbar.menus.sound.items ) {
            const is_selected_sound = item.getAttribute("value") == sound.type;
            setLoadingAttr(item, is_selected_sound);
            setDisabledAttr(item, !is_selected_sound);
            item.checked = false;
        }
    } else {
        for ( const item of toolbar.menus.sound.items ) {
            const is_selected_sound = item.getAttribute("value") == sound.type;
            item.checked = is_selected_sound;
            setLoadingAttr(item, false);
            setDisabledAttr(item, false);
        }
    }
}


export function updateSizeMenu() {
    for ( const elm of toolbar.dropdowns.size.querySelectorAll(".btn-number-of-keys") ) {
        const checked = ( parseInt(elm.value) == settings.number_of_keys );
        elm.variant = checked ? "neutral" : null;
    }
    for ( const elm of toolbar.dropdowns.size.querySelectorAll(".btn-key-depth") ) {
        const checked = ( parseFloat(elm.value) == settings.height_factor );
        elm.variant = checked ? "neutral" : null;
    }
}


export function updateColorsMenu() {
    toolbar.menus.colors.picker_color_white.value = settings.color_white;
    toolbar.menus.colors.picker_color_black.value = settings.color_black;
    toolbar.menus.colors.picker_color_pressed.value = settings.color_highlight;
    toolbar.menus.colors.item_perspective.checked = settings.perspective;
    toolbar.menus.colors.item_perspective.hidden = settings.lowperf;
    toolbar.menus.colors.item_top_felt.checked = settings.top_felt;
    for ( const item of toolbar.menus.colors.highlight_opacity.children )
        item.checked = ( item.value == settings.highlight_opacity.toString() );
}


export function updatePedalsMenu() {
    toolbar.menus.pedals.item_follow.checked = settings.pedals;
    toolbar.menus.pedals.item_dim.checked = settings.pedal_dim;
    setDisabledAttr(toolbar.menus.pedals.item_dim, !settings.pedals);
}


export function updatePedalIcons() {
    changeLed(toolbar.leds.pedal_r, KbdNotes.isSustainActive() || Midi.sustain_pedal_value / 127);
    changeLed(toolbar.leds.pedal_m , Midi.sostenuto_pedal_value / 127);
    changeLed(toolbar.leds.pedal_l, Midi.soft_pedal_value / 127);
}


export function updateLabelsMenu() {
    toolbar.menus.labels.labeling_mode.checked = isLabelingModeOn();
    toolbar.menus.labels.played.checked = settings.labels.played;
    for ( const item of toolbar.menus.labels.type.children )
        if ( item.value != "octave" )
            item.checked = ( item.value === settings.labels.type );
    toolbar.menus.labels.type.nextElementSibling.innerText = settings.labels.type_badge;
    toolbar.menus.labels.octave.disabled = ["pc","midi","freq"].includes(settings.labels.type);
    toolbar.menus.labels.octave.checked = settings.labels.octave;
    toolbar.menus.labels.clear.disabled = settings.labels.keys.size == 0;
}


export function updateStickersMenu() {
    const sticker_mode_on = isStickerModeOn();
    for ( const item of toolbar.menus.stickers.top.children )
        if ( item.getAttribute("type") == "checkbox" ) {
            const is_current_color = ( item.value == settings.stickers.color );
            item.checked = ( sticker_mode_on && is_current_color );
            item.querySelector(".menu-keyboard-shortcut")
                .classList.toggle("invisible", !is_current_color);
        }
    toolbar.menus.stickers.clear.disabled = settings.stickers.keys.size == 0;
}


export function updateTransposeMenuAndButton() {
    toolbar.menus.transpose.semitones.input.value = settings.semitones;
    toolbar.menus.transpose.octaves.input.value = settings.octaves;
    setDisabledAttr(toolbar.menus.transpose.item_reset, settings.transpose == 0);
    changeLed(toolbar.leds.transpose, ( settings.transpose != 0 ));
}


export function toggleToolbarVisibility() {
    settings.toolbar = !settings.toolbar;
    updateToolbar();
    updatePianoPosition();
    writeSessionSettings();
}


export function enable20KeysBtn(value = true) {
    setHiddenAttr(
        toolbar.menus.size.querySelector('.btn-number-of-keys[value="20"]'),
        !value
    );
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
    }, settings.lowperf ? 50 : 5);
}


function changeLed(elm, state, color=null) {
    elm.classList.toggle("active", state);
    if ( state && color )
        elm.style.color = color;
    else 
        elm.style.removeProperty("color");
    elm.style.setProperty("--led-intensity", `${state*100}%`);
}


// Set event listeners

toolbar.dropdowns.connect.addEventListener("sl-show", () => {
    updateConnectionMenu();
    midi.setWatchdog(MIDI_WATCHDOG_FAST_INTERVAL);
    midi.queryAccess((access) => {
        if ( access != "granted" )
            updateConnectionMenu();
        if ( ["granted", "prompt"].includes(access) )
            midi.requestAccess((result) => {
                updateConnectionMenu();
                if ( result )
                    midi.requestPorts(updateConnectionMenu);
            });
    });
});

toolbar.dropdowns.connect.addEventListener("sl-hide", () => {
    midi.setWatchdog(MIDI_WATCHDOG_SLOW_INTERVAL);
    updateToolbar();
});

toolbar.dropdowns.sound.addEventListener("sl-show", updateSoundMenu);
toolbar.dropdowns.size.addEventListener("sl-show", updateSizeMenu);
toolbar.dropdowns.colors.addEventListener("sl-show", updateColorsMenu);
toolbar.dropdowns.pedals.addEventListener("sl-show", updatePedalsMenu);
toolbar.dropdowns.labels.addEventListener("sl-show", updateLabelsMenu);
toolbar.dropdowns.stickers.addEventListener("sl-show", updateStickersMenu);
toolbar.dropdowns.transpose.addEventListener("sl-show", updateTransposeMenuAndButton);

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

toolbar.menus.connect.kbd.addEventListener("click", () => {
    togglePcKeyboardConnection();
    saveDeviceSetting();
});

toolbar.menus.connect.touch.addEventListener("click", () => {
    toggleTouchConnection();
    saveDeviceSetting();
});

toolbar.menus.sound.top.addEventListener("sl-select", (e) => {
    sound.load(e.detail.item.value);
    // already called by sound.load(): saveSoundSetting(e.detail.item.value);
});

const btn_number_of_keys_handler = (e) => {
    setNumberOfKeys(parseInt(e.currentTarget.value));
    if ( is_mobile ) toolbar.dropdowns.size.hide();
};

toolbar.dropdowns.size.querySelectorAll(".btn-number-of-keys")
.forEach((item) => {
    item.addEventListener("click", btn_number_of_keys_handler);
});

const btn_key_depth_handler = (e) => {
    setKeyDepth(parseFloat(e.currentTarget.value));
    if ( is_mobile ) toolbar.dropdowns.size.hide();
};

toolbar.dropdowns.size.querySelectorAll(".btn-key-depth")
.forEach((item) => {
    item.addEventListener("click", btn_key_depth_handler);
});

toolbar.menus.colors.highlight_opacity
.addEventListener("sl-select", (e) => {
    settings.highlight_opacity = e.detail.item.value;
    saveAppearanceSettings();
    updateColorsMenu();
});

toolbar.menus.colors.item_perspective
.addEventListener("click", () => {
    settings.perspective = !settings.perspective;
    createPianoKeyboard();
    saveAppearanceSettings();
    if ( is_mobile ) toolbar.dropdowns.colors.hide();
});

toolbar.menus.colors.item_top_felt
.addEventListener("click", () => {
    settings.top_felt = !settings.top_felt;
    updatePianoTopFelt();
    saveAppearanceSettings();
    if ( is_mobile ) toolbar.dropdowns.colors.hide();
});

toolbar.menus.colors.picker_color_white
.addEventListener("sl-change", (e) => {
    settings.color_white = e.target.value;
    saveAppearanceSettings();
});

toolbar.menus.colors.picker_color_black
.addEventListener("sl-change", (e) => {
    settings.color_black = e.target.value;
    saveAppearanceSettings();
});

toolbar.menus.colors.picker_color_pressed
.addEventListener("sl-change", (e) => {
    settings.color_highlight = e.target.value;
    saveAppearanceSettings();
});

toolbar.menus.labels.type
.addEventListener("sl-select", (e) => {
    if ( e.detail.item.value == toolbar.menus.labels.octave.value )
        toggleLabelsOctave(e.detail.item.checked);
    else
        setLabelsType(e.detail.item.value);
    if ( is_mobile ) toolbar.dropdowns.labels.hide();
});

toolbar.menus.labels.top
.addEventListener("sl-select", (e) => {
    if ( e.detail.item.id == toolbar.menus.labels.labeling_mode.id ) {
        toggleLabelingMode(e.detail.item.checked);
        toolbar.dropdowns.labels.hide();
    } else if ( e.detail.item.id == toolbar.menus.labels.played.id ) {
        toggleLabelsPlayed(e.detail.item.checked);
        if ( is_mobile ) toolbar.dropdowns.labels.hide();
    }
});

toolbar.buttons.labels_left
.addEventListener("click", () => {
    toggleLabelingMode();
});

toolbar.menus.stickers.top
.addEventListener("sl-select", (e) => {
    if ( e.detail.item.getAttribute("type") == "checkbox" ) {
        toggleStickerMode(undefined, e.detail.item.value);
        toolbar.dropdowns.stickers.hide();
    }
    saveLabelsAndStickersSettings();
});

toolbar.buttons.stickers_left
.addEventListener("click", () => {
    toggleStickerMode();
});

toolbar.menus.stickers.clear
.addEventListener("click", () => {
    clearStickers();
});

toolbar.menus.labels.clear
.addEventListener("click", () => {
    clearLabels();
});

toolbar.menus.pedals.top
.addEventListener("sl-select", (e) => {
    const item = e.detail.item;
    switch ( item.id ) {
        case "menu-pedal-follow": settings.pedals = item.checked; break;
        case "menu-pedal-dim": settings.pedal_dim = item.checked; break;
    }
    setDisabledAttr(toolbar.menus.pedals.item_dim, !settings.pedals);
    updatePedalIcons();
    updatePianoKeys();
    savePedalSettings();
    if ( is_mobile ) toolbar.dropdowns.pedals.hide();
});

toolbar.menus.transpose.semitones.btn_plus
.addEventListener("click", () => setTransposition({ semitones: +1 }));

toolbar.menus.transpose.semitones.btn_minus
.addEventListener("click", () => setTransposition({ semitones: -1 }));

toolbar.menus.transpose.octaves.btn_plus
.addEventListener("click", () => setTransposition({ octaves: +1 }));

toolbar.menus.transpose.octaves.btn_minus
.addEventListener("click", () => setTransposition({ octaves: -1 }));

toolbar.menus.transpose.item_reset
.addEventListener("click", () => {
     setTransposition({ reset: true }) ;
     if ( is_mobile ) toolbar.dropdowns.transpose.hide();
});

toolbar.buttons.panic.addEventListener("click", triggerPanic);

toolbar.buttons.hide_toolbar.addEventListener("click", toggleToolbarVisibility);
toolbar.buttons.show_toolbar.addEventListener("click", toggleToolbarVisibility);

toolbar.title.addEventListener("click", () => document.getElementById("dialog-about").show());
