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
import { saveAnnotationSettings, settings } from "../settings.js";
import { 
    isMarkerModeOn, toggleMarkerMode, tonic_mode
} from "../annotations.js";


export function updateMarkersMenuAndButton() {
    updateMarkersButton();
    updateMarkersMenu();
}


export function updateMarkersButton() {
    changeLed(toolbar.leds.markers, isMarkerModeOn() && !tonic_mode, {
        red: "red", yellow: "yellow", green: "#0b0", blue: "blue", violet: "violet"
    }[settings.markers.color]);
}


export function updateMarkersMenu() {
    const marker_mode_on = isMarkerModeOn();
    for ( const item of toolbar.menus.markers.top.children )
        if ( item.getAttribute("type") === "checkbox" ) {
            const is_current_color = (item.value === settings.markers.color);
            item.checked = ( marker_mode_on && is_current_color );
            item.querySelector(".menu-keyboard-shortcut")
                .classList.toggle("invisible", !is_current_color);
        }
    toolbar.menus.markers.clear.disabled = (settings.markers.keys.size === 0);
}


export function attachToolbarMarkersEventListeners() {

    toolbar.dropdowns.markers.addEventListener("sl-show", updateMarkersMenu);

    toolbar.menus.markers.top
    .addEventListener("sl-select", (e) => {
        if ( e.detail.item.getAttribute("type") === "checkbox" ) {
            toggleMarkerMode(undefined, e.detail.item.value);
            toolbar.dropdowns.markers.hide();
        }
        saveAnnotationSettings();
    });
    
    toolbar.buttons.markers_left
    .addEventListener("click", () => {
        toggleMarkerMode();
    });
    
    toolbar.menus.markers.clear
    .addEventListener("click", () => {
        settings.markers.clear();
    });
    
}
