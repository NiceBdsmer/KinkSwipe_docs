export const stringsEn = {
  welcome: {
    title: 'KinkSwipe',
    tagline: 'Discover your preferences together',
    startSwiping: 'Start Swiping',
    selectCategories: 'Select Categories',
    loadLink: 'Load Link'
  },
  onboarding: {
    roleTitle: 'How do you want to explore?',
    roleGiver: 'As Giver',
    roleReceiver: 'As Receiver',
    roleBoth: 'Both',
    experienceTitle: 'What is your experience level?',
    experienceNewbie: 'Newbie',
    experienceCurious: 'Curious',
    experienceExperienced: 'Experienced',
    safetyTitle: 'Safety First',
    safetyText: 'Kink activities can carry physical and emotional risks. Always communicate clearly, respect boundaries, and practice safer sex techniques.',
    safetyAgree: 'I understand and agree',
    back: 'Back',
    continue: 'Continue'
  },
  swipe: {
    yes: 'YES',
    maybe: 'MAYBE',
    meh: 'MEH',
    nope: 'NOPE',
    skipCategory: 'Skip Category',
    roundComplete: {
      title: 'Round Complete!',
      message: 'You rated all activities as Giver. Want to continue as Receiver?',
      yes: 'Continue',
      no: 'View Summary'
    }
  },
  summary: {
    title: 'Your Results',
    yesCount: 'You said YES to',
    maybeCount: 'MAYBE to',
    mehCount: 'MEH to',
    nopeCount: 'NOPE to',
    copyLink: 'Copy Link',
    copyText: 'Copy Text',
    downloadImage: 'Download Image',
    addCustom: 'Add Custom',
    readOnly: 'This is someone else’s list',
    startOwn: 'Start your own',
    give: 'As Giver',
    receive: 'As Receiver'
  },
  edge: {
    warning: 'High Risk Activity',
    info: 'This activity carries significant physical or emotional risks. Requires proper knowledge, safety measures, and communication.'
  },
  categorySelection: {
    title: 'Choose Your Path',
    subtitle: 'Select a category to begin exploring activities',
    overallProgress: 'Overall Progress',
    activities: 'activities',
    completed: 'completed',
    start: 'Start',
    review: 'Review',
    back: 'Back to Menu',
    resetProgress: 'Reset Progress',
    resetConfirm: 'Are you sure you want to reset all your progress? This action cannot be undone.',
    resetCancel: 'Cancel',
    resetConfirmBtn: 'Reset Everything'
  },
  categories: {
    basics: 'Basics',
    basicsDesc: 'Essential fundamentals and safety practices',
    bondage: 'Bondage',
    bondageDesc: 'Restraint and restriction techniques',
    impact: 'Impact',
    impactDesc: 'Spanking, flogging, and impact play',
    sensory: 'Sensory',
    sensoryDesc: 'Sensation exploration and sensory deprivation',
    'power-exchange': 'Power Exchange',
    'power-exchangeDesc': 'Domination, submission, and power dynamics',
    edge: 'Edge Play',
    edgeDesc: 'Advanced and high-intensity activities',
    sexual: 'Sexual',
    sexualDesc: 'Sexual activities and intimate play',
    fetishes: 'Fetishes',
    fetishesDesc: 'Specific fetishes and specialized interests',
    humiliation: 'Humiliation',
    humiliationDesc: 'Humiliation and degradation play'
  },
  tutorial: {
    title: 'How to Swipe',
    heading: 'Swipe to Rate',
    description: 'Swipe cards in different directions to express your preferences',
    swipeRight: 'Interested',
    swipeUp: 'Maybe',
    swipeDown: 'Not sure',
    swipeLeft: 'Not interested',
    dismissHint: 'Swipe any card to start'
  },
  footer: {
    home: 'Home',
    resetAll: 'Reset All'
  }
};

export type Strings = typeof stringsEn;
