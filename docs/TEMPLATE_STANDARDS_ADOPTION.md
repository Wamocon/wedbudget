# Template-Standards: Übernahmeprotokoll (Wamocon/template_repo)

## Ziel

Erste Umbauschritte auf Basis der technischen Anforderungen aus `Wamocon/template_repo`, ohne die bestehende Vite-Anwendung sofort abzuschÄlten.

## Übernommene Standards (Phase 1)

- Next.js App Router + TypeScript Strict als neÜs Zielprojekt unter `apps/web`
- Tailwind CSS v4 Integration (`@tailwindcss/postcss`)
- Supabase-Setup-Standard mit `.env.example`
- Supabase Migrationsstruktur unter `supabase/migrations`
- GitHub Actions Workflows mit zentralem Reusable-Workflow-Pattern (`Wamocon/github_workflow`)
- Rechtliche Startvorlagen unter `legal-docs`
- Dokumentations-Erweiterung in der Haupt-README

## Technisch umgesetzt

1. Next.js Ziel-App erstellt
- `apps/web/package.json`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/lib/supabase/client.ts`

2. Tooling und Build-Standards erstellt
- `apps/web/eslint.config.mjs`
- `apps/web/tsconfig.json`
- `apps/web/next.config.ts`
- `apps/web/postcss.config.mjs`

3. Infrastruktur erstellt
- `.github/workflows/pr-pipeline.yml`
- `.github/workflows/deploy.yml`
- `.env.example`

4. Supabase vorbereitet
- `supabase/README.md`
- `supabase/migrations/202604010001_init_app_schema.sql`

5. Rechtstexte als Startstruktur angelegt
- `legal-docs/agb.md`
- `legal-docs/datenschutzerklÄrung.md`
- `legal-docs/impressum.md`

## Verifikation

In `apps/web` erfolgreich ausgefÜhrt:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Status: erfolgreich.

## Hinweis

Beim Build erscheint ein Next.js Hinweis zu mehreren Lockfiles im Workspace. Das ist in der Parallel-Migrationsphase erwartbar.

## NÄchste technische Schritte (Phase 2)

1. Domain-Logik aus der bestehenden Vite-App in shared Utilities extrahieren (Berechnungen, Heuristiken, Kategorien).
2. Seiten in `apps/web` aufbaÜn:
- Landing
- Rechner (FunktionsparitÄt)
- Legal Seiten
3. Supabase RLS und Auth-Struktur einfÜhren (profiles, projects, expenses, memberships).
4. Datenmigration von LocalStorage auf Supabase mit Import-Assistent.
5. DE/EN i18n im Next.js App Router implementieren.



