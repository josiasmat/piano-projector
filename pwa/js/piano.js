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

import { is_mobile, is_safari } from "./common.js";
import { drawPianoKeyboard, drawPianoKeyboardLP } from "./pianodraw.js";
import { clamp, range, degToRad} from "./lib/utils.js";
import Midi, { noteToMidi } from "./lib/libmidi.js";
import { toolbar } from "./toolbar.js";
import { settings, writeSettings } from "./settings.js";
import KbdNotes from "./lib/kbdnotes.js";
import { setKbdNavVerticalPosition } from "./keyboard.js";
import { sound } from "./sound.js";
import { 
    getEnglishLabel, getFrequencyLabel, getGermanLabel, getItalianLabel, 
    isLabelingModeOn, isMarkingModeOn, isStickerModeOn 
} from "./markings.js";


export const piano = {
    /** @type {SVGElement} */
    svg: document.querySelector("svg#piano"),
    /** @type {HTMLDivElement} */
    container: document.getElementById("main-area"),
    /** @type {number?} */
    first_key: null,
    /** @type {number?} */
    last_key: null,
    /** @type {[SVGElement?]} */
    keys: Array(128).fill(null),
    /** @type {[SVGElement?]} */
    labels: Array(128).fill(null),
    /** @type {[SVGElement?]} */
    marking_groups: Array(128).fill(null),
    /** @type {boolean} */
    loaded: false,
    resize: {
        timeout: null,
        observer: null,
    }
};

const drag = {
    /** @type {number} 0=off, 1=clicked, 2=started moving.*/
    state: 0,
    origin: { x: 0, y: 0 },
    previous_offset: { x: 0, y: 0 }
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
        last_key: piano.last_key
    };
    if ( settings.lowperf )
        drawPianoKeyboardLP(piano.svg, piano.keys, options);
    else
        drawPianoKeyboard(piano.svg, piano.keys, options);
    for ( const [i,key_elm] of piano.keys.entries() ) {
        piano.marking_groups[i] = key_elm?.querySelector(".key-marker-group");
        piano.labels[i] = key_elm?.querySelector(".key-label");
    }
    piano.loaded = true;
    updatePiano();
}


export function updatePianoTopFelt() {
    document.getElementById("top-felt")?.toggleAttribute("hidden", !settings.top_felt);
}


/** @param {number} key - Key index */
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
        updatePianoKeyMarkings(key, note_on, key_pressed);
    }
}


/** @param {number} [keys] */
export function updatePianoKeys(keys) {
    if ( keys )
        for ( const k of keys ) updatePianoKey(k);
    else
        for ( let k = 0; k < 128; k++ ) updatePianoKey(k);
}


function updatePianoKeyMarkings(key, is_on, is_pressed) {

    const key_elm = piano.keys[key];
    const group_elm = piano.marking_groups[key];
    const label_elm = piano.labels[key];

    function setLabelText() {
        let text = "";
        switch ( settings.labels.type ) {
            case "pc" : 
                text = `${key%12}`; break;
            case "english": 
                text = getEnglishLabel(key); break;
            case "german": 
                text = getGermanLabel(key); break;
            case "italian": 
                text = getItalianLabel(key); break;
            case "freq":
                text = getFrequencyLabel(key); break;
            default: 
                text = `${key}`;
        }

        const lines = text.split('\n');
        for ( const [i,tspan] of Array.from(label_elm.children).entries() )
            tspan.textContent = lines[i] ?? '';
    }

    if ( key_elm ) {

        const has_fixed_label = settings.labels.keys.has(key);
        const label_visible = has_fixed_label || ( settings.labels.played && is_on );
        const label_temporary = settings.labels.played && !has_fixed_label;

        // if ( label_visible ) setLabelText();
        setLabelText();

        key_elm.classList.toggle("label-visible", label_visible);
        key_elm.classList.toggle("has-fixed-label", has_fixed_label);
        key_elm.classList.toggle("has-temporary-label", label_temporary);

        label_elm.classList.toggle("rotated", settings.labels.type == "freq");

        const has_sticker = settings.stickers.keys.has(key);
        const sticker_color = has_sticker ? settings.stickers.keys.get(key) : null;
        key_elm.classList.toggle("has-sticker", has_sticker);
        key_elm.classList.toggle("has-sticker-red", sticker_color == "red");
        key_elm.classList.toggle("has-sticker-yellow", sticker_color == "yellow");
        key_elm.classList.toggle("has-sticker-green", sticker_color == "green");
        key_elm.classList.toggle("has-sticker-blue", sticker_color == "blue");
        key_elm.classList.toggle("has-sticker-violet", sticker_color == "violet");

        if ( is_pressed && group_elm.hasAttribute("press_transform") )
            group_elm.style.setProperty("transform", group_elm.getAttribute("press_transform"));
        else 
            group_elm.style.removeProperty("transform");

    }
}


