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
import { settings, saveAppearanceSettings } from "../settings.js";
import { createPianoKeyboard, updatePianoTopFelt } from "../piano/piano.js";
import { is_mobile } from "../common.js";


export function updateAppearanceMenu() {
    toolbar.menus.appearance.picker_color_white.value = settings.color_white;
    toolbar.menus.appearance.picker_color_black.value = settings.color_black;
    toolbar.menus.appearance.picker_color_pressed.value = settings.color_highlight;
    toolbar.menus.appearance.item_perspective.checked = settings.perspective;
    toolbar.menus.appearance.item_perspective.hidden = settings.lowperf;
    toolbar.menus.appearance.item_top_felt.checked = settings.top_felt;
    for ( const item of toolbar.menus.appearance.highlight_opacity.children )
        item.checked = ( item.value === settings.highlight_opacity.toString() );
}


export function attachToolbarAppearanceEventListeners() {

    toolbar.dropdowns.appearance.addEventListener("sl-show", updateAppearanceMenu);
    
    toolbar.menus.appearance.highlight_opacity
    .addEventListener("sl-select", (e) => {
        settings.highlight_opacity = e.detail.item.value;
        saveAppearanceSettings();
        updateAppearanceMenu();
    });
    
    toolbar.menus.appearance.item_perspective
    .addEventListener("click", () => {
        settings.perspective = !settings.perspective;
        createPianoKeyboard();
        saveAppearanceSettings();
        if ( is_mobile ) toolbar.dropdowns.appearance.hide();
    });
    
    toolbar.menus.appearance.item_top_felt
    .addEventListener("click", () => {
        settings.top_felt = !settings.top_felt;
        updatePianoTopFelt();
        saveAppearanceSettings();
        if ( is_mobile ) toolbar.dropdowns.appearance.hide();
    });
    
    toolbar.menus.appearance.picker_color_white
    .addEventListener("sl-change", (e) => {
        settings.color_white = e.target.value;
        saveAppearanceSettings();
    });
    
    toolbar.menus.appearance.picker_color_black
    .addEventListener("sl-change", (e) => {
        settings.color_black = e.target.value;
        saveAppearanceSettings();
    });
    
    toolbar.menus.appearance.picker_color_pressed
    .addEventListener("sl-change", (e) => {
        settings.color_highlight = e.target.value;
        saveAppearanceSettings();
    });
    
}
