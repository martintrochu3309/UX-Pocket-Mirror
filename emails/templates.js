/*
 * THE POCKET MIRROR · the reminder emails
 * ---------------------------------------------------------------
 * The 6 emails: their subject, preview line, text and button, and the HTML that is sent.
 * One file, used by emails/preview.html (to look at them) and, later, by the daily sender in Supabase.
 *
 * White background, black text. Logos are images (look the same everywhere). Titles use Magistral and text
 * Neue Haas Display where the mail app allows custom fonts (Apple Mail / iPhone); Gmail and Outlook show
 * Helvetica / Arial instead.
 *
 * Numbers in {braces} are filled in per person:
 *   {mirrors} Mirrors heard · {episodes} episodes heard · {cards} cards collected · {left} Mirrors not heard yet
 *   {stats}   "5 Mirrors. 2 episodes. 9 of 21 cards." (anything at zero is left out)
 */
(function (root) {
  'use strict';

  var SITE = 'https://thepocketmirror.com';

  var EMAILS = [
    {
      id: 'welcome', n: 1, name: 'Welcome',
      when: 'Right after they give their email. Once.',
      subject: 'You did something most people don’t.',
      preview: 'One minute with yourself. That’s how it starts.',
      lines: [
        'You stopped for a minute and looked at yourself. Most people never do.',
        'All 12 Mirrors are open now. One minute each.',
        '<i>Knowing what to do doesn’t create change. Doing it does.</i>'
      ],
      button: 'OPEN {PM}', link: '/#/home/mirrors',
      signoff: 'I’m here when you’re ready.'
    },
    {
      id: 'started', n: 2, name: 'Most people stop at one',
      when: 'Heard 2–3 Mirrors, then quiet.',
      subject: 'Most people stop at one.',
      preview: 'You didn’t. {mirrors} Mirrors in.',
      lines: [
        'You’ve listened to {mirrors} Mirrors. Most people stop at one.',
        'That tells me something about you.',
        'Somewhere in the other {left} is the one that moves something. Yours is still waiting.'
      ],
      button: 'FIND MY MIRROR', link: '/#/home/mirrors'
    },
    {
      id: 'further', n: 3, name: 'You’re further than you think',
      when: 'Heard 4–5 Mirrors, or some episodes, then quiet.',
      subject: 'You’re further than you think.',
      preview: '{stats}',
      lines: [
        '<b>{stats}</b>',
        'That’s not luck. That’s you showing up.',
        'Anyone can start. Few finish. You’re closer to the few than you think.',
        'What if we pushed a little further, together?'
      ],
      button: 'PICK UP WHERE I LEFT OFF', link: '/#/home/mirrors'
    },
    {
      id: 'week', n: 4, name: 'One minute. Whenever you’re ready.',
      when: 'Away a week, when nothing else applies.',
      subject: 'One minute. Whenever you’re ready.',
      preview: 'It’s been a week. I’m here.',
      lines: [
        'It’s been a week since your last minute with yourself.',
        'No catching up. No pressure. Your Mirrors are right where you left them.',
        'Whenever you’re ready, I’m here.'
      ],
      button: 'BACK TO MY MIRRORS', link: '/#/home/mirrors',
      signoff: 'Take this with you.'
    },
    {
      id: 'few', n: 5, name: 'You’re one of the very few',
      when: 'Heard 6 or more Mirrors. Once.',
      subject: 'You’re one of the very few.',
      preview: '{mirrors} Mirrors in. MIRROR 21 is one step away.',
      lines: [
        '<b>{stats}</b>',
        'You’ve done what most people never do. You’re one of the very few willing to look in the Mirror, and take the extra step.',
        '{M21} is one step away. 21 steps. One change. Me with you every step.',
        'I think you’d be the perfect fit.'
      ],
      button: 'SEE {M21}', link: '/#/mirror21'
    },
    {
      id: 'thinking', n: 6, name: 'Still thinking about it?',
      when: 'Looked at MIRROR 21, didn’t follow through. Once.',
      subject: 'Still thinking about it?',
      preview: 'No rush. 21 steps, at your pace.',
      lines: [
        'You had a look at {M21}. That tells me part of you is ready.',
        '21 steps. One at a time. At your pace. I’m with you until one change sticks.',
        '<i>You don’t have to leap. You just have to move.</i>'
      ],
      button: 'LET’S FOLLOW THROUGH', link: '/#/mirror21',
      signoff: 'Whenever you’re ready, it’s here.'
    }
  ];

  var FOOTER = { line: 'The Pocket Mirror · Daily Xcellence', leave: 'Leave anytime' };

  /* ---------- filling in the numbers ---------- */
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function stats(v) {
    var parts = [];
    if (v.mirrors) parts.push(plural(v.mirrors, 'Mirror', 'Mirrors') + '.');
    if (v.episodes) parts.push(plural(v.episodes, 'episode', 'episodes') + '.');
    if (v.cards) parts.push(v.cards + ' of 21 cards.');
    return parts.join(' ');
  }
  function fill(text, v, html) {
    var m21 = html
      ? '<span style="font-family:Magistral,\'Arial Black\',Arial,sans-serif;font-style:italic;font-weight:700;white-space:nowrap;">MIRROR <span style="color:#c9a227;">21</span></span>'
      : 'MIRROR 21';
    return String(text)
      .replace(/\{stats\}/g, stats(v))
      .replace(/\{mirrors\}/g, v.mirrors || 0)
      .replace(/\{episodes\}/g, v.episodes || 0)
      .replace(/\{cards\}/g, v.cards || 0)
      .replace(/\{left\}/g, Math.max(0, 12 - (v.mirrors || 0)))
      .replace(/\{M21\}/g, m21)
      .replace(/\{PM\}/g, 'POCKET MIRROR');   // in the HTML button, render() puts the white logo here instead
  }
  function plain(s) { return String(s).replace(/<[^>]+>/g, ''); }

  /* ---------- the HTML that is sent ----------
   * opts.base = where the fonts and logos are (default https://thepocketmirror.com)
   * opts.url  = the button's link (default the site + the email's page)
   * opts.unsubscribe = the "Leave anytime" link
   */
  function render(id, v, opts) {
    var e = EMAILS.filter(function (x) { return x.id === id; })[0];
    if (!e) throw new Error('No email called ' + id);
    v = v || {}; opts = opts || {};
    var base = opts.base || SITE;
    var url = opts.url || SITE + e.link;
    var unsub = opts.unsubscribe || SITE + '/unsubscribe';
    var display = 'Magistral,\'Arial Black\',Arial,sans-serif';
    var text = '\'Neue Haas Display\',\'Helvetica Neue\',Helvetica,Arial,sans-serif';

    var title = plain(fill(e.subject, v, false)).toUpperCase().replace(/ (\S+)$/, '&nbsp;$1');   // no single word alone on the last line
    var body = e.lines.map(function (l) {
      return '<p style="margin:0 0 18px;font-family:' + text + ';font-size:17px;line-height:1.5;color:#111111;">' + fill(l, v, true) + '</p>';
    }).join('');

    return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">' +
      '<title>' + plain(fill(e.subject, v, false)) + '</title>' +
      '<style>' +
        '@font-face{font-family:"Magistral";src:url("' + base + '/assets/fonts/magistral-bold-italic.woff2") format("woff2");font-weight:700;font-style:italic;}' +
        '@font-face{font-family:"Neue Haas Display";src:url("' + base + '/assets/fonts/nhd-medium.woff2") format("woff2");font-weight:500;}' +
        '@font-face{font-family:"Neue Haas Display";src:url("' + base + '/assets/fonts/nhd-bold.woff2") format("woff2");font-weight:700;}' +
        'body{margin:0;padding:0;background:#f3f3f1;} a{color:#111111;}' +
        '@media (max-width:480px){.pm-card{padding:32px 22px !important;} .pm-title{font-size:26px !important;}}' +
      '</style></head>' +
      '<body style="margin:0;padding:0;background:#f3f3f1;">' +
      // the preview line inbox apps show next to the subject (hidden in the email itself)
      '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' + plain(fill(e.preview, v, false)) + '&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f3f1;"><tr><td align="center" style="padding:28px 12px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">' +
          // logo
          '<tr><td align="center" style="padding:6px 0 22px;"><img src="' + base + '/assets/email/pocket-mirror-logo.png" width="200" alt="POCKET MIRROR" style="display:block;width:200px;height:auto;border:0;"></td></tr>' +
          // card
          '<tr><td class="pm-card" style="background:#ffffff;border-radius:22px;padding:40px 36px;text-align:center;">' +
            '<h1 class="pm-title" style="margin:0 0 24px;font-family:' + display + ';font-style:italic;font-weight:700;font-size:30px;line-height:1.05;letter-spacing:-0.5px;color:#111111;">' + title + '</h1>' +
            body +
            // button
            '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:10px auto 26px;"><tr>' +
              '<td align="center" bgcolor="#111111" style="border-radius:999px;">' +
                '<a href="' + url + '" style="display:inline-block;padding:17px 30px;font-family:' + text + ';font-size:13px;font-weight:700;letter-spacing:2px;line-height:16px;color:#ffffff;text-decoration:none;border-radius:999px;">' +
                fill(e.button.replace('{PM}', '<img src="' + base + '/assets/email/pocket-mirror-logo-white.png" width="150" height="13" alt="POCKET MIRROR" ' +
                  'style="display:inline-block;width:150px;height:auto;border:0;vertical-align:-1px;margin-left:4px;">'), v, true).replace('color:#c9a227', 'color:#e0b84c') + '</a>' +
              '</td></tr></table>' +
            (e.signoff ? '<p style="margin:0 0 6px;font-family:' + text + ';font-size:16px;line-height:1.5;color:#555555;">' + e.signoff + '</p>' : '') +
            '<p style="margin:0;font-family:' + display + ';font-style:italic;font-weight:700;font-size:22px;color:#111111;">Kevin Craggs</p>' +
          '</td></tr>' +
          // footer
          '<tr><td align="center" style="padding:26px 10px 8px;">' +
            '<img src="' + base + '/assets/email/daily-xcellence-logo.png" width="96" alt="DAILY XCELLENCE" style="display:block;width:96px;height:auto;border:0;margin:0 auto 14px;opacity:.85;">' +
            '<p style="margin:0;font-family:' + text + ';font-size:12px;line-height:1.6;color:#8a8a86;">' + FOOTER.line + '</p>' +
            '<p style="margin:6px 0 0;font-family:' + text + ';font-size:12px;line-height:1.6;color:#8a8a86;"><a href="' + unsub + '" style="color:#8a8a86;text-decoration:underline;">' + FOOTER.leave + '</a></p>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr></table></body></html>';
  }

  /* the plain-text version (sent alongside the HTML; some people read emails as text) */
  function text(id, v, opts) {
    var e = EMAILS.filter(function (x) { return x.id === id; })[0];
    v = v || {}; opts = opts || {};
    return [plain(fill(e.subject, v, false)).toUpperCase(), '']
      .concat(e.lines.map(function (l) { return plain(fill(l, v, false)); }).join('\n\n'), '',
        plain(fill(e.button, v, false)) + ': ' + (opts.url || SITE + e.link), '',
        e.signoff || '', 'Kevin Craggs', '', '—', FOOTER.line,
        FOOTER.leave + ': ' + (opts.unsubscribe || SITE + '/unsubscribe'))
      .join('\n').replace(/\n{3,}/g, '\n\n');
  }

  var api = {
    EMAILS: EMAILS, FOOTER: FOOTER, render: render, text: text,
    subject: function (id, v) { var e = EMAILS.filter(function (x) { return x.id === id; })[0]; return plain(fill(e.subject, v || {}, false)); },
    preview: function (id, v) { var e = EMAILS.filter(function (x) { return x.id === id; })[0]; return plain(fill(e.preview, v || {}, false)); }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.PM_EMAILS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);   // the browser, and Deno (the sender in Supabase)
