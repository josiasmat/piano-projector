/*
Piano Projector
Copyright (C) 2024 Josias Matschulat

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

import Midi from "./midi.js";
import SvgTools from "./svgtools.js";
import { LocalStorageHandler, SessionStorageHandler } from "./storage-handler.js";

const settings_storage = new LocalStorageHandler("piano-projector");
const session_storage = new SessionStorageHandler("piano-projector-session");

const settings = {
    device_name: null,
    offset: {
        x: 0.5,
        y: 0.5,
    },
    zoom: 1.0,
    number_of_keys: 88,
    height: 500,
    height_factor: 1,
    color_white: "#fff",
    color_black: "#000",
    color_pressed: "#f00",
    sustain: true,
    sostenuto: true,
    get pedals() {
        if ( this.sustain )
            return ( this.sostenuto ) ? "both" : "sustain";
        else
            return ( this.sostenuto ) ? "sostenuto" : "none";
    },
    pedal_dim: true,
    pedal_icons: true,
    semitones: 0,
    octaves: 0,
    get transpose() {
        return this.semitones + (this.octaves*12);
    }
}

const drag_state = {
    dragging: false,
    origin: {
        x: 0, y: 0
    },
    original: {
        x: 0, y: 0
    }
}

const keys = Array(128).fill(null);

const kbd_container = document.getElementById("main-area");
const kbd = document.getElementById("kbd");


/** 
 * @param {SVGElement} svg 
 * @param {number} first_key
 * @param {number} last_key
 * @param {number} height
 */
function drawKeyboard(svg, first_key, last_key) {
    const WHITE_NOTE = [1,0,1,0,1,1,0,1,0,1,0,1];
    const BK_OFFSETS = [,-0.1,,+0.1,,,-0.1,,0,,+0.1,];
    const WHITE_KEY_HEIGHT = settings.height * settings.height_factor;
    const BLACK_KEY_HEIGHT = WHITE_KEY_HEIGHT * 0.6;
    const WHITE_KEY_WIDTH = settings.height * 2.2 / 15.5;
    const BLACK_KEY_WIDTH = settings.height * 1.6 / 15.5;
    const BLACK_KEY_WIDTH_HALF = BLACK_KEY_WIDTH / 2;
    const KEY_ROUNDING = WHITE_KEY_WIDTH / 15;
    const FILL_BORDER = 6;
    let width = 0;

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    svg.innerHTML = "";

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

    function drawKey(left, width, height, round, border, attrs) {
        const right = left + width;
        const key = SvgTools.makePolygon(
            [
                {x:left+border, y:border}, 
                {x:right-border, y:border},
                {x:right-border, y:height-border-round},
                {x:right-round-border, y:height-border},
                {x:left+border+round, y:height-border},
                {x:left+border, y:height-border-round}
            ], 
            attrs
        );
        return key;
    }

    let white_left = 0;
    for ( let key = first_key; key <= last_key; key++ ) {
        const note = key % 12;
        if ( WHITE_NOTE[note] ) {
            const white_key = drawKey(
                white_left, WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT, KEY_ROUNDING, 0,
                { class: "white-key", fill: settings.color_white, value: key }
            );
            const white_key_fill = drawKey(
                white_left, WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT, KEY_ROUNDING, FILL_BORDER,
                { id: `key${key}`, class: "white-key-fill", value: key }
            );
            white_keys_g.appendChild(white_key);
            white_keys_g.appendChild(white_key_fill);
            keys[key] = white_key_fill;
            width += WHITE_KEY_WIDTH;
            white_left += WHITE_KEY_WIDTH;
        } else {
            const black_left = white_left - BLACK_KEY_WIDTH_HALF + (BK_OFFSETS[note]*BLACK_KEY_WIDTH);
            const black_key = drawKey(
                black_left, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT, KEY_ROUNDING, 0,
                { class: "black-key", fill: settings.color_black, value: key }
            );
            const black_key_fill = drawKey(
                black_left, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT, KEY_ROUNDING, FILL_BORDER,
                { id: `key${key}`, class: "black-key-fill", value: key }
            );
            black_keys_g.appendChild(black_key);
            black_keys_g.appendChild(black_key_fill);
            keys[key] = black_key_fill;
        }
    }
    svg.appendChild(white_keys_g);
    svg.appendChild(black_keys_g);
    svg.setAttribute("viewBox", `-2 -2 ${width+4} ${WHITE_KEY_HEIGHT+4}`);

    function makeGradient(id, stops_attrs) {
        const grad = SvgTools.createElement("linearGradient", {
            id: id, gradientTransform: "rotate(90)"
        });
        for ( const stop_attr of stops_attrs ) {
            grad.appendChild(SvgTools.createElement("stop", stop_attr));
        }
        return grad;
    }

    const svg_defs = SvgTools.createElement("defs");
    svg_defs.appendChild(makeGradient("pressed-white-key-gradient", [
        { offset: "0%", "stop-color": settings.color_white },
        { offset: "30%", "stop-color": settings.color_pressed }
    ]));
    svg_defs.appendChild(makeGradient("pressed-black-key-gradient", [
        { offset: "0%", "stop-color": settings.color_black },
        { offset: "25%", "stop-color": settings.color_pressed }
    ]));
    svg.appendChild(svg_defs);

}


