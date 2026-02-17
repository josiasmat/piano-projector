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

import { 
    midi_control, togglePcKeyboardConnection, toggleTouchConnection, toggleInput,
    MIDI_WATCHDOG_SLOW_INTERVAL, MIDI_WATCHDOG_FAST_INTERVAL
} from "../control.js";

import { changeLed, toolbar, updateToolbar } from "./toolbar.js";
import { Midi } from "../lib/libmidi.js";
import { is_mobile, setHiddenAttr, setCheckedAttr } from "../common.js";
import { cloneTemplate } from "../lib/utils.js";
import { settings, saveDeviceSetting } from "../settings.js";
import { touch } from "../piano/piano.js";


export function updateControlButton() {
    changeLed(toolbar.leds.control, 
            ( settings.pc_keyboard_connected || touch.enabled 
              || ( settings.device_name && Midi.getConnectedPort() )));
}


export function updateControlMenu() {

    setHiddenAttr(toolbar.menus.control.denied, midi_control.access !== "denied");
    setHiddenAttr(toolbar.menus.control.unavailable, is_mobile || midi_control.access !== "unavailable");
    setHiddenAttr(toolbar.menus.control.prompt, midi_control.access !== "prompt" );
    setHiddenAttr(toolbar.menus.control.divider, 
        (midi_control.access === "granted" && !midi_control.ports?.length) 
        || ( is_mobile && midi_control.access === "unavailable")
    );

    setCheckedAttr(toolbar.menus.control.kbd, settings.pc_keyboard_connected);
    setCheckedAttr(toolbar.menus.control.touch, touch.enabled);

    if ( midi_control.access !== "granted" ) {
        midi_control.clearMenuItems();
        return;
    }

    // Add menu items for new ports
    for ( const port of midi_control.ports ?? [] ) {
        if ( !midi_control.menu_items.some((menu_item) =>
                port.name === menu_item.value,
        ) ) {
            const new_menu_item = cloneTemplate(
                toolbar.menus.control.template, 
                { value: port.name }, port.name
            );
            // menu item click event handler
            new_menu_item.addEventListener("click", (e) => {
                toggleInput(e.currentTarget.value, true);
            });
            toolbar.menus.control.top
            .insertBefore(new_menu_item, toolbar.menus.control.divider);
        }
    }

    // Check/uncheck menu items, and remove obsolete ports
    for ( const menu_item of midi_control.menu_items ?? [] ) {
        if ( midi_control.ports?.some((port) => menu_item.value === port.name) ) {
            setCheckedAttr(menu_item, menu_item.value === midi_control.connected_port?.name);
        } else{
            menu_item.remove();
        }
    }

}


export function attachToolbarControlEventListeners() {

    toolbar.dropdowns.control.addEventListener("sl-show", () => {
        midi_control.queryAccess((access) => {
            updateControlMenu();
            if ( ["granted", "prompt"].includes(access) )
                midi_control.requestAccess((result) => {
                    updateControlMenu();
                    midi_control.setWatchdog(MIDI_WATCHDOG_FAST_INTERVAL);
                    if ( result )
                        midi_control.requestPorts(updateControlMenu);
                });
        });
    });

    toolbar.dropdowns.control.addEventListener("sl-hide", () => {
        midi_control.setWatchdog(MIDI_WATCHDOG_SLOW_INTERVAL);
        updateToolbar();
    });

    toolbar.menus.control.kbd.addEventListener("click", () => {
        togglePcKeyboardConnection();
        saveDeviceSetting();
    });
    
    toolbar.menus.control.touch.addEventListener("click", () => {
        toggleTouchConnection();
        saveDeviceSetting();
    });
    
}
