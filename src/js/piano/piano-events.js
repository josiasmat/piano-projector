/*
Piano Projector
Copyright (C) 2026 Josias Matschulat

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

import { is_mobile, is_safari } from "../common.js";
import { clamp, range, degToRad } from "../lib/utils.js";
import { toolbar } from "../toolbar/toolbar.js";
import { saveAppearanceSettings, saveLabelsAndStickersSettings, settings } from "../settings.js";
import { piano, touch, updatePianoCursor, updatePianoPosition } from "./piano.js";
import { isLabelingModeOn, isMarkingModeOn, isStickerModeOn, toggleTonicMode, tonic_mode } from "../markings.js";


export const drag = {
    /** @type {number} 0=off, 1=clicked, 2=started moving.*/
    state: 0,
    origin: { x: 0, y: 0 },
    previous_offset: { x: 0, y: 0 }
};

const marking_action = {
    /** @type {boolean|null} */
    value: null,
    id: null
}


export function attachPianoPointerAndTouchHandlers() {
    // Piano drag events
    piano.svg.addEventListener("pointerdown", handlePianoDragPointerDown, {capture: true, passive: false});
    piano.svg.addEventListener("pointerup", handlePianoDragPointerUp, {capture: true, passive: false});
    piano.svg.addEventListener("pointermove", handlePianoDragPointerMove, {capture: false, passive: true});
    // Mouse wheel events
    piano.container.addEventListener("wheel", handlePianoWheelEvent, {capture: false, passive: false});
    // Mouse/touch control events
    piano.svg.addEventListener("pointerdown", handlePianoPointerDown, { capture: true, passive: false });
    piano.svg.addEventListener("touchstart", handlePianoTouchStart, { capture: true, passive: false });
    window.addEventListener("pointerup", handlePianoPointerUp, { capture: false, passive: false });
    window.addEventListener("pointercancel", handlePianoPointerUp, { capture: false, passive: false });
    window.addEventListener("touchend", handlePianoTouchEnd, { capture: false, passive: false });
    window.addEventListener("touchcancel", handlePianoTouchEnd, { capture: false, passive: false });
    window.addEventListener("pointermove", handlePianoPointerMove, { capture: false, passive: false });
    window.addEventListener("touchmove", handlePianoTouchMove, { capture: false, passive: false });

    if ( !is_mobile )
        attachHidePointerAfterInactivityHandler()
}


export function attachPianoResizeObserver() {
    piano.resize.observer = new ResizeObserver(handlePianoContainerResize);
    piano.resize.observer.observe(piano.container);
}


// Events related to dragging the piano keyboard to move up and down

/** @param {PointerEvent} e */
function handlePianoDragPointerDown(e) {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType === "touch" ) return;
    if ( e.button !== 0 || !(touch.enabled || isMarkingModeOn()) ) {
        drag.state = 1;
        drag.origin.x = e.screenX;
        drag.origin.y = e.screenY;
        drag.previous_offset.x = settings.offset.x;
        drag.previous_offset.y = settings.offset.y;
        piano.svg.setPointerCapture(e.pointerId);
        updatePianoCursor();
    }
}


/** @param {PointerEvent} e */
function handlePianoDragPointerUp(e) {
    if ( e.pointerType === "touch" ) return;
    if ( drag.state ) {
        drag.state = 0;
        piano.svg.releasePointerCapture(e.pointerId);
        updatePianoPosition();
        updatePianoCursor();
        saveAppearanceSettings();
    }
};