function createKeyboard() {
    switch ( settings.number_of_keys ) {
        case 88:
            drawKeyboard(kbd, noteToMidi("a0"), noteToMidi("c8"));
            break;
        case 61:
            drawKeyboard(kbd, noteToMidi("c2"), noteToMidi("c7"));
            break;
        case 49:
            drawKeyboard(kbd, noteToMidi("c2"), noteToMidi("c6"));
            break;
        case 37:
            drawKeyboard(kbd, noteToMidi("c3"), noteToMidi("c6"));
            break;
        case 25:
            drawKeyboard(kbd, noteToMidi("c3"), noteToMidi("c5"));
            break;
        default:
            const ln = noteToMidi("e4") - Math.trunc(settings.number_of_keys / 2);
            const hn = noteToMidi("e4") + Math.ceil(settings.number_of_keys / 2) - 1;
            drawKeyboard(kbd, ln, hn, height);
    }
    updateKeyboard();
}


function updatePedalIcons() {
    const btn_pedals = document.getElementById("btn-pedals");
    const btn_pedals_button = btn_pedals.shadowRoot.querySelector("button");
    const btn_pedals_prefix = btn_pedals_button.querySelector(".button__prefix");
    if ( settings.pedal_icons ) {
        btn_pedals_button.classList.add("button--has-prefix");
        btn_pedals_prefix.style.display = "flex";
        changeLed("pedr", ( Midi.getLastControlValue(64) > 63 ));
        changeLed("pedm", ( Midi.getLastControlValue(66) > 63 ));
        changeLed("pedl", ( Midi.getLastControlValue(67) > 63 ));
    } else {
        btn_pedals_button.classList.remove("button--has-prefix");
        btn_pedals_prefix.style.display = "none";
    }
}


function updateToolbar() {
    changeLed("connection-power-icon", ( Midi.getConnectedPort() ));
    changeLed("transpose-power-icon", ( settings.transpose != 0 ));
    updatePedalIcons();
}


function updateSizeMenu(excluded_elm = null) {
    for ( const elm of document.querySelectorAll(".menu-number-of-keys") )
        if ( elm != excluded_elm )
            elm.checked = ( parseInt(elm.value) == settings.number_of_keys );
    for ( const elm of document.querySelectorAll(".menu-key-height") )
        if ( elm != excluded_elm )
            elm.checked = ( parseFloat(elm.value) == settings.height_factor );
}


function updateColorsMenu() {
    document.getElementById("color-white").value = settings.color_white;
    document.getElementById("color-black").value = settings.color_black;
    document.getElementById("color-pressed").value = settings.color_pressed;
}


function updatePedalsMenu() {
    document.getElementById("menu-pedal-sustain").checked = settings.sustain;
    document.getElementById("menu-pedal-sostenuto").checked = settings.sostenuto;
    document.getElementById("menu-pedal-icons").checked = settings.pedal_icons;
    const menu_pedal_dim = document.getElementById("menu-pedal-dim");
    menu_pedal_dim.checked = settings.pedal_dim;
    menu_pedal_dim.toggleAttribute("disabled", !(settings.sustain || settings.sostenuto));
}


function updateTransposeMenuAndButton() {
    document.getElementById("input-semitones").value = settings.semitones;
    document.getElementById("input-octaves").value = settings.octaves;
    document.getElementById("reset-transpose").toggleAttribute("disabled", settings.transpose == 0);
    changeLed("transpose-power-icon", ( settings.transpose != 0 ));
}


