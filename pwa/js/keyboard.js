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
import { midi_control, MIDI_WATCHDOG_FAST_INTERVAL, MIDI_WATCHDOG_SLOW_INTERVAL, toggleInput } from "./control.js";
import { getOpenDropdowns, toggleToolbarVisibility } from "./toolbar/toolbar.js";
import { triggerPanic } from "./panic.js";
import { setTransposition } from "./transpose.js";

import { 
    isLabelingModeOn, isAnnotationModeOn, isMarkerModeOn, setLabelType, 
    toggleLabelingMode, toggleLabelOctave, toggleLabelPlayed, 
    toggleMarkerMode, exitAnnotationMode, toggleTonicMode, tonic_mode
} from "./annotations.js";

import { 
    setNumberOfKeys, settings, switchKeyDepth, 
    togglePedalsDim, togglePedalsFollow
} from "./settings.js";
import { touch } from "./piano/piano.js";
import { i18n } from "./lib/i18n.js";


// Keyboard events

export function attachKeyboardHandlers() {
    window.addEventListener("keydown", handleKeyDown);
}


/** @param {KeyboardEvent} e */
function handleKeyDown(e) {
    if ( e.repeat ) return;
    if ( e.key === "Alt" ) {
        const open_dropdown = getOpenDropdowns();
        if ( open_dropdown ) {
            open_dropdown.hide();
            open_dropdown.querySelector("sl-button[slot=trigger]").blur();
        }
    }

    const kbd_shortcuts = new Map([
        ["f2", toggleLabelingMode],
        ["f3", toggleMarkerMode],
        ["f4", toggleTonicMode],
        ["f9", toggleToolbarVisibility],
        ["escape", () => { 
            const open_dropdown = getOpenDropdowns();
            if ( open_dropdown ) {
                open_dropdown.hide();
                open_dropdown.querySelector("sl-button[slot=trigger]").blur();
            } else if ( tonic_mode ) {
                toggleTonicMode(false);
            } else if ( isAnnotationModeOn() ) {
                exitAnnotationMode();
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
        getKbdNavigatorElement(), 
        buildKbdNavStructure()
    );

    kbdnav.onmenuenter = (s) => {
        midi_control.setWatchdog(( s === i18n.get("kbdnav-control-noampersand", "Control") )
            ? MIDI_WATCHDOG_FAST_INTERVAL 
            : MIDI_WATCHDOG_SLOW_INTERVAL);
        kbdnav.replaceStructure(buildKbdNavStructure());
    };

    kbdnav.onoptionenter = () => kbdnav.replaceStructure(buildKbdNavStructure());
    kbdnav.onshow = () => midi_control.setWatchdog(MIDI_WATCHDOG_FAST_INTERVAL);
    kbdnav.onhide = () => midi_control.setWatchdog(MIDI_WATCHDOG_SLOW_INTERVAL);

}


export function getKbdNavigatorElement() {
    return document.getElementById("keyboard-navigator");
}


export function showKbdNavigator() {
    kbdnav.show();
}


export function hideKbdNavigator() {
    kbdnav.hide();
}


export function updateKbdNavigator() {
    if ( kbdnav ) {
        kbdnav.back_label = i18n.get("kbdnav-back", "Back");
        kbdnav.replaceStructure(buildKbdNavStructure());
    }
}


export function isKbdNavigatorVisible() {
    return kbdnav?.visible ?? false;
}


export function setKbdNavVerticalPosition(value) {
    kbdnav?.container.toggleAttribute("position-top", value);
}


function buildKbdNavStructure() {
    const populateControlNav = () => {
        const list = midi_control.ports.map((p) => [
            p.name,
            () => toggleInput(p.name, true),
            {checked: ( settings.device_name == p.name )}
        ]);
        list.push([
            i18n.get("control-menu-computer-kbd", "Computer keyboard"), 
            () => toggleInput("pckbd", true), 
            {checked: settings.pc_keyboard_connected}
        ]);
        list.push([
            i18n.get("control-menu-touch-mouse", "Touch or mouse"), 
            () => toggleInput("touch", true), 
            {checked: touch.enabled}
        ]);
        return list;
    };
    const getTranspositionStr = () => {
        if ( !settings.transpose ) return i18n.get("kbdnav-not-transposed", "not transposed");
        const semitones = (settings.semitones === 1)
            ? i18n.get("kbdnav-transpose-value-semitone", "1 semitone")
            : i18n.getp("kbdnav-transpose-value-semitones", "%0 semitones", [settings.semitones]);
        const octaves = (settings.octaves === 1)
            ? i18n.get("kbdnav-transpose-value-octave", "1 octave")
            : i18n.getp("kbdnav-transpose-value-octaves", "%0 octaves", [settings.octaves]);
        return `${semitones}, ${octaves}`;
    };
    const getKeyDepthStr = () => {
        return settings.height_factor === 1.0 
            ? i18n.get("kbdnav-size-depth-full", "Full") 
            : settings.height_factor === 0.5 
                ? i18n.get("kbdnav-size-depth-3/4", "1/2") 
                : i18n.get("kbdnav-size-depth-1/2", "3/4");
    };
    const marker_mode = isMarkerModeOn();
    return [
        ['', [
            [i18n.get("kbdnav-control", "&Control"), populateControlNav()],
            // ["&Sound", sound.loading ? [["Loading...", null]] : [
            //     ["&Disabled", () => sound.load(''), {checked: (sound.type == '')}],
            //     ["&1. Acoustic piano", () => sound.load('apiano'), {checked: (sound.type === 'apiano')}],
            //     ["&2. Electric piano 1", () => sound.load('epiano1'), {checked: (sound.type === 'epiano1')}],
            //     ["&3. Electric piano 2", () => sound.load('epiano2'), {checked: (sound.type === 'epiano2')}],
            //     ["&4. Electric piano 3", () => sound.load('epiano3'), {checked: (sound.type === 'epiano3')}]
            // ]],
            [i18n.get("kbdnav-transpose", "&Transpose"), [
                [i18n.get("kbdnav-transpose-semitone-up", "[↑] Semitone up"), () => setTransposition({semitones:+1}), {noindex:true, key:'arrowup'}],
                [i18n.get("kbdnav-transpose-semitone-down", "[↓] Semitone down"), () => setTransposition({semitones:-1}), {noindex:true, key:'arrowdown'}],
                [i18n.get("kbdnav-transpose-octave-up", "[→] Octave up"), () => setTransposition({octaves:+1}), {noindex:true, key:'arrowright'}],
                [i18n.get("kbdnav-transpose-octave-down", "[←] Octave down"), () => setTransposition({octaves:-1}), {noindex:true, key:'arrowleft'}],
                [i18n.get("kbdnav-transpose-reset", "&Reset"), () => setTransposition({reset:true}), {noindex:true}],
                [i18n.getp("kbdnav-transpose-state", "State: %0", [getTranspositionStr()]), null]
            ]],
            [i18n.get("kbdnav-size", "&Size"), [
                [i18n.get("kbdnav-size-keys-88", "&88 keys"), () => setNumberOfKeys(88), {noindex: true, checked: (settings.number_of_keys === 88)}],
                [i18n.get("kbdnav-size-keys-61", "&61 keys"), () => setNumberOfKeys(61), {noindex: true, checked: (settings.number_of_keys === 61)}],
                [i18n.get("kbdnav-size-keys-49", "&49 keys"), () => setNumberOfKeys(49), {noindex: true, checked: (settings.number_of_keys === 49)}],
                [i18n.get("kbdnav-size-keys-37", "&37 keys"), () => setNumberOfKeys(37), {noindex: true, checked: (settings.number_of_keys === 37)}],
                [i18n.get("kbdnav-size-keys-25", "&25 keys"), () => setNumberOfKeys(25), {noindex: true, checked: (settings.number_of_keys === 25)}],
                [i18n.getp("kbdnav-size-depth", "Change key &depth (current: %0)", [getKeyDepthStr()]), () => switchKeyDepth(), {noindex: true}]
            ]],
            [i18n.get("kbdnav-pedals", "&Pedals"), [
                [i18n.get("kbdnav-pedals-follow", "&Follow pedals"), () => togglePedalsFollow(), {checked: settings.pedals}],
                [i18n.get("kbdnav-pedals-dim", "&Dim pedalized notes"), () => togglePedalsDim(), {checked: settings.pedal_dim}]
            ]],
            [i18n.get("kbdnav-label", "&Label"), [
                [i18n.get("kbdnav-label-labeling-mode", "&Toggle Labeling mode (F2)"), () => toggleLabelingMode(), {checked: isLabelingModeOn()}],
                [i18n.get("kbdnav-label-format", "&Format"), [
                    [i18n.get("kbdnav-label-format-english", "&English"), () => setLabelType("english"), {checked: settings.labels.type === "english"}],
                    [i18n.get("kbdnav-label-format-german", "&German"), () => setLabelType("german"), {checked: settings.labels.type === "german"}],
                    [i18n.get("kbdnav-label-format-italian", "&Italian"), () => setLabelType("italian"), {checked: settings.labels.type === "italian"}],
                    [i18n.get("kbdnav-label-format-movdo", "&Solfège"), () => setLabelType("movdo"), {checked: settings.labels.type === "movdo"}],
                    [i18n.get("kbdnav-label-format-pc", "&Pitch-class"), () => setLabelType("pc"), {checked: settings.labels.type === "pc"}],
                    [i18n.get("kbdnav-label-format-midi", "&MIDI value"), () => setLabelType("midi"), {checked: settings.labels.type === "midi"}],
                    [i18n.get("kbdnav-label-format-freq", "&Frequency"), () => setLabelType("freq"), {checked: settings.labels.type === "freq"}],
                    [i18n.get("kbdnav-label-octave", "Show &octave"), () => toggleLabelOctave(), {checked: settings.labels.octave}]
                ]],
                [i18n.get("kbdnav-label-played-keys", "&Show on played keys"), () => toggleLabelPlayed(), {checked: settings.labels.played}],
                [i18n.get("kbdnav-label-clear", "&Clear"), () => settings.labels.clear()],
            ]],
            [i18n.get("kbdnav-mark", "Stic&kers"), [
                [i18n.get("kbdnav-mark-red", "&Red"), () => toggleMarkerMode(undefined, "red"), {checked: marker_mode && settings.markers.color === "red"}],
                [i18n.get("kbdnav-mark-yellow", "&Yellow"), () => toggleMarkerMode(undefined, "yellow"), {checked: marker_mode && settings.markers.color === "yellow"}],
                [i18n.get("kbdnav-mark-green", "&Green"), () => toggleMarkerMode(undefined, "green"), {checked: marker_mode && settings.markers.color === "green"}],
                [i18n.get("kbdnav-mark-blue", "&Blue"), () => toggleMarkerMode(undefined, "blue"), {checked: marker_mode && settings.markers.color === "blue"}],
                [i18n.get("kbdnav-mark-violet", "&Violet"), () => toggleMarkerMode(undefined, "violet"), {checked: marker_mode && settings.markers.color === "violet"}],
                [i18n.get("kbdnav-mark-clear", "&Clear"), () => settings.markers.clear()],
            ]],
            [i18n.get("kbdnav-panic", "Panic!"), triggerPanic],
            [(settings.toolbar 
                ? i18n.get("kbdnav-hide-toolbar", "Hide toolbar [<u>F9</u>]")
                : i18n.get("kbdnav-show-toolbar", "Show toolbar [<u>F9</u>]")
             ), toggleToolbarVisibility, {key: "f9"}]
        ]]
    ];
}
