'use client';

import React, { createContext, useContext, useState } from 'react';

interface Translations {
  navBrand: string;
  navCta: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroSubtitle: string;
  ctaContinue: string;
  ctaNew: string;
  ctaNewFirst: string;
  ctaImport: string;
  heroDisclaimer: string;
  feature1Title: string;
  feature1Text: string;
  feature2Title: string;
  feature2Text: string;
  feature3Title: string;
  feature3Text: string;
  footerText: string;
  importError: string;
  calcBack: string;
  calcFileBtn: string;
  calcFileTip: string;
  calcLinkBtn: string;
  calcLinkTip: string;
  calcLinkCopied: string;
  calcPdfBtn: string;
  calcPdfTip: string;
  calcTitle: string;
  calcSubtitle: string;
  datePlaceholderDay: string;
  datePlaceholderMonth: string;
  datePlaceholderYear: string;
  setupTitle: string;
  setupGuests: string;
  setupBudget: string;
  setupHint: string;
  statBudget: string;
  statPlanned: string;
  statPlannedRemaining: string;
  statSpent: string;
  statPlanDiff: string;
  statPlanDiffLong: string;
  statProfitLoss: string;
  chartPlanDiffTitle: string;
  chartProfitLossTitle: string;
  chartShareTitle: string;
  chartBudget: string;
  chartPlanned: string;
  chartSpent: string;
  chartPlanDiff: string;
  chartProfitLoss: string;
  chartPlannedShare: string;
  chartSpentShare: string;
  chartNoData: string;
  dashboardHintTitle: string;
  dashboardHintStatusBasis: string;
  dashboardHintRemainingFormula: string;
  dashboardHintPlanDiffFormula: string;
  dashboardHintProfitLossFormula: string;
  weddingCountdownDays: (days: number) => string;
  weddingCountdownToday: string;
  weddingCountdownPast: string;
  tableTitle: string;
  tableAddBtn: string;
  colStatus: string;
  colCategory: string;
  colPosition: string;
  colComment: string;
  colTargetDate: string;
  colFactor: string;
  colPlanned: string;
  colActual: string;
  filterAllStatuses: string;
  filterAllCategories: string;
  filterByStatus: string;
  filterByCategory: string;
  resetFilters: string;
  sortAsc: string;
  sortDesc: string;
  statusPaid: string;
  statusOpen: string;
  statusMarkPaid: string;
  statusMarkUnpaid: string;
  checkboxGuests: string;
  inputNotes: string;
  inputDetails: string;
  autoCalc: string;
  deleteRow: string;
  perPerson: string;
  newExpenseItem: string;
  newExpenseCategory: string;
  warnNewPlanningOverwrite: string;
  onboardingTitle: string;
  onboardingSubtitle: string;
  onboardingProgress: (current: number, total: number) => string;
  onboardingBackHome: string;
  onboardingBackQuestion: string;
  onboardingNext: string;
  onboardingFinish: string;
  onboardingSkipHint: string;
  onboardingBudgetLabel: string;
  onboardingPerPersonLabel: string;
  onboardingPlannedServicesLabel: string;
  onboardingNoBudgetYet: string;
  onboardingValidationYesNo: string;
  onboardingValidationAmount: string;
  onboardingValidationName: string;
  onboardingValidationGuests: string;
  onboardingValidationBudget: string;
  onboardingBasicsNameTitle: string;
  onboardingBasicsNameDescription: string;
  onboardingBasicsNameLabel: string;
  onboardingBasicsDateTitle: string;
  onboardingBasicsDateDescription: string;
  onboardingBasicsDateLabel: string;
  onboardingBasicsGuestsTitle: string;
  onboardingBasicsGuestsDescription: string;
  onboardingBasicsGuestsLabel: string;
  onboardingBasicsBudgetTitle: string;
  onboardingBasicsBudgetDescription: string;
  onboardingBasicsBudgetLabel: string;
  onboardingLocationTitle: string;
  onboardingLocationDescription: string;
  onboardingCateringTitle: string;
  onboardingCateringDescription: string;
  onboardingInvitationsTitle: string;
  onboardingInvitationsDescription: string;
  onboardingDecorationTitle: string;
  onboardingDecorationDescription: string;
  onboardingDressTitle: string;
  onboardingDressDescription: string;
  onboardingSuitTitle: string;
  onboardingSuitDescription: string;
  onboardingServicesTitle: string;
  onboardingServicesDescription: string;
  onboardingRingsTitle: string;
  onboardingRingsDescription: string;
  onboardingAnswerYes: string;
  onboardingAnswerNo: string;
  onboardingModerator: string;
  onboardingDj: string;
  onboardingPhotographer: string;
  onboardingVideographer: string;
  categories: string[];
}

