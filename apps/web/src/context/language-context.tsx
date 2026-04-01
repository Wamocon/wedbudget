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
  setupTitle: string;
  setupGuests: string;
  setupRegion: string;
  setupBudget: string;
  setupHint: (region: string) => string;
  statPlanned: string;
  statActual: string;
  statBuffer: string;
  chartTitle: string;
  chartPlanned: string;
  chartActual: string;
  tableTitle: string;
  tableAddBtn: string;
  colStatus: string;
  colPosition: string;
  colComment: string;
  colFactor: string;
  colPlanned: string;
  colActual: string;
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
  categories: string[];
  regions: Record<string, string>;
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
      'Gebt einfach Gästezahl und Region ein. Unser Rechner gibt euch direkt eine grobe Orientierung für Location und Catering, damit ihr realistisch planen könnt.',
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
    calcSubtitle: 'Ein kostenfreies Helferlein für eure sorgenfreie Planung',
    setupTitle: 'Event Eckdaten',
    setupGuests: 'Gästeanzahl',
    setupRegion: 'Region',
    setupBudget: 'Gesamtbudget (€)',
    setupHint: (region: string) =>
      `<strong>KI-Heuristik aktiv:</strong> Kosten für Posten, die sich nach Gästen richten (siehe Tabelle), werden bei Änderung der Gästezahl automatisch auf Basis des Regionalfaktors (${region}) angepasst.`,
    statPlanned: 'Geplant',
    statActual: 'Tatsächlich',
    statBuffer: 'Puffer',
    chartTitle: 'Soll-Ist Vergleich nach Kategorie',
    chartPlanned: 'Geplant',
    chartActual: 'Tatsächlich',
    tableTitle: 'Voranschlag & Ausgaben',
    tableAddBtn: 'Position hinzufügen',
    colStatus: 'Status',
    colPosition: 'Position',
    colComment: 'Kommentar',
    colFactor: 'Faktor (p.P.)',
    colPlanned: 'Geplant (€)',
    colActual: 'Tatsächlich (€)',
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
    categories: [
      'Location',
      'Catering',
      'Papeterie',
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
    regions: {
      'Baden-Württemberg': 'Baden-Württemberg',
      Bayern: 'Bayern',
      Berlin: 'Berlin',
      Brandenburg: 'Brandenburg',
      Bremen: 'Bremen',
      Hamburg: 'Hamburg',
      Hessen: 'Hessen',
      'Mecklenburg-Vorpommern': 'Mecklenburg-Vorpommern',
      Niedersachsen: 'Niedersachsen',
      'Nordrhein-Westfalen': 'Nordrhein-Westfalen',
      'Rheinland-Pfalz': 'Rheinland-Pfalz',
      Saarland: 'Saarland',
      Sachsen: 'Sachsen',
      'Sachsen-Anhalt': 'Sachsen-Anhalt',
      'Schleswig-Holstein': 'Schleswig-Holstein',
      Thüringen: 'Thüringen',
      International: 'International',
    },
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
      'Simply enter the number of guests and your region. Our calculator gives you a rough orientation for venue and catering so you can plan realistically.',
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
    setupTitle: 'Event Details',
    setupGuests: 'Guest Count',
    setupRegion: 'Region',
    setupBudget: 'Total Budget (€)',
    setupHint: (region: string) =>
      `<strong>AI Heuristics active:</strong> Costs for per-guest items (see table) are automatically adjusted when the guest count changes, based on the regional factor (${region}).`,
    statPlanned: 'Planned',
    statActual: 'Actual',
    statBuffer: 'Buffer',
    chartTitle: 'Plan vs. Actual by Category',
    chartPlanned: 'Planned',
    chartActual: 'Actual',
    tableTitle: 'Budget & Expenses',
    tableAddBtn: 'Add position',
    colStatus: 'Status',
    colPosition: 'Position',
    colComment: 'Comment',
    colFactor: 'Factor (p.p.)',
    colPlanned: 'Planned (€)',
    colActual: 'Actual (€)',
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
    categories: [
      'Venue',
      'Catering',
      'Stationery',
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
    regions: {
      'Baden-Württemberg': 'Baden-Württemberg',
      Bayern: 'Bavaria',
      Berlin: 'Berlin',
      Brandenburg: 'Brandenburg',
      Bremen: 'Bremen',
      Hamburg: 'Hamburg',
      Hessen: 'Hesse',
      'Mecklenburg-Vorpommern': 'Mecklenburg-Vorpommern',
      Niedersachsen: 'Lower Saxony',
      'Nordrhein-Westfalen': 'North Rhine-Westphalia',
      'Rheinland-Pfalz': 'Rhineland-Palatinate',
      Saarland: 'Saarland',
      Sachsen: 'Saxony',
      'Sachsen-Anhalt': 'Saxony-Anhalt',
      'Schleswig-Holstein': 'Schleswig-Holstein',
      Thüringen: 'Thuringia',
      International: 'International',
    },
  },
};

interface LanguageContextValue {
  lang: string;
  switchLang: (lang: string) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<string>(() => {
    try {
      return localStorage.getItem('wedbudget_lang') ?? 'de';
    } catch {
      return 'de';
    }
  });

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
