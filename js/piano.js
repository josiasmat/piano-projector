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

const KBD_HEIGHT = 500;
const STROKE_WIDTH = 1.5;
const WHITE_KEY_GAP = 1.5;
const BLACK_KEY_GAP = 2.5;
const BK_OFFSET = 0.13;
const WHITE_KEY_PRESSED_FACTOR = 1.01;

import SvgTools from "./svgtools.js";

const WHITE_NOTE = [1,0,1,0,1,1,0,1,0,1,0,1];
const BK_OFFSETS = [,-BK_OFFSET,,+BK_OFFSET,,,-1.4*BK_OFFSET,,0,,+1.4*BK_OFFSET,];


/**
 * @param {SVGElement} svg - SVG element where to draw the piano keyboard
 * @param {[SVGElement?]} keys - Array of keys
 * @param {[SVGElement?]} labels - Array of labels
 * @param {Object} options - Object that acceps the following properties:
 *      - first_key (integer)
 *      - last_key (integer)
 *      - height_factor (float)
 *      - perspective (boolean)
 *      - top_felt (boolean)
 */
export function drawPianoKeyboard(svg, keys, labels, options = {}) {

    const height = KBD_HEIGHT;
    const height_factor = options.height_factor ?? 1.0;

    const first_key = options.first_key ?? noteToMidi("a0");
    const last_key = options.last_key ?? noteToMidi("c8");
    const keys_count = last_key - first_key;
    const kbd_center = (first_key + last_key) / 2;

    const white_key_height = height * height_factor;
    const black_key_height = white_key_height * (0.14 * height_factor + 0.51);

    const stroke_width_half = STROKE_WIDTH / 2;
    const white_key_gap_half = WHITE_KEY_GAP / 2;
    
    const white_key_width = height * 2.2 / 15.5;
    const black_key_width = height * 1.4 / 15.5;
    const white_key_width_half = white_key_width / 2;
    const black_key_width_half = black_key_width / 2;

    const white_key_rounding = white_key_width / 15;
    const black_key_rounding = black_key_width / 30;

    const white_key_highlight_inset = 2;
    const black_key_highlight_inset = 2;

    const top_felt = {
        top: -4,
        height: 7,
        get bottom() { return this.top + this.height }
    }
    
    const white_key_top = top_felt.bottom-1;
    const black_key_top = top_felt.bottom-5;
    const black_key_base_top = top_felt.bottom+1;
    const black_key_top1 = black_key_top + (black_key_base_top - black_key_top) / 4;

    const black_key_bevel = {
        bottom_height: black_key_width/1.8*(Math.max(height_factor-0.5,0)/2+0.75),
        bottom_height1: 0,
        side_width_bottom: STROKE_WIDTH*4,
        side_width_top: STROKE_WIDTH*2,
        side_width_min: 0,
        side_width_max: 0
    }
    black_key_bevel.side_width_min = Math.min(black_key_bevel.side_width_top,
                                              black_key_bevel.side_width_bottom);
    black_key_bevel.side_width_max = Math.max(black_key_bevel.side_width_top,
                                              black_key_bevel.side_width_bottom);
    black_key_bevel.bottom_height1 = black_key_bevel.bottom_height / 2;

    svg.innerHTML = "";

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

    function drawWhiteKey(key, note, offset, width, height, round) {
        const left = offset + stroke_width_half + white_key_gap_half;
        const right = offset + width - stroke_width_half - white_key_gap_half;
        const height1 = height * WHITE_KEY_PRESSED_FACTOR;
        const cut_point = black_key_height + stroke_width_half + BLACK_KEY_GAP;
        const cut_point1 = cut_point * WHITE_KEY_PRESSED_FACTOR;

        const black_before = key > first_key && [2,4,7,9,11].includes(note);
        const black_after = key < last_key && [0,2,5,7,9].includes(note);
        
        const left_offset = offset + stroke_width_half + ( black_before 
            ? black_key_width_half + (black_key_width * BK_OFFSETS[note-1]) + BLACK_KEY_GAP 
            : white_key_gap_half );
        const right_offset = offset + width - stroke_width_half - ( black_after 
            ? black_key_width_half - (black_key_width * BK_OFFSETS[note+1]) + BLACK_KEY_GAP 
            : white_key_gap_half );

        const round_quarter = round/4;

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "key white-key", value: key });

        const key_fill = makeDualPath([
                'M', left_offset, white_key_top,
                'H', right_offset,
                black_after ? [
                    'V', cut_point,
                    'H', right
                ] : null,
                'V', height-round,
                'Q', right-round_quarter, height-round_quarter, right-round, height,
                'H', left+round,
                'Q', left+round_quarter, height-round_quarter, left, height-round,
                black_before ? [
                    'V', cut_point,
                    'H', left_offset
                ] : null,
                'Z'
            ], [
                'M', left_offset, white_key_top,
                'H', right_offset,
                black_after ? [
                    'V', cut_point1,
                    'H', right
                ] : null,
                'V', height1-round,
                'Q', right-round_quarter, height1-round_quarter, right-round, height1,
                'H', left+round,
                'Q', left+round_quarter, height1-round_quarter, left, height1-round,
                black_before ? [
                    'V', cut_point1,
                    'H', left_offset
                ] : null,
                'Z'
            ],
            { class: "key-fill" }
        );

        const inset = white_key_highlight_inset;
        const key_highlight = makeDualPath([
                'M', left_offset+inset, white_key_top-stroke_width_half,
                'H', right_offset-inset, 
                black_after ? [
                    'V', cut_point+inset,
                    'H', right-inset
                ] : null,
                'V', height-inset-round+stroke_width_half,
                'Q', right-round_quarter-inset+stroke_width_half, height-round_quarter-inset,
                     right-round-inset+stroke_width_half, height-inset,
                'H', left+inset+round-stroke_width_half,
                'Q', left+round_quarter+inset, height-inset-round_quarter+stroke_width_half,
                     left+inset, height-inset-round+stroke_width_half,
                black_before ? [
                    'V', cut_point+inset,
                    'H', left_offset+inset
                ] : null,
                'Z'
            ], [
                'M', left_offset+inset, white_key_top-stroke_width_half,
                'H', right_offset-inset, 
                black_after ? [
                    'V', cut_point1+inset,
                    'H', right-inset
                ] : null,
                'V', height1-inset-round+stroke_width_half,
                'Q', right-round_quarter-inset+stroke_width_half, height1-round_quarter-inset,
                     right-round-inset+stroke_width_half, height1-inset,
                'H', left+inset+round-stroke_width_half,
                'Q', left+round_quarter+inset, height1-inset-round_quarter+stroke_width_half,
                     left+inset, height1-inset-round+stroke_width_half,
                black_before ? [
                    'V', cut_point1+inset,
                    'H', left_offset+inset
                ] : null,
                'Z'
            ],
            { class: "key-highlight", fill: 'url("#pressed-white-key-highlight-gradient")' }
        );

        const light_border = makeDualPath([
                'M', left_offset, white_key_top+stroke_width_half,
                black_before ? [
                    'V', cut_point,
                    'H', left
                ] : null,
                'L', left, height-round-stroke_width_half,
                black_after ? [
                    'M', right, cut_point,
                    'H', right_offset
                ] : null
            ], [
                'M', left_offset, white_key_top+stroke_width_half,
                black_before ? [
                    'V', cut_point1,
                    'H', left
                ] : null,
                'L', left, height1-round-stroke_width_half,
                black_after ? [
                    'M', right, cut_point1,
                    'H', right_offset
                ] : null
            ],
            { class: "key-light-border white-key-border" }
        );

        const dark_border = makeDualPath([
                'M', left, height-round,
                'Q', left+round_quarter, height-round_quarter, left+round, height,
                'H', right-round,
                'Q', right-round_quarter, height-round_quarter, right, height-round,
                black_after ? [
                    'V', cut_point,
                    'M', right_offset, cut_point,
                ] : null,
                'V', white_key_top+stroke_width_half
            ], [
                'M', left, height1-round,
                'Q', left+round_quarter, height1-round_quarter, left+round, height1,
                'H', right-round,
                'Q', right-round_quarter, height1-round_quarter, right, height1-round,
                black_after ? [
                    'V', cut_point1,
                    'M', right_offset, cut_point1,
                ] : null,
                'V', white_key_top+stroke_width_half
            ],
            { class: "key-dark-border white-key-border" }
        );

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(dark_border);
        key_group.appendChild(light_border);
        return key_group;
    }

    function computeLateralDisplacement(key) {
        if ( !options.perspective || WHITE_NOTE[key%12] ) return 0;
        // Restrict maximum displacement based on number of keys
        const perspective_factor = (key - kbd_center) / ((88 + keys_count) / 4);
        return perspective_factor * black_key_bevel.side_width_max;
    }

    function drawBlackKey(key, offset, width, height, round, white_gap) {
        const left = offset;
        const right = left + width;
        const round_half = round/2;
        const round_quarter = round/4;

        const lateral_displacement = computeLateralDisplacement(key) * 1.5;
        const lateral_displacement1_bottom = lateral_displacement/2;
        const lateral_displacement1_top = lateral_displacement/1.2;

        const side_bevel = options.perspective ? {
            left_top: Math.max(0, black_key_bevel.side_width_top + lateral_displacement),
            left_bottom: Math.max(0, black_key_bevel.side_width_bottom + lateral_displacement),
            right_top: Math.max(0, black_key_bevel.side_width_top - lateral_displacement),
            right_bottom: Math.max(0, black_key_bevel.side_width_bottom - lateral_displacement),
            left_top1: Math.max(0, black_key_bevel.side_width_top + lateral_displacement1_top),
            left_bottom1: Math.max(0, black_key_bevel.side_width_bottom + lateral_displacement1_bottom),
            right_top1: Math.max(0, black_key_bevel.side_width_top - lateral_displacement1_top),
            right_bottom1: Math.max(0, black_key_bevel.side_width_bottom - lateral_displacement1_bottom)
        } : {
            left_top: black_key_bevel.side_width_top,
            left_bottom: black_key_bevel.side_width_bottom,
            right_top: black_key_bevel.side_width_top,
            right_bottom: black_key_bevel.side_width_bottom,
            left_top1: black_key_bevel.side_width_top,
            left_bottom1: black_key_bevel.side_width_bottom,
            right_top1: black_key_bevel.side_width_top,
            right_bottom1: black_key_bevel.side_width_bottom
        };

        const body = options.perspective ? {
            left_top: Math.min(left, left + black_key_bevel.side_width_top + lateral_displacement),
            left_bottom: Math.min(left, left + black_key_bevel.side_width_bottom + lateral_displacement),
            right_top: Math.max(right, right - black_key_bevel.side_width_top + lateral_displacement),
            right_bottom: Math.max(right, right - black_key_bevel.side_width_bottom + lateral_displacement),
            left_top1: Math.min(left, left + black_key_bevel.side_width_top + lateral_displacement1_top),
            left_bottom1: Math.min(left, left + black_key_bevel.side_width_bottom + lateral_displacement1_bottom),
            right_top1: Math.max(right, right - black_key_bevel.side_width_top + lateral_displacement1_top),
            right_bottom1: Math.max(right, right - black_key_bevel.side_width_bottom + lateral_displacement1_bottom)
        } : {
            left_top: left,
            left_bottom: left,
            right_top: right,
            right_bottom: right,
            left_top1: left,
            left_bottom1: left,
            right_top1: right,
            right_bottom1: right
        }

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: "key black-key", value: key });

        const key_fill = makeDualPath([
                'M', body.left_top, black_key_base_top,
                'L', body.left_top+side_bevel.left_top, black_key_top,
                'H', body.right_top-side_bevel.right_top,
                'L', body.right_top, black_key_base_top,
                'L', body.right_bottom, height-black_key_bevel.bottom_height-round,
                'L', right, height,
                'H', left,
                'L', body.left_bottom, height-black_key_bevel.bottom_height-round,
                'Z'
            ], [
                'M', body.left_top1, black_key_base_top,
                'L', body.left_top1+side_bevel.left_top1, black_key_top1,
                'H', body.right_top1-side_bevel.right_top1,
                'L', body.right_top1, black_key_base_top,
                'L', body.right_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', right, height,
                'H', left,
                'L', body.left_bottom1, height-black_key_bevel.bottom_height1-round,
                'Z'
            ],
            { class: "key-fill" }
        );

        const inset = black_key_highlight_inset;
        const key_highlight = makeDualPath([
                'M', body.left_top+inset, black_key_base_top,
                'L', Math.max(
                        body.left_top+inset,
                        body.left_top+side_bevel.left_top
                    ), black_key_top,
                'H', Math.min(
                        body.right_top-inset,
                        body.right_top-side_bevel.right_top
                    ),
                'L', body.right_top-inset, black_key_base_top,
                'L', body.right_bottom-inset, height-inset-black_key_bevel.bottom_height-round_half,
                'L', right-inset, height-inset,
                'H', left+inset,
                'L', body.left_bottom+inset, height-inset-black_key_bevel.bottom_height-round_half,
                'Z'
            ], [
                'M', body.left_top1+inset, black_key_base_top,
                'L', Math.max(
                        body.left_top1+inset,
                        body.left_top1+side_bevel.left_top1
                    ), black_key_top1,
                'H', Math.min(
                        body.right_top1-inset,
                        body.right_top1-side_bevel.right_top1
                    ),
                'L', body.right_top1-inset, black_key_base_top,
                'L', body.right_bottom1-inset, height-inset-black_key_bevel.bottom_height1-round_half,
                'L', right-inset, height-inset,
                'H', left+inset,
                'L', body.left_bottom1+inset, height-inset-black_key_bevel.bottom_height1-round_half,
                'Z'
            ],
            { class: "key-highlight", fill: 'url("#pressed-black-key-highlight-gradient")'}
        );

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);

        if ( side_bevel.left_bottom > 0 || side_bevel.left_top > 0 ) {
            const bevel_left = makeDualPath([
                'M', body.left_top, black_key_base_top,
                'L', body.left_bottom, height,
                'L', body.left_bottom+side_bevel.left_bottom, height-black_key_bevel.bottom_height-round,
                'L', body.left_top+side_bevel.left_top, black_key_top,
                'Z'
            ], [
                'M', body.left_top1, black_key_base_top,
                'L', body.left_bottom1, height,
                'L', body.left_bottom1+side_bevel.left_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', body.left_top1+side_bevel.left_top1, black_key_top1,
                'Z'
            ], { class: "key-left-bevel black-key-bevel" });
            key_group.appendChild(bevel_left);
        }

        if ( side_bevel.right_bottom > 0 || side_bevel.right_top > 0 ) {
            const bevel_right = makeDualPath([
                'M', body.right_top, black_key_base_top,
                'L', body.right_bottom, height,
                'L', body.right_bottom-side_bevel.right_bottom, height-black_key_bevel.bottom_height-round,
                'L', body.right_top-side_bevel.right_top, black_key_top,
                'Z'
            ], [
                'M', body.right_top1, black_key_base_top,
                'L', body.right_bottom1, height,
                'L', body.right_bottom1-side_bevel.right_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', body.right_top1-side_bevel.right_top1, black_key_top1,
                'Z'
            ], { class: "key-right-bevel black-key-bevel" });
            key_group.appendChild(bevel_right);
        }

        const bevel_bottom = makeDualPath([
            'M', left, height,
            'H', right,
            'L', body.right_bottom-side_bevel.right_bottom-round, height-black_key_bevel.bottom_height,
            'H', body.left_bottom+side_bevel.left_bottom+round,
            'Z'
        ], [
            'M', left, height,
            'H', right,
            'L', body.right_bottom1-side_bevel.right_bottom1-round, height-black_key_bevel.bottom_height1,
            'H', body.left_bottom1+side_bevel.left_bottom1+round,
            'Z'
        ], { class: "key-bottom-bevel black-key-bevel" });
        key_group.appendChild(bevel_bottom);

        const bevel_round_left = makeDualPath([
            'M', left, height,
            'L', body.left_bottom+side_bevel.left_bottom, height-black_key_bevel.bottom_height-round,
            'Q', body.left_bottom+side_bevel.left_bottom+round_quarter, height-black_key_bevel.bottom_height-round_quarter,
                 body.left_bottom+side_bevel.left_bottom+round, height-black_key_bevel.bottom_height,
            'Z'
        ], [
            'M', left, height,
            'L', body.left_bottom1+side_bevel.left_bottom1, height-black_key_bevel.bottom_height1-round,
            'Q', body.left_bottom1+side_bevel.left_bottom1+round_quarter, height-black_key_bevel.bottom_height1-round_quarter,
                 body.left_bottom1+side_bevel.left_bottom1+round, height-black_key_bevel.bottom_height1,
            'Z'
        ], { class: "key-left-round-bevel black-key-bevel" });
        key_group.appendChild(bevel_round_left);

        const bevel_round_right = makeDualPath([
            'M', right, height,
            'L', body.right_bottom-side_bevel.right_bottom, height-black_key_bevel.bottom_height-round,
            'Q', body.right_bottom-side_bevel.right_bottom-round_quarter, height-black_key_bevel.bottom_height-round_quarter,
                 body.right_bottom-side_bevel.right_bottom-round, height-black_key_bevel.bottom_height,
            'Z'
        ], [
            'M', right, height,
            'L', body.right_bottom1-side_bevel.right_bottom1, height-black_key_bevel.bottom_height1-round,
            'Q', body.right_bottom1-side_bevel.right_bottom1-round_quarter, height-black_key_bevel.bottom_height1-round_quarter,
                 body.right_bottom1-side_bevel.right_bottom1-round, height-black_key_bevel.bottom_height1,
            'Z'
        ], { class: "key-right-round-bevel black-key-bevel" });
        key_group.appendChild(bevel_round_right);

        const reflection_height = black_key_bevel.bottom_height * 0.8;
        const reflection_height1 = black_key_bevel.bottom_height1 * 0.8;
        const bottom_reflection = makeDualPath([
                'M', white_gap-white_key_gap_half, height-reflection_height,
                'h', WHITE_KEY_GAP,
                'v', reflection_height,
                'h', -WHITE_KEY_GAP,
                'Z'
            ], [
                'M', white_gap-white_key_gap_half, height-reflection_height1,
                'h', WHITE_KEY_GAP,
                'v', reflection_height1,
                'h', -WHITE_KEY_GAP,
                'Z'
            ],
            { class: "gap-reflection" }
        );
        key_group.appendChild(bottom_reflection);

        return key_group;
    }

    function createWhiteKeyLabel(keynum, left) {
        const center = left + white_key_width_half;
        const elm = SvgTools.createElement("text", {
            x: center, y: white_key_height - white_key_width_half,
            id: `keylabel${keynum}`, class: "key-label white-key-label"
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        return elm;
    }

    function createBlackKeyLabel(keynum, left) {
        const center = left + black_key_width_half + computeLateralDisplacement(keynum)/2;
        const elm = SvgTools.createElement("text", {
            x: center, y: black_key_height - white_key_width_half,
            id: `keylabel${keynum}`, class: "key-label black-key-label"
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        elm.appendChild(SvgTools.createElement("tspan", { x: center, dy: "-0.9lh" }));
        elm.appendChild(SvgTools.createElement("tspan", { x: center, dy: "-1.0lh" }));
        return elm;
    }

    let width = 0;
    let white_left = 0;

    for ( let key = first_key; key <= last_key; key++ ) {
        const note = key % 12;

        if ( WHITE_NOTE[note] ) {
            const white_key = drawWhiteKey(key, note,
                white_left, white_key_width, white_key_height, white_key_rounding
            );
            const white_key_label = createWhiteKeyLabel(key, white_left);
            white_keys_g.appendChild(white_key);
            white_key.appendChild(white_key_label);
            keys[key] = white_key;
            labels[key] = white_key_label;
            width += white_key_width;
            white_left += white_key_width;
        } else {
            const black_left = white_left - black_key_width_half + (BK_OFFSETS[note]*black_key_width);
            const black_key = drawBlackKey(key,
                black_left, black_key_width, black_key_height, black_key_rounding, white_left
            );
            const black_key_label = createBlackKeyLabel(key, black_left);
            black_keys_g.appendChild(black_key);
            black_key.appendChild(black_key_label);
            keys[key] = black_key;
            labels[key] = black_key_label;
        }
    }
    
    svg.appendChild(white_keys_g);
    svg.appendChild(SvgTools.makeRect(
        width, top_felt.height, 0, top_felt.top, null, null, 
        { id: "top-felt" })
    );
    svg.appendChild(black_keys_g);

    const viewbox = {
        left: -2,
        top: -4,
        width: width+STROKE_WIDTH+2,
        height: (white_key_height * WHITE_KEY_PRESSED_FACTOR) + STROKE_WIDTH + 4
    }

    svg.setAttribute("viewBox", `${viewbox.left} ${viewbox.top} ${viewbox.width} ${viewbox.height}`);

    function makeGradient(id, stops, vertical=false, attrs={}) {
        const grad = SvgTools.createElement("linearGradient", 
            vertical ? { id: id, x2: "0%", y2: "100%" } : { id: id });
        for ( const stop_attr of stops )
            grad.appendChild(SvgTools.createElement("stop", stop_attr));
        for ( const [k,v] of Object.entries(attrs) )
            grad.setAttribute(k, v);
        return grad;
    }

    const svg_defs = SvgTools.createElement("defs");
    svg_defs.appendChild(makeGradient("pressed-white-key-highlight-gradient", [
        { offset: "0%", "stop-color": "var(--color-highlight-alpha)", "stop-opacity": "50%" },
        { offset: "40%", "stop-color": "var(--color-highlight-alpha)" }
    ], true));
    svg_defs.appendChild(makeGradient("pressed-black-key-highlight-gradient", [
        { offset: "0%", "stop-color": "var(--color-highlight-alpha)", "stop-opacity": "50%" },
        { offset: "50%", "stop-color": "var(--color-highlight-alpha)" }
    ], true));
    svg_defs.appendChild(makeGradient("top-felt-gradient", [
        { offset: "50%", "stop-color": "var(--color-felt-top)" },
        { offset: "100%", "stop-color": "var(--color-felt-bottom)" }
    ], true));
    svg_defs.appendChild(makeGradient("gap-reflection-gradient", [
        { offset: "0%", "stop-color": "var(--color-background)", "stop-opacity": "0%" },
        { offset: "100%", "stop-color": "var(--color-background)", "stop-opacity": "100%" },
    ], true));

    svg.appendChild(svg_defs);

}


/**
 * @param {Array} d0 - _d_ attribute for unpressed key.
 * @param {Array} d1 - _d_ attribute for pressed key.
 * @param {Object} attributes
 * @returns {SVGPathElement}
 */
function makeDualPath(d0, d1, attributes = {}) {
    const path = SvgTools.createElement("path", attributes);
    d0 = d0.filter((x) => x != null)
           .map((x) => Array.isArray(x) ? x.join(' ') : x)
           .join(' ');
    d1 = d1.filter((x) => x != null)
           .map((x) => Array.isArray(x) ? x.join(' ') : x)
           .join(' ');
    path.setAttribute('d0', d0);
    path.setAttribute('d1', d1);
    return path;
}
