# Projektdokumentation: Hochzeitsrechner (WedBudget)

## 1. Zweck und Kontext

Die Anwendung `Hochzeitsrechner` ist ein browserbasiertes Planungswerkzeug zur strukturierten Verwaltung von Hochzeitsbudgets. Zielgruppe sind Paare, die ohne Tabellenkalkulation und ohne Registrierung eine schnelle und transparente Kostenplanung durchführen wollen.

Die Lösung ist als Single Page Application (SPA) umgesetzt und arbeitet vollständig clientseitig.

## 2. Produktüberblick

### 2.1 Hauptnutzen

- Schneller Einstieg in eine neue Budgetplanung.
- Realistische Startwerte durch vordefinierte Kostenpositionen.
- Unterstützung bei Budgetkontrolle über Soll-/Ist-Vergleiche.
- Datenhoheit durch lokale Speicherung im Browser.
- Einfaches Teilen durch URL und Export als JSON.

### 2.2 Zielgruppen

- Brautpaare in der Planungsphase.
- Nutzer mit geringem technischen Vorwissen.
- Nutzer mit erhöhtem Datenschutzbedarf (ohne Accounts).

## 3. Funktionsumfang (Ist-Stand)

### 3.1 Einstieg und Navigation

- Landing Page mit folgenden Optionen:
  - Neue Planung starten
  - Letzte Planung fortsetzen (wenn lokale Daten existieren)
  - Backup-Datei (`.json`) importieren
- Sprachumschaltung zwischen Deutsch und Russisch.
- Interne Navigation zwischen Landing Page und Rechneransicht.

### 3.2 Budgetrechner

- Eingabefelder für:
  - Gästezahl
  - Region (Bundesland/International)
  - Gesamtbudget
- Ausgabe von Kennzahlen:
  - Geplante Summe
  - Tatsächliche Summe
  - Puffer (Budget minus max(Soll, Ist))
- Kategoriebasierte Visualisierung per Balkendiagramm (Soll vs. Ist).

### 3.3 Ausgabentabelle

- Tabellenzeilen mit:
  - Status (offen/bezahlt)
  - Kategorie
  - Positionsname
  - Kommentar
  - Gästeabhängiger Faktor (`isPerPerson`, `costPerPerson`)
  - Geplanter Betrag
  - Tatsächlicher Betrag
- Nutzeraktionen:
  - Position hinzufügen
  - Position löschen
  - Positionen bearbeiten
  - Status toggeln

### 3.4 Heuristik und automatische Anpassung

- Regionsabhängiger Multiplikator auf Basis vordefinierter Werte.
- Automatische Neuberechnung für als gästeabhängig markierte Positionen.
- Spezielle Regel für `Location -> Miete & Reinigung` bei Änderung der Gästezahl.

### 3.5 Persistenz und Datenaustausch

- Auto-Save in `localStorage` bei jeder relevanten Änderung.
- JSON-Export mit Versionsfeld.
- JSON-Import inkl. Strukturprüfung und Migration.
- Share-Link-Generierung über URL-Parameter `data` (Base64-kodierter JSON-String).
- Laden geteilter Daten über URL, danach Bereinigung der Browser-Adresszeile.

### 3.6 Druck und Reporting

- Browser-Druckfunktion über dedizierte Print-Styles.
- Ausblendung interaktiver UI-Elemente in Print-Ausgabe.

## 4. Architektur und technischer Aufbau

### 4.1 Architekturmodell

- Frontend-only SPA
- React-Komponentenstruktur mit zentralem Top-Level-State in `App` und `Calculator`
- Browser APIs für Persistenz und Austausch (`localStorage`, `FileReader`, `Blob`, `URL`, `window.print`)

### 4.2 Modulübersicht

- `src/main.jsx`: Einstiegspunkt und Root-Render.
- `src/App.jsx`: Seitensteuerung (`landing`/`calculator`) und initiales Laden aus URL/Storage.
- `src/LandingPage.jsx`: Startoberfläche, Import und Fortsetzungslogik.
- `src/Calculator.jsx`: Geschäftslogik für Budget, Tabelle, Statistiken, Diagramme.
- `src/LanguageContext.jsx`: Übersetzungen (DE/RU) und Sprachpersistenz.
- `src/storage.js`: Defaultdaten, Migration, lokale Speicherung, Import/Export, Share-URL.
- `src/index.css`: Hauptstyling inkl. Layout, Komponenten und Animationen.
- `src/print.css`: Druckdarstellung.

### 4.3 Datenmodell

Top-Level-Datenobjekt:

```json
{
  "version": 1,
  "guestCount": 80,
  "region": "Nordrhein-Westfalen",
  "totalBudget": 25000,
  "expenses": []
}
```

Expense-Objekt:

