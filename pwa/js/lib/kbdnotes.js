/*
Piano Projector - Keyboard to MIDI notes module
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


export const KbdNotes = {
    
    /** @type {(note: number, velocity: number)} */
    onKeyPress: null,
    /** @type {(note: number)} */
    onKeyRelease: null,
    /** @type {(value: boolean)} */
    onSustain: null,
    /** @type {()} */
    onReset: null,

    get enabled() {
        return internal_state.enabled;
    },

    get velocity() {
        return internal_state.velocity;
    },

    /** Key press velocity. Must be a value between 0 and 127. */
    set velocity(value) {
        if ( value < 0 )   value = 0;
        if ( value > 127 ) value = 127;
        internal_state.velocity = value;
    },

    /**
     * Enables note input from keyboard.
     * @param {(note: number, velocity: number)} on_key_press 
     * @param {(note: number)} on_key_release 
     * @param {(value: boolean)} on_sustain 
     * @param {()} on_reset 
     */
    enable(on_key_press=null, on_key_release=null, on_sustain=null, on_reset=null) {
        if ( on_key_press )   this.onKeyPress   = on_key_press;
        if ( on_key_release ) this.onKeyRelease = on_key_release;
        if ( on_sustain )     this.onSustain    = on_sustain;
        if ( on_reset )       this.onReset      = on_reset;
        kbdInputEnable();
    },

    /** Disables note input from keyboard. */
    disable() {
        kbdInputDisable();
    },

    isNotePressed(note) {
        return internal_state.pressed_keys.has(note);
    },

    isNoteSustained(note, include_pedal = true) {
        return internal_state.pressed_keys.has(note)
            || (include_pedal && internal_state.sustain_keys.has(note));
    },

    isSustainActive() {
        return internal_state.sustain;
    },

    resetState() {
        internal_state.reset();
        this.onReset?.();
    }

};


const internal_state = {
    enabled: false,
    pressed_keys: new Set([]),
    sustain_keys: new Set([]),
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
    reset() {
        this.pressed_keys.clear();
        this.sustain_keys.clear();
        this.sustain = false;
    }
};


function kbdInputEnable() {
    if ( !internal_state.enabled ) {
        internal_state.enabled = true;
        window.addEventListener("keydown", handlePcKeyDown);
        window.addEventListener("keyup", handlePcKeyUp);
    }
}


function kbdInputDisable() {
    if ( internal_state.enabled ) {
        window.removeEventListener("keydown", handlePcKeyDown);
        window.removeEventListener("keyup", handlePcKeyUp);
        internal_state.enabled = false;
        internal_state.reset();
    }
}


function playNote(note) {
    internal_state.pressed_keys.add(note);
    if ( internal_state.sustain )
        internal_state.sustain_keys.add(note);
    KbdNotes.onKeyPress?.(note, internal_state.velocity);
}


function releaseNote(note) {
    internal_state.pressed_keys.delete(note);
    KbdNotes.onKeyRelease?.(note);
}


function changeSustain(value) {
    if ( internal_state.sustain != value ) {
        internal_state.sustain = value;
        if ( value )
            for ( const item of internal_state.pressed_keys )
                internal_state.sustain_keys.add(item);
        else
            internal_state.sustain_keys.clear();
        KbdNotes.onSustain(value);
    }
}


function handlePcKeyDown(e) {
    if ( e.ctrlKey || e.altKey ) return;
    if ( e.code.startsWith("Shift") ) {
        e.preventDefault();
        changeSustain(true);
    } else if ( internal_state.map.has(e.code) ) {
        e.preventDefault();
        if ( e.repeat ) return;
        const key = internal_state.map.get(e.code);
        playNote(key);
    }
}


function handlePcKeyUp(e) {
    if ( e.code.startsWith("Shift") && !e.shiftKey ) {
        e.preventDefault();
        changeSustain(false);
    }
    if ( internal_state.map.has(e.code) ) {
        e.preventDefault();
        if ( e.repeat ) return;
        const key = internal_state.map.get(e.code);
        releaseNote(key);
    }
}


export default KbdNotes;
