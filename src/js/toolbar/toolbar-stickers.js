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
import { saveLabelsAndStickersSettings, settings } from "../settings.js";
import { 
    isStickerModeOn, toggleStickerMode, tonic_mode
} from "../markings.js";


export function updateStickersMenuAndButton() {
    updateStickersButton();
    updateStickersMenu();
}


export function updateStickersButton() {
    changeLed(toolbar.leds.stickers, isStickerModeOn() && !tonic_mode, {
        red: "red", yellow: "yellow", green: "#0b0", blue: "blue", violet: "violet"
    }[settings.stickers.color]);
}


export function updateStickersMenu() {
    const sticker_mode_on = isStickerModeOn();
    for ( const item of toolbar.menus.stickers.top.children )
        if ( item.getAttribute("type") === "checkbox" ) {
            const is_current_color = (item.value === settings.stickers.color);
            item.checked = ( sticker_mode_on && is_current_color );
            item.querySelector(".menu-keyboard-shortcut")
                .classList.toggle("invisible", !is_current_color);
        }
    toolbar.menus.stickers.clear.disabled = (settings.stickers.keys.size === 0);
}


export function attachToolbarStickersEventListeners() {

    toolbar.dropdowns.stickers.addEventListener("sl-show", updateStickersMenu);

    toolbar.menus.stickers.top
    .addEventListener("sl-select", (e) => {
        if ( e.detail.item.getAttribute("type") === "checkbox" ) {
            toggleStickerMode(undefined, e.detail.item.value);
            toolbar.dropdowns.stickers.hide();
        }
        saveLabelsAndStickersSettings();
    });
    
    toolbar.buttons.stickers_left
    .addEventListener("click", () => {
        toggleStickerMode();
    });
    
    toolbar.menus.stickers.clear
    .addEventListener("click", () => {
        settings.stickers.clear();
    });
    
}
