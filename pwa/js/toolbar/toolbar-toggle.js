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

import { toolbar, updateToolbar } from "./toolbar.js";
import { updatePianoPosition } from "../piano/piano.js";
import { settings, writeSessionSettings } from "../settings.js";
import { setHiddenAttr } from "../common.js";


export function toggleToolbarVisibility() {
    settings.toolbar = !settings.toolbar;
    updateToolbar();
    updatePianoPosition();
    writeSessionSettings();
}


export function updateToolbarToggleButton() {
    setHiddenAttr(toolbar.buttons.show_toolbar, settings.toolbar);
}


export function attachToolbarToggleEventListeners() {
    toolbar.buttons.hide_toolbar.addEventListener("click", toggleToolbarVisibility);
    toolbar.buttons.show_toolbar.addEventListener("click", toggleToolbarVisibility);
}
