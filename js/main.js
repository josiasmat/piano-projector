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

const KBD_HEIGHT = 500;

import SvgTools from "./svgtools.js";
import { Midi, noteToMidi } from "./midi.js";
import { KbdNotes } from "./kbdnotes.js";
import { LocalStorageHandler, SessionStorageHandler } from "./storage-handler.js";
import KbdNav from "./kbdnav.js";


const settings_storage = new LocalStorageHandler("piano-projector");
const session_storage = new SessionStorageHandler("piano-projector-session");

const settings = {
    first_time: true,
    number_of_keys: 88,
    height_factor: 1,
    device_name: null,
    sound: null,
    offset: { x: 0.5, y: 0.5 },
    labels: {
        /** @type {string} "none", "played", "cs", "white", "all" */
        which: "none",
        /** @type {string} "english", "german", "italian", "pc", "midi", "freq" */
        type: "english",
        octave: true,
        get which_badge() {
            return {
                none: "None", played: "Played", cs: "C's", white: "White", all: "All"
            }[this.which];
        },
        get type_badge() {
            return {
                english: "English", german: "German", italian: "Italian",
                pc: "Pitch-class", midi: "MIDI", freq: "Frequency"
            }[this.type];
        }
    },
    zoom: 1.0,
    pedals: true,
    pedal_dim: true,
    perspective: true,
    top_felt: true,
    toolbar: true,
    semitones: 0,
    octaves: 0,
    get transpose() { return this.semitones + (this.octaves*12); },
    get color_highlight() {
        return getComputedStyle(document.documentElement).getPropertyValue("--color-highlight");
    },
    set color_highlight(value) {
        document.documentElement.style.setProperty('--color-highlight', value);
    },
    get color_white() {
        return getComputedStyle(document.documentElement).getPropertyValue("--color-white-key");
    },
    set color_white(value) {
        document.documentElement.style.setProperty('--color-white-key', value);
    },
    get color_black() {
        return getComputedStyle(document.documentElement).getPropertyValue("--color-black-key");
    },
    set color_black(value) {
        document.documentElement.style.setProperty('--color-black-key', value);
    },
    get color_top_felt() {
        return getComputedStyle(document.documentElement).getPropertyValue("--color-felt-top");
    },
    set color_top_felt(value) {
        document.documentElement.style.setProperty('--color-felt-top', value);
    },
    get pc_keyboard_connected() {
        return this.device_name === "pckbd";
    },
}

const midi = {
    /** @type {MIDIInput[]} */
    ports: [],
    /** @returns {HTMLElement[]} */
    get menu_items() {
        return Array.from(
            toolbar.menus.connect
                .querySelectorAll(".menu-connect-item-midi-input"));
    },
    /** @type {MIDIInput?} */
    get connected_port() {
        return Midi.getConnectedPort();
    },
    /** "granted", "denied", "prompt", "unavailable" */
    access: "unavailable",
    /** @param {(string)} callback */
    queryAccess(callback = null) {
        Midi.queryMidiAccess((result) => { 
            this.access = result; 
            callback?.(this.access) 
        });
    },
    /** @param {(boolean)} callback */
    requestAccess(callback = null) {
        Midi.requestMidiAccess( 
            () => { 
                this.access = "granted";
                callback?.(true);
            },
            () => { callback?.(false); }
        );
    },
    /** @param {(MIDIInput[])} callback */
    requestPorts(callback = null) {
        Midi.requestInputPortList(
            (ports) => {
                this.ports = ports;
                callback?.(ports);
            }, () => {
                this.ports = null;
                callback?.(null);
            }
        );
    },
    clearMenuItems() {
        for ( const menu_item of this.menu_items )
            menu_item.remove();
    },
    watchdog_id: null,
    setWatchdog(delay_ms) {
        if ( this.watchdog_id ) clearInterval(this.watchdog_id);
        this.watchdog_id = setInterval(midiWatchdog, delay_ms);
    }
}

const sound = {
    type: "",
    loaded: false,
    led: null,
    audio_ctx: null,
    player: null,
    get loading() {
        return this.type && !this.loaded;
    },
    play(note, vel=100) {
        if ( this.type == "epiano1" ) note += 12;
        else if ( this.type == "harpsi" ) vel = 127;
        this.player?.start({ note: note+settings.transpose, velocity: vel });
    },
    stop(note, force) {
        if ( this.type == "epiano1" ) note += 12;
        if ( force 
             || ( !( Midi.isNoteOn(note, settings.pedals ? "both" : "none") 
                     || KbdNotes.isNoteSustained(note) ) )
                  && !( this.type == "apiano" && note+settings.transpose > 88 ) )
            this.player?.stop(note+settings.transpose);
    },
    stopAll(force) {
        if ( force )
            this.player?.stop();
        else
            for ( let key = 0; key < 128; key++ )
                this.stop(key, false);
    },
    fail_alert: document.getElementById("alert-sound-connection-fail"),
    apiano: null,
    epiano: null,
    versilian: null,
    cache: null,
}

const drag = {
    /** @type {number} 0=off, 1=clicked, 2=started moving.*/
    state: 0,
    origin: { x: 0, y: 0 },
    previous_offset: { x: 0, y: 0 }
}

const touch = {
    enabled: false,
    /** @type {Map<number,Set<number>} */
    points: new Map(),
    /** @param {number?} pointer_id @returns {boolean} */
    started(pointer_id=null) {
        if ( pointer_id !== null )
            return this.points.has(pointer_id);
        else
            return ( this.points.size > 0 );
    },
    /** @param {number} note @returns {boolean} */
    has_note(note) {
        for ( const entry of this.points.values() )
            if ( entry.has(note) ) return true;
        return false;
    },
    /** @param {number} pointer_id @param {Set<number>} notes */
    add(pointer_id, notes) {
        if ( this.points.has(pointer_id) )
            notes = this.points.get(pointer_id).union(notes);
        this.points.set(pointer_id, notes);
        for ( const note of notes.values() ) {
            sound.play(note);
            updateKeyboardKeys(note, note);
        }
    },
    /** @param {number} pointer_id @param {Set<number>} notes */
    change(pointer_id, notes) {
        let changed = false;
        const previous_notes = new Set().union(this.points.get(pointer_id));
        this.points.set(pointer_id, notes);
        for ( const old_note of previous_notes.values() )
            if ( !notes.has(old_note) ) {
                sound.stop(old_note);
                updateKeyboardKeys(old_note, old_note);
                changed = true;
            }
        for ( const new_note of notes.values() )
            if ( !previous_notes.has(new_note) ) {
                sound.play(new_note);
                updateKeyboardKeys(new_note, new_note);
                changed = true;
            }
        return changed;
    },
    /** @param {number} pointer_id */
    remove(pointer_id) {
        const notes = this.points.get(pointer_id);
        this.points.delete(pointer_id);
        for ( const note of notes.values() ) {
            if ( !this.has_note(note) ) sound.stop(note);
            updateKeyboardKeys(note, note);
        }
    },
    reset() {
        this.points.clear();
        sound.stopAll();
    },
    enable() {
        this.enabled = true;
        kbd.style.cursor = "pointer";
    },
    disable() {
        this.reset();
        this.enabled = false;
        kbd.style.removeProperty("cursor");
    },
}


