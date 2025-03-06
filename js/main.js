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
import { KbdNotes} from "./kbdnotes.js";
import { LocalStorageHandler, SessionStorageHandler } from "./storage-handler.js";

const settings_storage = new LocalStorageHandler("piano-projector");
const session_storage = new SessionStorageHandler("piano-projector-session");

const settings = {
    first_time: true,
    number_of_keys: 88,
    height_factor: 1,
    device_name: null,
    offset: { x: 0.5, y: 0.5 },
    labels: {
        /** @type {string} "none", "played", "cs", "white", "all" */
        where: "none",
        /** @type {string} "english", "german", "italian", "pc", "midi" */
        type: "english",
        octave: true,
        get where_badge() {
            return {
                none: "None", played: "Played", cs: "C's", white: "White", all: "All"
            }[this.where];
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
    get pc_keyboard_connected() {
        return this.device_name === "pckbd";
    },
}

const midi_state = {
    /** @type {MIDIInput[]} */
    ports: [],
    /** @returns {HTMLElement[]} */
    get menu_items() {
        return Array.from(
            toolbar.dropdowns.connect
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
    play(note, vel=100) {
        this.player?.start({ note: note+settings.transpose, velocity: vel });
    },
    stop(note, force) {
        if ( force 
             || !( Midi.isNoteOn(note, settings.pedals ? "both" : "none") 
                   || KbdNotes.isNoteSustained(note) ) )
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
    epiano: null
}

const drag = {
    /** @type {number} 0=off, 1=clicked, 2=started moving.*/
    state: 0,
    origin: { x: 0, y: 0 },
    previous_offset: { x: 0, y: 0 }
}

const touch = {
    enabled: false,
    /** @type {Map<number,number>} */
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
        for ( const entry of this.points )
            if ( entry[1] == note ) return true;
        return false;
    },
    /** @param {number} pointer_id @param {number} note */
    add(pointer_id, note) {
        this.points.set(pointer_id, note);
        sound.play(note);
        updateKeyboardKeys(note, note);
    },
    /** @param {number} pointer_id @param {number} note */
    change(pointer_id, note) {
        const previous_note = this.points.get(pointer_id);
        if ( note != previous_note ) {
            this.points.set(pointer_id, note);
            if ( previous_note ) sound.stop(previous_note);
            if ( note ) sound.play(note);
        }
        updateKeyboardKeys(previous_note, previous_note);
        updateKeyboardKeys(note, note);
    },
    /** @param {number} pointer_id @param {number} key */
    remove(pointer_id) {
        const note = this.points.get(pointer_id);
        this.points.delete(pointer_id);
        if ( !this.has_note(note) ) sound.stop(note);
        updateKeyboardKeys(note, note);
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
        panic: document.getElementById("btn-panic"),
        hide_toolbar: document.getElementById("btn-hide-toolbar"),
        show_toolbar: document.getElementById("btn-show-toolbar")
    }
}


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

    const white_key_height = height * height_factor;
    const black_key_height = white_key_height * (0.14 * height_factor + 0.51);
    const white_key_width = height * 2.2 / 15.5;
    const black_key_width = height * 1.45 / 15.5;
    const white_key_width_half = white_key_width / 2;
    const black_key_width_half = black_key_width / 2;
    const key_rounding = white_key_width / 20;
    const white_key_highlight_inset = 2;
    const black_key_highlight_inset = 1;

    svg.innerHTML = "";

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

    function drawWhiteKey(key, note, offset, width, height, round) {
        const left = offset + STROKE_WIDTH;
        const right = left + width - (2*STROKE_WIDTH);
        const cut_point = black_key_height + (3*STROKE_WIDTH);

        const black_before = key > first_key && [2,4,7,9,11].includes(note);
        const black_after = key < last_key && [0,2,5,7,9].includes(note);
        const left_offset = left + ( black_before 
            ? black_key_width_half + (black_key_width * BK_OFFSETS[note-1]) + STROKE_WIDTH : 0);
        const right_offset = right - ( black_after 
            ? black_key_width_half - (black_key_width * BK_OFFSETS[note+1]) + STROKE_WIDTH : 0);

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "key white-key", value: key });

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

        const inset = white_key_highlight_inset;
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

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "key black-key", value: key });

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

        const inset = black_key_highlight_inset;
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
        const center = left + black_key_width_half;
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
                black_left, black_key_width, black_key_height, key_rounding
            );
            const black_key_label = createBlackKeyLabel(key, black_left);
            black_keys_g.appendChild(black_key);
            black_key.appendChild(black_key_label);
            keys[key] = black_key;
            key_labels[key] = black_key_label;
        }
    }
    
    svg.appendChild(white_keys_g);
    if ( options.top_felt )
        svg.appendChild(SvgTools.makeRect(width, 7, 0, -4, null, null, { id: "top-felt" }));
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

    if ( options.top_felt )
        svg_defs.appendChild(makeGradient("top-felt-gradient", [
            { offset: "50%", "stop-color": "#920" },
            { offset: "100%", "stop-color": "#400", "stop-opacity": "70%" }
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
        switch ( settings.labels.where ) {
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
    changeLed("pedr", KbdNotes.isSustainActive() 
                        || Midi.getLastControlValue(64) / 127);
    changeLed("pedm", Midi.getLastControlValue(66) / 127);
    changeLed("pedl", Midi.getLastControlValue(67) / 127);
}


function updateToolbar() {
    changeLed("connection-power-icon", 
        ( settings.pc_keyboard_connected || touch.enabled 
          || ( settings.device_name && Midi.getConnectedPort() )));
    changeLed("transpose-power-icon", ( settings.transpose != 0 ));
    changeLed("sound-power-icon", sound.led, (sound.led == 1 ? "red" : null));
    document.getElementById("top-toolbar").toggleAttribute("hidden", !settings.toolbar);
    toolbar.buttons.show_toolbar.toggleAttribute("hidden", settings.toolbar);
    toolbar.dropdowns.pedals.toggleAttribute("hidden", touch.enabled);
    updatePedalIcons();
}


function updateSoundMenu() {
    if ( sound.type && !sound.loaded ) {
        for ( const item of toolbar.dropdowns.sound.querySelectorAll(".menu-sound-item") ) {
            item.toggleAttribute("disabled", !item.hasAttribute("loading"));
            item.checked = false;
        }
    } else {
        for ( const item of toolbar.dropdowns.sound.querySelectorAll(".menu-sound-item") ) {
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
    document.getElementById("menu-top-felt").checked = settings.top_felt;
}


function updatePedalsMenu() {
    document.getElementById("menu-pedal-follow").checked = settings.pedals;
    const menu_pedal_dim = document.getElementById("menu-pedal-dim");
    menu_pedal_dim.checked = settings.pedal_dim;
    menu_pedal_dim.toggleAttribute("disabled", !settings.pedals);
}


function updateLabelsMenu() {
    const menu_labels_where = document.getElementById("menu-labels-where");
    for ( const item of menu_labels_where.children ) 
        item.checked = ( item.value === settings.labels.where );
    menu_labels_where.nextElementSibling.innerText = settings.labels.where_badge;
    const menu_labels_type = document.getElementById("menu-labels-type");
    for ( const item of menu_labels_type.children )
        item.checked = ( item.value === settings.labels.type );
    menu_labels_type.nextElementSibling.innerText = settings.labels.type_badge;
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
            settings.semitones += params.semitones;
        if ( Object.hasOwn(params, "octaves") )
            settings.octaves += params.octaves;
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
function setLabelsWhere(value) {
    settings.labels.where = value;
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
function setLabelsOctave(value) {
    settings.labels.octave = value;
    updateLabelsMenu();
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
    settings_storage.writeString("labels-where", settings.labels.where);
    settings_storage.writeString("labels-type", settings.labels.type);
    settings_storage.writeBool("top-felt", settings.top_felt);
    settings_storage.writeBool("pedals", settings.pedals);
    settings_storage.writeBool("pedal-dim", settings.pedal_dim);
    settings_storage.writeNumber("offset-y", settings.offset.y);
    if ( settings.device_name ) settings_storage.writeString("device", settings.device_name);
        else settings_storage.remove("device");
    session_storage.writeNumber("semitones", settings.semitones);
    session_storage.writeNumber("octaves", settings.octaves);
    session_storage.writeBool("toolbar", settings.toolbar);
}


function loadSettings() {
    settings.first_time = settings_storage.readBool("first-time", true);
    settings.height_factor = settings_storage.readNumber("height-factor", isMobile() ? 0.75 : settings.height_factor);
    settings.number_of_keys = settings_storage.readNumber("number-of-keys", isMobile() ? 25 : settings.number_of_keys);
    settings.color_white = settings_storage.readString("color-white", settings.color_white);
    settings.color_black = settings_storage.readString("color-black", settings.color_black);
    settings.color_highlight = settings_storage.readString("color-pressed", settings.color_highlight);
    settings.labels.where = settings_storage.readString("labels-where", settings.labels.where);
    settings.labels.type = settings_storage.readString("labels-type", settings.labels.type);
    settings.top_felt = settings_storage.readBool("top-felt", settings.top_felt);
    settings.pedals = settings_storage.readBool("pedals", settings.pedals);
    settings.pedal_dim = settings_storage.readBool("pedal-dim", settings.pedal_dim);
    settings.offset.y = settings_storage.readNumber("offset-y", settings.offset.y);
    settings.device_name = settings_storage.readString("device", null);
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
    const connection_menu = document.getElementById("midi-connection-menu");
    const menu_divider = connection_menu.querySelector("sl-divider");

    document.getElementById("menu-connect-item-midi-denied")
        .toggleAttribute("hidden", midi_state.access != "denied");
    document.getElementById("menu-connect-item-midi-unavailable")
        .toggleAttribute("hidden", midi_state.access != "unavailable");
    document.getElementById("menu-connect-item-midi-prompt")
        .toggleAttribute("hidden", midi_state.access != "prompt");
    menu_divider
        .toggleAttribute("hidden", !(midi_state.ports?.length));

    if ( midi_state.access != "granted" ) {
        midi_state.clearMenuItems();
        return;
    }

    const template = document
        .getElementById("menu-connect-item-midi-port-template");

    // Add menu items for new ports
    for ( const port of midi_state.ports ) {
        if ( !midi_state.menu_items.some((menu_item) =>
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
            connection_menu.insertBefore(new_menu_item, menu_divider);
        }
    }

    // Check/uncheck menu items, and remove obsolete ports
    for ( const menu_item of midi_state.menu_items ) {
        if ( midi_state.ports.some((port) => menu_item.value == port.name) ) {
            menu_item.toggleAttribute("checked", 
                menu_item.value == midi_state.connected_port?.name);
        } else{
            menu_item.remove();
        }
    }

    document.getElementById("menu-connect-item-computer-keyboard")
        .toggleAttribute("checked", settings.pc_keyboard_connected);
    document.getElementById("menu-connect-item-touch")
        .toggleAttribute("checked", touch.enabled);
}


// Set event listeners

toolbar.dropdowns.connect.addEventListener("sl-show", () => {
    midi_state.setWatchdog(500);
    midi_state.queryAccess((access) => {
        if ( access != "granted" )
            updateConnectionMenu();
        if ( ["granted", "prompt"].includes(access) )
            midi_state.requestAccess((result) => {
                updateConnectionMenu();
                if ( result )
                    midi_state.requestPorts(updateConnectionMenu);
            });
    });
});

toolbar.dropdowns.connect.addEventListener("sl-hide", () => {
    midi_state.setWatchdog(2000);
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
        e.currentTarget.querySelector("sl-button")
            .toggleAttribute("variant", false);
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
            apiano:  { loader: sound.apiano, 
                       options: { volume: 90 } },
            epiano1: { loader: sound.epiano, 
                       options: { instrument: "TX81Z", volume: 127 } },
            epiano2: { loader: sound.epiano, 
                       options: { instrument: "WurlitzerEP200", volume: 70 } },
            epiano3: { loader: sound.epiano, 
                       options: { instrument: "CP80", volume: 70 } },
        };
        sound.player = new sound_params[name].loader(sound.audio_ctx, sound_params[name].options);
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
            if ( !result ) {
                sound.player = null;
                sound.type = "";
            }
            sound.loaded = result;
            sound.led = result ? 2 : 0;
            menu_item.toggleAttribute("loading", false);
            updateToolbar(); 
            updateSoundMenu();
        }
        sound.player.load.then(() => { 
            onLoadFinished(true);
        }, (reason) => {
            onLoadFinished(false);
            sound.fail_alert.children[1].innerText = `Reason: ${reason}`;
            sound.fail_alert.toast();
        });
    }
}

document.getElementById("menu-sound").addEventListener("sl-select", (e) => {
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

document.getElementById("menu-top-felt").addEventListener("click", () => {
    settings.top_felt = !settings.top_felt;
    createKeyboard();
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

document.getElementById("menu-labels-where").addEventListener("sl-select", (e) => {
    setLabelsWhere(e.detail.item.value);
    if ( isMobile() ) toolbar.dropdowns.labels.hide();
});

document.getElementById("menu-labels-type").addEventListener("sl-select", (e) => {
    setLabelsType(e.detail.item.value);
    if ( isMobile() ) toolbar.dropdowns.labels.hide();
});

document.getElementById("menu-labels-top").addEventListener("sl-select", (e) => {
    if ( e.detail.item.id === "menu-item-labels-octave" )
        setLabelsOctave(e.detail.item.checked);
    if ( isMobile() ) toolbar.dropdowns.labels.hide();
});

document.getElementById("pedal-menu").addEventListener("sl-select", (e) => {
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

document.getElementById("toolbar-title").onclick = 
    () => { document.getElementById("dialog-about").show() };

window.onresize = updateKeyboardPosition;
window.onkeydown = handleKeyDown;


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
            kbd_container.toggleAttribute("cursor-hidden", true);
            kbd.toggleAttribute("cursor-hidden", true);
            btn_show_toolbar_timeout = null;
        }, 4000);
    }, { capture: false, passive: true });
}


// Pointer & touch control events

function findKeyUnderPoint(x, y) {
    const parent = document.elementFromPoint(x, y)?.parentElement;
    return ( parent?.classList.contains("key") )
        ? parseInt(parent.getAttribute("value"))
        : null;
}

/** @param {PointerEvent} e */
function handleKbdPointerDown(e) {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType != "touch" && touch.enabled 
         && e.button === 0 && !touch.started(e.pointerId)) {
        const note = findKeyUnderPoint(e.clientX, e.clientY);
        if ( note ) { 
            e.preventDefault();
            touch.add(e.pointerId, note);
        }
    }
}

/** @param {PointerEvent} e */
function handleKbdPointerUp(e) {
    if ( e.pointerType != "touch" && touch.started(e.pointerId) && e.button === 0 )
        touch.remove(e.pointerId);
}

/** @param {PointerEvent} e */
function handleKbdPointerMove(e) {
    if ( e.pointerType != "touch" && touch.started(e.pointerId) ) {
        e.preventDefault();
        const note = findKeyUnderPoint(e.clientX, e.clientY);
        touch.change(e.pointerId, note);
    }
}

/** @param {TouchEvent} e */
function handleKbdTouchStart(e) {
    if ( touch.enabled ) {
        for ( const t of e.changedTouches )
            if ( !touch.started(t.identifier) ) {
                const note = findKeyUnderPoint(t.clientX, t.clientY);
                if ( note ) {
                    e.preventDefault();
                    touch.change(t.identifier, note);
                }
            }
    }
}

/** @param {TouchEvent} e */
function handleKbdTouchEnd(e) {
    for ( const t of e.changedTouches )
        if ( touch.started(t.identifier) ) {
            touch.remove(t.identifier);
        }
}

/** @param {TouchEvent} e */
function handleKbdTouchMove(e) {
    for ( const t of e.changedTouches )
        if ( touch.started(t.identifier) ) {
            e.preventDefault();
            const note = findKeyUnderPoint(t.clientX, t.clientY);
            touch.change(t.identifier, note);
        }
}


kbd.addEventListener("pointerdown", handleKbdPointerDown, { capture: true, passive: false });
kbd.addEventListener("touchstart", handleKbdTouchStart, { capture: true, passive: false });
window.addEventListener("pointerup", handleKbdPointerUp, { capture: false, passive: true });
window.addEventListener("pointercancel", handleKbdPointerUp, { capture: false, passive: true });
window.addEventListener("touchend", handleKbdTouchEnd, { capture: false, passive: true });
window.addEventListener("touchcancel", handleKbdTouchEnd, { capture: false, passive: true });
window.addEventListener("pointermove", handleKbdPointerMove, { capture: false, passive: false });
window.addEventListener("touchmove", handleKbdTouchMove, { capture: false, passive: false });


// MIDI events

function handleKeyPress(key, vel) {
    updateNote(key);
    sound.play(key, vel);
}

function handleKeyRelease(key, vel, duration) {
    if ( duration && duration < 100 )
        setTimeout( () => { updateNote(key); }, 100 - duration);
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
    midi_state.queryAccess((access) => {
        if ( access == "granted" ) {
            midi_state.requestPorts( (ports) => {
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
        ["alt+2", () => setNumberOfKeys(25)],
        ["alt+3", () => setNumberOfKeys(37)],
        ["alt+4", () => setNumberOfKeys(49)],
        ["alt+6", () => setNumberOfKeys(61)],
        ["alt+8", () => setNumberOfKeys(88)],
        ["alt+k", () => switchNumberOfKeys()],
        ["alt+d", () => switchKeyDepth()],
        ["alt+n", () => setLabelsWhere("none")],
        ["alt+p", () => setLabelsWhere("played")],
        ["alt+c", () => setLabelsWhere("cs")],
        ["alt+w", () => setLabelsWhere("white")],
        ["alt+a", () => setLabelsWhere("all")],
        ["alt+e", () => setLabelsType("english")],
        ["alt+g", () => setLabelsType("german")],
        ["alt+i", () => setLabelsType("italian")],
        ["alt+t", () => setLabelsType("pc")],
        ["alt+m", () => setLabelsType("midi")],
        ["alt+f", () => setLabelsType("freq")],
        ["alt+o", () => { 
            settings.labels.octave = !settings.labels.octave; 
            updateKeyboardKeys()
        }]
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

function clamp(value, min, max) {
    return (value < min) ? min : ( (value > max) ? max : value );
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
}

if ( isSafari() ) {
    // For now, disable sound button on Safari browser
    toolbar.dropdowns.sound.toggleAttribute("hidden", true);
} else {
    // Dynamically import smplr module
    import("https://unpkg.com/smplr/dist/index.mjs")
        .then( (result) => {
            sound.apiano = result.SplendidGrandPiano;
            sound.epiano = result.ElectricPiano;
            document.getElementById("menu-sound-item-unavailable").hidden = true;
            toolbar.dropdowns.sound.querySelectorAll(".menu-sound-item")
                .forEach((item) => { item.hidden = false });
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
            "Select your input device by clicking this button."
        );
    }
    connect_tooltip.open = true;
    window.onclick = () => {
        connect_tooltip.open = false;
        window.onclick = null;
    }
} else {
    midi_state.queryAccess((access) => {
        if ( access == "granted" )
            connectInput(settings.device_name);
    });
}

midi_state.setWatchdog(2000);
