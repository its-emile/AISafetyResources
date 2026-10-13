// ---------- Favicons: fall back to an emoji per resource type ----------
var emojiByType = { report: '📄', paper: '📄', video: '🎥', book: '📖', textbook: '📖', course: '🎓', program: '🎓', certification: '🎓', hub: '🧭', post: '💡', framework: '📋', guide: '📋', standard: '📋', law: '⚖️', tool: '🛠️', benchmark: '📊', leaderboard: '📊', database: '🗂️', newsletter: '📰', podcast: '🎧' };
export function attachFallback(img) {
    if (img.dataset.fb) { return; }
    img.dataset.fb = '1';
    function fallback() {
        var host = img.closest('.entry');
        if (!img.parentNode || !host) { return; }
        var s = document.createElement('span');
        s.className = 'emoji-icon';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = emojiByType[host.dataset.type] || '🔗';
        img.replaceWith(s);
    }
    // Modules run after parsing, so an image may already have failed before we could listen
    if (img.complete && img.getAttribute('src') && !img.naturalWidth) { fallback(); return; }
    img.addEventListener('error', fallback);
}
