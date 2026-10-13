import { K_OPEN, K_STAR, K_REFLECT, readCookie, writeCookie, lsGet, lsSet } from './storage.js';
import { pristine, codeToRid, ridToCode } from './catalog.js';

// ---------- Your data: what you opened, starred and wrote ----------
export var EPOCH = Date.UTC(2020, 0, 1);
export var DAY = 86400000;

export var data = { opened: {}, starred: {}, reflect: {} };

export function load() {
    var o = readCookie(K_OPEN) || lsGet(K_OPEN) || '';
    var st = readCookie(K_STAR) || lsGet(K_STAR) || '';
    o.split('.').forEach(function (part) {
        var bits = part.split('-');
        var rid = codeToRid[bits[0]];
        if (rid) { data.opened[rid] = parseInt(bits[1] || '0', 36) || 0; }
    });
    st.split('.').forEach(function (c) { if (codeToRid[c]) { data.starred[codeToRid[c]] = true; } });
    try {
        var r = JSON.parse(lsGet(K_REFLECT) || '{}');
        Object.keys(r).forEach(function (rid) { if (pristine[rid] && Array.isArray(r[rid])) { data.reflect[rid] = r[rid].slice(0, 3); } });
    } catch (e) {}
}

export function saveMarks() {
    var o = Object.keys(data.opened).map(function (rid) { return ridToCode[rid] + '-' + data.opened[rid].toString(36); }).join('.');
    var st = Object.keys(data.starred).map(function (rid) { return ridToCode[rid]; }).join('.');
    writeCookie(K_OPEN, o); writeCookie(K_STAR, st);
    lsSet(K_OPEN, o || null); lsSet(K_STAR, st || null);
}
export function saveReflections() {
    var clean = {};
    Object.keys(data.reflect).forEach(function (rid) {
        var a = data.reflect[rid];
        if (a.some(function (x) { return x && x.trim(); })) { clean[rid] = a; }
    });
    data.reflect = clean;
    lsSet(K_REFLECT, Object.keys(clean).length ? JSON.stringify(clean) : null);
}

export function today() { return Math.floor((Date.now() - EPOCH) / DAY); }
export function dayLabel(d) {
    var dt = new Date(EPOCH + d * DAY + DAY / 2);
    var opts = { day: 'numeric', month: 'short' };
    if (dt.getUTCFullYear() !== new Date().getFullYear()) { opts.year = 'numeric'; }
    opts.timeZone = 'UTC';
    try { return dt.toLocaleDateString(undefined, opts); } catch (e) { return dt.toISOString().slice(0, 10); }
}
export function answeredCount(rid) {
    var a = data.reflect[rid] || [];
    return a.filter(function (x) { return x && x.trim(); }).length;
}
export function clearData() {
    data.opened = {}; data.starred = {}; data.reflect = {};
}
