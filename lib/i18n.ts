import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'cs' | 'sk' | 'de';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    quests: string;
    videos: string;
    leaderboard: string;
    friends: string;
    profile: string;
    settings: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    done: string;
    back: string;
    next: string;
    search: string;
    searchPlaceholder: string;
    noResults: string;
    points: string;
    followers: string;
    following: string;
    follow: string;
    unfollow: string;
    message: string;
    invite: string;
  };

  // Auth
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
    forgotPassword: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    invalidCredentials: string;
    passwordTooShort: string;
    passwordsDontMatch: string;
    emailRequired: string;
    nicknameRequired: string;
  };

  // Home
  home: {
    greeting: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    welcome: string;
    getStarted: string;
    exploreQuests: string;
    connectFriends: string;
    analytics: string;
    progressGraphs: string;
    notifications: string;
    noNotifications: string;
    noNotificationsDesc: string;
  };

  // Quests
  quests: {
    title: string;
    subtitle: string;
    notifications: string;
    profile: string;
    stats: string;
    bio: string;
    editProfile: string;
    updateBio: string;
    bioPlaceholder: string;
    updateNickname: string;
    nicknamePlaceholder: string;
  };

  // Videos
  videos: {
    title: string;
    subtitle: string;
    comingSoon: string;
    description: string;
    forYou: string;
    friends: string;
  };

  // Search
  friends: {
    title: string;
    party: string;
    partySubtitle: string;
    invite: string;
    joinParty: string;
    friendsCount: string;
    showLess: string;
    showAll: string;
    searchPlaceholder: string;
    loading: string;
    noFriends: string;
    noFriendsSubtext: string;
    noResults: string;
    friendBadge: string;
  };
  search: {
    users: string;
    byNickname: string;
    startTyping: string;
  };

  // Leaderboard
  leaderboard: {
    title: string;
    subtitle: string;
    earnPointsSubtitle: string;
    you: string;
    global: string;
    friends: string;
    rank: string;
    player: string;
    points: string;
    noData: string;
    noGlobalData: string;
    noFriendsData: string;
    loadingError: string;
    testPoints: string;
    pointsAdded: string;
    errorAddingPoints: string;
  };

  // Friends
  friends: {
    title: string;
    subtitle: string;
    searchFriends: string;
    myFriends: string;
    suggestions: string;
    noFriends: string;
    noSuggestions: string;
    addFriend: string;
  };

  // Profile
  profile: {
    title: string;
    editProfile: string;
    stats: string;
    bio: string;
    updateBio: string;
    bioPlaceholder: string;
    updateNickname: string;
    nicknamePlaceholder: string;
    changeAvatar: string;
    profileUpdated: string;
    errorUpdating: string;
    following: string;
    followers: string;
    likes: string;
    seeAnalytics: string;
    posts: string;
    liked: string;
    profilePicture: string;
    nickname: string;
    enterNickname: string;
    tellPeopleAboutYourself: string;
    removePicture: string;
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    account: string;
    privacy: string;
    notifications: string;
    helpSupport: string;
    about: string;
    termsOfService: string;
    dataStorage: string;
    language: string;
    signOut: string;
    
    // Account Modal
    accountSettings: string;
    profileInformation: string;
    email: string;
    nickname: string;
    accountCreated: string;
    accountActions: string;
    changePassword: string;
    exportData: string;
    deleteAccount: string;
    deleteAccountConfirm: string;
    
    // Privacy Modal
    privacySettings: string;
    accountPrivacy: string;
    privateAccount: string;
    privateAccountDesc: string;
    dataCollection: string;
    manageDataCollection: string;
    cookiePreferences: string;
    adPersonalization: string;
    
    // Notifications Modal
    notificationSettings: string;
    pushNotifications: string;
    enableNotifications: string;
    enableNotificationsDesc: string;
    notificationTypes: string;
    likesComments: string;
    newFollowers: string;
    questUpdates: string;
    
    // Help & Support Modal
    getHelp: string;
    faq: string;
    contactSupport: string;
    reportBug: string;
    community: string;
    communityGuidelines: string;
    reportContent: string;
    
    // About Modal
    aboutApp: string;
    version: string;
    appDescription: string;
    legal: string;
    privacyPolicy: string;
    openSourceLicenses: string;
    
    // Data & Storage Modal
    storageUsage: string;
    cacheSize: string;
    mediaStorage: string;
    clearCache: string;
    dataSync: string;
    autoSync: string;
    autoSyncDesc: string;
    
    // Language Modal
    languageSettings: string;
    selectLanguage: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      quests: 'Quests',
      videos: 'Videos',
      leaderboard: 'Leaderboard',
      friends: 'Friends',
      profile: 'Profile',
      settings: 'Settings',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      done: 'Done',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      searchPlaceholder: 'Search...',
      noResults: 'No results found',
      points: 'points',
      followers: 'Followers',
      following: 'Following',
      follow: 'Follow',
      unfollow: 'Unfollow',
      message: 'Message',
      invite: 'Invite',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      nickname: 'Nickname',
      forgotPassword: 'Forgot Password?',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      invalidCredentials: 'Invalid email or password',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsDontMatch: 'Passwords do not match',
      emailRequired: 'Email is required',
      nicknameRequired: 'Nickname is required',
    },
    home: {
      greeting: 'Good morning',
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      welcome: 'Welcome to DoSideQuest',
      getStarted: 'Get Started',
      exploreQuests: 'Explore exciting quests',
      connectFriends: 'Connect with friends',
      analytics: 'Analytics',
      progressGraphs: 'Progress Graphs',
      notifications: 'Notifications',
      noNotifications: 'No notifications',
      noNotificationsDesc: 'You\'re all caught up! Check back later for new updates.',
    },
    quests: {
      title: 'Quests',
      subtitle: 'Discover and complete exciting side quests',
      noQuestsTitle: 'No quests available',
      noQuestsSubtitle: 'Check back later for new adventures!',
      notifications: 'Notifications',
      profile: 'Profile',
      stats: 'Stats',
      bio: 'Bio',
      editProfile: 'Edit Profile',
      updateBio: 'Update Bio',
      bioPlaceholder: 'Tell us about yourself...',
      updateNickname: 'Update Nickname',
      nicknamePlaceholder: 'Enter your nickname',
    },
    videos: {
      title: 'Videos',
      subtitle: 'Watch and share quest videos',
      comingSoon: 'Coming Soon',
      description: 'Video sharing feature will be available soon!',
      forYou: 'For You',
      friends: 'Friends',
    },
    search: {
      users: 'Search Users',
      byNickname: 'Search by nickname...',
      startTyping: 'Start typing to search users',
    },
    leaderboard: {
      title: 'Leaderboard',
      subtitle: 'See who\'s leading the quest',
      earnPointsSubtitle: 'earn points by completing sidequests',
      you: 'You',
      global: 'Global',
      friends: 'Friends',
      rank: 'Rank',
      player: 'Player',
      points: 'Points',
      noData: 'No leaderboard data available',
      noGlobalData: 'No global leaderboard data available',
      noFriendsData: 'No friends leaderboard data available',
      loadingError: 'Failed to load leaderboard',
      testPoints: '+100 pt',
      pointsAdded: 'Points added successfully!',
      errorAddingPoints: 'Failed to add points',
    },
    friends: {
      title: 'Friends',
      party: 'Party',
      partySubtitle: 'Invite someone or join party',
      invite: 'Invite',
      joinParty: 'Join party',
      friendsCount: 'Friends',
      showLess: 'Show less',
      showAll: 'Show all',
      searchPlaceholder: 'Search friends...',
      loading: 'Loading friends...',
      noFriends: 'No friends yet...',
      noFriendsSubtext: 'Friends will appear automatically when you follow each other with someone.',
      noResults: 'No friends found for',
      friendBadge: 'Friend',
    },
    profile: {
      title: 'Profile',
      editProfile: 'Edit Profile',
      stats: 'Stats',
      bio: 'Bio',
      updateBio: 'Update Bio',
      bioPlaceholder: 'Tell us about yourself...',
      updateNickname: 'Update Nickname',
      nicknamePlaceholder: 'Enter your nickname',
      changeAvatar: 'Change Avatar',
      profileUpdated: 'Profile updated successfully',
      errorUpdating: 'Failed to update profile',
      following: 'Following',
      followers: 'Followers',
      likes: 'Likes',
      seeAnalytics: 'See Analytics',
      posts: 'Posts',
      liked: 'Liked',
      profilePicture: 'Profile Picture',
      nickname: 'Nickname',
      enterNickname: 'Enter your nickname',
      tellPeopleAboutYourself: 'Tell people about yourself',
      removePicture: 'Remove Picture',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your account and preferences',
      account: 'Account',
      privacy: 'Privacy',
      notifications: 'Notifications',
      helpSupport: 'Help & Support',
      about: 'About',
      termsOfService: 'Terms of Service',
      dataStorage: 'Data & Storage',
      language: 'Language',
      signOut: 'Sign Out',
      
      accountSettings: 'Account Settings',
      profileInformation: 'Profile Information',
      email: 'Email',
      nickname: 'Nickname',
      accountCreated: 'Account Created',
      accountActions: 'Account Actions',
      changePassword: 'Change Password',
      exportData: 'Export Data',
      deleteAccount: 'Delete Account',
      deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
      
      privacySettings: 'Privacy Settings',
      accountPrivacy: 'Account Privacy',
      privateAccount: 'Private Account',
      privateAccountDesc: 'Only approved followers can see your posts',
      dataCollection: 'Data Collection',
      manageDataCollection: 'Manage Data Collection',
      cookiePreferences: 'Cookie Preferences',
      adPersonalization: 'Ad Personalization',
      
      notificationSettings: 'Notification Settings',
      pushNotifications: 'Push Notifications',
      enableNotifications: 'Enable Notifications',
      enableNotificationsDesc: 'Receive push notifications',
      notificationTypes: 'Notification Types',
      likesComments: 'Likes & Comments',
      newFollowers: 'New Followers',
      questUpdates: 'Quest Updates',
      
      getHelp: 'Get Help',
      faq: 'FAQ',
      contactSupport: 'Contact Support',
      reportBug: 'Report a Bug',
      community: 'Community',
      communityGuidelines: 'Community Guidelines',
      reportContent: 'Report Content',
      
      aboutApp: 'About DoSideQuest',
      version: 'Version 1.0.0',
      appDescription: 'Discover and complete exciting side quests in your daily life. Connect with friends, earn points, and make every day an adventure.',
      legal: 'Legal',
      privacyPolicy: 'Privacy Policy',
      openSourceLicenses: 'Open Source Licenses',
      
      storageUsage: 'Storage Usage',
      cacheSize: 'Cache Size',
      mediaStorage: 'Media Storage',
      clearCache: 'Clear Cache',
      dataSync: 'Data Sync',
      autoSync: 'Auto Sync',
      autoSyncDesc: 'Automatically sync data across devices',
      
      languageSettings: 'Language Settings',
      selectLanguage: 'Select Language',
    },
  },
  cs: {
    nav: {
      home: 'Domů',
      quests: 'Úkoly',
      videos: 'Videa',
      leaderboard: 'Žebříček',
      friends: 'Přátelé',
      profile: 'Profil',
      settings: 'Nastavení',
    },
    common: {
      loading: 'Načítání...',
      error: 'Chyba',
      retry: 'Zkusit znovu',
      cancel: 'Zrušit',
      save: 'Uložit',
      delete: 'Smazat',
      edit: 'Upravit',
      done: 'Hotovo',
      back: 'Zpět',
      next: 'Další',
      search: 'Hledat',
      searchPlaceholder: 'Hledat...',
      noResults: 'Žádné výsledky',
      points: 'bodů',
      followers: 'Sledující',
      following: 'Sleduje',
      follow: 'Sledovat',
      unfollow: 'Přestat sledovat',
      message: 'Zpráva',
      invite: 'Pozvat',
    },
    auth: {
      signIn: 'Přihlásit se',
      signUp: 'Registrovat se',
      signOut: 'Odhlásit se',
      email: 'E-mail',
      password: 'Heslo',
      confirmPassword: 'Potvrdit heslo',
      nickname: 'Přezdívka',
      forgotPassword: 'Zapomenuté heslo?',
      createAccount: 'Vytvořit účet',
      alreadyHaveAccount: 'Už máte účet?',
      dontHaveAccount: 'Nemáte účet?',
      invalidCredentials: 'Neplatný e-mail nebo heslo',
      passwordTooShort: 'Heslo musí mít alespoň 6 znaků',
      passwordsDontMatch: 'Hesla se neshodují',
      emailRequired: 'E-mail je povinný',
      nicknameRequired: 'Přezdívka je povinná',
    },
    home: {
      greeting: 'Ahoj',
      goodMorning: 'Dobré ráno',
      goodAfternoon: 'Dobré odpoledne',
      goodEvening: 'Dobrý večer',
      welcome: 'Vítejte v DoSideQuest',
      getStarted: 'Začít',
      exploreQuests: 'Prozkoumejte vzrušující úkoly',
      connectFriends: 'Spojte se s přáteli',
      analytics: 'Analytika',
      progressGraphs: 'Grafy pokroku',
      notifications: 'Oznámení',
      noNotifications: 'Žádná oznámení',
      noNotificationsDesc: 'Zatím nemáte žádná oznámení',
    },
    quests: {
      title: 'Úkoly',
      subtitle: 'Objevte a dokončete vzrušující vedlejší úkoly',
      noQuestsTitle: 'Žádné úkoly',
      noQuestsSubtitle: 'Zatím nemáte žádné úkoly k dokončení',
      notifications: 'Oznámení',
      profile: 'Profil',
      stats: 'Statistiky',
      bio: 'Bio',
      editProfile: 'Upravit profil',
      updateBio: 'Aktualizovat bio',
      bioPlaceholder: 'Řekněte nám něco o sobě...',
      updateNickname: 'Aktualizovat přezdívku',
      nicknamePlaceholder: 'Zadejte svou přezdívku',
    },
    videos: {
      title: 'Videa',
      subtitle: 'Sledujte a sdílejte videa úkolů',
      comingSoon: 'Již brzy',
      description: 'Funkce sdílení videí bude brzy k dispozici!',
      forYou: 'Pro vás',
      friends: 'Přátelé',
    },
    search: {
      users: 'Hledat uživatele',
      byNickname: 'Hledat podle přezdívky...',
      startTyping: 'Začněte psát pro vyhledání uživatelů',
    },
    leaderboard: {
      title: 'Žebříček',
      subtitle: 'Podívejte se, kdo vede v úkolech',
      global: 'Globální',
      friends: 'Přátelé',
      rank: 'Pořadí',
      player: 'Hráč',
      points: 'Body',
      noData: 'Žádná data žebříčku nejsou k dispozici',
      noGlobalData: 'Žádná globální data nejsou k dispozici',
      noFriendsData: 'Žádná data přátel nejsou k dispozici',
      loadingError: 'Nepodařilo se načíst žebříček',
      testPoints: '+100 b',
      pointsAdded: 'Body úspěšně přidány!',
      errorAddingPoints: 'Nepodařilo se přidat body',
      earnPointsSubtitle: 'získávejte body plněním vedlejších úkolů',
      you: 'Ty',
    },
    friends: {
      title: 'Přátelé',
      party: 'Party',
      partySubtitle: 'Pozvěte někoho nebo se připojte k party',
      invite: 'Pozvat',
      joinParty: 'Připojit se k party',
      friendsCount: 'Přátelé',
      showLess: 'Zobrazit méně',
      showAll: 'Zobrazit všechny',
      searchPlaceholder: 'Hledat přátele...',
      loading: 'Načítání přátel...',
      noFriends: 'Zatím žádní přátelé...',
      noFriendsSubtext: 'Přátelé se zobrazí automaticky, když se budete vzájemně sledovat s někým.',
      noResults: 'Žádní přátelé nenalezeni pro',
      friendBadge: 'Přítel',
    },
    profile: {
      title: 'Profil',
      editProfile: 'Upravit profil',
      stats: 'Statistiky',
      bio: 'Bio',
      updateBio: 'Aktualizovat bio',
      bioPlaceholder: 'Řekněte nám něco o sobě...',
      updateNickname: 'Aktualizovat přezdívku',
      nicknamePlaceholder: 'Zadejte svou přezdívku',
      changeAvatar: 'Změnit avatar',
      profileUpdated: 'Profil úspěšně aktualizován',
      errorUpdating: 'Nepodařilo se aktualizovat profil',
      following: 'Sleduje',
      followers: 'Sledující',
      likes: 'Lajky',
      seeAnalytics: 'Zobrazit analytiku',
      posts: 'Příspěvky',
      liked: 'Oblíbené',
      profilePicture: 'Profilová fotka',
      nickname: 'Přezdívka',
      enterNickname: 'Zadejte svou přezdívku',
      tellPeopleAboutYourself: 'Řekněte lidem něco o sobě',
      removePicture: 'Odebrat fotku',
    },
    settings: {
      title: 'Nastavení',
      subtitle: 'Spravujte svůj účet a předvolby',
      account: 'Účet',
      privacy: 'Soukromí',
      notifications: 'Oznámení',
      helpSupport: 'Pomoc a podpora',
      about: 'O aplikaci',
      termsOfService: 'Podmínky služby',
      dataStorage: 'Data a úložiště',
      language: 'Jazyk',
      signOut: 'Odhlásit se',
      
      accountSettings: 'Nastavení účtu',
      profileInformation: 'Informace o profilu',
      email: 'E-mail',
      nickname: 'Přezdívka',
      accountCreated: 'Účet vytvořen',
      accountActions: 'Akce účtu',
      changePassword: 'Změnit heslo',
      exportData: 'Exportovat data',
      deleteAccount: 'Smazat účet',
      deleteAccountConfirm: 'Opravdu chcete smazat svůj účet? Tuto akci nelze vrátit zpět.',
      
      privacySettings: 'Nastavení soukromí',
      accountPrivacy: 'Soukromí účtu',
      privateAccount: 'Soukromý účet',
      privateAccountDesc: 'Pouze schválení sledující mohou vidět vaše příspěvky',
      dataCollection: 'Sběr dat',
      manageDataCollection: 'Spravovat sběr dat',
      cookiePreferences: 'Předvolby cookies',
      adPersonalization: 'Personalizace reklam',
      
      notificationSettings: 'Nastavení oznámení',
      pushNotifications: 'Push oznámení',
      enableNotifications: 'Povolit oznámení',
      enableNotificationsDesc: 'Přijímat push oznámení',
      notificationTypes: 'Typy oznámení',
      likesComments: 'Lajky a komentáře',
      newFollowers: 'Noví sledující',
      questUpdates: 'Aktualizace úkolů',
      
      getHelp: 'Získat pomoc',
      faq: 'Často kladené otázky',
      contactSupport: 'Kontaktovat podporu',
      reportBug: 'Nahlásit chybu',
      community: 'Komunita',
      communityGuidelines: 'Pravidla komunity',
      reportContent: 'Nahlásit obsah',
      
      aboutApp: 'O aplikaci DoSideQuest',
      version: 'Verze 1.0.0',
      appDescription: 'Objevte a dokončete vzrušující vedlejší úkoly ve svém každodenním životě. Spojte se s přáteli, získávejte body a udělejte z každého dne dobrodružství.',
      legal: 'Právní',
      privacyPolicy: 'Zásady ochrany osobních údajů',
      openSourceLicenses: 'Open Source licence',
      
      storageUsage: 'Využití úložiště',
      cacheSize: 'Velikost cache',
      mediaStorage: 'Úložiště médií',
      clearCache: 'Vymazat cache',
      dataSync: 'Synchronizace dat',
      autoSync: 'Automatická synchronizace',
      autoSyncDesc: 'Automaticky synchronizovat data napříč zařízeními',
      
      languageSettings: 'Nastavení jazyka',
      selectLanguage: 'Vybrat jazyk',
    },
  },
  sk: {
    nav: {
      home: 'Domov',
      quests: 'Úlohy',
      videos: 'Videá',
      leaderboard: 'Rebríček',
      friends: 'Priatelia',
      profile: 'Profil',
      settings: 'Nastavenia',
    },
    common: {
      loading: 'Načítava sa...',
      error: 'Chyba',
      retry: 'Skúsiť znovu',
      cancel: 'Zrušiť',
      save: 'Uložiť',
      delete: 'Zmazať',
      edit: 'Upraviť',
      done: 'Hotovo',
      back: 'Späť',
      next: 'Ďalej',
      search: 'Hľadať',
      searchPlaceholder: 'Hľadať...',
      noResults: 'Žiadne výsledky',
      points: 'bodov',
      followers: 'Sledujúci',
      following: 'Sleduje',
      follow: 'Sledovať',
      unfollow: 'Prestať sledovať',
      message: 'Správa',
      invite: 'Pozvať',
    },
    auth: {
      signIn: 'Prihlásiť sa',
      signUp: 'Registrovať sa',
      signOut: 'Odhlásiť sa',
      email: 'E-mail',
      password: 'Heslo',
      confirmPassword: 'Potvrdiť heslo',
      nickname: 'Prezývka',
      forgotPassword: 'Zabudnuté heslo?',
      createAccount: 'Vytvoriť účet',
      alreadyHaveAccount: 'Už máte účet?',
      dontHaveAccount: 'Nemáte účet?',
      invalidCredentials: 'Neplatný e-mail alebo heslo',
      passwordTooShort: 'Heslo musí mať aspoň 6 znakov',
      passwordsDontMatch: 'Heslá sa nezhodujú',
      emailRequired: 'E-mail je povinný',
      nicknameRequired: 'Prezývka je povinná',
    },
    home: {
      greeting: 'Dobré ráno',
      goodMorning: 'Dobré ráno',
      goodAfternoon: 'Dobré popoludnie',
      goodEvening: 'Dobrý večer',
      welcome: 'Vitajte v DoSideQuest',
      getStarted: 'Začať',
      exploreQuests: 'Preskúmajte vzrušujúce úlohy',
      connectFriends: 'Spojte sa s priateľmi',
      analytics: 'Analytika',
      progressGraphs: 'Grafy pokroku',
      notifications: 'Oznámenia',
      noNotifications: 'Žiadne oznámenia',
      noNotificationsDesc: 'Všetko je aktuálne! Skontrolujte neskôr nové aktualizácie.',
    },
    quests: {
      title: 'Úlohy',
      subtitle: 'Objavte a dokončite vzrušujúce vedľajšie úlohy',
      noQuestsTitle: 'Žiadne úlohy',
      noQuestsSubtitle: 'Skontrolujte neskôr nové dobrodružstvá!',
      notifications: 'Oznámenia',
      profile: 'Profil',
      stats: 'Štatistiky',
      bio: 'Bio',
      editProfile: 'Upraviť profil',
      updateBio: 'Aktualizovať bio',
      bioPlaceholder: 'Povedzte nám niečo o sebe...',
      updateNickname: 'Aktualizovať prezývku',
      nicknamePlaceholder: 'Zadajte svoju prezývku',
    },
    videos: {
      title: 'Videá',
      subtitle: 'Sledujte a zdieľajte videá úloh',
      comingSoon: 'Už čoskoro',
      description: 'Funkcia zdieľania videí bude čoskoro k dispozícii!',
      forYou: 'Pre vás',
      friends: 'Priatelia',
    },
    search: {
      users: 'Hľadať používateľov',
      byNickname: 'Hľadať podľa prezývky...',
      startTyping: 'Začnite písať pre vyhľadávanie používateľov',
    },
    leaderboard: {
      title: 'Rebríček',
      subtitle: 'Pozrite sa, kto vedie v úlohách',
      global: 'Globálny',
      friends: 'Priatelia',
      rank: 'Poradie',
      player: 'Hráč',
      points: 'Body',
      noData: 'Žiadne údaje rebríčka nie sú k dispozícii',
      noGlobalData: 'Žiadne údaje globálneho rebríčka nie sú k dispozícii',
      noFriendsData: 'Žiadne údaje rebríčka priateľov nie sú k dispozícii',
      loadingError: 'Nepodarilo sa načítať rebríček',
      testPoints: '+100 b',
      pointsAdded: 'Body úspešne pridané!',
      errorAddingPoints: 'Nepodarilo sa pridať body',
      earnPointsSubtitle: 'získavajte body plnením vedľajších úloh',
      you: 'Ty',
    },
    friends: {
      title: 'Priatelia',
      party: 'Party',
      partySubtitle: 'Pozvite niekoho alebo sa pripojte k party',
      invite: 'Pozvať',
      joinParty: 'Pripojiť sa k party',
      friendsCount: 'Priatelia',
      showLess: 'Zobraziť menej',
      showAll: 'Zobraziť všetkých',
      searchPlaceholder: 'Hľadať priateľov...',
      loading: 'Načítavanie priateľov...',
      noFriends: 'Zatiaľ žiadni priatelia...',
      noFriendsSubtext: 'Priatelia sa zobrazia automaticky, keď sa budete vzájomne sledovať s niekým.',
      noResults: 'Žiadni priatelia nenájdení pre',
      friendBadge: 'Priateľ',
    },
    profile: {
      title: 'Profil',
      editProfile: 'Upraviť profil',
      stats: 'Štatistiky',
      bio: 'Bio',
      updateBio: 'Aktualizovať bio',
      bioPlaceholder: 'Povedzte nám niečo o sebe...',
      updateNickname: 'Aktualizovať prezývku',
      nicknamePlaceholder: 'Zadajte svoju prezývku',
      changeAvatar: 'Zmeniť avatar',
      profileUpdated: 'Profil úspešne aktualizovaný',
      errorUpdating: 'Nepodarilo sa aktualizovať profil',
      following: 'Sleduje',
      followers: 'Sledujúci',
      likes: 'Lajky',
      seeAnalytics: 'Zobraziť analytiku',
      posts: 'Príspevky',
      liked: 'Obľúbené',
      profilePicture: 'Profilová fotka',
      nickname: 'Prezývka',
      enterNickname: 'Zadajte svoju prezývku',
      tellPeopleAboutYourself: 'Povedzte ľuďom niečo o sebe',
      removePicture: 'Odstrániť fotku',
    },
    settings: {
      title: 'Nastavenia',
      subtitle: 'Spravujte svoj účet a predvoľby',
      account: 'Účet',
      privacy: 'Súkromie',
      notifications: 'Oznámenia',
      helpSupport: 'Pomoc a podpora',
      about: 'O aplikácii',
      termsOfService: 'Podmienky služby',
      dataStorage: 'Údaje a úložisko',
      language: 'Jazyk',
      signOut: 'Odhlásiť sa',
      
      accountSettings: 'Nastavenia účtu',
      profileInformation: 'Informácie o profile',
      email: 'E-mail',
      nickname: 'Prezývka',
      accountCreated: 'Účet vytvorený',
      accountActions: 'Akcie účtu',
      changePassword: 'Zmeniť heslo',
      exportData: 'Exportovať údaje',
      deleteAccount: 'Zmazať účet',
      deleteAccountConfirm: 'Naozaj chcete zmazať svoj účet? Túto akciu nie je možné vrátiť späť.',
      
      privacySettings: 'Nastavenia súkromia',
      accountPrivacy: 'Súkromie účtu',
      privateAccount: 'Súkromný účet',
      privateAccountDesc: 'Iba schválení sledujúci môžu vidieť vaše príspevky',
      dataCollection: 'Zber údajov',
      manageDataCollection: 'Spravovať zber údajov',
      cookiePreferences: 'Predvoľby cookies',
      adPersonalization: 'Personalizácia reklám',
      
      notificationSettings: 'Nastavenia oznámení',
      pushNotifications: 'Push oznámenia',
      enableNotifications: 'Povoliť oznámenia',
      enableNotificationsDesc: 'Prijímať push oznámenia',
      notificationTypes: 'Typy oznámení',
      likesComments: 'Lajky a komentáre',
      newFollowers: 'Noví sledujúci',
      questUpdates: 'Aktualizácie úloh',
      
      getHelp: 'Získať pomoc',
      faq: 'Často kladené otázky',
      contactSupport: 'Kontaktovať podporu',
      reportBug: 'Nahlásiť chybu',
      community: 'Komunita',
      communityGuidelines: 'Pravidlá komunity',
      reportContent: 'Nahlásiť obsah',
      
      aboutApp: 'O aplikácii DoSideQuest',
      version: 'Verzia 1.0.0',
      appDescription: 'Objavte a dokončite vzrušujúce vedľajšie úlohy vo svojom každodennom živote. Spojte sa s priateľmi, získavajte body a urobte z každého dňa dobrodružstvo.',
      legal: 'Právne',
      privacyPolicy: 'Zásady ochrany osobných údajov',
      openSourceLicenses: 'Open Source licencie',
      
      storageUsage: 'Využitie úložiska',
      cacheSize: 'Veľkosť cache',
      mediaStorage: 'Úložisko médií',
      clearCache: 'Vymazať cache',
      dataSync: 'Synchronizácia údajov',
      autoSync: 'Automatická synchronizácia',
      autoSyncDesc: 'Automaticky synchronizovať údaje naprieč zariadeniami',
      
      languageSettings: 'Nastavenia jazyka',
      selectLanguage: 'Vybrať jazyk',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      quests: 'Quests',
      videos: 'Videos',
      leaderboard: 'Bestenliste',
      friends: 'Freunde',
      profile: 'Profil',
      settings: 'Einstellungen',
    },
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      retry: 'Wiederholen',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      done: 'Fertig',
      back: 'Zurück',
      next: 'Weiter',
      search: 'Suchen',
      searchPlaceholder: 'Suchen...',
      noResults: 'Keine Ergebnisse gefunden',
      points: 'Punkte',
      followers: 'Follower',
      following: 'Folgt',
      follow: 'Folgen',
      unfollow: 'Entfolgen',
      message: 'Nachricht',
      invite: 'Einladen',
    },
    auth: {
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      signOut: 'Abmelden',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      nickname: 'Spitzname',
      forgotPassword: 'Passwort vergessen?',
      createAccount: 'Konto erstellen',
      alreadyHaveAccount: 'Bereits ein Konto?',
      dontHaveAccount: 'Noch kein Konto?',
      invalidCredentials: 'Ungültige E-Mail oder Passwort',
      passwordTooShort: 'Passwort muss mindestens 6 Zeichen haben',
      passwordsDontMatch: 'Passwörter stimmen nicht überein',
      emailRequired: 'E-Mail ist erforderlich',
      nicknameRequired: 'Spitzname ist erforderlich',
    },
    home: {
      greeting: 'Guten Morgen',
      goodMorning: 'Guten Morgen',
      goodAfternoon: 'Guten Tag',
      goodEvening: 'Guten Abend',
      welcome: 'Willkommen bei DoSideQuest',
      getStarted: 'Loslegen',
      exploreQuests: 'Entdecke aufregende Quests',
      connectFriends: 'Verbinde dich mit Freunden',
      analytics: 'Analytik',
      progressGraphs: 'Fortschrittsgrafiken',
      notifications: 'Benachrichtigungen',
      noNotifications: 'Keine Benachrichtigungen',
      noNotificationsDesc: 'Du bist auf dem neuesten Stand! Schau später für neue Updates vorbei.',
    },
    quests: {
      title: 'Quests',
      subtitle: 'Entdecke und absolviere aufregende Nebenquests',
      noQuestsTitle: 'Keine Quests verfügbar',
      noQuestsSubtitle: 'Schau später für neue Abenteuer vorbei!',
      notifications: 'Benachrichtigungen',
      profile: 'Profil',
      stats: 'Statistiken',
      bio: 'Bio',
      editProfile: 'Profil bearbeiten',
      updateBio: 'Bio aktualisieren',
      bioPlaceholder: 'Erzähle uns etwas über dich...',
      updateNickname: 'Spitzname aktualisieren',
      nicknamePlaceholder: 'Gib deinen Spitznamen ein',
    },
    videos: {
      title: 'Videos',
      subtitle: 'Schaue und teile Quest-Videos',
      comingSoon: 'Demnächst verfügbar',
      description: 'Die Video-Sharing-Funktion wird bald verfügbar sein!',
      forYou: 'Für dich',
      friends: 'Freunde',
    },
    search: {
      users: 'Benutzer suchen',
      byNickname: 'Nach Spitzname suchen...',
      startTyping: 'Beginne zu tippen, um Benutzer zu suchen',
    },
    leaderboard: {
      title: 'Bestenliste',
      subtitle: 'Sieh wer bei den Quests führt',
      global: 'Global',
      friends: 'Freunde',
      rank: 'Rang',
      player: 'Spieler',
      points: 'Punkte',
      noData: 'Keine Bestenlisten-Daten verfügbar',
      noGlobalData: 'Keine globalen Bestenlisten-Daten verfügbar',
      noFriendsData: 'Keine Freunde-Bestenlisten-Daten verfügbar',
      loadingError: 'Fehler beim Laden der Bestenliste',
      testPoints: '+100 P',
      pointsAdded: 'Punkte erfolgreich hinzugefügt!',
      errorAddingPoints: 'Fehler beim Hinzufügen der Punkte',
      earnPointsSubtitle: 'sammle Punkte durch das Abschließen von Nebenquests',
      you: 'Du',
    },
    friends: {
      title: 'Freunde',
      party: 'Party',
      partySubtitle: 'Jemanden einladen oder Party beitreten',
      invite: 'Einladen',
      joinParty: 'Party beitreten',
      friendsCount: 'Freunde',
      showLess: 'Weniger anzeigen',
      showAll: 'Alle anzeigen',
      searchPlaceholder: 'Freunde suchen...',
      loading: 'Freunde werden geladen...',
      noFriends: 'Noch keine Freunde...',
      noFriendsSubtext: 'Freunde werden automatisch angezeigt, wenn ihr euch gegenseitig folgt.',
      noResults: 'Keine Freunde gefunden für',
      friendBadge: 'Freund',
    },
    profile: {
      title: 'Profil',
      editProfile: 'Profil bearbeiten',
      stats: 'Statistiken',
      bio: 'Bio',
      updateBio: 'Bio aktualisieren',
      bioPlaceholder: 'Erzähle uns etwas über dich...',
      updateNickname: 'Spitzname aktualisieren',
      nicknamePlaceholder: 'Gib deinen Spitznamen ein',
      changeAvatar: 'Avatar ändern',
      profileUpdated: 'Profil erfolgreich aktualisiert',
      errorUpdating: 'Fehler beim Aktualisieren des Profils',
      following: 'Folgt',
      followers: 'Follower',
      likes: 'Likes',
      seeAnalytics: 'Analytik anzeigen',
      posts: 'Beiträge',
      liked: 'Geliked',
      profilePicture: 'Profilbild',
      nickname: 'Spitzname',
      enterNickname: 'Gib deinen Spitznamen ein',
      tellPeopleAboutYourself: 'Erzähle den Leuten etwas über dich',
      removePicture: 'Bild entfernen',
    },
    settings: {
      title: 'Einstellungen',
      subtitle: 'Verwalte dein Konto und deine Einstellungen',
      account: 'Konto',
      privacy: 'Datenschutz',
      notifications: 'Benachrichtigungen',
      helpSupport: 'Hilfe & Support',
      about: 'Über',
      termsOfService: 'Nutzungsbedingungen',
      dataStorage: 'Daten & Speicher',
      language: 'Sprache',
      signOut: 'Abmelden',
      
      accountSettings: 'Kontoeinstellungen',
      profileInformation: 'Profilinformationen',
      email: 'E-Mail',
      nickname: 'Spitzname',
      accountCreated: 'Konto erstellt',
      accountActions: 'Konto-Aktionen',
      changePassword: 'Passwort ändern',
      exportData: 'Daten exportieren',
      deleteAccount: 'Konto löschen',
      deleteAccountConfirm: 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      
      privacySettings: 'Datenschutzeinstellungen',
      accountPrivacy: 'Konto-Datenschutz',
      privateAccount: 'Privates Konto',
      privateAccountDesc: 'Nur genehmigte Follower können Ihre Beiträge sehen',
      dataCollection: 'Datensammlung',
      manageDataCollection: 'Datensammlung verwalten',
      cookiePreferences: 'Cookie-Einstellungen',
      adPersonalization: 'Werbepersonalisierung',
      
      notificationSettings: 'Benachrichtigungseinstellungen',
      pushNotifications: 'Push-Benachrichtigungen',
      enableNotifications: 'Benachrichtigungen aktivieren',
      enableNotificationsDesc: 'Push-Benachrichtigungen erhalten',
      notificationTypes: 'Benachrichtigungstypen',
      likesComments: 'Likes & Kommentare',
      newFollowers: 'Neue Follower',
      questUpdates: 'Quest-Updates',
      
      getHelp: 'Hilfe erhalten',
      faq: 'FAQ',
      contactSupport: 'Support kontaktieren',
      reportBug: 'Fehler melden',
      community: 'Community',
      communityGuidelines: 'Community-Richtlinien',
      reportContent: 'Inhalt melden',
      
      aboutApp: 'Über DoSideQuest',
      version: 'Version 1.0.0',
      appDescription: 'Entdecke und absolviere aufregende Nebenquests in deinem täglichen Leben. Verbinde dich mit Freunden, sammle Punkte und mache jeden Tag zu einem Abenteuer.',
      legal: 'Rechtliches',
      privacyPolicy: 'Datenschutzrichtlinie',
      openSourceLicenses: 'Open Source Lizenzen',
      
      storageUsage: 'Speichernutzung',
      cacheSize: 'Cache-Größe',
      mediaStorage: 'Medienspeicher',
      clearCache: 'Cache leeren',
      dataSync: 'Datensynchronisation',
      autoSync: 'Auto-Sync',
      autoSyncDesc: 'Daten automatisch zwischen Geräten synchronisieren',
      
      languageSettings: 'Spracheinstellungen',
      selectLanguage: 'Sprache auswählen',
    },
  },
};

class I18nService {
  private currentLanguage: Language = 'en';
  private listeners: Array<(language: Language) => void> = [];

  constructor() {
    this.loadLanguage();
  }

  private async loadLanguage() {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && this.isValidLanguage(savedLanguage)) {
        this.currentLanguage = savedLanguage as Language;
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }

  private isValidLanguage(lang: string): boolean {
    return ['en', 'cs', 'sk', 'de'].includes(lang);
  }

  async setLanguage(language: Language) {
    try {
      this.currentLanguage = language;
      await AsyncStorage.setItem('app_language', language);
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  subscribe(listener: (language: Language) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  getAvailableLanguages(): Array<{ code: Language; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'cs', name: 'Čeština' },
      { code: 'sk', name: 'Slovenčina' },
      { code: 'de', name: 'Deutsch' },
    ];
  }
}

export const i18n = new I18nService();
export default i18n;