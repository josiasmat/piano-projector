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

import { SmplrPlayer } from "./lib/libsound.js";
import { saveSoundSetting, settings } from "./settings.js";
import { updateToolbar, updateSoundMenu } from "./toolbar.js";
import { Midi } from "./lib/libmidi.js";
import KbdNotes from "./lib/kbdnotes.js";


export const sound = {
    player: new SmplrPlayer(),
    led: null,
    fail_alert: document.getElementById("alert-sound-connection-fail"),

    get type() { return this.player.name; },
    get loaded() { return this.player.loaded; },
    get loading() { return this.type && !this.loaded; },

    play(note, vel=100) {
        this.player.play(note+settings.transpose, vel);
    },

    stop(note, force) {
        if ( force || !isNoteSustained(note) 
                && !( this.type == "apiano" && note+settings.transpose > 88 ) )
            this.player.stop(note+settings.transpose);
    },

    stopAll(force) {
        if ( force )
            this.player.stopAll();
        else
            for ( let key = 0; key < 128; key++ )
                this.stop(key, false);
    },

    load(name) {
        if ( !name ) {
            this.player.unload();
            this.led = 0;
        } else {
            this.led = 1;
            const interval = setInterval(() => {
                this.led = ( this.led == 0 ? 1 : 0 );
                updateToolbar();
            }, 400);
            const onLoadFinished = (result) => {
                clearInterval(interval);
                this.led = result ? 2 : 0;
                updateToolbar(); 
                updateSoundMenu();
            };
            this.player.load(name, () => {
                onLoadFinished(true);
                saveSoundSetting(this.type);
            }, (reason) => {
                onLoadFinished(false);
                this.fail_alert.children[1].innerText = `Reason: ${reason}`;
                this.fail_alert.toast();
            });
        }
        updateToolbar();
        updateSoundMenu();
    }

};


function isNoteSustained(note) {
    return Midi.isNoteOn(note, "both") || KbdNotes.isNoteSustained(note);
}