export function updatePianoCursor() {
    piano.svg.classList.toggle("touch-input", touch.enabled);
    piano.svg.classList.toggle("grabbing", [1,2].includes(drag.state));
    piano.svg.classList.toggle("marking-mode", isMarkingModeOn());
    piano.svg.classList.toggle("labeling-mode", isLabelingModeOn());
    piano.svg.classList.toggle("sticker-mode", isStickerModeOn());
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


// Pointer move events

piano.svg.oncontextmenu = (e) => {
    if ( drag.state > 0 ) e.preventDefault();
    drag.state = 0;
};

piano.svg.addEventListener("pointerdown", (e) => {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType != "touch" && e.button != 0 || !touch.enabled ) {
        if ( !isMarkingModeOn() || e.button != 0 ) {
            drag.state = 1;
            drag.origin.x = e.screenX;
            drag.origin.y = e.screenY;
            drag.previous_offset.x = settings.offset.x;
            drag.previous_offset.y = settings.offset.y;
            piano.svg.setPointerCapture(e.pointerId);
            updatePianoCursor();
        }
    }
}, { capture: true, passive: false });

piano.svg.addEventListener("pointerup", (e) => {
    if ( e.pointerType != "touch" && drag.state ) {
        drag.state = ( drag.state == 2 && e.button == 2 ) ? 3 : 0;
        piano.svg.releasePointerCapture(e.pointerId);
        updatePianoPosition();
        updatePianoCursor();
        writeSettings();
    }
}, { capture: true, passive: false });

piano.svg.addEventListener("pointermove", (e) => {
    if ( e.pointerType != "touch" && drag.state ) {

        const SNAP_THRESHOLD = 0.06;

        const kbd_rect = piano.svg.getBoundingClientRect();
        const cnt_rect = piano.container.getBoundingClientRect();

        drag.state = 2;

        // X-axis - scroll container
        const offset_x = e.screenX - drag.origin.x;
        const ratio_x = offset_x / (kbd_rect.width - cnt_rect.width);
        settings.offset.x = clamp(drag.previous_offset.x - ratio_x, 0.0, 1.0);

        // Y-axis - move keyboard (only if not almost maximally zoomed in)
        const max_zoom = piano.container.clientHeight / piano.svg.clientHeight;
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

        updatePianoPosition();
        updatePianoCursor();
    }
}, { capture: false, passive: true });

