export interface PhrasalVerb {
  verb: string;
  meaning: string;
  example: string;
  extraExamples: string[];
}

export interface ParticleData {
  particle: string;
  emoji: string;
  coreMeaning: string;
  visualMetaphor: string;
  patternExplanation: string;
  speakingPrompts: string[];
  phrasalVerbs: PhrasalVerb[];
}

export const PARTICLES: ParticleData[] = [
  {
    particle: 'UP',
    emoji: '⬆️',
    coreMeaning: 'Completion, increase, or upward movement',
    visualMetaphor:
      'Imagine filling a glass to the top — things that are "up" are complete, full, or moving to a higher level.',
    patternExplanation:
      'UP often signals that an action is completed ("eat up"), intensified ("speed up"), or literally rising ("stand up"). It can also suggest preparation ("set up") or destruction ("blow up").',
    speakingPrompts: [
      'Talk about a time you had to "give up" something you loved. Why did you do it? Do you regret it?',
      'Describe a skill you have "picked up" without taking a formal class. How did you learn it?',
      'Tell a story about a time you "stayed up" all night. What were you doing and how did you feel the next day?',
      'Talk about a goal you are "working up" to right now. What steps are you taking to get there?',
      'Describe a situation where something "came up" and changed your plans completely.',
      'Talk about a time when you had to "speak up" about something you believed in. Was it difficult?',
      'Describe your morning routine — what do you do when you "wake up" and why does it matter to you?',
      'Talk about a relationship or friendship that you had to "build up" over time. What made it grow?',
      'Describe a time when you "messed up" at work or school. What did you learn from it?',
      'Talk about something you are "saving up" for right now. Why is it important to you?',
    ],
    phrasalVerbs: [
      {
        verb: 'give up',
        meaning: 'to stop trying or quit something',
        example: "Don't give up — you're almost there!",
        extraExamples: [
          'He gave up smoking after fifteen years of trying.',
          'She refused to give up on her dream of becoming a doctor.',
        ],
      },
      {
        verb: 'speed up',
        meaning: 'to increase speed or make something happen faster',
        example: "Can you speed up? We're going to be late.",
        extraExamples: [
          'They hired more staff to speed up the delivery process.',
          'The new software speeds up data processing significantly.',
        ],
      },
      {
        verb: 'set up',
        meaning: 'to arrange, prepare, or establish something',
        example: 'She set up the meeting for Monday morning.',
        extraExamples: [
          'They set up a new company last year.',
          'Can you set up the projector before the presentation?',
        ],
      },
      {
        verb: 'show up',
        meaning: 'to arrive or appear somewhere',
        example: 'He finally showed up an hour late.',
        extraExamples: [
          'Only ten people showed up to the event despite two hundred RSVPs.',
          'She always shows up on time — never a minute late.',
        ],
      },
      {
        verb: 'pick up',
        meaning: 'to collect someone or something, or to learn informally',
        example: 'I picked up Spanish while living in Madrid.',
        extraExamples: [
          'Can you pick up the kids from school today?',
          'He picked up some useful tips from the workshop.',
        ],
      },
      {
        verb: 'grow up',
        meaning: 'to develop from a child into an adult',
        example: 'I grew up in a small town near the coast.',
        extraExamples: [
          'She grew up speaking three languages at home.',
          'He wants to be an astronaut when he grows up.',
        ],
      },
      {
        verb: 'make up',
        meaning: 'to invent something, or to reconcile after an argument',
        example: 'She made up a story to avoid getting in trouble.',
        extraExamples: [
          'They argued on Monday but made up by Wednesday.',
          'He made up an excuse for missing the deadline.',
        ],
      },
      {
        verb: 'use up',
        meaning: 'to consume or exhaust the entire supply of something',
        example: "We've used up all the milk — can you buy more?",
        extraExamples: [
          'The long hike used up all of our energy.',
          'She used up her annual leave in just two months.',
        ],
      },
      {
        verb: 'turn up',
        meaning: 'to increase volume or intensity, or to appear unexpectedly',
        example: 'Turn up the music — I love this song!',
        extraExamples: [
          'My lost keys turned up behind the sofa cushion.',
          'He turned up at the party without being invited.',
        ],
      },
      {
        verb: 'wake up',
        meaning: 'to stop sleeping, or to become aware of something',
        example: 'I wake up at 6 every morning without an alarm.',
        extraExamples: [
          'The noise from the street woke me up at 3 AM.',
          'She needs to wake up to the reality of the situation.',
        ],
      },
    ],
  },
  {
    particle: 'OUT',
    emoji: '↗️',
    coreMeaning: 'Outward movement, emergence, or completion',
    visualMetaphor:
      'Picture a bird flying out of a cage — OUT suggests leaving an enclosed space, being revealed, or reaching the outside world.',
    patternExplanation:
      'OUT often means something leaves a container or state ("get out"), is distributed ("hand out"), reaches its limit ("burn out"), or is discovered ("find out"). It also signals surpassing ("stand out").',
    speakingPrompts: [
      'Describe a time you "found out" surprising news. How did it change things for you?',
      'Talk about what makes you "stand out" from the people around you. What is unique about you?',
      'Describe a moment when you completely "burned out." What caused it and how did you recover?',
      'Talk about a problem you had to "figure out" on your own without anyone\'s help.',
      'Describe a time when things "worked out" better than you expected. What happened?',
      'Talk about a skill or talent you want to "bring out" more in your daily life.',
      'Describe a time you "ran out" of something important at the worst possible moment.',
      'Talk about a plan or project you had to "carry out" under pressure. How did it go?',
      'Describe something you have been "putting off" finding out. Why are you avoiding it?',
      'Talk about a time when a secret "came out." How did people react?',
    ],
    phrasalVerbs: [
      {
        verb: 'find out',
        meaning: 'to discover or learn information',
        example: 'I found out she was moving to London next month.',
        extraExamples: [
          'How did you find out about the job opening?',
          'He found out the truth after reading her diary.',
        ],
      },
      {
        verb: 'stand out',
        meaning: 'to be clearly noticeable or better than others',
        example: 'Her red dress made her stand out in the crowd.',
        extraExamples: [
          'His creativity really stands out in every project he does.',
          'That blue building stands out among all the grey ones.',
        ],
      },
      {
        verb: 'run out',
        meaning: 'to have no more of something left',
        example: "We've run out of coffee — I'll go buy some.",
        extraExamples: [
          'The car stopped because we ran out of petrol.',
          'She ran out of time before she could finish the exam.',
        ],
      },
      {
        verb: 'work out',
        meaning: 'to exercise, or to result in a good or expected way',
        example: 'It all worked out in the end, luckily.',
        extraExamples: [
          'She works out at the gym three times a week.',
          "I hope things work out between them — they're great together.",
        ],
      },
      {
        verb: 'point out',
        meaning: 'to draw attention to something',
        example: 'He pointed out a mistake in my essay.',
        extraExamples: [
          'She pointed out that the contract was missing a signature.',
          'Can you point out which one is your house on the map?',
        ],
      },
      {
        verb: 'burn out',
        meaning: 'to become exhausted from overwork',
        example: 'She burned out after working 80-hour weeks for months.',
        extraExamples: [
          'Many teachers burn out within their first five years.',
          'He burned out completely and had to take a long break.',
        ],
      },
      {
        verb: 'carry out',
        meaning: 'to complete or perform a task or plan',
        example: 'The team carried out the plan perfectly.',
        extraExamples: [
          'The surgery was carried out by a specialist.',
          'Police carried out a search of the building.',
        ],
      },
      {
        verb: 'hand out',
        meaning: 'to distribute something to several people',
        example: 'They handed out free samples at the entrance.',
        extraExamples: [
          'The teacher handed out the exam papers at 9 AM.',
          'Volunteers handed out food to people in need.',
        ],
      },
      {
        verb: 'figure out',
        meaning: 'to understand or solve something through thinking',
        example: "I can't figure out this puzzle — it's too hard.",
        extraExamples: [
          'It took me a week to figure out how to use the new software.',
          'She finally figured out why the engine kept stopping.',
        ],
      },
      {
        verb: 'turn out',
        meaning: 'to result in a particular way, or to appear or arrive',
        example: 'The party turned out to be absolutely amazing.',
        extraExamples: [
          'It turned out that he had been right all along.',
          'Thousands of people turned out for the concert.',
        ],
      },
    ],
  },
  {
    particle: 'OFF',
    emoji: '🔴',
    coreMeaning: 'Separation, disconnection, or departure',
    visualMetaphor:
      'Think of a switch turning off — OFF suggests cutting a connection, departing, or removing something from its original position.',
    patternExplanation:
      'OFF often indicates stopping ("turn off"), leaving ("take off"), removing ("cut off"), or completing ("finish off"). It can also mean something explodes or triggers ("go off").',
    speakingPrompts: [
      'Talk about a time you had to "call off" an important event or plan. What happened?',
      'Describe something that has really "put you off" recently — a food, habit, or experience.',
      'Talk about a time when something finally "paid off" after a long period of hard work.',
      'Describe a moment when you "took off" on an adventure without much planning.',
      'Talk about something you always "put off" doing. Why do you keep avoiding it?',
      'Describe a time an alarm or phone "went off" at the worst possible moment.',
      'Talk about a person or activity you had to "cut off" from your life. Was it the right decision?',
      'Describe something you like to "show off" about yourself. Are you proud of it?',
      'Talk about a time you had to "drop off" something or someone important. How did it feel?',
      'Describe how you "set off" on a journey — a trip, a new job, or a big life change.',
    ],
    phrasalVerbs: [
      {
        verb: 'take off',
        meaning: 'to leave the ground, or to remove clothing, or to become successful',
        example: 'The plane takes off at noon — we need to hurry.',
        extraExamples: [
          'Take off your shoes before entering the house.',
          'Her career really took off after her first viral video.',
        ],
      },
      {
        verb: 'turn off',
        meaning: 'to stop a device or light, or to cause someone to lose interest',
        example: 'Please turn off the lights when you leave.',
        extraExamples: [
          'His rude behaviour turned everyone off immediately.',
          'Did you turn off the oven before we left?',
        ],
      },
      {
        verb: 'put off',
        meaning: 'to postpone something, or to cause someone to dislike something',
        example: "Don't put off what you can do today.",
        extraExamples: [
          'The bad reviews put me off going to that restaurant.',
          'They put off the meeting until next Thursday.',
        ],
      },
      {
        verb: 'call off',
        meaning: 'to cancel something that was planned',
        example: 'They called off the game due to heavy rain.',
        extraExamples: [
          'She called off the wedding two weeks before the date.',
          'The strike was called off after negotiations succeeded.',
        ],
      },
      {
        verb: 'go off',
        meaning: 'to explode, to ring loudly, or for food to spoil',
        example: 'My alarm went off at 5 AM this morning.',
        extraExamples: [
          "The milk has gone off — smell it, it's awful.",
          'A bomb went off in the city centre last night.',
        ],
      },
      {
        verb: 'pay off',
        meaning: 'to produce a good result after effort, or to repay a debt fully',
        example: 'All that hard work finally paid off.',
        extraExamples: [
          'She paid off her student loan in just three years.',
          'Studying every day paid off — she got the highest grade.',
        ],
      },
      {
        verb: 'show off',
        meaning: 'to display your abilities or possessions to impress others',
        example: 'She loves to show off her cooking skills.',
        extraExamples: [
          'He was showing off in front of his friends on the football pitch.',
          'Stop showing off and just get on with the work.',
        ],
      },
      {
        verb: 'drop off',
        meaning: 'to deliver someone or something, or to fall asleep',
        example: 'He dropped off the kids at school at 8 AM.',
        extraExamples: [
          'I dropped off the package at the post office.',
          'She dropped off on the sofa while watching TV.',
        ],
      },
      {
        verb: 'cut off',
        meaning: 'to interrupt, separate, or stop the supply of something',
        example: 'The storm cut off electricity to the whole village.',
        extraExamples: [
          'He was cut off mid-sentence by his boss.',
          'They cut off her phone contract after she missed three payments.',
        ],
      },
      {
        verb: 'set off',
        meaning: 'to start a journey, or to cause something to begin',
        example: 'We set off early to avoid the morning traffic.',
        extraExamples: [
          'The smoke set off the fire alarm in the building.',
          'They set off on their road trip at dawn.',
        ],
      },
    ],
  },
  {
    particle: 'ON',
    emoji: '🟢',
    coreMeaning: 'Continuation, activation, or attachment',
    visualMetaphor:
      'Like a light being switched on — ON represents continuation, something being active, or an ongoing connection.',
    patternExplanation:
      'ON often means continuing ("carry on"), activating ("switch on"), depending ("rely on"), or wearing/attaching ("put on"). It also signals progress in time ("move on").',
    speakingPrompts: [
      'Talk about something you "carry on" doing despite challenges or setbacks.',
      'Describe how you "move on" from difficult situations. What helps you the most?',
      'Talk about something or someone you "rely on" every single day. Why are they so important?',
      'Describe a responsibility you recently had to "take on." Are you handling it well?',
      'Talk about a time you needed to "hold on" through a tough period. How did you manage?',
      'Describe something strange that is "going on" in your neighborhood, workplace, or social circle.',
      'Talk about a trend or idea that you think will "catch on" in the future.',
      'Describe how you are "getting on" with a current project or life goal.',
      'Talk about someone you regularly "check on." Why is it important to you?',
      'Describe a habit or routine that you "keep on" doing even when you know you should stop.',
    ],
    phrasalVerbs: [
      {
        verb: 'carry on',
        meaning: 'to continue doing something',
        example: "Carry on — you're doing a great job!",
        extraExamples: [
          'Despite the rain, they carried on with the outdoor event.',
          'She carried on working even after everyone else had left.',
        ],
      },
      {
        verb: 'move on',
        meaning: 'to stop dwelling on something and progress forward',
        example: "It's time to move on from the past.",
        extraExamples: [
          'After the breakup, it took her a year to move on.',
          "Let's move on to the next topic — we're running out of time.",
        ],
      },
      {
        verb: 'put on',
        meaning: 'to place clothing on your body, or to perform or stage something',
        example: "Put on a jacket — it's cold outside.",
        extraExamples: [
          'The school put on a brilliant theatre performance.',
          'She put on her reading glasses to check the menu.',
        ],
      },
      {
        verb: 'take on',
        meaning: 'to accept responsibility, or to hire someone',
        example: 'She took on three new projects at once.',
        extraExamples: [
          'The company is taking on fifty new employees this month.',
          "Don't take on more than you can handle.",
        ],
      },
      {
        verb: 'rely on',
        meaning: 'to depend on someone or something with confidence',
        example: 'I rely on coffee to get through Monday mornings.',
        extraExamples: [
          'You can always rely on her — she never lets people down.',
          'The whole team relies on his technical expertise.',
        ],
      },
      {
        verb: 'check on',
        meaning: 'to visit or contact someone to see if they are okay',
        example: "I'll check on grandma after work today.",
        extraExamples: [
          'The nurse checked on the patient every two hours.',
          'He called to check on her after hearing she was ill.',
        ],
      },
      {
        verb: 'hold on',
        meaning: 'to wait, or to grip something tightly',
        example: "Hold on, I'll be right back in a minute.",
        extraExamples: [
          'Hold on to the railing — the steps are slippery.',
          'Hold on — I think I left my keys inside.',
        ],
      },
      {
        verb: 'go on',
        meaning: 'to continue, or to happen',
        example: "What's going on here? Everyone looks upset.",
        extraExamples: [
          'Go on — tell me what happened next.',
          'The concert went on for three hours without a break.',
        ],
      },
      {
        verb: 'catch on',
        meaning: 'to become popular, or to understand something',
        example: 'She catches on to new concepts very quickly.',
        extraExamples: [
          'The trend caught on quickly across social media.',
          'It took me a while to catch on to what he was trying to say.',
        ],
      },
      {
        verb: 'get on',
        meaning: 'to progress, or to board a vehicle, or to have a good relationship',
        example: 'How are you getting on with the new project?',
        extraExamples: [
          'We need to get on the train before it leaves.',
          'She gets on really well with her new colleagues.',
        ],
      },
    ],
  },
  {
    particle: 'OVER',
    emoji: '🌐',
    coreMeaning: 'Crossing, examining, or excess',
    visualMetaphor:
      'Imagine a bridge going over a river — OVER suggests crossing a boundary, reviewing something thoroughly, or going beyond a limit.',
    patternExplanation:
      'OVER often means examining ("look over"), recovering ("get over"), repeating ("do over"), or surpassing a limit ("spill over"). It can also mean something dominates ("take over").',
    speakingPrompts: [
      'Describe how you "get over" a disappointment. Do you have a strategy or ritual?',
      'Talk about a time you had to "take over" a task or responsibility from someone else.',
      'Describe a decision you wish you could "do over." What would you change?',
      'Talk about a time you had to "think something over" before giving your answer.',
      'Describe a friend or family member who "comes over" often. What do you do together?',
      'Talk about a meeting or event that "ran over" its scheduled time. How did it affect you?',
      'Describe a document, contract, or plan you carefully "looked over." What did you find?',
      'Talk about a situation where emotions "spilled over" into your professional or public life.',
      'Describe a time when you "handed over" an important responsibility. Was it hard to let go?',
      'Talk about something you "rolled over" in your mind for days before making a decision.',
    ],
    phrasalVerbs: [
      {
        verb: 'get over',
        meaning: 'to recover from something difficult or surprising',
        example: "I still can't get over how delicious that meal was.",
        extraExamples: [
          'It took him months to get over the loss of his job.',
          'She got over her fear of flying after therapy.',
        ],
      },
      {
        verb: 'take over',
        meaning: 'to assume control or responsibility',
        example: 'She took over as manager last month.',
        extraExamples: [
          'A large company took over the small local business.',
          'Can you take over while I take a short break?',
        ],
      },
      {
        verb: 'look over',
        meaning: 'to examine or review something carefully',
        example: 'Can you look over my CV before I send it?',
        extraExamples: [
          'The lawyer looked over the contract before signing.',
          'Please look over these figures — something seems wrong.',
        ],
      },
      {
        verb: 'think over',
        meaning: 'to consider something carefully before deciding',
        example: "I'll think it over and let you know by Friday.",
        extraExamples: [
          'Think it over carefully — it\'s a big commitment.',
          'She thought over the offer for a week before accepting.',
        ],
      },
      {
        verb: 'come over',
        meaning: 'to visit someone at their home',
        example: "Why don't you come over for dinner on Saturday?",
        extraExamples: [
          'A feeling of sadness suddenly came over her.',
          'His friends came over to help him move the furniture.',
        ],
      },
      {
        verb: 'run over',
        meaning: 'to exceed a time limit, or to hit someone with a vehicle',
        example: 'The meeting ran over by twenty minutes.',
        extraExamples: [
          'A car ran over the box that had fallen into the road.',
          "We've run over budget — we need to cut costs.",
        ],
      },
      {
        verb: 'go over',
        meaning: 'to review or examine something in detail',
        example: "Let's go over the plan one more time before the meeting.",
        extraExamples: [
          'The teacher went over the exam answers with the class.',
          'Can we go over the main points again quickly?',
        ],
      },
      {
        verb: 'turn over',
        meaning: 'to flip something to the other side, or to hand to authority',
        example: 'Turn over the page when you are ready to continue.',
        extraExamples: [
          'He turned over the evidence to the police.',
          'The pancake is ready — turn it over now.',
        ],
      },
      {
        verb: 'hand over',
        meaning: 'to give something to someone else, especially formally',
        example: 'He handed over the documents to the new manager.',
        extraExamples: [
          'The criminal handed himself over to the authorities.',
          'She handed over her phone when asked at the border.',
        ],
      },
      {
        verb: 'roll over',
        meaning: 'to turn onto the other side, or to transfer a balance',
        example: 'She rolled over in her sleep and fell off the bed.',
        extraExamples: [
          'The unused budget rolled over into the next financial year.',
          'The dog learned to roll over on command.',
        ],
      },
    ],
  },
  {
    particle: 'THROUGH',
    emoji: '🚇',
    coreMeaning: 'Completion from start to finish, or penetrating',
    visualMetaphor:
      'Like a train going through a tunnel — THROUGH suggests passing completely from one side to another, finishing something thoroughly.',
    patternExplanation:
      'THROUGH often means completing something ("follow through"), experiencing difficulty ("go through"), or examining closely ("look through"). It signals a full journey from start to end.',
    speakingPrompts: [
      'Talk about a difficult period you "went through" and what helped you survive it.',
      'Describe a time you had to "get through" to someone who was not listening. What did you do?',
      'Talk about a promise or plan you always "follow through" on. Why is it important to you?',
      'Describe a moment when you "pulled through" against the odds. How did it feel?',
      'Talk about a book, film, or report you recently "read through" or "sat through." Was it worth it?',
      'Describe a breakthrough moment in your learning journey. What "broke through" for you?',
      'Talk about something you "saw through" — a lie, a bad plan, or a misleading promise.',
      'Describe a time when help or good news finally "came through" after a long wait.',
      'Talk about a plan you "carried through" to the very end despite obstacles.',
      'Describe a time you had to "look through" a large amount of information to find something important.',
    ],
    phrasalVerbs: [
      {
        verb: 'go through',
        meaning: 'to experience a difficult situation, or to examine in detail',
        example: 'We went through all the options carefully.',
        extraExamples: [
          'She went through a very tough time after her divorce.',
          'Let\'s go through the report section by section.',
        ],
      },
      {
        verb: 'get through',
        meaning: 'to successfully contact someone, or to survive something difficult',
        example: "I can't get through to her — she's not answering.",
        extraExamples: [
          'I don\'t know how I got through those first months alone.',
          'He finally got through all the paperwork.',
        ],
      },
      {
        verb: 'follow through',
        meaning: 'to complete something you started or promised',
        example: 'He always follows through on his promises.',
        extraExamples: [
          'She came up with the idea but never followed through.',
          'In tennis, following through on your swing is essential.',
        ],
      },
      {
        verb: 'pull through',
        meaning: 'to survive or recover from a serious illness or difficulty',
        example: 'The patient pulled through after emergency surgery.',
        extraExamples: [
          'The business was struggling, but they pulled through.',
          'We all pulled through the crisis together as a team.',
        ],
      },
      {
        verb: 'look through',
        meaning: 'to examine or read something quickly or carefully',
        example: 'I looked through all the old photos last night.',
        extraExamples: [
          'Could you look through these notes and correct any errors?',
          'She looked through the window but saw nothing unusual.',
        ],
      },
      {
        verb: 'break through',
        meaning: 'to overcome a barrier or make an important discovery',
        example: 'Scientists broke through with a major new treatment.',
        extraExamples: [
          'After months of practice, she finally broke through her plateau.',
          'The sun broke through the clouds in the afternoon.',
        ],
      },
      {
        verb: 'see through',
        meaning: 'to recognise that something is not true, or to complete something',
        example: 'I can see through his lies immediately.',
        extraExamples: [
          'She saw through his fake smile right away.',
          'He saw the project through to the very end.',
        ],
      },
      {
        verb: 'come through',
        meaning: 'to succeed or arrive after being awaited',
        example: 'Help finally came through after three long weeks.',
        extraExamples: [
          'Her test results came through this morning.',
          'He always comes through when people need him most.',
        ],
      },
      {
        verb: 'carry through',
        meaning: 'to complete something successfully despite difficulty',
        example: 'She carried her plan through despite all the obstacles.',
        extraExamples: [
          'His determination carried him through the hardest moments.',
          'The reforms were carried through by the new government.',
        ],
      },
      {
        verb: 'read through',
        meaning: 'to read something from beginning to end',
        example: 'Read through the whole contract before you sign.',
        extraExamples: [
          'I read through my essay twice before submitting it.',
          'She read through the instructions carefully.',
        ],
      },
    ],
  },
  {
    particle: 'AWAY',
    emoji: '🏃',
    coreMeaning: 'Distance, removal, or continuous action',
    visualMetaphor:
      'Picture someone walking into the horizon — AWAY suggests distance from a starting point, disappearance, or doing something continuously without stopping.',
    patternExplanation:
      'AWAY often means moving to a distance ("go away"), disappearing ("fade away"), continuous action ("work away"), or storing something ("put away"). It can also suggest giving freely ("give away").',
    speakingPrompts: [
      'Describe your dream "getaway." Where would you go and what would you do there?',
      'Talk about something you find impossible to "throw away." Why do you keep it?',
      'Describe a memory that has "faded away" over time. Do you wish you could remember it better?',
      'Talk about something you "gave away" that you later wished you had kept.',
      'Describe a habit or feeling you are trying to "move away" from in your life.',
      'Talk about a time you had to "look away" from something difficult. How did it make you feel?',
      'Describe how you "put away" money or resources for the future. Are you good at saving?',
      'Talk about something you were "working away" at for months. Did you finish it?',
      'Describe a time when you felt like "running away" from a situation. Did you stay or go?',
      'Talk about something that was "taken away" from you unexpectedly. How did you cope?',
    ],
    phrasalVerbs: [
      {
        verb: 'go away',
        meaning: 'to leave a place or person, or for something to disappear',
        example: 'The headache finally went away after I rested.',
        extraExamples: [
          'They went away for the weekend to the mountains.',
          'Just go away — I need some time alone.',
        ],
      },
      {
        verb: 'give away',
        meaning: 'to give something for free, or to reveal a secret',
        example: "Don't give away the ending of the film!",
        extraExamples: [
          'She gave away all her old clothes to charity.',
          'His nervous smile gave away the fact that he was lying.',
        ],
      },
      {
        verb: 'put away',
        meaning: 'to place something in its proper storage place',
        example: "Put away your toys when you're done playing.",
        extraExamples: [
          'Can you put the dishes away after washing them?',
          'She puts away a little money every week for emergencies.',
        ],
      },
      {
        verb: 'throw away',
        meaning: 'to discard something in the bin, or to waste an opportunity',
        example: "Don't throw away those leftovers — I'll eat them tomorrow.",
        extraExamples: [
          'He threw away a great opportunity by arriving late.',
          'She threw away all his letters without reading them.',
        ],
      },
      {
        verb: 'get away',
        meaning: 'to escape or manage to leave, or to go on a short holiday',
        example: 'We need to get away for the weekend — I\'m exhausted.',
        extraExamples: [
          'The thief got away before the police arrived.',
          "You can't get away with cheating in this class.",
        ],
      },
      {
        verb: 'take away',
        meaning: 'to remove something, or food ordered to eat elsewhere',
        example: "What's the main takeaway from today's lesson?",
        extraExamples: [
          'The teacher took away his phone during the exam.',
          "Let's get a takeaway tonight — I don't feel like cooking.",
        ],
      },
      {
        verb: 'run away',
        meaning: 'to flee from a place or situation',
        example: 'The cat ran away from the loud thunderstorm.',
        extraExamples: [
          "You can't run away from your problems forever.",
          'He ran away from home at the age of sixteen.',
        ],
      },
      {
        verb: 'fade away',
        meaning: 'to gradually become less strong, clear, or visible',
        example: 'The memory slowly faded away over the years.',
        extraExamples: [
          'The music faded away as the car drove into the distance.',
          'His confidence faded away after the harsh criticism.',
        ],
      },
      {
        verb: 'look away',
        meaning: 'to turn your eyes away from something',
        example: 'She looked away in embarrassment.',
        extraExamples: [
          'I had to look away during the scary part of the film.',
          "Don't look away — watch carefully or you'll miss it.",
        ],
      },
      {
        verb: 'save away',
        meaning: 'to regularly store or set aside money or resources',
        example: 'He saves away a portion of his salary every month.',
        extraExamples: [
          "She's been saving away for a trip to Japan for two years.",
          'They saved away enough to buy a house by thirty.',
        ],
      },
    ],
  },
  {
    particle: 'BACK',
    emoji: '↩️',
    coreMeaning: 'Return, reversal, or doing something in response',
    visualMetaphor:
      'Think of a boomerang returning — BACK indicates returning to an original position, reversing an action, or responding to something done to you.',
    patternExplanation:
      'BACK often means returning ("come back"), responding ("talk back"), reversing ("cut back"), or restraining ("hold back"). It signals a reversal or return to a previous state.',
    speakingPrompts: [
      'Talk about something you said or did that you wish you could "take back."',
      'Describe a time you "held back" your true feelings. Was it the right decision?',
      'Talk about a place you love to "come back" to again and again. What makes it special?',
      'Describe a time you had to "pay back" a debt — financial or emotional.',
      'Talk about something from your past you like to "look back" on with pride.',
      'Describe a time when you "fought back" against an unfair situation.',
      'Talk about a habit or expense you had to "cut back" on. How did it affect your life?',
      'Describe a time something "set you back" significantly. How did you recover?',
      'Talk about a time you had to "call someone back" with important news.',
      'Describe a skill or relationship you want to "bring back" into your life.',
    ],
    phrasalVerbs: [
      {
        verb: 'come back',
        meaning: 'to return to a place or person',
        example: 'Come back anytime — you are always welcome here.',
        extraExamples: [
          'When are you coming back from your trip?',
          'The pain came back after she stopped taking the medicine.',
        ],
      },
      {
        verb: 'give back',
        meaning: 'to return something to its owner',
        example: "Please give back my pen when you're done.",
        extraExamples: [
          'He gave back the money he had borrowed.',
          'She gave back the library books a week late.',
        ],
      },
      {
        verb: 'hold back',
        meaning: 'to restrain yourself or prevent something from progressing',
        example: 'She held back her tears during the speech.',
        extraExamples: [
          "Don't hold back — say exactly what you think.",
          'Fear was holding him back from applying for the job.',
        ],
      },
      {
        verb: 'pay back',
        meaning: 'to repay money owed, or to get revenge',
        example: "I'll pay you back as soon as I get paid.",
        extraExamples: [
          'She paid back every cent she had borrowed.',
          "He said he'd pay them back for what they did to him.",
        ],
      },
      {
        verb: 'call back',
        meaning: 'to return a phone call',
        example: "I'm busy right now — I'll call you back in ten minutes.",
        extraExamples: [
          'She called back as soon as she saw the missed call.',
          'The doctor said she would call back with the test results.',
        ],
      },
      {
        verb: 'look back',
        meaning: 'to think about or review the past',
        example: 'Looking back, I think I made the right choice.',
        extraExamples: [
          "Don't spend your life looking back — focus on the future.",
          'She looked back on her childhood with great fondness.',
        ],
      },
      {
        verb: 'take back',
        meaning: 'to retract something said, or to return a purchase',
        example: "I take back what I said — I was wrong.",
        extraExamples: [
          'She took the faulty product back to the shop.',
          "I can't take back the words I said that night.",
        ],
      },
      {
        verb: 'cut back',
        meaning: 'to reduce the amount of something',
        example: "We need to cut back on unnecessary expenses.",
        extraExamples: [
          "He's trying to cut back on sugar and processed food.",
          'The government cut back funding for public services.',
        ],
      },
      {
        verb: 'get back',
        meaning: 'to return to a place or state, or to contact someone again',
        example: "I'll get back to you on that — give me a day.",
        extraExamples: [
          'What time did you get back from the party?',
          'It took her months to get back to her normal routine.',
        ],
      },
      {
        verb: 'set back',
        meaning: 'to delay or hinder progress',
        example: 'The flooding set back the construction by months.',
        extraExamples: [
          'The injury set him back just before the championship.',
          'A technical failure set the launch back by two weeks.',
        ],
      },
    ],
  },
  {
    particle: 'AROUND',
    emoji: '🔄',
    coreMeaning: 'Circular movement, exploration, or approximation',
    visualMetaphor:
      'Imagine walking in a circle exploring a new neighborhood — AROUND suggests moving in a circle, exploring an area, or finding a way to deal with obstacles.',
    patternExplanation:
      'AROUND often means moving in circles ("go around"), exploring ("look around"), avoiding ("get around"), or existing in an area ("hang around"). It can suggest rotation or circumvention.',
    speakingPrompts: [
      'Describe how you prefer to "get around" a city you love. What is your favourite way to travel?',
      'Talk about a time you "turned around" a bad situation through creativity or persistence.',
      'Describe a place where you like to "hang around" and why it feels comfortable.',
      'Talk about someone who tries to "boss you around." How do you handle it?',
      'Describe a time when there was not enough of something to "go around." How was it managed?',
      'Talk about a time you "came around" to an idea you initially rejected.',
      'Describe a rule or obstacle you found a clever way to "get around."',
      'Talk about something you "carry around" with you everywhere. Why is it important?',
      'Describe a time you were just "messing around" and accidentally discovered something great.',
      'Talk about a time you had to "wait around" for a long time. How did you keep yourself occupied?',
    ],
    phrasalVerbs: [
      {
        verb: 'get around',
        meaning: 'to travel from place to place, or to avoid a problem',
        example: "It's easy to get around the city by bicycle.",
        extraExamples: [
          'She gets around using public transport every day.',
          'They found a clever way to get around the restriction.',
        ],
      },
      {
        verb: 'look around',
        meaning: 'to explore a place by looking in different directions',
        example: 'Feel free to look around the shop.',
        extraExamples: [
          'We spent the morning looking around the old town.',
          'She looked around nervously before entering the building.',
        ],
      },
      {
        verb: 'hang around',
        meaning: 'to spend time waiting in a place, or to spend time with someone',
        example: 'We hung around the café all afternoon talking.',
        extraExamples: [
          'Stop hanging around and do something productive.',
          'He hangs around with the wrong crowd at school.',
        ],
      },
      {
        verb: 'turn around',
        meaning: 'to face or move in the opposite direction, or to improve a situation',
        example: "The company turned around its losses in just one year.",
        extraExamples: [
          'Turn around — there\'s something behind you.',
          'The new coach turned the team around completely.',
        ],
      },
      {
        verb: 'go around',
        meaning: 'to move in a circle, or to be enough for everyone',
        example: "There isn't enough cake to go around — we need more.",
        extraExamples: [
          'A rumour is going around that the office is closing.',
          'We had to go around the roadblock.',
        ],
      },
      {
        verb: 'come around',
        meaning: 'to change your opinion, or to visit, or to regain consciousness',
        example: "She'll come around to the idea eventually.",
        extraExamples: [
          'Christmas comes around so quickly every year.',
          'He came around after a few minutes and asked what happened.',
        ],
      },
      {
        verb: 'mess around',
        meaning: 'to waste time, or to behave in a silly or irresponsible way',
        example: "Stop messing around and focus on your work!",
        extraExamples: [
          'The children were messing around in the garden.',
          "Don't mess around with people's feelings.",
        ],
      },
      {
        verb: 'boss around',
        meaning: 'to tell people what to do in a domineering way',
        example: 'He keeps bossing everyone around the office.',
        extraExamples: [
          "I won't let anyone boss me around.",
          'She hates being bossed around by her older brother.',
        ],
      },
      {
        verb: 'fool around',
        meaning: 'to waste time or behave in a silly way',
        example: "We're just fooling around — don't take it seriously.",
        extraExamples: [
          'Stop fooling around — this is serious.',
          'They spent the afternoon fooling around at the beach.',
        ],
      },
      {
        verb: 'carry around',
        meaning: 'to have something with you at all times',
        example: 'She carries a notebook around with her everywhere.',
        extraExamples: [
          "He's been carrying around that stress for months.",
          'I always carry a spare pen around just in case.',
        ],
      },
    ],
  },
  {
    particle: 'DOWN',
    emoji: '⬇️',
    coreMeaning: 'Decrease, failure, or settling into position',
    visualMetaphor:
      'Picture a leaf falling from a tree — DOWN suggests something decreasing, settling, being written/recorded, or stopping completely.',
    patternExplanation:
      'DOWN often means reducing ("calm down"), failing or stopping ("break down"), recording ("write down"), or subduing ("pin down"). It can also signal settling comfortably ("sit down").',
    speakingPrompts: [
      'Talk about a time you felt "let down" by someone you trusted. How did you handle it?',
      'Describe how you "calm down" when you are stressed or overwhelmed.',
      'Talk about a time something important "broke down" — a machine, a plan, or a relationship.',
      'Describe something you always "write down" to help you remember. Why does it work for you?',
      'Talk about a time you had to "slow down" in life. What forced you to do it?',
      'Describe something you are trying to "cut down" on right now. Is it going well?',
      'Talk about a time you "turned down" an opportunity. Do you think you made the right choice?',
      'Describe a time when you had to "knuckle down" and focus on something difficult.',
      'Talk about a feeling or habit you are trying to "pin down" and understand better.',
      'Describe a time when you had to "back down" from a position or argument. Was it difficult?',
    ],
    phrasalVerbs: [
      {
        verb: 'break down',
        meaning: 'to stop functioning, or to lose emotional control, or to analyse something',
        example: 'My car broke down on the motorway this morning.',
        extraExamples: [
          'She broke down in tears when she heard the news.',
          "Let's break down the problem into smaller parts.",
        ],
      },
      {
        verb: 'calm down',
        meaning: 'to become less upset, excited, or agitated',
        example: 'Take a deep breath and calm down.',
        extraExamples: [
          "Calm down — everything is going to be fine.",
          'It took him an hour to calm down after the argument.',
        ],
      },
      {
        verb: 'let down',
        meaning: 'to disappoint someone who was counting on you',
        example: "I don't want to let you down after all your support.",
        extraExamples: [
          'He let the whole team down by not showing up.',
          'She felt let down when her friend cancelled at the last minute.',
        ],
      },
      {
        verb: 'write down',
        meaning: 'to record something on paper or digitally',
        example: 'Write down your ideas before you forget them.',
        extraExamples: [
          'She wrote down every word he said during the interview.',
          'I always write down new vocabulary I learn.',
        ],
      },
      {
        verb: 'sit down',
        meaning: 'to move from standing to a seated position',
        example: "Please sit down — the presentation is about to begin.",
        extraExamples: [
          'Sit down and tell me exactly what happened.',
          'She sat down heavily after a long day on her feet.',
        ],
      },
      {
        verb: 'slow down',
        meaning: 'to move or happen at a reduced speed',
        example: "Slow down — you're driving way too fast.",
        extraExamples: [
          'The doctor told him to slow down and reduce his stress.',
          'Business slows down a lot during the summer months.',
        ],
      },
      {
        verb: 'cut down',
        meaning: 'to reduce the amount or number of something',
        example: "I'm cutting down on sugar this month.",
        extraExamples: [
          'They cut down the old tree to build the new road.',
          "He's trying to cut down on the hours he works.",
        ],
      },
      {
        verb: 'turn down',
        meaning: 'to refuse an offer, or to reduce the volume or level of something',
        example: 'She turned down the job offer — the salary was too low.',
        extraExamples: [
          'Can you turn down the TV? I\'m trying to concentrate.',
          'He was turned down for the promotion three times.',
        ],
      },
      {
        verb: 'knock down',
        meaning: 'to demolish a structure, or to reduce a price',
        example: 'They knocked down the old factory to build flats.',
        extraExamples: [
          'She was knocked down by a cyclist on the pavement.',
          'He managed to knock down the price by negotiating.',
        ],
      },
      {
        verb: 'pin down',
        meaning: 'to identify something precisely, or to force someone to commit to something',
        example: "I can't pin down exactly what's bothering me.",
        extraExamples: [
          'It\'s hard to pin down the exact cause of the problem.',
          "I've been trying to pin him down to a meeting all week.",
        ],
      },
    ],
  },
];