const toolbar = {
    self: document.getElementById("top-toolbar"),
    title: document.getElementById("toolbar-title"),
    dropdowns: {
        connect: document.getElementById("dropdown-connect"),
        sound: document.getElementById("dropdown-sound"),
        transpose: document.getElementById("dropdown-transpose"),
        size: document.getElementById("dropdown-size"),
        colors: document.getElementById("dropdown-colors"),
        labels: document.getElementById("dropdown-labels"),
        pedals: document.getElementById("dropdown-pedals"),
        get all() {
            return [
                this.connect, this.sound, this.transpose,
                this.size, this.colors, this.labels, this.pedals
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
        labels: document.getElementById("btn-labels"),
        pedals: document.getElementById("btn-pedals"),
        panic: document.getElementById("btn-panic"),
        hide_toolbar: document.getElementById("btn-hide-toolbar"),
        show_toolbar: document.getElementById("btn-show-toolbar")
    },
    menus: {
        connect: document.getElementById("midi-connection-menu"),
        sound: document.getElementById("menu-sound"),
        size: document.getElementById("menu-size"),
        labels: {
            top: document.getElementById("menu-labels-top"),
            which: document.getElementById("menu-labels-which"),
            type: document.getElementById("menu-labels-type"),
        },
        pedals: document.getElementById("pedal-menu")
    }
}

const toolbar_condensing_list = [
    { elm: toolbar.title,               action: "hide-elm" },
    { elm: toolbar.dropdowns.sound,     action: "hide-label" },
    { elm: toolbar.dropdowns.connect,   action: "hide-label" },
    { elm: toolbar.dropdowns.pedals,    action: "hide-label" },
    { elm: toolbar.dropdowns.transpose, action: "hide-label" },
    { elm: toolbar.dropdowns.colors,    action: "hide-elm" },
    { elm: toolbar.dropdowns.size,      action: "hide-elm" },
    { elm: toolbar.dropdowns.sound,     action: "hide-elm" },
    { elm: toolbar.dropdowns.labels,    action: "hide-elm" },
    { elm: toolbar.dropdowns.pedals,    action: "hide-elm" },
    { elm: toolbar.buttons.panic,       action: "hide-elm" },
    { elm: toolbar.self,                action: "hide-elm" }
];

const kbd_container = document.getElementById("main-area");
const kbd = document.getElementById("kbd");
/** @type {[SVGElement?]} */
const keys = Array(128).fill(null);
/** @type {[SVGElement?]} */
const key_labels = Array(128).fill(null);


/**
 * @param {SVGElement} svg 
 * @param {Object} options
 */
function drawKeyboard(svg, options = {}) {

    const STROKE_WIDTH = 1.5;
    const BK_OFFSET = 0.13;

    const WHITE_NOTE = [1,0,1,0,1,1,0,1,0,1,0,1];
    const BK_OFFSETS = [,-BK_OFFSET,,+BK_OFFSET,,,-1.4*BK_OFFSET,,0,,+1.4*BK_OFFSET,];

    const height = KBD_HEIGHT;
    const height_factor = options.height_factor ?? 1.0;
    const first_key = options.first_key ?? noteToMidi("a0");
    const last_key = options.last_key ?? noteToMidi("c8");
    const keys_count = last_key - first_key;
    const kbd_center = (first_key + last_key) / 2;

    const white_key_height = height * height_factor;
    const black_key_height = white_key_height * (0.14 * height_factor + 0.51);
    const white_key_width = height * 2.2 / 15.5;
    const black_key_width = height * 1.45 / 15.5;
    const white_key_width_half = white_key_width / 2;
    const black_key_width_half = black_key_width / 2;
    const key_rounding = white_key_width / 20;
    const white_key_highlight_inset = 2;
    const black_key_highlight_inset = 2;

    const top_felt = {
        top: -4,
        height: 7,
        get bottom() { return this.top + this.height }
    }
    
    const white_key_top = top_felt.bottom-1;
    const black_key_top = top_felt.bottom-5;
    const black_key_base_top = top_felt.bottom+1;

    const stroke_width_half = STROKE_WIDTH/2;

    const black_key_bevel = {
        bottom_height: black_key_width/2*(Math.max(height_factor-0.5,0)/2+0.75),
        side_width_bottom: STROKE_WIDTH*4,
        side_width_top: STROKE_WIDTH*2,
        side_width_min: 0,
        side_width_max: 0
    }
    black_key_bevel.side_width_min = Math.min(black_key_bevel.side_width_top,
                                              black_key_bevel.side_width_bottom);
    black_key_bevel.side_width_max = Math.max(black_key_bevel.side_width_top,
                                              black_key_bevel.side_width_bottom);
    svg.innerHTML = "";

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

    function drawWhiteKey(key, note, offset, width, height, round) {
        const left = offset + STROKE_WIDTH;
        const right = left + width - (2*STROKE_WIDTH);
        const cut_point = black_key_height + (2.5*STROKE_WIDTH);

        const black_before = key > first_key && [2,4,7,9,11].includes(note);
        const black_after = key < last_key && [0,2,5,7,9].includes(note);
        const left_offset = left + ( black_before 
            ? black_key_width_half + (black_key_width * BK_OFFSETS[note-1]) + STROKE_WIDTH : 0);
        const right_offset = right - ( black_after 
            ? black_key_width_half - (black_key_width * BK_OFFSETS[note+1]) + STROKE_WIDTH : 0);

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "key white-key", value: key });

        const key_fill = SvgTools.makePolygon([
                {x:left_offset, y:white_key_top}, 
                {x:right_offset, y:white_key_top},
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

        const inset = white_key_highlight_inset;
        const key_highlight = SvgTools.makePolygon([
                {x:left_offset+inset, y:white_key_top-stroke_width_half}, 
                {x:right_offset-inset, y:white_key_top-stroke_width_half},
                black_after ? {x:right_offset-inset, y:cut_point+inset-round-stroke_width_half} : null,
                black_after ? {x:right_offset-inset+round+stroke_width_half, y:cut_point+inset} : null,
                black_after ? {x:right-inset, y:cut_point+inset} : null,
                {x:right-inset, y:height-inset-round+stroke_width_half},
                {x:right-round-inset+stroke_width_half, y:height-inset},
                {x:left+inset+round-stroke_width_half, y:height-inset},
                {x:left+inset, y:height-inset-round+stroke_width_half},
                black_before ? {x:left+inset, y:cut_point+inset} : null,
                black_before ? {x:left_offset+inset-round-stroke_width_half, y:cut_point+inset} : null,
                black_before ? {x:left_offset+inset, y:cut_point+inset-round-stroke_width_half} : null
            ], 
            { class: "key-highlight", fill: 'url("#pressed-white-key-highlight-gradient")' }
        );

        const light_array = ['M', left_offset, white_key_top+stroke_width_half,];
        if ( black_before ) 
            light_array.push(
                'V', cut_point-round,
                'L', left_offset-round, cut_point,
                'H', left
            );
        light_array.push('L', left, height-round-stroke_width_half);
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
        dark_array.push('V', white_key_top+stroke_width_half);
        const dark_border = SvgTools.makePath(dark_array, { class: "key-dark-border" } );

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(dark_border);
        key_group.appendChild(light_border);
        return key_group;
    }

    function computeLateralDisplacement(key) {
        if ( !options.perspective || WHITE_NOTE[key%12] ) return 0;
        // Restrict maximum displacement based on number of keys
        const perspective_factor = (key - kbd_center) / ((88 + keys_count) / 4);
        return perspective_factor * black_key_bevel.side_width_max;
    }

    function drawBlackKey(key, offset, width, height, round) {
        const left = offset + stroke_width_half;
        const right = left + width - STROKE_WIDTH;

        const lateral_displacement = computeLateralDisplacement(key) * 1.5;

        const side_bevel = options.perspective ? {
            left_top: Math.max(0, black_key_bevel.side_width_top + lateral_displacement),
            left_bottom: Math.max(0, black_key_bevel.side_width_bottom + lateral_displacement),
            right_top: Math.max(0, black_key_bevel.side_width_top - lateral_displacement),
            right_bottom: Math.max(0, black_key_bevel.side_width_bottom - lateral_displacement)
        } : {
            left_top: black_key_bevel.side_width_top,
            left_bottom: black_key_bevel.side_width_bottom,
            right_top: black_key_bevel.side_width_top,
            right_bottom: black_key_bevel.side_width_bottom
        };

        const body = options.perspective ? {
            left_top: Math.min(left, left + black_key_bevel.side_width_top + lateral_displacement),
            left_bottom: Math.min(left, left + black_key_bevel.side_width_bottom + lateral_displacement),
            right_top: Math.max(right, right - black_key_bevel.side_width_top + lateral_displacement),
            right_bottom: Math.max(right, right - black_key_bevel.side_width_bottom + lateral_displacement)
        } : {
            left_top: left,
            left_bottom: left,
            right_top: right,
            right_bottom: right
        }

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "key black-key", value: key });

        const key_fill = SvgTools.makePolygon(
            [
                {x:body.left_top, y:black_key_base_top}, 
                {x:body.left_top+side_bevel.left_top, y:black_key_top}, 
                {x:body.right_top-side_bevel.right_top, y:black_key_top},
                {x:body.right_top, y:black_key_base_top},
                {x:body.right_bottom, y:height-black_key_bevel.bottom_height},
                {x:right, y:height-round},
                {x:right-round, y:height},
                {x:left+round, y:height},
                {x:left, y:height-round},
                {x:body.left_bottom, y:height-black_key_bevel.bottom_height}
            ], 
            { class: "key-fill", fill: "var(--color-black-key)" }
        );

        const inset = black_key_highlight_inset;
        const key_highlight = SvgTools.makePolygon(
            [
                {x:body.left_top+inset, y:black_key_base_top}, 
                {x:Math.max(
                        body.left_top+inset,
                        body.left_top+side_bevel.left_top
                    ), y:black_key_top}, 
                {x:Math.min(
                        body.right_top-inset,
                        body.right_top-side_bevel.right_top   
                    ), y:black_key_top },
                {x:body.right_top-inset, y:black_key_base_top},
                {x:body.right_bottom-inset, y:height-inset-black_key_bevel.bottom_height},
                {x:right-inset, y:height-inset-round+stroke_width_half},
                {x:right-round-inset+stroke_width_half, y:height-inset},
                {x:left+inset+round-stroke_width_half, y:height-inset},
                {x:left+inset, y:height-inset-round+stroke_width_half},
                {x:body.left_bottom+inset, y:height-inset-black_key_bevel.bottom_height}
            ], 
            { class: "key-highlight", fill: 'url("#pressed-black-key-highlight-gradient")'}
        );

        const light_border = SvgTools.makePath([
            'M', left+round, height,
            'H', right-round,
            'L', right, height-round,
            'L', right-round, height,
            'L', body.right_bottom-side_bevel.right_bottom, height-black_key_bevel.bottom_height,
            'H', body.left_bottom+side_bevel.left_bottom,
            'Z'
        ], { class: "key-light-border" });

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);

        if ( side_bevel.left_bottom > 0 || side_bevel.left_top > 0 ) {
            const dark_border_left = SvgTools.makePath([
                'M', body.left_top, black_key_base_top,
                'L', body.left_bottom, height-round,
                'L', body.left_bottom+round, height,
                'L', body.left_bottom+side_bevel.left_bottom, height-black_key_bevel.bottom_height,
                'L', body.left_top+side_bevel.left_top, black_key_top,
                'Z'
            ], { class: "key-dark-border" });
            key_group.appendChild(dark_border_left);
        }

        if ( side_bevel.right_bottom > 0 || side_bevel.right_top > 0 ) {
            const dark_border_right = SvgTools.makePath([
                'M', body.right_top, black_key_base_top,
                'L', body.right_bottom, height-round,
                'L', body.right_bottom-round, height,
                'L', body.right_bottom-side_bevel.right_bottom, height-black_key_bevel.bottom_height,
                'L', body.right_top-side_bevel.right_top, black_key_top,
                'Z'
            ], { class: "key-dark-border" });
            key_group.appendChild(dark_border_right);
        }
        
        key_group.appendChild(light_border);
        return key_group;
    }

    function createWhiteKeyLabel(keynum, left) {
        const center = left + white_key_width_half;
        const elm = SvgTools.createElement("text", {
            x: center, y: white_key_height - white_key_width_half,
            id: `keylabel${keynum}`, class: "key-label white-key-label"
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        return elm;
    }

    function createBlackKeyLabel(keynum, left) {
        const center = left + black_key_width_half + computeLateralDisplacement(keynum)/2;
        const elm = SvgTools.createElement("text", {
            x: center, y: black_key_height - white_key_width_half,
            id: `keylabel${keynum}`, class: "key-label black-key-label"
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        elm.appendChild(SvgTools.createElement("tspan", { x: center, dy: "-0.9lh" }));
        elm.appendChild(SvgTools.createElement("tspan", { x: center, dy: "-1.0lh" }));
        return elm;
    }

    let width = 0;
    let white_left = 0;

    for ( let key = first_key; key <= last_key; key++ ) {
        const note = key % 12;

        if ( WHITE_NOTE[note] ) {
            const white_key = drawWhiteKey(key, note,
                white_left, white_key_width, white_key_height, key_rounding
            );
            const white_key_label = createWhiteKeyLabel(key, white_left);
            white_keys_g.appendChild(white_key);
            white_key.appendChild(white_key_label);
            keys[key] = white_key;
            key_labels[key] = white_key_label;
            width += white_key_width;
            white_left += white_key_width;
        } else {
            const black_left = white_left - black_key_width_half + (BK_OFFSETS[note]*black_key_width);
            const black_key = drawBlackKey(key,
                black_left, black_key_width, black_key_height, key_rounding/2
            );
            const black_key_label = createBlackKeyLabel(key, black_left);
            black_keys_g.appendChild(black_key);
            black_key.appendChild(black_key_label);
            keys[key] = black_key;
            key_labels[key] = black_key_label;
        }
    }
    
    svg.appendChild(white_keys_g);
    svg.appendChild(SvgTools.makeRect(
        width, top_felt.height, 0, top_felt.top, null, null, 
        { id: "top-felt" })
    );
    svg.appendChild(black_keys_g);
    svg.setAttribute("viewBox", `-2 -4 ${width+STROKE_WIDTH+2} ${white_key_height+STROKE_WIDTH+4}`);

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
    svg_defs.appendChild(makeGradient("top-felt-gradient", [
        { offset: "50%", "stop-color": "var(--color-felt-top)" },
        { offset: "100%", "stop-color": "var(--color-felt-bottom)" }
    ], true));

    svg.appendChild(svg_defs);

}


function createKeyboard() {
    const options = {
        height_factor: settings.height_factor,
        perspective: settings.perspective,
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
        case 20:
            options.first_key = noteToMidi("f3");
            options.last_key = noteToMidi("c5");
            break;
        default:
            options.first_key = noteToMidi("e4") - Math.trunc(settings.number_of_keys / 2);
            options.last_key = noteToMidi("e4") + Math.ceil(settings.number_of_keys / 2) - 1;
    }
    drawKeyboard(kbd, options);
    updateKeyboardPosition();
    updateKeyboardKeys();
}


function updateKeyboardKeys(first_key=0, last_key=127) {
    for ( let i = first_key; i <= last_key; i++ ) {
        const key = keys[i];
        if ( key ) {
            const j = i-settings.transpose;
            const touched = touch.has_note(i);
            const key_pressed = touched || Midi.isKeyPressed(j) || KbdNotes.isNotePressed(j);
            const note_on = key_pressed 
                            || Midi.isNoteOn(j, (settings.pedals ? "both" : "none"))
                            || KbdNotes.isNoteSustained(j);
            key.classList.toggle("active", note_on);
            key.classList.toggle("pressed", key_pressed);
            key.classList.toggle("dim", settings.pedal_dim && note_on && (!key_pressed));
            updateKeyboardLabel(i, note_on);
        }
    }
    document.getElementById("top-felt").toggleAttribute("hidden", !settings.top_felt);
}


function updateKeyboardLabel(key, is_on) {
    //const OCTAVES_SUP_EN = ['⁻¹','⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
    const OCTAVES_SUB_EN = ['₋₁','₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
    const OCTAVES_SUP_IT = ['⁻²','⁻¹','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰'];
    const OCTAVES_SUB_IT = ['₋₂','₋₁','₁','₂','₃','₄','₅','₆','₇','₈','₉','₁₀'];
    const ENGLISH_NAMES_1 = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
    const ENGLISH_NAMES_2 = [   ,'D♭',   ,'E♭',   ,   ,'G♭',    ,'A♭',   ,'B♭',   ];
    const GERMAN_NAMES_1 = ['C','Ces','D','Des','E','F','Fes','G','Ges','A','Aes','H'];
    const GERMAN_NAMES_2 = [   ,'Dis',   ,'Eis',   ,   ,'Gis',    ,'Ais',   ,'B',   ];
    const ITALIAN_NAMES_1 = ['do','do♯','re','re♯','mi','fa','fa♯','sol','sol♯','la','la♯','si'];
    const ITALIAN_NAMES_2 = [    ,'re♭',    ,'mi♭',    ,    ,'sol♭',     ,'la♭',    ,'si♭',    ];
    const label = key_labels[key];

    if ( label ) {
        const pc = key%12;
        const octave = Math.trunc(key/12);
        const is_white_key = ![0,1,0,1,0,0,1,0,1,0,1,0][pc];
        
        let text = "";
        switch ( settings.labels.type ) {
            case "pc" : 
                text = `${pc}`;
                break;
            case "english": 
                const eng_oct = settings.labels.octave ? OCTAVES_SUB_EN[octave] : '';
                text = ( is_white_key )
                    ? `${ENGLISH_NAMES_1[pc]}${eng_oct}`
                    : `${ENGLISH_NAMES_2[pc]}\n${ENGLISH_NAMES_1[pc]}\n${eng_oct}`;
                break;
            case "german": 
                if ( octave >= 4 ) {
                    const octave_marks = settings.labels.octave ? "’".repeat(octave-4) : '';
                    text = ( is_white_key )
                        ? `${GERMAN_NAMES_1[pc].toLowerCase()}${octave_marks}`
                        : `${GERMAN_NAMES_2[pc].toLowerCase()}\n${GERMAN_NAMES_1[pc].toLowerCase()}`;
                } else {
                    const octave_marks = settings.labels.octave ? ",".repeat(Math.abs(octave-3)) : '';
                    text = ( is_white_key )
                        ? `${GERMAN_NAMES_1[pc]}${octave_marks}`
                        : `${GERMAN_NAMES_2[pc]}\n${GERMAN_NAMES_1[pc]}`;
                }
                break;
            case "italian": 
                const it_oct = settings.labels.octave 
                    ? ( is_white_key ? OCTAVES_SUP_IT[octave-1] : OCTAVES_SUB_IT[octave-1] )
                    : '';
                text = ( is_white_key )
                    ? `${ITALIAN_NAMES_1[pc]}${it_oct}`
                    : `${ITALIAN_NAMES_2[pc]}\n${ITALIAN_NAMES_1[pc]}\n${it_oct}`;
                break;
            case "freq":
                const freq = midiFreq(touch.enabled ? key+settings.transpose : key);
                text = `${freq.toFixed(freq<1000 ? 1 : 0)}`;
                break;
            default: 
                text = `${key}`;
        }
        const lines = text.split('\n');
        for ( const [i,tspan] of Array.from(label.children).entries() )
            tspan.textContent = lines[i] ?? '';

        let visible, temporary; 
        switch ( settings.labels.which ) {
            case "all": 
                visible = true; 
                temporary = false; 
                break;
            case "played": 
                visible = is_on; 
                temporary = true; 
                break;
            case "cs": 
                visible = ( pc == 0 ); 
                temporary = false; 
                break;
            case "white": 
                visible = is_white_key; 
                temporary = false; 
                break;
            default: 
                visible = false; 
                temporary = false; 
        }
        label.classList.toggle("may-change-visibility", temporary);
        label.classList.toggle("fixed-visibility", !temporary);
        label.classList.toggle("visible", visible);
        label.classList.toggle("hidden", !visible);
        label.classList.toggle("rotated", settings.labels.type == "freq");
    }
}


function updatePedalIcons() {
    changeLed("pedr", KbdNotes.isSustainActive() || Midi.sustain_pedal_value / 127);
    changeLed("pedm", Midi.sostenuto_pedal_value / 127);
    changeLed("pedl", Midi.soft_pedal_value / 127);
}


function updateToolbar() {
    changeLed("connection-power-icon", 
        ( settings.pc_keyboard_connected || touch.enabled 
          || ( settings.device_name && Midi.getConnectedPort() )));
    changeLed("transpose-power-icon", ( settings.transpose != 0 ));
    changeLed("sound-power-icon", sound.led, (sound.led == 1 ? "red" : null));
    toolbar.self.toggleAttribute("hidden", !settings.toolbar);
    toolbar.buttons.show_toolbar.toggleAttribute("hidden", settings.toolbar);
    toolbar.dropdowns.pedals.toggleAttribute("hidden", touch.enabled);
    updatePedalIcons();
    updateToolbarBasedOnWidth();
}


function updateToolbarBasedOnWidth() {
    // Reset all to know full width
    for ( const item of toolbar_condensing_list ) {
        if ( item.action == "hide-elm" )
            item.elm.classList.toggle("condensed-toolbar-hidden-elm", false);
        else if ( item.action == "hide-label" )
            item.elm.classList.toggle("condensed-toolbar-hidden-label", false);
    }
    // Try to reduce toolbar elements as needed
    for ( const item of toolbar_condensing_list ) {
        if ( toolbar.self.scrollWidth <= toolbar.self.clientWidth )
            break;
        if ( item.action == "hide-elm" )
            item.elm.classList.toggle("condensed-toolbar-hidden-elm", true);
        else if ( item.action == "hide-label" )
            item.elm.classList.toggle("condensed-toolbar-hidden-label", true);
    }
}


function updateSoundMenu() {
    if ( sound.type && !sound.loaded ) {
        for ( const item of toolbar.menus.sound.querySelectorAll(".menu-sound-item") ) {
            item.toggleAttribute("disabled", !item.hasAttribute("loading"));
            item.checked = false;
        }
    } else {
        for ( const item of toolbar.menus.sound.querySelectorAll(".menu-sound-item") ) {
            item.toggleAttribute("disabled", false);
            item.checked = ( item.value == sound.type && !item.hasAttribute("loading") );
        }
    }
}


function updateSizeMenu() {
    for ( const elm of toolbar.dropdowns.size.querySelectorAll(".btn-number-of-keys") ) {
        const checked = ( parseInt(elm.value) == settings.number_of_keys );
        elm.variant = checked ? "neutral" : null;
    }
    for ( const elm of toolbar.dropdowns.size.querySelectorAll(".btn-key-depth") ) {
        const checked = ( parseFloat(elm.value) == settings.height_factor );
        elm.variant = checked ? "neutral" : null;
    }
}


function updateColorsMenu() {
    document.getElementById("color-white").value = settings.color_white;
    document.getElementById("color-black").value = settings.color_black;
    document.getElementById("color-pressed").value = settings.color_highlight;
    document.getElementById("menu-perspective").checked = settings.perspective;
    document.getElementById("menu-top-felt").checked = settings.top_felt;
}


function updatePedalsMenu() {
    document.getElementById("menu-pedal-follow").checked = settings.pedals;
    const menu_pedal_dim = document.getElementById("menu-pedal-dim");
    menu_pedal_dim.checked = settings.pedal_dim;
    menu_pedal_dim.toggleAttribute("disabled", !settings.pedals);
}


function updateLabelsMenu() {
    for ( const item of toolbar.menus.labels.which.children ) 
        item.checked = ( item.value === settings.labels.which );
    toolbar.menus.labels.which.nextElementSibling.innerText = settings.labels.which_badge;
    for ( const item of toolbar.menus.labels.type.children )
        item.checked = ( item.value === settings.labels.type );
    toolbar.menus.labels.type.nextElementSibling.innerText = settings.labels.type_badge;
    const menu_labels_octave = document.getElementById("menu-item-labels-octave");
    menu_labels_octave.disabled = ["pc","midi","freq"].includes(settings.labels.type);
    menu_labels_octave.checked = settings.labels.octave;
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
    const px = Math.round((kbd_rect.width - cnt_rect.width) * settings.offset.x);
    kbd_container.scroll(px, 0);

    document.getElementById("keyboard-navigator").toggleAttribute("position-top", settings.offset.y > 0.5);
}


function updateNote(note) {
    const key = note+settings.transpose;
    if ( key >= 0 && key < 128 )
        updateKeyboardKeys(key, key);
}


function toggleToolbarVisibility() {
    settings.toolbar = !settings.toolbar;
    updateToolbar();
    updateKeyboardPosition();
    writeSettings();
}


function midiPanic() {
    sound.stopAll(true);
    Midi.reset();
    touch.reset();
    KbdNotes.resetState();
    createKeyboard();
    updatePedalIcons();
    toolbar.buttons.panic.setAttribute("variant", "danger");
    setTimeout(() => { toolbar.buttons.panic.removeAttribute("variant"); }, 1000);
    
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
    const previous_transpose = settings.transpose;
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
            settings.semitones = clamp(settings.semitones+params.semitones, -11, 11);
        if ( Object.hasOwn(params, "octaves") )
            settings.octaves = clamp(settings.octaves+params.octaves, -2, 2);
    }
    if ( previous_transpose != settings.transpose ) 
        sound.stopAll(true);
    updateTransposeMenuAndButton();
    updateKeyboardKeys();
    writeSettings();
}

/** @param {number} value 88, 61, 49, 37 or 25. */
function setNumberOfKeys(value) {
    settings.number_of_keys = value;
    settings.zoom = 1.0;
    updateSizeMenu();
    createKeyboard();
    writeSettings();
}

function switchNumberOfKeys() {
    setNumberOfKeys(nextOf(settings.number_of_keys, [88,61,49,37,25]));
}

/** @param {number} value 1.0, 0.75 or 0.5*/
function setKeyDepth(value) {
    settings.height_factor = value;
    updateSizeMenu();
    createKeyboard();
    writeSettings();
}

function switchKeyDepth() {
    setKeyDepth(nextOf(settings.height_factor, [1.0, 0.75, 0.5]));
}

/** @param {string} value */
function setLabelsWhich(value) {
    settings.labels.which = value;
    updateLabelsMenu();
    updateKeyboardKeys();
    writeSettings();
}

/** @param {string} value */
function setLabelsType(value) {
    settings.labels.type = value;
    updateLabelsMenu();
    updateKeyboardKeys();
    writeSettings();
}

/** @param {boolean} value */
function toggleLabelsOctave(value = undefined) {
    settings.labels.octave = ( value === undefined )
        ? !settings.labels.octave 
        : value;
    updateLabelsMenu();
    updateKeyboardKeys();
    writeSettings();
}

/** @param {boolean} value */
function togglePedalsFollow(value = undefined) {
    settings.pedals = ( value === undefined )
        ? !settings.pedals
        : value;
    updatePedalsMenu();
    updateKeyboardKeys();
    writeSettings();
}

/** @param {boolean} value */
function togglePedalsDim(value = undefined) {
    settings.pedal_dim = ( value === undefined )
        ? !settings.pedal_dim
        : value;
    updatePedalsMenu();
    updateKeyboardKeys();
    writeSettings();
}


function writeSettings() {
    settings_storage.writeBool("first-time", false);
    settings_storage.writeNumber("height-factor", settings.height_factor);
    settings_storage.writeNumber("number-of-keys", settings.number_of_keys);
    settings_storage.writeString("color-pressed", settings.color_highlight);
    settings_storage.writeString("color-white", settings.color_white);
    settings_storage.writeString("color-black", settings.color_black);
    settings_storage.writeString("labels-which", settings.labels.which);
    settings_storage.writeString("labels-type", settings.labels.type);
    settings_storage.writeBool("labels-octave", settings.labels.octave);
    settings_storage.writeBool("perspective", settings.perspective);
    settings_storage.writeBool("top-felt", settings.top_felt);
    settings_storage.writeBool("pedals", settings.pedals);
    settings_storage.writeBool("pedal-dim", settings.pedal_dim);
    settings_storage.writeNumber("offset-y", settings.offset.y);
    if ( settings.device_name ) settings_storage.writeString("device", settings.device_name);
        else settings_storage.remove("device");
    settings_storage.writeString("sound", sound.type);
    session_storage.writeNumber("semitones", settings.semitones);
    session_storage.writeNumber("octaves", settings.octaves);
    session_storage.writeBool("toolbar", settings.toolbar);
}


function loadSettings() {
    settings.first_time = settings_storage.readBool("first-time", true);
    settings.height_factor = settings_storage.readNumber("height-factor", isMobile() ? 0.75 : settings.height_factor);
    settings.number_of_keys = settings_storage.readNumber("number-of-keys", isMobile() ? 20 : settings.number_of_keys);
    settings.color_white = settings_storage.readString("color-white", settings.color_white);
    settings.color_black = settings_storage.readString("color-black", settings.color_black);
    settings.color_highlight = settings_storage.readString("color-pressed", settings.color_highlight);
    settings.labels.which = settings_storage.readString("labels-which", settings.labels.which);
    settings.labels.type = settings_storage.readString("labels-type", settings.labels.type);
    settings.labels.octave = settings_storage.readBool("labels-octave", settings.labels.octave);
    settings.perspective = settings_storage.readBool("perspective", settings.perspective);
    settings.top_felt = settings_storage.readBool("top-felt", settings.top_felt);
    settings.pedals = settings_storage.readBool("pedals", settings.pedals);
    settings.pedal_dim = settings_storage.readBool("pedal-dim", settings.pedal_dim);
    settings.offset.y = settings_storage.readNumber("offset-y", settings.offset.y);
    settings.device_name = settings_storage.readString("device", null);
    settings.sound = settings_storage.readString("sound", "");
    settings.semitones = session_storage.readNumber("semitones", 0);
    settings.octaves = session_storage.readNumber("octaves", 0);
    settings.toolbar = session_storage.readBool("toolbar", settings.toolbar);
}


function changeLed(id, state, color=null) {
    const elm = document.getElementById(id);
    elm.classList.toggle("active", state);
    if ( state && color )
        elm.style.color = color;
    else 
        elm.style.removeProperty("color");
    elm.style.setProperty("--led-intensity", `${state*100}%`);
}


function togglePcKeyboardConnection(value=null) {
    if ( value === null ) 
        value = !settings.pc_keyboard_connected;
    if ( value )
        connectInput("pckbd");
    else
        disconnectInput();
}


function toggleTouchConnection(value=null) {
    if ( value === null ) 
        value = !touch.enabled;
    if ( value )
        connectInput("touch");
    else
        disconnectInput();
}


/** 
 * Connects an input device.
 * @param {string} name - Name of the input device, which can be:
 *      - "pckbd", the computer keyboard,
 *      - name of a MIDI input port.
 * @param {boolean} save - _true_ to call writeSettings() after connection.
 */
function connectInput(name, save=false) {
    Midi.disconnect();
    sound.stopAll();
    switch ( name ) {
        case "pckbd":
            KbdNotes.enable();
            touch.disable();
            settings.device_name = "pckbd";
            updateToolbar();
            updateKeyboardKeys();
            if ( save ) writeSettings();
            break;
        case "touch":
            KbdNotes.disable();
            touch.enable();
            settings.device_name = "touch";
            updateToolbar();
            updateKeyboardKeys();
            if ( save ) writeSettings();
            break;
        default:
            KbdNotes.disable();
            touch.disable();
            settings.device_name = null;
            updateToolbar();
            updateKeyboardKeys();
            Midi.connectByPortName(name, () => {
                settings.device_name = name;
                updateToolbar();
                if ( kbdnav.visible ) kbdnav.replaceStructure(buildKbdNavStructure());
                if ( save ) writeSettings();
            });
    }
}


function disconnectInput(save=false) {
    Midi.disconnect();
    KbdNotes.disable();
    touch.disable();
    settings.device_name = null;
    updateToolbar();
    updateKeyboardKeys();
    if ( save ) writeSettings();
}


function updateConnectionMenu() {
    const menu_divider = toolbar.menus.connect.querySelector("sl-divider");

    document.getElementById("menu-connect-item-midi-denied")
        .toggleAttribute("hidden", midi.access != "denied");
    document.getElementById("menu-connect-item-midi-unavailable")
        .toggleAttribute("hidden", isMobile() || midi.access != "unavailable");
    document.getElementById("menu-connect-item-midi-prompt")
        .toggleAttribute("hidden", midi.access != "prompt");
    menu_divider.toggleAttribute("hidden", 
        (midi.access == "granted" && !midi.ports?.length) 
        || ( isMobile() && midi.access == "unavailable"));

    document.getElementById("menu-connect-item-computer-keyboard")
        .toggleAttribute("checked", settings.pc_keyboard_connected);
    document.getElementById("menu-connect-item-touch")
        .toggleAttribute("checked", touch.enabled);

    if ( midi.access != "granted" ) {
        midi.clearMenuItems();
        return;
    }

    const template = document
        .getElementById("menu-connect-item-midi-port-template");

    // Add menu items for new ports
    for ( const port of midi.ports ?? [] ) {
        if ( !midi.menu_items.some((menu_item) =>
                port.name == menu_item.value,
        ) ) {
            const new_menu_item = cloneTemplate(template, 
                { value: port.name }, port.name
            );
            // menu item click event handler
            new_menu_item.addEventListener("click", (e) => {
                if ( settings.device_name === e.currentTarget.value )
                    disconnectInput(true);
                else
                    connectInput(e.currentTarget.value, true);
            });
            toolbar.menus.connect.insertBefore(new_menu_item, menu_divider);
        }
    }

    // Check/uncheck menu items, and remove obsolete ports
    for ( const menu_item of midi.menu_items ?? [] ) {
        if ( midi.ports.some((port) => menu_item.value == port.name) ) {
            menu_item.toggleAttribute("checked", 
                menu_item.value == midi.connected_port?.name);
        } else{
            menu_item.remove();
        }
    }

}


// Set event listeners

toolbar.dropdowns.connect.addEventListener("sl-show", () => {
    updateConnectionMenu();
    midi.setWatchdog(500);
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
    midi.setWatchdog(2000);
    updateToolbar();
});

toolbar.dropdowns.sound.addEventListener("sl-show", updateSoundMenu);
toolbar.dropdowns.size.addEventListener("sl-show", updateSizeMenu);
toolbar.dropdowns.colors.addEventListener("sl-show", updateColorsMenu);
toolbar.dropdowns.pedals.addEventListener("sl-show", updatePedalsMenu);
toolbar.dropdowns.labels.addEventListener("sl-show", updateLabelsMenu);
toolbar.dropdowns.transpose.addEventListener("sl-show", updateTransposeMenuAndButton);

for ( const dropdown of toolbar.dropdowns.all ) {
    dropdown.addEventListener("sl-show", (e) => {
        e.currentTarget.querySelector("sl-button")
            .setAttribute("variant", "neutral");
    });
    dropdown.addEventListener("sl-hide", (e) => {
        const btn = e.currentTarget.querySelector("sl-button");
        btn.toggleAttribute("variant", false);
        btn.blur();
    });
}


document.getElementById("menu-connect-item-computer-keyboard")
    .addEventListener("click", () => {
        togglePcKeyboardConnection();
        writeSettings();
    });
document.getElementById("menu-connect-item-touch")
    .addEventListener("click", () => {
        toggleTouchConnection();
        writeSettings();
    });


function loadSound(name = null, menu_item = null) {
    sound.stopAll(true);
    if ( !name ) {
        if ( sound.player ) sound.player = null;
        sound.loaded = false;
        sound.led = 0;
        sound.type = "";
        updateToolbar();
    } else if ( sound.type != name ) {
        if ( !menu_item )
            menu_item = toolbar.dropdowns.sound.querySelector(`.menu-sound-item[value="${name}"]`);
        if ( !sound.audio_ctx ) sound.audio_ctx = new AudioContext();
        const sound_params = {
            apiano:  { loader: sound.apiano, options: { volume: 90 } },
            epiano1: { loader: sound.epiano, 
                       options: { instrument: "TX81Z", volume: 127 } },
            epiano2: { loader: sound.epiano, 
                       options: { instrument: "WurlitzerEP200", volume: 70 } },
            epiano3: { loader: sound.epiano, 
                       options: { instrument: "CP80", volume: 70 } },
            harpsi: { loader: sound.versilian, 
                       options: { instrument: "Chordophones/Zithers/Harpsichord, Unk", volume: 100 } },
        }[name];
        sound_params.storage = sound.cache;
        sound.player = new sound_params.loader(sound.audio_ctx, sound_params.options);
        sound.loaded = false;
        sound.led = 1;
        menu_item.toggleAttribute("loading", true);
        sound.type = name;
        updateToolbar();
        const interval = setInterval(() => {
            sound.led = ( sound.led == 0 ? 1 : 0 );
            updateToolbar();
        }, 400);
        const onLoadFinished = (result) => {
            clearInterval(interval);
            sound.loaded = result;
            sound.led = result ? 2 : 0;
            menu_item.toggleAttribute("loading", false);
            updateToolbar(); 
            updateSoundMenu();
        }
        sound.player.load.then(() => { 
            onLoadFinished(true);
            sound.audio_ctx.resume();
            writeSettings();
        }, (reason) => {
            sound.player = null;
            sound.type = '';
            onLoadFinished(false);
            sound.fail_alert.children[1].innerText = `Reason: ${reason}`;
            sound.fail_alert.toast();
        });
    }
}

toolbar.menus.sound.addEventListener("sl-select", (e) => {
    loadSound(e.detail.item.value, e.detail.item);
    writeSettings();
});

toolbar.dropdowns.size.querySelectorAll(".btn-number-of-keys").forEach((item) => {
    item.addEventListener("click", (e) => {
        setNumberOfKeys(parseInt(e.currentTarget.value));
        if ( isMobile() ) toolbar.dropdowns.size.hide();
    });
});

toolbar.dropdowns.size.querySelectorAll(".btn-key-depth").forEach((item) => {
    item.addEventListener("click", (e) => {
        setKeyDepth(parseFloat(e.currentTarget.value));
        if ( isMobile() ) toolbar.dropdowns.size.hide();
    });
});

document.getElementById("menu-perspective").addEventListener("click", () => {
    settings.perspective = !settings.perspective;
    createKeyboard();
    writeSettings();
    if ( isMobile() ) toolbar.dropdowns.colors.hide();
});

document.getElementById("menu-top-felt").addEventListener("click", () => {
    settings.top_felt = !settings.top_felt;
    updateKeyboardKeys();
    writeSettings();
    if ( isMobile() ) toolbar.dropdowns.colors.hide();
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
    settings.color_highlight = e.target.value;
    writeSettings();
});

toolbar.menus.labels.which.addEventListener("sl-select", (e) => {
    setLabelsWhich(e.detail.item.value);
    if ( isMobile() ) toolbar.dropdowns.labels.hide();
});

toolbar.menus.labels.type.addEventListener("sl-select", (e) => {
    setLabelsType(e.detail.item.value);
    if ( isMobile() ) toolbar.dropdowns.labels.hide();
});

toolbar.menus.labels.top.addEventListener("sl-select", (e) => {
    if ( e.detail.item.id === "menu-item-labels-octave" )
        toggleLabelsOctave(e.detail.item.checked);
    if ( isMobile() ) toolbar.dropdowns.labels.hide();
});

toolbar.menus.pedals.addEventListener("sl-select", (e) => {
    const item = e.detail.item;
    switch ( item.id ) {
        case "menu-pedal-follow": settings.pedals = item.checked; break;
        case "menu-pedal-dim": settings.pedal_dim = item.checked; break;
    }
    document.getElementById("menu-pedal-dim").toggleAttribute(
        "disabled", !settings.pedals);
    updatePedalIcons();
    updateKeyboardKeys();
    writeSettings();
    if ( isMobile() ) toolbar.dropdowns.pedals.hide();
});

document.getElementById("btn-semitone-plus").onclick = 
    () => { transpose({ semitones: +1 }) };

document.getElementById("btn-semitone-minus").onclick =
    () => { transpose({ semitones: -1 }) };

document.getElementById("btn-octave-plus").onclick =
    () => { transpose({ octaves: +1 }) };

document.getElementById("btn-octave-minus").onclick =
    () => { transpose({ octaves: -1 }) };

document.getElementById("reset-transpose").onclick = () => {
     transpose({ reset: true }) ;
     if ( isMobile() ) toolbar.dropdowns.transpose.hide();
};

toolbar.buttons.panic.onclick = midiPanic;
toolbar.buttons.hide_toolbar.onclick = toggleToolbarVisibility;
toolbar.buttons.show_toolbar.onclick = toggleToolbarVisibility;

toolbar.title.onclick = 
    () => { document.getElementById("dialog-about").show() };

window.addEventListener("resize", () => {
    updateToolbarBasedOnWidth();
    updateKeyboardPosition();
});
window.addEventListener("keydown", handleKeyDown);
// window.onkeyup = handleKeyUp;


// Keyboard navigator

function buildKbdNavStructure() {
    function populateControlNav() {
        const list = midi.ports.map((p,i) => [
            p.name,
            () => connectInput(p.name, true),
            {checked: ( settings.device_name == p.name )}
        ]);
        list.push([
            "Computer keyboard", 
            () => connectInput("pckbd", true), 
            {checked: settings.pc_keyboard_connected}
        ]);
        list.push([
            "Touch or mouse", 
            () => connectInput("touch", true), 
            {checked: touch.enabled}
        ]);
        return list;
    }
    function getTranspositionStr() {
        if ( !settings.transpose ) return "not transposed";
        const semitones = `${settings.semitones} semitone${settings.semitones != 1 ? 's' : ''}`;
        const octaves = `${settings.octaves} octave${settings.octaves != 1 ? 's' : ''}`;
        return `${semitones}, ${octaves}`;
    }
    function getKeyDepthStr() {
        return settings.height_factor == 1.0 ? "Full" : settings.height_factor == 0.5 ? "1/2" : "3/4";
    }
    return [
        ['', [
            ["&Control", populateControlNav()],
            // ["&Sound", sound.loading ? [["Loading...", null]] : [
            //     ["&Disabled", () => loadSound(''), {checked: (sound.type == '')}],
            //     ["&1. Acoustic piano", () => loadSound('apiano'), {checked: (sound.type == 'apiano')}],
            //     ["&2. Electric piano 1", () => loadSound('epiano1'), {checked: (sound.type == 'epiano1')}],
            //     ["&3. Electric piano 2", () => loadSound('epiano2'), {checked: (sound.type == 'epiano2')}],
            //     ["&4. Electric piano 3", () => loadSound('epiano3'), {checked: (sound.type == 'epiano3')}]
            // ]],
            ["&Transpose", [
                ["[↑] Semitone up", () => transpose({semitones:+1}), {noindex:true, key:'arrowup'}],
                ["[↓] Semitone down", () => transpose({semitones:-1}), {noindex:true, key:'arrowdown'}],
                ["[→] Octave up", () => transpose({octaves:+1}), {noindex:true, key:'arrowright'}],
                ["[←] Octave down", () => transpose({octaves:-1}), {noindex:true, key:'arrowleft'}],
                ["&Reset", () => transpose({reset:true}), {noindex:true}],
                [`State: ${getTranspositionStr()}`, null]
            ]],
            ["&Size", [
                ["&88 keys", () => setNumberOfKeys(88), {noindex: true, checked: (settings.number_of_keys == 88)}],
                ["&61 keys", () => setNumberOfKeys(61), {noindex: true, checked: (settings.number_of_keys == 61)}],
                ["&49 keys", () => setNumberOfKeys(49), {noindex: true, checked: (settings.number_of_keys == 49)}],
                ["&37 keys", () => setNumberOfKeys(37), {noindex: true, checked: (settings.number_of_keys == 37)}],
                ["&25 keys", () => setNumberOfKeys(25), {noindex: true, checked: (settings.number_of_keys == 25)}],
                [`Change key &depth (current: ${getKeyDepthStr()})`, () => switchKeyDepth(), {noindex: true}]
            ]],
            ["&Labels", [
                ["&Which keys", [
                    ["&None", () => setLabelsWhich("none"), {checked: settings.labels.which == "none"}],
                    ["&Played keys", () => setLabelsWhich("played"), {checked: settings.labels.which == "played"}],
                    ["&C-keys", () => setLabelsWhich("cs"), {checked: settings.labels.which == "cs"}],
                    ["&White keys", () => setLabelsWhich("white"), {checked: settings.labels.which == "white"}],
                    ["&All keys", () => setLabelsWhich("all"), {checked: settings.labels.which == "all"}],
                ]],
                ["&Type", [
                    ["&English", () => setLabelsType("english"), {checked: settings.labels.type == "english"}],
                    ["&German", () => setLabelsType("german"), {checked: settings.labels.type == "german"}],
                    ["&Italian", () => setLabelsType("italian"), {checked: settings.labels.type == "italian"}],
                    ["&Pitch-class", () => setLabelsType("pc"), {checked: settings.labels.type == "pc"}],
                    ["&MIDI value", () => setLabelsType("midi"), {checked: settings.labels.type == "midi"}],
                    ["&Frequency", () => setLabelsType("freq"), {checked: settings.labels.type == "freq"}],
                ]],
                ["Show &octave", () => toggleLabelsOctave(), {checked: settings.labels.octave}]
            ]],
            ["&Pedals", [
                ["&Follow pedals", () => togglePedalsFollow(), {checked: settings.pedals}],
                ["&Dim pedalized notes", () => togglePedalsDim(), {checked: settings.pedal_dim}]
            ]],
            ["Panic!", midiPanic],
            [`${settings.toolbar ? "Hide" : "Show"} toolbar [<u>F9</u>]`, toggleToolbarVisibility, {key: "f9"}]
        ]]
    ];
}

const kbdnav = new KbdNav(
    document.getElementById("keyboard-navigator"), 
    buildKbdNavStructure(),
);

kbdnav.onmenuenter = (s) => {
    midi.setWatchdog(( s == "Control" ) ? 500 : 2000);
    kbdnav.replaceStructure(buildKbdNavStructure());
}
kbdnav.onoptionenter = () => kbdnav.replaceStructure(buildKbdNavStructure());
kbdnav.onshow = () => midi.setWatchdog(2000);
kbdnav.onhide = () => midi.setWatchdog(2000);


// Pointer move events

kbd.oncontextmenu = (e) => {
    if ( drag.state > 0 ) e.preventDefault();
    drag.state = 0;
};

kbd.addEventListener("pointerdown", (e) => {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType != "touch" && e.button != 0 || !touch.enabled ) {
        drag.state = 1;
        drag.origin.x = e.screenX;
        drag.origin.y = e.screenY;
        drag.previous_offset.x = settings.offset.x;
        drag.previous_offset.y = settings.offset.y;
        kbd.toggleAttribute("grabbing", true);
        kbd.setPointerCapture(e.pointerId);
    }
}, { capture: true, passive: false });

kbd.addEventListener("pointerup", (e) => {
    if ( e.pointerType != "touch" && drag.state ) {
        drag.state = ( drag.state == 2 && e.button == 2 ) ? 3 : 0;
        kbd.toggleAttribute("grabbing", false);
        kbd.releasePointerCapture(e.pointerId);
        updateKeyboardPosition();
        writeSettings();
    }
}, { capture: true, passive: false });

kbd.addEventListener("pointermove", (e) => {
    if ( e.pointerType != "touch" && drag.state ) {

        const SNAP_THRESHOLD = 0.06;

        const kbd_rect = kbd.getBoundingClientRect();
        const cnt_rect = kbd_container.getBoundingClientRect();

        drag.state = 2;

        // X-axis - scroll container
        const offset_x = e.screenX - drag.origin.x;
        const ratio_x = offset_x / (kbd_rect.width - cnt_rect.width);
        settings.offset.x = clamp(drag.previous_offset.x - ratio_x, 0.0, 1.0);

        // Y-axis - move keyboard (only if not almost maximally zoomed in)
        const max_zoom = kbd_container.clientHeight / kbd.clientHeight;
        if ( settings.zoom < max_zoom - ((max_zoom - 1.0) / 10) ) {
            const offset_y = e.screenY - drag.origin.y;
            const ratio_y = offset_y / (cnt_rect.height - kbd_rect.height);
            settings.offset.y = clamp(drag.previous_offset.y + ratio_y, 0.0, 1.0);
    
            // Snap vertically
            if ( !e.ctrlKey ) {
                if ( settings.offset.y < SNAP_THRESHOLD ) settings.offset.y = 0.0;
                if ( settings.offset.y > 1-SNAP_THRESHOLD ) settings.offset.y = 1.0;
                if ( Math.abs(0.5-settings.offset.y) < SNAP_THRESHOLD ) settings.offset.y = 0.5;
            }
        }

        updateKeyboardPosition();
    }
}, { capture: false, passive: true });

kbd_container.addEventListener("wheel", (e) => {
    e.preventDefault();
    if ( !drag.state && !touch.started() && !e.ctrlKey ) {
        // make zoom out faster than zoom in
        const amount = -e.deltaY / (e.deltaY <= 0 ? 1000 : 500);
        const max_zoom = kbd_container.clientHeight / kbd.clientHeight;
        const new_zoom = clamp(settings.zoom + amount, 1.0, max_zoom);
        if ( settings.zoom != new_zoom ) {
            const kbd_rect = kbd.getBoundingClientRect();
            const cnt_rect = kbd_container.getBoundingClientRect();
            const new_width = Math.round(cnt_rect.width * new_zoom);
            settings.offset.x = 
                (e.clientX - (e.clientX - kbd_rect.left) / kbd_rect.width * new_width - cnt_rect.left) 
                    / (cnt_rect.width - new_width);
            settings.zoom = new_zoom;
        }
        const scroll_amount = e.deltaX / 1000;
        if ( scroll_amount ) {
            settings.offset.x = clamp(settings.offset.x - scroll_amount, 0.0, 1.0);
        }
        updateKeyboardPosition();
    }
}, { capture: false, passive: false });

if ( !isMobile() ) {
    var btn_show_toolbar_timeout = null;
    kbd_container.addEventListener("pointermove", (e) => {
        if ( e.pointerType == "touch" ) return;
        if ( btn_show_toolbar_timeout ) clearTimeout(btn_show_toolbar_timeout);
        toolbar.buttons.show_toolbar.toggleAttribute("visible", true);
        kbd_container.toggleAttribute("cursor-hidden", false);
        kbd.toggleAttribute("cursor-hidden", false);
        btn_show_toolbar_timeout = setTimeout(() => {
            toolbar.buttons.show_toolbar.toggleAttribute("visible", false);
            if ( !touch.enabled ) {
                kbd_container.toggleAttribute("cursor-hidden", true);
                kbd.toggleAttribute("cursor-hidden", true);
            }
        }, 4000);
    }, { capture: false, passive: true });
}


// Pointer & touch control events

/** 
 * @param {number} x
 * @param {number} y
 * @returns {number?}
 */
function findKeyUnderPoint(x, y) {
    const parent = document.elementFromPoint(x, y)?.parentElement;
    return ( parent?.classList.contains("key") )
        ? parseInt(parent.getAttribute("value"))
        : null;
}

/** 
 * @param {number} x
 * @param {number} y
 * @param {number} rx
 * @param {number} ry
 * @param {number} a_deg
 * @returns {Set<number>}
 */
function findKeysUnderArea(x, y, rx, ry, a_deg) {
    const a_rad = degToRad(a_deg);
    const sin_a = Math.sin(a_rad);
    const cos_a = Math.cos(a_rad);

    // For some reason, Safari appears to
    // inflate touch area
    if ( isSafari() ) {
        rx /= 10;
        ry /= 10;
    }

    // Vertices of the major axis
    const [x1,y1] = (rx >= ry)
        ? [x+(rx*cos_a), y+(rx*sin_a)]
        : [x-(ry*sin_a), y+(ry*cos_a)];
    const [x2,y2] = (rx >= ry)
        ? [x-(rx*cos_a), y-(rx*sin_a)]
        : [x+(ry*sin_a), y-(ry*cos_a)];
    // Vertices of the minor axis
    const [x3,y3] = (rx >= ry)
        ? [x-(ry*sin_a), y+(ry*cos_a)]
        : [x+(rx*cos_a), y+(rx*sin_a)];
    const [x4,y4] = (rx >= ry)
        ? [x+(ry*sin_a), y-(ry*cos_a)]
        : [x-(rx*cos_a), y-(rx*sin_a)];

    const k1 = findKeyUnderPoint(x1, y1);
    const k2 = findKeyUnderPoint(x2, y2);
    const k3 = findKeyUnderPoint(x3, y3);
    const k4 = findKeyUnderPoint(x4, y4);
    const keys = new Set([k1,k2,k3,k4]);
    
    const kmin = Math.min(k1,k2,k3,k4);
    const kmax = Math.max(k1,k2,k3,k4);
    const span = kmax-kmin;

    // If vertices are more than one key apart, find
    // other keys intersected by the axis
    if ( span > 1 ) {
        const [xmin,ymin] = (kmin == k1) ? [x1,y1] : 
                            (kmin == k2) ? [x2,y2] : 
                            (kmin == k3) ? [x3,y3] : 
                                           [x4,y4];
        const [xmax,ymax] = (kmax == k1) ? [x1,y1] : 
                            (kmax == k2) ? [x2,y2] : 
                            (kmax == k3) ? [x3,y3] : 
                                           [x4,y4];
        const step_x = (xmax - xmin) / span;
        const step_y = (ymax - ymin) / span;
        for ( let n = 0.5; n < span; n += 0.5 ) {
            const [xn,yn] = [xmin+(step_x*n), ymin+(step_y*n)];
            const kn = findKeyUnderPoint(xn, yn);
            keys.add(kn);
        }
    }
    return keys;
}

/** @param {PointerEvent} e */
function handlePianoPointerDown(e) {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType != "touch" && touch.enabled 
         && e.button === 0 && !touch.started(e.pointerId)) {
        const note = findKeyUnderPoint(e.clientX, e.clientY);
        if ( note ) { 
            e.preventDefault();
            touch.add(e.pointerId, new Set([note]));
        }
    }
}

/** @param {PointerEvent} e */
function handlePianoPointerUp(e) {
    if ( e.pointerType != "touch" && touch.started(e.pointerId) && e.button === 0 ) {
        touch.remove(e.pointerId);
        e.preventDefault();
    }
}

/** @param {PointerEvent} e */
function handlePianoPointerMove(e) {
    if ( e.pointerType != "touch" && touch.started(e.pointerId) ) {
        e.preventDefault();
        const note = findKeyUnderPoint(e.clientX, e.clientY);
        touch.change(e.pointerId, new Set([note]));
    }
}

/** @param {TouchEvent} e */
function handlePianoTouchStart(e) {
    if ( touch.enabled ) {
        for ( const t of e.changedTouches )
            if ( !touch.started(t.identifier) ) {
                const notes = findKeysUnderArea(
                    t.clientX, t.clientY, t.radiusX, t.radiusY, t.rotationAngle
                );
                if ( notes.size ) {
                    touch.add(t.identifier, notes);
                    navigator.vibrate(50);
                    e.preventDefault();
                }
            }
    }
}

/** @param {TouchEvent} e */
function handlePianoTouchEnd(e) {
    for ( const t of e.changedTouches )
        if ( touch.started(t.identifier) ) {
            touch.remove(t.identifier);
            e.preventDefault();
        }
}

/** @param {TouchEvent} e */
function handlePianoTouchMove(e) {
    for ( const t of e.changedTouches )
        if ( touch.started(t.identifier) ) {
            e.preventDefault();
            const notes = findKeysUnderArea(
                t.clientX, t.clientY, t.radiusX, t.radiusY, t.rotationAngle
            );
            touch.change(t.identifier, notes) 
                && navigator.vibrate(50);
        }
}


kbd.addEventListener("pointerdown", handlePianoPointerDown, { capture: true, passive: false });
kbd.addEventListener("touchstart", handlePianoTouchStart, { capture: true, passive: false });
window.addEventListener("pointerup", handlePianoPointerUp, { capture: false, passive: false });
window.addEventListener("pointercancel", handlePianoPointerUp, { capture: false, passive: false });
window.addEventListener("touchend", handlePianoTouchEnd, { capture: false, passive: false });
window.addEventListener("touchcancel", handlePianoTouchEnd, { capture: false, passive: false });
window.addEventListener("pointermove", handlePianoPointerMove, { capture: false, passive: false });
window.addEventListener("touchmove", handlePianoTouchMove, { capture: false, passive: false });


// MIDI events

/** @param {number} key @param {number} vel */
function handleKeyPress(key, vel) {
    updateNote(key);
    sound.play(key, vel);
}

/** @param {number} key @param {number} vel  @param {number} duration */
function handleKeyRelease(key, vel, duration) {
    const MIN_HIGHLIGHT_TIME = 100;
    if ( duration && duration < MIN_HIGHLIGHT_TIME )
        setTimeout(() => updateNote(key), MIN_HIGHLIGHT_TIME - duration);
    else
        updateNote(key);
    sound.stop(key, false);
}

function handleSustainChange() {
    updateKeyboardKeys();
    sound.stopAll(false);
    updatePedalIcons();
}

function handleControlChange(num) {
    if ( num > 63 && num < 68 ) {
        updateKeyboardKeys();
        sound.stopAll(false);
        updatePedalIcons();
    }
}

function handleResetMsg() {
    updateKeyboardKeys();
    sound.stopAll(true);
    updatePedalIcons();
}

Midi.onConnectionChange = () => {
    updateKeyboardKeys();
    updateToolbar();
}

Midi.onKeyPress = handleKeyPress;
Midi.onKeyRelease = handleKeyRelease;
Midi.onControlChange = handleControlChange;

KbdNotes.onKeyPress = handleKeyPress;
KbdNotes.onKeyRelease = handleKeyRelease;
KbdNotes.onSustain = handleSustainChange;
KbdNotes.onReset = handleResetMsg;


// MIDI watchdog

function midiWatchdog() {
    const dropdown_connect_open = toolbar.dropdowns.connect.open;
    midi.queryAccess((access) => {
        if ( access == "granted" ) {
            if ( kbdnav.visible ) kbdnav.replaceStructure(buildKbdNavStructure());
            midi.requestPorts( (ports) => {
                midi.ports = ports;
                if ( settings.device_name 
                        && settings.device_name != "pckbd" 
                        && settings.device_name != "touch" 
                ) {
                    const connected_port = Midi.getConnectedPort();
                    if ( !connected_port ) {
                        const reconnected_port = 
                            ports.find((p) => p.name == settings.device_name);
                        if ( reconnected_port )
                            Midi.connect(reconnected_port, () => {
                                updateToolbar();
                                if ( dropdown_connect_open ) 
                                    updateConnectionMenu();
                            });
                    }
                    updateToolbar();
                }
                if ( dropdown_connect_open ) updateConnectionMenu();
            });
        } else {
            Midi.disconnect();
            updateToolbar();
            if ( dropdown_connect_open ) updateConnectionMenu();
        }
    });
}


// Keyboard events

/** @param {KeyboardEvent} e */
function handleKeyDown(e) {
    if ( e.repeat ) return;
    if ( e.key == "Alt" ) {
        const open_dropdown = toolbar.dropdowns.getOpen();
        if ( open_dropdown ) {
            open_dropdown.hide();
            open_dropdown.querySelector("sl-button[slot=trigger]").blur();
        }
    }

    const kbd_shortcuts = new Map([
        ["f9", toggleToolbarVisibility],
        ["escape", () => { 
            const open_dropdown = toolbar.dropdowns.getOpen();
            if ( open_dropdown ) {
                open_dropdown.hide();
                open_dropdown.querySelector("sl-button[slot=trigger]").blur();
            } else
                midiPanic();
        }],
        ["pageup", () => transpose({ semitones: +1 })],
        ["pagedown", () => transpose({ semitones: -1 })],
        ["shift+pageup", () => transpose({ octaves: +1 })],
        ["shift+pagedown", () => transpose({ octaves: -1 })],
    ]);

    let comb = [];
    if ( e.ctrlKey  ) comb.push("ctrl");
    if ( e.altKey   ) comb.push("alt");
    if ( e.shiftKey ) comb.push("shift");
    comb.push(e.key.toLowerCase());
    const k = comb.join("+");
    if ( kbd_shortcuts.has(k) ) {
        e.preventDefault();
        kbd_shortcuts.get(k)();
    }
}


// Auxiliary functions

/** 
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
    return (value < min) ? min : ( (value > max) ? max : value );
}

/** 
 * @param {number} value
 * @param {number} div
 * @param {boolean} allow_negative
 * @returns {number}
 */
function mod(value, div, allow_negative=true) {
    return (allow_negative || value >= 0) ? value%div : (value%div)+div;
}

/**
 * Creates a new HTML element.
 * @param {string} type - Tag name
 * @param {object} attrs 
 * @returns {HTMLElement}
 */
function newElement(type, attrs={}, inner_text=null) {
    const elm = document.createElement(type);
    for ( const [key,val] of Object.entries(attrs) ) {
        if ( typeof(val) === "boolean" )
            elm.toggleAttribute(key, val);
        else
            elm.setAttribute(key, val);
    }
    if ( inner_text )
        elm.innerText = inner_text;
    return elm;
}


/**
 * Clones an HTML element.
 * @param {HTMLElement} template
 * @param {object} attrs 
 * @returns {HTMLElement}
 */
function cloneTemplate(template, attrs={}, inner_text=null) {
    const cloned = template.cloneNode(true).content.children[0];
    for ( const [key,val] of Object.entries(attrs) ) {
        if ( typeof(val) === "boolean" )
            cloned.toggleAttribute(key, val);
        else
            cloned.setAttribute(key, val);
    }
    if ( inner_text !== null )
        cloned.children[0].innerText = inner_text;
    return cloned;
}


/** @returns {boolean} */
function isMobile() {
    if ( !!navigator.userAgentData ) 
        return navigator.userAgentData.mobile;
    else
        return ( /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) );
}


