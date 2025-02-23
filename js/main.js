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

import SvgTools from "./svgtools.js";
import { Midi, noteToMidi } from "./midi.js";
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
    get color_white() {
        return getComputedStyle(document.documentElement, "root").getPropertyValue("--color-white-key");
    },
    set color_white(value) {
        document.documentElement.style.setProperty('--color-white-key', value);
    },
    // color_white: "#eee",
    get color_black() {
        return getComputedStyle(document.documentElement, "root").getPropertyValue("--color-black-key");
    },
    set color_black(value) {
        document.documentElement.style.setProperty('--color-black-key', value);
    },
    get color_pressed() {
        return getComputedStyle(document.documentElement, "root").getPropertyValue("--color-highlight");
    },
    set color_pressed(value) {
        document.documentElement.style.setProperty('--color-highlight', value);
    },
    pedals: true,
    pedal_dim: true,
    pedal_icons: true,
    semitones: 0,
    octaves: 0,
    get transpose() {
        return this.semitones + (this.octaves*12);
    },
    top_felt: true,
    top_bar: true,
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

const kbd_container = document.getElementById("main-area");
const kbd = document.getElementById("kbd");
const keys = Array(128).fill(null);


/** 
 * @param {SVGElement} svg 
 * @param {number} first_key
 * @param {number} last_key
 * @param {number} height
 */
