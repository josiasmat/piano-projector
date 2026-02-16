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


import tinycolor from "tinycolor2";


class StickerColors {
    /** @type { tinycolor.Instance } */
    base;
    /** @type {string} */
    name;

    get fill_white_key() { 
        return this.#getFill(_colors.white_key); 
    }
    get fill_black_key() { 
        return this.#getFill(_colors.black_key); 
    }
    get fill_highlight_white_key() { 
        return this.#getFill(
            tinycolor.mix(_colors.white_key, _colors.highlight, _colors.highlight.getAlpha()*100)
        ); 
    }
    get fill_highlight_black_key() { 
        return this.#getFill(
            tinycolor.mix(_colors.black_key, _colors.highlight, _colors.highlight.getAlpha()*100)
        ); 
    }
    get stroke_white_key() { 
        return this.#getStroke(_colors.white_key); 
    }
    get stroke_black_key() { 
        return this.#getStroke(_colors.black_key); 
    }
    get stroke_highlight_white_key() { 
        return this.#getStroke(
            tinycolor.mix(_colors.white_key, _colors.highlight, _colors.highlight.getAlpha()*100)
        ); 
    }
    get stroke_highlight_black_key() { 
        return this.#getStroke(
            tinycolor.mix(_colors.black_key, _colors.highlight, _colors.highlight.getAlpha()*100)
        ); 
    }

    /** @param {string} color_str @param {string} name */
    constructor(color_str, name) {
        this.base = tinycolor(color_str);
        this.name = name;
    }

    setStyleVariables() {
        const rs = document.documentElement.style;
        rs.setProperty(`--color-sticker-${this.name}-fill-white-key`, this.fill_white_key);
        rs.setProperty(`--color-sticker-${this.name}-fill-black-key`, this.fill_black_key);
        rs.setProperty(`--color-sticker-${this.name}-fill-highlight-white-key`, this.fill_highlight_white_key);
        rs.setProperty(`--color-sticker-${this.name}-fill-highlight-black-key`, this.fill_highlight_black_key);
        rs.setProperty(`--color-sticker-${this.name}-stroke-white-key`, this.stroke_white_key);
        rs.setProperty(`--color-sticker-${this.name}-stroke-black-key`, this.stroke_black_key);
        rs.setProperty(`--color-sticker-${this.name}-stroke-highlight-white-key`, this.stroke_highlight_white_key);
        rs.setProperty(`--color-sticker-${this.name}-stroke-highlight-black-key`, this.stroke_highlight_black_key);
    }

    #getFill(bg) {
        return ( tinycolor.readability(this.base, bg) >= 2 )
            ? this.base.toHexString() : ( bg.isDark() )
                ? this.base.clone().lighten(10).toHexString()
                : this.base.toHexString();
    }

    #getStroke(bg) {
        const contrast = tinycolor.readability(this.base, bg);
        const amount = ( contrast >= 2 ) ? 10 : ( contrast >= 1.5 ) ? 17 : 25;
        return ( contrast >= 2.5 )
            ? this.base.toHexString() : tinycolor.mostReadable(bg, [
                this.base.clone().darken(amount), this.base.clone().lighten(amount)
            ]);
    }
}


export const colors = {

    /** @type {number} */
    get highlight_opacity() { 
        return _colors.highlight.getAlpha(); 
    },
    set highlight_opacity(value) {
        _colors.highlight.setAlpha(value);
        _colors.updateStyles();
    },

    /** @type {string} */
    get highlight() {
        return _colors.highlight.toHexString();
    },
    set highlight(value) {
        const alpha = _colors.highlight.getAlpha();
        _colors.highlight = tinycolor(value);
        _colors.highlight.setAlpha(alpha);
        _colors.updateStyles();
    },

    /** @type {string} */
    get white_key() {
        return _colors.white_key.toHexString();
    },
    set white_key(value) {
        _colors.white_key = tinycolor(value);
        _colors.updateStyles();
    },

    /** @type {string} */
    get black_key() {
        return _colors.black_key.toHexString();
    },
    set black_key(value) {
        _colors.black_key = tinycolor(value);
        _colors.updateStyles();
    },

    /** @type {string} */
    get top_felt() {
        return _colors.felt.toHexString();
    },
    set top_felt(value) {
        _colors.felt = tinycolor(value);
        _colors.updateStyles();
    },

}


const _colors = {

    highlight: tinycolor("#f00f"),
    white_key: tinycolor("#eee"),
    black_key: tinycolor("#222"),
    felt : tinycolor("#920"),

    sticker_red:    new StickerColors("red", "red"),
    sticker_yellow: new StickerColors("#ee0", "yellow"),
    sticker_green:  new StickerColors("#0b0", "green"),
    sticker_blue:   new StickerColors("blue", "blue"),
    sticker_violet: new StickerColors("#d0d", "violet"),

    updateStyles() {
        const rs = document.documentElement.style;

        // update key colors
        rs.setProperty("--color-highlight"  , this.highlight.toHex8String());
        rs.setProperty("--color-white-key"  , this.white_key.toHexString());
        rs.setProperty("--color-black-key"  , this.black_key.toHexString());

        // update top felt gradient colors
        rs.setProperty("--color-felt-top"   , this.felt.toHexString());
        rs.setProperty("--color-felt-bottom", this.felt.clone().darken(20).setAlpha(0.75).toHex8String());

        // update label colors
        rs.setProperty("--color-label-white-key", 
            this.white_key.isLight() ? "#000d" : "#fffd" );
        rs.setProperty("--color-label-black-key", 
            this.black_key.isLight() ? "#000d" : "#fffd" );
        rs.setProperty("--color-label-white-key-active", 
            tinycolor.mix(this.white_key, this.highlight, this.highlight.getAlpha()*100)
            .isLight() ? "#000d" : "#fffd" );
        rs.setProperty("--color-label-black-key-active", 
            tinycolor.mix(this.black_key, this.highlight, this.highlight.getAlpha()*100)
            .isLight() ? "#000d" : "#fffd" );
        
        // update sticker colors
        this.sticker_red.setStyleVariables();
        this.sticker_yellow.setStyleVariables();
        this.sticker_green.setStyleVariables();
        this.sticker_blue.setStyleVariables();
        this.sticker_violet.setStyleVariables();
    },

}
