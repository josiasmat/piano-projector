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

import { is_mobile } from "./common.js";
import { LocalStorageHandler, SessionStorageHandler } from "./lib/storage-handler.js";
import { nextOf, range } from "./lib/utils.js";
import { createPianoKeyboard, updatePianoKey, updatePianoKeys } from "./piano/piano.js";
import { updateAppearanceMenu, updateLabelsMenu, updatePedalsMenu, updateSizeMenu, updateStickersMenu, updateToolbarBasedOnWidth } from "./toolbar/toolbar.js";
import { i18n } from "./lib/i18n.js";
import { updateKbdNavigator } from "./keyboard.js";
import { updateOnboardingTour } from "./onboarding.js";


// Initialize storage handlers
export const settings_storage = new LocalStorageHandler("piano-projector");
export const session_storage = new SessionStorageHandler("piano-projector-session");

// Settings object
export const settings = {
    first_time: true,
    graphics_quality: 2, // 2 = max, 1 = medium, 0 = min
    // lowperf: false,
    language: null,
    number_of_keys: 88,
    height_factor: 1.0,
    device_name: null,
    sound: null,
    offset: { x: 0.5, y: 0.5 },
    labels: {
        /** @type {string} "english", "german", "italian", "pc", "midi", "freq" */
        type: "english",
        octave: true,
        played: false,
        /** @type {Set<number>} */
        keys: new Set(),
        tonic: 0,
        transposed: true,
        _key(key, transposed = this.transposed, inverse = false) {
            return transposed 
                ? key + (inverse ? settings.transpose : -settings.transpose)
                : key;
        },
        has(key, transposed = this.transposed) {
            return this.keys.has(this._key(key, transposed));
        },
        toggle(key, value=undefined, transposed = this.transposed) {
            value = value ?? !this.has(key, transposed);
            if ( value )
                this.keys.add(this._key(key, transposed));
            else
                this.keys.delete(this._key(key, transposed));
            updatePianoKey(key);
            saveLabelsAndStickersSettings();
        },
        toggleOctaves(key, value=undefined, transposed = this.transposed) {
            value = value ?? !this.has(key, transposed);
            const first = this._key(key, transposed) % 12;
            if ( value ) {
                for ( let i = first; i < 128; i += 12 ) {
                    this.keys.add(i);
                    updatePianoKey(this._key(i, transposed, true));
                }
            } else {
                for ( let i = first; i < 128; i += 12 ) {
                    this.keys.delete(i);
                    updatePianoKey(this._key(i, transposed, true));
                }
            }
            saveLabelsAndStickersSettings();
        },
        /** @param {number} key @returns {boolean} */
        allOctaves(key, transposed = this.transposed) {
            return [...range(this._key(key, transposed)%12, 128, 12)]
                   .every(key => this.has(key, false));
        },
        /** @param {number} n */
        transpose(n) {
            const new_keys = new Set();
            [...range(0, 12)].forEach(pc => {
                if ( this.allOctaves(pc, false) )
                    [...range((pc + n) % 12, 128, 12)]
                    .forEach(new_key => new_keys.add(new_key));
            });
            this.keys.forEach(key => 
                (key >= 0 && key < 128) && new_keys.add(key + n)
            );
            this.keys = new_keys;
            updatePianoKeys();
            saveLabelsAndStickersSettings();
        },
        clear() {
            this.keys.clear();
            updatePianoKeys();
            updateLabelsMenu();
            saveLabelsAndStickersSettings();
        },
        /** @returns {string} */
        keysToStr() {
            return [...this.keys].sort((a,b)=>a-b).join(',');
        },
        /** @param {string} s */
        strToKeys(s) {
            this.keys.clear();
            if ( s )
                for ( const item of s.split(',') ) {
                    const key = parseInt(item);
                    if ( Number.isInteger(key) )
                        this.keys.add(key);
                }
        },
        /** @return {string} */
        get type_badge() {
            return {
                english: i18n.get("labels-menu-format-english", "English"), 
                german: i18n.get("labels-menu-format-german", "German"), 
                italian: i18n.get("labels-menu-format-italian", "Italian"),
                movdo: i18n.get("labels-menu-format-movdo", "Solfège"),
                pc: i18n.get("labels-menu-format-pc", "Pitch-class"), 
                midi: i18n.get("labels-menu-format-midi", "MIDI"), 
                freq: i18n.get("labels-menu-format-freq", "Frequency")
            }[this.type];
        },
        /** @return {string} */
        get tonic_badge() {
            return [
                '.C.','C♯/D♭','.D.','D♯/E♭','.E.','.F.',
                'F♯/G♭','.G.','G♯/A♭','.A.','A♯/B♭','.B.'
            ][this.tonic].replaceAll('.','\u2007');
        }
    },
    stickers: {
        color: "red",
        /** @type {Map<number,string>} */
        keys: new Map(),
        has(key) {
            return this.keys.has(key);
        },
        toggle(key, value=undefined) {
            value = value ?? !this.has(key);
            if ( value )
                this.keys.set(key, this.color);
            else
                this.keys.delete(key);
            updatePianoKey(key);
            saveLabelsAndStickersSettings();
        },
        toggleOctaves(key, value=undefined) {
            value = value ?? !this.has(key);
            const first = key%12;
            if ( value ) {
                for ( let i = first; i < 128; i += 12 ) {
                    this.keys.set(i, this.color);
                    updatePianoKey(i);
                }
            } else {
                for ( let i = first; i < 128; i += 12 ) {
                    this.keys.delete(i);
                    updatePianoKey(i);
                }
            }
            saveLabelsAndStickersSettings();
        },
        clear() {
            this.keys.clear();
            updatePianoKeys();
            updateStickersMenu();
            saveLabelsAndStickersSettings();
        },
        keysToStr() {
            let items = [];
            for ( const [k,v] of this.keys.entries() ) 
                items.push(`${k}:${v}`);
            return items.join(',');
        },
        /** @param {string} s */
        strToKeys(s) {
            this.keys.clear();
            if ( s )
                for ( const item of s.split(',') ) {
                    const [k,v] = item.split(':');
                    const kn = parseInt(k);
                    if ( Number.isInteger(kn) )
                        this.keys.set(kn, v);
                }
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
    get highlight_opacity() {
        return getComputedStyle(document.documentElement).getPropertyValue("--highlight-opacity");
    },
    set highlight_opacity(value) {
        document.documentElement.style.setProperty('--highlight-opacity', value);
    },
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
};


function saveLanguageSetting() {
    if ( settings.language )
        settings_storage.writeString("language", settings.language);
    else
        settings_storage.remove("language");
}


export function saveDeviceSetting() {
    if ( settings.device_name ) 
        settings_storage.writeString("device", settings.device_name);
    else 
        settings_storage.remove("device");
}


export function saveAppearanceSettings() {
    settings_storage.writeNumber("height-factor", settings.height_factor);
    settings_storage.writeNumber("number-of-keys", settings.number_of_keys);
    settings_storage.writeString("color-pressed", settings.color_highlight);
    settings_storage.writeString("color-white", settings.color_white);
    settings_storage.writeString("color-black", settings.color_black);
    settings_storage.writeBool("perspective", settings.perspective);
    settings_storage.writeBool("top-felt", settings.top_felt);
    settings_storage.writeString("highlight-opacity", settings.highlight_opacity);
    settings_storage.writeNumber("offset-y", settings.offset.y);
    saveGraphicsQualitySetting();
}


export function saveLabelsAndStickersSettings() {
    settings_storage.writeString("labels-type", settings.labels.type);
    settings_storage.writeBool("labels-octave", settings.labels.octave);
    settings_storage.writeBool("labels-played", settings.labels.played);
    settings_storage.writeString("labels-keys", settings.labels.keysToStr());
    settings_storage.writeString("labels-tonic", settings.labels.tonic);
    settings_storage.writeString("sticker-color", settings.stickers.color);
    settings_storage.writeString("stickers-keys", settings.stickers.keysToStr());
}


export function savePedalSettings() {
    settings_storage.writeBool("pedals", settings.pedals);
    settings_storage.writeBool("pedal-dim", settings.pedal_dim);
}


export function saveSoundSetting(sound_type) {
    settings_storage.writeString("sound", sound_type);
}


export function saveGraphicsQualitySetting() {
    settings_storage.writeNumber("graphics-quality", settings.graphics_quality);
}


export function writeSettings(sound_type = null) {
    settings_storage.writeBool("first-time", false);
    saveLanguageSetting();
    saveAppearanceSettings();
    savePedalSettings();
    saveLabelsAndStickersSettings();
    saveDeviceSetting();
    if ( sound_type ) saveSoundSetting(sound_type); 
    writeSessionSettings();
}


export function loadSettings() {
    settings.first_time = settings_storage.readBool("first-time", true);
    settings.graphics_quality = settings_storage.readNumber("graphics-quality", settings.graphics_quality);
    // settings.lowperf = settings_storage.readBool("lowperf", settings.lowperf);
    settings.language = settings_storage.readString("language", settings.language);
    settings.height_factor = settings_storage.readNumber("height-factor", is_mobile ? 0.75 : settings.height_factor);
    settings.number_of_keys = settings_storage.readNumber("number-of-keys", is_mobile ? 20 : settings.number_of_keys);
    settings.color_white = settings_storage.readString("color-white", settings.color_white);
    settings.color_black = settings_storage.readString("color-black", settings.color_black);
    settings.color_highlight = settings_storage.readString("color-pressed", settings.color_highlight);
    settings.labels.type = settings_storage.readString("labels-type", settings.labels.type);
    settings.labels.octave = settings_storage.readBool("labels-octave", settings.labels.octave);
    settings.labels.played = settings_storage.readBool("labels-played", settings.labels.played);
    settings.labels.strToKeys(settings_storage.readString("labels-keys", ''));
    settings.labels.tonic = settings_storage.readString("labels-tonic", settings.labels.tonic);
    settings.stickers.color = settings_storage.readString("sticker-color", settings.stickers.color);
    settings.stickers.strToKeys(settings_storage.readString("stickers-keys", ''));
    settings.perspective = settings_storage.readBool("perspective", settings.perspective);
    settings.top_felt = settings_storage.readBool("top-felt", settings.top_felt);
    settings.highlight_opacity = settings_storage.readString("highlight-opacity", settings.highlight_opacity);
    settings.pedals = settings_storage.readBool("pedals", settings.pedals);
    settings.pedal_dim = settings_storage.readBool("pedal-dim", settings.pedal_dim);
    settings.offset.y = settings_storage.readNumber("offset-y", settings.offset.y);
    settings.device_name = settings_storage.readString("device", null);
    settings.sound = settings_storage.readString("sound", "");
    loadSessionSettings();
}


export function writeSessionSettings() {
    session_storage.writeNumber("semitones", settings.semitones);
    session_storage.writeNumber("octaves", settings.octaves);
    session_storage.writeBool("toolbar", settings.toolbar);
}


export function loadSessionSettings() {
    settings.semitones = session_storage.readNumber("semitones", 0);
    settings.octaves = session_storage.readNumber("octaves", 0);
    settings.toolbar = session_storage.readBool("toolbar", settings.toolbar);
}


/** @param {boolean} ask */
export function resetSettings(ask = false) {
    console.log("resetSettings() called");
    if ( ask ) {
        console.log("asking");
        const response = window.confirm(i18n.get("reset-confirm-msg",
            "This will reset all your settings to their default values. Are you sure you want to continue?"
        ));
        if ( !response ) return;
    }
    session_storage.clear();
    settings_storage.clear();
    window.location.reload();
}


export function changeLanguage(code) {
    const new_code = i18n.setLanguage(code);
    if ( new_code === code ) {
        settings.language = new_code;
        document.documentElement.setAttribute("lang", code);
        i18n.translateDOM(document.body);
        updateKbdNavigator();
        updateToolbarBasedOnWidth();
        updateOnboardingTour();
        saveLanguageSetting();
    }
    return new_code;
}


/** @param {number} value 88, 61, 49, 37 or 25. */
export function setNumberOfKeys(value) {
    settings.number_of_keys = value;
    settings.zoom = 1.0;
    updateSizeMenu();
    createPianoKeyboard();
    saveAppearanceSettings();
}


export function switchNumberOfKeys() {
    setNumberOfKeys(nextOf(settings.number_of_keys, [88,61,49,37,25]));
}


/** @param {number} value 1.0, 0.75 or 0.5*/
export function setKeyDepth(value) {
    settings.height_factor = value;
    updateSizeMenu();
    createPianoKeyboard();
    saveAppearanceSettings();
}


export function switchKeyDepth() {
    setKeyDepth(nextOf(settings.height_factor, [1.0, 0.75, 0.5]));
}


/** @param {boolean} value */
export function togglePedalsFollow(value = undefined) {
    settings.pedals = ( value === undefined )
        ? !settings.pedals
        : value;
    updatePedalsMenu();
    updatePianoKeys();
    savePedalSettings();
}


/** @param {boolean} value */
export function togglePedalsDim(value = undefined) {
    settings.pedal_dim = ( value === undefined )
        ? !settings.pedal_dim
        : value;
    updatePedalsMenu();
    updatePianoKeys();
    savePedalSettings();
}


/** 
 * @param {number} value 2 = high, 1 = medium, 0 = low 
 * @param {boolean} no_update
 */
export function setGraphicsQuality(value, no_update = false) {
    settings.graphics_quality = value;
    saveGraphicsQualitySetting();
    if ( !no_update ) {
        updateAppearanceMenu();
        createPianoKeyboard();
    }
}
