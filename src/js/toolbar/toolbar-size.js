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

import { toolbar } from "./toolbar.js";
import { settings, setKeyDepth, setNumberOfKeys } from "../settings.js";
import { is_mobile, setHiddenAttr } from "../common.js";


export function updateSizeMenu() {
    for ( const elm of toolbar.dropdowns.size.querySelectorAll(".btn-number-of-keys") ) {
        const checked = ( parseInt(elm.value) === settings.number_of_keys );
        elm.variant = checked ? "neutral" : null;
    }
    for ( const elm of toolbar.dropdowns.size.querySelectorAll(".btn-key-depth") ) {
        const checked = ( parseFloat(elm.value) === settings.height_factor );
        elm.variant = checked ? "neutral" : null;
    }
}


export function enable20KeysBtn(value = true) {
    setHiddenAttr(
        toolbar.menus.size.querySelector('.btn-number-of-keys[value="20"]'),
        !value
    );
}


export function attachToolbarSizeEventListeners() {

    toolbar.dropdowns.size.addEventListener("sl-show", updateSizeMenu);

    toolbar.dropdowns.size.querySelectorAll(".btn-number-of-keys")
    .forEach((item) => {
        item.addEventListener("click", (e) => {
            setNumberOfKeys(parseInt(e.currentTarget.value));
            if ( is_mobile ) toolbar.dropdowns.size.hide();
        });
    });
    
    toolbar.dropdowns.size.querySelectorAll(".btn-key-depth")
    .forEach((item) => {
        item.addEventListener("click", (e) => {
            setKeyDepth(parseFloat(e.currentTarget.value));
            if ( is_mobile ) toolbar.dropdowns.size.hide();
        });
    });
    
}
