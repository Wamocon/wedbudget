'use client';

import {
  BookOpen,
  ChartPie,
  ClipboardList,
  FileDown,
  Globe,
  Home,
  ListChecks,
  Share2,
  Shield,
  Sparkles,
  Table,
  Target,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';

interface ManualSection {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  points: string[];
}

interface UserManualProps {
  className?: string;
  titleTag?: 'h2' | 'h3';
}

export default function UserManual({ className = '', titleTag = 'h2' }: UserManualProps) {
  const { lang } = useLanguage();

  const title = lang === 'de' ? 'How-To: Vollstaendiges Benutzerhandbuch' : 'How-To: Complete user manual';
  const intro =
    lang === 'de'
      ? 'Dieses Handbuch fuehrt euch durch alle Bereiche von WedBudget: vom Start bis zum Export eurer finalen Planung.'
      : 'This manual walks you through every part of WedBudget: from first start to exporting your final plan.';

  const sections: ManualSection[] =
    lang === 'de'
      ? [
          {
            title: '1) Startseite und Einstieg',
            icon: Home,
            points: [
              'Neue Planung starten: Beginnt eine frische Planung inklusive gefuehrtem Onboarding.',
              'Letzte Planung fortsetzen: Erscheint automatisch, wenn bereits lokale Daten im Browser vorhanden sind.',
              'Backup-Datei laden (.json): Importiert einen zuvor exportierten Planungsstand.',
              'Bei vorhandenem Stand fragt die App vor dem Ueberschreiben nach Bestaetigung und bietet vorher Export an.',
            ],
          },
          {
            title: '2) Sprache, Design und Datenschutz',
            icon: Globe,
            points: [
              'Sprache oben rechts auf Deutsch oder Englisch umstellen; Einstellung wird lokal gespeichert.',
              'Hell/Dunkel-Modus ueber den Theme-Schalter wechseln.',
              'Privatsphaere: Kein Login, keine Server-Speicherung, alle Daten bleiben lokal im Browser.',
            ],
          },
          {
            title: '3) Gefuehrtes Onboarding',
            icon: Sparkles,
            points: [
              'Beim ersten Start fuehrt euch ein Fragebogen durch Name, Datum, Gaestezahl und Budget.',
              'Relevante Kostenposten werden automatisch vorbereitet, damit ihr nicht bei null beginnt.',
              'Ihr koennt jederzeit zur Startseite zurueck und spaeter im Detailbereich weitere Positionen ergaenzen.',
            ],
          },
          {
            title: '4) Reiter Eckdaten',
            icon: Target,
            points: [
              'Hochzeitsname, Datum, Gaesteanzahl und Gesamtbudget bearbeiten.',
              'Button Aenderungen uebernehmen aktualisiert die Planungsbasis und wechselt ins Dashboard.',
              'Gaesteabhaengige Positionen koennen bei Aenderung der Gaestezahl automatisch neu berechnet werden.',
            ],
          },
          {
            title: '5) Reiter Dashboard und Kennzahlen',
            icon: ChartPie,
            points: [
              'Zeigt Budget, geplante Ausgaben, Restausgaben, ausgegebene Kosten sowie Ergebniswerte.',
              'Ausgegeben wird nur fuer Positionen mit Status Bezahlt oder Fertig gerechnet.',
              'Countdown, Warnhinweise und Naechste Schritte helfen bei Priorisierung und Timing.',
              'Diagramme visualisieren Planung, Ausgaben und Budgetabweichung in Echtzeit.',
            ],
          },
          {
            title: '6) Reiter Details (Tabelle)',
            icon: Table,
            points: [
              'Positionen anlegen, kategorisieren, terminieren und mit Betragen versehen.',
              'Nach Status und Kategorie filtern; Zieldatum auf- oder absteigend sortieren.',
              'Statusfluss: Offen -> In Arbeit -> Bezahlt/Fertig. Erst Bezahlt/Fertig wirkt auf Ausgegeben.',
              'Positionen koennen direkt aus der Tabelle geoeffnet oder geloescht werden.',
            ],
          },
          {
            title: '7) Positions-Detailansicht',
            icon: ClipboardList,
            points: [
              'Kategorie, Titel, Status, Zieldatum, Geplant und Ausgegeben pro Position pflegen.',
              'Gaesteabhaengige Kosten aktivieren: Kosten pro Person berechnen den Gesamtwert automatisch.',
              'Checkliste pro Position fuehren (mit Faelligkeitsdatum und Erledigt-Haken).',
              'Historie/Kommentare dokumentieren Entscheidungen und Aenderungen im Zeitverlauf.',
            ],
          },
          {
            title: '8) Export, Teilen, Drucken',
            icon: Share2,
            points: [
              'Datei: Exportiert die komplette Planung als JSON-Backup zur sicheren Archivierung.',
              'Link: Erstellt einen teilbaren URL-Stand; praktisch fuer Partner-Abgleich.',
              'PDF: Druckansicht fuer aktuellen Reiter oder alle drei Reiter untereinander.',
            ],
          },
          {
            title: '9) Datensicherheit und Best Practices',
            icon: Shield,
            points: [
              'Regelmaessig JSON-Backups speichern, besonders vor groesseren Aenderungen.',
              'Statuskonsequent pflegen, damit Kennzahlen und Warnungen korrekt bleiben.',
              'Zieldaten setzen, um Fristen und die Naechste-Schritte-Logik optimal zu nutzen.',
            ],
          },
          {
            title: '10) Schnellstart in 60 Sekunden',
            icon: ListChecks,
            points: [
              '1. Neue Planung starten und Onboarding kurz durchlaufen.',
              '2. In Eckdaten Name, Datum, Gaeste und Budget finalisieren.',
              '3. Im Detail-Reiter Positionen vervollstaendigen und Status pflegen.',
              '4. Dashboard pruefen, Warnungen abarbeiten, dann Backup und PDF exportieren.',
            ],
          },
        ]
      : [
          {
            title: '1) Home and first steps',
            icon: Home,
            points: [
              'Start a new plan: creates a fresh planning flow including guided onboarding.',
              'Continue last plan: appears automatically when local browser data exists.',
              'Load backup file (.json): imports a previously exported planning state.',
              'If data already exists, the app asks before overwrite and offers export first.',
            ],
          },
          {
            title: '2) Language, visual style, privacy',
            icon: Globe,
            points: [
              'Switch language in the top right between German and English; choice is saved locally.',
              'Toggle light/dark mode with the theme switch.',
              'Privacy first: no login, no server storage, all data remains in your browser.',
            ],
          },
          {
            title: '3) Guided onboarding',
            icon: Sparkles,
            points: [
              'The first-run questionnaire collects plan name, date, guests, and budget.',
              'Relevant cost items are pre-created so you do not start from zero.',
              'You can always return home and add more items later in details.',
            ],
          },
          {
            title: '4) Basics tab',
            icon: Target,
            points: [
              'Edit wedding name, date, guest count, and total budget.',
              'Apply changes updates your plan base and moves to dashboard.',
              'Guest-dependent items can recalculate when guest count changes.',
            ],
          },
          {
            title: '5) Dashboard and key metrics',
            icon: ChartPie,
            points: [
              'Shows budget, planned, remaining, spent, and result metrics.',
              'Spent only includes items with status Paid or Done.',
              'Countdown, warnings, and next steps help you prioritize actions.',
              'Charts visualize planning vs spending and budget deviation live.',
            ],
          },
          {
            title: '6) Details tab (table)',
            icon: Table,
            points: [
              'Create line items, assign categories, set target dates, and enter amounts.',
              'Filter by status/category and sort by target date ascending/descending.',
              'Status flow: Open -> In Progress -> Paid/Done. Paid/Done impacts spent totals.',
              'Open and delete items directly from the table.',
            ],
          },
          {
            title: '7) Item detail view',
            icon: ClipboardList,
            points: [
              'Maintain category, title, status, date, planned amount, and spent amount per item.',
              'Enable per-guest mode so cost per person drives automatic totals.',
              'Use per-item checklists with due dates and done flags.',
              'Use history/comments to track decisions and updates over time.',
            ],
          },
          {
            title: '8) Export, share, print',
            icon: Share2,
            points: [
              'File: exports complete plan as JSON backup for secure archiving.',
              'Link: generates a shareable URL state for partner sync.',
              'PDF: print current tab or all three tabs stacked.',
            ],
          },
          {
            title: '9) Data safety and best practices',
            icon: Shield,
            points: [
              'Save JSON backups regularly, especially before larger edits.',
              'Maintain statuses consistently so metrics and warnings stay accurate.',
              'Set target dates to improve deadline visibility and next-step guidance.',
            ],
          },
          {
            title: '10) 60-second quickstart',
            icon: ListChecks,
            points: [
              '1. Start a new plan and complete onboarding quickly.',
              '2. Finalize name, date, guests, and budget in basics.',
              '3. Complete items in details and maintain their statuses.',
              '4. Review dashboard, resolve warnings, then export backup and PDF.',
            ],
          },
        ];

  const HeadingTag = titleTag;

  return (
    <section className={`how-to-section ${className}`.trim()} aria-label={title}>
      <div className="how-to-header">
        <span className="how-to-badge">
          <BookOpen size={14} />
          {lang === 'de' ? 'How-To' : 'How-To'}
        </span>
        <HeadingTag>{title}</HeadingTag>
        <p>{intro}</p>
      </div>

      <div className="how-to-grid">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="how-to-card">
              <h3>
                <span className="how-to-card__icon">
                  <Icon size={16} />
                </span>
                {section.title}
              </h3>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="how-to-note">
        <FileDown size={15} />
        <span>
          {lang === 'de'
            ? 'Tipp: Nach groesseren Anpassungen immer JSON-Backup und bei Bedarf PDF exportieren.'
            : 'Tip: After larger changes, always export a JSON backup and optionally a PDF.'}
        </span>
      </div>
    </section>
  );
}
