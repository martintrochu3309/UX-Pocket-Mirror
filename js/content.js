/*
 * THE POCKET MIRROR · content
 * ---------------------------------------------------------------
 * Everything you will want to change lives in this file:
 * settings, the 3 paths, the 12 Mirrors, the 24 nudges and the podcast.
 * Edit the text, save, refresh. No build step.
 */

window.PM_CONTENT = {

  /* ------------------------------------------------------------- settings */
  CONFIG: {
    // DEMO MODE: true = emails are NOT saved or sent and a refresh starts the journey again.
    // Perfect for testing and showing people. Set to false before you launch.
    demoMode: true,

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
   * deck = which colour of nudge cards this path gives (white / black / gold)
   */
  PATHS: [
    { key: 'see',    num: '01', name: 'SEE IT',    plate: 'assets/images/plate-see.png',    deck: 'white',
      line: 'Something’s off, and I can’t name it.' },
    { key: 'own',    num: '02', name: 'OWN IT',    plate: 'assets/images/plate-own.png',    deck: 'black',
      line: 'I know what it is. I keep explaining it away.' },
    { key: 'change', num: '03', name: 'CHANGE IT', plate: 'assets/images/plate-change.png', deck: 'gold',
      line: 'I’m ready to stop talking and start doing.' }
  ],

  /* ------------------------------------------------------------- the 12 Mirrors
   * audio: null  = not recorded yet, shows as "Coming soon".
   * after        = the line on the Mirror 21 page: "You said: <title>" → "In 21 days: <after>".
   * nudges       = the 2-3 nudge cards offered after this Mirror (ids from NUDGES below).
   * duration     = seconds (shown as "1 min").
   */
  MIRRORS: [
    { n: 1,  path: 'change', title: 'I know what I need to do. I’m just not doing it.', after: 'I did it.', audio: 'assets/mirrors/mirror-01.mp3', duration: 66,
      nudges: ['from-doing', 'follow-through', 'excuse-costs'] },
    { n: 2,  path: 'own',    title: 'I need to have a difficult conversation.', after: 'I had it.',          audio: 'assets/mirrors/mirror-02.mp3', duration: 65,
      nudges: ['start-responding', 'tolerate-teach', 'already-late'] },
    { n: 3,  path: 'see',    title: 'I feel stuck.', after: 'I’m moving.',                                     audio: 'assets/mirrors/mirror-03.mp3', duration: 68,
      nudges: ['comfort-enemy', 'fix-your-standards', 'shift-your-lens'] },
    { n: 4,  path: 'see',    title: 'I’ve got too much going on.', after: 'I’m back in control.',                       audio: 'assets/mirrors/mirror-04.mp3', duration: 69,
      nudges: ['more-focus', 'be-intentional', 'no-clarity'] },
    { n: 5,  path: 'own',    title: 'I’ve had a wobble.', after: 'I bounced back.',                                audio: 'assets/mirrors/mirror-05.mp3', duration: 66,
      nudges: ['train-your-mind', 'action-builds-belief', 'where-your-feet-are'] },
    // 06-12: PLACEHOLDER titles so each path shows 4 Mirrors. They show as "Coming soon" until audio is added.
    { n: 6,  path: 'see',    title: 'I don’t know what I want anymore.', after: 'I know what I want.',    audio: null, duration: 0, nudges: [] },
    { n: 7,  path: 'see',    title: 'I’m busy, but nothing moves.', after: 'It’s moving.',          audio: null, duration: 0, nudges: [] },
    { n: 8,  path: 'own',    title: 'I keep making excuses.', after: 'No more excuses.',                audio: null, duration: 0, nudges: [] },
    { n: 9,  path: 'own',    title: 'I keep repeating the same mistakes.', after: 'I broke the pattern.',   audio: null, duration: 0, nudges: [] },
    { n: 10, path: 'change', title: 'I keep waiting for the right moment.', after: 'I didn’t wait.',  audio: null, duration: 0, nudges: [] },
    { n: 11, path: 'change', title: 'I start strong, then I stop.', after: 'I kept going.',          audio: null, duration: 0, nudges: [] },
    { n: 12, path: 'change', title: 'I’m ready. I just need a push.', after: 'I’m on my way.',        audio: null, duration: 0, nudges: [] }
  ],

  /* ------------------------------------------------------------- the 24 nudges
   * Card images: assets/cards/<white|black|gold>/<id>.jpg
   * pickIf = the 3 lines under "IS THIS YOU?" on the back of the card (DRAFTS, edit freely).
   */
  NUDGES: [
    { id: 'more-focus', text: 'You don’t need more time. You need more focus.', why: 'Because wasted hours don’t come back, but results do.',
      pickIf: ['You’re busy all day, but the big things don’t move.', 'You start the day without a priority.', 'Your phone gets your best hours.'] },
    { id: 'start-driving', text: 'Stop drifting. Start driving.', why: 'If you don’t steer it, don’t complain where it goes.',
      pickIf: ['Life feels like it’s happening to you.', 'You go along with plans you didn’t choose.', 'You can’t say where you’ll be in a year.'] },
    { id: 'excuses-as-reasons', text: 'Stop dressing excuses up as reasons.', why: 'Accountability isn’t pressure, it’s power.',
      pickIf: ['You always have a good reason why not.', 'You explain more than you act.', 'You know the real reason isn’t the one you say.'] },
    { id: 'action-does', text: 'Opportunities don’t deliver results. Action does.', why: 'The gap between potential and progress is follow-through.',
      pickIf: ['You spot chances but rarely take them.', 'You have the ideas, not the results.', 'You’re waiting for the right opportunity.'] },
    { id: 'be-intentional', text: 'Stop being busy. Start being intentional.', why: 'Activity without aim just burns time.',
      pickIf: ['Your to-do list never ends.', 'You mistake being busy for making progress.', 'You finish the day tired, not proud.'] },
    { id: 'tolerate-teach', text: 'What you tolerate, you teach.', why: 'Boundaries build culture. Or break it.',
      pickIf: ['You let things slide to avoid conflict.', 'People keep crossing the same line.', 'You say yes when you mean no.'] },
    { id: 'already-late', text: 'If you’re waiting to feel ready, you’re already late.', why: 'Growth never feels safe. Go anyway.',
      pickIf: ['You’re waiting until you feel ready.', 'You keep saying “next month”.', 'Fear of getting it wrong keeps you still.'] },
    { id: 'shift-your-lens', text: 'If you can’t shift your lens, you’ll stay stuck in your limits.', why: 'Growth often hides in a view you haven’t considered.',
      pickIf: ['You keep hitting the same wall.', 'You’re sure you’re right, and still stuck.', 'Other people’s views frustrate you.'] },
    { id: 'excuse-costs', text: 'Every excuse costs you a result.', why: 'Justify it, repeat it. Own it, change it.',
      pickIf: ['You justify the same miss every week.', '“It wasn’t my fault” comes easily.', 'You know what your excuse is costing you.'] },
    { id: 'follow-through', text: 'Follow through, or fall short.', why: 'Anyone can start. Few finish.',
      pickIf: ['You start things but don’t finish them.', 'You lose momentum when it gets difficult.', 'You set goals but struggle to stay consistent.'] },
    { id: 'comfort-enemy', text: 'Comfort is the enemy of change.', why: 'Growth lives in the stretch. Not the sofa.',
      pickIf: ['Things are fine, but not exciting.', 'You avoid what makes you uncomfortable.', 'You’ve stopped stretching yourself.'] },
    { id: 'fix-your-standards', text: 'Don’t blame the system. Fix your standards.', why: 'You’re not stuck. You’re settling.',
      pickIf: ['You blame the boss, the system, the timing.', 'You’ve accepted “good enough”.', 'You feel stuck but haven’t changed anything.'] },
    { id: 'start-responding', text: 'Stop reacting. Start responding.', why: 'Own the moment, or the moment owns you.',
      pickIf: ['You react before you think.', 'One comment can ruin your day.', 'You replay what you wish you’d said.'] },
    { id: 'fall-to-systems', text: 'You don’t rise to your vision. You fall to your systems.', why: 'Goals don’t fail. Execution does.',
      pickIf: ['You set big goals but have no plan.', 'You rely on motivation to get things done.', 'Your goals reset every January.'] },
    { id: 'how-committed', text: 'Every obstacle is asking: how committed are you?', why: 'Pressure exposes priorities. Not potential.',
      pickIf: ['You quit when it gets hard.', 'Setbacks make you doubt the goal.', 'You want it, but not on the hard days.'] },
    { id: 'from-doing', text: 'Change doesn’t come from knowing. It comes from doing.', why: 'Insight without action is just a story you tell yourself.',
      pickIf: ['You know exactly what to do.', 'You’ve read the books and heard the talks.', 'Nothing has changed yet.'] },
    { id: 'start-now', text: 'Stop waiting for the perfect moment. Start now.', why: 'Progress beats perfection. Every time.',
      pickIf: ['You’re waiting for the perfect moment.', 'You want it right before you start.', '“When things calm down” never comes.'] },
    { id: 'where-your-feet-are', text: 'You are where your feet are. Show up fully.', why: 'The only place you lead from is now.',
      pickIf: ['You’re there, but your mind isn’t.', 'You’re always thinking about what’s next.', 'People don’t get the best of you.'] },
    { id: 'action-builds-belief', text: 'Action builds belief. Not the other way around.', why: 'You don’t need confidence. You need momentum.',
      pickIf: ['You’re waiting to feel confident first.', 'Self-doubt talks you out of starting.', 'You need proof before you move.'] },
    { id: 'track-it', text: 'If you don’t track it, you can’t trust it.', why: 'Data doesn’t lie. Denial does.',
      pickIf: ['You think you’re doing better than you are.', 'You guess instead of measure.', 'You don’t know where your time goes.'] },
    { id: 'right-habits', text: 'The right habits feel boring. Until they win.', why: 'Flash fades. Foundations last.',
      pickIf: ['You chase quick wins.', 'You get bored of the basics.', 'You start strong, then fade.'] },
    { id: 'no-clarity', text: 'No clarity? No results.', why: 'If you can’t define it, you can’t deliver it.',
      pickIf: ['You’re not sure what you really want.', 'Your goals are vague.', 'You’re busy without a clear target.'] },
    { id: 'prepared-to-see', text: 'You see the opportunities you’re prepared to see.', why: 'Your vision doesn’t reflect reality, it reflects readiness.',
      pickIf: ['Opportunities seem to pass you by.', 'Others seem to get the lucky breaks.', 'You mostly notice the problems.'] },
    { id: 'train-your-mind', text: 'Train your mind to be stronger than your feelings.', why: 'Emotions pass. Discipline lasts.',
      pickIf: ['Your mood decides your day.', 'You skip things when you don’t feel like it.', 'One wobble knocks you off course.'] }
  ],

  /* ------------------------------------------------------------- The Mirror podcast
   * audio: null = not uploaded yet, shows as "Coming soon".
   */
  PODCAST: {
    name: 'THE MIRROR',
    tagline: 'Turning knowing into doing.',
    episodes: [
      { n: 1,  title: 'Look at yourself.',              audio: 'assets/podcast/audio/ep-01.mp3', cover: 'assets/podcast/covers/ep-01.jpg', duration: 243 },
      { n: 2,  title: 'What are you waiting for?',      audio: 'assets/podcast/audio/ep-02.mp3', cover: 'assets/podcast/covers/ep-02.jpg', duration: 204 },
      { n: 3,  title: 'What do you need to see?',       audio: 'assets/podcast/audio/ep-03.mp3', cover: 'assets/podcast/covers/ep-03.jpg', duration: 245 },
      { n: 4,  title: 'Who shows up?',                  audio: 'assets/podcast/audio/ep-04.mp3', cover: 'assets/podcast/covers/ep-04.jpg', duration: 193 },
      { n: 5,  title: 'Do you accept it?',              audio: 'assets/podcast/audio/ep-05.mp3', cover: 'assets/podcast/covers/ep-05.jpg', duration: 244 },
      { n: 6,  title: 'Why aren’t you doing it?',       audio: 'assets/podcast/audio/ep-06.mp3', cover: 'assets/podcast/covers/ep-06.jpg', duration: 215 },
      { n: 7,  title: null,                             audio: null,                             cover: null,                             duration: 0 },
      { n: 8,  title: 'The excuse you call a reason.',  audio: 'assets/podcast/audio/ep-08.mp3', cover: 'assets/podcast/covers/ep-08.jpg', duration: 215 },
      { n: 9,  title: 'Are we there yet?',              audio: 'assets/podcast/audio/ep-09.mp3', cover: 'assets/podcast/covers/ep-09.jpg', duration: 220 },
      { n: 10, title: 'Yesterday on repeat.',           audio: 'assets/podcast/audio/ep-10.mp3', cover: 'assets/podcast/covers/ep-10.jpg', duration: 201 },
      { n: 11, title: 'Will you still be there?',       audio: 'assets/podcast/audio/ep-11.mp3', cover: 'assets/podcast/covers/ep-11.jpg', duration: 203 },
      { n: 12, title: 'Who are you becoming?',          audio: 'assets/podcast/audio/ep-12.mp3', cover: 'assets/podcast/covers/ep-12.jpg', duration: 228 }
    ]
  },

  /* ------------------------------------------------------------- big titles (same style as 12 MIRRORS)
   * [gold part, white part]
   */
  TITLES: {
    mirrors: ['12', 'MIRRORS'],
    nudges:  ['24', 'NUDGES'],
    podcast: ['12', 'EPISODES']
  },

  /* ------------------------------------------------------------- Mirror 21 (the $99 course)
   * Never before the email. After the email it is always one tap away:
   *   · the gold MIRROR 21 button, top right of every Home tab
   *   · a big card on 12 MIRRORS once every available Mirror has been heard
   *   · a card at the end of every podcast episode
   *   · a line after someone keeps a nudge from the 24 NUDGES tab
   */
  MIRROR21: {
    // Where "START MIRROR 21" goes: your Mirror 21 page or a Stripe checkout link. '' = "Link coming soon".
    url: '',
    price: '$99',
    cards: {
      allMirrors: ['YOU’VE LOOKED IN EVERY MIRROR', 'Now live it for 21 days, with Kevin.'],
      episodeEnd: ['READY FOR MORE?', '21 days. One change. Kevin with you every day.'],
      afterNudge: 'Want Kevin with you for 21 days?'
    },
    tagline: '21 days. One change. Kevin with you every day.',
    // The Mirror 21 page (white). The big "You said → In 21 days" uses the Mirror they last listened to.
    photo: 'assets/images/kevin-cap.jpg',
    priceLines: ['21 days · one change', '1 minute a day with Kevin', 'Miss a day? Start again, free'],
    benefits: [
      ['One change. Actually done.', 'Pick the one thing you keep putting off. In 21 days, it’s just what you do.'],
      ['Kevin in your ear, every day.', 'A 1-minute Mirror each morning. Straight, honest, no fluff.'],
      ['Small enough to do today.', 'One clear action before the day is over. Nothing more.'],
      ['Proof, not promises.', 'Check in each night: Yes, Partly or No. Watch your follow-through grow.']
    ],
    weeks: ['Name what’s really in the way.', 'Stop explaining it away.', 'Make it what you do.'],
    daily: [['LISTEN', 'A 1-minute Mirror'], ['ACT', 'One action today'], ['CHECK IN', 'Yes · Partly · No']],
    finePrint: 'One payment · yours to keep · start when you’re ready'
  },

  /* ------------------------------------------------------------- captions (Mirrors 01–05)
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
    ]
  },

  /* ------------------------------------------------------------- Kevin (unlock sheet) */
  HOST: { name: 'KEVIN CRAGGS', company: 'Daily Xcellence', photo: 'assets/images/kevin.jpg' }
};
