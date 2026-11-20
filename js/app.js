/*
 * THE POCKET MIRROR · app
 * ---------------------------------------------------------------
 * Plain JavaScript, no framework, no build step.
 * Content lives in js/content.js. Styles in css/styles.css.
 *
 * Screens (hash routes):
 *   #/                 1 · Landing: swipe a path
 *   #/intro            1b · MEET KEVIN: the intro video, the first time FIND MY MIRROR is tapped
 *   #/mirrors          2 · Which one is you? (all 12 Mirrors, the first 4 until "See all")
 *   #/mirror/<n>       3 · Kevin's voice. Pauses at CONFIG.previewSeconds until an email is given
 *   #/unlocked/<kind>/<n>  4 · Card unlocked (straight after a Mirror or episode is finished for the first time)
 *   #/home[/tab]       5 · Home after email: mirrors | nudges | podcast
 *   #/episode/<n>      6 · Podcast episode player
 *   #/mirror21         7 · Mirror 21, the $99 training (white)
 *
 * Deep links (for QR codes):
 *   ?src=london-talk   tags every email captured from that link
 *   ?m=3               opens Mirror 03 directly
 *   ?path=own          old path links: open the landing page
 */
(function () {
  'use strict';

  var C = window.PM_CONTENT;
  var CONFIG = C.CONFIG, PATHS = C.PATHS, MIRRORS = C.MIRRORS, NUDGES = C.NUDGES, PODCAST = C.PODCAST, HOST = C.HOST;
  var TITLES = C.TITLES || {}, TABS = C.TABS || {}, M21 = C.MIRROR21 || null, CAPTIONS = C.CAPTIONS || {};
  var INTRO = C.INTRO && C.INTRO.video ? C.INTRO : null;
  var app = document.getElementById('app');
  var toastEl = document.getElementById('toast');

  /* ================================================================ icons */
  var svg = function (d, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>'; };
  var I = {
    back: svg('<path d="m15 5-7 7 7 7"/>'),
    down: svg('<path d="m5 9 7 7 7-7"/>'),
    play: '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5Z"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M8.5 5v14M15.5 5v14"/></svg>',
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', ' stroke-width="2.4"'),
    check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', ' stroke-width="3"'),
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', ' stroke-width="1.8"'),
    phones: svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1Zm16 0h-3v6h2a1 1 0 0 0 1-1Z"/>', ' stroke-width="1.8"'),
    flip: svg('<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>', ' stroke-width="1.9"'),
    download: svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', ' stroke-width="2.2"'),
    back15: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><text x="12" y="15.5" font-size="7" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Arial">15</text>', ' stroke-width="1.7"'),
    fwd15: svg('<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/><text x="12" y="15.5" font-size="7" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Arial">15</text>', ' stroke-width="1.7"'),
    // tab bar: LISTEN (headphones), COLLECT (stacked layers), EXPLORE (binoculars)
    tabMirrors: svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h3v6H5.5A1.5 1.5 0 0 1 4 18.5Zm16 0h-3v6h1.5a1.5 1.5 0 0 0 1.5-1.5Z"/>', ' stroke-width="1.6"'),
    tabNudges: svg('<path d="m12 3 9 4.5-9 4.5-9-4.5Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>', ' stroke-width="1.6"'),
    share: svg('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>', ' stroke-width="1.8"'),
    addSq: svg('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>', ' stroke-width="1.8"'),
    up: svg('<path d="M12 19V5M6 11l6-6 6 6"/>', ' stroke-width="2.2"'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>', ' stroke-width="2"'),
    cc: svg('<rect x="2.5" y="5" width="19" height="14" rx="3"/><text x="12" y="15.2" font-size="7.5" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Arial">CC</text>', ' stroke-width="1.6"'),
    target: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>', ' stroke-width="1.8"'),
    checkCircle: svg('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>', ' stroke-width="1.8"'),
    pen: svg('<path d="M16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1 1-4Z"/>', ' stroke-width="1.8"'),
    bolt: svg('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6Z"/>', ' stroke-width="1.8"'),
    video: svg('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>', ' stroke-width="1.8"'),
    chevUp: svg('<path d="m6 15 6-6 6 6"/>', ' stroke-width="2.2"'),
    repeat: svg('<path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 11V9.5a3.5 3.5 0 0 1 3.5-3.5h13.5"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M20.5 13v1.5a3.5 3.5 0 0 1-3.5 3.5H3.5"/>', ' stroke-width="1.8"'),
    // EXPLORE: a cassette (from the icon you sent): rounded body, two reels joined by the tape, the trapezoid at the bottom
    tabPodcast: svg('<rect x="2.5" y="5.5" width="19" height="13" rx="2.6"/><circle cx="8" cy="11" r="2"/><circle cx="16" cy="11" r="2"/><path d="M10 9.4h4M10 12.6h4M6.6 18.5l1.6-2.8h7.6l1.6 2.8"/>', ' stroke-width="1.6"')
  };
  var PLAYPAUSE = I.play + I.pause;

  /* ================================================================ helpers */
  function pathBy(k) { return PATHS.filter(function (p) { return p.key === k; })[0]; }
  function mirrorBy(n) { return MIRRORS.filter(function (m) { return m.n === +n; })[0]; }
  function nudgeBy(id) { return NUDGES.filter(function (x) { return x.id === id; })[0]; }
  function nudgesOf(deck) { return NUDGES.filter(function (x) { return x.deck === deck; }); }
  function episodeBy(n) { return PODCAST.episodes.filter(function (e) { return e.n === +n; })[0]; }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function fmt(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + pad2(s % 60); }
  function mins(s) { return Math.max(1, Math.round((s || 0) / 60)) + ' min'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cardSrc(id, deck) { return 'assets/cards/' + deck + '/' + id + '.jpg'; }
  var CARD_BACK = 'assets/cards/back.jpg';
  var AVAILABLE = MIRRORS.filter(function (m) { return !!m.audio; });
  var EPISODES = PODCAST.episodes.filter(function (e) { return !!e.audio; });

  /* ================================================================ the card collection
   * Every card has one source: the Mirror or episode whose `card` names it.
   * A card is collected once its source has been finished, so the collection is read from S.heard / S.eps.
   */
  var SOURCES = {};
  MIRRORS.forEach(function (m) { if (m.card) SOURCES[m.card] = { kind: 'mirror', n: m.n, item: m }; });
  PODCAST.episodes.forEach(function (e) { if (e.card) SOURCES[e.card] = { kind: 'episode', n: e.n, item: e }; });
  function sourceOf(id) { return SOURCES[id] || null; }
  function sourceDone(kind, n) { return kind === 'mirror' ? !!S.heard[n] : !!S.eps[n]; }
  function isCollected(id) { var s = sourceOf(id); return !!s && sourceDone(s.kind, s.n); }
  function collectedCount(deck) { return NUDGES.filter(function (x) { return (!deck || x.deck === deck) && isCollected(x.id); }).length; }
  function sourceName(s) { return (s.kind === 'mirror' ? 'MIRROR ' : 'EPISODE ') + pad2(s.n); }

  // Collection milestones (MIRROR21.milestones): reached and not shown yet, in priority order.
  function milestoneKey(ms) { return ms.cards ? 'c' + ms.cards : 'd' + ms.deck; }
  function milestonesDue() {
    var list = (M21 && M21.milestones) || [], count = collectedCount();
    return list.filter(function (ms) {
      if (S.m21Shown[milestoneKey(ms)]) return false;
      return ms.cards ? count >= ms.cards : collectedCount(ms.deck) === nudgesOf(ms.deck).length;
    });
  }
  var CIRC = 2 * Math.PI * 115; // ring radius 115 in a 250 viewBox

  /* ================================================================ saved state (this device) */
  var KEY = 'pocketMirror.v1';
  var QS = new URLSearchParams(location.search);

  // ?reset wipes this device's saved email and progress (works on the live site too).
  if (QS.has('reset')) {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    QS.delete('reset');
    history.replaceState(null, '', location.pathname + (QS.toString() ? '?' + QS.toString() : '') + location.hash);
  }

  // Demo mode: nothing is saved or sent, a refresh starts the journey again.
  //   CONFIG.demoMode = true        whole site in demo mode
  //   ?demo=locked|unlocked|gate    one page in demo mode, forced into that state (used by preview.html)
  var DEMO_STATE = QS.get('demo') || '';
  var DEMO = !!CONFIG.demoMode || !!DEMO_STATE;

  var S = { email: '', source: '', heard: {}, eps: {}, saved: {}, m21Shown: {}, m21EndHidden: {}, pending: [], deck: '', lastPath: '', lastMirror: 0, a2hsDone: false };
  if (!DEMO) {
    try { Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* private mode */ }
  } else if (CONFIG.demoMode) {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }
  if (DEMO_STATE === 'unlocked') {
    S.email = 'demo@example.com'; S.eps = { 1: true }; S.joinedAt = Date.now(); S.lastMirror = 1;
    MIRRORS.forEach(function (m) { if (m.audio) S.heard[m.n] = true; });
  }
  // Opened from the home-screen icon (iPhone keeps a separate memory there): carry the unlock over.
  // ONLY in the home-screen app itself. In Safari / WhatsApp / Instagram the ?pm=1 address is just a link that
  // someone shared after giving their own email, so it must NOT unlock anything: it is ignored and removed.
  var IS_HOME_APP = navigator.standalone === true || !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  if (QS.get('pm') === '1' && !IS_HOME_APP) {
    ['pm', 'h', 'e', 's', 'l', 'j'].forEach(function (k) { QS.delete(k); });
    try { history.replaceState(null, '', location.pathname + (QS.toString() ? '?' + QS.toString() : '') + location.hash); } catch (x) { /* ignore */ }
  }
  // People who opened such a shared link before this fix were saved as "email given" with no real email
  // ('home-screen'). Outside the home-screen app that doesn't count: they are asked for their email again.
  if (S.email === 'home-screen' && !IS_HOME_APP) {
    S.email = '';
    try { if (!DEMO) localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  if (QS.get('pm') === '1' && IS_HOME_APP) {
    if (!S.email) S.email = 'home-screen';
    (QS.get('h') || '').split(',').forEach(function (n) { if (+n) S.heard[+n] = true; });
    (QS.get('e') || '').split(',').forEach(function (n) { if (+n) S.eps[+n] = true; });
    (QS.get('s') || '').split(',').forEach(function (k) { if (/^(c\d+|d[a-z]+)$/.test(k)) S.m21Shown[k] = true; });
    if (+QS.get('l') && !S.lastMirror) {
      S.lastMirror = +QS.get('l');
      var lm = MIRRORS.filter(function (m) { return m.n === S.lastMirror; })[0];
      if (lm && !S.lastPath) S.lastPath = lm.path;
    }
    if (+QS.get('j') && !S.joinedAt) S.joinedAt = +QS.get('j') * 864e5;
    S.a2hsDone = true;
    try { history.replaceState(null, '', location.pathname + location.search + '#/home'); } catch (x) { /* ignore */ }
    try { if (!DEMO) localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  function persist() { stampInstallURL(); if (DEMO) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
  function unlocked() { return !!S.email; }

  /* ================================================================ Home tab titles (LISTEN · COLLECT · EXPLORE) */
  // tight Magistral, one line, no reflection (the logo above already has one). parts = TITLES.x, e.g. ['', 'LISTEN']
  function markTitle(parts, label) {
    return '<h1 class="sr-only">' + esc(label) + '</h1>' +
      '<p class="tab-title" aria-hidden="true" data-fit><span>' + esc(parts.join(' ').trim()) + '</span></p>';
  }
  // "12 OF 12 HEARD" + a white segmented bar, one segment per Mirror / card / episode
  function tabProgress(count, total, word, label) {
    var segs = '';
    for (var i = 0; i < total; i++) segs += '<span' + (i < count ? ' class="on"' : '') + '></span>';
    return '<div class="tab-progress"><span>' + count + ' OF ' + total + ' ' + word + '</span>' +
      '<div class="segs" role="progressbar" aria-label="' + esc(label) + '" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + count + '">' + segs + '</div></div>';
  }
  // shrink a title only if it is wider than the screen
  function fitTitles() {
    app.querySelectorAll('[data-fit]').forEach(function (el) {
      el.style.fontSize = '';
      var p = el.firstElementChild, cw = el.clientWidth, sw = p ? p.scrollWidth : 0;
      if (cw && sw > cw) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * cw / sw * 0.98).toFixed(1) + 'px';
    });
  }

  /* ================================================================ podcast vault: which episodes are open */
  function heardMirrors() { return Object.keys(S.heard).filter(function (k) { return S.heard[k]; }).length; }
  function heardEpisodes() { return Object.keys(S.eps).filter(function (k) { return S.eps[k]; }).length; }
  function episodeOpen(e) {
    if (!e || !e.audio) return false;
    var i = EPISODES.indexOf(e);
    if (i <= 0 || S.eps[e.n]) return true;
    var mode = CONFIG.podcastUnlock || 'listen';
    if (mode === 'all') return true;
    if (mode === 'weekly') {
      var days = (Date.now() - (S.joinedAt || Date.now())) / 864e5;
      return i <= Math.floor(days / (CONFIG.podcastEveryDays || 7));
    }
    return !!S.eps[EPISODES[i - 1].n]; // 'listen': finish the previous one
  }
  // short = the podcast list ("Finish 04 to open"); otherwise the toast ("Finish Episode 04 to open")
  function lockHint(e, short) {
    var i = EPISODES.indexOf(e);
    if ((CONFIG.podcastUnlock || 'listen') === 'weekly') {
      var every = CONFIG.podcastEveryDays || 7;
      var at = (S.joinedAt || Date.now()) + i * every * 864e5;
      var d = Math.max(1, Math.ceil((at - Date.now()) / 864e5));
      return 'Opens in ' + d + (d === 1 ? ' day' : ' days');
    }
    return 'Finish ' + (short ? '' : 'Episode ') + pad2(EPISODES[i - 1].n) + ' to open';
  }
  function nextEpisode() {
    var open = EPISODES.filter(episodeOpen);
    return open.filter(function (e) { return !S.eps[e.n]; })[0] || open[open.length - 1];
  }

  /* ================================================================ Mirror 21: visible to everyone after the email */
  // The MIRROR 21 logotype: MIRROR in bold italic Magistral, 21 in gold. Used every time Mirror 21 is named
  // (the one place gold stays in the app: it is the brand mark).
  var M21_MARK = '<span class="m21-mark">MIRROR <b>21</b></span>';
  function m21Card(eyebrow, line, extra) {
    // white card: grey label, the MIRROR 21 logotype, the line, one black button: SEE MIRROR 21
    return '<a class="m21-card' + (extra ? ' ' + extra : '') + '" href="#/mirror21" data-action="m21-open" data-from="' + (extra || 'card') + '" data-m21-card>' +
      '<span class="m21-eyebrow">' + esc(eyebrow || 'YOUR NEXT STEP') + '</span>' +
      '<span class="m21-name">' + M21_MARK + '</span>' +
      '<span class="m21-line">' + esc(line || M21.tagline) + '</span>' +
      '<span class="m21-cta">SEE ' + M21_MARK + '</span></a>';
  }

  /* ================================================================ add to home screen (after the email, once) */
  var UA = navigator.userAgent || '';
  var IS_IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var IN_APP = /Instagram|FBAN|FBAV|FB_IAB|WhatsApp|LinkedInApp|Snapchat|TikTok|musical_ly|Line\//i.test(UA);
  var STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var installPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); installPrompt = e;
    if (/^#\/home(\/mirrors)?$/.test(location.hash)) render();
  });
  function a2hsMode() {
    if (DEMO && QS.get('a2hs')) return QS.get('a2hs');
    if (STANDALONE || IN_APP) return '';
    if (installPrompt) return 'android';
    return IS_IOS ? 'ios' : '';
  }
  function a2hsCardHTML() {
    var mode = a2hsMode();
    if (!mode || S.a2hsDone || !unlocked() || heardMirrors() < 1) return '';
    return '<div class="a2hs" data-a2hs>' +
      '<div class="a2hs-row"><img src="assets/images/icon-192.png?v=2" alt="">' +
        '<span class="body"><b>KEEP IT ON YOUR PHONE</b><span>Add The Pocket Mirror to your home screen.</span></span>' +
        '<button type="button" class="a2hs-x" data-action="a2hs-x" aria-label="No thanks">' + I.close + '</button></div>' +
      '<button type="button" class="a2hs-go" data-action="a2hs-go">' + (mode === 'android' ? 'ADD TO HOME SCREEN' : 'SHOW ME HOW') + '</button>' +
    '</div>';
  }
  function a2hsSheetHTML() {
    return '<div class="dim" id="a2-dim" data-action="a2hs-close"></div>' +
      '<section class="sheet a2" id="a2" role="dialog" aria-modal="true" aria-labelledby="a2-title" inert>' +
        '<p class="eyebrow">TWO QUICK STEPS</p>' +
        '<h2 id="a2-title">ADD IT TO YOUR HOME SCREEN</h2>' +
        '<ol class="a2-steps">' +
          '<li><span class="n">1</span><span class="t">Tap <b>Share</b><span class="sub">In Safari it can sit under •••</span></span><span class="ico">' + I.share + '</span></li>' +
          '<li><span class="n">2</span><span class="t">Tap <b>Add to Home Screen</b>, then <b>Add</b></span><span class="ico">' + I.addSq + '</span></li>' +
        '</ol>' +
        '<button type="button" class="btn-gold white" data-action="a2hs-close">GOT IT</button>' +
      '</section>';
  }
  // So the home-screen app opens already unlocked (iPhone gives it its own memory).
  // Kept up to date from the moment the email is given, so adding to the home screen at ANY point
  // (our "Show me how" or straight from Safari's Share menu) carries the unlock and progress over.
  function stampInstallURL() {
    if (!unlocked() || STANDALONE || DEMO_STATE) return; // DEMO_STATE: preview.html pages keep their ?demo= address
    var h = Object.keys(S.heard).filter(function (k) { return S.heard[k]; }).join(',');
    var e = Object.keys(S.eps).filter(function (k) { return S.eps[k]; }).join(',');
    var s = Object.keys(S.m21Shown).filter(function (k) { return S.m21Shown[k]; }).join(',');
    // h = Mirrors heard, e = episodes heard (the collection follows from both), l = last Mirror played,
    // s = Mirror 21 pop-ups already seen, j = sign-up day
    var url = location.pathname + '?pm=1' + (h ? '&h=' + h : '') + (e ? '&e=' + e : '') +
      (S.lastMirror ? '&l=' + S.lastMirror : '') + (s ? '&s=' + s : '') + (S.joinedAt ? '&j=' + Math.floor(S.joinedAt / 864e5) : '') +
      location.hash;
    if (url === location.pathname + location.search + location.hash) return;
    try { history.replaceState(null, '', url); } catch (x) { /* ignore */ }
  }
  function hideA2hsCard() {
    S.a2hsDone = true; persist();
    var c = app.querySelector('[data-a2hs]');
    if (c) { c.classList.add('gone'); setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 350); }
  }

  /* ================================================================ funnel tracking
   * Every step pushes an event to window.dataLayer (Google Tag Manager / GA4 pick it up)
   * and to Plausible if its script is on the page. Set CONFIG.debug = true to see them in the console.
   */
  function track(event, props) {
    props = props || {};
    var payload = Object.assign({ event: 'pm_' + event, pm_unlocked: unlocked(), pm_source: S.source || 'direct' }, props);
    (window.dataLayer = window.dataLayer || []).push(payload);
    if (typeof window.plausible === 'function') window.plausible('pm_' + event, { props: props });
    if (CONFIG.debug) console.log('[pocket-mirror]', payload);
  }

  /* ================================================================ deep links */
  (function readQuery() {
    var qs = new URLSearchParams(location.search);
    var changed = false, target = '';
    if (qs.get('src')) { S.source = qs.get('src').slice(0, 80); persist(); changed = true; }
    var m = mirrorBy(qs.get('m'));
    if (m && m.audio) { target = '#/mirror/' + m.n; changed = true; }
    else if (qs.get('path')) { target = '#/'; changed = true; }
    if (changed) {
      history.replaceState(null, '', location.pathname + (target || location.hash || ''));
      if (target) track('deep_link', { target: target });
    }
  })();

  /* ================================================================ audio (one player for everything) */
  var audio = new Audio();
  audio.preload = 'auto';
  var now = null; // { kind: 'mirror' | 'episode', n }
  var gateOpen = false;

  function load(kind, n) {
    var item = kind === 'mirror' ? mirrorBy(n) : episodeBy(n);
    if (!item || !item.audio) return null;
    if (!now || now.kind !== kind || now.n !== item.n) {
      audio.src = item.audio;
      now = { kind: kind, n: item.n };
      setMediaSession(kind, item);
    }
    return item;
  }

  // Lock screen / control centre / Dynamic Island: the Daily Xcellence logo (white on black), for Mirrors and episodes alike.
  function setMediaSession(kind, item) {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: kind === 'episode' ? item.title : 'Mirror ' + pad2(item.n) + ' · ' + item.title,
        artist: 'Kevin Craggs',
        album: kind === 'episode' ? PODCAST.name : 'The Pocket Mirror',
        artwork: [{ src: 'assets/images/lockscreen-mirror.png', sizes: '512x512', type: 'image/png' }]
      });
    } catch (e) { /* ignore */ }
  }

  function atPreviewLimit() {
    return now && now.kind === 'mirror' && !unlocked() && audio.currentTime >= CONFIG.previewSeconds - 0.25;
  }

  function play() {
    if (atPreviewLimit()) { openGate(); return; }
    if (audio.ended) audio.currentTime = 0;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { syncUI(); });
  }

  audio.addEventListener('timeupdate', function () {
    if (now && now.kind === 'mirror' && !unlocked() && audio.currentTime >= CONFIG.previewSeconds) {
      audio.pause();
      audio.currentTime = CONFIG.previewSeconds;
      if (!gateOpen) { openGate(); track('preview_gate', { mirror: now.n }); }
    }
    syncUI();
  });
  ['play', 'pause', 'loadedmetadata', 'seeked'].forEach(function (ev) { audio.addEventListener(ev, syncUI); });
  audio.addEventListener('ended', function () {
    if (!now) return;
    var item = now.kind === 'mirror' ? mirrorBy(now.n) : episodeBy(now.n);
    var newCard = !!(item && item.card && unlocked() && !sourceDone(now.kind, now.n));
    var onPlayer = location.hash === '#/' + now.kind + '/' + now.n;
    if (now.kind === 'mirror') {
      S.heard[now.n] = true; persist();
      track('mirror_complete', { mirror: now.n });
    } else {
      var e = episodeBy(now.n), nxt = EPISODES[EPISODES.indexOf(e) + 1];
      var wasOpen = nxt ? episodeOpen(nxt) : true;
      S.eps[now.n] = true; persist();
      track('episode_complete', { episode: now.n });
      if (nxt && !wasOpen && episodeOpen(nxt)) {
        toast('EPISODE ' + pad2(nxt.n) + ' UNLOCKED');
        track('episode_unlocked', { episode: nxt.n });
      }
    }
    syncUI();
    // first time through: the card it unlocks. On the player, straight to the reward; if they left the player while it played on, a toast.
    if (newCard) {
      track('card_unlocked', { nudge: item.card, from: now.kind, n: now.n });
      if (onPlayer) {
        // a short fade so the player hands over to the card in one motion
        var from = location.hash, target = '#/unlocked/' + now.kind + '/' + now.n;
        var screen = app.querySelector('[data-player]');
        if (screen) screen.classList.add('leaving');
        setTimeout(function () { if (location.hash === from) go(target); }, 320);
      } else toast('NEW CARD UNLOCKED');
    }
  });

  /* ================================================================ emails
   * Sent to Netlify Forms (when hosted on Netlify) and/or CONFIG.webhookUrl.
   * If sending fails (offline, wrong host), the email is kept on the device and retried on the next visit.
   */
  var flushing = false;
  function submitLead(lead) {
    if (DEMO) return; // demo: the email is not sent anywhere
    lead = Object.assign({ source: S.source || 'direct', createdAt: new Date().toISOString(), page: location.href.split('#')[0] }, lead);
    S.pending.push(lead);
    persist();
    flushLeads();
  }
  function flushLeads() {
    if (flushing || !S.pending.length) return;
    flushing = true;
    var queue = S.pending.slice(), count = queue.length, keep = [];
    var next = function () {
      if (!queue.length) {
        S.pending = keep.concat(S.pending.slice(count)); // keep failures + anything added meanwhile
        persist(); flushing = false; return;
      }
      var lead = queue.shift();
      sendLead(lead).then(function (ok) { if (!ok) keep.push(lead); next(); });
    };
    next();
  }
  function sendLead(lead) {
    var jobs = [];
    if (CONFIG.netlifyForms && /^https?:/.test(location.protocol)) {
      var body = new URLSearchParams({
        'form-name': CONFIG.netlifyFormName, email: lead.email, mirror: String(lead.mirror || ''),
        path: lead.path || '', source: lead.source, page: lead.page
      }).toString();
      jobs.push(fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { return r.ok; }).catch(function () { return false; }));
    }
    if (CONFIG.webhookUrl) {
      // text/plain + no-cors avoids a CORS preflight, so it works with Zapier / Make style hooks.
      jobs.push(fetch(CONFIG.webhookUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(lead) })
        .then(function () { return true; }).catch(function () { return false; }));
    }
    if (!jobs.length) return Promise.resolve(true);
    return Promise.all(jobs).then(function (r) { return r.every(Boolean); });
  }

  /* ================================================================ router */
  var cleanup = null;
  var routes = [
    [/^#?\/?$/, landing],
    [/^#\/intro$/, introScreen],
    [/^#\/mirrors$/, mirrorsScreen],
    [/^#\/path\/\w+$/, function () { go('#/mirrors'); return null; }], // old links
    [/^#\/mirror\/(\d+)$/, mirrorScreen],
    [/^#\/unlocked\/(mirror|episode)\/(\d+)$/, rewardScreen],
    [/^#\/keep\/\d+$/, function () { go('#/home/nudges'); return null; }], // old links
    [/^#\/home(?:\/(mirrors|nudges|podcast))?$/, homeScreen],
    [/^#\/episode\/(\d+)$/, episodeScreen],
    [/^#\/mirror21$/, mirror21Screen]
  ];
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  function render() {
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    gateOpen = false;
    var h = location.hash || '#/';
    for (var i = 0; i < routes.length; i++) {
      var m = h.match(routes[i][0]);
      if (!m) continue;
      var r = routes[i][1].apply(null, m.slice(1));
      if (!r) return; // the screen redirected
      app.innerHTML = r.html;
      window.scrollTo(0, 0);
      cleanup = r.mount ? r.mount() || null : null;
      fitTitles();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);
      syncUI();
      stampInstallURL(); // keep the page address ready for "Add to Home Screen" on every screen
      return;
    }
    go('#/');
  }
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', fitTitles);

  /* ================================================================ live UI (player state) */
  var podcastSync = null; // set while the Podcast tab is open
  function syncUI() {
    if (podcastSync) podcastSync();
    var playing = !audio.paused && !audio.ended;
    app.querySelectorAll('[data-toggle]').forEach(function (b) {
      var mine = now && b.getAttribute('data-kind') === now.kind && +b.getAttribute('data-n') === now.n;
      b.classList.toggle('is-playing', !!(playing && mine));
      b.setAttribute('aria-label', playing && mine ? 'Pause' : 'Play');
    });

    var root = app.querySelector('[data-player]');
    if (root) {
      var kind = root.getAttribute('data-kind'), n = +root.getAttribute('data-n');
      var item = kind === 'mirror' ? mirrorBy(n) : episodeBy(n);
      var mine = now && now.kind === kind && now.n === n;
      var d = (mine && isFinite(audio.duration) && audio.duration) || item.duration || 1;
      var t = mine ? audio.currentTime : 0;
      var time = root.querySelector('[data-time]');
      if (time) time.textContent = kind === 'episode' ? fmt(t) : fmt(t) + ' / ' + fmt(d);
      var prog = root.querySelector('[data-ring]');
      if (prog) prog.style.strokeDashoffset = (CIRC * (1 - Math.min(1, t / d))).toFixed(2);
      // Mirror player bars (the player and the subtitles layer each have one)
      var pct = (Math.min(1, t / d) * 100).toFixed(2) + '%';
      app.querySelectorAll('[data-fill]').forEach(function (x) { x.style.width = pct; });
      app.querySelectorAll('[data-sknob]').forEach(function (x) { x.style.left = pct; });
      app.querySelectorAll('[data-elapsed]').forEach(function (x) { x.textContent = fmt(t); });
      app.querySelectorAll('[data-total]').forEach(function (x) { x.textContent = fmt(d); });
      app.querySelectorAll('[data-scrub]').forEach(function (x) { x.setAttribute('aria-valuenow', Math.round(t)); x.setAttribute('aria-valuetext', fmt(t) + ' of ' + fmt(d)); });
      if (kind === 'mirror') {
        var done = unlocked() && (S.heard[n] || (mine && t >= d - 0.6));
        var hint = root.querySelector('[data-hint]');
        if (hint) hint.hidden = !!done;
      }
      var m21 = root.querySelector('[data-m21-end]');
      if (m21) m21.hidden = !(S.eps[n] && unlocked() && !S.m21EndHidden[n]);
      // podcast ring: the countdown, the dot at the end of the progress, and the lock note for the next episode
      var left = root.querySelector('[data-left]');
      if (left) left.textContent = fmt(d - t);
      var knob = root.querySelector('[data-knob]');
      if (knob) {
        var ang = 2 * Math.PI * Math.min(1, t / d);
        knob.setAttribute('cx', (125 + 115 * Math.sin(ang)).toFixed(1));
        knob.setAttribute('cy', (125 - 115 * Math.cos(ang)).toFixed(1));
      }
      var dialEl = root.querySelector('[data-dial]');
      if (dialEl) { dialEl.setAttribute('aria-valuenow', Math.round(t)); dialEl.setAttribute('aria-valuetext', fmt(d - t) + ' left'); }
      var nextLock = root.querySelector('[data-next-lock]');
      if (nextLock) nextLock.hidden = !!S.eps[n];
    }
  }

  /* ================================================================ gate (unlock sheet) */
  function openGate() {
    var sheet = document.getElementById('gate');
    if (!sheet) return;
    gateOpen = true;
    sheet.classList.add('open');
    document.getElementById('dim').classList.add('open');
    sheet.removeAttribute('inert');
    syncUI();
  }
  function closeGate() {
    var sheet = document.getElementById('gate');
    if (!sheet) return;
    gateOpen = false;
    sheet.classList.remove('open');
    sheet.setAttribute('inert', '');
    document.getElementById('dim').classList.remove('open');
  }

  function toast(text) {
    toastEl.innerHTML = '<span class="tick">' + I.check + '</span>' + esc(text);
    toastEl.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  /* ================================================================ 1 · LANDING */
  function landing() {
    if (unlocked()) { go('#/home'); return null; }
    var html =
      '<section class="screen landing">' +
        '<img class="logo" src="assets/images/pocket-mirror-logo.png" width="640" height="91" alt="The Pocket Mirror">' +
        '<div class="landing-mid">' +
          '<h1><span class="lead">ONE MINUTE WITH</span> <span class="word">YOURSELF.</span></h1>' +
          '<div class="host"><img src="' + HOST.photo + '" alt=""><b>' + esc(HOST.name) + '</b></div>' +
        '</div>' +
        '<div class="landing-foot">' +
          '<a class="btn-gold white" href="#/mirrors" data-action="find-mirror">FIND MY MIRROR</a>' +
          '<p class="fine">1-minute audio · free</p>' +
        '</div>' +
      '</section>';
    return {
      html: html,
      mount: function () { track('landing_view'); }
    };
  }

  /* ================================================================ 1b · MEET KEVIN (the intro video, the first time only)
     Full screen, in colour, a black fade over his hands. Playing: just Kevin, a thin progress line and a barely-there SKIP.
     Tap = pause: MEET KEVIN (top left) and the play button (on his chin) come back.
     At the end: WATCH AGAIN and LET'S BEGIN (on to "Which one is you?"). */
  // one video element, made inside the FIND MY MIRROR tap so it can start with sound (phones allow sound from a tap)
  var introVid = null;
  function introVideo() {
    if (introVid) return introVid;
    var v = document.createElement('video');
    v.className = 'intro-video';
    v.src = INTRO.video;
    if (INTRO.poster) v.poster = INTRO.poster;
    v.preload = 'auto'; v.playsInline = true;
    v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.setAttribute('aria-label', 'Kevin introduces The Pocket Mirror');
    introVid = v;
    return v;
  }
  function toggleIntro() {
    var v = introVid; if (!v) return;
    if (v.paused || v.ended) { var p = v.play(); if (p && p.catch) p.catch(function () {}); track('intro_play'); }
    else { v.pause(); track('intro_pause'); }
  }
  // leave the intro (how: skip · begin · end) and carry on to the Mirrors
  function introDone(how) {
    var v = introVid;
    if (v) v.pause();
    track('intro_' + how, { at: v ? Math.round(v.currentTime) : 0 });
    introVid = null;
    go('#/mirrors');
  }
  function introScreen() {
    if (!INTRO || unlocked()) { go(unlocked() ? '#/home' : '#/mirrors'); return null; }
    S.introSeen = true; persist();
    var v = introVideo();
    var html =
      '<section class="intro paused" data-intro>' +
        '<div class="intro-stage" data-intro-stage></div>' +
        '<div class="intro-shade" aria-hidden="true"></div>' +   // black fades: top (behind the title), bottom (over his hands)
        '<div class="intro-bar" aria-hidden="true"><span data-intro-fill></span></div>' +
        '<button type="button" class="intro-skip" data-action="intro-done" data-how="skip">SKIP</button>' +
        // top left: the time, then MEET KEVIN (here before it starts, when paused and at the end; away while Kevin talks)
        '<div class="intro-head"><p class="intro-meta" data-intro-meta></p><h1 class="intro-title">' + esc(INTRO.title || 'MEET KEVIN') + '</h1></div>' +
        // on his chin: play (before it starts and when paused)
        '<button type="button" class="intro-play" data-action="intro-toggle" aria-label="Play"><span class="ring">' + I.play + '</span></button>' +
        // at the end: watch again, or on to the Mirrors
        '<div class="intro-end">' +
          '<button type="button" class="intro-again" data-action="intro-again">' + I.repeat + 'WATCH AGAIN</button>' +
          '<button type="button" class="btn-gold white intro-begin" data-action="intro-done" data-how="begin"><span>' + esc(INTRO.begin || 'LET’S BEGIN') + '</span>' + I.arrow + '</button>' +
        '</div>' +
      '</section>';
    return {
      html: html,
      mount: function () {
        var root = app.querySelector('[data-intro]'), stage = app.querySelector('[data-intro-stage]');
        var fill = app.querySelector('[data-intro-fill]'), meta = app.querySelector('[data-intro-meta]');
        stage.appendChild(v);
        function sync() {
          var playing = !v.paused && !v.ended, d = isFinite(v.duration) && v.duration ? v.duration : 55;
          root.classList.toggle('paused', !playing && !v.ended);
          root.classList.toggle('ended', v.ended);
          fill.style.width = (100 * Math.min(1, v.currentTime / d)).toFixed(2) + '%';
          meta.textContent = v.currentTime > 0.5 && !v.ended ? fmt(v.currentTime) + ' / ' + fmt(d) : fmt(d);
        }
        function onEnd() { sync(); track('intro_complete'); }
        function onKey(e) {
          if (e.key === ' ') { e.preventDefault(); toggleIntro(); }
          else if (e.key === 'Escape') introDone('skip');
        }
        var evs = ['play', 'pause', 'timeupdate', 'loadedmetadata'];
        evs.forEach(function (ev) { v.addEventListener(ev, sync); });
        v.addEventListener('ended', onEnd);
        stage.addEventListener('click', function () { if (!v.ended) toggleIntro(); }); // tap Kevin = pause / play
        document.addEventListener('keydown', onKey);
        track('intro_view');
        sync();
        return function () {
          evs.forEach(function (ev) { v.removeEventListener(ev, sync); });
          v.removeEventListener('ended', onEnd);
          document.removeEventListener('keydown', onKey);
          v.pause();
        };
      }
    };
  }

  /* ================================================================ 2 · WHICH ONE IS YOU? (all 12 Mirrors) */
  function mirrorRow(m) {
    if (!m.audio) {
      return '<li><div class="mirror-row soon"><span class="num">' + pad2(m.n) + '</span>' +
        '<span class="body"><span class="t">' + esc(m.title || 'New Mirror') + '</span><span class="meta">' + I.lock + 'Coming soon</span></span>' +
        '<span class="play-ring">' + I.lock + '</span></div></li>';
    }
    var heard = unlocked() && S.heard[m.n];
    var p = pathBy(m.path);
    // "best with sound" is said once in the page intro, so each card only shows its length (and its path after the email)
    var meta = heard ? '<span class="meta">' + I.check + 'Heard</span>'
      : '<span class="meta">' + mins(m.duration) + (unlocked() ? ' · ' + esc(p.name) : '') + '</span>';
    return '<li><button type="button" class="mirror-row" data-action="play-mirror" data-n="' + m.n + '">' +
      '<span class="num">' + pad2(m.n) + '</span>' +
      '<span class="body"><span class="t">' + esc(m.title) + '</span>' + meta + '</span>' +
      '<span class="play-ring' + (heard ? ' heard' : '') + '">' + (heard ? I.check : I.play) + '</span></button></li>';
  }

  var FIRST_SHOWN = 4;
  function mirrorsScreen() {
    var html =
      '<section class="screen path">' +
        '<div class="topbar"><a class="icon-btn" href="#/" aria-label="Back">' + I.back + '</a>' +
          '<img class="logo" src="assets/images/pocket-mirror-logo.png" width="640" height="91" alt="The Pocket Mirror">' +
          '<span style="width:34px"></span></div>' +
        '<h1 class="page-title" data-fit><span>WHICH ONE IS YOU?</span></h1>' +
        '<ul class="mirror-list">' + MIRRORS.map(function (m, i) {
          return mirrorRow(m).replace('<li>', i < FIRST_SHOWN ? '<li>' : '<li data-more hidden>');
        }).join('') + '</ul>' +
        (MIRRORS.length > FIRST_SHOWN ? '<button type="button" class="btn-outline" data-all>SEE ALL ' + MIRRORS.length + ' MIRRORS' + I.down + '</button>' : '') +
      '</section>';
    return {
      html: html,
      mount: function () {
        track('mirrors_view');
        var btn = app.querySelector('[data-all]');
        if (btn) btn.addEventListener('click', function () {
          app.querySelectorAll('[data-more]').forEach(function (li) { li.hidden = false; });
          btn.hidden = true;
          track('see_all_mirrors');
        });
      }
    };
  }

  /* ================================================================ 3 · MIRROR PLAYER + SUBTITLES + GATE (the episode player uses the same layout) */
  // the bar you can drag (for a Mirror before the email, the free part 0:00 → previewSeconds is a lighter grey) and the two times under it
  function scrubHTML(kind, item, freeShare) {
    return '<div class="scrub" data-scrub role="slider" tabindex="0" aria-label="Position in the ' + (kind === 'mirror' ? 'Mirror' : 'episode') + '" aria-valuemin="0" aria-valuemax="' + Math.round(item.duration) + '" aria-valuenow="0">' +
        '<div class="scrub-track">' +
          (freeShare ? '<span class="scrub-free" style="width:' + (freeShare * 100).toFixed(2) + '%"></span>' : '') +
          '<span class="scrub-fill" data-fill></span><span class="scrub-knob" data-sknob></span>' +
        '</div></div>' +
      '<div class="scrub-times"><span data-elapsed>0:00</span><span data-total>' + fmt(item.duration) + '</span></div>';
  }
  // back 15 · play/pause · forward 15 (a Mirror before the email: forward past the free part stops there and opens the gate, see timeupdate)
  function transportHTML(kind, n) {
    return '<div class="transport">' +
        '<button type="button" class="skip" data-action="skip" data-by="-15" aria-label="Back 15 seconds">' + I.back15 + '</button>' +
        '<button type="button" class="big-play" data-toggle data-action="toggle" data-kind="' + kind + '" data-n="' + n + '" aria-label="Play">' + PLAYPAUSE + '</button>' +
        '<button type="button" class="skip" data-action="skip" data-by="15" aria-label="Forward 15 seconds">' + I.fwd15 + '</button>' +
      '</div>';
  }
  // drag (or tap) the bar to move through the audio. A Mirror before the email stops at the end of the free part;
  // letting go past it lands on previewSeconds, which pauses and opens the gate (see timeupdate).
  function bindScrubs(kind, item) {
    var gated = function () { return kind === 'mirror' && !unlocked(); };
    var dur = function () { return (isFinite(audio.duration) && audio.duration) || item.duration; };
    var mine = function () { return now && now.kind === kind && now.n === item.n; };
    var limit = function () { return gated() ? CONFIG.previewSeconds - 0.3 : dur() - 0.25; };
    app.querySelectorAll('[data-scrub]').forEach(function (bar) {
      var dragging = false, over = false;
      function seekTo(sec) {
        if (!mine()) load(kind, item.n);
        over = gated() && sec >= CONFIG.previewSeconds;
        audio.currentTime = Math.max(0, Math.min(sec, limit()));
        syncUI();
      }
      function at(ev) { var r = bar.getBoundingClientRect(); return Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * dur(); }
      bar.addEventListener('pointerdown', function (ev) {
        dragging = true; bar.classList.add('dragging');
        try { bar.setPointerCapture(ev.pointerId); } catch (x) { /* ignore */ }
        seekTo(at(ev));
      });
      bar.addEventListener('pointermove', function (ev) { if (dragging) seekTo(at(ev)); });
      function end() {
        if (!dragging) return;
        dragging = false; bar.classList.remove('dragging');
        track(kind + '_seek', kind === 'mirror' ? { mirror: item.n } : { episode: item.n });
        if (over) audio.currentTime = CONFIG.previewSeconds;
      }
      bar.addEventListener('pointerup', end);
      bar.addEventListener('pointercancel', end);
      bar.addEventListener('keydown', function (ev) {
        var by = ev.key === 'ArrowRight' || ev.key === 'ArrowUp' ? 5 : ev.key === 'ArrowLeft' || ev.key === 'ArrowDown' ? -5 : 0;
        if (!by) return;
        ev.preventDefault();
        seekTo((mine() ? audio.currentTime : 0) + by);
      });
    });
  }
  function openSubs(instant) {
    var el = document.getElementById('subs');
    if (!el) return;
    if (instant) el.classList.add('instant');
    el.classList.add('open');
    el.removeAttribute('inert');
    if (instant) { void el.offsetWidth; el.classList.remove('instant'); }
    else { var x = el.querySelector('.subs-x'); if (x) x.focus({ preventScroll: true }); }
  }
  function closeSubs() {
    var el = document.getElementById('subs');
    if (!el || !el.classList.contains('open')) return;
    el.classList.remove('open');
    el.setAttribute('inert', '');
    var b = app.querySelector('.cc-btn'); if (b) b.focus({ preventScroll: true });
  }

  function mirrorScreen(n) {
    var m = mirrorBy(n);
    if (!m || !m.audio) { go('#/'); return null; }
    var p = pathBy(m.path);
    load('mirror', m.n);
    var locked = !unlocked();
    var f = Math.min(1, CONFIG.previewSeconds / (m.duration || 60));
    var others = Math.max(0, AVAILABLE.length - 1);
    var hasSubs = (CAPTIONS[m.n] || []).length > 0;

    var html =
      // Spotify-like: artwork, title, bar, controls, then Subtitles + Best with sound
      '<section class="screen player mirror-player" data-player data-kind="mirror" data-n="' + m.n + '">' +
        '<div class="topbar"><a class="icon-btn" href="' + (locked ? '#/mirrors' : '#/home') + '" aria-label="Back">' + I.down + '</a>' +
          '<p class="eyebrow">MIRROR ' + pad2(m.n) + '</p></div>' +
        '<div class="art" aria-hidden="true"><img src="assets/images/daily-xcellence-art.png" width="720" height="240" alt=""><p>it starts with you</p></div>' +
        '<h1>' + esc(m.title) + '</h1>' +
        scrubHTML('mirror', m, locked ? f : 0) +
        transportHTML('mirror', m.n) +
        '<div class="player-foot">' +
          (hasSubs ? '<button type="button" class="cc-btn" data-action="subs-open" aria-haspopup="dialog">' + I.cc + 'Subtitles</button>' : '<span></span>') +
          '<p class="sound-hint" data-hint>' + I.phones + 'Best with sound</p>' +
        '</div>' +
      '</section>' +
      // subtitles: a full-screen layer over the player (outside .screen so position:fixed works). Kept on for the next Mirror (S.cc).
      (hasSubs ?
      '<section class="subs" id="subs" role="dialog" aria-modal="true" aria-labelledby="subs-title" inert>' +
        '<div class="topbar"><span style="width:34px"></span><p class="eyebrow" id="subs-title">SUBTITLES</p>' +
          '<button type="button" class="icon-btn subs-x" data-action="subs-close" aria-label="Close subtitles">' + I.close + '</button></div>' +
        '<div class="subs-card">MIRROR ' + pad2(m.n) + ' · ' + esc(p.name) + '</div>' +
        // the line just said (grey) above the line Kevin is saying (each word turns white as he says it)
        '<div class="subs-lines" aria-hidden="true"><p class="subs-prev" data-caption-prev></p><p class="subs-now" data-caption></p></div>' +
        '<div class="subs-controls">' + scrubHTML('mirror', m, locked ? f : 0) + transportHTML('mirror', m.n) +
          '<button type="button" class="cc-on" data-action="subs-close" aria-label="Turn subtitles off">CC</button></div>' +
      '</section>' : '') +
      // unlock sheet (outside .screen so position:fixed works)
      '<div class="dim" id="dim" data-action="close-gate"></div>' +
      '<section class="sheet" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" inert>' +
        '<div class="host"><img src="' + HOST.photo + '" alt="' + esc(HOST.name) + '"><span><b>' + esc(HOST.name) + '</b><small>' + esc(HOST.company) + '</small></span></div>' +
        '<h2 id="gate-title">HEAR THE REST.</h2>' +
        '<ul class="unlock-list">' +
          // what the email gives: plain lines with white dots (no time left, no card icon, no locks)
          '<li>The rest of this Mirror</li>' +
          '<li>Your nudge card</li>' +
          '<li>' + (others ? others + ' more ' + (others === 1 ? 'Mirror' : 'Mirrors') + ' + ' : '') + EPISODES.length + ' podcast episodes</li>' +
        '</ul>' +
        '<form data-gate-form novalidate>' +
          '<div class="email-row"><label class="sr-only" for="email">Your email</label>' +
            '<input id="email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="Your email" required></div>' +
          '<p class="form-error" data-error role="alert"></p>' +
          '<button type="submit" class="btn-gold white">KEEP LISTENING</button>' +
        '</form>' +
        '<p class="fine">' + esc(CONFIG.finePrint) + '</p>' +
        '<a class="link" href="#/mirrors" data-action="not-now">Not now, try another Mirror</a>' +
      '</section>';

    return {
      html: html,
      mount: function () {
        track('mirror_view', { mirror: m.n, path: m.path });
        S.lastMirror = m.n; persist();
        var stopCaptions = captions(m);
        if (DEMO && QS.get('t')) seekWhenReady(+QS.get('t'));
        var form = app.querySelector('[data-gate-form]');
        var input = form.querySelector('input');
        var err = app.querySelector('[data-error]');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var email = input.value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            err.textContent = 'Add a valid email to unlock.';
            form.querySelector('.email-row').classList.add('error');
            input.focus();
            return;
          }
          S.email = email; S.joinedAt = Date.now(); persist();
          submitLead({ email: email, mirror: m.n, path: m.path });
          track('email_submit', { mirror: m.n, path: m.path });
          input.blur();
          play();            // keep going from 0:40 (inside the tap, so phones allow it)
          render();          // redraw without the preview marks
          toast('UNLOCKED · ALL MIRRORS');
        });
        input.addEventListener('input', function () { err.textContent = ''; form.querySelector('.email-row').classList.remove('error'); });
        var onKey = function (e) { if (e.key !== 'Escape') return; if (gateOpen) closeGate(); else closeSubs(); };
        document.addEventListener('keydown', onKey);

        bindScrubs('mirror', m);

        if (S.cc || (DEMO && QS.get('cc'))) openSubs(true);
        if (atPreviewLimit() || (DEMO_STATE === 'gate' && !unlocked())) openGate();
        return function () { document.removeEventListener('keydown', onKey); stopCaptions(); };
      }
    };
  }

  /* ================================================================ captions: words light up as Kevin says them */
  function captions(m) {
    var el = app.querySelector('[data-caption]'), prevEl = app.querySelector('[data-caption-prev]'), lines = CAPTIONS[m.n] || [];
    if (!el || !lines.length) return function () {};
    // the second each word starts, measured from the audio (js/caption-timing.js), when it matches the line's text
    var timing = (window.PM_CAPTION_TIMING || {})[m.n] || [];
    function wordStarts(i) {
      var w = timing[i];
      return w && w.length === lines[i][2].split(' ').length ? w : null;
    }
    function lineStart(i) { var w = wordStarts(i); return Math.min(lines[i][0], w ? w[0] - 0.1 : Infinity); }
    var cur = -1, spans = [], times = [], raf = 0;
    function lineAt(t) {
      var idx = 0;
      for (var i = 0; i < lines.length; i++) if (t >= lineStart(i) - 0.08) idx = i;
      return idx;
    }
    function show(i) {
      cur = i;
      var L = lines[i], words = L[2].split(' '), starts = wordStarts(i);
      if (starts) {
        // each word lights when it is said, and stays lit until the next one starts
        times = starts.map(function (a, k) { return [a, k + 1 < starts.length ? starts[k + 1] : Math.max(L[1], a + 0.3)]; });
      } else {
        // no measured timing for this line: spread its words over the line by length
        var weights = words.map(function (w) { return w.length + 2; });
        var total = weights.reduce(function (a, b) { return a + b; }, 0), acc = 0;
        times = words.map(function (w, k) {
          var a = L[0] + (L[1] - L[0]) * acc / total; acc += weights[k];
          return [a, L[0] + (L[1] - L[0]) * acc / total];
        });
      }
      el.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
      spans = [].slice.call(el.children);
      // the line just said moves up, in grey; the new one rises in
      if (prevEl) prevEl.textContent = i > 0 ? lines[i - 1][2] : '';
      el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    }
    function tick() {
      var mine = now && now.kind === 'mirror' && now.n === m.n;
      var t = mine ? audio.currentTime : 0;
      if (!unlocked()) t = Math.min(t, CONFIG.previewSeconds);
      var i = lineAt(t);
      if (i !== cur) show(i);
      for (var k = 0; k < spans.length; k++) {
        var st = t >= times[k][1] ? 'w said' : t >= times[k][0] ? 'w now' : 'w';
        if (spans[k].className !== st) spans[k].className = st;
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return function () { cancelAnimationFrame(raf); };
  }
  // preview.html only: jump the paused player to a moment (?t=19)
  function seekWhenReady(t) {
    var set = function () { try { audio.currentTime = t; } catch (e) { /* ignore */ } syncUI(); };
    if (audio.readyState >= 1) set(); else audio.addEventListener('loadedmetadata', set, { once: true });
  }

  /* ================================================================ swipe decks (COLLECT cards · EXPLORE cassettes)
     The items follow your finger: `pos` is a float, so the whole row moves with the drag, then glides and settles on one.
     Tap a side item = bring it to the middle. Tap the middle one = o.tapMiddle(k). Arrow keys and Enter work too.
     o.layout(el, offset, W) places one item (offset 0 = the middle); o.pick(k) runs when the middle item changes;
     o.settle(k) after a glide; o.unit = how many px of drag move one item, as a share of the item's width. */
  function swipeDeck(stage, els, startAt, o) {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var last = els.length - 1, pos = startAt, target = startAt, picked = -1, raf = 0;
    var width = function () { return (els[0] && els[0].offsetWidth) || 220; };
    function place() { var W = width(); els.forEach(function (c, i) { o.layout(c, i - pos, W); }); }
    function mark() {
      var k = Math.max(0, Math.min(last, Math.round(pos)));
      if (k === picked) return;
      picked = k;
      els.forEach(function (c, i) { c.setAttribute('aria-selected', String(i === k)); });
      o.pick(k);
    }
    function done() { if (o.settle) o.settle(picked); }
    function spin() {
      cancelAnimationFrame(raf);
      if (reduce) { pos = target; place(); mark(); done(); return; }
      (function step() {
        pos += (target - pos) * 0.18;
        if (Math.abs(target - pos) < 0.002) { pos = target; place(); mark(); done(); return; }
        place(); mark();
        raf = requestAnimationFrame(step);
      })();
    }
    function goTo(k) { target = Math.max(0, Math.min(last, k)); spin(); }

    var grab = 0, grabPos = 0, turning = false, dragged = false, pressed = null;
    stage.addEventListener('pointerdown', function (e) {
      turning = true; dragged = false; grab = e.clientX; grabPos = pos;
      var el = e.target; while (el && el !== stage && els.indexOf(el) < 0) el = el.parentNode;
      pressed = els.indexOf(el) >= 0 ? el : null;
      cancelAnimationFrame(raf);
      stage.classList.add('dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!turning) return;
      var d = e.clientX - grab;
      if (Math.abs(d) > 5) dragged = true;
      pos = Math.max(-0.4, Math.min(last + 0.4, grabPos - d / (width() * (o.unit || 0.56))));
      place(); mark();
    });
    function letGo(cancelled) {
      if (!turning) return;
      turning = false;
      stage.classList.remove('dragging');
      var tapped = !cancelled && !dragged ? pressed : null;
      pressed = null;
      if (tapped) {
        var k = els.indexOf(tapped);
        if (k === picked) o.tapMiddle(k); else goTo(k);
      } else {
        if (dragged && o.flicked) o.flicked(Math.max(0, Math.min(last, Math.round(pos))));
        goTo(Math.round(pos));
      }
    }
    stage.addEventListener('pointerup', function () { letGo(false); });
    stage.addEventListener('pointercancel', function () { letGo(true); });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); o.tapMiddle(picked); return; }
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      goTo(Math.round(pos) + step);
    });
    var onResize = function () { place(); };
    window.addEventListener('resize', onResize);
    // first placement without the glide, so nothing flies in from the corner
    stage.classList.add('dragging');
    place(); mark();
    requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.remove('dragging'); }); });
    return { goTo: goTo, stop: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); } };
  }

  /* ================================================================ COLLECT: the arc (from the first Pocket Mirror)
     The cards stand in a fan: the middle one big and flat, its neighbours stepping out, turning towards you,
     further back and fading. Tap the middle card = save it (yours) or hear what unlocks it (not yet). */
  function arcLayout(c, o, W) {
    var a = Math.abs(o), sgn = o < 0 ? -1 : 1;
    if (a > 3.4) { c.style.opacity = 0; c.style.visibility = 'hidden'; return; }
    var ax = Math.min(a, 3);
    var x = sgn * W * (0.30 * ax + 0.25 * Math.min(ax, 1));   // the first neighbour steps out furthest, then the fan tightens
    c.style.visibility = '';
    c.style.transform = 'translate(-50%,-50%) translateX(' + x.toFixed(1) + 'px) translateZ(' + (-ax * 92).toFixed(1) + 'px) rotateY(' +
      (-sgn * ax * 27).toFixed(2) + 'deg) scale(' + (1 - ax * 0.07).toFixed(3) + ')';
    c.style.opacity = a < 1 ? 1 : Math.max(0.12, 1 - (a - 1) * 0.42);
    c.style.zIndex = String(200 - Math.round(a * 10));
  }
  function mountArc(deck, startAt) {
    var arcEl = app.querySelector('[data-arc]');
    if (!arcEl) return function () {};
    var els = [].slice.call(arcEl.querySelectorAll('.arc-card'));
    var info = app.querySelector('[data-arc-info]'), ask = app.querySelector('[data-ask]');
    var stageBtns = [].slice.call(app.querySelectorAll('[data-stage]'));
    var segEls = [].slice.call(app.querySelectorAll('[data-seg]'));
    var pathOf = function (x) { return PATHS.filter(function (p) { return p.deck === x.deck; })[0] || PATHS[0]; };

    // the middle card changes: stage label, question, the light under the cards, the info line, the bar
    function pick(k) {
      var x = deck[k], p = pathOf(x), s = sourceOf(x.id), have = isCollected(x.id);
      stageBtns.forEach(function (b) { b.setAttribute('aria-current', String(b.getAttribute('data-stage') === x.deck)); });
      if (ask.textContent !== p.ask) { ask.textContent = p.ask || p.name; ask.classList.remove('swap'); void ask.offsetWidth; ask.classList.add('swap'); }
      arcEl.setAttribute('data-tone', x.deck);
      segEls.forEach(function (sg, i) { sg.classList.toggle('here', i === k); });
      ['data-action', 'data-n', 'data-id', 'data-deck'].forEach(function (a) { info.removeAttribute(a); });
      info.classList.toggle('locked', !have);
      if (have) {
        info.setAttribute('data-action', 'arc-save'); info.setAttribute('data-id', x.id); info.setAttribute('data-deck', x.deck);
        info.innerHTML = I.check + '<span>' + (s ? sourceName(s) + ' · ' : '') + 'TAP TO SAVE</span>';
      } else if (s && s.item.audio) {
        info.setAttribute('data-action', s.kind === 'mirror' ? 'play-mirror' : 'play-episode'); info.setAttribute('data-n', s.n);
        info.innerHTML = I.play + '<span>LISTEN TO ' + sourceName(s) + ' TO UNLOCK</span>';
      } else {
        info.setAttribute('data-action', 'soon-card');
        info.innerHTML = I.lock + '<span>' + (s ? sourceName(s) + ' · ' : '') + 'COMING SOON</span>';
      }
    }
    var swipe = swipeDeck(arcEl, els, startAt, {
      layout: arcLayout, pick: pick,
      tapMiddle: function () { info.click(); },
      settle: function (k) { S.arcCard = deck[k].id; persist(); },
      flicked: function (k) { track('nudges_flick', { to: deck[k].id }); }
    });
    stageBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-stage');
        for (var i = 0; i < deck.length; i++) if (deck[i].deck === d) { swipe.goTo(i); break; }
        track('deck_switch', { deck: d });
      });
    });
    return swipe.stop;
  }

  /* ================================================================ EXPLORE: the cassettes
     A row of cassettes: the middle one big, the ones beside it smaller, fading off the edges. No turning.
     Colour = state: grey = heard, white = you can listen to it now, black = locked. Its number sits under it. */
  function tapeLayout(c, o, W) {
    var a = Math.abs(o), sgn = o < 0 ? -1 : 1;
    if (a > 2.3) { c.style.opacity = 0; c.style.visibility = 'hidden'; return; }
    var a1 = Math.min(a, 1), a2 = Math.max(0, a - 1);
    var x = sgn * W * (0.84 * a1 + 0.5 * a2);   // the first neighbour sits just clear of the middle one, half off the screen
    c.style.visibility = '';
    c.style.transform = 'translate(-50%,-50%) translateX(' + x.toFixed(1) + 'px) scale(' + (1 - 0.38 * a1 - 0.12 * a2).toFixed(3) + ')';
    c.style.opacity = a <= 1 ? 1 - 0.3 * a : Math.max(0, 0.7 - a2 * 0.7);
    c.style.zIndex = String(100 - Math.round(a * 10));
  }
  // white = open (heard or not yet); locked = the grey one, frosted, with a lock on it (see .tape.locked)
  function tapeColour(st) { return st === 'locked' ? 'grey' : 'white'; }
  // an episode's cassette (PODCAST.cassette: {colour} and {n} are filled in); if that file is missing, the plain one of that colour
  function cassetteImg(e, colour, extra) {
    var fill = function (t) { return String(t).replace('{colour}', colour).replace('{n}', pad2(e.n)); };
    var src = fill(PODCAST.cassette || 'assets/images/cassettes/ep-{n}-{colour}.webp');
    var fallback = fill(PODCAST.cassetteFallback || 'assets/images/cassettes/cassette-{colour}.webp');
    return '<img src="' + src + '" alt="" draggable="false"' + (extra || '') +
      (fallback !== src ? ' onerror="this.onerror=null;this.src=\'' + fallback + '\'"' : '') + '>';
  }

  // A collected card, big: tap to flip to "IS THIS YOU?", then make it the lock screen.
  function viewerHTML() {
    return '<div class="dim" id="cv-dim" data-action="cv-close"></div>' +
      '<section class="viewer" id="cv" role="dialog" aria-modal="true" aria-label="Your card" inert>' +
        '<div class="card active" data-cv></div>' +
        '<p class="tap-hint show" aria-hidden="true"><span class="tap-dot"></span>TAP TO FLIP</p>' +
        '<button type="button" class="btn-gold" data-action="cv-lock">' + I.download + '<span>MAKE IT MY LOCK SCREEN</span></button>' +
        '<button type="button" class="link" data-action="cv-close">Close</button>' +
      '</section>';
  }
  // The Mirror 21 pop-up for a collection milestone (a white door, like the other Mirror 21 cards)
  function m21PopHTML(ms) {
    return '<div class="dim" id="m21p-dim" data-action="m21p-close"></div>' +
      '<section class="sheet m21-pop" id="m21p" role="dialog" aria-modal="true" aria-labelledby="m21p-title" inert>' +
        '<p class="m21-pop-brand">' + M21_MARK + '</p>' +
        '<h2 id="m21p-title">' + esc(ms.title) + '</h2>' +
        '<p class="m21-pop-line">' + esc(ms.line) + '</p>' +
        '<a class="btn-gold ink" href="#/mirror21" data-action="m21-open" data-from="milestone-' + milestoneKey(ms) + '">SEE ' + M21_MARK + '</a>' +
        '<button type="button" class="link" data-action="m21p-close">Not now</button>' +
      '</section>';
  }

  var cvCur = null;
  function openViewer(id) {
    var x = nudgeBy(id), sheet = document.getElementById('cv'); if (!x || !sheet) return;
    cvCur = x;
    sheet.querySelector('[data-cv]').innerHTML =
      '<div class="card-inner">' +
        '<button type="button" class="face front" data-action="cv-flip" aria-label="' + esc(x.text) + ' Tap to flip.">' +
          '<img src="' + cardSrc(x.id, x.deck) + '" alt="" draggable="false"></button>' +
        '<button type="button" class="face back ' + x.deck + '" data-action="cv-flip" aria-label="Is this you? ' + esc(x.pickIf.join(' ')) + '"><span class="frame">' +
          '<span class="head"><span>IS THIS YOU?</span></span>' +
          '<span class="lines">' + x.pickIf.map(function (l) { return '<span class="line">' + esc(l) + '</span>'; }).join('') + '</span>' +
        '</span></button>' +
      '</div>';
    sheet.querySelector('[data-cv]').classList.remove('flipped');
    wallpaper(x.id, x.deck).catch(function () {}); // ready before the tap, so phones allow the share
    sheet.removeAttribute('inert');
    sheet.classList.add('open'); document.getElementById('cv-dim').classList.add('open');
    track('card_view', { nudge: x.id });
  }
  function closeViewer() {
    var sheet = document.getElementById('cv'); if (!sheet) return;
    sheet.classList.remove('open'); sheet.setAttribute('inert', '');
    document.getElementById('cv-dim').classList.remove('open');
  }

  // Phone wallpaper: the card centred on black, ready for the lock screen.
  var wallpapers = {};
  function wallpaper(id, deck) {
    var key = deck + '/' + id;
    if (wallpapers[key]) return wallpapers[key].promise;
    var entry = { file: null };
    entry.promise = new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var fontReady = document.fonts && document.fonts.load ? document.fonts.load('italic 700 40px Magistral') : Promise.resolve();
        fontReady.catch(function () {}).then(function () {
          var W = 1179, H = 2556, cv = document.createElement('canvas');
          cv.width = W; cv.height = H;
          var x = cv.getContext('2d');
          x.fillStyle = '#0a0a0a'; x.fillRect(0, 0, W, H);
          var cw = Math.round(W * 0.74), ch = Math.round(cw * img.height / img.width);
          var cx = (W - cw) / 2, cy = Math.round(H * 0.57 - ch / 2), r = 44;
          x.save();
          x.beginPath();
          x.moveTo(cx + r, cy); x.arcTo(cx + cw, cy, cx + cw, cy + ch, r); x.arcTo(cx + cw, cy + ch, cx, cy + ch, r);
          x.arcTo(cx, cy + ch, cx, cy, r); x.arcTo(cx, cy, cx + cw, cy, r); x.closePath(); x.clip();
          x.drawImage(img, cx, cy, cw, ch);
          x.restore();
          x.fillStyle = '#5f5f5c';
          x.font = 'italic 700 34px Magistral, Arial, sans-serif';
          x.textAlign = 'center';
          try { x.letterSpacing = '10px'; } catch (e) { /* older browsers */ }
          x.fillText('THE POCKET MIRROR', W / 2, cy + ch + 150);
          cv.toBlob(function (blob) {
            if (!blob) { reject(new Error('canvas')); return; }
            entry.file = new File([blob], 'nudge-' + id + '.png', { type: 'image/png' });
            resolve(entry.file);
          }, 'image/png');
        });
      };
      img.onerror = reject;
      img.src = cardSrc(id, deck);
    });
    wallpapers[key] = entry;
    return entry.promise;
  }
  function saveWallpaper(id, deck) {
    var entry = wallpapers[deck + '/' + id];
    var deliver = function (file) {
      if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: 'My nudge' }).then(function () { return true; }, function (e) { return !(e && e.name === 'AbortError') && download(file); });
      }
      return Promise.resolve(download(file));
    };
    // If the image is ready, share straight away (phones only allow sharing right after a tap).
    if (entry && entry.file) return deliver(entry.file);
    return wallpaper(id, deck).then(function (file) { return download(file); });
  }
  function download(file) {
    var url = URL.createObjectURL(file);
    var a = document.createElement('a');
    a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return true;
  }

  /* ================================================================ "That's me" → lock-screen sheet */
  var nsCur = null;
  function nudgeSheetHTML(withM21) {
    return '<div class="dim" id="ns-dim" data-action="ns-close"></div>' +
      '<section class="sheet ns" id="ns" role="dialog" aria-modal="true" aria-labelledby="ns-title" inert>' +
        '<div class="ns-row">' +
          '<div class="phone-mock" aria-hidden="true"><img data-ns-img alt=""><span class="pm-date" data-ns-date></span><span class="pm-time">9:41</span></div>' +
          '<div class="ns-copy"><p class="eyebrow">IT’S YOU</p><h2 id="ns-title">MAKE IT YOUR LOCK SCREEN</h2>' +
            '<p class="ns-sub">See it every time you pick up your phone.</p></div>' +
        '</div>' +
        '<button type="button" class="btn-gold white" data-action="ns-save">' + I.download + '<span>SAVE TO MY PHONE</span></button>' +
        '<p class="ns-after" data-ns-after hidden>Saved. In Photos, tap Share, then <b>Use as Wallpaper</b>.</p>' +
        (withM21 && M21 ? '<a class="ns-m21" data-ns-m21 hidden href="#/mirror21">' + esc((M21.cards || {}).afterNudge || 'Want Kevin with you for 21 steps?') + ' <b>' + M21_MARK + ' ' + I.arrow + '</b></a>' : '') +
        '<button type="button" class="link" data-action="ns-close">Done</button>' +
      '</section>';
  }
  function openNudgeSheet(id, deck) {
    var sheet = document.getElementById('ns'); if (!sheet) return;
    nsCur = { id: id, deck: deck };
    var img = sheet.querySelector('[data-ns-img]');
    img.src = cardSrc(id, deck);
    wallpaper(id, deck).then(function (f) { if (nsCur && nsCur.id === id) img.src = URL.createObjectURL(f); }).catch(function () {});
    sheet.querySelector('[data-ns-date]').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var save = sheet.querySelector('[data-action="ns-save"]');
    save.classList.remove('done'); save.innerHTML = I.download + '<span>SAVE TO MY PHONE</span>';
    sheet.querySelector('[data-ns-after]').hidden = true;
    var m21 = sheet.querySelector('[data-ns-m21]'); if (m21) m21.hidden = true;
    sheet.removeAttribute('inert');
    sheet.classList.add('open'); document.getElementById('ns-dim').classList.add('open');
  }
  function closeNudgeSheet() {
    var sheet = document.getElementById('ns'); if (!sheet) return;
    sheet.classList.remove('open'); sheet.setAttribute('inert', '');
    document.getElementById('ns-dim').classList.remove('open');
  }

  /* ================================================================ 4 · CARD UNLOCKED */
  function rewardScreen(kind, n) {
    var item = kind === 'mirror' ? mirrorBy(n) : episodeBy(n);
    var x = item && item.card && nudgeBy(item.card);
    if (!x || !unlocked() || !sourceDone(kind, item.n)) { go('#/home'); return null; }
    var count = collectedCount();
    // after a Mirror: into the app. After an episode, or a card that reaches a milestone: to the collection
    // (where the Mirror 21 pop-up for that milestone is waiting).
    var next = kind === 'mirror' && !milestonesDue().length
      ? '<a class="btn-gold white" href="#/home">ENTER THE POCKET MIRROR</a>'
      : '<a class="btn-gold white" href="#/home/nudges" data-action="see-deck" data-deck="' + x.deck + '" data-id="' + x.id + '">SEE MY COLLECTION</a>';
    var html =
      '<section class="screen reward">' +
        '<p class="done-chip">' + I.check + (kind === 'mirror' ? 'MIRROR ' : 'EPISODE ') + pad2(item.n) + ' DONE</p>' +
        '<h1>' + (count === 1 ? 'FIRST' : 'NEW') + ' CARD<br>UNLOCKED.</h1>' +
        '<div class="reward-stage">' +
          // the glow behind the card takes the card's colour (deck: white / black / gold)
          '<div class="reward-card ' + x.deck + '">' +
            '<div class="rc-inner">' +
              '<img class="rc-face rc-front" src="' + cardSrc(x.id, x.deck) + '" alt="' + esc(x.text) + '">' +
              '<img class="rc-face rc-back" src="' + CARD_BACK + '" alt="">' +
            '</div>' +
            '<span class="rc-sheen" aria-hidden="true"></span>' +
          '</div>' +
        '</div>' +
        // no "13 OF 21 COLLECTED" here: COLLECT shows the count. The card sits centred between the title and the button.
        next +
      '</section>';
    return {
      html: html,
      mount: function () { track('reward_view', { nudge: x.id, from: kind, n: item.n, collected: count }); }
    };
  }

  /* ================================================================ 5 · HOME */
  function tabbar(tab) {
    var t = function (key, label, icon) {
      return '<a href="#/home/' + key + '"' + (tab === key ? ' aria-current="page"' : '') + '>' + icon + '<span>' + label + '</span></a>';
    };
    return '<nav class="tabbar" aria-label="The Pocket Mirror">' + t('mirrors', TABS.mirrors || 'LISTEN', I.tabMirrors) + t('nudges', TABS.nudges || 'COLLECT', I.tabNudges) + t('podcast', TABS.podcast || 'EXPLORE', I.tabPodcast) + '</nav>';
  }
  function homeTop() {
    return '<div class="home-top"><img class="logo" src="assets/images/pocket-mirror-logo.png" width="640" height="91" alt="The Pocket Mirror">' +
      (M21 ? '<a class="m21-btn" href="#/mirror21" data-action="m21-open" data-from="top" aria-label="Mirror 21, the 21-step training">' + M21_MARK + '</a>' : '') + '</div>';
  }
  function allMirrorsHeard() { return AVAILABLE.length > 0 && AVAILABLE.every(function (m) { return S.heard[m.n]; }); }

  function homeScreen(tab) {
    if (!unlocked()) { go('#/'); return null; }
    tab = tab || 'mirrors';
    var body = '', mount = null, extra = '';

    if (tab === 'mirrors') {
      var heard = Object.keys(S.heard).filter(function (k) { return S.heard[k]; }).length;
      body =
        homeTop() +
        markTitle(TITLES.mirrors || ['', 'LISTEN'], 'Listen: the 12 Mirrors') +
        tabProgress(heard, CONFIG.totalMirrors, 'HEARD', 'Mirrors heard') +
        a2hsCardHTML() +
        (allMirrorsHeard() && M21 ? m21Card(((M21.cards || {}).allMirrors || [])[0], ((M21.cards || {}).allMirrors || [])[1]) : '') +
        '<ul class="mirror-list">' + MIRRORS.map(mirrorRow).join('') + '</ul>' +
        (DEMO ? '<button type="button" class="link demo-reset" data-action="start-over">Start over (demo)</button>' : '');
      extra = a2hsSheetHTML();
      mount = function () { if (app.querySelector('[data-a2hs]')) track('a2hs_card_view', { mode: a2hsMode() }); };
    }

    if (tab === 'nudges') {
      // all 21 cards in one arc, deck by deck (white, black, gold: the order of PATHS)
      var arc = [];
      PATHS.forEach(function (p) { nudgesOf(p.deck).forEach(function (x) { arc.push(x); }); });
      var got = collectedCount(), total = arc.length;
      var want = (DEMO && QS.get('card')) || S.arcCard; // preview.html: ?card=<id> opens on that card
      var startAt = Math.max(0, arc.map(function (x) { return x.id; }).indexOf(want));
      if (!want || !nudgeBy(want)) { var firstGot = arc.filter(function (x) { return isCollected(x.id); })[0]; startAt = firstGot ? arc.indexOf(firstGot) : 0; }
      // just unlocked (came from "SEE MY COLLECTION"): that card turns over from its back, once
      var flipId = S.arcFlip && isCollected(S.arcFlip) ? S.arcFlip : '';
      if (S.arcFlip) { S.arcFlip = ''; persist(); }
      var segs = arc.map(function (x, i) {
        var cls = (isCollected(x.id) ? 'on' : '') + (i && arc[i - 1].deck !== x.deck ? ' gap' : '');
        return '<span data-seg' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + '></span>';
      }).join('');
      body =
        homeTop() +
        '<h1 class="sr-only">Collect: the ' + total + ' nudge cards</h1>' +
        // 13 OF 21 COLLECTED: the 21 segments in their three decks; the middle card's segment stands taller
        '<div class="tab-progress arc-progress"><span>' + got + ' OF ' + total + ' COLLECTED</span>' +
          '<div class="segs" role="progressbar" aria-label="Cards collected" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + got + '">' + segs + '</div></div>' +
        // the three stages: they light up as you flick into each one; tap one to jump to its first card
        '<div class="arc-stages" role="group" aria-label="Jump to a stage">' + PATHS.map(function (p) {
          return '<button type="button" data-stage="' + p.deck + '">' + esc(p.deckName || p.name) + '</button>';
        }).join('') + '</div>' +
        '<p class="arc-ask" data-ask aria-live="polite"></p>' +
        '<div class="arc" data-arc tabindex="0" role="listbox" aria-label="Your nudge cards. Swipe or use the arrow keys.">' +
          '<span class="arc-floor" aria-hidden="true"></span><span class="arc-glow" aria-hidden="true"></span>' +
          // yours = the card's face; not yet = the card back (it turns over once you have it)
          arc.map(function (x, i) {
            var have = isCollected(x.id), lazy = Math.abs(i - startAt) > 4 ? ' loading="lazy"' : '';
            return '<div class="arc-card ' + x.deck + (have ? '' : ' locked') + (x.id === flipId ? ' flip-in' : '') + '" role="option" data-i="' + i + '" aria-label="' + esc(have ? x.text : 'Card not collected yet') + '">' +
              '<div class="arc-inner">' +
                '<img class="arc-face" src="' + (have ? cardSrc(x.id, x.deck) : CARD_BACK) + '" alt="" draggable="false"' + lazy + '>' +
                (x.id === flipId ? '<img class="arc-face arc-back" src="' + CARD_BACK + '" alt="" draggable="false">' : '') +
              '</div></div>';
          }).join('') +
        '</div>' +
        // what the middle card is: yours (tap to save it) or not yet (tap to hear what unlocks it)
        '<button type="button" class="arc-info" data-arc-info></button>';
      var due = milestonesDue();
      extra = nudgeSheetHTML(true) + (due.length ? m21PopHTML(due[0]) : '');
      mount = function () {
        track('nudges_view', { collected: got });
        // a collection milestone: the Mirror 21 pop-up rises a moment after the tab opens (once per milestone)
        var popT = due.length ? setTimeout(function () {
          due.forEach(function (ms) { S.m21Shown[milestoneKey(ms)] = true; }); // two at once: only the first shows, both count as seen
          persist();
          var sheet = document.getElementById('m21p'); if (!sheet) return;
          sheet.removeAttribute('inert'); sheet.classList.add('open'); document.getElementById('m21p-dim').classList.add('open');
          track('m21_milestone_view', { milestone: milestoneKey(due[0]) });
        }, 1200) : 0;
        var stopArc = mountArc(arc, startAt);
        return function () { clearTimeout(popT); stopArc(); }; // left before the pop-up rose: it waits for the next visit
      };
    }

    if (tab === 'podcast') {
      var upNext = nextEpisode(), epsHeard = heardEpisodes(), all = PODCAST.episodes, epsTotal = all.length;
      var epState = function (e) {
        if (!e.audio || !episodeOpen(e)) return 'locked';
        return S.eps[e.n] ? 'heard' : upNext && upNext.n === e.n ? 'next' : 'open';
      };
      var stateWord = { heard: 'heard', next: 'up next', open: 'open', locked: 'locked' };
      // a row of cassettes you swipe: white = listen now (it glows: tap it to play), grey = heard,
      // frosted with a lock = not open yet. Under it: the middle one's title, length and what comes next.
      body =
        homeTop() +
        markTitle(TITLES.podcast || ['', 'EXPLORE'], 'Explore: ' + PODCAST.name + ' podcast') +
        tabProgress(epsHeard, epsTotal, 'HEARD', 'Episodes heard') +
        '<div class="tapes" data-tapes tabindex="0" role="listbox" aria-label="Episodes. Swipe or use the arrow keys; Enter plays the middle one.">' + all.map(function (e, i) {
          var st = epState(e);
          return '<div class="tape ' + st + '" data-i="' + i + '" role="option" aria-label="Episode ' + pad2(e.n) + ', ' + stateWord[st] + '">' +
            '<div class="tape-pic">' + cassetteImg(e, tapeColour(st), i > 3 ? ' loading="lazy"' : '') +
              (st === 'locked' ? '<span class="tape-lock" aria-hidden="true">' + I.lock + '</span>' : '') + '</div>' +
            '<p class="tape-n"><span>' + pad2(e.n) + '</span>' +
              (st === 'heard' ? '<i class="ic-done">' + I.check + '</i>' : st === 'next' ? '<i class="ic-dot"></i>' : '') + '</p>' +
            (st === 'locked' ? '<p class="tape-locked">LOCKED</p>' : '') +
          '</div>';
        }).join('') + '</div>' +
        '<div class="tape-info" aria-live="polite">' +
          '<h2 class="tape-title" data-tape-title></h2><p class="tape-meta" data-tape-meta></p>' +
          '<p class="tape-hint" data-tape-hint></p>' +
        '</div>';
      mount = function () {
        track('podcast_view');
        var stage = app.querySelector('[data-tapes]'), els = [].slice.call(stage.querySelectorAll('.tape')), cur = -1;
        var hint = app.querySelector('[data-tape-hint]');
        var playingNow = function (e) { return now && now.kind === 'episode' && now.n === e.n && !audio.paused && !audio.ended; };
        // the middle episode: title, length and one grey line (redrawn only when something changed: this also runs on every audio tick)
        var shown = '';
        function info(i) {
          var e = all[i], st = epState(e), nxt = all[i + 1];
          var key = i + st + playingNow(e);
          if (key === shown) return;
          shown = key; cur = i;
          app.querySelector('[data-tape-title]').textContent = e.title || 'Coming soon';
          app.querySelector('[data-tape-meta]').textContent = e.audio ? mins(e.duration) : '';
          hint.textContent = playingNow(e) ? 'Now playing · tap to open'
            : st === 'locked' ? (e.audio && all[i - 1] ? lockHint(e) : 'Coming soon')
            : st === 'heard' ? 'Tap to listen again'
            : nxt && epState(nxt) === 'locked' && nxt.audio ? 'Finish ' + pad2(e.n) + ' to unlock ' + pad2(nxt.n)
            : 'Tap to listen';
        }
        // tap the middle cassette: play it (playing: open the player; locked: say what opens it)
        function useMiddle() {
          var e = all[cur]; if (!e) return;
          if (playingNow(e)) { go('#/episode/' + e.n); return; }
          if (epState(e) === 'locked') { toast((e.audio && all[cur - 1] ? lockHint(e) : 'Coming soon').toUpperCase()); return; }
          actions['play-episode']({ getAttribute: function () { return String(e.n); } });
        }
        // open on what is playing, otherwise on the next episode to hear (preview.html: ?ep=3 opens on episode 03)
        var start = (DEMO && QS.get('ep') && episodeBy(+QS.get('ep'))) || (now && now.kind === 'episode' ? episodeBy(now.n) : upNext);
        var swipe = swipeDeck(stage, els, Math.max(0, all.indexOf(start)), {
          layout: tapeLayout, unit: 0.84, pick: info, tapMiddle: useMiddle
        });
        podcastSync = function () { if (cur >= 0) info(cur); }; // play / pause changes the button
        return function () { podcastSync = null; swipe.stop(); };
      };
    }

    return {
      // no mini player: an episode keeps playing after you leave it (lock screen controls still work), with no bar on these tabs
      html: '<section class="screen home' + (tab === 'nudges' ? ' collect' : tab === 'podcast' ? ' explore' : '') + '">' + body + '</section>' + tabbar(tab) + extra,
      mount: mount
    };
  }

  /* ================================================================ 6 · EPISODE PLAYER */
  function episodeScreen(n) {
    var e = episodeBy(n);
    if (!e || !e.audio) { go('#/home/podcast'); return null; }
    if (!unlocked()) { go('#/'); return null; }
    if (!episodeOpen(e)) { toast(lockHint(e).toUpperCase()); go('#/home/podcast'); return null; }
    load('episode', e.n);
    var nxt = EPISODES[EPISODES.indexOf(e) + 1];
    // the same layout as the Mirror player: artwork (the episode's cassette), title, bar, controls, Best with sound.
    // No subtitles and no free part. Under the controls: what opens next, and the Mirror 21 card once it is heard.
    var html =
      '<section class="screen player mirror-player episode-player" data-player data-kind="episode" data-n="' + e.n + '">' +
        '<div class="topbar"><a class="icon-btn" href="#/home/podcast" aria-label="Back to the podcast">' + I.down + '</a>' +
          '<p class="eyebrow">EPISODE ' + pad2(e.n) + '</p></div>' +
        '<div class="art tape-art" aria-hidden="true">' + cassetteImg(e, 'white') + '</div>' +
        '<h1>' + esc(e.title) + '</h1>' +
        scrubHTML('episode', e, 0) +
        transportHTML('episode', e.n) +
        (nxt && !episodeOpen(nxt) ? '<p class="next-lock" data-next-lock>' + I.lock + 'Finish this one to open ' + pad2(nxt.n) + '</p>' : '') +
        // Mirror 21 card once the episode is heard; its ✕ hides it for this episode only
        (M21 ? '<div class="m21-end" data-m21-end hidden>' + m21Card(((M21.cards || {}).episodeEnd || [])[0] || 'READY FOR MORE?', ((M21.cards || {}).episodeEnd || [])[1], 'compact') +
          '<button type="button" class="m21-end-x" data-action="m21-end-close" data-n="' + e.n + '" aria-label="Close">' + I.close + '</button></div>' : '') +
        '<div class="player-foot solo"><p class="sound-hint">' + I.phones + 'Best with sound</p></div>' +
      '</section>';
    return {
      html: html,
      mount: function () {
        track('episode_view', { episode: e.n });
        bindScrubs('episode', e);
      }
    };
  }

  /* ================================================================ 7 · MIRROR 21 (white)
     One white screen, no scrolling: YOU KNOW. NOW DO., the line, the phones picture (the part that grows and shrinks
     with the phone), the gold rule, the points, START MIRROR 21 and "watch the introduction".
     START MIRROR 21 = Kevin's video; at its end (or SKIP) LET'S FOLLOW THROUGH rises in the middle, over the paused video
     (FOLLOW THROUGH · $99 → the purchase link; Not now → back to the page). */
  var filmMode = '';   // 'start' while Kevin's video is open
  function filmEl() { return document.getElementById('film'); }
  // open Kevin's video over the page and play it (called inside the tap, so it plays with sound)
  function openFilm(mode) {
    var el = filmEl(); if (!el) return;
    var v = el.querySelector('video');
    if (!audio.paused) audio.pause(); // never two voices at once
    filmMode = mode;
    try { v.currentTime = 0; } catch (x) { /* not loaded yet */ }
    el.classList.add('open'); el.removeAttribute('inert');
    var p = v.play(); if (p && p.catch) p.catch(function () {}); // blocked? the play button on his chin starts it
    track('m21_video_play', { mode: mode });
  }
  // the video ends (or SKIP): it pauses where it is and LET'S FOLLOW THROUGH rises in the middle, over it
  function finishFilm(how) {
    var el = filmEl(); if (!el || !el.classList.contains('open')) return;
    el.querySelector('video').pause();
    track(how === 'end' ? 'm21_video_end' : 'm21_video_skip');
    openFollow();
  }
  // back to the page (Not now): the pop-up and the video both close
  function closeFilm() {
    var el = filmEl(); if (!el) return;
    el.querySelector('video').pause();
    el.classList.remove('open'); el.setAttribute('inert', '');
    filmMode = '';
  }
  function openFollow() {
    var sheet = document.getElementById('m21f'); if (!sheet) return;
    sheet.removeAttribute('inert'); sheet.classList.add('open'); document.getElementById('m21f-dim').classList.add('open');
    track('m21_follow_view');
  }
  function closeFollow() {
    var sheet = document.getElementById('m21f'); if (!sheet) return;
    sheet.classList.remove('open'); sheet.setAttribute('inert', ''); document.getElementById('m21f-dim').classList.remove('open');
    closeFilm();
  }
  function mirror21Screen() {
    if (!M21) { go('#/home'); return null; }
    var close = unlocked() ? '#/home' : '#/';
    var head = M21.headline || ['YOU KNOW.', 'NOW DO.'];
    var follow = M21.follow || {};
    var url = esc(M21.url || '#'), ext = M21.url ? ' target="_blank" rel="noopener"' : '';
    var html =
      '<section class="screen m21x">' +
        '<div class="m21x-top"><p class="m21x-brand">' + M21_MARK + '</p>' +
          '<a class="m21x-close" href="' + close + '" aria-label="Close">' + I.close + '</a></div>' +
        (M21.kicker ? '<p class="m21x-kicker">' + esc(M21.kicker) + '</p>' : '') +
        (head.length === 1
          // one line, as wide as the screen (data-fit shrinks it to fit)
          ? '<h1 class="m21x-head one" data-fit><span>' + esc(head[0]) + '</span></h1>'
          : '<h1 class="m21x-head" style="--lines:' + head.length + '">' + head.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join(' ') + '</h1>') +
        (M21.sub ? '<p class="m21x-sub">' + esc(M21.sub) + '</p>' : '') +
        (M21.visual ? '<div class="m21x-visual"><img src="' + esc(M21.visual) + '" alt="Mirror 21 on a phone: Kevin’s video, the 21-step path and a writing step"></div>' : '<div class="m21x-visual"></div>') +
        '<div class="m21x-body">' +
          '<hr class="m21x-rule">' +
          '<ul class="m21x-points">' + (M21.points || []).map(function (t, i) {
            return '<li>' + [I.target, I.checkCircle, I.repeat][i % 3] + '<span>' + esc(t) + '</span></li>';
          }).join('') + '</ul>' +
          (M21.video
            ? '<button type="button" class="btn-gold ink" data-action="m21-start">START ' + M21_MARK + '</button>'
            : '<a class="btn-gold ink" data-action="m21-go" href="' + url + '"' + ext + '>START ' + M21_MARK + '</a>') +
        '</div>' +
      '</section>' +
      // Kevin's video, full screen over the page: sharp across the width in the middle, fading into black
      (M21.video ?
      '<section class="intro film paused" id="film" role="dialog" aria-modal="true" aria-label="Kevin on Mirror 21" inert>' +
        '<div class="film-frame" data-film-frame>' +
          '<video class="intro-video" src="' + esc(M21.video) + '"' + (M21.videoPoster ? ' poster="' + esc(M21.videoPoster) + '"' : '') + ' preload="metadata" playsinline webkit-playsinline></video>' +
          '<button type="button" class="intro-play" data-action="film-toggle" aria-label="Play"><span class="ring">' + I.play + '</span></button>' +
        '</div>' +
        '<div class="intro-bar" aria-hidden="true"><span data-film-fill></span></div>' +
        '<button type="button" class="intro-skip" data-action="film-skip">SKIP</button>' +
        '<div class="intro-head"><p class="intro-meta" data-film-meta></p><p class="intro-title">' + M21_MARK + '</p></div>' +
      '</section>' : '') +
      // at the end of the video (or SKIP): LET'S FOLLOW THROUGH, in the middle of the screen, over the paused video
      '<div class="dim" id="m21f-dim" data-action="follow-close"></div>' +
      '<section class="sheet m21-pop center" id="m21f" role="dialog" aria-modal="true" aria-labelledby="m21f-title" inert>' +
        '<p class="m21-pop-brand">' + M21_MARK + '</p>' +
        '<h2 id="m21f-title">' + esc(follow.title || 'LET’S FOLLOW THROUGH.') + '</h2>' +
        '<p class="m21-pop-line">' + esc(follow.line || M21.tagline || '') + '</p>' +
        '<a class="btn-gold ink" data-action="m21-go" href="' + url + '"' + ext + '>' + esc(follow.button || 'FOLLOW THROUGH') + ' · ' + esc(M21.price) + '</a>' +
        '<button type="button" class="link" data-action="follow-close">Not now</button>' +
      '</section>';
    return {
      html: html,
      mount: function () {
        track('m21_view');
        var root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
        root.classList.add('is-light'); if (meta) meta.setAttribute('content', '#ffffff');
        var film = filmEl(), v = film && film.querySelector('video'), onKey = null;
        if (v) {
          var fill = film.querySelector('[data-film-fill]'), metaEl = film.querySelector('[data-film-meta]');
          var sync = function () {
            var d = isFinite(v.duration) && v.duration ? v.duration : (M21.videoSeconds || 37);
            film.classList.toggle('paused', v.paused || v.ended);
            fill.style.width = (100 * Math.min(1, v.currentTime / d)).toFixed(2) + '%';
            metaEl.textContent = v.currentTime > 0.5 ? fmt(v.currentTime) + ' / ' + fmt(d) : fmt(d);
          };
          ['play', 'pause', 'timeupdate', 'loadedmetadata'].forEach(function (ev) { v.addEventListener(ev, sync); });
          v.addEventListener('ended', function () { finishFilm('end'); });
          // tap Kevin = pause / play
          film.querySelector('[data-film-frame]').addEventListener('click', function (e) {
            if (e.target.closest('.intro-play')) return;
            if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
          });
          onKey = function (e) {
            var popOpen = (document.getElementById('m21f') || {}).classList && document.getElementById('m21f').classList.contains('open');
            if (popOpen) { if (e.key === 'Escape') closeFollow(); return; }
            if (!film.classList.contains('open')) return;
            if (e.key === ' ') { e.preventDefault(); if (v.paused) v.play(); else v.pause(); }
            else if (e.key === 'Escape') finishFilm('skip');
          };
          document.addEventListener('keydown', onKey);
          sync();
        }
        return function () {
          if (v) v.pause();
          if (onKey) document.removeEventListener('keydown', onKey);
          filmMode = '';
          root.classList.remove('is-light'); if (meta) meta.setAttribute('content', '#0a0a0a');
        };
      }
    };
  }

  /* ================================================================ taps (one listener for the whole app) */
  var actions = {
    'play-mirror': function (el) {
      var n = +el.getAttribute('data-n');
      var m = mirrorBy(n); if (!m || !m.audio) return;
      var same = now && now.kind === 'mirror' && now.n === n;
      load('mirror', n);
      if (!same || audio.ended || !unlocked()) audio.currentTime = 0;
      play(); // start inside the tap so phones allow sound
      S.lastMirror = n; S.lastPath = m.path; persist();
      track('mirror_play', { mirror: n, path: m.path });
      go('#/mirror/' + n);
    },
    'play-episode': function (el) {
      var n = +el.getAttribute('data-n');
      var ep = episodeBy(n);
      if (!episodeOpen(ep)) { toast(lockHint(ep).toUpperCase()); return; }
      load('episode', n);
      play();
      track('episode_play', { episode: n });
      go('#/episode/' + n);
    },
    'toggle': function (el) {
      var kind = el.getAttribute('data-kind'), n = +el.getAttribute('data-n');
      if (!now || now.kind !== kind || now.n !== n) { load(kind, n); audio.currentTime = 0; }
      if (audio.paused || audio.ended) play(); else audio.pause();
    },
    // FIND MY MIRROR: the first time, MEET KEVIN (started right here, inside the tap, so it plays with sound); after that, the Mirrors
    'find-mirror': function (el, e) {
      if (!INTRO || S.introSeen || unlocked()) return; // the link itself goes to the Mirrors
      e.preventDefault();
      var p = introVideo().play(); if (p && p.catch) p.catch(function () {}); // blocked? the banner's play button starts it
      go('#/intro');
    },
    'intro-toggle': function () { toggleIntro(); },
    'intro-again': function () {
      if (!introVid) return;
      try { introVid.currentTime = 0; } catch (x) { /* not loaded */ }
      var p = introVid.play(); if (p && p.catch) p.catch(function () {});
      track('intro_again');
    },
    'intro-done': function (el) { introDone(el.getAttribute('data-how') || 'skip'); },
    'subs-open': function () {
      S.cc = true; persist();
      openSubs();
      track('subtitles_on', { mirror: now && now.n });
    },
    'subs-close': function () {
      S.cc = false; persist();
      closeSubs();
      track('subtitles_off', { mirror: now && now.n });
    },
    'skip': function (el) {
      var d = (isFinite(audio.duration) && audio.duration) || 0;
      audio.currentTime = Math.max(0, Math.min(d || Infinity, audio.currentTime + (+el.getAttribute('data-by'))));
    },
    'view-card': function (el) { openViewer(el.getAttribute('data-id')); },
    'cv-flip': function (el) {
      var on = el.closest('.card').classList.toggle('flipped');
      if (on && cvCur) track('nudge_flip', { nudge: cvCur.id });
    },
    'cv-close': function () { closeViewer(); },
    'cv-lock': function () {
      if (!cvCur) return;
      var x = cvCur;
      closeViewer();
      setTimeout(function () { openNudgeSheet(x.id, x.deck); }, 200);
    },
    'soon-card': function () { toast('COMING SOON'); },
    'm21-end-close': function (el) {
      S.m21EndHidden[+el.getAttribute('data-n')] = true; persist();
      var card = el.closest('[data-m21-end]'); if (card) card.hidden = true;
      track('m21_episode_card_close', { episode: +el.getAttribute('data-n') });
    },
    // Mirror 21 page: START = Kevin's video then LET'S FOLLOW THROUGH; "watch the introduction" = the video only
    'm21-start': function () { openFilm('start'); },
    'film-toggle': function () {
      var el = filmEl(), v = el && el.querySelector('video'); if (!v) return;
      if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    },
    'film-skip': function () { finishFilm('skip'); },
    'follow-close': function () { closeFollow(); track('m21_follow_close'); },
    'm21p-close': function () {
      var sheet = document.getElementById('m21p'); if (!sheet) return;
      sheet.classList.remove('open'); sheet.setAttribute('inert', '');
      document.getElementById('m21p-dim').classList.remove('open');
      track('m21_milestone_dismiss');
    },
    'see-deck': function (el) {
      var p = PATHS.filter(function (x) { return x.deck === el.getAttribute('data-deck'); })[0];
      if (p) S.deck = p.key;
      if (el.getAttribute('data-id')) S.arcCard = S.arcFlip = el.getAttribute('data-id'); // COLLECT opens on the card just unlocked, and turns it over
      persist();
    },
    // COLLECT: the middle card is yours → straight to "Make it your lock screen" (save / share)
    'arc-save': function (el) {
      openNudgeSheet(el.getAttribute('data-id'), el.getAttribute('data-deck'));
      track('nudge_open', { nudge: el.getAttribute('data-id') });
    },
    'ns-save': function (el) {
      if (!nsCur) return;
      var id = nsCur.id, deck = nsCur.deck;
      saveWallpaper(id, deck).then(function (ok) {
        if (!ok) return;
        S.saved[id] = deck; persist();
        track('nudge_save', { nudge: id, deck: deck });
        el.classList.add('done'); el.innerHTML = I.check + '<span>SAVED</span>';
        var sheet = document.getElementById('ns');
        sheet.querySelector('[data-ns-after]').hidden = false;
        var m21 = sheet.querySelector('[data-ns-m21]'); if (m21) m21.hidden = false;
      });
    },
    'ns-close': function () { closeNudgeSheet(); },
    'm21-open': function (el) { track('m21_open', { from: el.getAttribute('data-from') || '' }); },
    'close-gate': function () { closeGate(); },
    'a2hs-x': function () { track('a2hs_dismiss'); hideA2hsCard(); },
    'a2hs-go': function () {
      if (a2hsMode() === 'android' && installPrompt) {
        installPrompt.prompt();
        installPrompt.userChoice.then(function (r) { track('a2hs_android', { outcome: r && r.outcome }); if (r && r.outcome === 'accepted') hideA2hsCard(); installPrompt = null; });
        return;
      }
      stampInstallURL();
      track('a2hs_guide');
      var sheet = document.getElementById('a2'); if (!sheet) return;
      sheet.removeAttribute('inert'); sheet.classList.add('open'); document.getElementById('a2-dim').classList.add('open');
    },
    'a2hs-close': function () {
      var sheet = document.getElementById('a2'); if (!sheet) return;
      sheet.classList.remove('open'); sheet.setAttribute('inert', ''); document.getElementById('a2-dim').classList.remove('open');
      hideA2hsCard();
    },
    'locked-episode': function (el) {
      var ep = episodeBy(el.getAttribute('data-n'));
      toast(lockHint(ep).toUpperCase());
      track('episode_locked_tap', { episode: ep.n });
    },
    'm21-go': function (el, e) {
      track('m21_click', { has_url: !!M21.url });
      if (!M21.url) { e.preventDefault(); toast('LINK COMING SOON'); }
    },
    'start-over': function () {
      audio.pause(); audio.removeAttribute('src'); now = null;
      S.email = ''; S.heard = {}; S.eps = {}; S.saved = {}; S.m21Shown = {}; S.m21EndHidden = {}; S.pending = []; S.deck = ''; S.arcCard = ''; S.arcFlip = ''; S.introSeen = false; S.lastPath = ''; S.joinedAt = 0; S.lastMirror = 0; S.a2hsDone = false;
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (x) { /* ignore */ } // drop the home-screen unlock
      go('#/');
    },
    'not-now': function () { track('gate_not_now', { mirror: now && now.n }); }
  };
  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || !app.contains(el)) return;
    var fn = actions[el.getAttribute('data-action')];
    if (fn) fn(el, e);
  });

  /* ================================================================ start */
  // Handy for debugging in the browser console: PocketMirror.state, PocketMirror.audio
  window.PocketMirror = { state: S, audio: audio, go: go, track: track, demo: DEMO };

  window.addEventListener('online', flushLeads);
  flushLeads();
  render();
})();
