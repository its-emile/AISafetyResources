// ---------- Catalog: the resource entries as authored in index.html ----------
export var topicGrid = document.getElementById('categories');
export var outletGrid = document.getElementById('outlets');
export var topicEntries = Array.prototype.slice.call(topicGrid.querySelectorAll('.entry'));
export var pristine = {}, codeToRid = {}, ridToCode = {}, titleOf = {};
topicEntries.forEach(function (el) {
    var rid = el.dataset.rid;
    pristine[rid] = el.cloneNode(true);
    codeToRid[el.dataset.code] = rid;
    ridToCode[rid] = el.dataset.code;
    titleOf[rid] = el.querySelector('.entry-title span').textContent;
});
export var TOTAL = topicEntries.length;

export var simOf = {};
topicEntries.forEach(function (el) { simOf[el.dataset.rid] = (el.dataset.sim || '').split(' ').filter(Boolean); });