piano.container.addEventListener("wheel", (e) => {
    if ( !drag.state && !touch.started() && !e.ctrlKey ) {
        // make zoom out faster than zoom in
        const amount = -e.deltaY / (e.deltaY <= 0 ? 1000 : 500);
        const max_zoom = piano.container.clientHeight / piano.svg.clientHeight;
        const new_zoom = clamp(settings.zoom + amount, 1.0, max_zoom);
        if ( settings.zoom != new_zoom ) {
            const kbd_rect = piano.svg.getBoundingClientRect();
            const cnt_rect = piano.container.getBoundingClientRect();
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
        updatePianoPosition();
    }
    e.preventDefault();
}, { capture: false, passive: false });

if ( !is_mobile ) {
    var btn_show_toolbar_timeout = null;
    piano.container.addEventListener("pointermove", (e) => {
        if ( e.pointerType == "touch" ) return;
        if ( btn_show_toolbar_timeout ) clearTimeout(btn_show_toolbar_timeout);
        toolbar.buttons.show_toolbar.toggleAttribute("visible", true);
        piano.container.toggleAttribute("cursor-hidden", false);
        piano.svg.toggleAttribute("cursor-hidden", false);
        btn_show_toolbar_timeout = setTimeout(() => {
            toolbar.buttons.show_toolbar.toggleAttribute("visible", false);
            if ( !touch.enabled ) {
                piano.container.toggleAttribute("cursor-hidden", true);
                piano.svg.toggleAttribute("cursor-hidden", true);
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
    if ( is_safari ) {
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
    keys.delete(null);
    return keys;
}

/** @param {PointerEvent} e */
function handlePianoPointerDown(e) {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType != "touch" && touch.enabled && !isMarkingModeOn()
         && e.button === 0 && !touch.started(e.pointerId)) {
        const note = findKeyUnderPoint(e.clientX, e.clientY);
        if ( note ) { 
            touch.add(e.pointerId, new Set([note]));
            e.preventDefault();
        }
    }
}

/** @param {PointerEvent} e */
function handlePianoPointerUp(e) {
    if ( e.pointerType != "touch" && touch.started(e.pointerId) && e.button === 0 ) {
        e.preventDefault();
        touch.remove(e.pointerId);
    }
}

/** @param {PointerEvent} e */
function handlePianoPointerMove(e) {
    if ( e.pointerType != "touch" && touch.started(e.pointerId) ) {
        const note = findKeyUnderPoint(e.clientX, e.clientY);
        touch.change(e.pointerId, new Set([note]));
        e.preventDefault();
    }
}

/** @param {TouchEvent} e */
function handlePianoTouchStart(e) {
    if ( touch.enabled && !isMarkingModeOn() ) {
        for ( const t of e.changedTouches )
            if ( !touch.started(t.identifier) ) {
                const notes = findKeysUnderArea(
                    t.clientX, t.clientY, t.radiusX, t.radiusY, t.rotationAngle
                );
                if ( notes.size ) {
                    touch.add(t.identifier, notes);
                    if ( e.timeStamp - touch.last_vibration_time > 40 ) {
                        navigator.vibrate(40);
                        touch.last_vibration_time = e.timeStamp;
                    }
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
            const notes = findKeysUnderArea(
                t.clientX, t.clientY, t.radiusX, t.radiusY, t.rotationAngle
            );
            if ( touch.change(t.identifier, notes) == 1 &&
                 e.timeStamp - touch.last_vibration_time > 40 )
            {
                navigator.vibrate(40);
                touch.last_vibration_time = e.timeStamp;
            }
            e.preventDefault();
        }
}


piano.svg.addEventListener("pointerdown", handlePianoPointerDown, { capture: true, passive: false });
piano.svg.addEventListener("touchstart", handlePianoTouchStart, { capture: true, passive: false });
window.addEventListener("pointerup", handlePianoPointerUp, { capture: false, passive: false });
window.addEventListener("pointercancel", handlePianoPointerUp, { capture: false, passive: false });
window.addEventListener("touchend", handlePianoTouchEnd, { capture: false, passive: false });
window.addEventListener("touchcancel", handlePianoTouchEnd, { capture: false, passive: false });
window.addEventListener("pointermove", handlePianoPointerMove, { capture: false, passive: false });
window.addEventListener("touchmove", handlePianoTouchMove, { capture: false, passive: false });


// Adding and removing labels or markers with pointer

/** @param {PointerEvent} e */
function handlePianoClick(e) {
    if ( e.button === 0 ) {
        const key_num = findKeyUnderPoint(e.clientX, e.clientY);
        if ( key_num ) {
            const notes = e.ctrlKey
                ? Array.from(range(key_num%12, 128, 12))
                : [key_num];
            if ( isLabelingModeOn()) {
                // true if there is at least one note without label
                const value = notes.some(
                    (note) => !settings.labels.keys.has(note)
                );
                for ( const note of notes )
                    settings.labels.toggle(note, value);
            } else if ( isStickerModeOn() ) {
                // true if there is at least one note without sticker
                const value = notes.some(
                    (note) => !settings.stickers.keys.has(note)
                );
                for ( const note of notes )
                    settings.stickers.toggle(note, value);
            }
        }
    }
}

export function handlePianoContainerResize() {
    if ( piano.resize.timeout ) clearTimeout(piano.resize.timeout);
    piano.resize_timeout = setTimeout(() => {
        updatePianoPosition();
        piano.resize.timeout = null;
    }, settings.lowperf ? 50 : 5);
}

piano.svg.addEventListener("click", handlePianoClick, { capture: false, passive: true });