```json
{
  "id": "string",
  "category": "string",
  "item": "string",
  "estimated": 0,
  "actual": 0,
  "paid": false,
  "comment": "string",
  "isPerPerson": false,
  "costPerPerson": 0
}
```

### 4.4 Zustandsmanagement

- Lokaler React-State (`useState`) in Komponenten.
- Abgeleitete Werte über Berechnungen und `useMemo`.
- Synchronisation mit `localStorage` über `useEffect`.

### 4.5 Internationalisierung

- Kontextbasiertes i18n mit `LanguageContext`.
- Übersetzungsobjekte für `de` und `ru`.
- Sprachwahl wird in `localStorage` (`wedbudget_lang`) gespeichert.

## 5. Build, Betrieb und Qualität

### 5.1 Tooling

- Build-System: Vite
- Linting: ESLint Flat Config
- Laufzeitabhängigkeiten: React, Recharts, lucide-react

### 5.2 Entwicklungsbetrieb

- `npm run dev`: lokale Entwicklungsumgebung
- `npm run build`: Produktionsbuild
- `npm run preview`: Vorschau des Produktionsbuilds
- `npm run lint`: statische Codeanalyse

### 5.3 Aktueller Teststatus

- Keine automatisierten Tests im Projekt vorhanden.
- Qualitätsabsicherung derzeit primär manuell und per Linting.

## 6. Sicherheit, Datenschutz, Compliance

### 6.1 Datenschutz

- Keine Benutzerkonten, keine serverseitige Persistenz.
- Daten verbleiben lokal im Browser, außer Nutzer nutzt aktiv Export/Share.

### 6.2 Potenzielle Datenschutz-/Sicherheitsaspekte

- Share-Link enthält Budgetdaten im URL-Parameter; kann in Browser-Historie oder Logs auftauchen.
- Keine Verschlüsselung der geteilten Daten, nur Kodierung.

### 6.3 Empfohlene Verbesserungen

- Optional passwortgeschützter Export.
- Optionales Hinweismodul vor Link-Teilen (Datenschutzwarnung).
- Begrenzung und Validierung für numerische Eingaben (z. B. keine negativen Beträge).

## 7. Performance und Skalierung

### 7.1 Ist-Einschätzung

- Für typische Nutzungsgrößen (Dutzende bis wenige hundert Positionen) ausreichend performant.
- Berechnungen sind linear zur Anzahl der Positionen und dadurch in der Praxis effizient.

### 7.2 Mögliche Engpässe

- Sehr große `expenses`-Listen können Rendering und URL-Länge belasten.
- Share-URL kann Browser-/Server-Limits überschreiten.

### 7.3 Optimierungspotenzial

- Virtuelles Rendering für große Tabellen.
- Alternative Share-Strategie (komprimiert oder serverseitig tokenisiert).
- Debouncing für bestimmte Eingaben.

## 8. UX- und Accessibility-Bewertung

### 8.1 Positive Punkte

- Klare Aufteilung in Landing, Setup, Kennzahlen, Tabelle und Diagramm.
- Konsistente visuelle Sprache (Dark Theme, Panels, Icons).
- Print-Ansicht für praktische Offline-Nutzung.

### 8.2 Verbesserungsfelder

- Vollständige Tastaturbedienbarkeit und Fokusindikatoren systematisch prüfen.
- Formale Barrierefreiheitsprüfung (ARIA, Kontrast, Screenreader) ergänzen.
- Validierungsfeedback bei ungültigen Eingaben erweitern.

## 9. Technische Risiken und Schulden

- Verwendung von `escape`/`unescape` in URL-Encoding-Pfaden gilt als veraltet.
- Keine automatisierten Unit-/Integrationstests.
- `src/App.css` enthält Vite-Template-Reste und wird aktuell nicht verwendet.

## 10. Empfehlungen (Roadmap)

1. Testbasis etablieren (Vitest + React Testing Library, Kernlogik zuerst).
2. Eingabevalidierung und Guardrails ergänzen (min/max, negative Werte, Typprüfung).
3. Share-Funktion robust machen (Komprimierung, Längencheck, Fallback).
4. Refactoring der Heuristik in reine Utility-Funktionen für bessere Testbarkeit.
5. UX-Verbesserung für mobile Tabellenansicht (Cards/Accordion als Alternative).
6. Bereinigung ungenutzter Assets/CSS.

## 11. Fachliches Fazit

Die Anwendung ist für einen klaren, praxisnahen Anwendungsfall solide umgesetzt und bietet einen hohen direkten Nutzen für Endanwender. Besonders positiv sind der datenschutzfreundliche Ansatz, die lokale Datenhaltung und der alltagstaugliche Funktionsumfang. Für den nächsten Reifegrad sollten Testabdeckung, Validierung und Robustheit der Sharing-Mechanik priorisiert werden.
