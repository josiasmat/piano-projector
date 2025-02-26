/*
Simple MIDI input library
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


const ALL_CHANNELS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

export const Midi = {

    onKeyPress: null,
    onKeyRelease: null,
    onPitchClassOn: null,
    onPitchClassOff: null,

    onControlChange: null,
    onSustainPedal: null,
    onSostenutoPedal: null,

    onReset: null,

    /** @type {(Boolean, MIDIPort)} */
    onConnectionChange: null,

    get browserHasMidiSupport() {
        return !!navigator.requestMIDIAccess;
    },

    /**
     * Queries access to MIDI instruments.
     * @param {Function} callback_granted 
     * @param {Function} callback_denied 
     * @param {Function} callback_prompt 
     * @param {Function} callback_unavailable
     */
    queryMidiAccess(callback_granted, callback_denied, callback_prompt, callback_unavailable) {
        if ( !this.browserHasMidiSupport ) {
            callback_unavailable?.();
            return false;
        }
        navigator.permissions.query({ name: "midi", sysex: false })
        .then((perm) => {
            switch ( perm.state ) {
                case "granted":
                    callback_granted?.();
                    break;
                case "prompt":
                    callback_prompt?.();
                    break;
                default:
                    callback_denied?.();
            }
        });
        return true;
    },

    /**
     * Request access to MIDI instruments.
     * @param {(MIDIInput[])} callback_ok
     * @param {Function} callback_fail 
     */
    requestMidiAccess(callback_granted, callback_fail=null) {
        navigator.requestMIDIAccess({sysex: false})
        .then(callback_granted, callback_fail);
    },

    /**
     * Request the list of available MIDI ports (devices).
     * @param {(MIDIInput[])} callback_ok - A function accepting an array
     *      of MIDIInput objects.
     * @param {Function} callback_fail 
     */
    requestInputPortList(callback_ok, callback_fail) {
        navigator.requestMIDIAccess({sysex: false})
        .then((access) => {
            const ports = [];
            if ( access.inputs.size > 0 ) {
                for ( const port of access.inputs.values() )
                    ports.push(port);
            }
            callback_ok(ports);
        }, callback_fail);
    },

    /**
     * Connect to a MIDI input port.
     * @param {MIDIInput} port 
     * @param {(MIDIPort)} callback_connected
     * @param {number[]} channels - Defaults to all channels.
     */
    connect(port, callback_connected=null, channels=ALL_CHANNELS) {
        this.disconnect();
        port.open().then(() => {
            midi_state.dev = port;
            port.addEventListener("midimessage", handleMIDIEvent);
            callback_connected?.(port);
            this.onConnectionChange?.(true, port);
        });
        midi_state.channels = Array.from(channels);
    },

    /**
     * Connect to a MIDI input port by port name.
     * @param {string} port_name
     * @param {(MIDIPort)} callback_connected
     * @param {number[]} channels - Defaults to all channels.
     */
    connectByPortName(port_name, callback_connected=null, channels=ALL_CHANNELS) {
        this.requestInputPortList((ports) => {
            for ( const port of ports ) {
                if ( port.name == port_name ) {
                    this.disconnect();
                    port.open().then((connected_port) => {
                        midi_state.dev = connected_port;
                        connected_port.addEventListener("midimessage", handleMIDIEvent);
                        callback_connected?.(connected_port);
                        this.onConnectionChange?.(true, connected_port);
                    });
                    midi_state.channels = Array.from(channels);
                }
            }
        });
    },

    /**
     * Connect to a MIDI input port by port id.
     * @param {string} port_id
     * @param {(MIDIPort)} callback_connected
     * @param {number[]} channels - Defaults to all channels.
     */
    connectByPortId(port_id, callback_connected=null, channels=ALL_CHANNELS) {
        this.requestInputPortList((ports) => {
            for ( const port of ports ) {
                if ( port.id == port_id ) {
                    this.disconnect();
                    port.open().then((connected_port) => {
                        midi_state.dev = connected_port;
                        connected_port.addEventListener("midimessage", handleMIDIEvent);
                        callback_connected?.(connected_port);
                        this.onConnectionChange?.(true, connected_port);
                    });
                    midi_state.channels = Array.from(channels);
                }
            }
        });
    },

    disconnect() {
        const port = midi_state.dev;
        if ( port ) {
            midi_state.dev.removeEventListener("midimessage", handleMIDIEvent);
            port.removeEventListener("statechange", onMidiPortStateChange);
            midi_state.dev.close();
            midi_state.dev = null;
            midi_state.channels = [];
            midi_state.reset();
            this.onConnectionChange(false, port);
        }
    },

    /** @returns {MIDIInput?} */
    getConnectedPort() {
        return ( midi_state.dev?.state == "connected" )
            ? midi_state.dev : null;
    },

    isKeyPressed(key) {
        if ( key < 0 || key > 127 ) return false;
        return midi_state.keys[key]
               || (midi_state.pckbd.enabled && midi_state.pckbd.keys.has(key) );
    },

    /**
     * @param {number} key - 0-127
     * @param {string} pedals - If piano pedals should be considered for
     *      counting a key as pressed or not. Use one of the following values:
     *      "none", "sustain", "sostenuto" or "both".
     * @returns {boolean}
     */
    isNoteOn(key, pedals="none") {
        if ( key < 0 || key > 127 ) return false;
        switch ( pedals ) {
            case "sustain":
                return this.isKeyPressed(key) || midi_state.sustain[key];
            case "sostenuto":
                return this.isKeyPressed(key) || midi_state.sostenuto[key];
            case "both":
                return this.isKeyPressed(key) || midi_state.sustain[key] || midi_state.sostenuto[key];
            default:
                return this.isKeyPressed(key);
        }
    },

    /**
     * @param {number} pc - 0-11
     * @param {string} pedals - If piano pedals should be considered for
     *      counting a key as pressed or not. Use ne of the following values:
     *      "none", "sustain", "sostenuto" or "both".
     * @returns {boolean}
     */
    isPitchClassOn(pc, pedals="none") {
        for ( let key = pc; key < 128; key += 12 ) {
            if ( this.isNoteOn(key, pedals) )
                return true;
        }
        return false;
    },

    /**
     * @param {number} cc - 0-127
     * @returns {number} - 0-127
     */
    getLastControlValue(cc) {
        return midi_state.cc[cc];
    },

    reset() {
        midi_state.reset();
    },

    setPedalThreshold(value) {
        midi_state.pedals.threshold = value;
    },

    get sustain() {
        return (midi_state.pckbd.enabled && midi_state.pckbd.sustain)
               || midi_state.cc[64];
    },

    get pc_keyboard_enabled() {
        return midi_state.pckbd.enabled;
    },

    set pc_keyboard_enabled(value) {
        midi_state.pckbd.enabled = value;
        if ( value ) {
            window.addEventListener("keydown", handlePcKeyDown);
            window.addEventListener("keyup", handlePcKeyUp);
        } else {
            window.removeEventListener("keydown", handlePcKeyDown);
            window.removeEventListener("keyup", handlePcKeyUp);
            midi_state.pckbd.sustain = false;
            this.onSustainPedal?.(false);
            for ( const key of midi_state.pckbd.keys )
                this.onKeyRelease?.(key);
            midi_state.pckbd.keys.clear();
        }
    },

}

