# WedBudget Funktionsdokumentation

## 1. Übersicht
Dieses Dokument beschreibt die komplette Funktionsbasis der App auf Fach- und Technikniveau.

## 2. Funktionsmodule

### 2.1 Landing und Einstieg
Komponente: src/components/landing-page.tsx

Funktionen:
- ContinÜ-Flow bei vorhandenen lokalen Daten
- New-Flow mit Schutzdialog bei vorhandenen lokalen Daten
- JSON-Import
- Export vorhandener lokaler Daten vor Überschreiben
- Sprache und Theme Umschalter

Technische Hinweise:
- PrÃ¼ft lokale Daten bei Mount
- SteÜrt Modal für Überschreiben/Export

### 2.2 Routing und Planinitialisierung
Dateien:
- src/app/page.tsx
- src/app/plan/page.tsx
- src/components/plan-client.tsx

Funktionen:
- Weiterleitung von data-QÜryparametern auf /plan
- Auswertung von fresh/mode Parametern
- Laden von Planungsdaten aus URL oder localStorage
- Entfernen transienter QÜryparameter nach Übernahme

Reihenfolge DatenqÜlle:
1. URL-Daten (data)
2. fresh=1 -> Defaultdaten
3. lokaler Speicher

### 2.3 Onboarding Survey
Komponente: src/components/onboarding-survey.tsx

Funktionen:
- Mehrstufige Erfassung von Eckdaten
- Ja/Nein-Entscheidungen für KostenblÖcke
- Betragserfassung pro Block
- Option für personenabhÄngige Kosten
- Erzeugung initialer Expense-Posten

Validierung:
- Name muss gesetzt sein
- GÄsteanzahl >= 1
- Budget >= 1
- BetrÄge gÜltig und innerhalb Obergrenzen

### 2.4 Rechner Kernmodul
Komponente: src/components/calculator.tsx

Funktionen:
- ReitersteÜrung: Eckdaten, Dashboard, Details
- Persistente URL-Parameter für tab/expense
- Auto-Save aller Planungsdaten
- Share-Link generieren
- JSON Export
- PDF Dialog und Print-Flow

### 2.5 Eckdaten-Reiter
Funktionen:
- Bearbeitung Name, Datum, GÄste, Budget
- Übernahme per Button
- Heuristiken bei geÄnderter GÄstezahl

Heuristik:
- Bei isPerPerson werden Planwerte auf Basis der neÜn GÄstezahl neu berechnet.

### 2.6 Dashboard-Reiter
Kennzahlen:
- Budget
- Geplante Ausgaben
- Geplante Restausgaben
- Ausgegeben (nur Status Bezahlt/Fertig)
- Planungsdifferenz
- Gewinn/Verlust

Fachlogik:
- Closed-Status = paid oder done
- Ausgegeben in KPI/Diagrammen basiert nur auf Closed-Status

Formeln:
- Geplante Restausgaben = Sum(estimated all) - Sum(estimated where status in paid/done)
- Planungsdifferenz = Sum(estimated all) - Sum(actual where status in paid/done)
- Gewinn/Verlust = Budget - Sum(actual where status in paid/done)

Diagramme:
- Balken 1: Geplant vs Ausgegeben(Closed) vs Planungsdifferenz
- Balken 2: Budget vs Ausgegeben(Closed) vs Gewinn/Verlust
- Torte: Anteil Geplant vs Anteil Ausgegeben(Closed)

Hinweistexte:
- ErklÄren Statusbasis und Formeln direkt in der UI

### 2.7 Details-Reiter
Tabellenansicht:
- Liste aller Positionen mit Kernfeldern
- Add/Delete Position
- Wechsel in Detailansicht pro Posten

Detailansicht pro Position:
- Kategorie, Titel, Status, Zieldatum
- Per-Person Schalter und Kosten pro Person
- Geplant/Ausgegeben Bearbeitung
- Checkliste (CRUD)
- Historie/Kommentare (CRUD)

### 2.8 Persistenz und Datenaustausch
Datei: src/lib/storage.ts

Funktionen:
- saveToLocal
- loadFromLocal
- clearLocalData
- exportToJson
- parseImportedJson
- loadFromUrl
- generateShareUrl

Exportverhalten:
- Bevorzugt showSaveFilePicker
- Fallback auf Blob-Download

### 2.9 Domain und Migration
Datei: src/lib/domain.ts

Funktionen:
- DATA_VERSION
- getDefaultData
- applyHeuristics
- migrateData

migrateData:
- robustes Sanitizing für Expenses, Updates, Attachments, Checklist
- Legacy-Daten kompatibel

### 2.10 Sprache und Theme
Dateien:
- src/context/language-context.tsx
- src/context/theme-context.tsx

Funktionen:
- i18n für DE/EN
- Persistenz der Sprache in localStorage
- Theme light/dark mit Persistenz

## 3. UX- und Sicherheitsaspekte

### 3.1 EingabebeschrÄnkungen
- maxLength für relevante Textfelder
- min/max für numerische Felder
- interne clamp-Logik gegen Ausreißer

### 3.2 Fehlerrobustheit
- try/catch in Storage-Zugriffen
- Import validiert Dateistruktur
- URL-Dekodierung abgesichert

### 3.3 Druck/PDF
- separater Dialog für Exportmodus
- Print-CSS für optimierte Ausgabe
- Option alle Reiter untereinander

## 4. Bekannte Produktentscheidungen
- Datenhaltung lokal im Browser statt Serverkonto
- Kein Echtzeit-Mehrnutzerbetrieb
- Statusbasierte Ausgabenlogik für realistische Finanzsicht

## 5. Technischer Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Recharts
- lucide-react

## 6. Test- und QualitÄtsstatus
Nach den letzten Änderungen:
- Typecheck erfolgreich
- Lint erfolgreich
- Production Build erfolgreich

## 7. Empfohlene nÄchste Ausbaustufen
- optionale serverseitige Sync-Funktion
- differenzierte Rollen/Berechtigungen
- erweiterte Report-Ansichten pro Zeitraum
- CSV-Export für externe Auswertungen




