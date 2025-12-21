/*
Piano Projector
Copyright (C) 2025 Josias Matschulat

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

import { KbdNav } from "./lib/libkbdnav.js";
import { midi, MIDI_WATCHDOG_FAST_INTERVAL, MIDI_WATCHDOG_SLOW_INTERVAL, toggleInput } from "./connect.js";
import { getOpenDropdowns, toggleToolbarVisibility } from "./toolbar.js";
import { triggerPanic } from "./panic.js";
import { setTransposition } from "./transpose.js";

import { 
    clearStickers, getLabelsCurrentPresetOption, isLabelingModeOn, isMarkingModeOn, isStickerModeOn, setLabelsPreset, 
    setLabelsType, setMarkingMode, toggleLabelingMode, 
    toggleLabelsOctave, toggleLabelsPlayed, toggleStickerMode 
} from "./markings.js";

import { 
    setNumberOfKeys, settings, switchKeyDepth, 
    togglePedalsDim, togglePedalsFollow
} from "./settings.js";
import { touch } from "./piano.js";


// Keyboard events

window.addEventListener("keydown", handleKeyDown);


/** @param {KeyboardEvent} e */
function handleKeyDown(e) {
    if ( e.repeat ) return;
    if ( e.key == "Alt" ) {
        const open_dropdown = getOpenDropdowns();
        if ( open_dropdown ) {
            open_dropdown.hide();
            open_dropdown.querySelector("sl-button[slot=trigger]").blur();
        }
    }

    const kbd_shortcuts = new Map([
        ["f2", toggleLabelingMode],
        ["f3", toggleStickerMode],
        ["f9", toggleToolbarVisibility],
        ["escape", () => { 
            const open_dropdown = getOpenDropdowns();
            if ( open_dropdown ) {
                open_dropdown.hide();
                open_dropdown.querySelector("sl-button[slot=trigger]").blur();
            } else if ( isMarkingModeOn() ) {
                setMarkingMode(null);
            } else
                triggerPanic();
        }],
        ["pageup", () => setTransposition({ semitones: +1 })],
        ["pagedown", () => setTransposition({ semitones: -1 })],
        ["shift+pageup", () => setTransposition({ octaves: +1 })],
        ["shift+pagedown", () => setTransposition({ octaves: -1 })],
    ]);

    let comb = [];
    if ( e.ctrlKey  ) comb.push("ctrl");
    if ( e.altKey   ) comb.push("alt");
    if ( e.shiftKey ) comb.push("shift");
    comb.push(e.key.toLowerCase());
    const k = comb.join("+");
    if ( kbd_shortcuts.has(k) ) {
        e.preventDefault();
        kbd_shortcuts.get(k)();
    }
}


// Keyboard navigator

/** @type {KbdNav?} */
var kbdnav = null;

export function initializeKbdNavigator() {
    kbdnav = new KbdNav(
        document.getElementById("keyboard-navigator"), 
        buildKbdNavStructure()
    );

    kbdnav.onmenuenter = (s) => {
        midi.setWatchdog(( s == "Control" ) 
            ? MIDI_WATCHDOG_FAST_INTERVAL 
            : MIDI_WATCHDOG_SLOW_INTERVAL);
        kbdnav.replaceStructure(buildKbdNavStructure());
    };

    kbdnav.onoptionenter = () => kbdnav.replaceStructure(buildKbdNavStructure());
    kbdnav.onshow = () => midi.setWatchdog(MIDI_WATCHDOG_FAST_INTERVAL);
    kbdnav.onhide = () => midi.setWatchdog(MIDI_WATCHDOG_SLOW_INTERVAL);

}


export function updateKbdNavigator() {
    kbdnav?.replaceStructure(buildKbdNavStructure());
}


export function isKbdNavigatorVisible() {
    return kbdnav?.visible ?? false;
}


export function setKbdNavVerticalPosition(value) {
    kbdnav?.container.toggleAttribute("position-top", value);
}