function drawKeyboard(svg, options = {}) {

    const height = options.height ?? 500;
    const height_factor = options.height_factor ?? 1.0;
    const first_key = options.first_key ?? noteToMidi("a0");
    const last_key = options.last_key ?? noteToMidi("c8");

    // } height, height_factor, first_key, last_key) {
    const WHITE_NOTE = [1,0,1,0,1,1,0,1,0,1,0,1];
    const BK_OFFSETS = [,-0.1,,+0.1,,,-0.1,,0,,+0.1,];
    const WHITE_KEY_HEIGHT = height * height_factor;
    const BLACK_KEY_HEIGHT = WHITE_KEY_HEIGHT * (0.2 * height_factor + 0.45);
    const WHITE_KEY_WIDTH = height * 2.2 / 15.5;
    const BLACK_KEY_WIDTH = height * 1.4 / 15.5;
    const BLACK_KEY_WIDTH_HALF = BLACK_KEY_WIDTH / 2;
    const KEY_ROUNDING = WHITE_KEY_WIDTH / 20;
    const WHITE_KEY_HIGHLIGHT_INSET = 2;
    const BLACK_KEY_HIGHLIGHT_INSET = 2;
    const STROKE_WIDTH = 1.5;
    let width = 0;

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    svg.innerHTML = "";

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

    function drawWhiteKey(key, note, offset, width, height, round) {
        const left = offset + STROKE_WIDTH;
        const right = left + width - (2*STROKE_WIDTH);
        const cut_point = BLACK_KEY_HEIGHT + (3*STROKE_WIDTH);

        const black_before = key > first_key && [2,4,7,9,11].includes(note);
        const black_after = key < last_key && [0,2,5,7,9].includes(note);
        const left_offset = left + ( black_before 
            ? BLACK_KEY_WIDTH_HALF + (BLACK_KEY_WIDTH * BK_OFFSETS[note-1]) + STROKE_WIDTH : 0);
        const right_offset = right - ( black_after 
            ? BLACK_KEY_WIDTH_HALF - (BLACK_KEY_WIDTH * BK_OFFSETS[note+1]) + STROKE_WIDTH : 0);

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "white-key" });

        const key_fill = SvgTools.makePolygon([
                {x:left_offset, y:0}, 
                {x:right_offset, y:0},
                black_after ? {x:right_offset, y:cut_point-round} : null,
                black_after ? {x:right_offset+round, y:cut_point} : null,
                black_after ? {x:right, y:cut_point} : null,
                {x:right, y:height-round},
                {x:right-round, y:height},
                {x:left+round, y:height},
                {x:left, y:height-round},
                black_before ? {x:left, y:cut_point} : null,
                black_before ? {x:left_offset-round, y:cut_point} : null,
                black_before ? {x:left_offset, y:cut_point-round} : null
            ], 
            { class: "key-fill", fill: "var(--color-white-key)" }
        );

        const inset = WHITE_KEY_HIGHLIGHT_INSET;
        const key_highlight = SvgTools.makePolygon([
                {x:left_offset+inset, y:inset}, 
                {x:right_offset-inset, y:inset},
                black_after ? {x:right_offset-inset, y:cut_point+inset-round} : null,
                black_after ? {x:right_offset-inset+round, y:cut_point+inset} : null,
                black_after ? {x:right-inset, y:cut_point+inset} : null,
                {x:right-inset, y:height-inset-round},
                {x:right-round-inset, y:height-inset},
                {x:left+inset+round, y:height-inset},
                {x:left+inset, y:height-inset-round},
                black_before ? {x:left+inset, y:cut_point+inset} : null,
                black_before ? {x:left_offset+inset-round, y:cut_point+inset} : null,
                black_before ? {x:left_offset+inset, y:cut_point+inset-round} : null
            ], 
            { class: "key-highlight", fill: 'url("#pressed-white-key-highlight-gradient")' }
        );

        const light_array = ['M', left_offset, STROKE_WIDTH/2,];
        if ( black_before ) 
            light_array.push(
                'V', cut_point-round,
                'L', left_offset-round, cut_point,
                'H', left
            );
        light_array.push('L', left, height-round-STROKE_WIDTH/2);
        if ( black_after ) 
            light_array.push(
                'M', right, cut_point,
                'H', right_offset+round, 
                'L', right_offset+STROKE_WIDTH/4, cut_point-round+STROKE_WIDTH/4
            );
        const light_border = SvgTools.makePath(light_array, { class: "key-light-border" } );

        const dark_array = [
            'M', left, height-round,
            'L', left+round, height,
            'H', right-round,
            'L', right, height-round
        ];
        if ( black_after ) 
            dark_array.push(
                'V', cut_point,
                'M', right_offset, cut_point-round,
            );
        dark_array.push('V', STROKE_WIDTH/2);
        const dark_border = SvgTools.makePath(dark_array, { class: "key-dark-border" } );

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(dark_border);
        key_group.appendChild(light_border);
        return key_group;
    }

    function drawBlackKey(key, offset, width, height, round) {
        const left = offset + STROKE_WIDTH;
        const right = left + width - (2*STROKE_WIDTH);

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "black-key" });

        const key_fill = SvgTools.makePolygon(
            [
                {x:left, y:0}, 
                {x:right, y:0},
                {x:right, y:height-round},
                {x:right-round, y:height},
                {x:left+round, y:height},
                {x:left, y:height-round}
            ], 
            { class: "key-fill", fill: "var(--color-black-key)" }
        );

        const inset = BLACK_KEY_HIGHLIGHT_INSET;
        const key_highlight = SvgTools.makePolygon(
            [
                {x:left+inset, y:inset}, 
                {x:right-inset, y:inset},
                {x:right-inset, y:height-inset-round},
                {x:right-round-inset, y:height-inset},
                {x:left+inset+round, y:height-inset},
                {x:left+inset, y:height-inset-round}
            ], 
            { class: "key-highlight", fill: 'url("#pressed-black-key-highlight-gradient")'}
        );

        const light_border = SvgTools.makePath([
            'M', right, 0, 
            'H', left,
            'V', height-round-STROKE_WIDTH/2
        ], { class: "key-light-border" });

        const dark_border = SvgTools.makePath([
            'M', right, 0, 
            'V', height-round,
            'L', right-round, height,
            'H', left+round,
            'L', left, height-round
        ], { class: "key-dark-border" });

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(dark_border);
        key_group.appendChild(light_border);
        return key_group;
    }

    let white_left = 0;
    for ( let key = first_key; key <= last_key; key++ ) {
        const note = key % 12;

        if ( WHITE_NOTE[note] ) {
            const white_key = drawWhiteKey(key, note,
                white_left, WHITE_KEY_WIDTH, WHITE_KEY_HEIGHT, KEY_ROUNDING
            );
            white_keys_g.appendChild(white_key);
            keys[key] = white_key;
            width += WHITE_KEY_WIDTH;
            white_left += WHITE_KEY_WIDTH;
        } else {
            const black_left = white_left - BLACK_KEY_WIDTH_HALF + (BK_OFFSETS[note]*BLACK_KEY_WIDTH);
            const black_key = drawBlackKey(key,
                black_left, BLACK_KEY_WIDTH, BLACK_KEY_HEIGHT, KEY_ROUNDING
            );
            keys[key] = black_key;
            black_keys_g.appendChild(black_key);
        }
    }
    svg.appendChild(white_keys_g);
    if ( options.top_felt )
        svg.appendChild(SvgTools.makeRect(width, 6, 0, -3, null, null, { id: "top-felt" }));
    svg.appendChild(black_keys_g);
    svg.setAttribute("viewBox", `-2 -3 ${width+(2*STROKE_WIDTH)} ${(WHITE_KEY_HEIGHT)+(2*STROKE_WIDTH)}`);

    function makeGradient(id, stops, vertical=false, attrs={}) {
        const grad = SvgTools.createElement("linearGradient", 
            vertical ? { id: id, x2: "0%", y2: "100%" } : { id: id });
        for ( const stop_attr of stops )
            grad.appendChild(SvgTools.createElement("stop", stop_attr));
        for ( const [k,v] of Object.entries(attrs) )
            grad.setAttribute(k, v);
        return grad;
    }

    const svg_defs = SvgTools.createElement("defs");
    svg_defs.appendChild(makeGradient("pressed-white-key-highlight-gradient", [
        { offset: "0%", "stop-color": "var(--color-highlight)", "stop-opacity": "50%" },
        { offset: "40%", "stop-color": "var(--color-highlight)" }
    ], true));
    svg_defs.appendChild(makeGradient("pressed-black-key-highlight-gradient", [
        { offset: "0%", "stop-color": "var(--color-highlight)", "stop-opacity": "50%" },
        { offset: "50%", "stop-color": "var(--color-highlight)" }
    ], true));

    if ( options.top_felt )
        svg_defs.appendChild(makeGradient("top-felt-gradient", [
            { offset: "50%", "stop-color": "#920" },
            { offset: "100%", "stop-color": "#610", "stop-opacity": "60%" }
        ], true));

    svg.appendChild(svg_defs);

}


