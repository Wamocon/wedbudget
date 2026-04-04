# Hochzeitsrechner (WedBudget)

Webbasierte Anwendung zur Planung von Hochzeitsbudgets mit Fokus auf einfacher Bedienung, lokaler Datenspeicherung und datenschutzfreundlicher Nutzung ohne Login.

## Projektziele

- Hochzeitskosten strukturiert planen und nachverfolgen.
- Soll-/Ist-Kosten pro Kategorie transparent machen.
- Daten lokal sichern, importieren/exportieren und per Link teilen.
- Nutzung in Deutsch und Russisch anbieten.

## Kernfunktionen

- Landing Page mit Einstieg in neÜ Planung, Fortsetzen und JSON-Import.
- Budgetrechner mit:
	- GÃ¤stezahl, Region und Gesamtbudget
	- dynamischer Heuristik fÃ¼r gÃ¤steabhÃ¤ngige Kosten
	- Ausgabenliste mit Kategorien, Notizen, Status und Ist-Werten
	- Balkendiagramm (Soll/Ist) je Kategorie
- Persistenz und Datenaustausch:
	- Auto-Save in `localStorage`
	- JSON-Export/Import
	- URL-basiertes Teilen Ã¼ber Base64-kodierte Nutzdaten
- Druckansicht fÃ¼r PDF/Print-Ausgabe.

## Tech-Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Recharts (Diagramme)
- lucide-react (Icons)
- ESLint 9

## Schnellstart

### Voraussetzungen

- Node.js 20+
- npm 10+

### Installation

```bash
npm --prefix apps/web install
```

### Entwicklung starten

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Dokumentation

- Technische Projektdokumentation: `docs/PROJEKTDOKUMENTATION.md`
- Anforderungsdokument: `docs/ANFORDERUNGSDOKUMENT.md`
- Transformationskonzept (Next.js, Tailwind, Supabase, Vercel): `docs/TRANSFORMATIONSKONZEPT_NEXT_SUPABASE.md`
- VollstÄndige Funktionsdokumentation: `docs/FUNKTIONSDOKUMENTATION.md`
- VollstÄndige Bedienungsanleitung: `docs/BEDIENUNGSANLEITUNG.md`

## Erste UmbaumaÃŸnahmen (Template-Standards)

Die ersten technischen MaÃŸnahmen auf Basis von `Wamocon/template_repo` sind umgesetzt:

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

Das Projekt wird als Single-Repo mit der App unter `apps/web` gefÃ¼hrt.

## Projektstruktur

```text
apps/web/src/
  app/                  # Next.js App Router (Landing, Plan)
  components/           # Landing, Rechner, Onboarding
  context/              # Sprache und Theme
  lib/                  # Domainlogik, Typen, Storage
```

## Hinweis

Die Anwendung ist clientseitig ausgelegt. Es gibt keine serverseitige Nutzerverwaltung oder Cloud-Speicherung.

