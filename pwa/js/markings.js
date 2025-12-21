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

import { midiToFreq } from "./lib/libmidi";
import { range } from "./lib/utils";
import { touch, updatePianoCursor, updatePianoKeys } from "./piano";
import { isWhiteKey } from "./pianodraw";
import { settings, writeSettings } from "./settings";
import { updateLabelsMenu, updateStickersMenu, updateToolbar } from "./toolbar";


/** @type {string?} "label" or "sticker" or null */
let marking_mode = null;


export function isMarkingModeOn() {
    return Boolean(marking_mode);
}


export function isLabelingModeOn() {
    return marking_mode === "label";
}


export function isStickerModeOn() {
    return marking_mode === "sticker";
}


/** @param {string} value */
export function setLabelsPreset(value) {
    settings.labels.keys = buildLabelsPreset(value);
    updateLabelsMenu();
    updatePianoKeys();
    writeSettings();
}


/** @param {string} value */
export function setLabelsType(value) {
    settings.labels.type = value;
    updateLabelsMenu();
    updatePianoKeys();
    writeSettings();
}


/** @param {string} value - "label", "sticker" or _null_ */
export function setMarkingMode(value) {
    marking_mode = value ? value : null;
    updatePianoCursor();
    updateToolbar();
}


/** @param {boolean} value */
export function toggleLabelingMode(value = undefined) {
    if ( value === undefined )
        value = !(marking_mode == "label");
    setMarkingMode(value ? "label" : null);
    updateLabelsMenu();
}


/** @param {boolean} enabled @param {string} color */
export function toggleStickerMode(enabled = undefined, color = settings.stickers.color) {
    if ( enabled === undefined )
        enabled = !(marking_mode == "sticker") || (color != settings.stickers.color);
    settings.stickers.color = color;
    setMarkingMode(enabled ? "sticker" : null);
    updateStickersMenu();
}


export function clearStickers() {
    settings.stickers.keys.clear();
    updatePianoKeys();
    updateStickersMenu();
    writeSettings();
}


/** @param {boolean} value */
export function toggleLabelsPlayed(value = undefined) {
    settings.labels.played = ( value === undefined )
        ? !settings.labels.played 
        : value;
    updateLabelsMenu();
    updatePianoKeys();
    writeSettings();
}


/** @param {boolean} value */
export function toggleLabelsOctave(value = undefined) {
    settings.labels.octave = ( value === undefined )
        ? !settings.labels.octave 
        : value;
    updateLabelsMenu();
    updatePianoKeys();
    writeSettings();
}



function buildLabelsPreset(value) {
    const preset = new Set();
    switch ( value ) {
        case "mc":
            preset.add(60);
            break;
        case "cs":
            for ( const key of range(0,128,12) )
                preset.add(key);
            break;
        case "white":
            for ( const key of range(0,128) )
                if ( isWhiteKey(key) )
                    preset.add(key);
            break;
        case "all":
            for ( const key of range(0,128) )
                preset.add(key);
            break;
    }
    return preset;
}


export function getLabelsCurrentPresetOption() {
    for ( const option of ["none","mc","cs","white","all"] ) {
        const preset = buildLabelsPreset(option);
        if ( settings.labels.keys.symmetricDifference(preset).size == 0 )
            return option;
    }
    return "custom";
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
    it_oct_sub: ['₋₂','₋₁','₁','₂','₃','₄','₅','₆','₇','₈','₉','₁₀']
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
        const octave_marks = settings.labels.octave ? "’".repeat(octave-4) : '';
        return ( isWhiteKey(pc) )
            ? `${LABEL_STRINGS.ge_main[pc].toLowerCase()}${octave_marks}`
            : `${LABEL_STRINGS.ge_alt[pc].toLowerCase()}\n${LABEL_STRINGS.ge_main[pc].toLowerCase()}`;
    } else {
        const octave_marks = settings.labels.octave ? ",".repeat(Math.abs(octave-3)) : '';
        return ( isWhiteKey(pc) )
            ? `${LABEL_STRINGS.ge_main[pc]}${octave_marks}`
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
