# The Pocket Mirror

The funnel: scan a QR code, pick where you are, hear Kevin, give your email, take a nudge with you.
Plain HTML, CSS and JavaScript. No framework, no build step, no backend.

```
pocket-mirror/
├── index.html            the page (also holds the hidden Netlify form)
├── preview.html          every screen side by side, before and after the email
├── css/styles.css        all styles (colours and fonts at the top)
├── js/content.js         ALL the content: settings, paths, Mirrors, nudges, podcast  ← edit this
├── js/app.js             the app logic (screens, audio, email gate, cards)
├── manifest.webmanifest  lets people add the app to their home screen
├── netlify.toml          caching for the assets
├── docs/                 raw speech-to-text of Mirrors 01–05 (the cleaned captions live in content.js)
└── assets/
    ├── fonts/            Magistral + Neue Haas Display (woff2)
    ├── images/           3 path plates, 12 MIRRORS logo (original), Kevin (portrait + cap photo), Daily Xcellence logo, icons, share image
    ├── cards/            the 21 nudges: 7 white (See it), 7 black (Own it), 7 gold (Change it)
    ├── mirrors/          Mirror audios 01–05 (mp3)
    └── podcast/          The Mirror episodes (mp3) + covers (jpg)
```

## The journey

| # | Screen | What happens |
|---|---|---|
| 1 | Landing | "The mirror never changes. You do." The 3 plates orbit an endless circle (SEE IT in the middle, OWN IT right, CHANGE IT left). They follow your finger and keep turning in either direction: the plate leaving one side swings round behind the middle one and comes back in on the other. The middle one glows and its line shows underneath ("Something's off, and I can't name it."). **Tap the plate to open it.** "TAP TO OPEN" appears each time a plate lands in the middle, then fades. |
| 1b | Meet Kevin | **First time only**, tapping FIND MY MIRROR opens Kevin's intro video full screen, in colour, with sound, a black fade over his hands. Playing: just Kevin, a thin progress line and a barely visible SKIP. Tap to pause: **MEET KEVIN** (top left) and the play button (on his chin) come back. At the end: **WATCH AGAIN** or **LET'S BEGIN** (on to "Which one is you?"). The file is `assets/video/meet-kevin.mp4`, a smaller copy of `assets/Pocket Mirror Beginning (1).mp4`; set in `INTRO` in `content.js`. |
| 2 | Which one is you? | The Mirrors for that path, as a list. "See all 12 Mirrors" shows everything. |
| 3 | Kevin's voice | Spotify-like player: Daily Xcellence artwork, the title, a bar you can drag (the free part is lighter before the email), back 15 · play · forward 15, then **Subtitles** and "Best with sound". **Subtitles** opens a full-screen layer: the line just said in grey, the line Kevin is saying with each word turning white as he says it. It stays on for the next Mirror. Plays free until **0:40**, then pauses (dragging or skipping past it does the same). |
| 4 | Unlock | Sheet slides up: Kevin, "HEAR THE REST.", what unlocks, email field. "Not now" goes back to the list. |
| 5 | Unlocked | Audio carries on from 0:40. Toast: "Unlocked · all Mirrors". |
| 6 | Take one with you | 3 nudge cards matched to that Mirror, in the path's colour (See it = white, Own it = black, Change it = gold). "• TAP TO FLIP" shows for 2 seconds each time a card lands in the middle. The back says **IS THIS YOU?** and the 3 lines. Once flipped, "↑ SWIPE UP TO SAVE" shows for 2 seconds. **Swipe the card up** and it flies out of the deck, then the lock-screen sheet rises with **SAVE TO MY PHONE**; when you close it the card drops back with a gold glow and a tick. Tap = flip, sideways = next card, up = keep. |
| 7 | Home | Tabs: **12 MIRRORS** (with progress) · **COLLECT** (all 21 cards in one arc you flick through, white deck then black then gold; AWARENESS · ACCEPTANCE · ACTION light up as you go and jump to a deck; cards you don't have yet show dark and blurred with a lock, and tapping one plays the Mirror or episode that unlocks it; tapping one you have opens "Make it your lock screen") · **12 EPISODES** (The Mirror podcast, opening one at a time; an episode keeps playing if you leave it, with no bar on the tabs). White **MIRROR 21** button top right. After the first full Mirror, a one-time "Keep it on your phone" card. |
| 8 | Mirror 21 | The $39.99 21-day training, the only white screen (see below). |

No tab bar before the email. Returning visitors who already gave their email go straight to Home.

## Podcast: 12 EPISODES

On the **EXPLORE** tab the episodes are cassettes you swipe through: **grey** = heard, **white** = you can listen to it now, **black** = locked. The middle one shows its title, length and **LISTEN NOW**. The episode player uses the same layout as the Mirror player, with the cassette as the artwork.
The cassette pictures are `assets/images/cassettes/ep-01-white.webp` (… `-grey`, `-black`, one set per episode), set by `PODCAST.cassette` in `content.js`. A missing one falls back to the plain cassette of that colour. Still missing: **ep-12-white**.

Episode 1 is open after the email. Each next episode opens when the previous one is finished ("EPISODE 02 UNLOCKED").
Locked episodes show their title, a lock, and "Finish Episode 01 to open". Missing episodes (like 07) are skipped.
Prefer a weekly drip? Set `podcastUnlock: 'weekly'` (one new episode every `podcastEveryDays`, counted from sign-up), or `'all'` to open everything.

## Mirror 21 (the $39.99 training)

Never before the email, so the free part feels like a gift. After the email it is always one tap away:

1. **MIRROR 21 button**, top right of every Home tab (always).
2. **Big card on 12 MIRRORS** once someone has heard every available Mirror: "You've looked in every Mirror. Now live it in 21 steps."
3. **Card at the end of every podcast episode:** "Ready for more?"
4. **Line after saving a nudge** from the 21 NUDGES tab: "Want Kevin with you for 21 steps?"
5. **Milestone pop-ups** on the 21 NUDGES tab (3, 7, 14, 21 cards and each finished deck): `MIRROR21.milestones`.

The MIRROR 21 button and cards are **white**, the only white things in the dark app. They open the **Mirror 21 page**: one white screen that never scrolls, on any phone (the phones picture shrinks on short phones so the rest always fits):

- **MIRROR 21** and a ✕ (back to Home),
- **YOU KNOW. NOW DO.** (`headline`), "21 guided steps to put one change into practice." (`sub`),
- the three phones (`visual`: a web copy of `assets/images/Mirror 21 visuals.png`), a gold rule, the three points (`points`),
- the black **START MIRROR 21** button: Kevin's video (`video`) full screen. At its end (or on SKIP) the **LET'S FOLLOW THROUGH** pop-up (`follow`) rises in the middle, over the paused video, with **FOLLOW THROUGH · $39.99** (the price is `MIRROR21.price`), which opens `MIRROR21.url`. **Not now** closes it and the video, back to the page.

Put your Mirror 21 page or Stripe checkout link in `MIRROR21.url`. Until then FOLLOW THROUGH shows "Link coming soon". The card wording is in `MIRROR21.cards`.
Events: `pm_m21_open` (with where it was tapped), `pm_m21_view`, `pm_m21_click`. People who click are your A list.

## Captions (Mirrors 01–05)

As Kevin speaks, one line shows under the ring and each word turns bold white as he says it (already-said words stay light, upcoming words are grey).
The lines and their timings are in `CAPTIONS` in `content.js`: `[start second, end second, 'line']`.
They come from speech-to-text, cleaned by hand. **7 lines are marked `'CHECK'`** because a word wasn't clear. Please listen and correct:

- Mirror 01 at 0:35: "Look at what's getting in the way."
- Mirror 02 at 0:15: "In the car. In the shower."
- Mirror 02 at 0:19: "In your head."
- Mirror 02 at 0:43: "arrange a time to have it."
- Mirror 03 at 0:15: "And that's hard to admit,"
- Mirror 03 at 0:50: "And before today's over, change it."
- Mirror 05 at 0:23: "you're second-guessing decisions you wouldn't normally think twice about."

New Mirror? Add its lines the same way. A Mirror without captions simply shows none.

## Add to home screen

Never in the funnel. A small "KEEP IT ON YOUR PHONE" card appears once, on Home, after someone has finished their first full Mirror.

- **iPhone:** "SHOW ME HOW" opens two steps: tap Share (in Safari it can sit under •••), then Add to Home Screen.
- **Android:** a real one-tap "ADD TO HOME SCREEN".
- **✕** or "Got it" hides it for good. It never shows if the app is already on the home screen, or inside Instagram / WhatsApp / Facebook (adding isn't possible there).
- The icon opens the app full screen. iPhone gives home-screen apps their own memory, so from the moment the email is given the app keeps `?pm=1` (plus what they've heard) in the address. Whenever they add it (our steps or straight from Safari's Share menu), the home-screen version opens **already unlocked**. Test this on a real iPhone before launch.
- Later (phase 2): notifications like "Episode 3 is unlocked" only work on iPhone once the app is on the home screen.

Test it on a computer with `?demo=unlocked&a2hs=ios#/home` or `&a2hs=android`.

## Demo mode, starting over, and seeing every screen

- **Demo mode is OFF** (`demoMode: false` at the top of `js/content.js`): progress is saved on the phone and emails are sent to Netlify Forms.
  Setting it back to `true` stops saving and sending, makes a refresh start the journey again, and adds a **Start over (demo)** button on Home.
- **Start over:** add `?reset` to the address (e.g. `yoursite.com/?reset`). It wipes the saved email and progress on that phone or computer.
- **Home-screen carry-over:** besides the unlock and what they've heard (so their collected cards too), the address carries the last Mirror played (`l=`), the Mirror 21 pop-ups already seen (`s=`) and the sign-up day (`j=`).

## Email collection (Netlify Forms)

- The hidden `pocket-mirror` form in `index.html` lets Netlify find the form when the site deploys. The app sends each email to it with: `email`, `mirror`, `path`, `source` (the `?src=` tag) and `page`.
- **One-time setup:** Netlify → Site configuration → Forms → **Enable form detection**, then redeploy. Submissions appear under Forms → **pocket-mirror** (download as CSV). Form notifications can email you each sign-up.
- Netlify only stores the emails. Sending the weekly email needs an email tool (Mailchimp, ConvertKit…), connected through Zapier or `webhookUrl` in `js/content.js`.
- It only sends from the live site (not when `index.html` is opened from your computer). If a phone is offline, the email waits on the phone and is sent on the next visit.
- **See every screen at once:** open **`preview.html`**. It shows all 13 screens side by side (the player ones are paused mid-caption) in phone frames, before and after the email, and you can tap inside each one. Nothing there saves or sends anything.

## Try it on your computer

Open the folder in VS Code and use the **Live Server** extension (right-click `index.html` → Open with Live Server).
Or in a terminal inside the folder: `python3 -m http.server 8000`, then open http://localhost:8000.

Double-clicking `index.html` mostly works, but "Save to my phone" needs a server.
To test the unlock again: add `?reset` to the address (or refresh, if demo mode is on).

## Put it live (Netlify)

1. Drag the `pocket-mirror` folder onto https://app.netlify.com/drop (or replace the files of your existing Pocket Mirror site).
2. In Netlify: **Site configuration → Forms → Enable form detection**, then redeploy once.
3. Emails arrive in **Forms → pocket-mirror** with: email, mirror (number), path, source (QR tag), page.
   Add a notification (Forms → Form notifications) or connect Mailchimp / ConvertKit through Zapier.

Not on Netlify? Set `netlifyForms: false` and put a Zapier/Make webhook in `webhookUrl` (both in `js/content.js`).
If a submission fails (offline, wrong host), the email is kept on the phone and sent again on the next visit.

## QR codes and links

| Link | Does |
|---|---|
| `yoursite.com/?src=leeds-oct` | Normal journey; every email from it is tagged `leeds-oct` (one QR per event) |
| `yoursite.com/?m=1` | Opens Mirror 01 directly (for a printed card or a talk about that topic) |
| `yoursite.com/?path=own` | Opens the OWN IT list directly |

They combine: `?m=1&src=leeds-oct`.

## Editing content (`js/content.js`)

- **Preview length:** `previewSeconds: 40`.
- **Add a Mirror:** put the file in `assets/mirrors/mirror-06.mp3`, then fill in Mirror 6: `title`, `audio`, `duration` (seconds) and its 3 `nudges`. Until `audio` is set, it shows as "Coming soon".
- **Move a Mirror to another path:** change its `path` (`see`, `own` or `change`).
- **Nudge backs:** each nudge has 3 `pickIf` lines, shown under "IS THIS YOU?" on the back of the card. These are my drafts; rewrite them freely (the text resizes to fit the card).
- **Podcast:** add Episode 7 by dropping `ep-07.mp3` in `assets/podcast/audio/`, a cover in `assets/podcast/covers/ep-07.jpg`, and filling in its title, audio, cover and duration.
- **Path feelings:** the `line` of each path ("Something's off, and I can't name it.").
- **Small print under the email:** `finePrint`.
- **Big titles:** `TITLES` (`['21', 'NUDGES']` = gold part, white part). They're text, so they stay sharp and are easy to change.

## The journey in Supabase

Every email and every step people take is saved in Supabase, project **Mirro21**, in its own section (schema **`pocket`**, separate from the Mirror 21 course tables). It is set in `CONFIG.supabaseUrl` / `supabaseKey` in `content.js` (the key is the public one: it can only add data, never read it).

- **Before the email**, a phone is anonymous (a random id kept on the phone). When the email is given, everything that phone did is linked to it. The home-screen app keeps the same id, so it is the same journey.
- Nothing is sent in demo mode, from a file opened on your computer, or from `localhost`, so testing doesn't count as real people. Offline phones keep their events and send them on the next visit.
- Netlify Forms still receives each email too, as a safety net.

**The reports** (Supabase → Table Editor → schema `pocket`, or SQL `select * from pocket.funnel;`):

| View | Shows |
|---|---|
| `pocket.funnel` | The whole funnel, top to bottom: opened the app → opened a Mirror → reached 0:40 → gave their email → finished 1 / 3+ / 6+ Mirrors → opened Mirror 21 → started the video → watched it → saw LET'S FOLLOW THROUGH → tapped it → **bought** (matched with `paid_users`) |
| `pocket.status` | Everyone (people and anonymous phones): furthest step reached, Mirrors / episodes / cards, Mirror 21 visits, last thing they did, last Mirror and episode, hours since last active, **inactive 48h+** |
| `pocket.stopped_at` | Where people stopped: how many inactive 48h+ at each furthest step |
| `pocket.heard_before_stopping` | How far people got before stopping: Mirrors heard 0–12 and episodes heard 0–12 |
| `pocket.journey` | One row per email: first Mirror, the order they opened them (03 → 01 → 07), Mirrors and episodes finished, last episode, cards, each Mirror 21 step, bought, last active |
| `pocket.m21_visits` | Every Mirror 21 visit (1st, 2nd, 3rd…): where they tapped from, what they'd heard by then (Mirrors, episodes, cards), started / watched the video, saw / tapped FOLLOW THROUGH, bought after |
| `pocket.m21_by_progress` | Mirror 21 visits, video starts, taps and purchases grouped by how many Mirrors people had heard at the time |
| `pocket.mirrors` | Each Mirror: opened, reached 0:40, finished, and how many people started with it |
| `pocket.mirror_next` | Which Mirror people open next (from → to, most common first) |
| `pocket.podcast` | Each episode: started, finished |
| `pocket.cards` | How many cards people have, and how many people have that many |
| `pocket.daily` | Day by day: active, opened a Mirror, reached 0:40, new emails, Mirrors / episodes finished, cards, Mirror 21 visits, FOLLOW THROUGH taps, purchases |
| `pocket.daily_people` | Day by day: people on the app, of which new and returning, and new emails |
| `pocket.daily_who` | Day by day, **who** was on the app: their email (or "anonymous" before they gave one), new or returning, the link they came from, first and last time seen that day, Mirrors and episodes finished that day, cards, Mirror 21 visits, tapped FOLLOW THROUGH |
| `pocket.daily_by_link` | Day by day and per link / QR code (`?src=…`, "direct" = no tag): people who came in, opened a Mirror, gave their email |
| `pocket.links` | Each link / QR code since the start: people, emails, first and last day |
| `pocket.reminder_candidates` | People who gave their email, inactive 48h+, not unsubscribed, not bought, with a suggested email (almost bought → congratulations → come back to Mirror 07 / Episode 04), the "almost bought" first |

The raw data is in `pocket.people` (one per email), `pocket.devices` (one per phone) and `pocket.events` (one per step, with `props` like `{"mirror": 3}`). `people.unsubscribed_at` is ready for the reminder emails (step two, with Resend).

## The dashboard (`/dashboard`)

**https://thepocketmirror.netlify.app/dashboard/** shows the same reports as charts, live from Supabase each time it opens (or when you tap Refresh).

- **Who can see it:** the emails in `pocket.admins` (today the two of you). Sign in with the email and password of your Supabase account. It is the **same account as the Mirror 21 course**, so changing the password changes it for both. The database checks the email on every call (function `public.pm_dashboard`), so anyone else who signs in sees nothing. To add someone: `insert into pocket.admins (email) values ('name@example.com');`. They need a Supabase account with that email too.
- **Forgot password:** type your email and tap *Forgot password?*. The email link opens the dashboard on a *New password* screen. This needs `https://thepocketmirror.netlify.app/dashboard/` in Supabase → Authentication → URL Configuration → Redirect URLs.
- **Period:** 7 / 30 / 90 days or all time.
- **Tabs:**
  - **Overview:** headline numbers, people day by day, new vs returning, the funnel, where people stop.
  - **Mirrors:** opened / reached 0:40 / finished per Mirror, first Mirror, what comes next, how many Mirrors before stopping.
  - **Podcast & cards:** episodes started and finished, episodes before stopping, cards collected.
  - **Mirror 21:** its funnel, where it is opened from, visits by Mirrors heard, revenue and purchases (live payments only).
  - **Links:** people and emails per link / QR code.
  - **People:** everyone with an email, with search, filters (inactive 48h+, reminder candidates, almost bought, bought) and **Download CSV**.
- **Table view:** every chart has a *Table* button that shows its numbers.
- Search engines are kept out (`noindex` in the page and in `netlify.toml`).

## Measuring the funnel

Every step pushes an event to `window.dataLayer` (Google Tag Manager / GA4 pick these up) and to Plausible if its script is on the page:

`pm_landing_view` → `pm_path_view` → `pm_mirror_play` → `pm_preview_gate` → `pm_email_submit` → `pm_mirror_complete` → `pm_keep_view` → `pm_nudge_flip` → `pm_nudge_keep` → `pm_nudge_save`
plus `pm_a2hs_card_view`, `pm_a2hs_guide`, `pm_a2hs_android`, `pm_a2hs_dismiss`, `pm_nudge_keep`, `pm_m21_open`, `pm_episode_unlocked`, `pm_episode_locked_tap`, `pm_m21_view`, `pm_m21_click`, `pm_gate_not_now`, `pm_see_all_mirrors`, `pm_deep_link`, `pm_nudges_view`, `pm_deck_switch`, `pm_podcast_view`, `pm_episode_play`, `pm_episode_complete`.
Each one carries the source tag. Set `debug: true` in `content.js` to watch them in the console.

The key number is `pm_preview_gate` → `pm_email_submit`: how many people who reached 0:40 gave their email.

## Still to do / placeholders

- **Mirrors 06–12:** audio still to come. They have **placeholder titles** so each path shows 4 Mirrors, marked "Coming soon". Right now:
  - SEE IT: 03, 04 + placeholders 06, 07.
  - OWN IT: 02, 05 + placeholders 08, 09.
  - CHANGE IT: 01 + placeholders 10, 11, 12.
- **Mirror 21 link:** add your page or Stripe link in `MIRROR21.url`.
- **Podcast Episode 7:** missing (the file named Episode 7 was a copy of Episode 8).
- **Which nudges go with which Mirror** and the **"Is this you?" lines** on the back of each card are drafts.
- **Captions:** not shown yet. Draft transcripts of Mirrors 01–05 are in `docs/` (auto-generated, check before using).
- **Sign in with Apple / Google:** not included; they need a backend. Email only for now.
- **Unlock is per device:** someone who unlocked on their phone and opens the link on a laptop enters their email again.
- **Fonts:** Magistral and Neue Haas Display are licensed fonts from your Pocket Mirror files; use them within your licence.

## Browser support

Safari (iOS 15+), Chrome, Edge, Firefox. Audio is MP3 everywhere.
On phones, "Save to my phone" opens the share sheet → **Save Image**; on computers it downloads a PNG.