/** @returns {boolean} */
function isSafari() {
    return ( /^((?!chrome|android).)*safari/i.test(navigator.userAgent) );
}


/**
 * Converts a MIDI note number to frequency.
 * @param {number} midi_note 
 * @returns {number}
 */
function midiFreq(midi_note) {
    const n = midi_note - 69; // Distance from A4
    return 2**(n/12)*440;
}


/**
 * Returns the value that comes after a given value in an array. If the value
 * doesn't exist in the array, returns the first one.
 * @param {any} value 
 * @param {Array} array 
 * @returns {any}
 */
function nextOf(value, array) {
    let i = array.indexOf(value) + 1;
    if ( i == array.length ) i = 0;
    return array[i];
}


/**
 * Convert an angle in degrees to radians.
 * @param {Number} deg 
 * @returns {Number}
 */
function degToRad(deg) {
    return deg*(Math.PI/180);
}


// Initialize

loadSettings();

window.addEventListener("load", () => {
    updateKeyboardPosition();
    // Sometimes the window.load event fires too early
    setTimeout(() => { updateKeyboardPosition() }, 500);
});

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

if ( isMobile() ) {
    document.documentElement.classList.add("mobile");
    toolbar.buttons.show_toolbar.classList.add("mobile");
    // Disable tooltips
    toolbar.buttons.panic.parentElement.toggleAttribute("disabled", true);
    toolbar.buttons.hide_toolbar.parentElement.toggleAttribute("disabled", true);
    toolbar.buttons.show_toolbar.parentElement.toggleAttribute("disabled", true);
    toolbar.menus.size.querySelector('.btn-number-of-keys[value="20"]').toggleAttribute("hidden", false);
}

