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

export const MIDI_WATCHDOG_FAST_INTERVAL = 500;
export const MIDI_WATCHDOG_SLOW_INTERVAL = 2000;

import { Midi } from "./lib/libmidi.js";
import { toolbar, updateConnectionMenu, updatePedalIcons, updateToolbar } from "./toolbar.js";
import { saveDeviceSetting, settings } from "./settings.js";
import { KbdNotes } from "./lib/kbdnotes.js";
import { touch } from "./piano.js";
import { updatePianoKeys, updateNote, updatePiano } from "./piano.js";
import { isKbdNavigatorVisible, updateKbdNavigator } from "./keyboard.js";
import { sound } from "./sound.js";


export const midi = {
    /** @type {MIDIInput[]} */
    ports: [],
    /** @returns {HTMLElement[]} */
    get menu_items() {
        return toolbar.menus.connect.getMidiItems();
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
            callback?.(this.access);
        });
    },
    /** @param {(boolean)} callback */
    requestAccess(callback = null) {
        Midi.requestMidiAccess( 
            () => { 
                this.access = "granted";
                callback?.(true);
            },
            () => { 
                this.access = "denied";
                callback?.(false); 
            }
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
};


export function togglePcKeyboardConnection(value=null) {
    if ( value === null ) 
        value = !settings.pc_keyboard_connected;
    if ( value )
        connectInput("pckbd");
    else
        disconnectInput();
}


export function toggleTouchConnection(value=null) {
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
 * @param {boolean} save - _true_ to call saveDeviceSetting() after connection.
 */
export function connectInput(name, save=false) {
    Midi.disconnect();
    sound.stopAll();
    switch ( name ) {
        case "pckbd":
            KbdNotes.enable();
            touch.disable();
            settings.device_name = "pckbd";
            updateToolbar();
            updatePiano();
            if ( save ) saveDeviceSetting();
            break;
        case "touch":
            KbdNotes.disable();
            touch.enable();
            settings.device_name = "touch";
            updateToolbar();
            updatePianoKeys();
            if ( save ) saveDeviceSetting();
            break;
        default:
            KbdNotes.disable();
            touch.disable();
            settings.device_name = null;
            updateToolbar();
            updatePianoKeys();
            Midi.connectByPortName(name, () => {
                settings.device_name = name;
                updateToolbar();
                updateKbdNavigator();
                if ( save ) saveDeviceSetting();
            });
    }
}


export function disconnectInput(save=false) {
    Midi.disconnect();
    KbdNotes.disable();
    touch.disable();
    settings.device_name = null;
    updateToolbar();
    updatePianoKeys();
    if ( save ) saveDeviceSetting();
}


/** 
 * Connects or disconnects an input device.
 * @param {string} name - Name of the input device, which can be:
 *      - "pckbd", the computer keyboard,
 *      - "touch",
 *      - name of a MIDI input port,
 *      - "" or any falsy value, to disconnect.
 * @param {boolean} save - _true_ to call saveDeviceSetting() after connection.
 */
export function toggleInput(name, save=false) {
    if ( name && settings.device_name != name )
        connectInput(settings.device_name == name ? "" : name, save);
    else
        disconnectInput(save);
}


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
    updatePianoKeys();
    sound.stopAll(false);
    updatePedalIcons();
}

function handleControlChange(num) {
    if ( num > 63 && num < 68 ) {
        updatePianoKeys();
        sound.stopAll(false);
        updatePedalIcons();
    }
}

function handleResetMsg() {
    updatePianoKeys();
    sound.stopAll(true);
    updatePedalIcons();
}

Midi.onConnectionChange = () => {
    updatePianoKeys();
    updateToolbar();
};

Midi.onKeyPress = handleKeyPress;
Midi.onKeyRelease = handleKeyRelease;
Midi.onControlChange = handleControlChange;

KbdNotes.onKeyPress = handleKeyPress;
KbdNotes.onKeyRelease = handleKeyRelease;
KbdNotes.onSustain = handleSustainChange;
KbdNotes.onReset = handleResetMsg;


// MIDI watchdog

export function midiWatchdog() {
    const dropdown_connect_open = toolbar.dropdowns.connect.open;
    midi.queryAccess((access) => {
        if ( access == "granted" ) {
            if ( isKbdNavigatorVisible() ) updateKbdNavigator();
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