function updateKeyboardPosition() {
    const max_zoom = kbd_container.clientHeight / kbd.clientHeight;
    if ( settings.zoom > 1 ) {
        if ( settings.zoom > max_zoom ) settings.zoom = max_zoom;
        kbd.style.transform = `scale(${settings.zoom}, ${settings.zoom})`;
    } else
        kbd.style.removeProperty("transform");

    const kbd_rect = kbd.getBoundingClientRect();
    const cnt_rect = kbd_container.getBoundingClientRect();

    // compute vertical position
    const py = (cnt_rect.height - kbd_rect.height) * settings.offset.y;
    kbd.style.top = `${py}px`;

    // compute horizontal position
    const px = (kbd_rect.width - cnt_rect.width) * settings.offset.x;
    kbd_container.scroll(px, 0);
}


function updateKeyboardKeys(first_key=0, last_key=127) {
    for ( let i = first_key; i <= last_key; i++ ) {
        const key = keys[i];
        if ( key ) {
            const j = i-settings.transpose;
            if ( Midi.isNoteOn(j, settings.pedals) ) {
                key.classList.add(["active"]);
                if ( !Midi.isKeyPressed(j) && settings.pedal_dim )
                    key.classList.add(["dim"]);
                else
                    key.classList.remove(["dim"]);
            } else {
                key.classList.remove(["active"]);
                key.classList.remove(["dim"]);
            }
        }
    }
}


function updateKeyboard() {
    updateKeyboardPosition();
    updateKeyboardKeys();
}


function updateNote(note) {
    const key = note+settings.transpose;
    if ( key >= 0 && key < 128 )
        updateKeyboardKeys(key, key);
}


function writeSettings() {
    settings_storage.writeString("color-white", settings.color_white);
    settings_storage.writeString("color-black", settings.color_black);
    settings_storage.writeString("color-pressed", settings.color_pressed);
    settings_storage.writeNumber("height-factor", settings.height_factor);
    settings_storage.writeNumber("number-of-keys", settings.number_of_keys);
    settings_storage.writeBool("sustain", settings.sustain);
    settings_storage.writeBool("sostenuto", settings.sostenuto);
    settings_storage.writeBool("pedal-dim", settings.pedal_dim);
    settings_storage.writeBool("pedal-icons", settings.pedal_icons);
    settings_storage.writeNumber("offset-x", settings.offset.x);
    settings_storage.writeNumber("offset-y", settings.offset.y);
    if ( settings.device_name )
        settings_storage.writeString("device", settings.device_name);
    else
        settings_storage.remove("device");
    session_storage.writeNumber("semitones", settings.semitones);
    session_storage.writeNumber("octaves", settings.octaves);
}


function loadSettings() {
    settings.color_white = settings_storage.readString("color-white", settings.color_white);
    settings.color_black = settings_storage.readString("color-black", settings.color_black);
    settings.color_pressed = settings_storage.readString("color-pressed", settings.color_pressed);
    settings.height_factor = settings_storage.readNumber("height-factor", settings.height_factor);
    settings.number_of_keys = settings_storage.readNumber("number-of-keys", settings.number_of_keys);
    settings.sustain = settings_storage.readBool("sustain", settings.sustain);
    settings.sostenuto = settings_storage.readBool("sostenuto", settings.sostenuto);
    settings.pedal_dim = settings_storage.readBool("pedal-dim", settings.pedal_dim);
    settings.pedal_icons = settings_storage.readBool("pedal-icons", settings.pedal_icons);
    settings.offset.x = settings_storage.readNumber("offset-x", settings.offset.x);
    settings.offset.y = settings_storage.readNumber("offset-y", settings.offset.y);
    settings.device_name = settings_storage.readString("device", null);
    settings.semitones = session_storage.readNumber("semitones", 0);
    settings.octaves = session_storage.readNumber("octaves", 0);
}


function changeLed(id, state, color=null) {
    const elm = document.getElementById(id);
    if ( state ) {
        elm.classList.add(["active"]);
        if ( color ) elm.style.color = color;
    } else {
        elm.classList.remove(["active"]);
        elm.style.removeProperty("color");
    }
}


// Set event listeners