if ( isSafari() ) {
    // For now, disable sound button on Safari browser
    toolbar.dropdowns.sound.toggleAttribute("hidden", true);
} else {
    // Dynamically import smplr module
    import("https://unpkg.com/smplr@0.16.1/dist/index.mjs")
        .then( (result) => {
            sound.cache = new result.CacheStorage("sound_v1");
            sound.apiano = result.SplendidGrandPiano;
            sound.epiano = result.ElectricPiano;
            sound.versilian = result.Versilian;
            document.getElementById("menu-sound-item-unavailable").hidden = true;
            toolbar.menus.sound.querySelectorAll(".menu-sound-item")
                .forEach((item) => { item.hidden = false });
            if ( isMobile() && settings.sound ) loadSound(settings.sound);
        });
}

if ( !settings.device_name ) {
    const connect_tooltip = document.getElementById("dropdown-connect-tooltip");
    if ( isMobile() ) {
        connectInput("touch", true);
        connect_tooltip.setAttribute("content", 
            "Play your keyboard using your fingers! " +
            "Or change the input device by tapping this button."
        );
    } else {
        connect_tooltip.setAttribute("content", 
            "Click on this button to select an input device."
        );
    }
    connect_tooltip.open = true;
    window.onclick = () => {
        connect_tooltip.open = false;
        window.onclick = null;
    }
} else {
    if ( ["pckbd","touch"].includes(settings.device_name) )
        connectInput(settings.device_name)
    else
        midi.queryAccess((access) => {
            if ( access == "granted" )
                connectInput(settings.device_name);
        });
}

midiWatchdog();
midi.setWatchdog(2000);
