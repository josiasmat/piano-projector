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


import { settings, writeSessionSettings } from "./settings.js";
import { updateTransposeMenuAndButton } from "./toolbar.js";
import { updatePianoKeys } from "./piano.js";
import { sound } from "./sound.js";
import { clamp } from "./lib/utils.js";


/**
 * Sets transposition parameters.
 * @param {Object} [params={}]
 * @param {boolean} [params.reset=false] - Reset transposition.
 * @param {boolean} [params.set=false] - Set values instead of adding/subtracting.
 * @param {number} [params.semitones=0] - Number of semitones.
 * @param {number} [params.octaves=0] - Number of octaves.
 */
export function setTransposition(params={}) {

    const previous_transpose = settings.transpose;

    if ( params.reset ) {
        settings.semitones = 0;
        settings.octaves = 0;
    }

    if ( params.set ) {

        if ( Object.hasOwn(params, "octaves") )
            settings.octaves = clamp(params.octaves, -2, 2);
        if ( Object.hasOwn(params, "semitones") )
            settings.semitones = clamp(params.semitones, -11, 11);

    } else {

        if ( Object.hasOwn(params, "octaves") )
            settings.octaves = clamp(settings.octaves+params.octaves, -2, 2);
        if ( Object.hasOwn(params, "semitones") ) {
            settings.semitones = settings.semitones+params.semitones;
            while ( settings.semitones > 11 && settings.octaves < 2 ) {
                settings.octaves += 1;
                settings.semitones -= 12;
            }
            while ( settings.semitones < -11 && settings.octaves > -2) {
                settings.octaves -= 1;
                settings.semitones += 12;
            }
            settings.semitones = clamp(settings.semitones, -11, 11);
        }

    }

    if ( previous_transpose != settings.transpose ) 
        sound.stopAll(true);

    updateTransposeMenuAndButton();
    updatePianoKeys();
    writeSessionSettings();
}
