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
import { settings, setGraphicsQuality, changeLanguage, resetSettings } from "../settings.js";
import { is_mobile } from "../common.js";
import { i18n } from "../lib/i18n.js";
import { newElement } from "../lib/utils.js";


export function updateOptionsMenu() {
    // Populate languages
    for ( const { code, name } of Object.values(i18n.getAvailableLanguages()) ) {
        if ( !toolbar.menus.options.language[code] ) {
            const menu_item = newElement("sl-menu-item", {
                type: "checkbox",
                value: code,
            }, name);
            toolbar.menus.options.language[code] = menu_item;
            toolbar.menus.options.language.top.appendChild(menu_item);
        }
        toolbar.menus.options.language[code].checked = (settings.language === code)
    }

    for ( const item of toolbar.menus.options.graphics_quality.children )
        item.checked = ( item.value === settings.graphics_quality.toString() );
}


export function attachToolbarOptionsEventListeners() {

    toolbar.dropdowns.options
    .addEventListener("sl-show", () => {
        updateOptionsMenu();
        toolbar.tooltips.options.trigger = "manual";
        toolbar.tooltips.options.hide();
        setTimeout(() => toolbar.tooltips.options.hide(), 200);
    });

    toolbar.dropdowns.options
    .addEventListener("sl-hide", () => {
        toolbar.tooltips.options.trigger = "hover";
    });

    toolbar.menus.options.language.top
    .addEventListener("sl-select", (e) => {
        changeLanguage(e.detail.item.value);
        if ( is_mobile ) toolbar.dropdowns.options.hide();
    });
    
    toolbar.menus.options.graphics_quality
    .addEventListener("sl-select", (e) => {
        setGraphicsQuality(parseInt(e.detail.item.value));
        if ( is_mobile ) toolbar.dropdowns.options.hide();
    });
    
    toolbar.menus.options.reset
    .addEventListener("click", () => 
        resetSettings(true)
    );
    
}
