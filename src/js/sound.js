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

import { 
    CacheStorage as SmplrCacheStorage, 
    SplendidGrandPiano, 
    ElectricPiano,
    Versilian
} from 'smplr/dist/index.mjs';


/** @type {AudioContext?} */
let audio_ctx = null;


class InternalSoundPlayer {
    loaded = false;
    name = "";
    default_vel = 100;

    load(name, callback_ok = null, callback_fail = null) {};
    unload() {};

    play(note, vel=this.default_vel) {};
    stop(note) {};
    stopAll() {};
}

export class SmplrPlayer extends InternalSoundPlayer {
    player = null;
    instruments = {
        apiano:  { loader: SplendidGrandPiano, options: { volume: 90 } },
        epiano1: { loader: ElectricPiano, 
                   options: { instrument: "TX81Z", volume: 127 } },
        epiano2: { loader: ElectricPiano, 
                   options: { instrument: "WurlitzerEP200", volume: 70 } },
        epiano3: { loader: ElectricPiano, 
                   options: { instrument: "CP80", volume: 70 } },
        harpsi:  { loader: Versilian, 
                   options: { instrument: "Chordophones/Zithers/Harpsichord, Unk", volume: 100 } },
    }
    cache = new SmplrCacheStorage("sound_v1");;

    play(note, vel=this.default_vel) {
        if ( this.name == "epiano1" ) note += 12;
        else if ( this.name == "harpsi" ) vel = 127;
        this.player?.start({ note, velocity: vel });
    }

    stop(note) {
        if ( this.name == "epiano1" ) note += 12;
        this.player?.stop(note);
    }

    stopAll() {
        this.player?.stop();
    }

    unload() {
        this.stopAll();
        this.player = null;
        this.name = "";
        this.loaded = false;
    }

    load(name, callback_ok = null, callback_fail = null) {
        this.stopAll();
        if ( !name ) {
            this.unload();
            callback_ok("");
        } else {
            if ( !Object.hasOwn(this.instruments, name) ) {
                callback_fail(`Instrument ${name} not found.`);
                return;
            }
            if ( !audio_ctx ) audio_ctx = new AudioContext();
            const params = this.instruments[name];
            params.storage = this.cache;
            this.player = new params.loader(audio_ctx, params.options);
            this.loaded = false;
            this.name = name;
            this.player.load.then(() => {
                this.loaded = true;
                audio_ctx.resume();
                callback_ok(name);
            }, (reason) => {
                this.player = null;
                this.name = "";
                callback_fail(reason);
            });
        }
    }

}
