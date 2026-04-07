'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChartPie,
  ClipboardList,
  Home,
  Moon,
  Share2,
  Shield,
  Sparkles,
  Sun,
  Table,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

/* ── types ── */
interface Point { label: string; text: string }
interface Section {
  id: string;
  num: string;
  icon: React.ComponentType<{ size?: number }>;
  titleDe: string;
  titleEn: string;
  introDe: string;
  introEn: string;
  pointsDe: Point[];
  pointsEn: Point[];
}

/* ── content ── */
const SECTIONS: Section[] = [
  {
    id: 'start',
    num: '01',
    icon: Home,
    titleDe: 'Einstieg & Navigation',
    titleEn: 'Getting started',
    introDe: 'Alles, was ihr braucht, um WedBudget sofort zu nutzen.',
    introEn: 'Everything you need to start using WedBudget right away.',
    pointsDe: [
      { label: 'Neue Planung starten', text: 'Öffnet den Einrichtungsassistenten und legt eine frische Planung an.' },
      { label: 'Letzte Planung fortsetzen', text: 'Erscheint automatisch, sobald lokale Daten im Browser vorhanden sind – ihr macht genau dort weiter, wo ihr aufgehört habt.' },
      { label: 'Backup laden', text: 'Importiert eine zuvor exportierte .json-Datei, um einen gesicherten Stand wiederherzustellen.' },
      { label: 'Bestandsschutz', text: 'Wenn bereits eine Planung existiert, fragt die App vor dem Überschreiben und bietet zuerst den Export an.' },
    ],
    pointsEn: [
      { label: 'Start new plan', text: 'Opens the setup wizard and creates a fresh plan with your budget and guest count.' },
      { label: 'Continue last plan', text: 'Appears automatically when local browser data exists – pick up right where you left off.' },
      { label: 'Load backup', text: 'Import a previously exported .json file to restore a saved state.' },
      { label: 'Data protection', text: 'If a plan already exists, the app asks before overwriting and offers to export first.' },
    ],
  },
  {
    id: 'onboarding',
    num: '02',
    icon: Sparkles,
    titleDe: 'Einrichtungsassistent',
    titleEn: 'Setup wizard',
    introDe: 'Führt euch beim ersten Start durch Grundeinstellungen und legt passende Kostenposten vor.',
    introEn: 'Guides you through the basics on first launch and pre-creates matching expense items.',
    pointsDe: [
      { label: 'Hochzeitsname', text: 'Gebt eurer Planung einen individuellen Titel – er erscheint im Kopfbereich des Planers.' },
      { label: 'Datum & Budget', text: 'Das Datum aktiviert den Tage-Countdown; das Budget bildet die Basis aller Berechnungen.' },
      { label: 'Gästezahl', text: 'Beeinflusst alle gästeabhängigen Kostenpositionen, die automatisch neu berechnet werden.' },
      { label: 'Posten wählen', text: 'Der Assistent legt nur die Posten an, die ihr bestätigt habt – kein unnötiger Ballast.' },
      { label: 'Überspringen erlaubt', text: 'Jede Angabe kann übersprungen und später jederzeit ergänzt oder geändert werden.' },
    ],
    pointsEn: [
      { label: 'Wedding name', text: 'Give your plan a personal title – it appears in the planner header.' },
      { label: 'Date & budget', text: 'The date activates the countdown; the budget is the basis for all calculations.' },
      { label: 'Guest count', text: 'Drives all per-guest cost items, which recalculate automatically.' },
      { label: 'Choose items', text: 'The wizard only creates items you confirm – no unnecessary clutter.' },
      { label: 'Skip anytime', text: 'Any answer can be skipped and filled in or changed later at any time.' },
    ],
  },
  {
    id: 'basics',
    num: '03',
    icon: Target,
    titleDe: 'Eckdaten',
    titleEn: 'Basics tab',
    introDe: 'Pflegt hier jederzeit Name, Datum, Gästezahl und Budget eurer Hochzeit.',
    introEn: 'Edit your wedding name, date, guest count, and total budget at any time.',
    pointsDe: [
      { label: 'Name & Datum', text: 'Der Name erscheint im Kopfbereich; das Datum aktiviert den Countdown im Dashboard.' },
      { label: 'Gästezahl anpassen', text: 'Alle als gästeabhängig markierten Posten berechnen sich automatisch neu.' },
      { label: 'Gesamtbudget', text: 'Bildet die Grundlage für alle Kennzahlen und Budget-Warnhinweise.' },
      { label: 'Änderungen übernehmen', text: 'Klickt den Button, um Änderungen zu bestätigen – die App wechselt direkt ins Dashboard.' },
    ],
    pointsEn: [
      { label: 'Name & date', text: 'Name shows in the header; date activates the countdown in the dashboard.' },
      { label: 'Adjust guest count', text: 'All per-guest items recalculate automatically.' },
      { label: 'Total budget', text: 'Forms the basis for all metrics and budget warnings.' },
      { label: 'Apply changes', text: 'Click the button to confirm changes – the app switches directly to the dashboard.' },
    ],
  },
  {
    id: 'dashboard',
    num: '04',
    icon: ChartPie,
    titleDe: 'Dashboard & Kennzahlen',
    titleEn: 'Dashboard & metrics',
    introDe: 'Schneller Überblick über Budget, Ausgaben und Handlungsbedarf – auf einen Blick.',
    introEn: 'Instant overview of budget, spending, and action items – at a glance.',
    pointsDe: [
      { label: 'Geplante Ausgaben', text: 'Summe aller Kostenpositionen, unabhängig vom Status.' },
      { label: 'Geplante Restausgaben', text: 'Nur noch offene Posten – bildet gemeinsam mit Ausgegeben die Ergebnisbasis.' },
      { label: 'Ausgegeben', text: 'Nur Ist-Beträge von Posten mit Status Bezahlt oder Fertig fließen hier ein.' },
      { label: 'Voraussichtliches Ergebnis', text: 'Budget minus (Restausgaben + Ausgegeben) – zeigt den erwarteten finanziellen Spielraum.' },
      { label: 'Nächste Schritte', text: 'Kontextuelle Hinweise bei Budgetüberschreitung, fehlenden Zieldaten oder ausstehenden Statusänderungen.' },
    ],
    pointsEn: [
      { label: 'Planned expenses', text: 'Sum of all cost items regardless of status.' },
      { label: 'Planned remaining', text: 'Only open items – together with spent, this forms the result basis.' },
      { label: 'Spent', text: 'Only actual amounts from items with status Paid or Done count here.' },
      { label: 'Estimated result', text: 'Budget minus (remaining + spent) – shows the expected financial headroom.' },
      { label: 'Next steps', text: 'Contextual nudges for budget overruns, missing dates, or pending status updates.' },
    ],
  },
  {
    id: 'table',
    num: '05',
    icon: Table,
    titleDe: 'Ausgaben-Tabelle',
    titleEn: 'Expense table',
    introDe: 'Übersicht und Verwaltung aller Kostenpositionen an einem Ort.',
    introEn: 'Overview and management of all cost items in one place.',
    pointsDe: [
      { label: 'Position hinzufügen', text: 'Erstellt eine neue Zeile mit Standardkategorie und -betrag, die ihr sofort bearbeiten könnt.' },
      { label: 'Filtern', text: 'Schränkt die Ansicht nach Status oder Kategorie ein – nützlich bei großen Planungen.' },
      { label: 'Sortieren', text: 'Klickt auf die Zieldatum-Spalte, um aufsteigend oder absteigend zu ordnen.' },
      { label: 'Statusfluss', text: 'Offen → In Arbeit → Bezahlt → Fertig. Erst Bezahlt/Fertig lässt den Ist-Betrag ins Dashboard fließen.' },
      { label: 'Löschen', text: 'Das Papierkorb-Symbol entfernt die Position sofort und unwiderruflich.' },
    ],
    pointsEn: [
      { label: 'Add item', text: 'Creates a new row with default category and amount, ready to edit.' },
      { label: 'Filter', text: 'Narrow the view by status or category – especially useful for large plans.' },
      { label: 'Sort', text: 'Click the target date column to sort ascending or descending.' },
      { label: 'Status flow', text: 'Open → In Progress → Paid → Done. Only Paid/Done lets the actual amount count in the dashboard.' },
      { label: 'Delete', text: 'The trash icon removes the item immediately and permanently.' },
    ],
  },
  {
    id: 'detail',
    num: '06',
    icon: ClipboardList,
    titleDe: 'Detailansicht einer Position',
    titleEn: 'Item detail view',
    introDe: 'Jede Position kann mit Checkliste, Kommentaren und exakten Beträgen geführt werden.',
    introEn: 'Each item can be managed with a checklist, comments, and precise amounts.',
    pointsDe: [
      { label: 'Gästeabhängige Kosten', text: 'Aktiviert „Pro Person" – der Gesamtbetrag errechnet sich als Kosten × Gästezahl automatisch.' },
      { label: 'Ist-Betrag', text: 'Tragt ein, was tatsächlich bezahlt wurde – fließt erst ins Dashboard, wenn Status Bezahlt/Fertig ist.' },
      { label: 'Checkliste', text: 'Legt Unteraufgaben mit eigenem Fälligkeitsdatum und Erledigt-Haken an.' },
      { label: 'Kommentare', text: 'Dokumentiert Entscheidungen, Angebotsvergleiche und Absprachen als Zeitstempel-Einträge.' },
    ],
    pointsEn: [
      { label: 'Per-guest costs', text: 'Enable "Per person" – the total is automatically computed as cost × guest count.' },
      { label: 'Actual amount', text: 'Enter what was actually paid – only flows into the dashboard once status is Paid/Done.' },
      { label: 'Checklist', text: 'Create sub-tasks with their own due date and done toggle.' },
      { label: 'Comments', text: 'Document decisions, quote comparisons, and agreements as timestamped entries.' },
    ],
  },
  {
    id: 'export',
    num: '07',
    icon: Share2,
    titleDe: 'Export, Teilen & PDF',
    titleEn: 'Export, share & PDF',
    introDe: 'Sichert eure Planung, teilt sie mit dem Partner oder druckt sie aus.',
    introEn: 'Save your plan, share it with your partner, or print it.',
    pointsDe: [
      { label: 'JSON-Backup', text: 'Lädt die komplette Planung als Datei – empfohlen nach größeren Änderungen und vor Gerätewechsel.' },
      { label: 'Link generieren', text: 'Verpackt alle Daten in einen URL-String zum sofortigen Teilen – kein Dateianhang nötig.' },
      { label: 'PDF (aktueller Reiter)', text: 'Druckt nur die aktuell geöffnete Ansicht.' },
      { label: 'PDF (alle Reiter)', text: 'Druckt alle drei Ansichten untereinander für eine vollständige druckfertige Dokumentation.' },
    ],
    pointsEn: [
      { label: 'JSON backup', text: 'Downloads the entire plan as a file – recommended after major changes or before switching devices.' },
      { label: 'Generate link', text: 'Packs all data into a URL string for instant sharing – no attachment needed.' },
      { label: 'PDF (current tab)', text: 'Prints only the currently open view.' },
      { label: 'PDF (all tabs)', text: 'Prints all three views stacked for a complete print-ready document.' },
    ],
  },
  {
    id: 'privacy',
    num: '08',
    icon: Shield,
    titleDe: 'Privatsphäre & Datensicherheit',
    titleEn: 'Privacy & data safety',
    introDe: 'Eure Daten verlassen niemals euren Browser – volle Kontrolle ohne Cloud-Zwang.',
    introEn: 'Your data never leaves your browser – full control, no cloud required.',
    pointsDe: [
      { label: 'Kein Login', text: 'Keine Registrierung, kein Konto – sofort loslegen ohne persönliche Daten.' },
      { label: 'Lokale Speicherung', text: 'Alle Daten liegen ausschließlich im localStorage eures Browsers.' },
      { label: 'Backup-Empfehlung', text: 'Exportiert regelmäßig JSON-Backups, besonders vor Gerätewechsel oder Browser-Reset.' },
      { label: 'Cache-Vorsicht', text: 'Browserdaten können beim Löschen des Browser-Caches oder im Inkognito-Modus verloren gehen.' },
    ],
    pointsEn: [
      { label: 'No login', text: 'No registration, no account – start immediately without entering personal data.' },
      { label: 'Local storage', text: 'All data lives exclusively in your browser localStorage.' },
      { label: 'Backup recommendation', text: 'Export JSON backups regularly, especially before switching devices or clearing the browser.' },
      { label: 'Cache caution', text: 'Browser data can be lost when clearing the browser cache or using incognito mode.' },
    ],
  },
];

