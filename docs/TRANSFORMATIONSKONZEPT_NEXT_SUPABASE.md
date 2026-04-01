# Transformationskonzept: WedBudget von React/Vite zu Next.js + Tailwind + Supabase + Vercel

## 1. Zielbild

Das bestehende Frontend wird auf einen produktionsreifen SaaS-Stack umgebaut, ohne den aktuellen Funktionsumfang der Budgetplanung zu verlieren.

Ziel-Stack:

- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth, Postgres, Storage, optional Edge Functions)
- Vercel (Deployment, Preview Environments, Production)

## 2. Was erhalten bleiben muss (Funktionsparität)

Der aktuelle Kernnutzen bleibt identisch:

- Hochzeitsbudget erstellen und fortlaufend pflegen
- Kostenpositionen verwalten
- Soll/Ist/Buffer auswerten
- Kategorien und Diagramm nutzen
- Daten sicher speichern
- Mehrsprachigkeit im Produkt

## 3. Delta zwischen Ist-System und Zielplattform

Ist-System:

- Reines Browser-Frontend ohne Backend
- Speicherung in Browser Local Storage
- Freie Nutzung ohne Anmeldung
- Sprachen DE/RU

Zielplattform:

- Mandantenfähige Plattform mit Accounts und Rollen
- Persistente Cloud-Daten in Supabase
- Rechtssichere Registrierung und Login
- Rollen und Lizenzlogik
- Sprachen DE/EN
- Monetarisierung und User-/Projekt-Lizenzen

## 4. Aktivitätsübersicht für den Umbau

### 4.1 Produkt- und Domain-Aktivitäten

- Zielgruppen- und Preisstrategie definieren
- Rollenmodell und Rechtekatalog finalisieren
- Projektauswahl und Lizenzmodell fachlich schneiden
- Terms Acceptance Flow (AGB/Datenschutz/Impressum) definieren
- FAQ/Hilfe Informationsarchitektur definieren

### 4.2 Technische Kernaktivitäten

- Neues Monorepo oder neues Next.js Hauptprojekt anlegen
- Datenmodell in Supabase entwerfen und migrationsfähig versionieren
- Auth-Flows (Login, Registrierung, Session) integrieren
- Telefonvalidierung über WhatsApp oder SMS integrieren
- Bestehende Rechenlogik in testbare Domain-Funktionen auslagern
- UI von CSS auf Tailwind-Komponenten migrieren
- i18n auf DE/EN umstellen
- Rollenbasierte Zugriffskontrolle im Frontend und in Row Level Security umsetzen
- Lizenzprüfung in Middleware und API-Routen einbauen
- Vercel Deployment mit Env-Secrets und Branch-Preview aufsetzen

### 4.3 Compliance- und Operations-Aktivitäten

- Rechtstexte bereitstellen und versionieren
- Consent-Logging für Registrierung umsetzen
- Monitoring, Error Tracking, Audit Events einführen
- Backup- und Restore-Prozess für Datenbank definieren

## 5. Zielarchitektur

## 5.1 Schichten

- Frontend: Next.js App Router Seiten und Server Components
- Application Layer: Server Actions oder Route Handlers
- Data Layer: Supabase Postgres + RLS Policies
- Identity: Supabase Auth + OTP/Provider
- Communication: WhatsApp/SMS Provider für Telefonvalidierung
- Hosting: Vercel

## 5.2 Empfohlene technische Entscheidungen

- Next.js App Router verwenden
- Tailwind mit Design Tokens und Komponentenbibliothek
- Internationale Texte mit next-intl oder i18next
- Diagramme weiterhin mit Recharts (oder Alternative falls Bundle-Ziel dies erfordert)
- Domain-Logik als reine Funktionen in lib/domain

## 6. Rollen- und Rechteprinzip

Empfohlene Rollen:

- Super Admin
: Plattformkonfiguration, Lizenzpläne, User-Moderation, Support-Eingriffe

- Admin
: Verwaltung von Organisation/Team, Projekt- und User-Lizenzen im eigenen Tenant

- User
: Erstellung und Bearbeitung eigener Projekte nach Lizenzgrenzen

- Readonly User (optional)
: Lesender Zugriff für Partner/Berater

Rechtebeispiele:

- User: eigene Projekte lesen/schreiben, keine globalen Einstellungen
- Admin: User im Tenant verwalten, Rollen im Tenant vergeben
- Super Admin: Plattformweite Reports, globale Policies

Sicherheitsprinzip:

- Jede Datenzugriffsregel zusätzlich in Supabase RLS abbilden
- Kein Vertrauen nur auf Frontend-Gating

## 7. Anmeldung und Registrierung

## 7.1 Login

- E-Mail + Passwort und optional Social Login
- Session Handling über Supabase
- Optional: Magic Link für einfache Rückkehr

## 7.2 Registrierung mit Telefonvalidierung

Empfehlung:

- Primär: SMS OTP (stabil, standardisiert)
- Optional: WhatsApp OTP als zweiter Kanal

Flow:

1. Nutzer gibt E-Mail, Passwort, Name, Telefon ein
2. Nutzer akzeptiert Pflicht-Checkboxen
3. OTP wird via SMS/WhatsApp versendet
4. Nutzer bestätigt OTP
5. Account wird freigeschaltet

Pflicht-Checkboxen:

- Zustimmung zu AGB
- Zustimmung zu Datenschutzerklärung
- Bestätigung Volljährigkeit oder gesetzliche Vertretung (je nach Zielmarkt)
- Optionales Marketing-Opt-in getrennt von Pflichtzustimmungen

Nachweisbarkeit:

- Versionierte Rechtstexte
- Timestamp, IP Hash, User ID, Dokumentversion in Consent-Tabelle

## 8. Admin-Ansicht User Management

Funktionen:

- User suchen/filtern
- Rolle zuweisen/entziehen
- Account sperren/reaktivieren
- Lizenzstatus einsehen
- Projektnutzung pro User sehen
- Audit-Log anzeigen

Technik:

- Eigene Admin-Bereiche in Next.js Route Groups
- Zugriff nur bei Admin/Super Admin
- Server-seitige Guard + RLS + Audit Logging

## 9. Rechtliche Seiten

Pflichtseiten:

- AGB
- Datenschutz
- Impressum

Umsetzung:

- Statische Seiten mit Versionierung
- Sichtbar im Footer und im Registrierungsflow
- Versionsnummern in Consent-Log speichern

## 10. Spracheinstellungen DE/EN

Ziel:

- Produkt vollständig in Deutsch und Englisch
- Sprache pro Nutzerprofil speicherbar
- URL-basiertes Locale Routing möglich

Umsetzung:

- Locale Segmente oder Header-basiertes Routing
- Übersetzungskeys je Domain-Bereich
- Migration der existierenden Texte von DE/RU nach DE/EN

## 11. Projektauswahl

Anforderung:

- Nutzer kann mehrere Projekte besitzen
- Aktives Projekt ist auswählbar

Umsetzung:

- Dashboard mit Projektliste, Suche, Filter
- Projektkontext in Session oder URL Segment
- Rechteprüfung pro Projektmitgliedschaft

## 12. Monetarisierung: Projekt- und User-Lizenzierung

Empfohlenes Modell:

- Basisplan: 1 Projekt, begrenzte User
- Pro Plan: mehrere Projekte, mehr User, Export/Sharing erweitert
- Team Plan: Rollenverwaltung, erweiterte Admin-Funktionen

Lizenzobjekte:

- Subscription
- License Seat
- Project Quota

Durchsetzung:

- Hard Limits serverseitig vor Schreiboperationen
- Soft Warnings im Frontend (Upsell Hinweise)

Zahlung:

- Stripe als Standard (Abo, Rechnungen, Webhooks)

## 13. FAQ und Hilfe-Menüs

Ziel:

- Selbsthilfe senkt Supportaufwand

Umsetzung:

- Hilfe-Center im eingeloggten Bereich
- Kontextbezogene Hilfetexte in Formularen
- FAQ Kategorien: Budgetlogik, Export, Sharing, Lizenzen, Konto

## 14. Funktionsparitäts-Matrix (Ist zu Ziel)

- Gästezahl, Region, Budget
: bleibt erhalten; Domain-Logik wird unverändert portiert

- Positionen (Kategorie, Kosten, Status)
: bleibt erhalten; Speicherung in Tabellen statt Local Storage

- Soll/Ist/Buffer Berechnung
: bleibt erhalten; in Domain-Layer getestet

- Diagramm je Kategorie
: bleibt erhalten; Recharts in Client-Komponente

- JSON Export/Import
: bleibt erhalten; zusätzlich serverseitiges Backup optional

- Share Link
: bleibt erhalten; perspektivisch über sichere Share Tokens statt Voll-Daten in URL

- Druck/PDF
: bleibt erhalten; Print CSS oder PDF-Export Service

- Sprache
: Umstellung von DE/RU auf DE/EN

## 15. Datenmodell Vorschlag (Supabase)

Kern-Tabellen:

- users_profile
- organizations (optional, wenn Teams geplant)
- projects
- project_members
- expenses
- subscriptions
- license_seats
- consent_logs
- audit_logs

Wichtige Felder:

- projects: owner_id, name, wedding_date, guest_count, region, total_budget
- expenses: project_id, category_key, item, estimated, actual, paid, comment, is_per_person, cost_per_person
- consent_logs: user_id, terms_version, privacy_version, accepted_at, ip_hash

## 16. Migrationsstrategie zur Erhaltung der Funktionalität

### Phase 0: Stabilisierung Ist-System

- Domain-Logik kapseln und mit Tests absichern
- Export-/Importformat als Vertrag festschreiben

### Phase 1: Technisches Fundament

