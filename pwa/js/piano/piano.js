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

import { drawPianoKeyboard, drawPianoKeyboardLP } from "./piano-creator.js";
import { settings } from "../settings.js";
import { setKbdNavVerticalPosition } from "../keyboard.js";
import { sound } from "../sound.js";
import { Midi, noteToMidi } from "../lib/libmidi.js";
import { KbdNotes } from "../lib/kbdnotes.js";

import { 
    getEnglishLabel, getFrequencyLabel, getGermanLabel, getItalianLabel, 
    getMovableDoLabel, 
    isLabelingModeOn, isAnnotationModeOn, isMarkerModeOn, 
    tonic_mode
} from "../annotations.js";

import { drag } from "./piano-events.js";
export * from "./piano-events.js";


export const piano = {
    /** @type {SVGElement} */
    svg: undefined,
    /** @type {HTMLDivElement} */
    container: undefined,
    /** @type {number?} */
    first_key: null,
    /** @type {number?} */
    last_key: null,
    /** @type {[SVGElement?]} */
    keys: Array(128).fill(null),
    /** @type {[SVGElement?]} */
    labels: Array(128).fill(null),
    /** @type {[SVGElement?]} */
    annotation_groups: Array(128).fill(null),
    /** @type {boolean} */
    loaded: false,

    resize: {
        timeout: null,
        /** @type {ResizeObserver} */
        observer: null,
    }
};

export const touch = {
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
            updatePianoKey(note);
        }
    },

    /** 
     * @param {number} pointer_id 
     * @param {Set<number>} notes 
     * @returns {number} +1 if note(s) added; -1 if note(s) removed; 0 if no change */
    change(pointer_id, notes) {
        let changed = 0;
        const previous_notes = new Set().union(this.points.get(pointer_id));
        this.points.set(pointer_id, notes);
        for ( const old_note of previous_notes.values() )
            if ( !notes.has(old_note) ) {
                sound.stop(old_note);
                updatePianoKey(old_note);
                changed = -1;
            }
        for ( const new_note of notes.values() )
            if ( !previous_notes.has(new_note) ) {
                sound.play(new_note);
                updatePianoKey(new_note);
                changed = 1;
            }
        return changed;
    },

    /** @param {number} pointer_id */
    remove(pointer_id) {
        const notes = this.points.get(pointer_id);
        this.points.delete(pointer_id);
        for ( const note of notes.values() ) {
            if ( !this.has_note(note) ) sound.stop(note);
            updatePianoKey(note);
        }
    },

    reset() {
        this.points.clear();
        sound.stopAll();
    },

    enable() {
        this.enabled = true;
        updatePianoCursor();
    },

    disable() {
        this.reset();
        this.enabled = false;
        updatePianoCursor();
    },

    last_vibration_time: 0
};


export function createPianoKeyboard() {
    if ( !piano.svg ) piano.svg = document.querySelector("svg#piano");
    if ( !piano.container ) piano.container = document.getElementById("main-area");
    const first_last_notes = new Map([
        [88, ["a0", "c8"]],
        [61, ["c2", "c7"]],
        [49, ["c2", "c6"]],
        [37, ["c3", "c6"]],
        [25, ["c3", "c5"]],
        [20, ["f3", "c5"]]
    ]).get(settings.number_of_keys);
    piano.first_key = noteToMidi(first_last_notes[0]);
    piano.last_key = noteToMidi(first_last_notes[1]);
    const options = {
        height_factor: settings.height_factor,
        perspective: settings.perspective,
        top_felt: settings.top_felt,
        first_key: piano.first_key,
        last_key: piano.last_key,
        no_gradient: settings.graphics_quality < 2,
        no_transition: settings.graphics_quality < 2
    };
    if ( settings.graphics_quality === 0 )
        drawPianoKeyboardLP(piano.svg, piano.keys, options);
    else
        drawPianoKeyboard(piano.svg, piano.keys, options);
    for ( const [i,key_elm] of piano.keys.entries() ) {
        piano.annotation_groups[i] = key_elm?.querySelector(".key-annotation-group");
        piano.labels[i] = key_elm?.querySelector(".key-label");
    }
    piano.loaded = true;
    updatePiano();
}


export function updatePianoTopFelt() {
    piano.svg.toggleAttribute("top-felt-hidden", !settings.top_felt);
}


/** @param {number} key */
export function updatePianoKey(key) {
    const elm = piano.keys[key];
    if ( elm ) {
        const j = key-settings.transpose;
        const touched = touch.has_note(key);
        const key_pressed = touched || Midi.isKeyPressed(j) || KbdNotes.isNotePressed(j);
        const note_on = key_pressed 
                        || Midi.isNoteOn(j, (settings.pedals ? "both" : "none"))
                        || KbdNotes.isNoteSustained(j, settings.pedals);
        elm.classList.toggle("active", note_on);
        elm.classList.toggle("pressed", key_pressed);
        elm.classList.toggle("dim", settings.pedal_dim && note_on && !key_pressed);
        const dn = key_pressed ? "d1" : "d0";
        for ( const child of elm.children )
            if ( child.hasAttribute(dn) )
                child.setAttribute("d", child.getAttribute(dn));
        updatePianoKeyAnnotations(key, note_on, key_pressed);
    }
}