function onMidiPortStateChange(e) {
    if ( e.port.state == "disconnected" && midi_state.dev == e.port )
        midi_state.dev = null;
    Midi.onConnectionChange?.(e.port.state == "connected", e.port);
}

const midi_state = {
    /** @type {MIDIInput} */
    dev: null,
    channels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],

    pckbd: {
        enabled: false,
        keys: new Set([]),
        sustain: false,
        velocity: 88,
        map: new Map([
            ['KeyZ',48], ['KeyS',49], ['KeyX',50], ['KeyD',51], ['KeyC',52], ['KeyV',53], 
            ['KeyG',54], ['KeyB',55], ['KeyH',56], ['KeyN',57], ['KeyJ',58], ['KeyM',59],
            ['KeyW',60], ['Digit3',61], ['KeyE',62], ['Digit4',63], ['KeyR',64], ['KeyT',65],
            ['Digit6',66], ['KeyY',67], ['Digit7',68], ['KeyU',69], ['Digit8',70], ['KeyI',71],
            ['KeyO',72], ['Digit0',73], ['KeyP',74], ['KeyQ',59], ['Digit1',58], ['Comma',60], 
            ['KeyL',61], ['Period',62], ['Semicolon',63], ['Slash',64], ['IntlRo',65],
            ['Backslash',66], ['Minus',75], ['BracketLeft',76], ['BracketRight',77],
            ['IntlBackslash',47]
        
        ]),
    },

    cc: Array(128).fill(0),
    keys: Array(128).fill(false),
    pcs: Array(12).fill(0),
    sustain: Array(128).fill(false),
    sostenuto: Array(128).fill(false),

    pedals: {
        threshold: 64,
        get sustain() { 
            return ( midi_state.pckbd.enabled && midi_state.pckbd.sustain )
                     || ( midi_state.cc[64] >= this.threshold ); 
        },
        get sostenuto() { return midi_state.cc[66] >= this.threshold; },
        get soft() { return midi_state.cc[67] >= this.threshold; }
    },

    last_event_timestamp : 0,
    last_event_time_delta : 0,

    reset() {
        this.cc = Array(128).fill(0);
        this.keys = Array(128).fill(false);
        this.pcs = Array(12).fill(0);
        this.sustain = Array(128).fill(false);
        this.sostenuto = Array(128).fill(false);
    }
}


/** @param {MIDIMessageEvent} ev */
function handleMIDIEvent(ev) {
    // console.log(`Received MIDI data: ${ev.data}`);
    midi_state.last_event_time_delta = ev.timeStamp - midi_state.last_event_timestamp;
    midi_state.last_event_timestamp = ev.timeStamp;
    for ( const ch of midi_state.channels ) {
        switch ( ev.data[0] ) {
            case 0x90 + ch:
                setNoteOn(ev.data[1], ev.data[2]);
                break;
            case 0x80 + ch:
                setNoteOff(ev.data[1], ev.data[2]);
                break;
            case 0xB0 + ch:
                setCC(ev.data[1], ev.data[2]);
        }
    }
}