function buildKbdNavStructure() {
    const populateControlNav = () => {
        const list = midi.ports.map((p) => [
            p.name,
            () => toggleInput(p.name, true),
            {checked: ( settings.device_name == p.name )}
        ]);
        list.push([
            "Computer keyboard", 
            () => toggleInput("pckbd", true), 
            {checked: settings.pc_keyboard_connected}
        ]);
        list.push([
            "Touch or mouse", 
            () => toggleInput("touch", true), 
            {checked: touch.enabled}
        ]);
        return list;
    };
    const getTranspositionStr = () => {
        if ( !settings.transpose ) return "not transposed";
        const semitones = `${settings.semitones} semitone${settings.semitones != 1 ? 's' : ''}`;
        const octaves = `${settings.octaves} octave${settings.octaves != 1 ? 's' : ''}`;
        return `${semitones}, ${octaves}`;
    };
    const getKeyDepthStr = () => {
        return settings.height_factor == 1.0 ? "Full" : settings.height_factor == 0.5 ? "1/2" : "3/4";
    };
    const labels_preset = getLabelsCurrentPresetOption();
    const sticker_mode = isStickerModeOn();
    return [
        ['', [
            ["&Control", populateControlNav()],
            // ["&Sound", sound.loading ? [["Loading...", null]] : [
            //     ["&Disabled", () => sound.load(''), {checked: (sound.type == '')}],
            //     ["&1. Acoustic piano", () => sound.load('apiano'), {checked: (sound.type == 'apiano')}],
            //     ["&2. Electric piano 1", () => sound.load('epiano1'), {checked: (sound.type == 'epiano1')}],
            //     ["&3. Electric piano 2", () => sound.load('epiano2'), {checked: (sound.type == 'epiano2')}],
            //     ["&4. Electric piano 3", () => sound.load('epiano3'), {checked: (sound.type == 'epiano3')}]
            // ]],
            ["&Transpose", [
                ["[↑] Semitone up", () => setTransposition({semitones:+1}), {noindex:true, key:'arrowup'}],
                ["[↓] Semitone down", () => setTransposition({semitones:-1}), {noindex:true, key:'arrowdown'}],
                ["[→] Octave up", () => setTransposition({octaves:+1}), {noindex:true, key:'arrowright'}],
                ["[←] Octave down", () => setTransposition({octaves:-1}), {noindex:true, key:'arrowleft'}],
                ["&Reset", () => setTransposition({reset:true}), {noindex:true}],
                [`State: ${getTranspositionStr()}`, null]
            ]],
            ["&Size", [
                ["&88 keys", () => setNumberOfKeys(88), {noindex: true, checked: (settings.number_of_keys == 88)}],
                ["&61 keys", () => setNumberOfKeys(61), {noindex: true, checked: (settings.number_of_keys == 61)}],
                ["&49 keys", () => setNumberOfKeys(49), {noindex: true, checked: (settings.number_of_keys == 49)}],
                ["&37 keys", () => setNumberOfKeys(37), {noindex: true, checked: (settings.number_of_keys == 37)}],
                ["&25 keys", () => setNumberOfKeys(25), {noindex: true, checked: (settings.number_of_keys == 25)}],
                [`Change key &depth (current: ${getKeyDepthStr()})`, () => switchKeyDepth(), {noindex: true}]
            ]],
            ["&Pedals", [
                ["&Follow pedals", () => togglePedalsFollow(), {checked: settings.pedals}],
                ["&Dim pedalized notes", () => togglePedalsDim(), {checked: settings.pedal_dim}]
            ]],
            ["&Labels", [
                ["&Toggle Labeling mode (F2)", () => toggleLabelingMode(), {checked: isLabelingModeOn()}],
                ["&Show on played keys", () => toggleLabelsPlayed(), {checked: settings.labels.played}],
                ["&Presets", [
                    ["&None", () => setLabelsPreset("none"), {checked: labels_preset == "none"}],
                    ["&Middle-C", () => setLabelsPreset("mc"), {checked: labels_preset == "mc"}],
                    ["&C-keys", () => setLabelsPreset("cs"), {checked: labels_preset == "cs"}],
                    ["&White keys", () => setLabelsPreset("white"), {checked: labels_preset == "white"}],
                    ["&All keys", () => setLabelsPreset("all"), {checked: labels_preset == "all"}],
                ]],
                ["&Format", [
                    ["&English", () => setLabelsType("english"), {checked: settings.labels.type == "english"}],
                    ["&German", () => setLabelsType("german"), {checked: settings.labels.type == "german"}],
                    ["&Italian", () => setLabelsType("italian"), {checked: settings.labels.type == "italian"}],
                    ["&Pitch-class", () => setLabelsType("pc"), {checked: settings.labels.type == "pc"}],
                    ["&MIDI value", () => setLabelsType("midi"), {checked: settings.labels.type == "midi"}],
                    ["&Frequency", () => setLabelsType("freq"), {checked: settings.labels.type == "freq"}],
                    ["Show &octave", () => toggleLabelsOctave(), {checked: settings.labels.octave}]
                ]],
            ]],
            ["Stic&kers", [
                ["&Red", () => toggleStickerMode(undefined, "red"), {checked: sticker_mode && settings.stickers.color == "red"}],
                ["&Yellow", () => toggleStickerMode(undefined, "yellow"), {checked: sticker_mode && settings.stickers.color == "yellow"}],
                ["&Green", () => toggleStickerMode(undefined, "green"), {checked: sticker_mode && settings.stickers.color == "green"}],
                ["&Blue", () => toggleStickerMode(undefined, "blue"), {checked: sticker_mode && settings.stickers.color == "blue"}],
                ["&Violet", () => toggleStickerMode(undefined, "violet"), {checked: sticker_mode && settings.stickers.color == "violet"}],
                ["&Clear", () => clearStickers()],
            ]],
            ["Panic!", triggerPanic],
            [`${settings.toolbar ? "Hide" : "Show"} toolbar [<u>F9</u>]`, toggleToolbarVisibility, {key: "f9"}]
        ]]
    ];
}
