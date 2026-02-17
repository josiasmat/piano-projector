import { isFirefox, isMobile, isSafari } from "./lib/utils.js";

export const is_mobile = isMobile();
export const is_safari = isSafari();
export const is_firefox = isFirefox();

/** 
 * @param {Element} elm 
 * @param {boolean} [value=true] default is _true_
 * @returns {boolean} _true_ if changed
 */
export function setDisabledAttr(elm, value = true) {
    return elm.toggleAttribute("disabled", value);
}

/** 
 * @param {Element} elm 
 * @param {boolean} [value=true] default is _true_
 * @returns {boolean}
 */
export function setHiddenAttr(elm, value = true) {
    return elm.toggleAttribute("hidden", value);
}

/** 
 * @param {Element} elm 
 * @param {boolean} [value=true] default is _true_
 * @returns {boolean}
 */
export function setCheckedAttr(elm, value = true) {
    return elm.toggleAttribute("checked", value);
}

/** 
 * @param {Element} elm 
 * @param {boolean} [value=true] default is _true_
 * @returns {boolean}
 */
export function setLoadingAttr(elm, value = true) {
    return elm.toggleAttribute("loading", value);
}
