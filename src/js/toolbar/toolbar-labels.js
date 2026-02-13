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
import { is_mobile, setHiddenAttr } from "../common.js";
import { 
    clearLabels, isLabelingModeOn, setLabelsType, toggleTonicMode, 
    toggleLabelingMode, toggleLabelsOctave, toggleLabelsPlayed,
    tonic_mode, 
} from "../markings.js";


const blinking_led = {
    timer: null,
    state: false
}


export function updateLabelsMenuAndButton() {
    updateLabelsButton();
    updateLabelsMenu();
}


export function updateLabelsButton() {
    if ( tonic_mode ) {
        blinking_led.state = !blinking_led.state;
        if ( !blinking_led.timer )
            blinking_led.timer = setInterval(updateLabelsButton, 350);
    } else if ( blinking_led.timer ) {
        clearInterval(blinking_led.timer);
        blinking_led.timer = null;
        blinking_led.state = false;
    }

    changeLed(
        toolbar.leds.labels, 
        tonic_mode ? blinking_led.state : isLabelingModeOn(),
        tonic_mode ? '#f44' : null
    );
}


export function updateLabelsMenu() {
    toolbar.menus.labels.labeling_mode.checked = isLabelingModeOn();
    toolbar.menus.labels.played.checked = settings.labels.played;
    for ( const item of toolbar.menus.labels.type.children )
        if ( item.value !== "octave" )
            item.checked = ( item.value === settings.labels.type );
    toolbar.menus.labels.type_badge.innerText = settings.labels.type_badge;
    toolbar.menus.labels.octave.disabled = ["movdo","pc","midi","freq"].includes(settings.labels.type);
    toolbar.menus.labels.octave.checked = settings.labels.octave;
    setHiddenAttr(toolbar.menus.labels.tonic, settings.labels.type !== "movdo");
    toolbar.menus.labels.tonic.checked = tonic_mode;
    // toolbar.menus.labels.tonic_badge.innerText = settings.labels.tonic_badge;
    toolbar.menus.labels.clear.disabled = (settings.labels.keys.size === 0);
}


export function attachToolbarLabelsEventListeners() {

    toolbar.dropdowns.labels.addEventListener("sl-show", updateLabelsMenu);

    toolbar.menus.labels.type
    .addEventListener("sl-select", (e) => {
        if ( e.detail.item.value === toolbar.menus.labels.octave.value )
            toggleLabelsOctave(e.detail.item.checked);
        else {
            if ( setLabelsType(e.detail.item.value) ) {
                if ( settings.labels.type === "movdo" ) {
                    toggleTonicMode(true, true);
                    toolbar.dropdowns.labels.hide();
                } else {
                    toggleTonicMode(false);
                }
            }
        }
        if ( is_mobile ) toolbar.dropdowns.labels.hide();
    });

    const labelingModeClick = () => {
        if ( tonic_mode )
            toggleTonicMode(false);
        else
            toggleLabelingMode();
        toolbar.dropdowns.labels.hide();
    }

    toolbar.menus.labels.top
    .addEventListener("sl-select", (e) => {
        if ( e.detail.item.id === toolbar.menus.labels.labeling_mode.id ) {
            labelingModeClick();
        } else if ( e.detail.item.id === toolbar.menus.labels.played.id ) {
            toggleLabelsPlayed(e.detail.item.checked);
            if ( is_mobile ) toolbar.dropdowns.labels.hide();
        } else if ( e.detail.item.id === toolbar.menus.labels.tonic.id ) {
            toggleTonicMode() && toolbar.dropdowns.labels.hide();
        }
    });
    
    toolbar.buttons.labels_left
    .addEventListener("click", labelingModeClick);
    
    toolbar.menus.labels.clear
    .addEventListener("click", () => {
        clearLabels();
    });
    
}
