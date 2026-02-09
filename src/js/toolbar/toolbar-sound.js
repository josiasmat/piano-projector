/*
Piano Projector
Copyright (C) 2026 Josias Matschulat

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

import { toolbar, changeLed } from "./toolbar.js";
import { sound } from "../sound.js";
import { setLoadingAttr, setDisabledAttr } from "../common.js";


export function updateSoundButton() {
    changeLed(toolbar.leds.sound, sound.led, (sound.led === 1 ? "red" : null));
}


export function updateSoundMenu() {
    if ( sound.loading ) {
        for ( const item of toolbar.menus.sound.items ) {
            const is_selected_sound = item.getAttribute("value") === sound.type;
            setLoadingAttr(item, is_selected_sound);
            setDisabledAttr(item, !is_selected_sound);
            item.checked = false;
        }
    } else {
        for ( const item of toolbar.menus.sound.items ) {
            const is_selected_sound = item.getAttribute("value") === sound.type;
            item.checked = is_selected_sound;
            setLoadingAttr(item, false);
            setDisabledAttr(item, false);
        }
    }
}


export function attachToolbarSoundEventListeners() {
    
    toolbar.dropdowns.sound.addEventListener("sl-show", updateSoundMenu);

    toolbar.menus.sound.top.addEventListener("sl-select", (e) => {
        sound.load(e.detail.item.value);
        // already called by sound.load(): saveSoundSetting(e.detail.item.value);
    });

}
