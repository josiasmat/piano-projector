/*
Piano Projector - Keyboard navigation module
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

export class KbdNav {

    /** @type {HTMLDivElement} */
    #container;
    /** @type {Array} */
    #structure;
    /** @type {[number]} */
    #current_path = [];
    /** @type {[{html:string, html:string, action:Function, keys:string, checkbox: boolean, checked:boolean}]} */
    #current_menu = [];
    /** @type {[{html:string, html:string, action:Function, keys:string, checkbox: boolean, checked:boolean}]} */
    #parent_menu = [];
    /** @type {string} */
    #trigger;

    /** @type {string} */
    #back_label = "Back";

    #enabled = false;
    #visible = false;

    get visible() {
        return this.#visible;
    }

    get back_label() {
        return this.#back_label;
    }

    set back_label(s) {
        this.#back_label = s;
    }

    /** @type {function()} */
    onshow = undefined;
    /** @type {function()} */
    onhide = undefined;
    /** @type {function(string)} item label */
    onmenuenter = undefined;
    /** @type {function(string)} item label */
    onoptionenter = undefined;

    /**
     * @param {HTMLDivElement} container 
     * @param {Array} structure 
     * @param {string} trigger_key - "alt" (default), "control" or "shift"
     */
    constructor(container, structure, trigger_key="alt") {
        this.#container = container;
        this.#structure = structure;
        this.#trigger = trigger_key;
        this.enable();
    }

    enable() {
        if ( !this.#enabled ) {
            this.#enabled = true;
            window.addEventListener("keydown", (e) => this.#keyDownHandler(e));
            window.addEventListener("keyup", (e) => this.#keyUpHandler(e));
            window.addEventListener("blur", () => this.#blurHandler());
        }
    }

    disable() {
        if ( this.#enabled ) {
            window.removeEventListener("keydown", (e) => this.#keyDownHandler(e));
            window.removeEventListener("keyup", (e) => this.#keyUpHandler(e));
            window.removeEventListener("blur", () => this.#blurHandler());
            this.#enabled = false;
        }
    }

    get container() {
        return this.#container;
    }

    replaceStructure(structure) {
        this.#structure = structure;
        if ( this.#visible ) this.#build();
    }

    show() {
        if ( this.#visible == false ) {
            this.#visible = true;
            this.#current_path = [0];
            this.onshow?.();
            this.#container.hidden = false;
            this.#container.focus();
        }
        this.#build();
    }

    /** @param {number} index */
    #enter(index) {
        this.#current_path.push(index);
        this.onmenuenter?.(this.#current_menu[index].text);
    }

    #back() {
        if ( this.#current_path.length > 1 ) {
            this.#current_path.pop();
            this.onmenuenter?.(this.#parent_menu.text);
        }
    }

    #build() {
        this.#container.innerHTML = '';
        const breadcrumb_top = document.createElement("sl-breadcrumb");
        this.#container.appendChild(breadcrumb_top);
        // Build ancestors part
        let menu = this.#structure;
        for ( const index of this.#current_path) {
            const item = document.createElement("sl-breadcrumb-item");
            item.innerHTML = removeAmpersand(menu[index][0]);
            menu = menu[index][1];
            breadcrumb_top.appendChild(item);
        }
        // Prepare menu
        this.#current_menu = [];
        for ( const [index,item] of menu.entries() ) {
            this.#parent_menu = this.#current_menu;
            const text = ( item[1] === null || item[2]?.noindex ) 
                ? item[0] 
                : `&${index+1}: ${item[0]}`;
            this.#current_menu.push({
                html: replaceAmpersand(text),
                text: removeAmpersand(item[0]),
                action: Array.isArray(item[1]) ? index : item[1],
                keys: item[2]?.key 
                    ? getShortcutKeys(text).concat([item[2].key]) 
                    : getShortcutKeys(text),
                checkbox: item[2] ? Object.hasOwn(item[2], "checked") : false,
                checked: item[2]?.checked,
            });
        }
        if ( this.#current_path.length > 1 ) {
            // Find the best ampersand position for the Back label
            let back_label_with_ampersand = this.#back_label;
            const shortcut_keys = this.#current_menu.flatMap(item => item.keys);
            let back_label_keys = ["0"];
            for ( let i = 0; i < this.#back_label.length; i++ ) {
                const c = this.#back_label[i].toLowerCase();
                if ( shortcut_keys.includes(c) ) continue;
                back_label_keys.push(c);
                back_label_with_ampersand = 
                    this.#back_label.slice(0, i) + '&' + this.#back_label.slice(i);
                break;
            }
            this.#current_menu.push({
                html: replaceAmpersand(`&0: ${back_label_with_ampersand}`),
                text: this.#back_label,
                action: () => this.#back(),
                keys: back_label_keys,
            });
        }
        // Build menu part
        const html = this.#current_menu.map(
                item => item.checkbox
                    ? `<span check-item${item.checked ? " checked" : ''}><span class="checkbox">${item.checked ? "🗹" : "☐"}</span> ${item.html}</span>`
                    : `<span>${item.html}</span>`
            ).join('|');
        const menu_elm = document.createElement("sl-breadcrumb-item");
        menu_elm.innerHTML = '&nbsp;' + html;
        breadcrumb_top.appendChild(menu_elm);
    }

    hide() {
        if ( this.#visible ) {
            this.#visible = false;
            this.#container.hidden = true;
            this.onhide?.();
        }
    }

    
    /** @param {KeyboardEvent} e */
    #keyDownHandler(e) {
        if ( e.repeat ) return;
        if ( this.#triggerMatchKey(e) ) {
            e.preventDefault();
            this.show();
        } else if ( this.#triggerMatchHold(e) ) {
            let match = false;
            const k = e.key.toLowerCase();
            for ( const item of this.#current_menu ) {
                if ( item.keys.includes(k) && item.action !== null ) {
                    match = true;
                    if ( typeof(item.action) == "number" ) {
                        this.#enter(item.action);
                    } else if ( typeof(item.action) == "function" ) {
                        item.action();
                        this.onoptionenter?.();
                    }
                }
            }
            this.#build();
            // Only prevent default if there is a match or
            // if key pressed is a character key, to not 
            // prevent combinations like Alt+F4
            if ( match || k.length == 1 )
                e.preventDefault();
        }
    }

    /** @param {KeyboardEvent} e */
    #keyUpHandler(e) {
        if ( this.#triggerMatchKey(e) ) {
            e.preventDefault();
            this.hide();
        }
    }

    #blurHandler() {
        if ( this.#visible )
            this.hide();
    }

    /** @param {string} t @param {KeyboardEvent} e */
    #triggerMatchKey(e) {
        return ( e.key.toLowerCase() == this.#trigger || e.code.toLowerCase().startsWith(this.#trigger) );
    }

    /** @param {string} t @param {KeyboardEvent} e */
    #triggerMatchHold(e) {
        return [ ( this.#trigger == "ctrl"  && e.ctrlKey ),
                 ( this.#trigger == "alt"   && e.altKey ),
                 ( this.#trigger == "shift" && e.shiftKey ) ]
               .filter(x => x).length == 1;
    }

}


/** @param {string} s */
function replaceAmpersand(s) {
    return s.replace(/&(.)/g, '<u>$1</u>');
}

/** @param {string} s */
function removeAmpersand(s) {
    return s.replaceAll('&', '');
}

/** @param {string} s */
function getShortcutKeys(s) {
    const matches = s.match(/(?<=&)./g);
    return matches?.map(c => c.toLowerCase()) ?? [];
}


export default KbdNav;
