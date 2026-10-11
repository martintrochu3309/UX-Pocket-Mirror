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
    ├── cards/            the 24 nudges × white / black / gold (72 cards)
    ├── mirrors/          Mirror audios 01–05 (mp3)
    └── podcast/          The Mirror episodes (mp3) + covers (jpg)
```

## The journey

| # | Screen | What happens |
|---|---|---|
| 1 | Landing | "The mirror never changes. You do." The 3 plates orbit an endless circle (SEE IT in the middle, OWN IT right, CHANGE IT left). They follow your finger and keep turning in either direction: the plate leaving one side swings round behind the middle one and comes back in on the other. The middle one glows and its line shows underneath ("Something's off, and I can't name it."). **Tap the plate to open it.** "TAP TO OPEN" appears each time a plate lands in the middle, then fades. |
| 2 | Which one is you? | The Mirrors for that path, as a list. "See all 12 Mirrors" shows everything. |
| 3 | Kevin's voice | Ring timer, plus captions: one line at a time, the word Kevin is saying in bold white, upcoming words grey. Plays free until **0:40**, then pauses. |
| 4 | Unlock | Sheet slides up: Kevin, "HEAR THE REST.", what unlocks, email field. "Not now" goes back to the list. |
| 5 | Unlocked | Audio carries on from 0:40. Toast: "Unlocked · all Mirrors". |
| 6 | Take one with you | 3 nudge cards matched to that Mirror, in the path's colour (See it = white, Own it = black, Change it = gold). "• TAP TO FLIP" shows for 2 seconds each time a card lands in the middle. The back says **IS THIS YOU?** and the 3 lines. Once flipped, "↑ SWIPE UP TO SAVE" shows for 2 seconds. **Swipe the card up** and it flies out of the deck, then the lock-screen sheet rises with **SAVE TO MY PHONE**; when you close it the card drops back with a gold glow and a tick. Tap = flip, sideways = next card, up = keep. |
| 7 | Home | Tabs: **12 MIRRORS** (with progress) · **24 NUDGES** (3 decks, today's nudge first, same tap-to-flip / swipe-up-to-save cards) · **12 EPISODES** (The Mirror podcast, opening one at a time, with a mini player). White **MIRROR 21** button top right. After the first full Mirror, a one-time "Keep it on your phone" card. |
| 8 | Mirror 21 | The $99 21-day training, the only white screen (see below). |

No tab bar before the email. Returning visitors who already gave their email go straight to Home.

## Podcast: 12 EPISODES

Episode 1 is open after the email. Each next episode opens when the previous one is finished ("EPISODE 02 UNLOCKED").
Locked episodes show their title, a lock, and "Finish Episode 01 to open". Missing episodes (like 07) are skipped.
Prefer a weekly drip? Set `podcastUnlock: 'weekly'` (one new episode every `podcastEveryDays`, counted from sign-up), or `'all'` to open everything.

## Mirror 21 (the $99 training)

Never before the email, so the free part feels like a gift. After the email it is always one tap away:

1. **MIRROR 21 button**, top right of every Home tab (always).
2. **Big card on 12 MIRRORS** once someone has heard every available Mirror: "You've looked in every Mirror. Now live it for 21 days."
3. **Card at the end of every podcast episode:** "Ready for more?"
4. **Line after saving a nudge** from the 24 NUDGES tab: "Want Kevin with you for 21 days?"

The MIRROR 21 button and cards are **white**, the only white things in the dark app. All four open the **Mirror 21 page**, which fades from black to white:

- **MIRROR 21**, then **YOU SAID** with the Mirror they last listened to, crossed out in gold,
- **IN 21 DAYS** and that Mirror's "after" line in big letters ("I DID IT.", "I'M BACK IN CONTROL."…), next to Kevin's photo,
- the price card, What's in it for you, Your 21 days (See it, Own it, Change it), Every day (Listen, Act, Check in),
- a gold **START MIRROR 21 · $99** button pinned to the bottom.

Each Mirror's "after" line is `after` in `MIRRORS` (06–12 are drafts). The rest of the page copy is in `MIRROR21`.
Put your Mirror 21 page or Stripe checkout link in `MIRROR21.url`. Until then the button says "Link coming soon". The card wording is in `MIRROR21.cards`.
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
- The icon opens the app full screen. iPhone gives home-screen apps their own memory, so before showing the steps the app adds `?pm=1` (plus what they've heard) to the address. The home-screen version opens **already unlocked**. Test this on a real iPhone before launch.
- Later (phase 2): notifications like "Episode 3 is unlocked" only work on iPhone once the app is on the home screen.

Test it on a computer with `?demo=unlocked&a2hs=ios#/home` or `&a2hs=android`.

## Demo mode, starting over, and seeing every screen

- **Demo mode is ON** in this version (`demoMode: true` at the top of `js/content.js`).
  Emails are not saved or sent, and refreshing the page starts the journey again from the landing.
  The landing shows a small gold "DEMO MODE · NOTHING IS SAVED" line, and Home has a **Start over (demo)** button.
  **Set `demoMode: false` before you launch.**
- **Start over on any version:** add `?reset` to the address (e.g. `yoursite.com/?reset`). It wipes the saved email and progress on that phone or computer.
- **See every screen at once:** open **`preview.html`**. It shows all 13 screens side by side (the player ones are paused mid-caption) in phone frames, before and after the email, and you can tap inside each one. Nothing there saves or sends anything.

## Try it on your computer

Open the folder in VS Code and use the **Live Server** extension (right-click `index.html` → Open with Live Server).
Or in a terminal inside the folder: `python3 -m http.server 8000`, then open http://localhost:8000.

Double-clicking `index.html` mostly works, but "Save to my phone" needs a server.
To test the unlock again: just refresh (demo mode), or add `?reset` to the address (live mode).

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
- **Big titles:** `TITLES` (`['24', 'NUDGES']` = gold part, white part). They're text, so they stay sharp and are easy to change.

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
