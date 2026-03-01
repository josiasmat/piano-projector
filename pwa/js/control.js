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

import { Midi } from "./lib/libmidi.js";
import { 
    toolbar, updateControlButton, updateControlMenu, updatePedalIcons, updateToolbar 
} from "./toolbar/toolbar.js";
import { saveDeviceSetting, settings, writeSessionSettings } from "./settings.js";
import { KbdNotes } from "./lib/kbdnotes.js";
import { touch } from "./piano/piano.js";
import { updatePianoKeys, updateNote, updatePiano } from "./piano/piano.js";
import { isKbdNavigatorVisible, updateKbdNavigator } from "./keyboard.js";
import { sound } from "./sound.js";
import { is_firefox } from "./common.js";


export const midi_control = {
    /** @type {MIDIInput[]} */
    ports: [],
    /** @returns {HTMLElement[]} */
    get menu_items() {
        return toolbar.menus.control.getMidiItems();
    },
    /** @type {MIDIInput?} */
    get connected_port() {
        return Midi.getConnectedPort();
    },
    /** "granted", "denied", "prompt", "unavailable" */
    access: "unavailable",
    /** @param {(string)} callback */
    queryMidiAccess(callback = null) {
        Midi.queryMidiAccess(result => { 
            if ( result === "prompt" ) {
                if ( this.readMidiAccessFirefox() === "granted" )
                    this.access = "granted";
                else
                    this.access = result;
                callback?.(this.access);
            } else {
                this.access = result; 
                this.saveMidiAccessFirefox(result);
                callback?.(this.access);
            }
        });
    },
    /** @param {(boolean)} callback */
    requestMidiAccess(callback = null) {
        Midi.requestMidiAccess( 
            () => { 
                this.access = "granted";
                this.saveMidiAccessFirefox("granted");
                callback?.(true);
            },
            () => { 
                this.access = "denied";
                this.saveMidiAccessFirefox("prompt");
                callback?.(false); 
            }
        );
    },
    // Workaround for Firefox, because it returns "prompt"
    // if permission was granted temporarily
    /** @param {string} access */
    saveMidiAccessFirefox(access) {
        if ( is_firefox ) {
            settings.midi_access_firefox = access;
            writeSessionSettings();
        }
    },
    /** @returns {string|null} */
    readMidiAccessFirefox() {
        if ( is_firefox && settings.midi_access_firefox !== "" )
            return settings.midi_access_firefox;
        return "prompt";
    },
    /** @param {(MIDIInput[])} callback */
    requestMidiPorts(callback = null) {
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
    setWatchdog(force = false) {
        if ( toolbar.dropdowns.control.open || force ) {
            this.startWatchdogFast();
        } else {
            if ( ["pckbd","touch"].includes(settings.device_name) )
                this.stopWatchdog();
            else if ( settings.device_name && !midi_control.connected_port )
                this.startWatchdogMedium();
            else
                this.startWatchdogSlow();
        }
    },
    stopWatchdog() {
        if ( this.watchdog_id ) clearTimeout(this.watchdog_id);
        this.watchdog_id = null;
    },
    startWatchdogFast()   { this.startWatchdog(250);  },
    startWatchdogMedium() { this.startWatchdog(1000); },
    startWatchdogSlow()   { this.startWatchdog(2000); },
    startWatchdog(delay_ms) {
        if ( this.watchdog_id ) clearTimeout(this.watchdog_id);
        this.watchdog_id = setTimeout(this.runWatchdog, delay_ms);
    },
    runWatchdog() {
        this.watchdog_id = null;
        checkMidiState();
    }
};


export function togglePcKeyboardConnection(value=null) {
    if ( value == null ) 
        value = !settings.pc_keyboard_connected;
    if ( value )
        connectInput("pckbd");
    else
        disconnectInput();
}


export function toggleTouchConnection(value=null) {
    if ( value == null ) 
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
            // settings.labels.transposed = true;
            updateToolbar();
            updatePiano();
            if ( save ) saveDeviceSetting();
            break;
        case "touch":
            KbdNotes.disable();
            touch.enable();
            settings.device_name = "touch";
            // settings.labels.transposed = false;
            updateToolbar();
            updatePianoKeys();
            if ( save ) saveDeviceSetting();
            break;
        default:
            KbdNotes.disable();
            touch.disable();
            settings.device_name = name;
            // settings.labels.transposed = true;
            updateToolbar();
            updatePianoKeys();
            Midi.connectByPortName(name, () => {
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
    if ( name && settings.device_name !== name )
        connectInput(name, save);
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

export async function checkMidiState() {
    // Workaround for Firefox, because it returns "prompt"
    // if permission was granted temporarily, so the access
    // result is stored in a session variable.
    if ( is_firefox ) {
        if ( midi_control.access === "granted" )
            midi_control.requestMidiAccess(
                result => checkMidiStateInternal(result)
            );
        else
            checkMidiStateInternal(false);
    } else {
        midi_control.queryMidiAccess(
            access => checkMidiStateInternal(access === "granted")
        );
    }
}


/** @param {boolean} midi_access_granted */
function checkMidiStateInternal(midi_access_granted) {
    const updateControlUI = () => {
        updateControlButton();
        if ( toolbar.dropdowns.control.open ) 
            updateControlMenu();
        if ( isKbdNavigatorVisible() ) 
            updateKbdNavigator();
    }
    if ( midi_access_granted ) {
        midi_control.requestMidiPorts( (ports) => {
            midi_control.ports = ports;
            if ( settings.device_name 
                 && !["pckbd","touch"].includes(settings.device_name)
            ) {
                if ( !Midi.getConnectedPort() ) {
                    const reconnected_port = 
                        ports.find((p) => p.name === settings.device_name);
                    if ( reconnected_port )
                        Midi.connect(reconnected_port, () => updateControlUI());
                }
            }
            updateControlUI();
        });
    } else {
        Midi.disconnect();
        updateControlUI();
    }
    midi_control.setWatchdog();
}
