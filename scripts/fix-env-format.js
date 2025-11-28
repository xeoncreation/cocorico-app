const fs = require('fs');
const path = '.env.local';
const out = '.env.local.fixed';

if (!fs.existsSync(path)) {
  console.error('No .env.local file found');
  process.exit(1);
}

const raw = fs.readFileSync(path, 'utf8');
// Normalize newlines and split
const lines = raw.split(/\r?\n/);
const outLines = [];
let lastKeyLineIndex = -1;

const keyPattern = /([A-Za-z_][A-Za-z0-9_]*)=/g;

for (const originalLine of lines) {
  const line = originalLine.trimEnd();

  // Leave blank lines and comments untouched
  if (line.length === 0 || line.startsWith('#')) {
    outLines.push(line);
    lastKeyLineIndex = outLines.length - 1;
    continue;
  }

  // If the line looks like it contains multiple key=value pairs glued together,
  // split by occurrences of KEY= (where KEY is an identifier) and keep each chunk
  // as its own line.
  const matches = [];
  while (true) {
    const m = keyPattern.exec(line);
    if (!m) break;
    matches.push({ key: m[1], idx: m.index });
  }

  if (matches.length > 1) {
    // Split into multiple segments from each match start
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].idx;
      const end = i + 1 < matches.length ? matches[i + 1].idx : line.length;
      let seg = line.slice(start, end).trim();
      // If there is an inline comment (space + #) split it into own line
      const commentIndex = seg.indexOf(' #');
      if (commentIndex !== -1) {
        const left = seg.slice(0, commentIndex).trim();
        const right = seg.slice(commentIndex + 1).trim(); // keep '#'
        if (left.length) outLines.push(left);
        if (right.length) outLines.push('#' + right.replace(/^#+/, '')); // ensure starting '#'
      } else {
        if (seg.length) outLines.push(seg);
      }
    }
    lastKeyLineIndex = outLines.length - 1;
    continue;
  }

  // If the line includes at least one '=' it's either a key=value or a broken continuation
  if (line.includes('=')) {
    // If there's an inline comment in the single line (like "KEY=value   # comment"), split it
    const commentIndex = line.indexOf(' #');
    if (commentIndex !== -1) {
      const left = line.slice(0, commentIndex).trim();
      const right = line.slice(commentIndex + 1).trim();
      if (left.length) outLines.push(left);
      if (right.length) outLines.push('#' + right.replace(/^#+/, ''));
    } else {
      outLines.push(line);
    }
    lastKeyLineIndex = outLines.length - 1;
  } else {
    // Continuation of previous value: append without inserting spurious spaces
    if (lastKeyLineIndex >= 0) {
      outLines[lastKeyLineIndex] = outLines[lastKeyLineIndex] + line.trim();
    } else {
      // nothing to append to — keep the line
      outLines.push(line);
      lastKeyLineIndex = outLines.length - 1;
    }
  }
}

fs.writeFileSync(out, outLines.join('\n'));
console.log('Wrote', out);