const translations: Record<string, Translations> = {
  de: {
    navBrand: 'WedBudget',
    navCta: 'Direkt loslegen',
    heroBadge: 'Das 100% kostenlose Community-Tool',
    heroTitle1: 'Eure Traumhochzeit.',
    heroTitle2: 'Entspannt geplant.',
    heroTitle3: 'Ohne Excel-Chaos.',
    heroSubtitle:
      'Behaltet die volle Kontrolle über eure Hochzeitsfinanzen. Dieses Tool hilft euch dabei, Kosten richtig einzuschätzen und euer Budget im Blick zu behalten – komplett kostenfrei, werbefrei und ohne versteckte Bedingungen.',
    ctaContinue: 'Letzte Planung fortsetzen',
    ctaNew: 'Neue Planung starten',
    ctaNewFirst: 'Jetzt Budget berechnen',
    ctaImport: 'Backup Datei laden (.json)',
    heroDisclaimer: 'Kein Login. Keine Datenspeicherung. Eure Daten bleiben im Browser.',
    feature1Title: 'Realistische Schätzungen',
    feature1Text:
      'Gebt einfach Gästezahl und Budget ein. Unser Rechner gibt euch direkt eine grobe Orientierung für zentrale Kostenblöcke, damit ihr realistisch planen könnt.',
    feature2Title: 'Automatische Speicherung',
    feature2Text:
      'Dieses Tool speichert alles lokal in eurem Browser. Verlasst die Seite sorgenfrei – ihr macht beim nächsten Öffnen genau da weiter, wo ihr aufgehört habt.',
    feature3Title: 'Volle Privatsphäre',
    feature3Text:
      'Wir speichern nichts auf unseren Servern. Ladet ein gesichertes JSON-Backup herunter oder generiert temporäre Links, um alles bequem mit dem Partner zu teilen.',
    footerText: '© {year} WedBudget. Ein kostenfreies Tool zur Hochzeitsplanung. Viel Freude bei den Vorbereitungen!',
    importError: 'Fehler beim Lesen der Datei. Ist es ein gültiges Hochzeitsrechner-Backup?',
    calcBack: 'Zurück',
    calcFileBtn: 'Datei',
    calcFileTip: 'Datei lokal per JSON sichern',
    calcLinkBtn: 'Link',
    calcLinkTip: 'Daten in URL-Link verpacken zum Teilen',
    calcLinkCopied: 'Kopiert!',
    calcPdfBtn: 'PDF',
    calcPdfTip: 'Tabelle als PDF Dokument drucken',
    calcTitle: 'Hochzeits-Budgetplaner',
    calcSubtitle: 'Hochzeit einfach planen.',
    datePlaceholderDay: 'Tag',
    datePlaceholderMonth: 'Monat',
    datePlaceholderYear: 'Jahr',
    setupTitle: 'Event Eckdaten',
    setupGuests: 'Gästeanzahl',
    setupBudget: 'Budget (€)',
    setupHint: '<strong>KI-Heuristik aktiv:</strong> Kosten für Posten, die sich nach Gästen richten (siehe Tabelle), werden bei Änderung der Gästezahl automatisch angepasst.',
    statBudget: 'Budget',
    statPlanned: 'Geplante Ausgaben',
    statPlannedRemaining: 'Geplante Restausgaben',
    statSpent: 'Ausgegeben (Bezahlt/Fertig)',
    statPlanDiff: 'Vor. Ergebnis',
    statPlanDiffLong: 'Voraussichtliches Ergebnis',
    statProfitLoss: 'Gesamtergebnis',
    chartPlanDiffTitle: 'Voraussichtliches Ergebnis (Budget - (Geplante Restausgaben + Ausgegeben))',
    chartProfitLossTitle: 'Gesamtergebnis (Budget - Ausgegeben in Bezahlt/Fertig)',
    chartShareTitle: 'Anteil Geplant und Ausgegeben (Bezahlt/Fertig)',
    chartBudget: 'Budget',
    chartPlanned: 'Geplant',
    chartSpent: 'Ausgegeben (Bezahlt/Fertig)',
    chartPlanDiff: 'Voraussichtliches Ergebnis',
    chartProfitLoss: 'Gesamtergebnis',
    chartPlannedShare: 'Anteil Geplant',
    chartSpentShare: 'Anteil Ausgegeben (Bezahlt/Fertig)',
    chartNoData: 'Keine Daten',
    dashboardHintTitle: 'Hinweise zur Berechnungslogik',
    dashboardHintStatusBasis: 'Ausgegeben wird nur für Kostenposten mit Status Bezahlt oder Fertig berücksichtigt.',
    dashboardHintRemainingFormula: 'Geplante Restausgaben = Geplante Ausgaben gesamt - Geplante Ausgaben in Bezahlt/Fertig.',
    dashboardHintPlanDiffFormula: 'Voraussichtliches Ergebnis = Budget - (Geplante Restausgaben + Ausgegeben in Bezahlt/Fertig).',
    dashboardHintProfitLossFormula: 'Gesamtergebnis = Budget - Ausgegeben in Bezahlt/Fertig.',
    weddingCountdownDays: (days: number) => `Noch ${days} ${days === 1 ? 'Tag' : 'Tage'} bis zur Hochzeit`,
    weddingCountdownToday: 'Heute wird nicht geplant... genießt euren schönen Hochzeitstag! :-)',
    weddingCountdownPast: 'Herzlichen Glückwunsch zur vergangenen Hochzeit',
    tableTitle: 'Voranschlag & Ausgaben',
    tableAddBtn: 'Position hinzufügen',
    colStatus: 'Status',
    colCategory: 'Kategorie',
    colPosition: 'Position',
    colComment: 'Kommentar',
    colTargetDate: 'Zieldatum',
    colFactor: 'Faktor (p.P.)',
    colPlanned: 'Geplant (€)',
    colActual: 'Ausgegeben (€)',
    filterAllStatuses: 'Alle Status',
    filterAllCategories: 'Alle Kategorien',
    filterByStatus: 'Nach Status filtern',
    filterByCategory: 'Nach Kategorie filtern',
    resetFilters: 'Filter zurücksetzen',
    sortAsc: 'Aufsteigend sortieren',
    sortDesc: 'Absteigend sortieren',
    statusPaid: 'Bezahlt',
    statusOpen: 'Offen',
    statusMarkPaid: 'Als bezahlt markieren',
    statusMarkUnpaid: 'Als unbezahlt markieren',
    checkboxGuests: 'Abhängig von Gästen',
    inputNotes: 'Notizen...',
    inputDetails: 'Details',
    autoCalc: 'Auto-berechnet',
    deleteRow: 'Position löschen',
    perPerson: 'p.P.',
    newExpenseItem: 'Neu',
    newExpenseCategory: 'Sonstiges',
    warnNewPlanningOverwrite:
      'Es gibt bereits einen lokal gespeicherten Planungsstand. Wenn du jetzt eine neue Planung startest, wird dieser Stand ersetzt. Möchtest du fortfahren?',
    onboardingTitle: 'Geführte Erste Einrichtung',
    onboardingSubtitle:
      'Beantworte ein paar kurze Fragen. Daraus legen wir nur die Posten an, die ihr wirklich für eure Planung braucht.',
    onboardingProgress: (current: number, total: number) => `Frage ${current} von ${total}`,
    onboardingBackHome: 'Zur Startseite',
    onboardingBackQuestion: 'Zurück',
    onboardingNext: 'Weiter',
    onboardingFinish: 'Zur Planung',
    onboardingSkipHint: 'Wenn etwas noch offen ist, einfach Nein auswählen. Den Posten kannst du später jederzeit ergänzen.',
    onboardingBudgetLabel: 'Geplanter Betrag (€)',
    onboardingPerPersonLabel: 'Kosten sind personenabhängig',
    onboardingPlannedServicesLabel: 'Was soll als Platzhalter angelegt werden?',
    onboardingNoBudgetYet: 'Noch keine Auswahl. Ihr könnt diese Posten später auch manuell anlegen.',
    onboardingValidationYesNo: 'Bitte zuerst Ja oder Nein auswählen.',
    onboardingValidationAmount: 'Bitte gib einen Betrag von mindestens 0 ein.',
    onboardingValidationName: 'Bitte gib einen Namen für eure Hochzeit ein.',
    onboardingValidationGuests: 'Bitte gib eine Gästeanzahl von mindestens 1 ein.',
    onboardingValidationBudget: 'Bitte gib ein Gesamtbudget von mindestens 1 ein.',
    onboardingBasicsNameTitle: 'Wie soll eure Planung heißen?',
    onboardingBasicsNameDescription: 'Dieser Name erscheint später als Titel in eurem Budgetplan.',
    onboardingBasicsNameLabel: 'Planungsname',
    onboardingBasicsDateTitle: 'Wann findet eure Hochzeit statt?',
    onboardingBasicsDateDescription: 'Das Datum hilft euch bei der zeitlichen Orientierung in der Planung.',
    onboardingBasicsDateLabel: 'Hochzeitsdatum',
    onboardingBasicsGuestsTitle: 'Mit wie vielen Gästen plant ihr?',
    onboardingBasicsGuestsDescription: 'Viele Kosten hängen direkt von der Gästeanzahl ab.',
    onboardingBasicsGuestsLabel: 'Gästeanzahl',
    onboardingBasicsBudgetTitle: 'Wie hoch ist euer Gesamtbudget?',
    onboardingBasicsBudgetDescription: 'Damit können wir euch eine realistische erste Budgetbasis setzen.',
    onboardingBasicsBudgetLabel: 'Budget (€)',
    onboardingLocationTitle: 'Ist eure Location bereits klar?',
    onboardingLocationDescription: 'Wenn ja, legen wir direkt einen passenden Detailposten für die Location an.',
    onboardingCateringTitle: 'Ist das Catering bereits klar?',
    onboardingCateringDescription: 'Wenn ja, erfassen wir den Betrag direkt und markieren auf Wunsch Kosten pro Person.',
    onboardingInvitationsTitle: 'Sind Einladungen oder Papeterie schon eingeplant?',
    onboardingInvitationsDescription: 'Wenn ja, wird der Posten direkt in den Details angelegt.',
    onboardingDecorationTitle: 'Ist Dekoration bereits eingeplant?',
    onboardingDecorationDescription: 'Wenn ja, übernehmen wir den Betrag direkt als Detailposten.',
    onboardingDressTitle: 'Soll ein Brautkleid eingeplant werden?',
    onboardingDressDescription: 'Wenn ja, legen wir dafür direkt einen separaten Posten an.',
    onboardingSuitTitle: 'Soll ein Anzug eingeplant werden?',
    onboardingSuitDescription: 'Wenn ja, legen wir dafür direkt einen separaten Posten an.',
    onboardingServicesTitle: 'Welche Dienstleister sollen direkt als Platzhalter angelegt werden?',
    onboardingServicesDescription: 'Diese Auswahl erzeugt leere Detailposten, damit ihr sie später konkretisieren könnt.',
    onboardingRingsTitle: 'Sollen Ringe direkt eingeplant werden?',
    onboardingRingsDescription: 'Wenn ja, übernehmen wir den geplanten Betrag direkt in einen Ringe-Posten.',
    onboardingAnswerYes: 'Ja',
    onboardingAnswerNo: 'Nein',
    onboardingModerator: 'Moderator',
    onboardingDj: 'DJ',
    onboardingPhotographer: 'Fotograf',
    onboardingVideographer: 'Videograf',
    categories: [
      'Location',
      'Catering',
      'Einladungen',
      'Kleidung',
      'Fotografie',
      'Dekoration',
      'Ringe',
      'Musik & Entertainment',
      'Styling',
      'Transport',
      'Gastgeschenke',
      'Flitterwochen',
      'Trauzeugen',
      'Sonstiges',
    ],
  },

  en: {
    navBrand: 'WedBudget',
    navCta: 'Start now',
    heroBadge: '100% free community tool',
    heroTitle1: 'Your dream wedding.',
    heroTitle2: 'Stress-free planning.',
    heroTitle3: 'No Excel chaos.',
    heroSubtitle:
      'Keep full control over your wedding finances. This tool helps you estimate costs and stay within your budget — completely free, ad-free, and without hidden conditions.',
    ctaContinue: 'Continue last plan',
    ctaNew: 'Start new plan',
    ctaNewFirst: 'Calculate budget',
    ctaImport: 'Load backup file (.json)',
    heroDisclaimer: 'No login. No data storage. Your data stays in the browser.',
    feature1Title: 'Realistic Estimates',
    feature1Text:
      'Simply enter your guest count and total budget. Our calculator gives you a rough orientation for core cost blocks so you can plan realistically.',
    feature2Title: 'Automatic Saving',
    feature2Text:
      'This tool saves everything locally in your browser. Leave the page without worry — you continue right where you left off next time.',
    feature3Title: 'Full Privacy',
    feature3Text:
      'We store nothing on our servers. Download a JSON backup or generate temporary links to easily share with your partner.',
    footerText: '© {year} WedBudget. A free wedding planning tool. Enjoy your preparations!',
    importError: 'Error reading file. Is it a valid WedBudget backup?',
    calcBack: 'Back',
    calcFileBtn: 'File',
    calcFileTip: 'Save file locally as JSON',
    calcLinkBtn: 'Link',
    calcLinkTip: 'Pack data into URL link for sharing',
    calcLinkCopied: 'Copied!',
    calcPdfBtn: 'PDF',
    calcPdfTip: 'Print table as PDF document',
    calcTitle: 'Wedding Budget Planner',
    calcSubtitle: 'A free helper for your stress-free planning',
    datePlaceholderDay: 'Day',
    datePlaceholderMonth: 'Month',
    datePlaceholderYear: 'Year',
    setupTitle: 'Event Details',
    setupGuests: 'Guest Count',
    setupBudget: 'Budget (€)',
    setupHint: '<strong>AI Heuristics active:</strong> Per-guest costs (see table) are automatically adjusted when the guest count changes.',
    statBudget: 'Budget',
    statPlanned: 'Planned Expenses',
    statPlannedRemaining: 'Planned Remaining',
    statSpent: 'Spent (Paid/Done)',
    statPlanDiff: 'Est. Result',
    statPlanDiffLong: 'Estimated Result',
    statProfitLoss: 'Total Result',
    chartPlanDiffTitle: 'Estimated Result (Budget - (Planned remaining + Spent))',
    chartProfitLossTitle: 'Total Result (Budget - Spent in Paid/Done)',
    chartShareTitle: 'Planned vs Spent Share (Paid/Done)',
    chartBudget: 'Budget',
    chartPlanned: 'Planned',
    chartSpent: 'Spent (Paid/Done)',
    chartPlanDiff: 'Estimated Result',
    chartProfitLoss: 'Total Result',
    chartPlannedShare: 'Planned Share',
    chartSpentShare: 'Spent Share (Paid/Done)',
    chartNoData: 'No data',
    dashboardHintTitle: 'Calculation logic notes',
    dashboardHintStatusBasis: 'Spent only includes cost items with status Paid or Done.',
    dashboardHintRemainingFormula: 'Planned Remaining = Total Planned Expenses - Planned Expenses in Paid/Done.',
    dashboardHintPlanDiffFormula: 'Estimated Result = Budget - (Planned Remaining + Spent in Paid/Done).',
    dashboardHintProfitLossFormula: 'Total Result = Budget - Spent in Paid/Done.',
    weddingCountdownDays: (days: number) => `${days} ${days === 1 ? 'day' : 'days'} until the wedding`,
    weddingCountdownToday: 'No planning today... enjoy your beautiful wedding day! :-)',
    weddingCountdownPast: 'Congratulations on your wedding day that has already passed',
    tableTitle: 'Budget & Expenses',
    tableAddBtn: 'Add position',
    colStatus: 'Status',
    colCategory: 'Category',
    colPosition: 'Position',
    colComment: 'Comment',
    colTargetDate: 'Target date',
    colFactor: 'Factor (p.p.)',
    colPlanned: 'Planned (€)',
    colActual: 'Spent (€)',
    filterAllStatuses: 'All statuses',
    filterAllCategories: 'All categories',
    filterByStatus: 'Filter by status',
    filterByCategory: 'Filter by category',
    resetFilters: 'Reset filters',
    sortAsc: 'Sort ascending',
    sortDesc: 'Sort descending',
    statusPaid: 'Paid',
    statusOpen: 'Open',
    statusMarkPaid: 'Mark as paid',
    statusMarkUnpaid: 'Mark as unpaid',
    checkboxGuests: 'Per guest',
    inputNotes: 'Notes...',
    inputDetails: 'Details',
    autoCalc: 'Auto-calculated',
    deleteRow: 'Delete position',
    perPerson: 'p.p.',
    newExpenseItem: 'New',
    newExpenseCategory: 'Other',
    warnNewPlanningOverwrite:
      'A locally saved plan already exists. Starting a new plan will replace it. Do you want to continue?',
    onboardingTitle: 'Guided First Setup',
    onboardingSubtitle:
      'Answer a few short questions. We will only create the items you actually need for your planning.',
    onboardingProgress: (current: number, total: number) => `Question ${current} of ${total}`,
    onboardingBackHome: 'Back to home',
    onboardingBackQuestion: 'Back',
    onboardingNext: 'Next',
    onboardingFinish: 'Open planner',
    onboardingSkipHint: 'If something is still unclear, select No. You can add the item later at any time.',
    onboardingBudgetLabel: 'Planned amount (€)',
    onboardingPerPersonLabel: 'Costs depend on guests',
    onboardingPlannedServicesLabel: 'Which placeholders should we create?',
    onboardingNoBudgetYet: 'Nothing selected yet. You can also add these items manually later.',
    onboardingValidationYesNo: 'Please choose Yes or No first.',
    onboardingValidationAmount: 'Please enter an amount of at least 0.',
    onboardingValidationName: 'Please enter a name for your wedding plan.',
    onboardingValidationGuests: 'Please enter at least 1 guest.',
    onboardingValidationBudget: 'Please enter a total budget of at least 1.',
    onboardingBasicsNameTitle: 'What should your plan be called?',
    onboardingBasicsNameDescription: 'This name is shown later as the title in your budget planner.',
    onboardingBasicsNameLabel: 'Plan name',
    onboardingBasicsDateTitle: 'When is your wedding date?',
    onboardingBasicsDateDescription: 'The date helps you keep a clear planning timeline.',
    onboardingBasicsDateLabel: 'Wedding date',
    onboardingBasicsGuestsTitle: 'How many guests are you planning for?',
    onboardingBasicsGuestsDescription: 'Many costs directly depend on the guest count.',
    onboardingBasicsGuestsLabel: 'Guest count',
    onboardingBasicsBudgetTitle: 'What is your total budget?',
    onboardingBasicsBudgetDescription: 'This helps set a realistic initial budget frame.',
    onboardingBasicsBudgetLabel: 'Budget (€)',
    onboardingLocationTitle: 'Is your venue already decided?',
    onboardingLocationDescription: 'If yes, we will create a matching venue item right away.',
    onboardingCateringTitle: 'Is the catering already decided?',
    onboardingCateringDescription: 'If yes, we store the amount now and optionally mark it as per guest.',
    onboardingInvitationsTitle: 'Are invitations or stationery already planned?',
    onboardingInvitationsDescription: 'If yes, we will add the item directly to the details.',
    onboardingDecorationTitle: 'Is decoration already planned?',
    onboardingDecorationDescription: 'If yes, we will transfer the amount directly into a detail item.',
    onboardingDressTitle: 'Should a wedding dress be planned?',
    onboardingDressDescription: 'If yes, we create a separate item for it right away.',
    onboardingSuitTitle: 'Should a suit be planned?',
    onboardingSuitDescription: 'If yes, we create a separate item for it right away.',
    onboardingServicesTitle: 'Which service providers should be added as placeholders right away?',
    onboardingServicesDescription: 'This creates empty detail items so you can refine them later.',
    onboardingRingsTitle: 'Should rings be planned right away?',
    onboardingRingsDescription: 'If yes, we store the planned amount directly in a rings item.',
    onboardingAnswerYes: 'Yes',
    onboardingAnswerNo: 'No',
    onboardingModerator: 'Host',
    onboardingDj: 'DJ',
    onboardingPhotographer: 'Photographer',
    onboardingVideographer: 'Videographer',
    categories: [
      'Venue',
      'Catering',
      'Invitations',
      'Attire',
      'Photography',
      'Decoration',
      'Rings',
      'Music & Entertainment',
      'Styling',
      'Transport',
      'Guest Gifts',
      'Honeymoon',
      'Wedding Party',
      'Other',
    ],
  },
};

interface LanguageContextValue {
  lang: string;
  switchLang: (lang: string) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<string>('de');

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('wedbudget_lang');
      if (stored === 'de' || stored === 'en') {
        setLang(stored);
      }
    } catch {
      // silent
    }
  }, []);

  const switchLang = (newLang: string) => {
    setLang(newLang);
    try {
      localStorage.setItem('wedbudget_lang', newLang);
    } catch {
      // silent
    }
  };

  const t = translations[lang] ?? translations['de']!;

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