/** @param {PointerEvent} e */
function handlePianoDragPointerMove(e) {
    if ( e.pointerType === "touch" ) return;
    if ( drag.state ) {

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
};


/** Wheel event handler **
 * @param {WheelEvent} e */
function handlePianoWheelEvent(e) {
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
};


// Pointer & touch control events

/** @param {PointerEvent} e */
function handlePianoPointerDown(e) {
    toolbar.dropdowns.closeAll();
    if ( e.pointerType === "touch" || e.button !== 0 ) return;
    const key = findKeyUnderPoint(e.clientX, e.clientY);
    if ( key ) {
        if ( tonic_mode ) {
            setNoteAsTonic(key%12, e.shiftKey);
            e.preventDefault();
        } else if ( isMarkingModeOn() ) {
            marking_action.id = e.pointerId;
            setKeyMarking(key, e.ctrlKey || e.shiftKey);
            e.preventDefault();
        } else if ( touch.enabled && !touch.started(e.pointerId) ) {
            touch.add(e.pointerId, new Set([key]));
            e.preventDefault();
        }
    }
}


/** @param {PointerEvent} e */
function handlePianoPointerUp(e) {
    if ( e.pointerType === "touch" ) return;
    if ( touch.started(e.pointerId) ) {
        touch.remove(e.pointerId);
        e.preventDefault();
    }
    if ( marking_action.id === e.pointerId ) {
        marking_action.id = null;
        marking_action.value = null;
        e.preventDefault();
    }
}


/** @param {PointerEvent} e */
function handlePianoPointerMove(e) {
    if ( e.pointerType === "touch" ) return;
    if ( touch.started(e.pointerId) ) {
        const key = findKeyUnderPoint(e.clientX, e.clientY);
        if ( key ) {
            touch.change(e.pointerId, new Set([key]));
            e.preventDefault();
        }
    }
    if ( marking_action.id === e.pointerId ) {
        const key = findKeyUnderPoint(e.clientX, e.clientY);
        if ( key ) {
            setKeyMarking(key, e.ctrlKey || e.shiftKey);
            e.preventDefault();
        }
    }
}


/** @param {TouchEvent} e */
function handlePianoTouchStart(e) {
    if ( tonic_mode ) {
        for ( const t of e.changedTouches ) {
            const key = findKeyUnderPoint(t.clientX, t.clientY);
            if ( key ) {
                setNoteAsTonic(key%12, e.shiftKey);
                e.preventDefault();
            }
        }
    } else if ( isMarkingModeOn() ) {
        for ( const t of e.changedTouches ) {
            const key = findKeyUnderPoint(t.clientX, t.clientY);
            if ( key ) {
                marking_action.id = t.identifier;
                setKeyMarking(key, e.ctrlKey || e.shiftKey);
                e.preventDefault();
            }
        }
    } else if ( touch.enabled ) {
        for ( const t of e.changedTouches ) {
            if ( !touch.started(t.identifier) ) {
                const notes = findKeysUnderArea(
                    t.clientX, t.clientY, t.radiusX, t.radiusY, t.rotationAngle
                );
                if ( notes.size ) {
                    touch.add(t.identifier, notes);
                    if ( e.timeStamp - touch.last_vibration_time > 40 ) {
                        navigator.vibrate?.(40);
                        touch.last_vibration_time = e.timeStamp;
                    }
                    e.preventDefault();
                }
            }
        }
    }
}


/** @param {TouchEvent} e */
function handlePianoTouchEnd(e) {
    for ( const t of e.changedTouches ) {
        if ( touch.started(t.identifier) ) {
            touch.remove(t.identifier);
            e.preventDefault();
        }
        if ( marking_action.id === t.identifier ) {
            marking_action.id = null;
            marking_action.value = null;
            e.preventDefault();
        }
    }
}


/** @param {TouchEvent} e */
function handlePianoTouchMove(e) {
    for ( const t of e.changedTouches ) {
        if ( touch.started(t.identifier) ) {
            const notes = findKeysUnderArea(
                t.clientX, t.clientY, t.radiusX, t.radiusY, t.rotationAngle
            );
            if ( touch.change(t.identifier, notes) === 1 &&
                 e.timeStamp - touch.last_vibration_time > 40 )
            {
                navigator.vibrate?.(40);
                touch.last_vibration_time = e.timeStamp;
            }
            e.preventDefault();
        }
        if ( marking_action.id === t.identifier ) {
            const key = findKeyUnderPoint(t.clientX, t.clientY);
            if ( key ) {
                marking_action.id = t.identifier;
                setKeyMarking(key, e.ctrlKey || e.shiftKey);
                e.preventDefault();
            }
        }
    }
}


/** @param {number} new_tonic @param {boolean} shift_labels */
function setNoteAsTonic(new_tonic, shift_labels) {
    const previous_tonic = settings.labels.tonic;
    settings.labels.tonic = (new_tonic-settings.transpose)%12;
    saveLabelsAndStickersSettings();

    if ( settings.labels.keys.size === 0 ) {
        settings.labels.toggleOctaves(new_tonic, true);
    } else if ( shift_labels ) {
        let diff = (settings.labels.tonic - previous_tonic) % 12;
        if ( Math.abs(diff) > 6 ) diff -= Math.sign(diff) * 12;
        settings.labels.transpose(diff);
    }

    toggleTonicMode(false);
}


/** 
 * @param {number} key
 * @param {boolean} all_octaves
 */
function setKeyMarking(key, all_octaves) {
    if ( !isMarkingModeOn() ) {
        marking_action.id = null;
        marking_action.value = null;
        return;
    }
    if ( key ) {
        // if just clicked, detect correct value
        if ( marking_action.value === null ) {
            if ( isLabelingModeOn() )
                marking_action.value = !settings.labels.has(key);
            else if ( isStickerModeOn() )
                marking_action.value = !settings.stickers.has(key);
        }
        // do marking if value is set
        if ( marking_action.value !== null ) {
            if ( isLabelingModeOn() ) {
                if ( all_octaves )
                    settings.labels.toggleOctaves(key, marking_action.value);
                else
                    settings.labels.toggle(key, marking_action.value);
            } else if ( isStickerModeOn() ) {
                if ( all_octaves )
                    settings.stickers.toggleOctaves(key, marking_action.value);
                else
                    settings.stickers.toggle(key, marking_action.value);
            }
        }
    }
}


function handlePianoContainerResize() {
    if ( piano.resize.timeout ) clearTimeout(piano.resize.timeout);
    piano.resize_timeout = setTimeout(() => {
        updatePianoPosition();
        piano.resize.timeout = null;
    }, (settings.graphics_quality === 0) ? 50 : 5);
}


function attachHidePointerAfterInactivityHandler() {
    // Show toolbar buttons and mouse cursor when moving mouse, 
    // hide after a while of inactivity
    let btn_show_toolbar_timeout = null;
    piano.container.addEventListener("pointermove", (e) => {
        if ( e.pointerType === "touch" ) return;
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
