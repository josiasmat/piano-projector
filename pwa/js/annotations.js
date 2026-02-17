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

import { midiToFreq } from "./lib/libmidi.js";
import { mod } from "./lib/utils.js";
import { touch, updatePianoCursor, updatePianoKeys } from "./piano/piano.js";
import { isWhiteKey } from "./piano/piano-creator.js";
import { saveAnnotationSettings, settings } from "./settings.js";
import { 
    updateLabelMenu, updateLabelMenuAndButton, updateMarkersButton, updateMarkersMenu, 
    updateMarkersMenuAndButton, updateToolbar, updateToolbarBasedOnWidth, toolbar
} from "./toolbar/toolbar.js";


/** @type {string?} "label" or "marker" or null */
let annotation_mode = null;

export let tonic_mode = false;


export function isAnnotationModeOn() {
    return Boolean(annotation_mode);
}


export function isLabelingModeOn() {
    return annotation_mode === "label";
}


export function isMarkerModeOn() {
    return annotation_mode === "marker";
}


/** 
 * @param {string} value 
 * @returns {boolean} _true_ if changed. */
export function setLabelType(value) {
    const changed = ( settings.labels.type !== (settings.labels.type = value) );
    updateLabelMenu();
    updateToolbar();
    updateToolbarBasedOnWidth();
    updatePianoKeys();
    saveAnnotationSettings();
    return changed;
}


/** @param {string} value - "label", "marker" or _null_ */
export function setAnnotationMode(value) {
    annotation_mode = (value === "label" || value === "marker") ? value : null;
    updatePianoCursor();
    updateLabelMenuAndButton();
    updateMarkersMenuAndButton();
}


export function exitAnnotationMode() {
    setAnnotationMode(null);
}


/** @param {boolean} [enabled] @returns {boolean} */
export function toggleLabelingMode(enabled) {
    if ( enabled === undefined )
        enabled = !(annotation_mode === "label");
    tonic_mode = false;
    setAnnotationMode(enabled ? "label" : null);
    return (annotation_mode === "label");
}


/** @param {boolean} [enabled] @param {string} [color] @returns {boolean} */
export function toggleMarkerMode(enabled, color = settings.markers.color) {
    if ( enabled === undefined )
        enabled = !(annotation_mode === "marker") || (color !== settings.markers.color);
    settings.markers.color = color;
    tonic_mode = false;
    setAnnotationMode(enabled ? "marker" : null);
    return (annotation_mode === "marker");
}


/** @param {boolean} enabled @param {boolean} show_tooltip @returns {boolean} */
export function toggleTonicMode(enabled, show_tooltip = false) {
    tonic_mode = ( settings.labels.type === "movdo" )
        ? enabled ?? !tonic_mode
        : false;
    updatePianoCursor();
    updatePianoKeys();
    updateLabelMenuAndButton();
    updateMarkersButton();
    if ( show_tooltip && settings.toolbar && tonic_mode )
        toolbar.tooltips.labels.show();
    else
        toolbar.tooltips.labels.hide();
    return tonic_mode;
}


/** @param {boolean} [enabled] */
export function toggleLabelPlayed(enabled) {
    settings.labels.played = ( enabled === undefined )
        ? !settings.labels.played 
        : enabled;
    updateLabelMenu();
    updatePianoKeys();
    saveAnnotationSettings();
}


/** @param {boolean} [enabled] */
export function toggleLabelOctave(enabled) {
    settings.labels.octave = ( enabled === undefined )
        ? !settings.labels.octave 
        : enabled;
    updateLabelMenu();
    updatePianoKeys();
    saveAnnotationSettings();
}


const LABEL_STRINGS = {
    en_main: ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],
    en_alt:  [   ,'D♭',   ,'E♭',   ,   ,'G♭',    ,'A♭',   ,'B♭',   ],
    en_oct:  ['₋₁','₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'],
    ge_main: ['C','Ces','D','Des','E','F','Fes','G','Ges','A','Aes','H'],
    ge_alt:  [   ,'Dis',   ,'Eis',   ,   ,'Gis',    ,'Ais',   ,'B',   ],
    it_main: ['do','do♯','re','re♯','mi','fa','fa♯','sol','sol♯','la','la♯','si'],
    it_alt:  [    ,'re♭',    ,'mi♭',    ,    ,'sol♭',     ,'la♭',    ,'si♭',    ],
    it_oct_sup: ['⁻²','⁻¹','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰'],
    it_oct_sub: ['₋₂','₋₁','₁','₂','₃','₄','₅','₆','₇','₈','₉','₁₀'],
    movdo:   ['do','ra','re','me','mi','fa','fi','sol','le','la','te','ti']
};


export function getEnglishLabel(key) {
    const pc = key%12;
    const octave = Math.trunc(key/12);
    const octstr = settings.labels.octave ? LABEL_STRINGS.en_oct[octave] : '';
    return ( isWhiteKey(pc) )
        ? `${LABEL_STRINGS.en_main[pc]}${octstr}`
        : `${LABEL_STRINGS.en_alt[pc]}\n${LABEL_STRINGS.en_main[pc]}\n${octstr}`;
}


export function getGermanLabel(key) {
    const pc = key%12;
    const octave = Math.trunc(key/12);
    if ( octave >= 4 ) {
        const octave_tag = settings.labels.octave ? "’".repeat(octave-4) : '';
        return ( isWhiteKey(pc) )
            ? `${LABEL_STRINGS.ge_main[pc].toLowerCase()}${octave_tag}`
            : `${LABEL_STRINGS.ge_alt[pc].toLowerCase()}\n${LABEL_STRINGS.ge_main[pc].toLowerCase()}`;
    } else {
        const octave_tag = settings.labels.octave ? ",".repeat(Math.abs(octave-3)) : '';
        return ( isWhiteKey(pc) )
            ? `${LABEL_STRINGS.ge_main[pc]}${octave_tag}`
            : `${LABEL_STRINGS.ge_alt[pc]}\n${LABEL_STRINGS.ge_main[pc]}`;
    }
}


export function getItalianLabel(key) {
    const pc = key%12;
    const octave = Math.trunc(key/12);
    const octstr = settings.labels.octave 
        ? ( isWhiteKey(pc) 
            ? LABEL_STRINGS.it_oct_sup[octave-1] 
            : LABEL_STRINGS.it_oct_sub[octave-1] )
        : '';
    return ( isWhiteKey(pc) )
        ? `${LABEL_STRINGS.it_main[pc]}${octstr}`
        : `${LABEL_STRINGS.it_alt[pc]}\n${LABEL_STRINGS.it_main[pc]}\n${octstr}`;
}


export function getFrequencyLabel(key) {
    const freq = midiToFreq(touch.enabled ? key+settings.transpose : key);
    return `${freq.toFixed(freq < 1000 ? 1 : 0)}`;
}


export function getMovableDoLabel(key) {
    const moved_pc = mod(key - settings.labels.tonic - settings.transpose, 12, false);
    return `${LABEL_STRINGS.movdo[moved_pc]}`;
}
