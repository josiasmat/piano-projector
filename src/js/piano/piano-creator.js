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

const BLACK_KEY_SIDE_BEVEL = 3.0;

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
        side_width_bottom: BLACK_KEY_SIDE_BEVEL*2,
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

    const w_sticker_gap_x = STROKE_WIDTH * 8;
    const w_sticker_gap_y = STROKE_WIDTH * 6;
    const b_sticker_gap_x = STROKE_WIDTH * 7;
    const b_sticker_gap_y = STROKE_WIDTH * 4;
    const w_sticker_width = white_key_width - (w_sticker_gap_x * 2);
    const b_sticker_width = black_key_width - (b_sticker_gap_x * 2);
    const w_sticker_height = w_sticker_width / 10;
    const b_sticker_height = w_sticker_height;

    svg.innerHTML = "";

    for ( let key = 0; key < 128; key++ )
        if ( key < first_key || key > last_key )
            keys[key] = null;

    const white_keys_g = SvgTools.createGroup();
    const black_keys_g = SvgTools.createGroup();

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
            ax: left_offset, ay: white_key_top,
            bx: right_offset, by: white_key_top,
            cx: right_offset, cy: cut_point,
            dx: right, dy: cut_point,
            ex: right, ey: height,
            fx: left, fy: height,
            gx: left, gy: cut_point,
            hx: left_offset, hy: cut_point
        };

        const pressed = {
            ax: normal.ax, ay: normal.ay,
            bx: normal.bx, by: normal.by,
            cx: right_offset1, cy: cut_point1,
            dx: right - press_h_shrink_cut_point, dy: cut_point1,
            ex: right - press_h_shrink, ey: height1,
            fx: left + press_h_shrink, fy: height1,
            gx: left + press_h_shrink_cut_point, gy: cut_point1,
            hx: left_offset1, hy: cut_point1,
        };

        const round_quarter = round/4;

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: join("key","white-key"), value: key });

        const key_touch_area = SvgTools.makePath([
                'M', normal.ax, normal.ay,
                'H', normal.bx,
                black_after ? [
                    'V', normal.cy,
                    'H', normal.dx
                ] : null,
                'V', normal.ey,
                'H', normal.fx,
                black_before ? [
                    'V', normal.gy,
                    'H', normal.hx
                ] : null,
                'Z'
            ],
            { class: "key-touch-area invisible", value: key }
        );

        const key_fill = makeDualPath([
                'M', normal.ax, normal.ay,
                'H', normal.bx,
                black_after ? [
                    'L', normal.cx, normal.cy,
                    'H', normal.dx
                ] : null,
                'L', normal.ex, normal.ey-round,
                'Q', normal.ex-round_quarter, normal.ey-round_quarter, 
                    normal.ex-round, normal.ey,
                'H', normal.fx+round,
                'Q', normal.fx+round_quarter, normal.fy-round_quarter, 
                    normal.fx, normal.fy-round,
                black_before ? [
                    'L', normal.gx, normal.gy,
                    'H', normal.hx
                ] : null,
                'Z'
            ], [
                'M', pressed.ax, pressed.ay,
                'H', pressed.bx,
                black_after ? [
                    'L', pressed.cx, pressed.cy,
                    'H', pressed.dx
                ] : null,
                'L', pressed.ex, pressed.ey-round,
                'Q', pressed.ex-round_quarter, pressed.ey-round_quarter, 
                     pressed.ex-round, pressed.ey,
                'H', pressed.fx+round,
                'Q', pressed.fx+round_quarter, pressed.fy-round_quarter, 
                     pressed.fx, pressed.fy-round,
                black_before ? [
                    'L', pressed.gx, pressed.gy,
                    'H', pressed.hx
                ] : null,
                'Z'
            ],
            { class: join("key-fill", nograd) }
        );

        const inset = white_key_highlight_inset;
        const key_highlight = makeDualPath([
                'M', normal.ax+inset, normal.ay-stroke_width_half,
                'H', normal.bx-inset, 
                black_after ? [
                    'L', normal.cx-inset, normal.cy+inset,
                    'H', normal.dx-inset
                ] : null,
                'L', normal.ex-inset, normal.ey-inset-round+stroke_width_half,
                'Q', normal.ex-round_quarter-inset+stroke_width_half, normal.ey-round_quarter-inset,
                     normal.ex-round-inset+stroke_width_half, normal.ey-inset,
                'H', normal.fx+inset+round-stroke_width_half,
                'Q', normal.fx+round_quarter+inset, normal.fy-inset-round_quarter+stroke_width_half,
                     normal.fx+inset, normal.fy-inset-round+stroke_width_half,
                black_before ? [
                    'L', normal.gx+inset, normal.gy+inset,
                    'H', normal.hx+inset
                ] : null,
                'Z'
            ], [
                'M', pressed.ax+inset, pressed.ay-stroke_width_half,
                'H', pressed.bx-inset, 
                black_after ? [
                    'L', pressed.cx-inset, pressed.cy+inset,
                    'H', pressed.dx-inset
                ] : null,
                'L', pressed.ex-inset, pressed.ey-inset-round+stroke_width_half,
                'Q', pressed.ex-round_quarter-inset+stroke_width_half, pressed.ey-round_quarter-inset,
                     pressed.ex-round-inset+stroke_width_half, pressed.ey-inset,
                'H', pressed.fx+inset+round-stroke_width_half,
                'Q', pressed.fx+round_quarter+inset, pressed.fy-inset-round_quarter+stroke_width_half,
                     pressed.fx+inset, pressed.fy-inset-round+stroke_width_half,
                black_before ? [
                    'L', pressed.gx+inset, pressed.gy+inset,
                    'H', pressed.hx+inset
                ] : null,
                'Z'
            ],
            { class: join("key-highlight", nograd) }
        );

        const light_border = makeDualPath([
                'M', normal.ax, normal.ay+stroke_width_half,
                black_before ? [
                    'L', normal.hx, normal.hy,
                    'H', normal.gx
                ] : null,
                'L', normal.fx, normal.fy-round-stroke_width_half,
                black_after ? [
                    'M', normal.cx, normal.cy,
                    'H', normal.dx
                ] : null
            ], [
                'M', pressed.ax, pressed.ay+stroke_width_half,
                black_before ? [
                    'L', pressed.hx, pressed.hy,
                    'H', pressed.gx
                ] : null,
                'L', pressed.fx, pressed.fy-round-stroke_width_half,
                black_after ? [
                    'M', pressed.cx, pressed.cy,
                    'H', pressed.dx
                ] : null
            ],
            { class: join("key-light-border", "white-key-border") }
        );

        const dark_border = makeDualPath([
                'M', normal.fx, normal.fy-round,
                'Q', normal.fx+round_quarter, normal.fy-round_quarter, 
                     normal.fx+round, normal.fy,
                'H', normal.ex-round,
                'Q', normal.ex-round_quarter, normal.ey-round_quarter, 
                     normal.ex, normal.ey-round,
                black_after ? [
                    'L', normal.dx, normal.dy,
                    'M', normal.cx, normal.cy,
                ] : null,
                'L', normal.bx, normal.by+stroke_width_half
            ], [
                'M', pressed.fx, pressed.fy-round,
                'Q', pressed.fx+round_quarter, pressed.fy-round_quarter, 
                     pressed.fx+round, pressed.fy,
                'H', pressed.ex-round,
                'Q', pressed.ex-round_quarter, pressed.ey-round_quarter, 
                     pressed.ex, pressed.ey-round,
                black_after ? [
                    'L', pressed.dx, pressed.dy,
                    'M', pressed.cx, pressed.cy,
                ] : null,
                'L', pressed.bx, pressed.by+stroke_width_half
            ],
        { class: join("key-dark-border", "white-key-border") }
        );

        const label = createWhiteKeyLabel(key, offset);

        const sticker_x = offset+w_sticker_gap_x;
        const sticker_y = white_key_height-w_sticker_height-w_sticker_gap_y;
        const sticker = SvgTools.makeRect(
            w_sticker_width, w_sticker_height, sticker_x, sticker_y, stroke_width_half, stroke_width_half,
            { class: join("key-sticker", "white-key-sticker") }
        )
        
        const key_marker_group = SvgTools.createGroup({ 
            class: "key-marker-group",
            press_transform: `translateY(${white_key_label_y1-white_key_label_y}px)`,
        });
        key_marker_group.appendChild(label);
        key_marker_group.appendChild(sticker);

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(dark_border);
        key_group.appendChild(light_border);
        key_group.appendChild(key_marker_group);
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
        };

        const key_group = SvgTools.createGroup({ id: `key${key}`, class: join("key","black-key"), value: key });

        const key_touch_area = SvgTools.makePath(
            [
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
            { class: join("key-touch-area", "invisible"), value: key }
        );

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
            { class: join("key-fill", nograd) }
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
            { class: join("key-highlight", nograd) }
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
            ], { class: join("key-left-bevel", "black-key-bevel") });
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
            ], { class: join("key-right-bevel", "black-key-bevel") });
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
        ], { class: join("key-bottom-bevel", "black-key-bevel") });
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
        ], { class: join("key-left-round-bevel", "black-key-bevel") });
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
        ], { class: join("key-right-round-bevel", "black-key-bevel") });
        key_group.appendChild(bevel_round_right);

        const label = createBlackKeyLabel(key, offset);

        const sticker_x = offset+b_sticker_gap_x+lateral_displacement;
        const sticker_y = black_key_height-black_key_bevel.bottom_height-b_sticker_height-b_sticker_gap_y;
        const sticker = SvgTools.makeRect(
            b_sticker_width, b_sticker_height, sticker_x, sticker_y, stroke_width_half, stroke_width_half,
            { class: join("key-sticker", "white-key-sticker") }
        )

        const key_marker_group = SvgTools.createGroup({ 
            class: "key-marker-group",
            press_transform: `translateX(${(lateral_displacement1_bottom-lateral_displacement)*0.7}px) translateY(${black_key_label_y1-black_key_label_y}px)`,
        });
        key_marker_group.appendChild(label);
        key_marker_group.appendChild(sticker);

        key_group.appendChild(key_marker_group);
        key_group.appendChild(key_touch_area);

        return key_group;
    }

    function createWhiteKeyLabel(keynum, left) {
        const center = left + white_key_width_half;
        const elm = SvgTools.createElement("text", {
            x: center, y: white_key_label_y,
            id: `keylabel${keynum}`, class: join("key-label", "white-key-label")
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
                black_left, black_key_width, black_key_height, black_key_rounding, white_left
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
            { offset: "0%", "stop-color": "var(--color-highlight-alpha)", "stop-opacity": "60%" },
            { offset: "40%", "stop-color": "var(--color-highlight-alpha)" }
        ], true));
        svg_defs.appendChild(makeGradient("pressed-black-key-highlight-gradient", [
            { offset: "0%", "stop-color": "var(--color-highlight-alpha)", "stop-opacity": "60%" },
            { offset: "50%", "stop-color": "var(--color-highlight-alpha)" }
        ], true));
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
    const white_key_width_third = white_key_width / 3;
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

    const w_sticker_gap_x = STROKE_WIDTH * 8;
    const w_sticker_gap_y = STROKE_WIDTH * 6;
    const b_sticker_gap_x = STROKE_WIDTH * 5;
    const b_sticker_gap_y = STROKE_WIDTH * 5;
    const w_sticker_width = white_key_width - (w_sticker_gap_x * 2);
    const b_sticker_width = black_key_width - (b_sticker_gap_x * 2);
    const w_sticker_height = w_sticker_width / 10;
    const b_sticker_height = w_sticker_height;

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

        const sticker_x = offset+w_sticker_gap_x;
        const sticker_y = white_key_height-w_sticker_height-w_sticker_gap_y;
        const sticker = SvgTools.makeRect(
            w_sticker_width, w_sticker_height, sticker_x, sticker_y, 0, 0,
            { class: join("key-sticker", "white-key-sticker") }
        )
        
        const key_marker_group = SvgTools.createGroup({ 
            class: join("key-marker-group", "lowperf"),
        });
        key_marker_group.appendChild(label);
        key_marker_group.appendChild(sticker);

        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(key_marker_group);
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

        const sticker_x = offset+b_sticker_gap_x;
        const sticker_y = black_key_height-b_sticker_height-b_sticker_gap_y;
        const sticker = SvgTools.makeRect(
            b_sticker_width, b_sticker_height, sticker_x, sticker_y, 0, 0,
            { class: join("key-sticker", "white-key-sticker") }
        )

        const key_marker_group = SvgTools.createGroup({ 
            class: join("key-marker-group", "lowperf"),
        });
        key_marker_group.appendChild(label);
        key_marker_group.appendChild(sticker);
        
        key_group.appendChild(key_fill);
        key_group.appendChild(key_highlight);
        key_group.appendChild(key_marker_group);

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
