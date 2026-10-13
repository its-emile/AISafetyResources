import { outletGrid, pristine } from './catalog.js';
import outlets from './data/outlets.js';

// ---------- By-outlet view: clones of the topic entries, grouped by publisher ----------
function cloneFor(rid, suffix) {
    var c = pristine[rid].cloneNode(true);
    c.id = rid + '--' + suffix;
    return c;
}

export function buildOutletView() {
    outlets.forEach(function (o) {
        var sec = document.createElement('section');
        sec.className = 'category';
        sec.id = 'outlet-' + o.id;
        var h = document.createElement('h2');
        h.textContent = o.name;
        var p = document.createElement('p');
        p.className = 'category-lede';
        p.textContent = o.desc + ' · ' + o.entries.length + ' publications';
        var ul = document.createElement('ul');
        ul.className = 'category-links';
        o.entries.forEach(function (rid) {
            if (!pristine[rid]) { return; }
            var c = cloneFor(rid, o.id);
            ul.appendChild(c);
        });
        sec.appendChild(h); sec.appendChild(p); sec.appendChild(ul);
        outletGrid.appendChild(sec);
    });
}
