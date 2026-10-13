import { state } from './state.js';
import { search, activeGrid, setFilter, setView } from './filters.js';
import { markOpened } from './entries.js';

export function initNavigation() {
    // Random pick from what is currently shown; counts as opened
    var randomBtn = document.getElementById('random-btn');
    randomBtn.hidden = false;
    randomBtn.addEventListener('click', function () {
        var pool = Array.prototype.slice.call(activeGrid().querySelectorAll('.entry')).filter(function (e) { return !e.hidden; });
        if (!pool.length) { return; }
        var pick = pool[Math.floor(Math.random() * pool.length)];
        document.querySelectorAll('.entry.highlight').forEach(function (e) { e.classList.remove('highlight'); });
        pick.classList.add('highlight');
        markOpened(pick.dataset.rid);
        window.open(pick.querySelector('.entry-title').href, '_blank', 'noopener');
    });

    // In-page links (paths, similar, ledes): show the full topic view so the target is visible
    document.addEventListener('click', function (e) {
        var a = e.target.closest('.path a[href^="#"], .similar a[href^="#"], .category-lede a[href^="#"]');
        if (!a) { return; }
        var target = a.getAttribute('href').slice(1);
        if (state.view !== 'topic') { setView('topic'); }
        if (state.q || state.type !== 'all' || state.level !== 'all' || state.year !== 'all' || state.mine !== 'all') {
            search.value = ''; state.q = '';
            ['type', 'level', 'year', 'mine'].forEach(function (k) { setFilter(k, 'all'); });
        }
        var el = document.getElementById(target);
        if (el) {
            e.preventDefault();
            document.querySelectorAll('.entry.highlight').forEach(function (x) { x.classList.remove('highlight'); });
            el.classList.add('highlight');
            el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
            var link = el.querySelector('.entry-title');
            if (link) { link.focus({ preventScroll: true }); }
        }
    });
}
