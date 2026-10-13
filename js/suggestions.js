import { topicEntries, pristine, titleOf, simOf } from './catalog.js';
import { data } from './userdata.js';
import { state } from './state.js';

// ---------- Suggestions: up to 15, ranked by ties to what you opened or starred ----------
var SUGGEST_MAX = 15;
export var suggested = {};
export function computeSuggestions() {
    var mine = {};
    Object.keys(data.opened).forEach(function (r) { mine[r] = true; });
    Object.keys(data.starred).forEach(function (r) { mine[r] = true; });
    var ties = {};
    Object.keys(mine).forEach(function (src) {
        (simOf[src] || []).forEach(function (t) { ties[t] = ties[t] || {}; ties[t][src] = true; });
    });
    topicEntries.forEach(function (el) {
        var c = el.dataset.rid;
        (simOf[c] || []).forEach(function (t) { if (mine[t]) { ties[c] = ties[c] || {}; ties[c][t] = true; } });
    });
    var order = {};
    topicEntries.forEach(function (el, i) { order[el.dataset.rid] = i; });
    var ranked = Object.keys(ties).filter(function (c) { return !mine[c] && pristine[c]; })
        .map(function (c) { return { rid: c, n: Object.keys(ties[c]).length, from: Object.keys(ties[c]) }; })
        .sort(function (a, b) { return b.n - a.n || order[a.rid] - order[b.rid]; })
        .slice(0, SUGGEST_MAX);
    Object.keys(suggested).forEach(function (rid) { delete suggested[rid]; });
    ranked.forEach(function (x) { suggested[x.rid] = x; });
    document.querySelectorAll('.entry[data-rid]').forEach(paintSuggestion);
}
export function paintSuggestion(el) {
    var note = el.querySelector('.suggest-note');
    if (!note) { return; }
    var sgg = suggested[el.dataset.rid];
    if (!sgg || state.mine !== 'suggested') { note.hidden = true; return; }
    var names = sgg.from.slice(0, 3).map(function (r) { return titleOf[r]; });
    note.textContent = 'Suggested: ' + sgg.n + (sgg.n === 1 ? ' tie' : ' ties') + ' to what you opened or starred (' + names.join('; ') + (sgg.from.length > 3 ? '; …' : '') + ')';
    note.hidden = false;
}