document.getElementById("midi-connect-button").addEventListener("click", () => {
    const menu = document.getElementById("midi-connection-menu");
    menu.innerHTML = "";

    function doOnAccessDenied() {
        const menu_item = document.createElement("sl-menu-item");
        menu_item.innerText = "MIDI access denied.";
        menu_item.toggleAttribute("disabled", true);
        menu.appendChild(menu_item);
        changeLed("connection-power-icon", false);
    }

    function doOnAccessGranted() {
        Midi.requestInputPortList(
            (ports) => {
                const connected_port = Midi.getConnectedPort();
                for ( const port of ports ) {
                    const menu_item = document.createElement("sl-menu-item");
                    menu_item.innerText = port.name;
                    menu_item.setAttribute("type", "checkbox");
                    menu_item.value = port.id;
                    if ( connected_port && connected_port.id == port.id ) {
                        menu_item.toggleAttribute("checked", true);
                        changeLed("connection-power-icon", true);
                    }
                    menu_item.addEventListener("click", (e) => {
                        const cp = Midi.getConnectedPort();
                        if ( cp && cp.id == e.target.value ) {
                            Midi.disconnect();
                            changeLed("connection-power-icon", false);
                            settings.device_name = null;
                        } else {
                            Midi.connect(port);
                            changeLed("connection-power-icon", true);
                            for ( const mi of Array.from(menu.children) )
                                mi.removeAttribute("checked");
                            settings.device_name = port.name;
                        }
                        updateKeyboard();
                        writeSettings();
                    });
                    menu.appendChild(menu_item);
                }
                if ( ports.length == 0 ) {
                    const menu_item = document.createElement("sl-menu-item");
                    menu_item.innerText = "No MIDI input devices available";
                    menu_item.toggleAttribute("disabled", true);
                    menu.appendChild(menu_item);
                    changeLed("connection-power-icon", false);
                }
            },
            () => {
                doOnAccessDenied();
            }
        );
    }

    Midi.queryMidiAccess(
        doOnAccessGranted,
        doOnAccessDenied,
        () => {
            const temp_menu_item = document.createElement("sl-menu-item");
            temp_menu_item.innerText = "Requesting MIDI access...";
            temp_menu_item.toggleAttribute("loading", true);
            menu.appendChild(temp_menu_item);
            Midi.requestMidiAccess(
                () => {
                    menu.removeChild(temp_menu_item);
                    doOnAccessGranted();
                },
                () => {
                    menu.removeChild(temp_menu_item);
                    doOnAccessDenied();
                }
            );
        }
    )
    
});

document.getElementById("btn-size")
    .addEventListener("click", updateSizeMenu);
document.getElementById("btn-colors")
    .addEventListener("click", updateColorsMenu);
document.getElementById("btn-pedals")
    .addEventListener("click", updatePedalsMenu);
document.getElementById("btn-transpose")
    .addEventListener("click", updateTransposeMenuAndButton);

// document.getElementById("btn-labels").addEventListener("click", () => {
//     //...
// });

document.getElementById("menu-size").addEventListener("sl-select", (e) => {
    if ( e.detail.item.classList.contains("menu-number-of-keys") )
        settings.number_of_keys = parseInt(e.detail.item.value);
    else if ( e.detail.item.classList.contains("menu-key-height") )
        settings.height_factor = parseFloat(e.detail.item.value);
    updateSizeMenu();
    createKeyboard();
    writeSettings();
});

document.getElementById("color-white").addEventListener("sl-change", (e) => {
    settings.color_white = e.target.value;
    createKeyboard();
    writeSettings();
});

document.getElementById("color-black").addEventListener("sl-change", (e) => {
    settings.color_black = e.target.value;
    createKeyboard();
    writeSettings();
});

document.getElementById("color-pressed").addEventListener("sl-change", (e) => {
    settings.color_pressed = e.target.value;
    createKeyboard();
    writeSettings();
});