function createKeyboard() {
    const options = {
        height_factor: settings.height_factor,
        top_felt: settings.top_felt
    };
    switch ( settings.number_of_keys ) {
        case 88:
            options.first_key = noteToMidi("a0");
            options.last_key = noteToMidi("c8");
            break;
        case 61:
            options.first_key = noteToMidi("c2");
            options.last_key = noteToMidi("c7");
            break;
        case 49:
            options.first_key = noteToMidi("c2");
            options.last_key = noteToMidi("c6");
            break;
        case 37:
            options.first_key = noteToMidi("c3");
            options.last_key = noteToMidi("c6");
            break;
        case 25:
            options.first_key = noteToMidi("c3");
            options.last_key = noteToMidi("c5");
            break;
        default:
            options.first_key = noteToMidi("e4") - Math.trunc(settings.number_of_keys / 2);
            options.last_key = noteToMidi("e4") + Math.ceil(settings.number_of_keys / 2) - 1;
    }
    drawKeyboard(kbd, options);
    updateKeyboard();
}


function updateKeyboardKeys(first_key=0, last_key=127) {
    for ( let i = first_key; i <= last_key; i++ ) {
        const key = keys[i];
        if ( key ) {
            const j = i-settings.transpose;
            const note_on = Midi.isNoteOn(j, (settings.pedals ? "both" : "none"));
            const key_pressed = Midi.isKeyPressed(j);
            key.classList.toggle("active", note_on);
            key.classList.toggle("pressed", key_pressed);
            key.classList.toggle("dim", settings.pedal_dim && note_on && (!key_pressed));
        }
    }
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
    document.getElementById("menu-top-felt").checked = settings.top_felt;
}


