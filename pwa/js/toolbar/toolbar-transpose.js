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
import { settings } from "../settings.js";
import { is_mobile, setDisabledAttr } from "../common.js";
import { setTransposition } from "../transpose.js";


export function updateTransposeButton() {
    changeLed(toolbar.leds.transpose, ( settings.transpose !== 0 ));
}


export function updateTransposeMenuAndButton() {
    toolbar.menus.transpose.semitones.input.value = settings.semitones;
    toolbar.menus.transpose.octaves.input.value = settings.octaves;
    setDisabledAttr(toolbar.menus.transpose.item_reset, settings.transpose === 0);
    updateTransposeButton();
}


export function attachToolbarTransposeEventListeners() {

    toolbar.dropdowns.transpose.addEventListener("sl-show", updateTransposeMenuAndButton);

    toolbar.menus.transpose.semitones.btn_plus
    .addEventListener("click", () => setTransposition({ semitones: +1 }));
    
    toolbar.menus.transpose.semitones.btn_minus
    .addEventListener("click", () => setTransposition({ semitones: -1 }));
    
    toolbar.menus.transpose.octaves.btn_plus
    .addEventListener("click", () => setTransposition({ octaves: +1 }));
    
    toolbar.menus.transpose.octaves.btn_minus
    .addEventListener("click", () => setTransposition({ octaves: -1 }));
    
    toolbar.menus.transpose.item_reset
    .addEventListener("click", () => {
         setTransposition({ reset: true }) ;
         if ( is_mobile ) toolbar.dropdowns.transpose.hide();
    });

}
