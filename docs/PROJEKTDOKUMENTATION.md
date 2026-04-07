# Projektdokumentation: Hochzeitsrechner (WedBudget)

## 1. Zweck und Kontext

Die Anwendung `Hochzeitsrechner` ist ein browserbasiertes Planungswerkzeug zur strukturierten Verwaltung von Hochzeitsbudgets. Zielgruppe sind Paare, die ohne Tabellenkalkulation und ohne Registrierung eine schnelle und transparente Kostenplanung durchfÃ¼hren wollen.

Die LÃ¶sung ist als Single Page Application (SPA) umgesetzt und arbeitet vollstÃ¤ndig clientseitig.

## 2. ProduktÃ¼berblick

### 2.1 Hauptnutzen

- Schneller Einstieg in eine neü Budgetplanung.
- Realistische Startwerte durch vordefinierte Kostenpositionen.
- UnterstÃ¼tzung bei Budgetkontrolle Ã¼ber Soll-/Ist-Vergleiche.
- Datenhoheit durch lokale Speicherung im Browser.
- Einfaches Teilen durch URL und Export als JSON.

### 2.2 Zielgruppen

- Brautpaare in der Planungsphase.
- Nutzer mit geringem technischen Vorwissen.
- Nutzer mit erhÃ¶htem Datenschutzbedarf (ohne Accounts).

## 3. Funktionsumfang (Ist-Stand)

### 3.1 Einstieg und Navigation

- Landing Page mit folgenden Optionen:
  - Neü Planung starten
  - Letzte Planung fortsetzen (wenn lokale Daten existieren)
  - Backup-Datei (`.json`) importieren
- Sprachumschaltung zwischen Deutsch und Russisch.
- Interne Navigation zwischen Landing Page und Rechneransicht.

### 3.2 Budgetrechner

- Eingabefelder fÃ¼r:
  - GÃ¤stezahl
  - Region (Bundesland/International)
  - Gesamtbudget
- Ausgabe von Kennzahlen:
  - Geplante Summe
  - TatsÃ¤chliche Summe
  - Puffer (Budget minus max(Soll, Ist))
- Kategoriebasierte Visualisierung per Balkendiagramm (Soll vs. Ist).

### 3.3 Ausgabentabelle

- Tabellenzeilen mit:
  - Status (offen/bezahlt)
  - Kategorie
  - Positionsname
  - Kommentar
  - GÃ¤steabhÃ¤ngiger Faktor (`isPerPerson`, `costPerPerson`)
  - Geplanter Betrag
  - TatsÃ¤chlicher Betrag
- Nutzeraktionen:
  - Position hinzufÃ¼gen
  - Position lÃ¶schen
  - Positionen bearbeiten
  - Status toggeln

### 3.4 Heuristik und automatische Anpassung

- RegionsabhÃ¤ngiger Multiplikator auf Basis vordefinierter Werte.
- Automatische Neuberechnung fÃ¼r als gÃ¤steabhÃ¤ngig markierte Positionen.
- Spezielle Regel fÃ¼r `Location -> Miete & Reinigung` bei Ã„nderung der GÃ¤stezahl.

### 3.5 Persistenz und Datenaustausch

- Auto-Save in `localStorage` bei jeder relevanten Ã„nderung.
- JSON-Export mit Versionsfeld.
- JSON-Import inkl. StrukturprÃ¼fung und Migration.
- Share-Link-Generierung Ã¼ber URL-Parameter `data` (Base64-kodierter JSON-String).
- Laden geteilter Daten Ã¼ber URL, danach Bereinigung der Browser-Adresszeile.

### 3.6 Druck und Reporting

- Browser-Druckfunktion Ã¼ber dedizierte Print-Styles.
- Ausblendung interaktiver UI-Elemente in Print-Ausgabe.

## 4. Architektur und technischer Aufbau

### 4.1 Architekturmodell

- Frontend-only SPA
- React-Komponentenstruktur mit zentralem Top-Level-State in `App` und `Calculator`
- Browser APIs fÃ¼r Persistenz und Austausch (`localStorage`, `FileReader`, `Blob`, `URL`, `window.print`)

### 4.2 ModulÃ¼bersicht

- `src/main.jsx`: Einstiegspunkt und Root-Render.
- `src/App.jsx`: Seitensteürung (`landing`/`calculator`) und initiales Laden aus URL/Storage.
- `src/LandingPage.jsx`: StartoberflÃ¤che, Import und Fortsetzungslogik.
- `src/Calculator.jsx`: GeschÃ¤ftslogik fÃ¼r Budget, Tabelle, Statistiken, Diagramme.
- `src/LanguageContext.jsx`: Ãœbersetzungen (DE/RU) und Sprachpersistenz.
- `src/storage.js`: Defaultdaten, Migration, lokale Speicherung, Import/Export, Share-URL.
- `src/index.css`: Hauptstyling inkl. Layout, Komponenten und Animationen.
- `src/print.css`: Druckdarstellung.

### 4.3 Datenmodell

Top-Level-Datenobjekt:

