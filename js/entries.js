import { titleOf } from './catalog.js';
import { canStoreReflections } from './storage.js';
import { data, saveMarks, saveReflections, today, dayLabel, answeredCount } from './userdata.js';
import { attachFallback } from './favicons.js';
import { computeSuggestions } from './suggestions.js';
import { updateCounts } from './progress.js';
import { apply } from './filters.js';
import { state } from './state.js';

// ---------- Per-entry controls ----------
export function enhance(el) {
    var rid = el.dataset.rid;
    var actions = document.createElement('div');
    actions.className = 'entry-actions';
    var star = document.createElement('button');
    star.type = 'button';
    star.className = 'act star';
    star.addEventListener('click', function () { toggleStar(rid); });
    var opened = document.createElement('button');
    opened.type = 'button';
    opened.className = 'act opened-btn';
    opened.addEventListener('click', function () { toggleOpened(rid); });
    actions.appendChild(star);
    actions.appendChild(opened);
    var badges = el.querySelector('.badges');
    badges.parentNode.insertBefore(actions, badges.nextSibling);
    var sn = document.createElement('p');
    sn.className = 'suggest-note';
    sn.hidden = true;
    el.insertBefore(sn, badges);

    el.querySelectorAll('.rq li').forEach(function (li, i) {
        var q = li.querySelector('.q');
        q.id = 'q-' + el.id + '-' + i;
        var ta = document.createElement('textarea');
        ta.id = 'a-' + el.id + '-' + i;
        ta.rows = 2;
        ta.dataset.idx = String(i);
        ta.setAttribute('aria-labelledby', q.id);
        ta.placeholder = canStoreReflections ? 'Your answer (saved as you type)' : 'Your answer (this browser blocks storage, so it will not be kept)';
        var timer = null;
        ta.addEventListener('input', function () {
            var a = (data.reflect[rid] || ['', '', '']).slice();
            while (a.length < 3) { a.push(''); }
            a[i] = ta.value;
            data.reflect[rid] = a;
            clearTimeout(timer);
            timer = setTimeout(function () { saveReflections(); refresh(rid, ta); }, 400);
        });
        li.appendChild(ta);
    });

    var link = el.querySelector('.entry-title');
    var mark = function () { markOpened(rid); };
    link.addEventListener('click', mark);
    link.addEventListener('auxclick', function (e) { if (e.button === 1) { mark(); } });
    el.querySelectorAll('img.favicon').forEach(attachFallback);
    paint(el);
}

function paint(el, skip) {
    var rid = el.dataset.rid;
    var title = titleOf[rid];
    var isStar = !!data.starred[rid];
    var isOpen = Object.prototype.hasOwnProperty.call(data.opened, rid);
    el.classList.toggle('is-starred', isStar);
    el.classList.toggle('is-opened', isOpen);
    var star = el.querySelector('.act.star');
    star.setAttribute('aria-pressed', String(isStar));
    star.textContent = isStar ? '★ Starred' : '☆ Star';
    star.setAttribute('aria-label', (isStar ? 'Remove star from ' : 'Star ') + title);
    var ob = el.querySelector('.act.opened-btn');
    ob.setAttribute('aria-pressed', String(isOpen));
    ob.textContent = isOpen ? '✓ Opened ' + dayLabel(data.opened[rid]) : 'Mark as opened';
    ob.setAttribute('aria-label', isOpen ? 'Opened ' + dayLabel(data.opened[rid]) + '. Mark ' + title + ' as not opened' : 'Mark ' + title + ' as opened');
    var a = data.reflect[rid] || [];
    el.querySelectorAll('.rq textarea').forEach(function (ta) {
        if (ta !== skip && document.activeElement !== ta) { ta.value = a[+ta.dataset.idx] || ''; }
    });
    var rf = el.querySelector('details.reflect');
    if (rf) { rf.hidden = !isOpen; if (!isOpen) { rf.open = false; } }
    var n = answeredCount(rid);
    el.querySelector('.reflect-count').textContent = n ? '· ' + n + ' of 3 answered' : '· 3 questions';
}

function allCopies(rid) {
    return Array.prototype.slice.call(document.querySelectorAll('.entry[data-rid="' + rid + '"]'));
}
function refresh(rid, skip) {
    allCopies(rid).forEach(function (el) { paint(el, skip); });
    computeSuggestions();
    updateCounts();
    if (state.mine !== 'all') { apply(); }
}
export function refreshAll() {
    document.querySelectorAll('.entry[data-rid]').forEach(function (el) { if (el.querySelector('.entry-actions')) { paint(el); } });
    computeSuggestions(); updateCounts(); apply();
}

export function markOpened(rid) {
    data.opened[rid] = today();
    saveMarks();
    refresh(rid);
}
function toggleOpened(rid) {
    if (Object.prototype.hasOwnProperty.call(data.opened, rid)) { delete data.opened[rid]; } else { data.opened[rid] = today(); }
    saveMarks();
    refresh(rid);
}
function toggleStar(rid) {
    if (data.starred[rid]) { delete data.starred[rid]; } else { data.starred[rid] = true; }
    saveMarks();
    refresh(rid);
}