export default function HowToPage() {
  const router = useRouter();
  const { lang, switchLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeId, setActiveId] = useState<string>(SECTIONS[0]?.id ?? '');
  const mainRef = useRef<HTMLDivElement>(null);

  /* scrollspy via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const de = lang === 'de';

  return (
    <div className="howto-page">
      {/* ── Navbar ─────────────────────────────── */}
      <nav className="howto-nav">
        <button className="outline howto-nav__back" onClick={() => router.push('/')}>
          <ArrowLeft size={16} />
          {de ? 'Zurück' : 'Back'}
        </button>

        <div className="nav-brand">
          <Image src="/app-icon-light.svg" alt="WedBudget" width={22} height={22} priority />
          WedBudget
        </div>

        <div className="howto-nav__right">
          <button
            className="theme-switch"
            onClick={toggleTheme}
            title={de ? 'Farbmodus wechseln' : 'Toggle theme'}
            suppressHydrationWarning
          >
            <span className="theme-switch__thumb">
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </span>
          </button>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => switchLang(e.target.value)}
            aria-label={de ? 'Sprache auswählen' : 'Select language'}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────── */}
      <section className="howto-hero">
        <div className="howto-hero__badge fade-in">
          <BookOpen size={14} />
          {de ? 'Benutzerhandbuch' : 'User manual'}
        </div>
        <h1 className="howto-hero__title fade-in delay-1">
          {de ? 'WedBudget von A bis Z' : 'WedBudget from A to Z'}
        </h1>
        <p className="howto-hero__lead fade-in delay-2">
          {de
            ? 'Alle Funktionen erklärt – vom ersten Klick bis zum PDF-Export.'
            : 'Every feature explained – from the first click to the PDF export.'}
        </p>
        <span className="howto-hero__meta fade-in delay-3">
          {de ? '8 Abschnitte · ca. 5 min Lesezeit' : '8 sections · ~5 min read'}
        </span>
      </section>

      {/* ── Quick-nav pills ───────────────────── */}
      <div className="howto-quicknav-row">
        <div className="howto-quicknav">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`howto-quicknav-pill${activeId === s.id ? ' howto-quicknav-pill--active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="howto-quicknav-pill__num">{s.num}</span>
              {de ? s.titleDe.split('&')[0].trim() : s.titleEn.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body: sidebar + main ──────────────── */}
      <div className="howto-body-outer">
        <div className="howto-body">
          {/* sidebar TOC */}
          <aside className="howto-sidebar" aria-label={de ? 'Inhaltsverzeichnis' : 'Table of contents'}>
            <p className="howto-toc-title">{de ? 'Inhalt' : 'Contents'}</p>
            <nav className="howto-toc">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    className={`howto-toc-link${activeId === s.id ? ' howto-toc-link--active' : ''}`}
                    onClick={() => scrollTo(s.id)}
                  >
                    <span className="howto-toc-link__icon">
                      <Icon size={13} />
                    </span>
                    <span className="howto-toc-link__num">{s.num}</span>
                    {de ? s.titleDe : s.titleEn}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* main content */}
          <main ref={mainRef} className="howto-main">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const title = de ? s.titleDe : s.titleEn;
              const intro = de ? s.introDe : s.introEn;
              const points = de ? s.pointsDe : s.pointsEn;

              return (
                <article key={s.id} id={s.id} className="howto-card fade-in">
                  {/* watermark step number */}
                  <span className="howto-card__watermark" aria-hidden>{s.num}</span>

                  <header className="howto-card__header">
                    <div className="howto-card__icon-badge">
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="howto-card__step-label">{de ? `Abschnitt ${s.num}` : `Section ${s.num}`}</span>
                      <h2 className="howto-card__title">{title}</h2>
                    </div>
                  </header>

                  <p className="howto-card__intro">{intro}</p>

                  <ul className="howto-card__list">
                    {points.map((pt) => (
                      <li key={pt.label} className="howto-card__point">
                        <span className="howto-card__point-label">{pt.label}</span>
                        <span className="howto-card__point-text">{pt.text}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}

            {/* Inline CTA at end of content */}
            <div className="howto-end-cta glass-panel">
              <p>{de ? 'Bereit? Startet jetzt eure Planung.' : 'Ready? Start your plan now.'}</p>
              <button onClick={() => router.push('/')}>
                {de ? 'Zur Planung' : 'Open planner'} <ArrowRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* ── Footer ───────────────────────────── */}
      <footer className="howto-foot">
        {`© ${new Date().getFullYear()} WedBudget · `}
        {de
          ? 'Ein kostenfreies Tool zur Hochzeitsplanung.'
          : 'A free wedding planning tool.'}
      </footer>
    </div>
  );
}
