import { TOTAL } from './catalog.js';
import { data, answeredCount } from './userdata.js';
import { suggested } from './suggestions.js';

// ---------- Progress line, profile badge and "Mine" chip counts ----------
export function updateCounts() {
    var nOpen = Object.keys(data.opened).length;
    var nStar = Object.keys(data.starred).length;
    var nRef = Object.keys(data.reflect).filter(function (rid) { return answeredCount(rid) > 0; }).length;
    document.getElementById('progress-text').textContent =
        'Opened ' + nOpen + ' of ' + TOTAL + ' · ' + nStar + ' starred · reflections on ' + nRef;
    var badge = document.getElementById('profile-count');
    badge.textContent = nOpen ? String(nOpen) : '';
    badge.hidden = !nOpen;
    document.getElementById('profile-btn').setAttribute('aria-label', 'Your progress and data' + (nOpen ? ': ' + nOpen + ' opened' : ''));
    var nSug = Object.keys(suggested).length;
    var lbl = { suggested: 'Suggested (' + nSug + ')', starred: 'Starred (' + nStar + ')', opened: 'Opened (' + nOpen + ')', unopened: 'Not opened (' + (TOTAL - nOpen) + ')', reflected: 'With reflections (' + nRef + ')' };
    Object.keys(lbl).forEach(function (k) {
        var c = document.getElementById('mine-' + k);
        if (c) { c.textContent = lbl[k]; }
    });
}

var noteTimer = null;
export function note(msg) {
    var p = document.getElementById('progress-text');
    p.textContent = msg;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(updateCounts, 5000);
}
