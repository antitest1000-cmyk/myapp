const fs = require('fs');

function fixMojibake(str) {
  return str
    // Fire emoji: ðŸ”¥ -> 🔥
    .replace(/\u00F0\u0178\u201D\u00A5/g, '🔥')
    // Sparkles: âœ¨ -> ✨
    .replace(/\u00E2\u0153\u00A8/g, '✨')
    // En dash: â€“ -> –
    .replace(/\u00E2\u20AC\u2013/g, '–')
    .replace(/\u00E2\u20AC\u201C/g, '–')
    // Em dash: â€” -> —
    .replace(/\u00E2\u20AC\u2014/g, '—')
    // Bullet: â€¢ -> •
    .replace(/\u00E2\u20AC\u00A2/g, '•')
    // Checkmarks:
    .replace(/\u00E2\u0153\u201C/g, '✓')
    .replace(/\u00E2\u0153\u201D/g, '✓')
    .replace(/\u00E2\u0153\u2014/g, '✓')
    // Ballot X: âœ– -> ✕
    .replace(/\u00E2\u0153\u2013/g, '✕')
    // Clock: ðŸ•  -> ⏳
    .replace(/\u00F0\u0178\u2022\u0090/g, '⏳')
    // Down arrow: â¬‡ï¸  -> ⬇️
    .replace(/\u00E2\u00AC\u2021\u00EF\u00B8\u008F/g, '⬇️')
    // Shield: ðŸ›¡ï¸  -> 🛡️
    .replace(/\u00F0\u0178\u203A\u00A1\u00EF\u00B8\u008F/g, '🛡️')
    // Lightning: âš¡ -> ⚡
    .replace(/\u00E2\u0161\u00A1/g, '⚡')
    // Palette: ðŸŽ¨ -> 🎨
    .replace(/\u00F0\u0178\u017D\u00A8/g, '🎨')
    // Scissors: âœ‚ï¸  -> ✂️
    .replace(/\u00E2\u0153\u201A\u00EF\u00B8\u008F/g, '✂️')
    // Camera: ðŸ“· -> 📷
    .replace(/\u00F0\u0178\u201C\u00B7/g, '📷')
    // Frame/image: ðŸ“  -> 🖼️
    .replace(/\u00F0\u0178\u201C\u0153/g, '🖼️')
    // Undo: â†¶ -> ↶
    .replace(/\u00E2\u2020\u00B6/g, '↶')
    // Em dash variant:
    .replace(/\u00E2\u20AC\u201D/g, '—')
    // Image frame:
    .replace(/\u00F0\u0178\u201C\u0081/g, '🖼️');
}

let idxContent = fs.readFileSync('index.html', 'utf8');
let fixedIdx = fixMojibake(idxContent);
fs.writeFileSync('index.html', fixedIdx, 'utf8');
console.log('Fixed index.html, diff length:', idxContent.length - fixedIdx.length);

let mainContent = fs.readFileSync('src/main.js', 'utf8');
let fixedMain = fixMojibake(mainContent);
fs.writeFileSync('src/main.js', fixedMain, 'utf8');
console.log('Fixed src/main.js, diff length:', mainContent.length - fixedMain.length);