document.getElementById("pedal-menu").addEventListener("sl-select", (e) => {
    const item = e.detail.item;
    switch ( item.id ) {
        case "menu-sustain": settings.sustain = item.checked; break;
        case "menu-sostenuto": settings.sostenuto = item.checked; break;
        case "menu-pedal-dim": settings.pedal_dim = item.checked; break;
        case "menu-pedal-icons": settings.pedal_icons = item.checked; break;
    }
    document.getElementById("menu-pedal-dim").toggleAttribute(
        "disabled", !(settings.sustain || settings.sostenuto));
    updatePedalIcons();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("btn-semitone-plus").addEventListener("click", () => {
    settings.semitones += 1;
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("btn-semitone-minus").addEventListener("click", () => {
    settings.semitones -= 1;
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("btn-octave-plus").addEventListener("click", () => {
    settings.octaves += 1;
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("btn-octave-minus").addEventListener("click", () => {
    settings.octaves -= 1;
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("reset-transpose").addEventListener("click", () => {
    settings.semitones = 0;
    settings.octaves = 0;
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("btn-panic").addEventListener("click", () => {
    Midi.reset();
    updateKeyboardKeys();
    updatePedalIcons();
});

document.getElementById("toolbar-title").addEventListener("click", () => {
    document.getElementById("dialog-about").show();
});

window.addEventListener("resize", () => {
    updateKeyboardPosition();
});


// Mouse events

kbd.addEventListener("pointerdown", (e) => {
    drag_state.dragging = true;
    drag_state.origin.x = e.screenX;
    drag_state.origin.y = e.screenY;
    drag_state.original.x = settings.offset.x;
    drag_state.original.y = settings.offset.y;
    kbd.style.cursor = "grabbing";
    kbd.setPointerCapture(e.pointerId);
}, { capture: true, passive: false });

kbd.addEventListener("pointerup", (e) => {
    if ( drag_state.dragging ) {
        drag_state.dragging = false;
        kbd.style.removeProperty("cursor");
        kbd.releasePointerCapture(e.pointerId);
        updateKeyboardPosition();
        writeSettings();
    }
}, { capture: true, passive: false });

kbd.addEventListener("pointermove", (e) => {
    if ( drag_state.dragging ) {

        const kbd_rect = kbd.getBoundingClientRect();
        const cnt_rect = kbd_container.getBoundingClientRect();

        // X-axis - move container perspective
        const offset_x = e.screenX - drag_state.origin.x;
        const ratio_x = offset_x / (kbd_rect.width - cnt_rect.width);
        settings.offset.x = clamp(drag_state.original.x - ratio_x, 0.0, 1.0);

        // Y-axis - move keyboard
        const offset_y = e.screenY - drag_state.origin.y;
        const ratio_y = offset_y / (cnt_rect.height - kbd_rect.height);
        settings.offset.y = clamp(drag_state.original.y + ratio_y, 0.0, 1.0);

        updateKeyboardPosition();
    }
}, { capture: true, passive: true });

kbd.addEventListener("wheel", (e) => {
    if ( !drag_state.dragging && !e.ctrlKey ) {
        const max_zoom = kbd_container.clientHeight / kbd.clientHeight;
        const new_zoom = Math.max(1.0, settings.zoom + (e.wheelDeltaY/1000));
        if ( new_zoom > max_zoom ) new_zoom = max_zoom;
        if ( settings.zoom != new_zoom ) {
            settings.zoom = new_zoom;
            const rect = kbd.getBoundingClientRect();
            const relative_x = e.clientX - rect.left
            settings.offset.x = relative_x / rect.width;
            updateKeyboardPosition();
        }
    }
}, { capture: true, passive: false });


// MIDI events

Midi.onKeyPress   = updateNote;
Midi.onKeyRelease = updateNote;

Midi.onControlChange = (number) => {
    if ( number > 63 && number < 68 ) {
        updateKeyboardKeys();
        updatePedalIcons();
    }
};


// Auxiliary functions

/**
 * @param {string} note_str 
 * @returns {number}
 */
function noteToMidi(note_str) {
    const NOTES = {
        'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3, 'e': 4, 'fb': 4, 
        'e#': 5, 'f': 5, 'f#': 6, 'gb': 6, 'g': 7, 'g#': 8, 'ab': 8, 'a': 9,
        'a#': 10, 'bb': 10, 'b': 11, 'b#': 12, 'cb': -1
    }
    const pc = NOTES[note_str.slice(0, note_str.length-1).toLowerCase()];
    const octave = parseInt(note_str.slice(note_str.length-1));
    return pc + 12*(octave+1);
}


function clamp(value, min, max) {
    return (value < min) ? min : ( (value > max) ? max : value );
}


// Initialize

loadSettings();

await Promise.allSettled([
    customElements.whenDefined('sl-dropdown'),
    customElements.whenDefined('sl-button'),
    customElements.whenDefined('sl-button-group'),
    customElements.whenDefined('sl-icon'),
    customElements.whenDefined('sl-menu'),
    customElements.whenDefined('sl-menu-item')
]);

updateToolbar();
createKeyboard();

// Connect to stored device name
if ( settings.device_name ) {
    Midi.requestInputPortList(
        (ports) => {
            for ( const port of ports ) {
                if ( port.name == settings.device_name ) {
                    Midi.connect(port);
                    updateKeyboard();
                    break;
                }
            }
            updateToolbar();
        },
        () => { updateToolbar(); }
    );
}