/** @param {number[]} [keys] */
export function updatePianoKeys(keys) {
    if ( keys == undefined )
        for ( let k = 0; k < 128; k++ ) 
            updatePianoKey(k);
    else
        for ( const k of range(piano.first_key, piano.last_key+1) ) 
            updatePianoKey(k);
}


/**
 * @param {number} key 
 * @param {boolean} is_on 
 * @param {boolean} is_pressed 
 */
function updatePianoKeyAnnotations(key, is_on, is_pressed) {

    const key_elm = piano.keys[key];
    const group_elm = piano.annotation_groups[key];
    const label_elm = piano.labels[key];

    function setLabelText(k = key) {
        let text = "";
        switch ( settings.labels.type ) {
            case "pc" : 
                text = `${k%12}`; break;
            case "english": 
                text = getEnglishLabel(k); break;
            case "german": 
                text = getGermanLabel(k); break;
            case "italian": 
                text = getItalianLabel(k); break;
            case "movdo": 
                text = getMovableDoLabel(k); break;
            case "freq":
                text = getFrequencyLabel(k); break;
            default: 
                text = `${k}`;
        }

        const lines = text.split('\n');
        for ( const [i,tspan] of Array.from(label_elm.children).entries() )
            tspan.textContent = lines[i] ?? '';
    }

    if ( key_elm ) {

        // transpose labels unless control mode is mouse/touch
        const key_transposed = touch.enabled ? key : key-settings.transpose;
        const has_fixed_label = settings.labels.keys.has(key_transposed);
        const label_visible = has_fixed_label || ( settings.labels.played && is_on );
        const label_temporary = settings.labels.played && !has_fixed_label;

        // if ( label_visible ) setLabelText();
        setLabelText(key);

        key_elm.classList.toggle("label-visible", label_visible);
        key_elm.classList.toggle("has-fixed-label", has_fixed_label);
        key_elm.classList.toggle("has-temporary-label", label_temporary);

        label_elm.classList.toggle("rotated", settings.labels.type === "freq");

        const has_marker = settings.markers.keys.has(key);
        const marker_color = has_marker ? settings.markers.keys.get(key) : null;
        key_elm.classList.toggle("has-marker", has_marker);
        key_elm.classList.toggle("has-marker-red", marker_color === "red");
        key_elm.classList.toggle("has-marker-yellow", marker_color === "yellow");
        key_elm.classList.toggle("has-marker-green", marker_color === "green");
        key_elm.classList.toggle("has-marker-blue", marker_color === "blue");
        key_elm.classList.toggle("has-marker-violet", marker_color === "violet");

        if ( is_pressed && group_elm.hasAttribute("press_transform") )
            group_elm.style.setProperty("transform", group_elm.getAttribute("press_transform"));
        else 
            group_elm.style.removeProperty("transform");

    }
}


export function updatePianoCursor() {
    piano.svg.classList.toggle("touch-input", touch.enabled);
    piano.svg.classList.toggle("grabbing", drag.state !== 0);
    piano.svg.classList.toggle("annotation-mode", isAnnotationModeOn());
    piano.svg.classList.toggle("labeling-mode", isLabelingModeOn());
    piano.svg.classList.toggle("marker-mode", isMarkerModeOn());
    piano.svg.classList.toggle("tonic-mode", tonic_mode);
}


export function updatePiano() {
    updatePianoKeys();
    updatePianoTopFelt();
    updatePianoPosition();
    updatePianoCursor();
}


export function updatePianoPosition() {
    const max_zoom = piano.container.clientHeight / piano.svg.clientHeight;
    if ( settings.zoom > 1 ) {
        if ( settings.zoom > max_zoom ) settings.zoom = max_zoom;
        piano.svg.style.transform = `scale(${settings.zoom}, ${settings.zoom})`;
    } else
        piano.svg.style.removeProperty("transform");

    const kbd_rect = piano.svg.getBoundingClientRect();
    const cnt_rect = piano.container.getBoundingClientRect();

    // compute vertical position
    const py = (cnt_rect.height - kbd_rect.height) * settings.offset.y;
    piano.svg.style.top = `${py}px`;

    // compute horizontal position
    const px = Math.round((kbd_rect.width - cnt_rect.width) * settings.offset.x);
    piano.container.scroll(px, 0);

    setKbdNavVerticalPosition(settings.offset.y > 0.5);
}


export function updateNote(note) {
    const key = note+settings.transpose;
    if ( key >= 0 && key < 128 )
        updatePianoKey(key);
}
