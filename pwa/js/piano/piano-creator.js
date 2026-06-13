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
const STROKE_WIDTH = 1.3;

const WHITE_KEY_GAP = 1.8;
const BLACK_KEY_GAP = 2.5;

const BK_OFFSET = 0.13;
const WHITE_KEY_PRESSED_FACTOR = 1.01;
const EXTRA_BOTTOM_SPACE = 5;

const BLACK_KEY_SIDE_BEVEL = 3.5;

const BK_OFFSETS = [,-BK_OFFSET,,+BK_OFFSET,,,-1.4*BK_OFFSET,,0,,+1.4*BK_OFFSET,];


import SvgTools from "../lib/svgtools.js";
import { noteToMidi } from "../lib/libmidi.js";


/**
 * @param {SVGElement} svg - SVG element where to draw the piano keyboard
 * @param {[SVGElement?]} keys - Array of keys
 * @param {Object} options - Object that acceps the following properties:
 *      - first_key (integer)
 *      - last_key (integer)
 *      - height_factor (float)
 *      - perspective (boolean)
 *      - top_felt (boolean)
 */
export function drawPianoKeyboard(svg, keys, options = {}) {

    const nograd = options.no_gradient ? "nogradient" : null;
    const notran = options.no_transition ? "notransition" : null;

    const height = KBD_HEIGHT;
    const height_factor = options.height_factor ?? 1.0;

    const first_key = options.first_key ?? noteToMidi("a0");
    const last_key = options.last_key ?? noteToMidi("c8");
    const keys_count = last_key - first_key;
    const middle_key = (first_key + last_key) / 2;

    const white_key_height = height * height_factor;
    const black_key_height = white_key_height * (0.14 * height_factor + 0.51);

    const stroke_width_half = STROKE_WIDTH / 2;
    const white_key_gap_half = WHITE_KEY_GAP / 2;
    
    const white_key_width = height * 2.2 / 15.5;
    const black_key_width = height * 1.4 / 15.5;
    const white_key_width_half = white_key_width / 2;
    const white_key_width_third = white_key_width / 3;
    const black_key_width_half = black_key_width / 2;

    const white_key_rounding = white_key_width / 15;
    const black_key_rounding = black_key_width / 20;

    const white_key_highlight_inset = 2;
    const black_key_highlight_inset = 2;

    const top_felt = {
        top: -4,
        height: 7,
        get bottom() { return this.top + this.height; }
    };
    
    const white_key_top = top_felt.bottom-1;
    const black_key_top = top_felt.bottom-5;
    const black_key_base_top = top_felt.bottom+1;
    const black_key_top1 = black_key_top + (black_key_base_top - black_key_top) / 4;

    const black_key_bevel = {
        bottom_height: black_key_width/1.8*(Math.max(height_factor-0.5,0)/2+0.75),
        bottom_height1: 0,
        side_width_bottom: BLACK_KEY_SIDE_BEVEL*1.5,
        side_width_top: BLACK_KEY_SIDE_BEVEL,
        side_width_min: 0,
        side_width_max: 0
    };
    black_key_bevel.side_width_min = Math.min(black_key_bevel.side_width_top,
                                              black_key_bevel.side_width_bottom);
    black_key_bevel.side_width_max = Math.max(black_key_bevel.side_width_top,
                                              black_key_bevel.side_width_bottom);
    black_key_bevel.bottom_height1 = black_key_bevel.bottom_height / 2;

    const white_key_label_y = white_key_height - white_key_width_half*height_factor;
    const white_key_label_y1 = white_key_label_y*WHITE_KEY_PRESSED_FACTOR;
    const black_key_label_y = black_key_height - black_key_bevel.bottom_height
            - white_key_width_third*height_factor;
    const black_key_label_y1 = black_key_height - black_key_bevel.bottom_height1
            - white_key_width_third*height_factor;

    const w_marker_gap_x = 8 + STROKE_WIDTH;
    const w_marker_gap_y = 5 + STROKE_WIDTH;
    const b_marker_gap_x = 9 + STROKE_WIDTH;
    const b_marker_gap_y = 3 + STROKE_WIDTH;
    const w_marker_width = white_key_width - (w_marker_gap_x * 2);
    const b_marker_width = black_key_width - (b_marker_gap_x * 2);
    const w_marker_height = w_marker_width / 6;
    const b_marker_height = w_marker_width / 7;

    svg.innerHTML = "";

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    const white_keys_g = SvgTools.createGroup({id: "white-keys"});
    const black_keys_g = SvgTools.createGroup({id: "black-keys"});

    function drawWhiteKey(key, note, offset, width, height, round) {
        const left = offset + stroke_width_half + white_key_gap_half;
        const right = offset + width - stroke_width_half - white_key_gap_half;
        const center = left + (right-left)/2;
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
            
        const press_h_shrink_factor = 0.015;
        const press_h_shrink = width * press_h_shrink_factor;
        const press_h_shrink_cut_point = press_h_shrink * cut_point / height;
        
        const left_offset1 = left_offset + ((center - left_offset)/width*press_h_shrink_cut_point);
        const right_offset1 = right_offset - ((right_offset - center)/width*press_h_shrink_cut_point);

        //   a----b
        //   |    |
        //   |    |
        // g-h    c-d
        // |        |
        // |        |
        // f--------e

        const normal = {
            a: xy(left_offset, white_key_top),
            b: xy(right_offset, white_key_top),
            c: xy(right_offset, cut_point),
            d: xy(right, cut_point),
            e: xy(right, height),
            f: xy(left, height),
            g: xy(left, cut_point),
            h: xy(left_offset, cut_point)
        };

        const pressed = {
            a: normal.a,
            b: normal.b,
            c: xy(right_offset1, cut_point1),
            d: xy(right - press_h_shrink_cut_point, cut_point1),
            e: xy(right - press_h_shrink, height1),
            f: xy(left + press_h_shrink, height1),
            g: xy(left + press_h_shrink_cut_point, cut_point1),
            h: xy(left_offset1, cut_point1)
        };

        const round_quarter = round/4;

        const key_group = SvgTools.createGroup({ 
            id: `key${key}`, 
            class: join("key", "white-key", notran), 
            value: key 
        });

        const key_touch_area = SvgTools.makePath([
                'M', normal.a.x, normal.a.y,
                'H', normal.b.x,
                black_after ? [
                    'V', normal.c.y,
                    'H', normal.d.x
                ] : null,
                'V', normal.e.y,
                'H', normal.f.x,
                black_before ? [
                    'V', normal.g.y,
                    'H', normal.h.x
                ] : null,
                'Z'
            ],
            { class: "key-touch-area invisible", value: key }
        );

        const key_fill = makeDualPath([
                'M', normal.a.x, normal.a.y,
                'H', normal.b.x,
                black_after ? [
                    'L', normal.c.x, normal.c.y,
                    'H', normal.d.x
                ] : null,
                'L', normal.e.x, normal.e.y-round,
                'Q', normal.e.x-round_quarter, normal.e.y-round_quarter, 
                    normal.e.x-round, normal.e.y,
                'H', normal.f.x+round,
                'Q', normal.f.x+round_quarter, normal.f.y-round_quarter, 
                    normal.f.x, normal.f.y-round,
                black_before ? [
                    'L', normal.g.x, normal.g.y,
                    'H', normal.h.x
                ] : null,
                'Z'
            ], [
                'M', pressed.a.x, pressed.a.y,
                'H', pressed.b.x,
                black_after ? [
                    'L', pressed.c.x, pressed.c.y,
                    'H', pressed.d.x
                ] : null,
                'L', pressed.e.x, pressed.e.y-round,
                'Q', pressed.e.x-round_quarter, pressed.e.y-round_quarter, 
                     pressed.e.x-round, pressed.e.y,
                'H', pressed.f.x+round,
                'Q', pressed.f.x+round_quarter, pressed.f.y-round_quarter, 
                     pressed.f.x, pressed.f.y-round,
                black_before ? [
                    'L', pressed.g.x, pressed.g.y,
                    'H', pressed.h.x
                ] : null,
                'Z'
            ],
            { class: join("key-fill", nograd) }
        );

        const inset = white_key_highlight_inset;
        const key_highlight = makeDualPath([
                'M', normal.a.x+inset, normal.a.y-stroke_width_half,
                'H', normal.b.x-inset, 
                black_after ? [
                    'L', normal.c.x-inset, normal.c.y+inset,
                    'H', normal.d.x-inset
                ] : null,
                'L', normal.e.x-inset, normal.e.y-inset-round+stroke_width_half,
                'Q', normal.e.x-round_quarter-inset+stroke_width_half, normal.e.y-round_quarter-inset,
                     normal.e.x-round-inset+stroke_width_half, normal.e.y-inset,
                'H', normal.f.x+inset+round-stroke_width_half,
                'Q', normal.f.x+round_quarter+inset, normal.f.y-inset-round_quarter+stroke_width_half,
                     normal.f.x+inset, normal.f.y-inset-round+stroke_width_half,
                black_before ? [
                    'L', normal.g.x+inset, normal.g.y+inset,
                    'H', normal.h.x+inset
                ] : null,
                'Z'
            ], [
                'M', pressed.a.x+inset, pressed.a.y-stroke_width_half,
                'H', pressed.b.x-inset, 
                black_after ? [
                    'L', pressed.c.x-inset, pressed.c.y+inset,
                    'H', pressed.d.x-inset
                ] : null,
                'L', pressed.e.x-inset, pressed.e.y-inset-round+stroke_width_half,
                'Q', pressed.e.x-round_quarter-inset+stroke_width_half, pressed.e.y-round_quarter-inset,
                     pressed.e.x-round-inset+stroke_width_half, pressed.e.y-inset,
                'H', pressed.f.x+inset+round-stroke_width_half,
                'Q', pressed.f.x+round_quarter+inset, pressed.f.y-inset-round_quarter+stroke_width_half,
                     pressed.f.x+inset, pressed.f.y-inset-round+stroke_width_half,
                black_before ? [
                    'L', pressed.g.x+inset, pressed.g.y+inset,
                    'H', pressed.h.x+inset
                ] : null,
                'Z'
            ],
            { class: join("key-highlight", nograd, notran) }
        );

        const light_border = makeDualPath([
                'M', normal.a.x, normal.a.y+stroke_width_half,
                black_before ? [
                    'L', normal.h.x, normal.h.y,
                    'H', normal.g.x
                ] : null,
                'L', normal.f.x, normal.f.y-round-stroke_width_half,
                black_after ? [
                    'M', normal.c.x, normal.c.y,
                    'H', normal.d.x
                ] : null
            ], [
                'M', pressed.a.x, pressed.a.y+stroke_width_half,
                black_before ? [
                    'L', pressed.h.x, pressed.h.y,
                    'H', pressed.g.x
                ] : null,
                'L', pressed.f.x, pressed.f.y-round-stroke_width_half,
                black_after ? [
                    'M', pressed.c.x, pressed.c.y,
                    'H', pressed.d.x
                ] : null
            ],
            { class: join("key-light-border", "white-key-border") }
        );

        const dark_border = makeDualPath([
                'M', normal.f.x, normal.f.y-round,
                'Q', normal.f.x+round_quarter, normal.f.y-round_quarter, 
                     normal.f.x+round, normal.f.y,
                'H', normal.e.x-round,
                'Q', normal.e.x-round_quarter, normal.e.y-round_quarter, 
                     normal.e.x, normal.e.y-round,
                black_after ? [
                    'L', normal.d.x, normal.d.y,
                    'M', normal.c.x, normal.c.y,
                ] : null,
                'L', normal.b.x, normal.b.y+stroke_width_half
            ], [
                'M', pressed.f.x, pressed.f.y-round,
                'Q', pressed.f.x+round_quarter, pressed.f.y-round_quarter, 
                     pressed.f.x+round, pressed.f.y,
                'H', pressed.e.x-round,
                'Q', pressed.e.x-round_quarter, pressed.e.y-round_quarter, 
                     pressed.e.x, pressed.e.y-round,
                black_after ? [
                    'L', pressed.d.x, pressed.d.y,
                    'M', pressed.c.x, pressed.c.y,
                ] : null,
                'L', pressed.b.x, pressed.b.y+stroke_width_half
            ],
        { class: join("key-dark-border", "white-key-border") }
        );

        const label = createWhiteKeyLabel(key, offset);

        const marker_x = offset+w_marker_gap_x;
        const marker_y = white_key_height-w_marker_height-w_marker_gap_y;
        const marker = SvgTools.makeRect(
            w_marker_width, w_marker_height, marker_x, marker_y, stroke_width_half, stroke_width_half,
            { class: join("key-marker", "white-key-marker") }
        )
        
        const key_annotation_group = SvgTools.createGroup({ 
            class: join("key-annotation-group", notran),
            press_transform: `translateY(${white_key_label_y1-white_key_label_y}px)`,
        });
        key_annotation_group.appendChild(label);
        key_annotation_group.appendChild(marker);

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(dark_border);
        key_group.appendChild(light_border);
        key_group.appendChild(key_annotation_group);
        key_group.appendChild(key_touch_area);
        return key_group;
    }

    function computeLateralDisplacement(key) {
        if ( !options.perspective || isWhiteKey(key) ) return 0;
        // Restrict maximum displacement based on number of keys
        const perspective_factor = (key - middle_key) / ((88 + keys_count) / 4);
        return perspective_factor * black_key_bevel.side_width_max;
    }

    function drawBlackKey(key, offset, width, height, round) {
        const left = offset;
        const right = left + width;
        const round_half = round/2;
        const round_quarter = round/4;

        const lateral_displacement = computeLateralDisplacement(key) * 1.5;
        const lateral_displacement1_bottom = lateral_displacement/2;
        const lateral_displacement1_top = lateral_displacement/1.2;

        const bevel = options.perspective ? {
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

        const base = options.perspective ? {
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
        };

        const key_group = SvgTools.createGroup({ 
            id: `key${key}`, 
            class: join("key", "black-key", notran), 
            value: key 
        });

        const key_touch_area = SvgTools.makePath(
            [
                'M', base.left_top1, black_key_base_top,
                'L', base.left_top1+bevel.left_top1, black_key_top1,
                'H', base.right_top1-bevel.right_top1,
                'L', base.right_top1, black_key_base_top,
                'L', base.right_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', right, height,
                'H', left,
                'L', base.left_bottom1, height-black_key_bevel.bottom_height1-round,
                'Z'
            ],
            { class: join("key-touch-area", "invisible"), value: key }
        );

        const key_fill = makeDualPath([
                'M', base.left_top, black_key_base_top,
                'L', base.left_top+bevel.left_top, black_key_top,
                'H', base.right_top-bevel.right_top,
                'L', base.right_top, black_key_base_top,
                'L', base.right_bottom, height-black_key_bevel.bottom_height-round,
                'L', right, height,
                'H', left,
                'L', base.left_bottom, height-black_key_bevel.bottom_height-round,
                'Z'
            ], [
                'M', base.left_top1, black_key_base_top,
                'L', base.left_top1+bevel.left_top1, black_key_top1,
                'H', base.right_top1-bevel.right_top1,
                'L', base.right_top1, black_key_base_top,
                'L', base.right_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', right, height,
                'H', left,
                'L', base.left_bottom1, height-black_key_bevel.bottom_height1-round,
                'Z'
            ],
            { class: join("key-fill", nograd) }
        );

        const inset = black_key_highlight_inset;
        const key_highlight = makeDualPath([
                'M', base.left_top+inset, black_key_base_top,
                'L', Math.max(
                        base.left_top+inset,
                        base.left_top+bevel.left_top
                    ), black_key_top,
                'H', Math.min(
                        base.right_top-inset,
                        base.right_top-bevel.right_top
                    ),
                'L', base.right_top-inset, black_key_base_top,
                'L', base.right_bottom-inset, height-inset-black_key_bevel.bottom_height-round_half,
                'L', right-inset, height-inset,
                'H', left+inset,
                'L', base.left_bottom+inset, height-inset-black_key_bevel.bottom_height-round_half,
                'Z'
            ], [
                'M', base.left_top1+inset, black_key_base_top,
                'L', Math.max(
                        base.left_top1+inset,
                        base.left_top1+bevel.left_top1
                    ), black_key_top1,
                'H', Math.min(
                        base.right_top1-inset,
                        base.right_top1-bevel.right_top1
                    ),
                'L', base.right_top1-inset, black_key_base_top,
                'L', base.right_bottom1-inset, height-inset-black_key_bevel.bottom_height1-round_half,
                'L', right-inset, height-inset,
                'H', left+inset,
                'L', base.left_bottom1+inset, height-inset-black_key_bevel.bottom_height1-round_half,
                'Z'
            ],
            { class: join("key-highlight", nograd, notran) }
        );

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);

        if ( bevel.left_bottom > 0 || bevel.left_top > 0 ) {
            const bevel_left = makeDualPath([
                'M', base.left_top, black_key_base_top,
                'L', base.left_bottom, height,
                'L', base.left_bottom+bevel.left_bottom, height-black_key_bevel.bottom_height-round,
                'L', base.left_top+bevel.left_top, black_key_top,
                'Z'
            ], [
                'M', base.left_top1, black_key_base_top,
                'L', base.left_bottom1, height,
                'L', base.left_bottom1+bevel.left_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', base.left_top1+bevel.left_top1, black_key_top1,
                'Z'
            ], { class: join("key-left-bevel", "black-key-bevel") });
            key_group.appendChild(bevel_left);
        }

        if ( bevel.right_bottom > 0 || bevel.right_top > 0 ) {
            const bevel_right = makeDualPath([
                'M', base.right_top, black_key_base_top,
                'L', base.right_bottom, height,
                'L', base.right_bottom-bevel.right_bottom, height-black_key_bevel.bottom_height-round,
                'L', base.right_top-bevel.right_top, black_key_top,
                'Z'
            ], [
                'M', base.right_top1, black_key_base_top,
                'L', base.right_bottom1, height,
                'L', base.right_bottom1-bevel.right_bottom1, height-black_key_bevel.bottom_height1-round,
                'L', base.right_top1-bevel.right_top1, black_key_top1,
                'Z'
            ], { class: join("key-right-bevel", "black-key-bevel") });
            key_group.appendChild(bevel_right);
        }

        const bevel_bottom = makeDualPath([
            'M', left, height,
            'H', right,
            'L', base.right_bottom-bevel.right_bottom-round, height-black_key_bevel.bottom_height,
            'H', base.left_bottom+bevel.left_bottom+round,
            'Z'
        ], [
            'M', left, height,
            'H', right,
            'L', base.right_bottom1-bevel.right_bottom1-round, height-black_key_bevel.bottom_height1,
            'H', base.left_bottom1+bevel.left_bottom1+round,
            'Z'
        ], { class: join("key-bottom-bevel", "black-key-bevel") });
        key_group.appendChild(bevel_bottom);

        const bevel_round_left = makeDualPath([
            'M', left, height,
            'L', base.left_bottom+bevel.left_bottom, height-black_key_bevel.bottom_height-round,
            'Q', base.left_bottom+bevel.left_bottom+round_quarter, height-black_key_bevel.bottom_height-round_quarter,
                 base.left_bottom+bevel.left_bottom+round, height-black_key_bevel.bottom_height,
            'Z'
        ], [
            'M', left, height,
            'L', base.left_bottom1+bevel.left_bottom1, height-black_key_bevel.bottom_height1-round,
            'Q', base.left_bottom1+bevel.left_bottom1+round_quarter, height-black_key_bevel.bottom_height1-round_quarter,
                 base.left_bottom1+bevel.left_bottom1+round, height-black_key_bevel.bottom_height1,
            'Z'
        ], { class: join("key-left-round-bevel", "black-key-bevel") });
        key_group.appendChild(bevel_round_left);

        const bevel_round_right = makeDualPath([
            'M', right, height,
            'L', base.right_bottom-bevel.right_bottom, height-black_key_bevel.bottom_height-round,
            'Q', base.right_bottom-bevel.right_bottom-round_quarter, height-black_key_bevel.bottom_height-round_quarter,
                 base.right_bottom-bevel.right_bottom-round, height-black_key_bevel.bottom_height,
            'Z'
        ], [
            'M', right, height,
            'L', base.right_bottom1-bevel.right_bottom1, height-black_key_bevel.bottom_height1-round,
            'Q', base.right_bottom1-bevel.right_bottom1-round_quarter, height-black_key_bevel.bottom_height1-round_quarter,
                 base.right_bottom1-bevel.right_bottom1-round, height-black_key_bevel.bottom_height1,
            'Z'
        ], { class: join("key-right-round-bevel", "black-key-bevel") });
        key_group.appendChild(bevel_round_right);

        if ( !nograd ) {
            const top_border_line = makeDualPath([
                'M', base.left_bottom+bevel.left_bottom+round, height-black_key_bevel.bottom_height,
                'H', base.right_bottom-bevel.right_bottom-round,
                'V', height-black_key_bevel.bottom_height-1,
                'H', base.left_bottom+bevel.left_bottom+round,
                'Z'
            ], [
                'M', base.left_bottom1+bevel.left_bottom1+round, height-black_key_bevel.bottom_height1,
                'H', base.right_bottom1-bevel.right_bottom1-round,
                'V', height-black_key_bevel.bottom_height1-1,
                'H', base.left_bottom1+bevel.left_bottom1+round,
                'Z'
            ], { class: join("top-border-line", nograd) });
            key_group.appendChild(top_border_line);
        }

        const label = createBlackKeyLabel(key, offset);

        const marker_x = offset+b_marker_gap_x+lateral_displacement;
        const marker_y = black_key_height-black_key_bevel.bottom_height-b_marker_height-b_marker_gap_y;
        const marker = SvgTools.makeRect(
            b_marker_width, b_marker_height, marker_x, marker_y, stroke_width_half, stroke_width_half,
            { class: join("key-marker", "white-key-marker") }
        )

        const key_annotation_group = SvgTools.createGroup({ 
            class: join("key-annotation-group", notran),
            press_transform: `translateX(${(lateral_displacement1_bottom-lateral_displacement)*0.7}px) translateY(${black_key_label_y1-black_key_label_y}px)`,
        });
        key_annotation_group.appendChild(label);
        key_annotation_group.appendChild(marker);

        key_group.appendChild(key_annotation_group);
        key_group.appendChild(key_touch_area);

        return key_group;
    }

    function createWhiteKeyLabel(keynum, left) {
        const center = left + white_key_width_half;
        const elm = SvgTools.createElement("text", {
            x: center, y: white_key_label_y,
            id: `keylabel${keynum}`, 
            class: join("key-label", "white-key-label", notran)
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        return elm;
    }

    function createBlackKeyLabel(keynum, left) {
        const center = left + black_key_width_half + computeLateralDisplacement(keynum)/2;
        const elm = SvgTools.createElement("text", {
            x: center, y: black_key_label_y,
            id: `keylabel${keynum}`, class: join("key-label", "black-key-label")
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        elm.appendChild(SvgTools.createElement("tspan", { x: center, dy: "-0.9lh" }));
        elm.appendChild(SvgTools.createElement("tspan", { x: center, dy: "-1.0lh" }));
        return elm;
    }

    let width = 0;

    for ( let key = first_key; key <= last_key; key++ ) {
        const note = key % 12;

        if ( isWhiteKey(note) ) {
            const white_key = drawWhiteKey(key, note,
                width, white_key_width, white_key_height, white_key_rounding
            );
            white_keys_g.appendChild(white_key);
            keys[key] = white_key;
            width += white_key_width;
        } else {
            const black_left = width - black_key_width_half + (BK_OFFSETS[note]*black_key_width);
            const black_key = drawBlackKey(key,
                black_left, black_key_width, black_key_height, black_key_rounding, width
            );
            black_keys_g.appendChild(black_key);
            keys[key] = black_key;
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
        height: (white_key_height * Math.max(WHITE_KEY_PRESSED_FACTOR, 1.0)) + STROKE_WIDTH + EXTRA_BOTTOM_SPACE
    };

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
    if ( !options.no_gradient ) {
        svg_defs.appendChild(makeGradient("white-key-gradient", [
            { offset: "20%", "stop-color": "var(--gradient-white-key-top)" },
            { offset: "70%", "stop-color": "var(--color-white-key)" },
            { offset: "100%", "stop-color": "var(--gradient-white-key-bottom)" }
        ], false, { gradientTransform: "rotate(45)" }));
        svg_defs.appendChild(makeGradient("black-key-gradient", [
            { offset: "30%", "stop-color": "var(--gradient-black-key-top)" },
            { offset: "75%", "stop-color": "var(--color-black-key)" },
            { offset: "100%", "stop-color": "var(--gradient-black-key-bottom)" }
        ], false, { gradientTransform: "rotate(45)" }));
        svg_defs.appendChild(makeGradient("pressed-white-key-highlight-gradient", [
            { offset: "0%", "stop-color": "var(--color-highlight)", "stop-opacity": "60%" },
            { offset: "40%", "stop-color": "var(--color-highlight)" }
        ], true));
        svg_defs.appendChild(makeGradient("pressed-black-key-highlight-gradient", [
            { offset: "0%", "stop-color": "var(--color-highlight)", "stop-opacity": "60%" },
            { offset: "50%", "stop-color": "var(--color-highlight)" }
        ], true));
        svg_defs.appendChild(makeGradient("black-key-top-border-line-gradient", [
            { offset: "0%", "stop-color": "#fff", "stop-opacity": "0%" },
            { offset: "15%", "stop-color": "#fff", "stop-opacity": "30%" },
            { offset: "40%", "stop-color": "#fff", "stop-opacity": "60%" },
            { offset: "60%", "stop-color": "#fff", "stop-opacity": "60%" },
            { offset: "85%", "stop-color": "#fff", "stop-opacity": "30%" },
            { offset: "100%", "stop-color": "#fff", "stop-opacity": "0%" }
        ], false));
    }
    svg_defs.appendChild(makeGradient("top-felt-gradient", [
        { offset: "50%", "stop-color": "var(--color-felt-top)" },
        { offset: "100%", "stop-color": "var(--color-felt-bottom)" }
    ], true));

    svg.appendChild(svg_defs);

}


/**
 * @param {SVGElement} svg - SVG element where to draw the piano keyboard
 * @param {[SVGElement?]} keys - Array of keys
 * @param {Object} options - Object that acceps the following properties:
 *      - first_key (integer)
 *      - last_key (integer)
 *      - height_factor (float)
 *      - perspective (boolean)
 *      - top_felt (boolean)
 */
export function drawPianoKeyboardLP(svg, keys, options = {}) {

    const height = KBD_HEIGHT;
    const height_factor = options.height_factor ?? 1.0;

    const first_key = options.first_key ?? noteToMidi("a0");
    const last_key = options.last_key ?? noteToMidi("c8");

    const white_key_height = height * height_factor;
    const black_key_height = white_key_height * (0.14 * height_factor + 0.51);

    const stroke_width_half = STROKE_WIDTH / 2;
    const white_key_gap_half = WHITE_KEY_GAP / 2;
    
    const white_key_width = height * 2.2 / 15.5;
    const black_key_width = height * 1.4 / 15.5;
    const white_key_width_half = white_key_width / 2;
    const black_key_width_half = black_key_width / 2;

    const white_key_rounding = white_key_width / 17;

    const white_key_highlight_inset = 2;
    const black_key_highlight_inset = 2;

    const top_felt = {
        top: -4,
        height: 7,
        get bottom() { return this.top + this.height; }
    };
    
    const white_key_top = top_felt.bottom-1;
    const black_key_top = top_felt.bottom-5;

    const white_key_label_y = white_key_height - white_key_width_half*height_factor;
    const black_key_label_y = black_key_height - white_key_width_half*height_factor;

    const w_marker_gap_x = 8 + STROKE_WIDTH;
    const w_marker_gap_y = 6 + STROKE_WIDTH;
    const b_marker_gap_x = 5 + STROKE_WIDTH;
    const b_marker_gap_y = 5 + STROKE_WIDTH;
    const w_marker_width = white_key_width - (w_marker_gap_x * 2);
    const b_marker_width = black_key_width - (b_marker_gap_x * 2);
    const w_marker_height = w_marker_width / 5;
    const b_marker_height = w_marker_height;

    svg.innerHTML = "";

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

    function drawWhiteKey(key, note, offset, width, height, round) {
        const left = offset + stroke_width_half + white_key_gap_half;
        const right = offset + width - stroke_width_half - white_key_gap_half;
        const cut_point = black_key_height + stroke_width_half + BLACK_KEY_GAP;

        const black_before = key > first_key && [2,4,7,9,11].includes(note);
        const black_after = key < last_key && [0,2,5,7,9].includes(note);
        
        const left_offset = offset + stroke_width_half + ( black_before 
            ? black_key_width_half + (black_key_width * BK_OFFSETS[note-1]) + BLACK_KEY_GAP 
            : white_key_gap_half );
        const right_offset = offset + width - stroke_width_half - ( black_after 
            ? black_key_width_half - (black_key_width * BK_OFFSETS[note+1]) + BLACK_KEY_GAP 
            : white_key_gap_half );

        const key_group = SvgTools.createGroup(
            { id: `key${key}`, class: join("key", "white-key", "lowperf"), value: key }
        );

        const key_fill = SvgTools.makePath([
                'M', left_offset, white_key_top,
                'H', right_offset,
                black_after ? [
                    'V', cut_point,
                    'H', right
                ] : null,
                'V', height-round,
                'L', right-round, height,
                'H', left+round,
                'L', left, height-round,
                black_before ? [
                    'V', cut_point,
                    'H', left_offset
                ] : null,
                'Z'
            ],
            { class: join("key-fill", "key-touch-area", "lowperf") }
        );

        const inset = white_key_highlight_inset;
        const key_highlight = SvgTools.makePath([
                'M', left_offset+inset, white_key_top-stroke_width_half,
                'H', right_offset-inset, 
                black_after ? [
                    'V', cut_point+inset,
                    'H', right-inset
                ] : null,
                'V', height-inset-round+stroke_width_half,
                'L', right-round-inset+stroke_width_half, height-inset,
                'H', left+inset+round-stroke_width_half,
                'L', left+inset, height-inset-round+stroke_width_half,
                black_before ? [
                    'V', cut_point+inset,
                    'H', left_offset+inset
                ] : null,
                'Z'
            ],
            { class: join("key-highlight", "lowperf") }
        );

        const label = createWhiteKeyLabel(key, offset);

        const marker_x = offset+w_marker_gap_x;
        const marker_y = white_key_height-w_marker_height-w_marker_gap_y;
        const marker = SvgTools.makeRect(
            w_marker_width, w_marker_height, marker_x, marker_y, 0, 0,
            { class: join("key-marker", "white-key-marker") }
        )
        
        const key_annotation_group = SvgTools.createGroup({ 
            class: join("key-annotation-group", "lowperf"),
        });
        key_annotation_group.appendChild(label);
        key_annotation_group.appendChild(marker);

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(key_annotation_group);
        return key_group;
    }

    function drawBlackKey(key, offset, width, height) {
        const left = offset;
        const right = left + width;

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: join("key","black-key","lowperf"), value: key });

        const key_fill = SvgTools.makePath([
                'M', left, black_key_top,
                'H', right,
                'V', height,
                'H', left,
                'Z'
            ],
            { class: join("key-fill", "key-touch-area", "lowperf") }
        );

        const inset = black_key_highlight_inset;
        const key_highlight = SvgTools.makePath([
                'M', left+inset, black_key_top+inset,
                'H', right-inset,
                'V', height-inset,
                'H', left+inset,
                'Z'
            ],
            { class: join("key-highlight", "lowperf") }
        );

        const label = createBlackKeyLabel(key, offset);

        const marker_x = offset+b_marker_gap_x;
        const marker_y = black_key_height-b_marker_height-b_marker_gap_y;
        const marker = SvgTools.makeRect(
            b_marker_width, b_marker_height, marker_x, marker_y, 0, 0,
            { class: join("key-marker", "white-key-marker") }
        )

        const key_annotation_group = SvgTools.createGroup({ 
            class: join("key-annotation-group", "lowperf"),
        });
        key_annotation_group.appendChild(label);
        key_annotation_group.appendChild(marker);
        
        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(key_annotation_group);

        return key_group;
    }

    function createWhiteKeyLabel(keynum, left) {
        const center = left + white_key_width_half;
        const elm = SvgTools.createElement("text", {
            x: center, y: white_key_label_y,
            id: `keylabel${keynum}`, class: join("key-label", "white-key-label", "lowperf")
        });
        elm.appendChild(SvgTools.createElement("tspan", { x: center }));
        return elm;
    }

    function createBlackKeyLabel(keynum, left) {
        const center = left + black_key_width_half;
        const elm = SvgTools.createElement("text", {
            x: center, y: black_key_label_y,
            id: `keylabel${keynum}`, class: join("key-label", "black-key-label", "lowperf")
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

        if ( isWhiteKey(note) ) {
            const white_key = drawWhiteKey(key, note,
                white_left, white_key_width, white_key_height, white_key_rounding
            );
            white_keys_g.appendChild(white_key);
            keys[key] = white_key;
            width += white_key_width;
            white_left += white_key_width;
        } else {
            const black_left = white_left - black_key_width_half + (BK_OFFSETS[note]*black_key_width);
            const black_key = drawBlackKey(key,
                black_left, black_key_width, black_key_height
            );
            black_keys_g.appendChild(black_key);
            keys[key] = black_key;
        }
    }
    
    svg.appendChild(white_keys_g);
    svg.appendChild(SvgTools.makeRect(
        width, top_felt.height, 0, top_felt.top, null, null, 
        { id: "top-felt", class: "lowperf" })
    );
    svg.appendChild(black_keys_g);

    const viewbox = {
        left: -2,
        top: -4,
        width: width+STROKE_WIDTH+2,
        height: (white_key_height * WHITE_KEY_PRESSED_FACTOR) + STROKE_WIDTH + 4
    };

    svg.setAttribute("viewBox", `${viewbox.left} ${viewbox.top} ${viewbox.width} ${viewbox.height}`);

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
    // path.setAttribute('d', d0);
    return path;
}


const WHITE_NOTE = [true,false,true,false,true,true,false,true,false,true,false,true];

/**
 * @param {number} key - 0-127
 * @returns {boolean}
 */
export function isWhiteKey(key) {
    return WHITE_NOTE[key%12];
}

/**
 * @param {number} key - 0-127
 * @returns {boolean}
 */
export function isBlackKey(key) {
    return !isWhiteKey(key);
}


/**
 * @param {string[]} items
 * @returns {string}
 */
function join(...items) {
    return items.filter(Boolean).join(' ');
}


/**
 * @param {number} x 
 * @param {number} y 
 * @returns {{x: number, y: number}}
 */
function xy(x, y) {
    return { x, y };
}
