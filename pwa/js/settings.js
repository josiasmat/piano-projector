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

import { is_firefox, is_mobile } from "./common.js";
import { LocalStorageHandler, SessionStorageHandler } from "./lib/storage-handler.js";
import { nextOf, range } from "./lib/utils.js";
import { createPianoKeyboard, updatePianoKey, updatePianoKeys } from "./piano/piano.js";
import { updateAppearanceMenu, updateLabelMenu, updatePedalsMenu, updateSizeMenu, updateMarkersMenu, updateToolbarBasedOnWidth } from "./toolbar/toolbar.js";
import { i18n } from "./lib/i18n.js";
import { updateKbdNavigator } from "./keyboard.js";
import { updateOnboardingTour } from "./onboarding.js";
import { colors } from "./colors.js";


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
    midi_access_firefox: "",
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
            saveAnnotationSettings();
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
            saveAnnotationSettings();
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
            saveAnnotationSettings();
        },
        clear() {
            this.keys.clear();
            updatePianoKeys();
            updateLabelMenu();
            saveAnnotationSettings();
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
                english: i18n.get("label-menu-format-english", "English"), 
                german: i18n.get("label-menu-format-german", "German"), 
                italian: i18n.get("label-menu-format-italian", "Italian"),
                movdo: i18n.get("label-menu-format-movdo", "Solfège"),
                pc: i18n.get("label-menu-format-pc", "Pitch-class"), 
                midi: i18n.get("label-menu-format-midi", "MIDI"), 
                freq: i18n.get("label-menu-format-freq", "Frequency")
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
    markers: {
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
            saveAnnotationSettings();
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
            saveAnnotationSettings();
        },
        clear() {
            this.keys.clear();
            updatePianoKeys();
            updateMarkersMenu();
            saveAnnotationSettings();
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

    get highlight_opacity() { return `${Math.round(colors.highlight_opacity*100)}%`; },
    set highlight_opacity(value) { colors.highlight_opacity = parseInt(value)/100; },
    get color_highlight() { return colors.highlight; },
    set color_highlight(value) { colors.highlight = value; },
    get color_white() { return colors.white_key; },
    set color_white(value) { colors.white_key = value; },
    get color_black() { return colors.black_key; },
    set color_black(value) { colors.black_key = value; },
    get color_top_felt() { return colors.top_felt; },
    set color_top_felt(value) { colors.top_felt = value; },

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


export function saveAnnotationSettings() {
    settings_storage.writeString("label-type", settings.labels.type);
    settings_storage.writeBool("label-octave", settings.labels.octave);
    settings_storage.writeBool("label-played", settings.labels.played);
    settings_storage.writeString("label-keys", settings.labels.keysToStr());
    settings_storage.writeString("label-tonic", settings.labels.tonic);
    settings_storage.writeString("markers-color", settings.markers.color);
    settings_storage.writeString("markers-keys", settings.markers.keysToStr());
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


/** @param {boolean} value */
export function saveFirstTimeTag(value) {
    if ( value != undefined )
        settings_storage.writeBool("first-time", Boolean(value));
    else {
        if ( settings.first_time )
            session_storage.writeBool("first-session", true);
        settings_storage.writeBool("first-time", false);
    }
}


function loadFirstTimeTag() {
    settings.first_time = 
        settings_storage.readBool("first-time", true) ||
        session_storage.readBool("first-session", false);
}


export function writeSettings(sound_type = null) {
    saveFirstTimeTag();
    saveLanguageSetting();
    saveAppearanceSettings();
    savePedalSettings();
    saveAnnotationSettings();
    saveDeviceSetting();
    if ( sound_type ) saveSoundSetting(sound_type); 
    writeSessionSettings();
}


export function loadSettings() {
    // Ignore errors
    const attempt = f => { try { f(); } catch (e) { console.error(e); } };

    attempt(loadFirstTimeTag);
    attempt(()=> settings.graphics_quality = settings_storage.readNumber("graphics-quality", settings.graphics_quality));
    attempt(()=> settings.language = settings_storage.readString("language", settings.language));
    attempt(()=> settings.height_factor = settings_storage.readNumber("height-factor", is_mobile ? 0.75 : settings.height_factor));
    attempt(()=> settings.number_of_keys = settings_storage.readNumber("number-of-keys", is_mobile ? 20 : settings.number_of_keys));
    attempt(()=> settings.color_white = settings_storage.readString("color-white", settings.color_white));
    attempt(()=> settings.color_black = settings_storage.readString("color-black", settings.color_black));
    attempt(()=> settings.color_highlight = settings_storage.readString("color-pressed", settings.color_highlight));
    attempt(()=> settings.labels.type = settings_storage.readString("label-type", settings.labels.type));
    attempt(()=> settings.labels.octave = settings_storage.readBool("label-octave", settings.labels.octave));
    attempt(()=> settings.labels.played = settings_storage.readBool("label-played", settings.labels.played));
    attempt(()=> settings.labels.strToKeys(settings_storage.readString("label-keys", '')));
    attempt(()=> settings.labels.tonic = settings_storage.readString("label-tonic", settings.labels.tonic));
    attempt(()=> settings.markers.color = settings_storage.readString("markers-color", settings.markers.color));
    attempt(()=> settings.markers.strToKeys(settings_storage.readString("markers-keys", '')));
    attempt(()=> settings.perspective = settings_storage.readBool("perspective", settings.perspective));
    attempt(()=> settings.top_felt = settings_storage.readBool("top-felt", settings.top_felt));
    attempt(()=> settings.highlight_opacity = settings_storage.readString("highlight-opacity", settings.highlight_opacity));
    attempt(()=> settings.pedals = settings_storage.readBool("pedals", settings.pedals));
    attempt(()=> settings.pedal_dim = settings_storage.readBool("pedal-dim", settings.pedal_dim));
    attempt(()=> settings.offset.y = settings_storage.readNumber("offset-y", settings.offset.y));
    attempt(()=> settings.device_name = settings_storage.readString("device", null));
    attempt(()=> settings.sound = settings_storage.readString("sound", ""));
    attempt(loadSessionSettings);
}


export function writeSessionSettings() {
    if ( is_firefox )
        session_storage.writeString("midi-access-firefox", settings.midi_access_firefox);
    session_storage.writeNumber("semitones", settings.semitones);
    session_storage.writeNumber("octaves", settings.octaves);
    session_storage.writeBool("toolbar", settings.toolbar);
}


export function loadSessionSettings() {
    if ( is_firefox )
        settings.midi_access_firefox = session_storage.readString("midi-access-firefox", "");
    settings.semitones = session_storage.readNumber("semitones", 0);
    settings.octaves = session_storage.readNumber("octaves", 0);
    settings.toolbar = session_storage.readBool("toolbar", settings.toolbar);
}


/** @param {boolean} ask */
export function resetSettings(ask = false) {
    if ( ask && window.confirm(i18n.get("reset-confirm-msg",
            "This will reset all your settings to their default values. Are you sure you want to continue?"
        )) ) 
    {
        session_storage.clear();
        settings_storage.clear();
        saveFirstTimeTag(settings.first_time);
        window.location.reload();
    }
}


export function changeLanguage(code) {
    try {
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
    } catch (e) {
        console.error(e);
        return settings.language;
    }
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
