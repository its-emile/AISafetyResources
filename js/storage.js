// ---------- Browser storage: cookies for opened + starred, localStorage for reflections ----------
var COOKIE_PATH = location.pathname.replace(/[^\/]*$/, '') || '/';
var COOKIE_AGE = 400 * 24 * 3600;
export var K_OPEN = 'asr_open', K_STAR = 'asr_star', K_REFLECT = 'asr_reflect';

export function readCookie(name) {
    try {
        var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
        return m ? decodeURIComponent(m[1]) : '';
    } catch (e) { return ''; }
}
export function writeCookie(name, value) {
    try {
        document.cookie = name + '=' + encodeURIComponent(value) + '; Max-Age=' + (value ? COOKIE_AGE : 0) +
            '; Path=' + COOKIE_PATH + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) {}
}
export function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
export function lsSet(k, v) {
    try { if (v === null) { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } return true; }
    catch (e) { return false; }
}
export var canStoreReflections = lsSet('asr_probe', '1') && lsSet('asr_probe', null);
