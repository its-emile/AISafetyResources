import { topicEntries, outletGrid } from './catalog.js';
import { load } from './userdata.js';
import { state } from './state.js';
import { enhance } from './entries.js';
import { buildOutletView } from './outlets.js';
import { computeSuggestions } from './suggestions.js';
import { search, makeChips, setView, apply, readHash } from './filters.js';
import { updateCounts } from './progress.js';
import { initTransfer } from './transfer.js';
import { initProfile } from './profile.js';
import { initNavigation } from './navigation.js';

// ---------- Start ----------
buildOutletView();
initTransfer();
initProfile();

load();
topicEntries.forEach(enhance);
Array.prototype.forEach.call(outletGrid.querySelectorAll('.entry'), enhance);

computeSuggestions();
makeChips('mine-filters', 'mine');
makeChips('year-filters', 'year');
makeChips('type-filters', 'type');
makeChips('level-filters', 'level');
updateCounts();
search.addEventListener('input', function () { state.q = search.value; apply(); });
document.getElementById('toolbar').hidden = false;
['topic', 'outlets'].forEach(function (k) {
    document.getElementById('view-' + k).addEventListener('click', function () { setView(k); });
});

if (!readHash()) { apply(); }
window.addEventListener('hashchange', readHash);

initNavigation();
