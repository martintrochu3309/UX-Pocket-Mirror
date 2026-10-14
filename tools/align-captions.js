// Align the caption text in js/content.js with whisper.cpp word timings (DTW), and write js/caption-timing.js.
// Run it again after changing caption text, so the words light up in time with Kevin.
//
// 1. For each Mirror, make word timings with whisper.cpp (github.com/ggml-org/whisper.cpp) and the small.en model:
//      ffmpeg -i assets/mirrors/mirror-01.mp3 -ar 16000 -ac 1 words/m01.wav
//      whisper-cli -m ggml-small.en.bin -f words/m01.wav -l en --dtw small.en -ojf -of words/m01
// 2. node tools/align-captions.js <project dir> <words dir>
const fs = require('fs'), path = require('path');
const [proj, wordsDir] = process.argv.slice(2);
global.window = {};
require(path.join(proj, 'js/content.js'));
const CAPTIONS = window.PM_CONTENT.CAPTIONS;
const OFFSET = -0.06; // DTW marks a token slightly after its onset

const norm = w => w.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]/g, '');

function whisperWords(file) {
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const words = [];
  j.transcription.forEach(seg => seg.tokens.forEach(t => {
    if (/^\[_/.test(t.text) || t.t_dtw < 0) return;
    const txt = t.text;
    const starts = /^\s/.test(txt) || !words.length;
    const piece = norm(txt);
    if (starts && piece) words.push({ w: piece, t: t.t_dtw / 100 + OFFSET });
    else if (words.length) words[words.length - 1].w += piece;
  }));
  return words.filter(x => x.w);
}

// longest common subsequence alignment between caption words and whisper words
function align(a, b) {
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const map = new Array(n).fill(-1);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { map[i] = j; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  return map;
}

const out = {}, report = [];
Object.keys(CAPTIONS).forEach(n => {
  const file = path.join(wordsDir, 'm' + String(n).padStart(2, '0') + '.json');
  if (!fs.existsSync(file)) return;
  const lines = CAPTIONS[n];
  const cap = []; // flat list of caption words
  lines.forEach((L, li) => L[2].split(' ').forEach((w, wi) => cap.push({ li, wi, w: norm(w) })));
  const ww = whisperWords(file);
  const map = align(cap.map(c => c.w), ww.map(x => x.w));
  let matched = 0;
  cap.forEach((c, k) => { if (map[k] >= 0) { c.t = ww[map[k]].t; matched++; } });
  // unmatched words: spread between the nearest matched neighbours (or the line bounds)
  cap.forEach((c, k) => {
    if (c.t != null) return;
    let p = k - 1; while (p >= 0 && cap[p].t == null) p--;
    let q = k + 1; while (q < cap.length && cap[q].t == null) q++;
    const L = lines[c.li];
    const t0 = p >= 0 ? cap[p].t : L[0], t1 = q < cap.length ? cap[q].t : L[1];
    const i0 = p >= 0 ? p : k - 1, i1 = q < cap.length ? q : k + 1;
    c.t = t0 + (t1 - t0) * (k - i0) / (i1 - i0);
  });
  // never go backwards
  for (let k = 1; k < cap.length; k++) if (cap[k].t < cap[k - 1].t) cap[k].t = cap[k - 1].t;
  out[n] = lines.map((L, li) => cap.filter(c => c.li === li).map(c => +c.t.toFixed(2)));
  report.push('Mirror ' + n + ': ' + matched + '/' + cap.length + ' words matched');
});

const body = '/*\n * THE POCKET MIRROR · caption word timings (generated, do not edit by hand)\n' +
  ' * For each Mirror, each caption line: the second each word starts, from the audio itself.\n' +
  ' * If a line\'s text in content.js changes, its word count no longer matches and that line falls back\n' +
  ' * to spreading its words evenly, so captions never break. Regenerate after editing caption text.\n */\n' +
  'window.PM_CAPTION_TIMING = {\n' +
  Object.keys(out).map(n => '  ' + n + ': [\n' + out[n].map(a => '    [' + a.join(', ') + ']').join(',\n') + '\n  ]').join(',\n') +
  '\n};\n';
fs.writeFileSync(path.join(proj, 'js/caption-timing.js'), body);
console.log(report.join('\n'));