function updatePedalsMenu() {
    document.getElementById("menu-pedal-follow").checked = settings.pedals;
    document.getElementById("menu-pedal-icons").checked = settings.pedal_icons;
    const menu_pedal_dim = document.getElementById("menu-pedal-dim");
    menu_pedal_dim.checked = settings.pedal_dim;
    menu_pedal_dim.toggleAttribute("disabled", !settings.pedals);
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


function updateKeyboard() {
    updateKeyboardPosition();
    updateKeyboardKeys();
}


function updateNote(note) {
    const key = note+settings.transpose;
    if ( key >= 0 && key < 128 )
        updateKeyboardKeys(key, key);
}


function toggleTopBar() {
    settings.top_bar = !settings.top_bar;
    document.getElementById("top-toolbar").toggleAttribute("hidden");
    document.getElementById("btn-show-toolbar").toggleAttribute("hidden");
    // document.getElementById("top-toolbar").style.display =
    //     ( settings.top_bar ) ? "flex" : "none";
}


function midiPanic() {
    Midi.reset();
    createKeyboard();
    updatePedalIcons();
}

/**
 * Sets transposition parameters.
 * @param {Object} params - An object accepting the following properties:
 *     - _reset_ (boolean) - Reset transposition;
 *     - _set_ (boolean) - Set values instead of adding/subtracting;
 *     - _semitones_ - Number of semitones;
 *     - _octaves_ - Number of octaves. 
 */
function transpose(params={}) {
    if ( params.reset ) {
        settings.semitones = 0;
        settings.octaves = 0;
    }
    if ( params.set ) {
        if ( Object.hasOwn(params, "semitones") )
            settings.semitones = params.semitones;
        if ( Object.hasOwn(params, "octaves") )
            settings.octaves = params.octaves;
    } else {
        if ( Object.hasOwn(params, "semitones") )
            settings.semitones += params.semitones;
        if ( Object.hasOwn(params, "octaves") )
            settings.octaves += params.octaves;
    }
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
}


function writeSettings() {
    settings_storage.writeString("color-white", settings.color_white);
    settings_storage.writeString("color-black", settings.color_black);
    settings_storage.writeString("color-pressed", settings.color_pressed);
    settings_storage.writeNumber("height-factor", settings.height_factor);
    settings_storage.writeNumber("number-of-keys", settings.number_of_keys);
    settings_storage.writeBool("pedals", settings.pedals);
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
    settings_storage.writeBool("top-felt", settings.top_felt);
}


function loadSettings() {
    settings.color_white = settings_storage.readString("color-white", settings.color_white);
    settings.color_black = settings_storage.readString("color-black", settings.color_black);
    settings.color_pressed = settings_storage.readString("color-pressed", settings.color_pressed);
    settings.height_factor = settings_storage.readNumber("height-factor", settings.height_factor);
    settings.number_of_keys = settings_storage.readNumber("number-of-keys", settings.number_of_keys);
    settings.pedals = settings_storage.readBool("pedals", settings.pedals);
    settings.pedal_dim = settings_storage.readBool("pedal-dim", settings.pedal_dim);
    settings.pedal_icons = settings_storage.readBool("pedal-icons", settings.pedal_icons);
    settings.offset.x = settings_storage.readNumber("offset-x", settings.offset.x);
    settings.offset.y = settings_storage.readNumber("offset-y", settings.offset.y);
    settings.device_name = settings_storage.readString("device", null);
    settings.semitones = session_storage.readNumber("semitones", 0);
    settings.octaves = session_storage.readNumber("octaves", 0);
    settings.top_felt = settings_storage.readBool("top-felt", settings.top_felt);
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

    if ( !Midi.browserHasMidiSupport ) {
        const msg = document.createElement("div");
        msg.classList.add("menu-msg");
        msg.innerHTML = 
            "Your browser does not support the Web MIDI API.<br />" +
            "Try updating your browser or switching<br />" +
            "to <a href=\"https://www.mozilla.org/firefox/\" target=\"_blank\">Mozilla Firefox</a> " +
            "or <a href=\"https://www.google.com/chrome/\" target=\"_blank\">Google Chrome</a>.";
        menu.appendChild(msg);
        changeLed("connection-power-icon", false);
        return;
    }

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

document.getElementById("menu-top-felt").addEventListener("click", (e) => {
    settings.top_felt = !settings.top_felt;
    createKeyboard();
    writeSettings();
});

document.getElementById("color-white").addEventListener("sl-change", (e) => {
    settings.color_white = e.target.value;
    writeSettings();
});

document.getElementById("color-black").addEventListener("sl-change", (e) => {
    settings.color_black = e.target.value;
    writeSettings();
});

document.getElementById("color-pressed").addEventListener("sl-change", (e) => {
    settings.color_pressed = e.target.value;
    writeSettings();
});

document.getElementById("pedal-menu").addEventListener("sl-select", (e) => {
    const item = e.detail.item;
    switch ( item.id ) {
        case "menu-pedal-follow": settings.pedals = item.checked; break;
        case "menu-pedal-dim": settings.pedal_dim = item.checked; break;
        case "menu-pedal-icons": settings.pedal_icons = item.checked; break;
    }
    document.getElementById("menu-pedal-dim").toggleAttribute(
        "disabled", !settings.pedals);
    updatePedalIcons();
    updateKeyboardKeys();
    writeSettings();
});

document.getElementById("btn-semitone-plus").addEventListener("click", () => {
    transpose({ semitones: +1 });
});

document.getElementById("btn-semitone-minus").addEventListener("click", () => {
    transpose({ semitones: -1 });
});

document.getElementById("btn-octave-plus").addEventListener("click", () => {
    transpose({ octaves: +1 });
});

document.getElementById("btn-octave-minus").addEventListener("click", () => {
    transpose({ octaves: -1 });
});

document.getElementById("reset-transpose").addEventListener("click", () => {
    transpose({ reset: true });
});

document.getElementById("btn-panic").addEventListener("click", midiPanic);
document.getElementById("btn-hide-toolbar").addEventListener("click", toggleTopBar);
document.getElementById("btn-show-toolbar").addEventListener("click", toggleTopBar);

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
    kbd.toggleAttribute("grabbing", true);
    kbd.setPointerCapture(e.pointerId);
}, { capture: true, passive: false });

