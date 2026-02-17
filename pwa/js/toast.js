// Code based on https://shoelace.style/components/alert#duration
import '@shoelace-style/shoelace/dist/components/alert/alert.js';


/**
 * Emit a toast notification.
 * @param {string} message 
 * @param {object} [options] 
 * @param {string} [options.type] - neutral, info, success, warning, error
 * @param {number} [options.duration] - default is 10000 (ms), 0 to disable auto close
 * @param {boolean} [options.countdown] - show a countdown bar, default is true
 * @param {boolean} [options.closable] - show close button, default is true
 * @returns 
 */
export function toast(message, options = {}) {
    if ( !message ) return;

    const [variant, icon] = {
        neutral: ["neutral", "info-circle"],
        info:    ["primary", "info-circle"],
        success: ["success", "check2-circle"],
        warning: ["warning", "exclamation-triangle"],
        error:   ["danger" , "exclamation-octagon"]
    }[options.type ?? "neutral"]

    const alert = Object.assign(document.createElement('sl-alert'), {
        variant,
        closable: (options.closable) ?? true,
        duration: (options.duration) ?? 10000,
        countdown: (options.countdown ?? true) ? 'rtl' : false,
        innerHTML: `
            ${icon ? `<sl-icon name="${icon}" slot="icon"></sl-icon>` : ''}
            ${message}
        `
    });

    document.body.append(alert);
    return alert.toast();
}
