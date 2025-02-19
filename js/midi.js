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

    /**
     * Queries access to MIDI instruments.
     * @param {Function} callback_granted 
     * @param {Function} callback_denied 
     * @param {Function} callback_prompt 
     */
    queryMidiAccess(callback_granted, callback_denied, callback_prompt) {
        navigator.permissions.query({ name: "midi", sysex: false })
        .then((perm) => {
            switch ( perm.state ) {
                case "granted":
                    if ( callback_granted ) callback_granted();
                    break;
                case "denied":
                    if ( callback_denied ) callback_denied();
                    break;
                default:
                    if ( callback_prompt ) callback_prompt();
            }
        });
    },

    /**
     * Request access to MIDI instruments.
     * @param {(MIDIInput[])} callback_ok
     * @param {Function} callback_fail 
     */
    requestMidiAccess(callback_granted, callback_denied) {
        navigator.requestMIDIAccess().then(callback_granted, callback_denied);
    },

    /**
     * Request the list of available MIDI ports (devices).
     * @param {(MIDIInput[])} callback_ok - A function accepting an array
     *      of MIDIInput objects.
     * @param {Function} callback_fail 
     */
    requestInputPortList(callback_ok, callback_fail) {
        navigator.requestMIDIAccess().then((access) => {
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
     * @param {number[]} channels - Defaults to all channels.
     */
    connect(port, channels=ALL_CHANNELS) {
        this.disconnect();
        midi_state.channels = Array.from(channels);
        midi_state.dev = port;
        port.addEventListener("midimessage", handleMIDIEvent);
    },

    disconnect() {
        if ( midi_state.dev ) {
            midi_state.dev.removeEventListener("midimessage", handleMIDIEvent);
            midi_state.dev = null;
            midi_state.channels = [];
            midi_state.reset();
        }
    },

    /** @returns {MIDIInput?} */
    getConnectedPort() {
        return midi_state.dev;
    },

    isKeyPressed(key) {
        return midi_state.keys[key];
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
                return midi_state.keys[key] || midi_state.sustain[key];
            case "sostenuto":
                return midi_state.keys[key] || midi_state.sostenuto[key];
            case "both":
                return midi_state.keys[key] || midi_state.sustain[key] || midi_state.sostenuto[key];
            default:
                return midi_state.keys[key];
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
    }

}

const midi_state = {
    dev: null,
    channels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],

    cc: Array(128).fill(0),
    keys: Array(128).fill(false),
    pcs: Array(12).fill(0),
    sustain: Array(128).fill(false),
    sostenuto: Array(128).fill(false),

    pedals: {
        threshold: 64,
        get sustain() { return midi_state.cc[64] >= this.threshold; },
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
    if ( !midi_state[key] ) {
        midi_state.keys[key] = true;
        midi_state.pcs[pc] += 1;
    }
    if ( midi_state.pedals.sustain )
        midi_state.sustain[key] = true;
    if ( Midi.onKeyPress ) 
        Midi.onKeyPress(key, velocity);
    if ( Midi.onPitchClassOn && midi_state.pcs[pc] == 1 )
        Midi.onPitchClassOn(pc);
}


/** @param {Number} key */
function setNoteOff(key, velocity) {
    // console.log(`Note off: ${key}`);
    const pc = key%12;
    midi_state.keys[key] = false;
    midi_state.pcs[pc] -= 1;
    if ( Midi.onKeyRelease )
        Midi.onKeyRelease(key, velocity);
    if ( Midi.onPitchClassOff && midi_state.pcs[pc] == 0 )
        Midi.onPitchClassOff(pc);
}


function setCC(number, value) {
    const previous_value = midi_state.cc[number];
    midi_state.cc[number] = value;
    const thresholdPass = (threshold) => {
        if ( previous_value < threshold && value >= threshold )
            return 1;
        else if ( previous_value >= threshold && value < threshold )
            return -1;
        else
            return 0;
    };

    if ( number == 66 ) {
        const threshold_pass = thresholdPass(midi_state.pedals.threshold);
        if ( threshold_pass == 1 ) {
            for ( let key = 0; key < 128; key++ )
                midi_state.sostenuto[key] = midi_state.keys[key];
        } else if ( threshold_pass == -1 ) {
            for ( let key = 0; key < 128; key++ )
                midi_state.sostenuto[key] = false;
        }
        if ( threshold_pass != 0 && Midi.onSostenutoPedal )
            Midi.onSostenutoPedal(midi_state.sostenuto, value);
    }

    if ( number == 64 ) {
        const threshold_pass = thresholdPass(midi_state.pedals.threshold);
        if ( threshold_pass == 1 ) {
            for ( let key = 0; key < 128; key++ )
                midi_state.sustain[key] = midi_state.keys[key] || midi_state.sostenuto[key];
        } else if ( threshold_pass == -1 ) {
            for ( let key = 0; key < 128; key++ )
                midi_state.sustain[key] = false;
        }
        if ( threshold_pass != 0 && Midi.onSustainPedal )
            Midi.onSustainPedal(midi_state.sustain, value);
    }

    if ( number == 123 )
        for ( let key = 0; key < 128; key++ )
            setNoteOff(key);
        
    if ( Midi.onControlChange ) 
        Midi.onControlChange(number, value);
}


function setAllNotesOff() {
    midi_state.reset();
}


function midiPanic() {
    midi_state.reset();
}


export default Midi;