kbd.addEventListener("pointerup", (e) => {
    if ( drag_state.dragging ) {
        drag_state.dragging = false;
        kbd.toggleAttribute("grabbing", false);
        kbd.releasePointerCapture(e.pointerId);
        updateKeyboardPosition();
        writeSettings();
    }
}, { capture: true, passive: false });

kbd.addEventListener("pointermove", (e) => {
    if ( drag_state.dragging ) {

        const SNAP_THRESHOLD = 0.04;

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

        // Snap vertically
        if ( !e.ctrlKey ) {
            if ( settings.offset.y < SNAP_THRESHOLD ) settings.offset.y = 0.0;
            if ( settings.offset.y > 1-SNAP_THRESHOLD ) settings.offset.y = 1.0;
            if ( Math.abs(0.5-settings.offset.y) < SNAP_THRESHOLD ) settings.offset.y = 0.5;
        }

        updateKeyboardPosition();
    }
}, { capture: false, passive: true });

kbd.addEventListener("wheel", (e) => {
    if ( !drag_state.dragging && !e.ctrlKey ) {
        const max_zoom = kbd_container.clientHeight / kbd.clientHeight;
        let new_zoom = Math.max(1.0, settings.zoom + (e.wheelDeltaY/1000));
        if ( new_zoom > max_zoom ) new_zoom = max_zoom;
        if ( settings.zoom != new_zoom ) {
            settings.zoom = new_zoom;
            const rect = kbd.getBoundingClientRect();
            const relative_x = e.clientX - rect.left
            settings.offset.x = relative_x / rect.width;
            updateKeyboardPosition();
        }
    }
}, { capture: false, passive: false });

var btn_show_toolbar_timeout = null;

kbd_container.addEventListener("pointermove", () => {
    if ( btn_show_toolbar_timeout ) clearTimeout(btn_show_toolbar_timeout);
    const btn_show_toolbar = document.getElementById("btn-show-toolbar");
    btn_show_toolbar.toggleAttribute("visible", true);
    kbd_container.toggleAttribute("cursor-hidden", false);
    kbd.toggleAttribute("cursor-hidden", false);
    btn_show_toolbar_timeout = setTimeout(() => {
        btn_show_toolbar.toggleAttribute("visible", false);
        kbd_container.toggleAttribute("cursor-hidden", true);
        kbd.toggleAttribute("cursor-hidden", true);
        btn_show_toolbar_timeout = null;
    }, 4000);
}, { capture: false, passive: true });


// MIDI events

Midi.onKeyPress   = updateNote;
Midi.onKeyRelease = updateNote;

Midi.onControlChange = (number) => {
    if ( number > 63 && number < 68 ) {
        updateKeyboardKeys();
        updatePedalIcons();
    }
};


// Keyboard events

function handleKeyboardShortcut(e) {
    if ( e.repeating ) return;
    let comb = [];
    if ( e.ctrlKey  ) comb.push("ctrl");
    if ( e.altKey   ) comb.push("alt");
    if ( e.shiftKey ) comb.push("shift");
    comb.push(e.key.toLowerCase());
    const k = comb.join("+");
    switch ( k ) {
        case "f9":
            e.preventDefault();
            toggleTopBar();
            break;
        case "escape":
            e.preventDefault();
            midiPanic();
            break;
        case "+":
        case "shift++":
            e.preventDefault();
            transpose({ semitones: +1 });
            break;
        case "-":
            e.preventDefault();
            transpose({ semitones: -1 });
            break;
        case "pageup":
            e.preventDefault();
            transpose({ octaves: +1 });
            break;
        case "pagedown":
            e.preventDefault();
            transpose({ octaves: -1 });
            break;
    }
}

function enableKeyboardShortcuts() {
    window.addEventListener("keydown", handleKeyboardShortcut);
}


// Auxiliary functions

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
enableKeyboardShortcuts();

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
