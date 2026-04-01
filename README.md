# Hochzeitsrechner (WedBudget)

Webbasierte Anwendung zur Planung von Hochzeitsbudgets mit Fokus auf einfacher Bedienung, lokaler Datenspeicherung und datenschutzfreundlicher Nutzung ohne Login.

## Projektziele

- Hochzeitskosten strukturiert planen und nachverfolgen.
- Soll-/Ist-Kosten pro Kategorie transparent machen.
- Daten lokal sichern, importieren/exportieren und per Link teilen.
- Nutzung in Deutsch und Russisch anbieten.

## Kernfunktionen

- Landing Page mit Einstieg in neue Planung, Fortsetzen und JSON-Import.
- Budgetrechner mit:
	- Gästezahl, Region und Gesamtbudget
	- dynamischer Heuristik für gästeabhängige Kosten
	- Ausgabenliste mit Kategorien, Notizen, Status und Ist-Werten
	- Balkendiagramm (Soll/Ist) je Kategorie
- Persistenz und Datenaustausch:
	- Auto-Save in `localStorage`
	- JSON-Export/Import
	- URL-basiertes Teilen über Base64-kodierte Nutzdaten
- Druckansicht für PDF/Print-Ausgabe.

## Tech-Stack

- React 19
- Vite 7
- Recharts (Diagramme)
- lucide-react (Icons)
- ESLint 9

## Schnellstart

### Voraussetzungen

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Entwicklung starten

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Dokumentation

- Technische Projektdokumentation: `docs/PROJEKTDOKUMENTATION.md`
- Anforderungsdokument: `docs/ANFORDERUNGSDOKUMENT.md`
- Transformationskonzept (Next.js, Tailwind, Supabase, Vercel): `docs/TRANSFORMATIONSKONZEPT_NEXT_SUPABASE.md`

## Erste Umbaumaßnahmen (Template-Standards)

Die ersten technischen Maßnahmen auf Basis von `Wamocon/template_repo` sind umgesetzt, ohne die bestehende Vite-App zu brechen:

- Next.js-Migrationsziel unter `apps/web` (App Router + TypeScript + Tailwind v4 + Supabase-Client)
- Supabase-Migrationsstruktur unter `supabase/migrations`
- CI/CD-Workflow-Dateien unter `.github/workflows` (reusable workflows)
- `.env.example` mit Supabase- und App-Variablen
- rechtliche Startvorlagen unter `legal-docs`

### Next.js-Migrationsziel lokal starten

```bash
cd apps/web
npm install
npm run dev
```

Die bestehende Anwendung unter Vite bleibt parallel funktionsfähig und kann schrittweise migriert werden.

## Projektstruktur

```text
src/
	App.jsx                # Routing zwischen Landing und Rechner
	LandingPage.jsx        # Einstieg, Import und Fortsetzen
	Calculator.jsx         # Kernlogik Budget, Tabelle, Diagramme
	LanguageContext.jsx    # i18n (DE/RU)
	storage.js             # Persistenz, Import/Export, Share-URL
	index.css              # Hauptstyles (Layout, Komponenten, Animationen)
	print.css              # Druckansicht
```

## Hinweis

Die Anwendung ist clientseitig ausgelegt. Es gibt keine serverseitige Nutzerverwaltung oder Cloud-Speicherung.
