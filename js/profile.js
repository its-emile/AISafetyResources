import { canStoreReflections } from './storage.js';
import { state } from './state.js';
import { setFilter, setView } from './filters.js';
import { updateCounts } from './progress.js';

// ---------- Profile modal ----------
var dlg = document.getElementById('profile');
var profileBtn = document.getElementById('profile-btn');
function openProfile() {
    updateCounts();
    if (dlg.showModal) { dlg.showModal(); } else { dlg.setAttribute('open', ''); }
}
function closeProfile() { if (dlg.close) { dlg.close(); } else { dlg.removeAttribute('open'); } profileBtn.focus(); }
function showMine(which) {
    closeProfile();
    if (state.view !== 'topic') { setView('topic'); }
    setFilter('mine', which);
    document.getElementById('toolbar').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

export function initProfile() {
    profileBtn.addEventListener('click', openProfile);
    document.getElementById('profile-close').addEventListener('click', closeProfile);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) { closeProfile(); } });
    document.getElementById('show-suggested').addEventListener('click', function () { showMine('suggested'); });
    document.getElementById('show-opened').addEventListener('click', function () { showMine('opened'); });
    document.getElementById('show-starred').addEventListener('click', function () { showMine('starred'); });
    if (!canStoreReflections) {
        document.getElementById('privacy-note').textContent = 'This browser is blocking local storage, so reflections will not be kept between visits. Opened and starred marks use a cookie and may still work.';
    }
    profileBtn.hidden = false;
}