/** @param {Number} key */
function setNoteOn(key, velocity) {
    // console.log(`Note on: ${key}`);
    const pc = key%12.
    if ( !midi_state.keys[key] ) {
        midi_state.keys[key] = true;
        midi_state.pcs[pc] += 1;
    }
    if ( midi_state.pedals.sustain )
        midi_state.sustain[key] = true;
    Midi.onKeyPress?.(key, velocity);
    if ( midi_state.pcs[pc] == 1 )
        Midi.onPitchClassOn?.(pc);
}


/** @param {Number} key */
function setNoteOff(key, velocity) {
    // console.log(`Note off: ${key}`);
    const pc = key%12;
    if ( midi_state.keys[key] ) {
        midi_state.keys[key] = false;
        midi_state.pcs[pc] -= 1;
    }
    Midi.onKeyRelease?.(key, velocity);
    if ( midi_state.pcs[pc] == 0 )
        Midi.onPitchClassOff?.(pc);
}


function setSustain(value, continuous=false) {
    const sustain_state = ( typeof(value) === "boolean" ) 
        ? value : value >= midi_state.pedals.threshold;
    if ( midi_state.pedals.sustain != sustain_state ) {
        if ( sustain_state ) {
            for ( let key = 0; key < 128; key++ )
                midi_state.sustain[key] = 
                    midi_state.keys[key] 
                    || ( midi_state.pckbd.enabled && midi_state.pckbd.keys.has(key) )
                    || midi_state.sostenuto[key];
            Midi.onSustainPedal?.(sustain_state, value);
        } else {
            for ( let key = 0; key < 128; key++ )
                midi_state.sustain[key] = false;
            Midi.onSustainPedal?.(sustain_state, value);
        }
    } else if ( continuous ) {
        Midi.onSustainPedal?.(sustain_state, value);
    }
}


function setSostenuto(value, continuous=false) {
    if ( !midi_state.pedals.sostenuto && value >= midi_state.pedals.threshold ) {
        for ( let key = 0; key < 128; key++ )
            midi_state.sostenuto[key] = midi_state.keys[key] || midi_state.pckbd.keys.has(key);
        Midi.onSostenutoPedal?.(midi_state.pedals.sostenuto, value);
    } else if ( midi_state.pedals.sostenuto && value < midi_state.pedals.threshold ) {
        for ( let key = 0; key < 128; key++ )
            midi_state.sostenuto[key] = false;
        Midi.onSostenutoPedal?.(midi_state.pedals.sostenuto, value);
    } else if ( continuous ) {
        Midi.onSostenutoPedal?.(midi_state.pedals.sostenuto, value);
    }
}


function setCC(number, value) {
    midi_state.cc[number] = value;

    if ( number == 66 ) setSostenuto(value);
    if ( number == 64 ) setSustain(value);

    if ( number == 123 )
        for ( let key = 0; key < 128; key++ )
            setNoteOff(key);
        
    Midi.onControlChange?.(number, value);
}


function handlePcKeyDown(e) {
    if ( e.ctrlKey || e.altKey ) return;
    if ( e.code.startsWith("Shift") ) {
        e.preventDefault();
        setSustain(true);
        midi_state.pckbd.sustain = true;
        Midi.onSustainPedal?.(true);
    }
    if ( midi_state.pckbd.map.has(e.code) ) {
        e.preventDefault();
        if ( e.repeat ) return;
        const key = midi_state.pckbd.map.get(e.code);
        midi_state.pckbd.keys.add(key);
        if ( midi_state.pedals.sustain )
            midi_state.sustain[key] = true;
        Midi.onKeyPress?.(key, midi_state.pckbd.velocity);
    }
}

function handlePcKeyUp(e) {
    if ( e.code.startsWith("Shift") && !e.shiftKey ) {
        e.preventDefault();
        setSustain(false);
        midi_state.pckbd.sustain = false;
        Midi.onSustainPedal?.(false);
    }
    if ( midi_state.pckbd.map.has(e.code) ) {
        e.preventDefault();
        if ( e.repeat ) return;
        const key = midi_state.pckbd.map.get(e.code);
        midi_state.pckbd.keys.delete(key);
        Midi.onKeyRelease?.(key);
    }
}


function setAllNotesOff() {
    midi_state.reset();
}


function midiPanic() {
    midi_state.reset();
}


/**
 * @param {string} note_str 
 * @returns {number}
 */
export function noteToMidi(note_str) {
    const NOTES = {
        'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3, 'e': 4, 'fb': 4, 
        'e#': 5, 'f': 5, 'f#': 6, 'gb': 6, 'g': 7, 'g#': 8, 'ab': 8, 'a': 9,
        'a#': 10, 'bb': 10, 'b': 11, 'b#': 12, 'cb': -1
    }
    const pc = NOTES[note_str.slice(0, note_str.length-1).toLowerCase()];
    const octave = parseInt(note_str.slice(note_str.length-1));
    return pc + 12*(octave+1);
}


export default Midi;
