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

import { toolbar, changeLed, updateToolbarBasedOnWidth } from "./toolbar.js";
import { settings, savePedalSettings } from "../settings.js";
import { is_mobile, setDisabledAttr, setHiddenAttr } from "../common.js";
import { touch, updatePianoKeys } from "../piano/piano.js";
import KbdNotes from "../lib/kbdnotes.js";
import Midi from "../lib/libmidi.js";


export function updatePedalsButton() {
    updatePedalIcons();
    if ( toolbar.dropdowns.pedals.hasAttribute("hidden")
         !== setHiddenAttr(toolbar.dropdowns.pedals, touch.enabled) )
        updateToolbarBasedOnWidth();
}


export function updatePedalsMenu() {
    toolbar.menus.pedals.item_follow.checked = settings.pedals;
    toolbar.menus.pedals.item_dim.checked = settings.pedal_dim;
    setDisabledAttr(toolbar.menus.pedals.item_dim, !settings.pedals);
}


export function updatePedalIcons() {
    changeLed(toolbar.leds.pedal_r, KbdNotes.isSustainActive() || Midi.sustain_pedal_value / 127);
    changeLed(toolbar.leds.pedal_m , Midi.sostenuto_pedal_value / 127);
    changeLed(toolbar.leds.pedal_l, Midi.soft_pedal_value / 127);
}


export function attachToolbarPedalsEventListeners() {

    toolbar.dropdowns.pedals.addEventListener("sl-show", updatePedalsMenu);

    toolbar.menus.pedals.top
    .addEventListener("sl-select", (e) => {
        const item = e.detail.item;
        switch ( item.id ) {
            case "mi-pedals-follow": settings.pedals = item.checked; break;
            case "mi-pedals-dim": settings.pedal_dim = item.checked; break;
        }
        setDisabledAttr(toolbar.menus.pedals.item_dim, !settings.pedals);
        updatePedalIcons();
        updatePianoKeys();
        savePedalSettings();
        if ( is_mobile ) toolbar.dropdowns.pedals.hide();
    });
    
}
