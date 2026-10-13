import { pristine, titleOf } from './catalog.js';
import { data, EPOCH, DAY, today, saveMarks, saveReflections, clearData } from './userdata.js';
import { refreshAll } from './entries.js';
import { note } from './progress.js';

// ---------- Export / import / clear ----------
function exportData() {
    var out = { site: 'AI Safety Resources', version: 1, exported: new Date().toISOString(), opened: {}, starred: Object.keys(data.starred), reflections: {} };
    Object.keys(data.opened).forEach(function (rid) { out.opened[rid] = new Date(EPOCH + data.opened[rid] * DAY).toISOString().slice(0, 10); });
    Object.keys(data.reflect).forEach(function (rid) {
        var qs = Array.prototype.map.call(pristine[rid].querySelectorAll('.rq .q'), function (q) { return q.textContent; });
        out.reflections[rid] = { title: titleOf[rid], answers: qs.map(function (q, i) { return { question: q, answer: (data.reflect[rid][i] || '') }; }) };
    });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ai-safety-resources-my-data.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    note('Exported ' + Object.keys(out.opened).length + ' opened, ' + out.starred.length + ' starred and ' + Object.keys(out.reflections).length + ' reflections.');
}

function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
        try {
            var d = JSON.parse(reader.result);
            var nO = 0, nS = 0, nR = 0;
            Object.keys(d.opened || {}).forEach(function (rid) {
                if (!pristine[rid]) { return; }
                var day = Math.floor((Date.parse(d.opened[rid]) - EPOCH) / DAY);
                if (isNaN(day)) { day = today(); }
                if (!Object.prototype.hasOwnProperty.call(data.opened, rid) || data.opened[rid] < day) { data.opened[rid] = day; }
                nO++;
            });
            (d.starred || []).forEach(function (rid) { if (pristine[rid]) { data.starred[rid] = true; nS++; } });
            Object.keys(d.reflections || {}).forEach(function (rid) {
                if (!pristine[rid]) { return; }
                var inc = (d.reflections[rid].answers || []).map(function (x) { return x && x.answer ? String(x.answer) : ''; });
                var cur = (data.reflect[rid] || ['', '', '']).slice();
                for (var i = 0; i < 3; i++) { if (!(cur[i] && cur[i].trim()) && inc[i]) { cur[i] = inc[i]; } }
                data.reflect[rid] = cur;
                nR++;
            });
            saveMarks(); saveReflections();
            refreshAll();
            note('Imported ' + nO + ' opened, ' + nS + ' starred and ' + nR + ' reflections. Existing answers were kept.');
        } catch (e) {
            note('That file could not be read. Choose a file exported from this page.');
        }
    };
    reader.readAsText(file);
}

export function initTransfer() {
    document.getElementById('export-data').addEventListener('click', exportData);
    var importInput = document.getElementById('import-data');
    document.getElementById('import-btn').addEventListener('click', function () { importInput.click(); });
    importInput.addEventListener('change', function () { if (importInput.files[0]) { importData(importInput.files[0]); } importInput.value = ''; });
    document.getElementById('clear-data').addEventListener('click', function () {
        var b = this;
        if (b.dataset.confirm !== '1') {
            b.dataset.confirm = '1';
            b.textContent = 'Tap again to erase everything';
            setTimeout(function () { b.dataset.confirm = ''; b.textContent = 'Clear my data'; }, 4000);
            return;
        }
        b.dataset.confirm = ''; b.textContent = 'Clear my data';
        clearData();
        saveMarks(); saveReflections();
        refreshAll();
        note('Your opened, starred and reflection data has been erased from this browser.');
    });
}
