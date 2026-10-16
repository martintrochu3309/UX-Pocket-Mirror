/*
 * THE POCKET MIRROR · content
 * ---------------------------------------------------------------
 * Everything you will want to change lives in this file:
 * settings, the 3 paths, the 12 Mirrors, the 21 nudges and the podcast.
 * Edit the text, save, refresh. No build step.
 */

window.PM_CONTENT = {

  /* ------------------------------------------------------------- settings */
  CONFIG: {
    // DEMO MODE: true = emails are NOT saved or sent and a refresh starts the journey again.
    // Perfect for testing and showing people. Set to false before you launch.
    demoMode: false,

    // Every Mirror stops here until the person gives their email (seconds).
    previewSeconds: 40,

    // Total Mirrors in the series (used for "1 OF 12 HEARD").
    totalMirrors: 12,

    // Podcast (12 EPISODES): how episodes open up after the email.
    //   'listen' = Episode 1 is open, each next episode opens when the previous one is finished
    //   'weekly' = one new episode every `podcastEveryDays` days after sign-up
    //   'all'    = everything open
    podcastUnlock: 'listen',
    podcastEveryDays: 7,

    // Email capture
    // 1. Netlify Forms: works automatically when the site is hosted on Netlify.
    //    Submissions appear in Netlify > Site > Forms > "pocket-mirror".
    netlifyForms: true,
    netlifyFormName: 'pocket-mirror',
    // 2. Optional webhook (Zapier, Make, Mailchimp/ConvertKit endpoint...). Leave '' to skip.
    //    Receives JSON: { email, mirror, path, source, createdAt, page }
    webhookUrl: '',

    // Small print under the email field on the unlock sheet.
    finePrint: 'One email a week. Leave anytime.',

    // Shows funnel events in the browser console (see README > Measuring the funnel).
    debug: false
  },

  /* ------------------------------------------------------------- the 3 paths
   * deck     = which colour of nudge cards this path gives (white / black / gold)
   * deckName = the deck's name on the 21 NUDGES tab
   */
  PATHS: [
    { key: 'see',    num: '01', name: 'SEE IT',    deckName: 'AWARENESS',  plate: 'assets/images/plate-see.png',    deck: 'white',
      line: 'Something’s off, and I can’t name it.' },
    { key: 'own',    num: '02', name: 'OWN IT',    deckName: 'ACCEPTANCE', plate: 'assets/images/plate-own.png',    deck: 'black',
      line: 'I know what it is. I keep explaining it away.' },
    { key: 'change', num: '03', name: 'CHANGE IT', deckName: 'ACTION',     plate: 'assets/images/plate-change.png', deck: 'gold',
      line: 'I’m ready to stop talking and start doing.' }
  ],

  /* ------------------------------------------------------------- the 12 Mirrors
   * audio: null  = not recorded yet, shows as "Coming soon".
   * after        = the line on the Mirror 21 page: "You said: <title>" → "In 21 steps: <after>".
   * card         = the nudge card this Mirror unlocks the first time it is finished (an id from NUDGES below).
   *                Every card has exactly one Mirror or podcast episode that unlocks it.
   * duration     = seconds (shown as "1 min").
   */
  MIRRORS: [
    { n: 1,  path: 'change', title: 'I know what I need to do. I’m just not doing it.', after: 'I did it.',     audio: 'assets/mirrors/mirror-01.mp3', duration: 66, card: 'from-doing' },
    { n: 2,  path: 'own',    title: 'I need to have a difficult conversation.', after: 'I had it.',               audio: 'assets/mirrors/mirror-02.mp3', duration: 65, card: 'tolerate-teach' },
    { n: 3,  path: 'see',    title: 'I feel stuck.', after: 'I’m moving.',                                          audio: 'assets/mirrors/mirror-03.mp3', duration: 68, card: 'face-the-reflection' },
    { n: 4,  path: 'see',    title: 'I’ve got too much going on.', after: 'I’m back in control.',                   audio: 'assets/mirrors/mirror-04.mp3', duration: 69, card: 'more-focus' },
    { n: 5,  path: 'own',    title: 'I’ve had a wobble.', after: 'I bounced back.',                                 audio: 'assets/mirrors/mirror-05.mp3', duration: 66, card: 'every-choice-costs' },
    { n: 6,  path: 'see',    title: 'I’m doubting myself.', after: 'I backed myself.',                              audio: 'assets/mirrors/mirror-06.mp3', duration: 69, card: 'believing-isnt-true' },
    { n: 7,  path: 'see',    title: 'Change is happening and I’m struggling.', after: 'I’m moving with it.',        audio: 'assets/mirrors/mirror-07.mp3', duration: 70, card: 'prepared-to-see' },
    { n: 8,  path: 'own',    title: 'I’ve lost direction.', after: 'I know where I’m going.',                       audio: 'assets/mirrors/mirror-08.mp3', duration: 66, card: 'own-your-time' },
    { n: 9,  path: 'own',    title: 'My team isn’t pulling together.', after: 'We’re pulling together.',           audio: 'assets/mirrors/mirror-09.mp3', duration: 70, card: 'fix-your-standards' },
    { n: 10, path: 'change', title: 'I need to make a decision.', after: 'I made the call.',                           audio: 'assets/mirrors/mirror-10.mp3', duration: 62, card: 'already-late' },
    { n: 11, path: 'change', title: 'I’m feeling the pressure.', after: 'I was ready.',                                 audio: 'assets/mirrors/mirror-11.mp3', duration: 67, card: 'follow-through' },
    { n: 12, path: 'change', title: 'I’m playing it too safe.', after: 'I made my move.',                              audio: 'assets/mirrors/mirror-12.mp3', duration: 71, card: 'comfort-enemy' }
  ],

  /* ------------------------------------------------------------- the 21 nudges
   * 7 per deck, and each nudge belongs to ONE deck: white = SEE IT, black = OWN IT, gold = CHANGE IT.
   * Card image: assets/cards/<deck>/<id>.jpg · face-down back: assets/cards/back.jpg
   * Each card is unlocked by the Mirror or episode that names it as its `card`.
   * pickIf = the 3 lines under "IS THIS YOU?" on the back of the card (DRAFTS, edit freely).
   */
  NUDGES: [
    // white · SEE IT
    { id: 'where-your-feet-are', deck: 'white', text: 'You are where your feet are. Show up fully.', why: 'The only place you lead from is now.',
      pickIf: ['You’re there, but your mind isn’t.', 'You’re always thinking about what’s next.', 'People don’t get the best of you.'] },
    { id: 'more-focus', deck: 'white', text: 'You don’t need more time. You need more focus.', why: 'Because wasted hours don’t come back, but results do.',
      pickIf: ['You’re busy all day, but the big things don’t move.', 'You start the day without a priority.', 'Your phone gets your best hours.'] },
    { id: 'be-intentional', deck: 'white', text: 'Stop being busy. Start being intentional.', why: 'Activity without aim just burns time.',
      pickIf: ['Your to-do list never ends.', 'You mistake being busy for making progress.', 'You finish the day tired, not proud.'] },
    { id: 'prepared-to-see', deck: 'white', text: 'You see the opportunities you’re prepared to see.', why: 'Your vision doesn’t reflect reality, it reflects readiness.',
      pickIf: ['Opportunities seem to pass you by.', 'Others seem to get the lucky breaks.', 'You mostly notice the problems.'] },
    { id: 'listen-with-your-eyes', deck: 'white', text: 'Listen with your eyes. Not just your ears.', why: 'What people do often tells you more than what they say.',
      pickIf: ['You take people at their word.', 'You’re surprised when someone lets you down.', 'You hear the words but miss the signs.'] },
    { id: 'believing-isnt-true', deck: 'white', text: 'Just because you believe it doesn’t make it true.', why: 'An assumption isn’t a fact, no matter how long you’ve believed it.',
      pickIf: ['You’re sure you already know the answer.', 'You decide what people think before asking.', 'An old story still runs your choices.'] },
    { id: 'face-the-reflection', deck: 'white', text: 'Stop admiring the reflection. Face who’s behind it.', why: 'You can’t change what you’re unwilling to face.',
      pickIf: ['Things look fine from the outside.', 'You avoid the honest look in the mirror.', 'You know something needs facing.'] },

    // black · OWN IT
    { id: 'excuse-costs', deck: 'black', text: 'Every excuse costs you a result.', why: 'Justify it, repeat it. Own it, change it.',
      pickIf: ['You justify the same miss every week.', '“It wasn’t my fault” comes easily.', 'You know what your excuse is costing you.'] },
    { id: 'fix-your-standards', deck: 'black', text: 'Don’t blame the system. Fix your standards.', why: 'You’re not stuck. You’re settling.',
      pickIf: ['You blame the boss, the system, the timing.', 'You’ve accepted “good enough”.', 'You feel stuck but haven’t changed anything.'] },
    { id: 'tolerate-teach', deck: 'black', text: 'What you tolerate, you teach.', why: 'Boundaries build culture. Or break it.',
      pickIf: ['You let things slide to avoid conflict.', 'People keep crossing the same line.', 'You say yes when you mean no.'] },
    { id: 'how-committed', deck: 'black', text: 'Every obstacle is asking: how committed are you?', why: 'Pressure exposes priorities. Not potential.',
      pickIf: ['You quit when it gets hard.', 'Setbacks make you doubt the goal.', 'You want it, but not on the hard days.'] },
    { id: 'start-responding', deck: 'black', text: 'Stop reacting. Start responding.', why: 'Own the moment, or the moment owns you.',
      pickIf: ['You react before you think.', 'One comment can ruin your day.', 'You replay what you wish you’d said.'] },
    { id: 'every-choice-costs', deck: 'black', text: 'Every choice has a cost. Even the ones you avoid.', why: 'Not deciding is still a decision.',
      pickIf: ['You’re putting off a decision.', 'You wait for it to sort itself out.', 'You second-guess choices you’ve already made.'] },
    { id: 'own-your-time', deck: 'black', text: 'Own your time, or it owns you.', why: 'The watch on your wrist works for you, or you work for it.',
      pickIf: ['Your diary runs your day.', 'Other people’s urgent becomes your priority.', 'You never get to what matters to you.'] },

    // gold · CHANGE IT
    { id: 'from-doing', deck: 'gold', text: 'Change doesn’t come from knowing. It comes from doing.', why: 'Insight without action is just a story you tell yourself.',
      pickIf: ['You know exactly what to do.', 'You’ve read the books and heard the talks.', 'Nothing has changed yet.'] },
    { id: 'already-late', deck: 'gold', text: 'If you’re waiting to feel ready, you’re already late.', why: 'Growth never feels safe. Go anyway.',
      pickIf: ['You’re waiting until you feel ready.', 'You keep saying “next month”.', 'Fear of getting it wrong keeps you still.'] },
    { id: 'follow-through', deck: 'gold', text: 'Follow through, or fall short.', why: 'Anyone can start. Few finish.',
      pickIf: ['You start things but don’t finish them.', 'You lose momentum when it gets difficult.', 'You set goals but struggle to stay consistent.'] },
    { id: 'comfort-enemy', deck: 'gold', text: 'Comfort is the enemy of change.', why: 'Growth lives in the stretch. Not the sofa.',
      pickIf: ['Things are fine, but not exciting.', 'You avoid what makes you uncomfortable.', 'You’ve stopped stretching yourself.'] },
    { id: 'fall-to-systems', deck: 'gold', text: 'You don’t rise to your vision. You fall to your systems.', why: 'Goals don’t fail. Execution does.',
      pickIf: ['You set big goals but have no plan.', 'You rely on motivation to get things done.', 'Your goals reset every January.'] },
    { id: 'train-your-mind', deck: 'gold', text: 'Train your mind to be stronger than your feelings.', why: 'Emotions pass. Discipline lasts.',
      pickIf: ['Your mood decides your day.', 'You skip things when you don’t feel like it.', 'One wobble knocks you off course.'] },
    { id: 'start-driving', deck: 'gold', text: 'Stop drifting. Start driving.', why: 'If you don’t steer it, don’t complain where it goes.',
      pickIf: ['Life feels like it’s happening to you.', 'You go along with plans you didn’t choose.', 'You can’t say where you’ll be in a year.'] }
  ],

  /* ------------------------------------------------------------- The Mirror podcast
   * audio: null = not uploaded yet, shows as "Coming soon".
   * card        = the nudge card this episode unlocks the first time it is finished (episodes 6, 8 and 10 unlock none).
   */
  PODCAST: {
    name: 'THE MIRROR',
    tagline: 'Turning knowing into doing.',
    episodes: [
      { n: 1,  title: 'Look at yourself.',              audio: 'assets/podcast/audio/ep-01.mp3', cover: 'assets/podcast/covers/ep-01.jpg', duration: 243, card: 'where-your-feet-are' },
      { n: 2,  title: 'What are you waiting for?',      audio: 'assets/podcast/audio/ep-02.mp3', cover: 'assets/podcast/covers/ep-02.jpg', duration: 204, card: 'train-your-mind' },
      { n: 3,  title: 'What do you need to see?',       audio: 'assets/podcast/audio/ep-03.mp3', cover: 'assets/podcast/covers/ep-03.jpg', duration: 245, card: 'listen-with-your-eyes' },
      { n: 4,  title: 'Who shows up?',                  audio: 'assets/podcast/audio/ep-04.mp3', cover: 'assets/podcast/covers/ep-04.jpg', duration: 193, card: 'how-committed' },
      { n: 5,  title: 'Do you accept it?',              audio: 'assets/podcast/audio/ep-05.mp3', cover: 'assets/podcast/covers/ep-05.jpg', duration: 244, card: 'excuse-costs' },
      { n: 6,  title: 'Why aren’t you doing it?',       audio: 'assets/podcast/audio/ep-06.mp3', cover: 'assets/podcast/covers/ep-06.jpg', duration: 215 },
      { n: 7,  title: 'What are you covering?',         audio: 'assets/podcast/audio/ep-07.mp3', cover: 'assets/podcast/covers/ep-07.jpg', duration: 227, card: 'be-intentional' },
      { n: 8,  title: 'The excuse you call a reason.',  audio: 'assets/podcast/audio/ep-08.mp3', cover: 'assets/podcast/covers/ep-08.jpg', duration: 215 },
      { n: 9,  title: 'Are we there yet?',              audio: 'assets/podcast/audio/ep-09.mp3', cover: 'assets/podcast/covers/ep-09.jpg', duration: 220, card: 'fall-to-systems' },
      { n: 10, title: 'Yesterday on repeat.',           audio: 'assets/podcast/audio/ep-10.mp3', cover: 'assets/podcast/covers/ep-10.jpg', duration: 201 },
      { n: 11, title: 'Will you still be there?',       audio: 'assets/podcast/audio/ep-11.mp3', cover: 'assets/podcast/covers/ep-11.jpg', duration: 203, card: 'start-responding' },
      { n: 12, title: 'Who are you becoming?',          audio: 'assets/podcast/audio/ep-12.mp3', cover: 'assets/podcast/covers/ep-12.jpg', duration: 228, card: 'start-driving' }
    ]
  },

  /* ------------------------------------------------------------- the 3 Home tabs: big reflected title + tab bar name
   * title = [gold part, white part] (leave the gold part '' for an all-white title)
   */
  TITLES: {
    mirrors: ['', 'LISTEN'],
    nudges:  ['', 'COLLECT'],
    podcast: ['', 'EXPLORE']
  },
  TABS: { mirrors: 'LISTEN', nudges: 'COLLECT', podcast: 'EXPLORE' },

  /* ------------------------------------------------------------- Mirror 21 (the $99 course)
   * Never before the email. After the email it is always one tap away:
   *   · the gold MIRROR 21 button, top right of every Home tab
   *   · a big card on 12 MIRRORS once every available Mirror has been heard
   *   · a card at the end of every podcast episode
   *   · a line after someone keeps a nudge from the 21 NUDGES tab
   */
  MIRROR21: {
    // Where "START MIRROR 21" goes: your Mirror 21 page or a Stripe checkout link. '' = "Link coming soon".
    url: '',
    price: '$99',
    cards: {
      allMirrors: ['YOU’VE LOOKED IN EVERY MIRROR', 'Now live it in 21 steps, with Kevin.'],
      episodeEnd: ['READY FOR MORE?', '21 steps. One change. Kevin with you every step.'],
      afterNudge: 'Want Kevin with you for 21 steps?'
    },
    // Collection milestones: a pop-up on the 21 NUDGES tab, once each, with a SEE MIRROR 21 button.
    // cards: N  = when the Nth card is collected · deck: 'white' | 'black' | 'gold' = when that deck is complete.
    // Listed in order of priority: if two happen at once, only the first one in this list shows.
    milestones: [
      { cards: 21,     title: 'ALL 21 COLLECTED.',    line: 'Now live them: 21 steps with Kevin.' },
      { deck: 'white', title: 'AWARENESS COMPLETE.',  line: 'That’s Steps 01–07 of Mirror 21: SEE IT. Live them with Kevin.' },
      { deck: 'black', title: 'ACCEPTANCE COMPLETE.', line: 'Steps 08–14 of Mirror 21: OWN IT.' },
      { deck: 'gold',  title: 'ACTION COMPLETE.',     line: 'Steps 15–21 of Mirror 21: CHANGE IT.' },
      { cards: 14,     title: '14 OF 21.',            line: 'Two thirds there.' },
      { cards: 7,      title: '7 OF 21.',             line: 'Change doesn’t come from collecting. It comes from doing.' },
      { cards: 3,      title: '3 NUDGES IN.',         line: 'You’ve started something. Mirror 21 turns it into one real change.' }
    ],
    tagline: '21 steps. One change. Kevin with you every step.',
    // The Mirror 21 page (white, one screen, no scrolling). "You said → In 21 steps" uses the Mirror they last listened to:
    // its title, crossed out, then its `after` line, with the last word in gold.
    photo: 'assets/images/kevin-mirror21.jpg',
    points: ['One change you’ll actually make.', 'Proof you did it.', 'A method you keep.'],
    // "See how it works" sheet
    stages: [
      { steps: '01–07', name: 'SEE IT',    line: 'Name what’s really in the way.' },
      { steps: '08–14', name: 'OWN IT',    line: 'Stop explaining it away.' },
      { steps: '15–21', name: 'CHANGE IT', line: 'Make it what you do.' }
    ],
    eachStep: [['LISTEN', '1 minute with Kevin'], ['LEARN', 'The tool, in a short video'], ['ACT', 'One move for today'], ['CHECK', 'Did you do it?']]
  },

  /* ------------------------------------------------------------- captions (Mirrors 01–12)
   * [start second, end second, 'line'] — the words light up one by one as Kevin says them.
   * Lines marked 'CHECK' have a word the speech-to-text wasn't sure about: listen and correct.
   */
  CAPTIONS: {
    1: [
      [1.1, 4.4, 'I know what I need to do. I’m just not doing it.'],
      [5.1, 7.6, 'There’s something you keep meaning to start.'],
      [7.9, 9.9, 'You’ve told yourself “next week”'],
      [9.9, 11.5, 'more than once.'],
      [11.5, 13.5, 'And nothing’s really changed.'],
      [14.4, 16.2, 'So let me ask you something.'],
      [17.1, 20.7, 'When you tell yourself you’ll do something, and then you don’t,'],
      [21.6, 24.5, 'what happens to the trust you have in your own word?'],
      [25.3, 26.6, 'Think about that.'],
      [28.0, 30.2, 'Because every time you let it slide…'],
      [30.7, 34.1, 'you’re teaching yourself that your promises are optional.'],
      [35.3, 37.0, 'Look at what’s getting in the way.', 'CHECK'],
      [37.3, 40.7, 'And how many times have you given yourself that same reason?'],
      [41.4, 42.6, 'Your move.'],
      [43.8, 47.1, 'Pick the one thing you keep promising yourself you’ll do.'],
      [47.5, 49.3, 'Before today’s over,'],
      [49.4, 51.0, 'do something about it.'],
      [51.1, 55.0, 'Something specific. Something you can actually finish.'],
      [55.0, 56.4, 'No reasons.'],
      [56.5, 57.8, 'No excuses.'],
      [57.9, 59.3, 'Take this with you.'],
      [59.6, 62.3, 'Knowing what to do doesn’t create change.'],
      [62.7, 64.3, 'Doing it does.']
    ],
    2: [
      [1.1, 3.7, 'I need to have a difficult conversation.'],
      [4.2, 6.6, 'There’s a conversation you’ve been putting off.'],
      [6.6, 8.2, 'You know who it’s with.'],
      [8.3, 10.0, 'You know what needs saying.'],
      [10.2, 13.2, 'And you’ve probably had it a dozen times already.'],
      [13.7, 15.2, 'Just not with them.'],
      [15.2, 17.7, 'In the car. In the shower.', 'CHECK'],
      [17.7, 19.1, 'At 3 in the morning.'],
      [19.2, 20.6, 'In your head.', 'CHECK'],
      [20.9, 22.3, 'You always win.'],
      [23.1, 25.9, 'But that conversation isn’t getting easier while you wait.'],
      [26.4, 27.9, 'It’s getting heavier.'],
      [28.3, 30.6, 'And they can probably feel it too.'],
      [31.2, 33.0, 'So ask yourself this…'],
      [33.6, 36.0, 'Do you actually want to sort things out?'],
      [36.9, 39.0, 'Or do you just want to be right?'],
      [40.2, 41.3, 'Your move.'],
      [41.8, 43.5, 'Before today’s over,'],
      [43.5, 45.4, 'arrange a time to have it.', 'CHECK'],
      [45.9, 47.2, 'When you do,'],
      [47.5, 50.7, 'ask for their perspective before you give yours.'],
      [50.9, 53.1, 'Listen before you defend.'],
      [53.5, 56.2, 'Then say what needs to be said.'],
      [56.8, 58.2, 'Take this with you.'],
      [58.9, 61.0, 'You don’t have to win the conversation.'],
      [61.3, 63.5, 'You just have to have it.']
    ],
    3: [
      [1.0, 2.4, 'I feel stuck.'],
      [3.0, 6.1, 'You feel stuck. Not because things are going badly.'],
      [6.3, 7.9, 'From the outside,'],
      [7.9, 9.8, 'everything might look fine.'],
      [10.3, 12.0, 'You’re good at what you do.'],
      [12.4, 14.5, 'It just doesn’t light you up anymore.'],
      [15.0, 16.6, 'And that’s hard to admit,', 'CHECK'],
      [16.6, 18.3, 'because you’re not failing.'],
      [18.7, 20.2, 'So you carry on.'],
      [20.3, 22.0, 'Same routines.'],
      [22.0, 23.5, 'Same choices.'],
      [23.6, 26.3, 'Because it’s familiar. Because it works.'],
      [26.7, 28.0, 'Because changing it'],
      [28.1, 30.2, 'means stepping into the unknown.'],
      [30.7, 32.3, 'So here’s the question.'],
      [33.2, 36.0, 'Are you staying because it’s still right for you?'],
      [36.5, 38.5, 'Or because it’s all you’ve ever known?'],
      [39.1, 41.1, 'And the longer you stay,'],
      [41.4, 44.6, 'the more you convince yourself you’re happy where you are.'],
      [45.4, 46.6, 'Your move.'],
      [47.4, 49.5, 'Pick one routine you’ve outgrown.'],
      [49.9, 53.0, 'And before today’s over, change it.', 'CHECK'],
      [53.4, 55.2, 'Not to change everything.'],
      [55.7, 58.0, 'Just to see what moves.'],
      [58.5, 59.9, 'Take this with you.'],
      [60.0, 62.7, 'Moving on doesn’t mean starting again.'],
      [63.0, 64.3, 'Sometimes,'],
      [64.3, 67.0, 'it means evolving beyond where you are.']
    ],
    4: [
      [1.2, 3.0, 'I’ve got too much going on.'],
      [3.3, 5.3, 'Ever feel like you’ve been busy all day,'],
      [5.4, 9.0, 'but the things that really matter still aren’t getting done?'],
      [9.5, 11.2, 'Messages. Meetings.'],
      [11.3, 13.5, 'People needing something from you.'],
      [13.6, 15.3, 'You haven’t stopped.'],
      [15.7, 18.5, 'Nobody could accuse you of not working hard.'],
      [18.8, 20.2, 'But somehow…'],
      [20.3, 23.3, 'everything else keeps getting your attention first.'],
      [23.5, 26.2, 'And the thing that would make the biggest difference'],
      [26.2, 27.7, 'is still waiting.'],
      [28.0, 29.9, 'It doesn’t just sit on the list.'],
      [29.9, 31.5, 'It sits in your head.'],
      [32.2, 35.4, 'Getting back in control isn’t about finding more time.'],
      [35.6, 38.3, 'It’s about getting clear on what actually deserves it.'],
      [39.2, 40.8, 'So be honest with yourself.'],
      [40.7, 43.6, 'Are you spending your time on what’s important,'],
      [44.3, 47.3, 'or just responding to whatever comes next?'],
      [48.5, 49.7, 'Your move.'],
      [50.4, 52.4, 'Think about what’s on your plate.'],
      [52.6, 55.2, 'What’s the one thing that matters most?'],
      [55.3, 58.1, 'Do that first, the next time you start work.'],
      [58.0, 60.3, 'Before the messages, before the meetings,'],
      [60.3, 62.6, 'before the day gets a vote.'],
      [63.2, 64.6, 'Take this with you.'],
      [65.2, 67.2, 'When everything is a priority,'],
      [67.4, 68.7, 'nothing is.']
    ],
    5: [
      [1.3, 2.8, 'I’ve had a wobble.'],
      [3.3, 4.9, 'Everyone has a wobble.'],
      [4.8, 7.0, 'A bad decision. A missed opportunity.'],
      [7.0, 9.7, 'Something you thought would work out'],
      [9.8, 10.7, 'but didn’t.'],
      [10.7, 14.0, 'And suddenly, you start questioning yourself.'],
      [14.2, 17.3, 'You replay what happened. What you said.'],
      [17.4, 19.8, 'What you wish you’d done differently.'],
      [19.8, 21.4, 'You overthink it.'],
      [21.5, 23.0, 'And before you know it,'],
      [23.0, 27.2, 'you’re second-guessing decisions you wouldn’t normally think twice about.', 'CHECK'],
      [27.5, 31.4, 'One bad moment is starting to affect everything else.'],
      [31.9, 33.7, 'So think about this.'],
      [34.1, 37.7, 'Is what’s holding you back what actually happened,'],
      [38.2, 42.0, 'or what you’ve started telling yourself because of it?'],
      [43.1, 44.4, 'Your move.'],
      [44.8, 47.0, 'Think about the wobble you’re carrying.'],
      [47.5, 49.9, 'Separate what actually happened'],
      [49.9, 52.6, 'from what you’re now assuming about yourself.'],
      [52.7, 54.7, 'Take one lesson from it.'],
      [54.7, 56.5, 'Then make one decision today'],
      [56.6, 58.6, 'that you’ve been second-guessing.'],
      [59.6, 61.1, 'Take this with you.'],
      [61.2, 63.0, 'The wobble matters.'],
      [63.3, 65.2, 'Your response matters more.']
    ],
    6: [
      [1.0, 2.3, 'I’m doubting myself.'],
      [3.3, 4.0, 'Am I good enough?'],
      [5.0, 6.0, 'What if I get it wrong?'],
      [6.8, 7.9, 'What if I’m not ready?'],
      [8.8, 10.2, 'An opportunity comes along,'],
      [10.7, 12.1, 'something you’d really like to do,'],
      [13.1, 15.9, 'and almost immediately that voice starts.'],
      [16.7, 17.6, 'So you hesitate.'],
      [18.3, 19.8, 'You look for a reason to wait.'],
      [20.7, 21.8, 'A bit more experience.'],
      [22.6, 23.8, 'A bit more preparation.'],
      [24.8, 26.7, 'You’ll go for it when you feel more confident.'],
      [27.9, 30.0, 'But how are you supposed to build confidence'],
      [30.3, 32.9, 'in something you never give yourself the chance to try?'],
      [33.9, 34.7, 'Every time you wait,'],
      [35.2, 36.5, 'the doubt gets a little louder'],
      [37.2, 39.6, 'and the next chance gets a little harder to take.'],
      [41.0, 41.6, 'Your move.'],
      [42.9, 43.5, 'Ask yourself,'],
      [44.5, 46.3, 'what would I do if I backed myself?'],
      [46.6, 47.8, 'Not if I knew it would work,'],
      [48.4, 50.8, 'if I trusted myself to handle whatever happened.'],
      [52.1, 54.4, 'Now take one step towards that opportunity today.'],
      [55.4, 56.3, 'Put your name forward.'],
      [56.8, 57.6, 'Ask the question.'],
      [58.5, 59.5, 'Make the first move.'],
      [60.6, 61.4, 'Take this with you.'],
      [62.3, 63.9, 'Confidence doesn’t remove doubt.'],
      [64.9, 67.0, 'It stops doubt making the decision.']
    ],
    7: [
      [1.1, 3.0, 'Change is happening and I’m struggling.'],
      [4.2, 6.9, 'Change is easy to talk about when you’re the one choosing it.'],
      [7.7, 9.1, 'It feels very different'],
      [9.7, 10.9, 'when it’s happening to you.'],
      [11.7, 12.5, 'A new system,'],
      [13.3, 14.0, 'a new boss,'],
      [14.6, 16.7, 'a new way of doing things nobody asked you about.'],
      [17.6, 18.7, 'And part of you is thinking,'],
      [19.5, 21.4, 'what was wrong with the way we did it before?'],
      [22.4, 23.9, 'Maybe nothing. It worked.'],
      [24.7, 25.9, 'But working yesterday doesn’t mean'],
      [26.4, 28.3, 'it’s the best way to work tomorrow.'],
      [29.5, 32.5, 'The hardest part of change isn’t learning something new.'],
      [33.4, 36.0, 'It’s letting go of something that used to work.'],
      [37.1, 38.5, 'And the longer you hold on,'],
      [39.2, 41.9, 'the more energy goes into defending the old way,'],
      [42.4, 44.6, 'instead of getting good at the new one.'],
      [46.0, 47.9, 'Are you resisting this because it’s wrong?'],
      [49.0, 49.9, 'Or because it’s different?'],
      [51.5, 52.1, 'Your move.'],
      [53.5, 54.7, 'Look at what you’re holding on to.'],
      [55.5, 59.0, 'Name one thing worth keeping, and one thing you need to let go of.'],
      [59.9, 63.6, 'Then, today, give the new way one honest try.'],
      [64.9, 65.6, 'Take this with you.'],
      [66.7, 68.1, 'You don’t have to like change', 'CHECK'],
      [68.6, 69.3, 'to move with it.']
    ],
    8: [
      [1.2, 2.4, 'I’ve lost direction.'],
      [3.8, 7.1, 'When was the last time you stopped and thought about where you’re actually going?'],
      [8.4, 9.8, 'Not what you’ve got to do today'],
      [10.6, 11.9, 'or what needs doing tomorrow.'],
      [13.0, 13.8, 'Where are you going?'],
      [15.2, 17.8, 'Because you’ve been working hard, getting things done.'],
      [18.4, 19.9, 'Saying yes to opportunities.'],
      [20.8, 22.9, 'Nobody drifts off course on purpose.'],
      [23.8, 25.4, 'It happens one yes at a time.'],
      [26.5, 28.9, 'So if you keep doing what you’re doing right now,'],
      [30.0, 31.2, 'where will you end up?'],
      [32.1, 33.8, 'And is that actually where you want to be?'],
      [35.0, 37.4, 'Losing direction doesn’t always feel like being lost.'],
      [38.0, 39.6, 'It just feels like being on the move.'],
      [40.4, 41.6, 'And you keep going'],
      [41.9, 43.2, 'because going feels better'],
      [43.7, 45.2, 'than stopping long enough to ask.'],
      [46.8, 47.2, 'Your move.'],
      [48.2, 50.1, 'Look at where your time and energy are going.'],
      [50.9, 53.3, 'Now think about where you actually want to be.'],
      [54.1, 57.8, 'What’s the one thing you’re doing that’s taking you further away from that?'],
      [58.9, 59.8, 'Change it today.', 'CHECK'],
      [61.3, 62.1, 'Take this with you.'],
      [63.1, 65.3, 'Movement isn’t the same as direction.']
    ],
    9: [
      [1.2, 2.5, 'I’m not really listening.'],
      [4.1, 6.0, 'You’re nodding along while someone’s talking.'],
      [6.5, 8.8, 'Looking at them. Hearing the words.'],
      [9.6, 11.0, 'But your mind’s somewhere else.'],
      [11.9, 14.2, 'Maybe you’re thinking about what you’ve got to do next,'],
      [15.2, 18.0, 'or you’re already working out what you’ll say back.'],
      [19.0, 21.7, 'And before they’ve even finished, your answer’s ready.'],
      [23.0, 24.8, 'You probably think you’re a pretty good listener.'],
      [26.1, 29.3, 'So when was the last time you let someone finish without interrupting,'],
      [30.3, 33.1, 'offering advice or trying to fix something?'],
      [33.8, 36.8, 'Because sometimes people aren’t asking for an answer.'],
      [37.8, 39.4, 'They just want to know they’ve been heard.'],
      [40.3, 42.9, 'And when they don’t feel heard, they notice.'],
      [43.7, 46.0, 'And quietly, they stop telling you things.'],
      [48.0, 48.4, 'Your move.'],
      [49.4, 50.6, 'In your next conversation,'],
      [51.4, 52.3, 'put the phone away.'],
      [53.4, 54.3, 'Let them finish.'],
      [55.2, 56.3, 'Don’t fix anything.'],
      [57.4, 59.5, 'Leave a second of silence before you speak,'],
      [60.3, 61.5, 'and see what else they say.'],
      [63.1, 63.9, 'Take this with you.'],
      [65.2, 66.7, 'People don’t need your answer,'],
      [67.5, 68.5, 'they need your attention.']
    ],
    10: [
      [1.0, 2.1, 'I need to make a decision.'],
      [3.4, 4.7, 'One option makes sense,'],
      [5.4, 8.1, 'then you look at the other, and that makes sense too.'],
      [9.1, 12.1, 'You talk it through with someone, and they see it differently.'],
      [13.0, 16.1, 'And the more you think about it, the harder it gets.'],
      [17.1, 18.8, 'But no option is going to give you everything.'],
      [19.6, 22.9, 'And sometimes the hardest part isn’t making the decision.'],
      [23.9, 25.9, 'It’s accepting what you’ll have to give up.'],
      [26.5, 28.2, 'So you keep going round in circles,'],
      [28.9, 30.7, 'because as long as you don’t choose,'],
      [31.4, 34.1, 'you don’t lose anything. Except time.'],
      [35.5, 36.1, 'Your move.'],
      [37.1, 38.6, 'Think about the decision in front of you.'],
      [39.3, 41.5, 'What’s the one thing you won’t compromise on?'],
      [42.4, 43.7, 'Which option protects it?'],
      [44.6, 46.7, 'Now say what that choice will cost you, out loud.'],
      [47.1, 47.8, 'Accept it.'],
      [48.6, 52.4, 'Then make the call today.'],
      [54.0, 54.7, 'Take this with you.'],
      [55.4, 57.8, 'You won’t always know if it’s the right decision,'],
      [58.9, 60.3, 'but you can make sure it’s yours.']
    ],
    11: [
      [0.9, 2.1, 'I’m feeling the pressure.'],
      [3.2, 5.2, 'Whatever’s putting you under pressure right now,'],
      [5.7, 7.9, 'you’ve probably already pictured it going wrong.'],
      [8.8, 10.4, 'The question you can’t answer,'],
      [11.0, 12.4, 'the mistake you might make,'],
      [13.1, 15.0, 'the people you don’t want to let down.'],
      [15.8, 17.7, 'And it hasn’t even happened yet.'],
      [18.4, 21.5, 'You’ve gone over the worst possible outcome so many times.'],
      [22.2, 25.9, 'Yet how much thought have you given to what you’ll actually do if it happens?'],
      [26.1, 30.3, 'Because if the first time you face that moment'],
      [30.5, 34.0, 'is when it arrives, it’s already got the upper hand.'],
      [34.7, 35.7, 'So right now,'],
      [36.2, 37.3, 'which one are you doing?'],
      [38.1, 38.9, 'Worrying about it,'],
      [39.7, 40.7, 'or getting ready for it?'],
      [42.4, 42.9, 'Your move.'],
      [43.9, 46.4, 'Pick the one moment you’re most concerned about.'],
      [47.6, 49.9, 'Decide what you’ll do if it happens.'],
      [50.9, 53.5, 'Rehearse that response while you’re calm,'],
      [53.8, 55.0, 'until it’s boring.'],
      [55.5, 58.6, 'Then take one practical step today to prepare.'],
      [60.3, 61.0, 'Take this with you.'],
      [61.9, 63.6, 'Worry rehearses the problem.', 'CHECK'],
      [64.4, 66.7, 'Preparation rehearses the answer.']
    ],
    12: [
      [1.1, 2.3, 'I’m playing it too safe.'],
      [3.5, 5.4, 'There’s nothing wrong with being comfortable,'],
      [5.8, 9.7, 'until comfortable starts keeping you somewhere you no longer want to be.'],
      [10.8, 12.6, 'There was a time you’d have just gone for it.'],
      [12.8, 15.7, 'Said yes before you worked out every reason not to.'],
      [16.6, 19.1, 'Somewhere along the way, that changed.'],
      [20.1, 21.3, 'Now you weigh everything up.'],
      [21.8, 22.9, 'You keep things steady.'],
      [23.5, 24.5, 'You stay where it’s safe.'],
      [25.5, 26.9, 'And safe can protect you,'],
      [27.9, 29.4, 'but it can also shrink you.'],
      [30.3, 34.6, 'Safe inside the walls, while the walls get a little closer every year.'],
      [35.8, 38.4, 'So if that earlier version of you could see you now,'],
      [39.7, 40.5, 'what would they say?'],
      [42.0, 42.5, 'Your move.'],
      [43.8, 45.8, 'You don’t have to do anything reckless.'],
      [46.6, 48.7, 'Just find the door you keep walking past.'],
      [49.3, 53.4, 'The idea, the change, the thing you’ve been talking about for years.'],
      [54.1, 56.4, 'Today, do one thing that opens it.'],
      [56.8, 57.7, 'Send the message.'],
      [58.1, 59.1, 'Make the enquiry.'],
      [59.4, 60.1, 'Book the time.'],
      [60.7, 61.9, 'You don’t have to leap,'],
      [62.7, 63.9, 'but you do have to move.'],
      [65.7, 66.4, 'Take this with you.'],
      [67.9, 70.0, 'The bigger risk is staying where you are.']
    ]
  },

  /* ------------------------------------------------------------- Kevin (unlock sheet) */
  HOST: { name: 'KEVIN CRAGGS', company: 'Daily Xcellence', photo: 'assets/images/kevin.jpg' }
};
