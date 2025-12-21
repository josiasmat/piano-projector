import { isMobile, isSafari } from "./lib/utils.js";

export const is_mobile = isMobile();
export const is_safari = isSafari();

export function setDisabledAttr(elm, value = true) {
    elm.toggleAttribute("disabled", value);
}

export function setHiddenAttr(elm, value = true) {
    elm.toggleAttribute("hidden", value);
}

export function setCheckedAttr(elm, value = true) {
    elm.toggleAttribute("checked", value);
}

export function setLoadingAttr(elm, value = true) {
    elm.toggleAttribute("loading", value);
}