- Next.js Projektstruktur aufsetzen
- Tailwind und UI-Basiskomponenten etablieren
- Supabase Projekt und Tabellen/RLS erstellen

### Phase 2: Auth und Benutzerkonto

- Registrierung und Login implementieren
- Telefonvalidierung integrieren
- Consent-Logging aktivieren

### Phase 3: Kernfunktion Budgetrechner

- Rechner-UI portieren
- Tabellenbearbeitung und Berechnung portieren
- Diagramm und Kennzahlen portieren
- Persistenz von Local Storage auf Supabase umstellen

### Phase 4: Admin und Lizenzierung

- Admin User-Management bauen
- Lizenzgrenzen und Prüfungen integrieren
- Zahlungsintegration aktivieren

### Phase 5: Internationalisierung und Hilfe

- DE/EN Texte finalisieren
- FAQ/Hilfe-Menüs integrieren
- QA auf beide Sprachen

### Phase 6: Go-Live

- Lasttests, Security Check, rechtliche Abnahme
- Vercel Production Rollout
- Monitoring und Supportprozesse starten

## 17. Konkreter Umsetzungsplan (10 Wochen)

- Woche 1-2
: Architektur, Datenmodell, RLS, UI-Foundation, CI/CD

- Woche 3-4
: Auth, Registrierung, Telefon-OTP, Consent-Logs

- Woche 5-6
: Rechnerkern und Positionen vollständig portieren, Tests

- Woche 7
: Projektauswahl und Multi-Projektfähigkeit

- Woche 8
: Admin-Management und Rollenverwaltung

- Woche 9
: Lizenzierung, Stripe, Planlimits, Upsell-Flows

- Woche 10
: FAQ/Hilfe, Feinschliff, Security/Legal Review, Go-Live

## 18. Risiken und Gegenmaßnahmen

- Risiko: Funktionsverlust beim Portieren
: Gegenmaßnahme: Paritäts-Matrix + Golden Master Tests

- Risiko: Komplexität der Rollen und Lizenzen
: Gegenmaßnahme: erst klare Matrix, dann schrittweise Freischaltung

- Risiko: OTP-Zustellprobleme
: Gegenmaßnahme: Fallback von WhatsApp auf SMS und Retry-Policy

- Risiko: Rechtliche Unschärfen
: Gegenmaßnahme: juristische Prüfung vor Go-Live

## 19. KPI-Vorschläge für die neue Plattform

- Aktivierungsrate nach Registrierung
- Anteil erfolgreich validierter Telefonnummern
- Time-to-First-Budget (erste nutzbare Planung)
- Conversion auf Paid Plan
- Churn Rate pro Plan
- Supporttickets pro 100 aktive Nutzer

## 20. Digitale Positionierung und Marketing-Konzept

Positionierungskern:

- Emotionale Sicherheit plus finanzielle Klarheit
- Keine Excel-Überforderung, stattdessen geführte Hochzeitsplanung
- Datenschutzfreundlich und transparent

Zielgruppenansprache:

- Paare in der frühen Planungsphase
- Wedding Planner als Multiplikatoren
- Content-Partnerschaften (Blogs, Influencer im Wedding Segment)

Value Proposition:

- Planen wie Profis, einfach wie eine Checkliste
- Budgettransparenz in Echtzeit
- Teamfähig und skalierbar für mehrere Projekte

## 21. Namens-, Logo- und Hook-Vorschläge (mindestens 3)

### Vorschlag 1

- App Name: WedBudget Pro
- Hook: Eure Hochzeit im Kopf, euer Budget im Griff.
- Logo-Idee: Kombi aus Ring-Silhouette und aufsteigendem Budget-Chart in Gold/Sage

### Vorschlag 2

- App Name: BudgetVow
- Hook: Erst das Ja-Wort, dann das Smart-Wort fürs Budget.
- Logo-Idee: Vow-Symbol als geschwungene Linie, die in ein Schild (Sicherheit/Planbarkeit) übergeht

### Vorschlag 3

- App Name: EverPlan Wedding
- Hook: Große Gefühle. Klare Zahlen.
- Logo-Idee: Monogramm EP mit Herz-Negativform und dezenter Kalenderkante

### Vorschlag 4 (Bonus)

- App Name: PlanMyWedding Budget
- Hook: Von der Idee bis zum letzten Euro.
- Logo-Idee: Kreisförmiger Fortschrittsring mit kleiner Diamantmarke als Abschluss

## 22. Empfehlung zur Priorisierung

MVP Priorität:

1. Auth, Registrierung, Consent, Kernrechner, Supabase Persistenz
2. Projektauswahl, DE/EN, rechtliche Seiten
3. Admin-Panel, Lizenzierung, Monetarisierung, Hilfe-Center

Dadurch bleibt die bestehende Kernfunktionalität jederzeit verfügbar, während schrittweise ein belastbares SaaS-Produkt entsteht.