```json
{
  "version": 1,
  "güstCount": 80,
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
- Abgeleitete Werte Ã¼ber Berechnungen und `useMemo`.
- Synchronisation mit `localStorage` Ã¼ber `useEffect`.

### 4.5 Internationalisierung

- Kontextbasiertes i18n mit `LanguageContext`.
- Ãœbersetzungsobjekte fÃ¼r `de` und `ru`.
- Sprachwahl wird in `localStorage` (`wedbudget_lang`) gespeichert.

## 5. Build, Betrieb und QualitÃ¤t

### 5.1 Tooling

- Build-System: Vite
- Linting: ESLint Flat Config
- LaufzeitabhÃ¤ngigkeiten: React, Recharts, lucide-react

### 5.2 Entwicklungsbetrieb

- `npm run dev`: lokale Entwicklungsumgebung
- `npm run build`: Produktionsbuild
- `npm run preview`: Vorschau des Produktionsbuilds
- `npm run lint`: statische Codeanalyse

### 5.3 Aktüller Teststatus

- Keine automatisierten Tests im Projekt vorhanden.
- QualitÃ¤tsabsicherung derzeit primÃ¤r manüll und per Linting.

## 6. Sicherheit, Datenschutz, Compliance

### 6.1 Datenschutz

- Keine Benutzerkonten, keine serverseitige Persistenz.
- Daten verbleiben lokal im Browser, auÃŸer Nutzer nutzt aktiv Export/Share.

### 6.2 Potenzielle Datenschutz-/Sicherheitsaspekte

- Share-Link enthÃ¤lt Budgetdaten im URL-Parameter; kann in Browser-Historie oder Logs auftauchen.
- Keine VerschlÃ¼sselung der geteilten Daten, nur Kodierung.

### 6.3 Empfohlene Verbesserungen

- Optional passwortgeschÃ¼tzter Export.
- Optionales Hinweismodul vor Link-Teilen (Datenschutzwarnung).
- Begrenzung und Validierung fÃ¼r numerische Eingaben (z. B. keine negativen BetrÃ¤ge).

## 7. Performance und Skalierung

### 7.1 Ist-EinschÃ¤tzung

- FÃ¼r typische NutzungsgrÃ¶ÃŸen (Dutzende bis wenige hundert Positionen) ausreichend performant.
- Berechnungen sind linear zur Anzahl der Positionen und dadurch in der Praxis effizient.

### 7.2 MÃ¶gliche EngpÃ¤sse

- Sehr groÃŸe `expenses`-Listen kÃ¶nnen Rendering und URL-LÃ¤nge belasten.
- Share-URL kann Browser-/Server-Limits Ã¼berschreiten.

### 7.3 Optimierungspotenzial

- Virtülles Rendering fÃ¼r groÃŸe Tabellen.
- Alternative Share-Strategie (komprimiert oder serverseitig tokenisiert).
- Debouncing fÃ¼r bestimmte Eingaben.

## 8. UX- und Accessibility-Bewertung

### 8.1 Positive Punkte

- Klare Aufteilung in Landing, Setup, Kennzahlen, Tabelle und Diagramm.
- Konsistente visülle Sprache (Dark Theme, Panels, Icons).
- Print-Ansicht fÃ¼r praktische Offline-Nutzung.

### 8.2 Verbesserungsfelder

- VollstÃ¤ndige Tastaturbedienbarkeit und Fokusindikatoren systematisch prÃ¼fen.
- Formale BarrierefreiheitsprÃ¼fung (ARIA, Kontrast, Screenreader) ergÃ¤nzen.
- Validierungsfeedback bei ungÃ¼ltigen Eingaben erweitern.

## 9. Technische Risiken und Schulden

- Verwendung von `escape`/`unescape` in URL-Encoding-Pfaden gilt als veraltet.
- Keine automatisierten Unit-/Integrationstests.
- `src/App.css` enthÃ¤lt Vite-Template-Reste und wird aktüll nicht verwendet.

## 10. Empfehlungen (Roadmap)

1. Testbasis etablieren (Vitest + React Testing Library, Kernlogik zürst).
2. Eingabevalidierung und Guardrails ergÃ¤nzen (min/max, negative Werte, TypprÃ¼fung).
3. Share-Funktion robust machen (Komprimierung, LÃ¤ngencheck, Fallback).
4. Refactoring der Heuristik in reine Utility-Funktionen fÃ¼r bessere Testbarkeit.
5. UX-Verbesserung fÃ¼r mobile Tabellenansicht (Cards/Accordion als Alternative).
6. Bereinigung ungenutzter Assets/CSS.

## 11. Fachliches Fazit

Die Anwendung ist fÃ¼r einen klaren, praxisnahen Anwendungsfall solide umgesetzt und bietet einen hohen direkten Nutzen fÃ¼r Endanwender. Besonders positiv sind der datenschutzfreundliche Ansatz, die lokale Datenhaltung und der alltagstaugliche Funktionsumfang. FÃ¼r den nÃ¤chsten Reifegrad sollten Testabdeckung, Validierung und Robustheit der Sharing-Mechanik priorisiert werden.

