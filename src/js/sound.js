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
    Versilian,
    Soundfont2Sampler
} from 'smplr/dist/index.mjs';

import { SoundFont2 } from "soundfont2";


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
    sfCreator = () => { (data) => new SoundFont2(data) };
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
        organ1:  { loader: Soundfont2Sampler, 
                   options: { createSoundfont: (data) => new SoundFont2(data), 
                              url: "/assets/sf/organ.sf2", patch: "b3slow", volume: 70 } },
        organ2:  { loader: Soundfont2Sampler, 
                   options: { createSoundfont: (data) => new SoundFont2(data), 
                              url: "/assets/sf/organ.sf2", patch: "b3fast", volume: 70 } },
        organ3:  { loader: Soundfont2Sampler, 
                   options: { createSoundfont: (data) => new SoundFont2(data), 
                              url: "/assets/sf/organ.sf2", patch: "percorg", volume: 60 } },
    }
    cache = new SmplrCacheStorage("sound_v1");;

    play(note, vel=this.default_vel) {
        if ( this.name == "epiano1" ) note += 12;
        else if ( this.name == "harpsi" || this.name.startsWith("organ") ) vel = 127;
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
            this.loaded = false;
            this.name = name;
            this.player = new params.loader(audio_ctx, params.options);
            this.player.load.then(() => {
                if ( Object.hasOwn(params.options, "patch") )
                    this.player.loadInstrument(params.options.patch);
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
