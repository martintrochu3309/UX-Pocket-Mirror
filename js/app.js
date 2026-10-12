/*
 * THE POCKET MIRROR · app
 * ---------------------------------------------------------------
 * Plain JavaScript, no framework, no build step.
 * Content lives in js/content.js. Styles in css/styles.css.
 *
 * Screens (hash routes):
 *   #/                 1 · Landing: swipe a path
 *   #/path/<key>       2 · Which one is you? (Mirrors of that path)
 *   #/mirror/<n>       3 · Kevin's voice. Pauses at CONFIG.previewSeconds until an email is given
 *   #/unlocked/<kind>/<n>  4 · Card unlocked (straight after a Mirror or episode is finished for the first time)
 *   #/home[/tab]       5 · Home after email: mirrors | nudges | podcast
 *   #/episode/<n>      6 · Podcast episode player
 *   #/mirror21         7 · Mirror 21, the $99 training (white)
 *
 * Deep links (for QR codes):
 *   ?src=london-talk   tags every email captured from that link
 *   ?m=3               opens Mirror 03 directly
 *   ?path=own          opens a path directly
 */
(function () {
  'use strict';

  var C = window.PM_CONTENT;
  var CONFIG = C.CONFIG, PATHS = C.PATHS, MIRRORS = C.MIRRORS, NUDGES = C.NUDGES, PODCAST = C.PODCAST, HOST = C.HOST;
  var TITLES = C.TITLES || {}, M21 = C.MIRROR21 || null, CAPTIONS = C.CAPTIONS || {};
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
    tabMirrors: svg('<circle cx="12" cy="10" r="6.5"/><path d="M9.5 8.5a3 3 0 0 1 3-2M12 16.5V21M9 21h6"/>', ' stroke-width="1.6"'),
    tabNudges: svg('<rect x="7" y="3.5" width="12" height="16" rx="2" transform="rotate(8 13 11.5)"/><rect x="4" y="5" width="12" height="16" rx="2"/>', ' stroke-width="1.6"'),
    share: svg('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>', ' stroke-width="1.8"'),
    addSq: svg('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>', ' stroke-width="1.8"'),
    up: svg('<path d="M12 19V5M6 11l6-6 6 6"/>', ' stroke-width="2.2"'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>', ' stroke-width="2"'),
    target: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>', ' stroke-width="1.8"'),
    checkCircle: svg('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>', ' stroke-width="1.8"'),
    tabPodcast: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>', ' stroke-width="1.6"')
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

  var S = { email: '', source: '', heard: {}, eps: {}, saved: {}, pending: [], deck: '', lastPath: '', lastMirror: 0, a2hsDone: false };
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
  if (QS.get('pm') === '1') {
    if (!S.email) S.email = 'home-screen';
    (QS.get('h') || '').split(',').forEach(function (n) { if (+n) S.heard[+n] = true; });
    (QS.get('e') || '').split(',').forEach(function (n) { if (+n) S.eps[+n] = true; });
    // only the home-screen app itself is "done"; a refresh in Safari keeps the add-to-home-screen card
    if (navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches)) {
      S.a2hsDone = true;
      try { history.replaceState(null, '', location.pathname + location.search + '#/home'); } catch (x) { /* ignore */ }
    }
    try { if (!DEMO) localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  function persist() { stampInstallURL(); if (DEMO) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }
  function unlocked() { return !!S.email; }

  /* ================================================================ big reflected titles (12 MIRRORS style) */
  function markTitle(parts, label, goldLast) {
    var g = '<span class="g">' + esc(parts[0]) + '</span>', w = esc(parts[1]);
    var inner = goldLast ? w + g : g + w;
    return '<h1 class="sr-only">' + esc(label) + '</h1>' +
      '<div class="mark-title" aria-hidden="true" data-fit><p>' + inner + '</p><p>' + inner + '</p></div>';
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
  function lockHint(e) {
    var i = EPISODES.indexOf(e);
    if ((CONFIG.podcastUnlock || 'listen') === 'weekly') {
      var every = CONFIG.podcastEveryDays || 7;
      var at = (S.joinedAt || Date.now()) + i * every * 864e5;
      var d = Math.max(1, Math.ceil((at - Date.now()) / 864e5));
      return 'Opens in ' + d + (d === 1 ? ' day' : ' days');
    }
    return 'Finish Episode ' + pad2(EPISODES[i - 1].n) + ' to open';
  }
  function nextEpisode() {
    var open = EPISODES.filter(episodeOpen);
    return open.filter(function (e) { return !S.eps[e.n]; })[0] || open[open.length - 1];
  }

  /* ================================================================ Mirror 21: visible to everyone after the email */
  function m21Card(eyebrow, line, extra) {
    return '<a class="m21-card' + (extra ? ' ' + extra : '') + '" href="#/mirror21" data-action="m21-open" data-from="' + (extra || 'card') + '" data-m21-card>' +
      '<span class="m21-eyebrow">' + esc(eyebrow || 'YOUR NEXT STEP') + '</span>' +
      '<span class="m21-name">MIRROR<span class="g">21</span></span>' +
      '<span class="m21-line">' + esc(line || M21.tagline) + '</span>' +
      '<span class="m21-foot"><span>' + esc(M21.price) + '</span><span class="m21-go">SEE HOW IT WORKS ' + I.arrow + '</span></span></a>';
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
      '<div class="a2hs-row"><img src="assets/images/icon-192.png" alt="">' +
        '<span class="body"><b>KEEP IT ON YOUR PHONE</b><span>Add The Pocket Mirror to your home screen.</span></span>' +
        '<button type="button" class="a2hs-x" data-action="a2hs-x" aria-label="No thanks">' + I.close + '</button></div>' +
      '<button type="button" class="a2hs-go" data-action="a2hs-go">' + (mode === 'android' ? 'ADD TO HOME SCREEN' : 'SHOW ME HOW') + '</button>' +
    '</div>';
  }
  function a2hsSheetHTML() {
    return '<div class="dim" id="a2-dim" data-action="a2hs-close"></div>' +
      '<section class="sheet a2" id="a2" role="dialog" aria-modal="true" aria-labelledby="a2-title" inert>' +
        '<p class="eyebrow gold">TWO QUICK STEPS</p>' +
        '<h2 id="a2-title">ADD IT TO YOUR HOME SCREEN</h2>' +
        '<ol class="a2-steps">' +
          '<li><span class="n">1</span><span class="t">Tap <b>Share</b><span class="sub">In Safari it can sit under •••</span></span><span class="ico">' + I.share + '</span></li>' +
          '<li><span class="n">2</span><span class="t">Tap <b>Add to Home Screen</b>, then <b>Add</b></span><span class="ico">' + I.addSq + '</span></li>' +
        '</ol>' +
        '<button type="button" class="btn-gold" data-action="a2hs-close">GOT IT</button>' +
      '</section>';
  }
  // So the home-screen app opens already unlocked (iPhone gives it its own memory).
  // Kept up to date from the moment the email is given, so adding to the home screen at ANY point
  // (our "Show me how" or straight from Safari's Share menu) carries the unlock and progress over.
  function stampInstallURL() {
    if (!unlocked() || STANDALONE || DEMO_STATE) return; // DEMO_STATE: preview.html pages keep their ?demo= address
    var h = Object.keys(S.heard).filter(function (k) { return S.heard[k]; }).join(',');
    var e = Object.keys(S.eps).filter(function (k) { return S.eps[k]; }).join(',');
    var url = location.pathname + '?pm=1' + (h ? '&h=' + h : '') + (e ? '&e=' + e : '') + location.hash;
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
    else if (qs.get('path') && pathBy(qs.get('path'))) { target = '#/path/' + qs.get('path'); changed = true; }
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

  function setMediaSession(kind, item) {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    var art = kind === 'episode' ? item.cover : HOST.photo;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: kind === 'episode' ? item.title : 'Mirror ' + pad2(item.n) + ' · ' + item.title,
        artist: 'Kevin Craggs',
        album: kind === 'episode' ? PODCAST.name : 'The Pocket Mirror',
        artwork: [{ src: art, sizes: '512x512', type: 'image/jpeg' }]
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
    // first time through: the card it unlocks. On the player, straight to the reward; elsewhere (mini player), a toast.
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
    [/^#\/path\/(\w+)$/, pathScreen],
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
  function syncUI() {
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
      if (kind === 'mirror') {
        var done = unlocked() && (S.heard[n] || (mine && t >= d - 0.6));
        var hint = root.querySelector('[data-hint]');
        if (hint) hint.hidden = !!done;
      }
      var m21 = root.querySelector('[data-m21-end]');
      if (m21) m21.hidden = !(S.eps[n] && unlocked());
      var range = root.querySelector('[data-scrub]');
      if (range && !range.matches(':active')) range.value = Math.round(1000 * t / d);
      var left = root.querySelector('[data-left]');
      if (left) left.textContent = '−' + fmt(d - t);
    }
    var remain = document.querySelector('[data-remaining]');
    if (remain && now) {
      var dur = (isFinite(audio.duration) && audio.duration) || (mirrorBy(now.n) || {}).duration || 0;
      remain.textContent = fmt(dur - CONFIG.previewSeconds) + ' left';
    }
    app.querySelectorAll('[data-ep-row]').forEach(function (r) {
      r.classList.toggle('playing', !!(now && now.kind === 'episode' && now.n === +r.getAttribute('data-ep-row')));
    });
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
    var c = 0; // SEE IT in the middle, OWN IT right, CHANGE IT left: the plates orbit an endless circle
    var html =
      '<section class="screen landing">' +
        '<div class="mid">' +
          '<h1>THE MIRROR<br>NEVER CHANGES.<br><span class="gold-text">YOU DO.</span></h1>' +
          '<div class="plates" data-plates>' +
            PATHS.map(function (p, i) {
              return '<button type="button" class="plate" data-i="' + i + '" data-key="' + p.key + '">' +
                '<img src="' + p.plate + '" alt="" draggable="false"></button>';
            }).join('') +
          '</div>' +
          '<p class="feeling" data-feeling aria-live="polite"></p>' +
          '<p class="tap-hint" data-tap-hint aria-hidden="true"><span class="tap-dot"></span>TAP TO OPEN</p>' +
        '</div>' +
        '<footer><img src="assets/images/daily-xcellence.png" alt="Daily Xcellence · it starts with you">' +
          (CONFIG.demoMode ? '<p class="demo-flag">DEMO MODE · NOTHING IS SAVED</p>' : '') + '</footer>' +
      '</section>';

    return {
      html: html,
      mount: function () {
        track('landing_view');
        var wrap = app.querySelector('[data-plates]');
        var plates = [].slice.call(wrap.querySelectorAll('.plate'));
        var hint = app.querySelector('[data-tap-hint]');
        var feeling = app.querySelector('[data-feeling]');
        var N = PATHS.length, pos = c, drag = null, swiped = false, opening = false, anim = 0, hintT = 0, firstT = 0, feelT = 0;
        var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
        function setFeeling(instant) {
          var text = '“' + PATHS[c].line + '”';
          if (instant) { feeling.textContent = text; return; }
          feeling.style.opacity = 0;
          clearTimeout(feelT);
          feelT = setTimeout(function () { feeling.textContent = text; feeling.style.opacity = 1; }, 180);
        }

        // "TAP TO OPEN" shows each time a plate lands in the middle, then fades
        function showHint() {
          hint.classList.add('show');
          clearTimeout(hintT);
          hintT = setTimeout(function () { hint.classList.remove('show'); }, 2600);
        }
        // where plate i sits on the ring right now: 0 = middle, ±1 = sides, ±1.5 = straight behind the middle one
        function relOf(i) { var r = ((i - pos) % N + N) % N; return r > N / 2 ? r - N : r; }
        // the plates orbit a circle seen from the front: a plate leaving one side swings round behind
        // the middle plate and comes back in on the other side, so all three stay on screen
        function layout() {
          var w = plates[0].offsetWidth;
          plates.forEach(function (el, i) {
            var rel = relOf(i), a = Math.abs(rel), ang = rel * 2 * Math.PI / N;
            var x = Math.sin(ang) * w * 0.6;          // sides land at ±0.52 plate widths
            var d = (Math.cos(ang) + 1) / 2;          // 1 = front, 0.25 = sides, 0 = back
            el.style.transform = 'translateX(' + x.toFixed(1) + 'px) scale(' + (0.42 + 0.58 * d).toFixed(3) + ')';
            el.style.opacity = (0.6 + 0.4 * Math.sqrt(d)).toFixed(3);
            el.style.zIndex = Math.round(d * 10);
            el.classList.toggle('is-center', a < 0.5);
            el.setAttribute('aria-label', (a < 0.5 ? 'Open ' : 'Show ') + PATHS[i].name);
          });
        }
        // turn the ring to `to` (a whole number), then make that plate the chosen one
        function settle(to) {
          cancelAnimationFrame(anim);
          var from = pos, t0 = performance.now(), dur = calm ? 0 : 650;
          (function step(now) {
            var k = dur ? Math.min(1, (now - t0) / dur) : 1;
            pos = from + (to - from) * (1 - Math.pow(1 - k, 3));
            layout();
            if (k < 1) { anim = requestAnimationFrame(step); return; }
            pos = to;
            var n = ((to % N) + N) % N;
            if (n !== c) { c = n; setFeeling(); showHint(); track('path_swipe', { path: PATHS[c].key }); }
          })(t0);
        }
        function move(dir) { settle(Math.round(pos) + dir); }
        function open() {
          if (opening) return; opening = true;
          var el = plates[c];
          el.classList.add('opening');
          track('path_open', { path: PATHS[c].key });
          setTimeout(function () { go('#/path/' + PATHS[c].key); }, 280);
        }

        // the ring follows the finger, then settles on the nearest plate (a quick flick always turns one)
        wrap.addEventListener('pointerdown', function (e) {
          if (opening || (e.pointerType === 'mouse' && e.button !== 0)) return;
          cancelAnimationFrame(anim);
          // a whole plate width of finger travel turns the ring by one plate (calm, not twitchy)
          drag = { x: e.clientX, pos: pos, t: performance.now(), id: e.pointerId, step: plates[0].offsetWidth };
          swiped = false;
        });
        wrap.addEventListener('pointermove', function (e) {
          if (!drag || e.pointerId !== drag.id) return;
          var dx = e.clientX - drag.x;
          if (!swiped && Math.abs(dx) > 6) { swiped = true; try { wrap.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } }
          if (swiped) { pos = drag.pos - Math.max(-1, Math.min(1, dx / drag.step)); layout(); }
        });
        function release(e) {
          if (!drag || e.pointerId !== drag.id) return;
          var d = drag; drag = null;
          if (!swiped) return;
          var dx = e.clientX - d.x, fast = Math.abs(dx) / Math.max(1, performance.now() - d.t) > 0.5;
          var base = Math.round(d.pos), to = Math.round(pos);
          if (to === base && (fast || Math.abs(dx) > 40)) to += dx < 0 ? 1 : -1;
          settle(Math.max(base - 1, Math.min(base + 1, to))); // one plate per swipe, however hard the flick
        }
        wrap.addEventListener('pointerup', release);
        wrap.addEventListener('pointercancel', release);
        wrap.addEventListener('click', function (e) {
          var b = e.target.closest('.plate'); if (!b) return;
          if (swiped) { swiped = false; return; }
          var i = +b.getAttribute('data-i'), rel = Math.round(relOf(i));
          if (rel === 0) open(); else move(rel);
        });
        wrap.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') { move(1); plates[((Math.round(pos) % N) + N) % N].focus(); }
          if (e.key === 'ArrowLeft') { move(-1); plates[((Math.round(pos) % N) + N) % N].focus(); }
        });
        var onResize = function () { layout(); };
        window.addEventListener('resize', onResize);
        requestAnimationFrame(layout);
        setFeeling(true);
        firstT = setTimeout(showHint, 700);
        return function () { window.removeEventListener('resize', onResize); cancelAnimationFrame(anim); clearTimeout(hintT); clearTimeout(firstT); clearTimeout(feelT); };
      }
    };
  }

  /* ================================================================ 2 · PATH */
  function mirrorRow(m) {
    if (!m.audio) {
      return '<li><div class="mirror-row soon"><span class="num">' + pad2(m.n) + '</span>' +
        '<span class="body"><span class="t">' + esc(m.title || 'New Mirror') + '</span><span class="meta">' + I.lock + 'Coming soon</span></span>' +
        '<span class="play-ring">' + I.lock + '</span></div></li>';
    }
    var heard = unlocked() && S.heard[m.n];
    var p = pathBy(m.path);
    var meta = heard ? '<span class="meta gold">' + I.check + 'Heard</span>'
      : '<span class="meta">' + I.phones + mins(m.duration) + ' · ' + (unlocked() ? esc(p.name) : 'best with sound') + '</span>';
    return '<li><button type="button" class="mirror-row" data-action="play-mirror" data-n="' + m.n + '">' +
      '<span class="num">' + pad2(m.n) + '</span>' +
      '<span class="body"><span class="t">' + esc(m.title) + '</span>' + meta + '</span>' +
      '<span class="play-ring' + (heard ? ' heard' : '') + '">' + (heard ? I.check : I.play) + '</span></button></li>';
  }

  function pathScreen(key) {
    var p = pathBy(key);
    if (!p) { go('#/'); return null; }
    var mine = MIRRORS.filter(function (m) { return m.path === key; });
    var ready = mine.filter(function (m) { return m.audio; });
    var soon = mine.length - ready.length;
    var html =
      '<section class="screen path">' +
        '<div class="topbar"><a class="icon-btn" href="#/" aria-label="Back to paths">' + I.back + '</a><p class="wordmark">THE POCKET MIRROR</p><span style="width:34px"></span></div>' +
        '<h1 class="sr-only">' + esc(p.name) + '</h1>' +
        '<div class="reflect ' + p.key + '" aria-hidden="true"><p>' + esc(p.name) + '</p><p>' + esc(p.name) + '</p></div>' +
        '<p class="quote">“' + esc(p.line) + '”</p>' +
        '<p class="section-label">WHICH ONE IS YOU?</p>' +
        '<ul class="mirror-list" data-list>' + mine.map(mirrorRow).join('') + '</ul>' +
        '<button type="button" class="link" data-all>See all ' + CONFIG.totalMirrors + ' Mirrors</button>' +
      '</section>';
    return {
      html: html,
      mount: function () {
        S.lastPath = key; persist();
        track('path_view', { path: key });
        var all = false;
        var btn = app.querySelector('[data-all]');
        btn.addEventListener('click', function () {
          all = !all;
          var list = all ? MIRRORS.filter(function (m) { return m.audio; }).concat(MIRRORS.filter(function (m) { return !m.audio; })) : mine;
          app.querySelector('[data-list]').innerHTML = list.map(mirrorRow).join('');
          btn.textContent = all ? 'Show ' + p.name + ' only' : 'See all ' + CONFIG.totalMirrors + ' Mirrors';
          if (all) track('see_all_mirrors', { path: key });
        });
      }
    };
  }

  /* ================================================================ 3 · MIRROR PLAYER + GATE */
  function mirrorScreen(n) {
    var m = mirrorBy(n);
    if (!m || !m.audio) { go('#/'); return null; }
    var p = pathBy(m.path);
    load('mirror', m.n);
    var locked = !unlocked();
    var f = CONFIG.previewSeconds / (m.duration || 60);
    var markX = 125 + 115 * Math.cos(2 * Math.PI * f), markY = 125 + 115 * Math.sin(2 * Math.PI * f);
    var others = Math.max(0, AVAILABLE.length - 1);

    var html =
      '<section class="screen player" data-player data-kind="mirror" data-n="' + m.n + '">' +
        '<div class="topbar"><a class="icon-btn" href="' + (locked ? '#/path/' + m.path : '#/home') + '" aria-label="Back">' + I.down + '</a>' +
          '<p class="eyebrow">MIRROR ' + pad2(m.n) + ' · ' + esc(p.name) + '</p></div>' +
        '<h1>' + esc(m.title) + '</h1>' +
        '<div class="ring-wrap">' +
          '<svg class="ring" viewBox="0 0 250 250" aria-hidden="true"><circle class="track" cx="125" cy="125" r="115"/>' +
            '<circle class="prog" data-ring cx="125" cy="125" r="115" stroke-dasharray="' + CIRC.toFixed(2) + '" stroke-dashoffset="' + CIRC.toFixed(2) + '"/>' +
            (locked ? '<circle class="mark" cx="' + markX.toFixed(1) + '" cy="' + markY.toFixed(1) + '" r="4"/>' : '') + '</svg>' +
          '<button type="button" class="big-play" data-toggle data-action="toggle" data-kind="mirror" data-n="' + m.n + '" aria-label="Play">' + PLAYPAUSE + '</button>' +
        '</div>' +
        '<p class="time" data-time>0:00 / ' + fmt(m.duration) + '</p>' +
        ((CAPTIONS[m.n] || []).length ? '<p class="caption" data-caption aria-hidden="true"></p>' : '') +
        '<div class="spacer"></div>' +
        '<p class="sound-hint" data-hint>' + I.phones + 'Best with sound</p>' +
      '</section>' +
      // unlock sheet (outside .screen so position:fixed works)
      '<div class="dim" id="dim" data-action="close-gate"></div>' +
      '<section class="sheet" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" inert>' +
        '<div class="host"><img src="' + HOST.photo + '" alt="' + esc(HOST.name) + '"><span><b>' + esc(HOST.name) + '</b><small>' + esc(HOST.company) + '</small></span></div>' +
        '<h2 id="gate-title">HEAR THE REST.</h2>' +
        '<ul class="unlock-list">' +
          '<li>' + I.lock + '<span class="grow">The rest of this Mirror</span><small data-remaining></small></li>' +
          '<li>' + I.lock + '<span class="grow">Your nudge card</span><span class="mini-card ' + p.deck + '" aria-hidden="true"></span></li>' +
          '<li>' + I.lock + '<span class="grow">' + (others ? others + ' more ' + (others === 1 ? 'Mirror' : 'Mirrors') + ' + ' : '') + EPISODES.length + ' podcast episodes</span></li>' +
        '</ul>' +
        '<form data-gate-form novalidate>' +
          '<div class="email-row"><label class="sr-only" for="email">Your email</label>' +
            '<input id="email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="Your email" required>' +
            '<button type="submit" aria-label="Unlock">' + I.arrow + '</button></div>' +
          '<p class="form-error" data-error role="alert"></p>' +
        '</form>' +
        '<p class="fine">' + esc(CONFIG.finePrint) + '</p>' +
        '<a class="link" href="#/path/' + m.path + '" data-action="not-now">Not now, try another Mirror</a>' +
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
        var onKey = function (e) { if (e.key === 'Escape' && gateOpen) closeGate(); };
        document.addEventListener('keydown', onKey);
        if (atPreviewLimit() || (DEMO_STATE === 'gate' && !unlocked())) openGate();
        return function () { document.removeEventListener('keydown', onKey); stopCaptions(); };
      }
    };
  }

  /* ================================================================ captions: words light up as Kevin says them */
  function captions(m) {
    var el = app.querySelector('[data-caption]'), lines = CAPTIONS[m.n] || [];
    if (!el || !lines.length) return function () {};
    var cur = -1, spans = [], times = [], raf = 0;
    function lineAt(t) {
      var idx = 0;
      for (var i = 0; i < lines.length; i++) if (t >= lines[i][0] - 0.08) idx = i;
      return idx;
    }
    function show(i) {
      cur = i;
      var L = lines[i], words = L[2].split(' ');
      var weights = words.map(function (w) { return w.length + 2; });
      var total = weights.reduce(function (a, b) { return a + b; }, 0), acc = 0;
      times = words.map(function (w, k) {
        var a = L[0] + (L[1] - L[0]) * acc / total; acc += weights[k];
        return [a, L[0] + (L[1] - L[0]) * acc / total];
      });
      el.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
      spans = [].slice.call(el.children);
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

  /* ================================================================ the collection (21 NUDGES tab) */
  // One deck as a 3-across grid: collected cards face up, the rest face down saying how to unlock them.
  function collectionHTML(deck) {
    return '<ul class="collection">' + nudgesOf(deck).map(function (x) {
      var s = sourceOf(x.id);
      if (isCollected(x.id)) {
        return '<li><button type="button" class="slot got" data-action="view-card" data-id="' + x.id + '" aria-label="' + esc(x.text) + '">' +
            '<img src="' + cardSrc(x.id, deck) + '" alt="" loading="lazy" draggable="false"></button>' +
          '<span class="cap">' + I.check + sourceName(s) + '</span></li>';
      }
      var soon = !s || !s.item.audio;
      var how = !s ? '' : soon ? sourceName(s) + ' · COMING SOON' : 'LISTEN TO ' + sourceName(s);
      var act = soon ? 'soon-card' : s.kind === 'mirror' ? 'play-mirror' : 'play-episode';
      return '<li><button type="button" class="slot locked' + (soon ? ' soon' : '') + '" data-action="' + act + '"' + (s ? ' data-n="' + s.n + '"' : '') + ' aria-label="Locked card. ' + esc(how) + '">' +
          '<img src="' + CARD_BACK + '" alt="" loading="lazy" draggable="false">' +
          (s ? '<span class="how"><small>' + (soon ? 'Coming soon' : 'Listen to') + '</small><b>' + sourceName(s) + '</b></span>' : '') +
        '</button><span class="cap"></span></li>';
    }).join('') + '</ul>';
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
          '<div class="ns-copy"><p class="eyebrow gold">IT’S YOU</p><h2 id="ns-title">MAKE IT YOUR LOCK SCREEN</h2>' +
            '<p class="ns-sub">See it every time you pick up your phone.</p></div>' +
        '</div>' +
        '<button type="button" class="btn-gold" data-action="ns-save">' + I.download + '<span>SAVE TO MY PHONE</span></button>' +
        '<p class="ns-after" data-ns-after hidden>Saved. In Photos, tap Share, then <b>Use as Wallpaper</b>.</p>' +
        (withM21 && M21 ? '<a class="ns-m21" data-ns-m21 hidden href="#/mirror21">' + esc((M21.cards || {}).afterNudge || 'Want Kevin with you for 21 days?') + ' <b>MIRROR 21 ' + I.arrow + '</b></a>' : '') +
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
    var count = collectedCount(), total = NUDGES.length;
    var segs = '';
    for (var i = 0; i < total; i++) segs += '<span' + (i < count ? ' class="on' + (i === count - 1 ? ' new' : '') + '"' : '') + '></span>';
    // after a Mirror: into the app. After an episode: you are already in, so to the collection.
    var next = kind === 'mirror'
      ? '<a class="pill wide" href="#/home"><span>ENTER THE POCKET MIRROR</span><span class="dot">' + I.arrow + '</span></a>'
      : '<a class="pill wide" href="#/home/nudges" data-action="see-deck" data-deck="' + x.deck + '"><span>SEE MY COLLECTION</span><span class="dot">' + I.arrow + '</span></a>';
    var html =
      '<section class="screen reward">' +
        '<p class="eyebrow">' + (kind === 'mirror' ? 'MIRROR ' : 'EPISODE ') + pad2(item.n) + ' · COMPLETE</p>' +
        '<h1>' + (count === 1 ? 'FIRST' : 'NEW') + ' CARD<br>UNLOCKED.</h1>' +
        '<div class="reward-stage">' +
          '<div class="reward-card">' +
            '<div class="rc-inner">' +
              '<img class="rc-face rc-front" src="' + cardSrc(x.id, x.deck) + '" alt="' + esc(x.text) + '">' +
              '<img class="rc-face rc-back" src="' + CARD_BACK + '" alt="">' +
            '</div>' +
            '<span class="rc-sheen" aria-hidden="true"></span>' +
          '</div>' +
        '</div>' +
        '<p class="collected">' + count + ' OF ' + total + ' COLLECTED</p>' +
        '<div class="segs" role="progressbar" aria-label="Cards collected" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + count + '">' + segs + '</div>' +
        '<div class="spacer"></div>' +
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
    return '<nav class="tabbar" aria-label="The Pocket Mirror">' + t('mirrors', 'MIRRORS', I.tabMirrors) + t('nudges', 'NUDGES', I.tabNudges) + t('podcast', 'PODCAST', I.tabPodcast) + '</nav>';
  }
  function miniPlayer() {
    if (!now || now.kind !== 'episode') return '';
    var e = episodeBy(now.n);
    return '<div class="mini"><a href="#/episode/' + e.n + '" style="display:contents"><img src="' + e.cover + '" alt="">' +
      '<span class="body"><small>EPISODE ' + pad2(e.n) + '</small><b>' + esc(e.title) + '</b></span></a>' +
      '<button type="button" class="play-ring" data-toggle data-action="toggle" data-kind="episode" data-n="' + e.n + '" aria-label="Play">' + PLAYPAUSE + '</button></div>';
  }
  function homeTop() {
    return '<div class="home-top"><p class="wordmark">THE POCKET<br>MIRROR</p>' +
      (M21 ? '<a class="m21-btn" href="#/mirror21" data-action="m21-open" data-from="top" aria-label="Mirror 21, the 21-day training">MIRROR<span class="g">21</span></a>' : '') + '</div>';
  }
  function allMirrorsHeard() { return AVAILABLE.length > 0 && AVAILABLE.every(function (m) { return S.heard[m.n]; }); }

  function homeScreen(tab) {
    if (!unlocked()) { go('#/'); return null; }
    tab = tab || 'mirrors';
    var mini = miniPlayer();
    var body = '', mount = null, extra = '';

    if (tab === 'mirrors') {
      var heard = Object.keys(S.heard).filter(function (k) { return S.heard[k]; }).length;
      body =
        homeTop() +
        markTitle(TITLES.mirrors || ['12', 'MIRRORS'], '12 Mirrors') +
        '<div class="progress"><span>' + heard + ' OF ' + CONFIG.totalMirrors + ' HEARD</span><span class="bar" role="progressbar" aria-label="Mirrors heard" aria-valuemin="0" aria-valuemax="' + CONFIG.totalMirrors + '" aria-valuenow="' + heard + '"><span style="width:' + (100 * heard / CONFIG.totalMirrors).toFixed(1) + '%"></span></span></div>' +
        a2hsCardHTML() +
        (allMirrorsHeard() && M21 ? m21Card(((M21.cards || {}).allMirrors || [])[0], ((M21.cards || {}).allMirrors || [])[1]) : '') +
        '<ul class="mirror-list">' + MIRRORS.map(mirrorRow).join('') + '</ul>' +
        (DEMO ? '<button type="button" class="link demo-reset" data-action="start-over">Start over (demo)</button>' : '');
      extra = a2hsSheetHTML();
      mount = function () { if (app.querySelector('[data-a2hs]')) track('a2hs_card_view', { mode: a2hsMode() }); };
    }

    if (tab === 'nudges') {
      var deckKey = S.deck || S.lastPath || 'change';
      var got = collectedCount(), total = NUDGES.length;
      body =
        homeTop() +
        markTitle(TITLES.nudges || [String(total), 'NUDGES'], total + ' Nudges') +
        '<div class="progress"><span>' + got + ' OF ' + total + ' COLLECTED</span><span class="bar" role="progressbar" aria-label="Cards collected" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + got + '"><span style="width:' + (100 * got / total).toFixed(1) + '%"></span></span></div>' +
        '<div class="deck-switch" role="group" aria-label="Choose a deck">' + PATHS.map(function (p) {
          return '<button type="button" data-deck-key="' + p.key + '" aria-pressed="' + (p.key === deckKey) + '"><img src="' + p.plate + '" alt="">' + esc(p.deckName || p.name) +
            '<small>' + collectedCount(p.deck) + '/' + nudgesOf(p.deck).length + '</small></button>';
        }).join('') + '</div>' +
        '<div data-collection></div>';
      extra = viewerHTML() + nudgeSheetHTML(true);
      mount = function () {
        track('nudges_view', { collected: got });
        var wrap = app.querySelector('[data-collection]');
        // each deck shows its 7 cards in the order they are listed in content.js
        function build(key) { wrap.innerHTML = collectionHTML(pathBy(key).deck); }
        app.querySelector('.deck-switch').addEventListener('click', function (e) {
          var b = e.target.closest('[data-deck-key]'); if (!b) return;
          S.deck = b.getAttribute('data-deck-key'); persist();
          app.querySelectorAll('[data-deck-key]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          build(S.deck);
          track('deck_switch', { deck: S.deck });
        });
        build(deckKey);
      };
    }

    if (tab === 'podcast') {
      var upNext = nextEpisode();
      body =
        homeTop() +
        markTitle(TITLES.podcast || ['12', 'EPISODES'], PODCAST.name + ' podcast') +
        '<ul class="episode-list">' + PODCAST.episodes.map(function (e) {
          if (!e.audio) {
            return '<li><div class="episode-row soon"><span class="ph"></span><span class="body"><small>EPISODE ' + pad2(e.n) + '</small><b>Coming soon</b></span></div></li>';
          }
          if (!episodeOpen(e)) {
            return '<li><button type="button" class="episode-row locked" data-action="locked-episode" data-n="' + e.n + '">' +
              '<span class="thumb"><img src="' + e.cover + '" alt="" loading="lazy"><span class="lock">' + I.lock + '</span></span>' +
              '<span class="body"><small>EPISODE ' + pad2(e.n) + ' · LOCKED</small><b>' + esc(e.title) + '</b><span class="meta">' + esc(lockHint(e)) + '</span></span></button></li>';
          }
          var tag = S.eps[e.n] ? ' · HEARD' : (upNext && upNext.n === e.n ? ' · UP NEXT' : '');
          return '<li><button type="button" class="episode-row' + (tag === ' · UP NEXT' ? ' next' : '') + '" data-ep-row="' + e.n + '" data-action="play-episode" data-n="' + e.n + '">' +
            '<span class="thumb"><img src="' + e.cover + '" alt="" loading="lazy"></span><span class="body"><small>EPISODE ' + pad2(e.n) + tag + '</small><b>' + esc(e.title) + '</b><span class="meta">' + mins(e.duration) + '</span></span></button></li>';
        }).join('') + '</ul>';
      mount = function () { track('podcast_view'); };
    }

    return {
      html: '<section class="screen home' + (mini ? ' has-mini' : '') + '">' + body + '</section>' + mini + tabbar(tab) + extra,
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
    var html =
      '<section class="screen player" data-player data-kind="episode" data-n="' + e.n + '">' +
        '<div class="topbar"><a class="icon-btn" href="#/home/podcast" aria-label="Back to the podcast">' + I.down + '</a>' +
          '<p class="eyebrow">' + esc(PODCAST.name) + ' · EPISODE ' + pad2(e.n) + '</p></div>' +
        '<div class="cover"><img src="' + e.cover + '" alt="The Mirror, episode ' + e.n + ': ' + esc(e.title) + '"></div>' +
        '<h1>' + esc(e.title) + '</h1>' +
        '<div class="scrub"><label class="sr-only" for="scrub">Position</label><input id="scrub" type="range" min="0" max="1000" step="1" value="0" data-scrub>' +
          '<div class="times"><span data-time>0:00</span><span data-left>−' + fmt(e.duration) + '</span></div></div>' +
        '<div class="transport">' +
          '<button type="button" class="skip" data-action="skip" data-by="-15" aria-label="Back 15 seconds">' + I.back15 + '</button>' +
          '<button type="button" class="big-play" data-toggle data-action="toggle" data-kind="episode" data-n="' + e.n + '" aria-label="Play">' + PLAYPAUSE + '</button>' +
          '<button type="button" class="skip" data-action="skip" data-by="15" aria-label="Forward 15 seconds">' + I.fwd15 + '</button>' +
        '</div>' +
        (M21 ? '<div class="m21-end" data-m21-end hidden>' + m21Card(((M21.cards || {}).episodeEnd || [])[0] || 'READY FOR MORE?', ((M21.cards || {}).episodeEnd || [])[1], 'compact') + '</div>' : '') +
      '</section>';
    return {
      html: html,
      mount: function () {
        track('episode_view', { episode: e.n });
        var range = app.querySelector('[data-scrub]');
        range.addEventListener('input', function () {
          var d = (isFinite(audio.duration) && audio.duration) || e.duration;
          audio.currentTime = d * range.value / 1000;
        });
      }
    };
  }

  /* ================================================================ 7 · MIRROR 21 (white) */
  function mirror21Screen() {
    if (!M21) { go('#/home'); return null; }
    var heardList = Object.keys(S.heard).filter(function (k) { return S.heard[k]; }).map(Number);
    var m = mirrorBy(S.lastMirror) || mirrorBy(heardList[heardList.length - 1]) || MIRRORS[0];
    var after = m.after || 'I did it.';
    // Display XL for short lines, Tab title for longer ones (the vw cap below keeps it on one screen width)
    var size = after.length <= 14 ? 56 : 48;
    var back = unlocked() ? '#/home' : '#/';
    var tick = I.check;
    var weekNames = [['SEE IT', ''], ['OWN IT', ''], ['CHANGE IT', ' gold']];
    var html =
      '<div class="m21w-fade" aria-hidden="true"></div>' +
      '<section class="screen m21w">' +
        '<div class="hero" aria-hidden="true"><img src="' + esc(M21.photo || HOST.photo) + '" alt=""></div>' +
        '<div class="top"><a class="back" href="' + back + '" aria-label="Back">' + I.back + '</a><p class="wm">THE POCKET MIRROR</p><span style="width:40px"></span></div>' +
        '<div class="head">' +
          '<h1 class="brand">MIRROR <span class="g">21</span></h1>' +
          '<p class="lbl">YOU SAID</p>' +
          '<p class="said">“' + esc(m.title) + '”</p>' +
          '<p class="in">IN 21 DAYS</p>' +
          '<p class="after' + (after.length <= 10 ? ' one-line' : '') + '" style="font-size:min(' + size + 'px, ' + (size / 4).toFixed(2) + 'vw)"><span class="q">“</span>' + esc(after) + '<span class="q">”</span></p>' +
          '<p class="lede">' + esc(M21.tagline) + '</p>' +
        '</div>' +
        '<div class="price"><div class="l"><small>MIRROR <span class="g">21</span></small><strong class="g">' + esc(M21.price) + '</strong></div><ul>' +
          (M21.priceLines || []).map(function (t) { return '<li>' + tick + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul></div>' +
        '<div class="blk"><p class="sec">WHAT’S IN IT FOR YOU</p><ul class="ben">' +
          (M21.benefits || []).map(function (b, i) { return '<li><span class="n">' + pad2(i + 1) + '</span><span><b>' + esc(b[0]) + '</b><span class="t">' + esc(b[1]) + '</span></span></li>'; }).join('') +
        '</ul></div>' +
        '<div class="blk"><p class="sec">YOUR 21 DAYS</p><div class="weeks">' + weekNames.map(function (w, wi) {
          return '<div class="wk"><span class="lab"><b>WEEK ' + (wi + 1) + '</b><i class="' + w[1] + '">' + w[0] + '</i></span>' +
            '<span class="say">' + esc((M21.weeks || [])[wi] || '') + '</span></div>';
        }).join('') + '</div></div>' +
        '<div class="blk"><p class="sec">EVERY DAY · ABOUT 3 MINUTES</p><div class="daily">' +
          (M21.daily || []).map(function (d, i) { return '<div>' + [I.phones, I.target, I.checkCircle][i] + '<b>' + esc(d[0]) + '</b><span>' + esc(d[1]) + '</span></div>'; }).join('') +
        '</div></div>' +
      '</section>' +
      '<div class="m21w-cta"><a class="btn" data-action="m21-go" href="' + esc(M21.url || '#') + '"' + (M21.url ? ' target="_blank" rel="noopener"' : '') + '>START MIRROR 21 · ' + esc(M21.price) + '</a>' +
        '<small>' + esc(M21.finePrint) + '</small></div>';
    return {
      html: html,
      mount: function () {
        track('m21_view', { mirror: m.n });
        var root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
        root.classList.add('is-light'); if (meta) meta.setAttribute('content', '#ffffff');
        return function () { root.classList.remove('is-light'); if (meta) meta.setAttribute('content', '#0a0a0a'); };
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
      S.lastMirror = n;
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
    'see-deck': function (el) {
      var p = PATHS.filter(function (x) { return x.deck === el.getAttribute('data-deck'); })[0];
      if (p) { S.deck = p.key; persist(); }
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
      S.email = ''; S.heard = {}; S.eps = {}; S.saved = {}; S.pending = []; S.deck = ''; S.lastPath = ''; S.joinedAt = 0; S.lastMirror = 0; S.a2hsDone = false;
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
