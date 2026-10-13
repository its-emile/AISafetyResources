import { topicGrid, outletGrid, topicEntries } from './catalog.js';
import { data, answeredCount } from './userdata.js';
import { suggested, paintSuggestion } from './suggestions.js';
import { state } from './state.js';
import outlets from './data/outlets.js';

// ---------- Filters ----------
export var search = document.getElementById('search');
var countEl = document.getElementById('result-count');
var noResults = document.getElementById('no-results');

var types = { all: 'All', book: 'Books', textbook: 'Textbooks', course: 'Courses', program: 'Programs', certification: 'Certifications', report: 'Reports', paper: 'Papers', post: 'Articles', framework: 'Frameworks', standard: 'Standards', law: 'Laws', guide: 'Guides', tool: 'Tools', benchmark: 'Benchmarks', leaderboard: 'Leaderboards', database: 'Databases', hub: 'Hubs', newsletter: 'Newsletters', podcast: 'Podcasts', video: 'Video' };
var levels = { all: 'All', intro: 'Intro', intermediate: 'Intermediate', advanced: 'Advanced' };
var years = { all: 'All', y2026: '2026', y2025: '2025', y2024: '2024', y2023: '2023', older: '2022 and earlier', ongoing: 'Ongoing' };
var mines = { all: 'All', suggested: 'Suggested', starred: 'Starred', opened: 'Opened', unopened: 'Not opened', reflected: 'With reflections' };
var labels = { type: types, level: levels, year: years, mine: mines };

function yearKey(y) { return y === 'ongoing' ? 'ongoing' : (+y <= 2022 ? 'older' : 'y' + y); }

export function makeChips(containerId, key) {
    var box = document.getElementById(containerId);
    Object.keys(labels[key]).forEach(function (val) {
        if (key === 'type' && val !== 'all' && !topicEntries.some(function (e) { return e.dataset.type === val; })) { return; }
        if (key === 'level' && val !== 'all' && !topicEntries.some(function (e) { return e.dataset.level === val; })) { return; }
        if (key === 'year' && val !== 'all' && !topicEntries.some(function (e) { return yearKey(e.dataset.year) === val; })) { return; }
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.id = key + '-' + val;
        b.textContent = labels[key][val];
        b.setAttribute('aria-pressed', String(state[key] === val));
        b.addEventListener('click', function () { setFilter(key, val); });
        box.appendChild(b);
    });
}

function syncHash() {
    var token = '';
    if (state.view !== 'topic') { token = 'view-' + state.view; }
    else if (state.mine !== 'all') { token = 'mine-' + state.mine; }
    else if (state.year !== 'all') { token = 'year-' + state.year; }
    else if (state.type !== 'all') { token = 'type-' + state.type; }
    else if (state.level !== 'all') { token = 'level-' + state.level; }
    try { history.replaceState(null, '', token ? '#' + token : location.pathname + location.search); } catch (e) {}
}

export function setFilter(key, val) {
    state[key] = val;
    document.querySelectorAll('#' + key + '-filters .chip').forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.id === key + '-' + val));
    });
    if (key === 'mine') { document.querySelectorAll('.entry[data-rid]').forEach(paintSuggestion); }
    apply();
    syncHash();
}

export function setView(v) {
    state.view = v;
    topicGrid.hidden = v !== 'topic';
    outletGrid.hidden = v !== 'outlets';
    ['topic', 'outlets'].forEach(function (k) {
        document.getElementById('view-' + k).setAttribute('aria-pressed', String(v === k));
    });
    apply();
    syncHash();
}

export function activeGrid() { return state.view === 'outlets' ? outletGrid : topicGrid; }

function mineOk(rid) {
    switch (state.mine) {
        case 'suggested': return !!suggested[rid];
        case 'starred': return !!data.starred[rid];
        case 'opened': return Object.prototype.hasOwnProperty.call(data.opened, rid);
        case 'unopened': return !Object.prototype.hasOwnProperty.call(data.opened, rid);
        case 'reflected': return answeredCount(rid) > 0;
        default: return true;
    }
}

export function apply() {
    var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    var grid = activeGrid();
    var list = Array.prototype.slice.call(grid.querySelectorAll('.entry'));
    list.forEach(function (e) {
        var ok = (state.type === 'all' || e.dataset.type === state.type) &&
            (state.level === 'all' || e.dataset.level === state.level) &&
            (state.year === 'all' || yearKey(e.dataset.year) === state.year) &&
            mineOk(e.dataset.rid) &&
            words.every(function (w) { return e.dataset.search.indexOf(w) !== -1; });
        e.hidden = !ok;
    });
    grid.querySelectorAll('.category').forEach(function (c) {
        c.hidden = !c.querySelector('.entry:not([hidden])');
    });
    var n = list.filter(function (e) { return !e.hidden; }).length;
    var total = list.length;
    var unit = state.view === 'outlets' ? ' publications from the top ' + outlets.length + ' outlets' : ' resources';
    countEl.textContent = n === total ? 'Showing all ' + n + unit : 'Showing ' + n + ' of ' + total + unit;
    noResults.textContent = (state.mine === 'suggested' && !Object.keys(suggested).length)
        ? 'No suggestions yet. Open or star a few resources and similar ones will appear here.'
        : 'No resources match. Try a different word or clear a filter.';
    noResults.hidden = n !== 0;
}

// Deep links: #view-outlets, #mine-suggested, #mine-starred, #year-y2025, #type-course, #level-intro
export function readHash() {
    var h = location.hash.slice(1);
    var m = /^(view|mine|year|type|level)-([a-z0-9]+)$/.exec(h);
    if (!m) { return false; }
    if (m[1] === 'view') {
        if (m[2] === 'outlets' || m[2] === 'topic') { setView(m[2]); return true; }
        return false;
    }
    if (!labels[m[1]][m[2]]) { return false; }
    if (state.view !== 'topic') { setView('topic'); }
    setFilter(m[1], m[2]);
    return true;
}
