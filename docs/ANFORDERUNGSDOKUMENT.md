# Anforderungsdokument

## 1. Dokumentinformationen

- Projekt: Hochzeitsrechner (WedBudget)
- Version: 1.0
- Datum: 2026-04-01
- Status: Entwurf auf Basis des implementierten Ist-Systems

## 2. Ziel und Abgrenzung

### 2.1 Ziel

Bereitstellung einer webbasierten Anwendung, mit der Nutzer ein Hochzeitsbudget planen, fortlaufend pflegen und auswerten kÃ¶nnen, ohne Konto und ohne zentrale Datenspeicherung.

### 2.2 Systemabgrenzung

Im Scope:

- Budgetplanung und Kostenverfolgung im Browser
- Lokale Speicherung, JSON-Import/-Export, Link-Sharing
- Mehrsprachige UI (DE/RU)

Out of Scope:

- Server-Backend und Benutzerkonten
- Multi-User-Kollaboration in Echtzeit
- Zahlungsabwicklung oder Anbieterbuchung

## 3. Stakeholder

- PrimÃ¤r: Brautpaare/Nutzer
- SekundÃ¤r: Projektbetreiber, zukÃ¼nftige Maintainer/Entwickler

## 4. Annahmen und Randbedingungen

- Nutzer verfÃ¼gen Ã¼ber einen modernen Browser.
- Daten sollen standardmÃ¤ÃŸig lokal bleiben.
- Internetzugang ist fÃ¼r erstmaligen Seitenaufruf und Webfonts hilfreich, aber Kernfunktionen sind clientseitig.

## 5. Funktionale Anforderungen

### FR-01 Neü Planung starten

- Beschreibung: Nutzer kÃ¶nnen eine neü Standardplanung erzeugen.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Beim Start einer neün Planung werden Defaultwerte fÃ¼r GÃ¤stezahl, Region, Budget und Positionen gesetzt.

### FR-02 Bestehende Planung fortsetzen

- Beschreibung: Wenn lokale Daten vorhanden sind, kann der letzte Stand geladen werden.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Bei vorhandenen LocalStorage-Daten ist auf der Landing Page eine Fortsetzen-Option sichtbar.

### FR-03 Import aus JSON

- Beschreibung: Nutzer kÃ¶nnen eine gÃ¼ltige Backup-Datei importieren.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Nach Import einer gÃ¼ltigen Datei wird die Planung geladen.
  - Bei ungÃ¼ltiger Datei wird eine Fehlermeldung gezeigt.

### FR-04 Export als JSON

- Beschreibung: Nutzer kÃ¶nnen die Planung als Datei herunterladen.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Download einer `.json`-Datei mit vollstÃ¤ndigen Planungsdaten inkl. Version.

### FR-05 Teilen Ã¼ber Link

- Beschreibung: Nutzer kÃ¶nnen einen Share-Link in die Zwischenablage kopieren.
- PrioritÃ¤t: Soll
- Akzeptanzkriterium:
  - Link enthÃ¤lt den codierten Datenstand.
  - Aufruf des Links lÃ¤dt den Datenstand in der Anwendung.

### FR-06 Setup-Parameter bearbeiten

- Beschreibung: GÃ¤stezahl, Region und Gesamtbudget mÃ¼ssen editierbar sein.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Ã„nderungen aktualisieren abhÃ¤ngige Berechnungen und UI-Werte.

### FR-07 Ausgabenpositionen verwalten

- Beschreibung: Nutzer kÃ¶nnen Positionen hinzufÃ¼gen, bearbeiten und lÃ¶schen.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Jede Position ist in Tabelle sichtbar und editierbar.

### FR-08 GÃ¤steabhÃ¤ngige Kosten

- Beschreibung: Positionen kÃ¶nnen als pro Gast gefÃ¼hrt werden.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Bei aktivem pro-Gast-Faktor wird Sollwert aus Faktor x GÃ¤stezahl x Regionsmultiplikator berechnet.

### FR-09 Zahlungsstatus

- Beschreibung: Positionen kÃ¶nnen als offen/bezahlt markiert werden.
- PrioritÃ¤t: Soll
- Akzeptanzkriterium:
  - StatusÃ¤nderung wird visüll angezeigt und persistiert.

### FR-10 Kennzahlen und Diagramm

- Beschreibung: Anwendung zeigt aggregierte Summen und kategoriebasiertes Diagramm.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Geplant, TatsÃ¤chlich und Puffer werden korrekt berechnet.
  - Diagramm spiegelt Daten je Kategorie wider.

### FR-11 Drucken/PDF

- Beschreibung: Nutzer kÃ¶nnen eine druckfreundliche Ansicht erzeugen.
- PrioritÃ¤t: Soll
- Akzeptanzkriterium:
  - Interaktive Bedienelemente werden im Druck ausgeblendet.

### FR-12 Mehrsprachigkeit

- Beschreibung: UI-Texte sind auf Deutsch und Russisch verfÃ¼gbar.
- PrioritÃ¤t: Muss
- Akzeptanzkriterium:
  - Sprachwechsel aktualisiert alle relevanten UI-Texte.
  - Auswahl bleibt Ã¼ber Reload hinweg erhalten.

## 6. Nicht-funktionale Anforderungen

### NFR-01 Datenschutz

- Anforderung: Keine serverseitige Standard-Speicherung personenbezogener Planungsdaten.
- PrioritÃ¤t: Muss

### NFR-02 Usability

- Anforderung: Kernaktionen sind ohne Anleitung auffindbar (Starten, Bearbeiten, Speichern, Exportieren).
- PrioritÃ¤t: Muss

### NFR-03 Performance

- Anforderung: Reaktionszeit bei Ã¼blichen Nutzungsdaten (bis 150 Positionen) subjektiv flÃ¼ssig.
- PrioritÃ¤t: Soll

### NFR-04 ZuverlÃ¤ssigkeit

- Anforderung: Daten sollen nach Seitenreload Ã¼ber Auto-Save wieder verfÃ¼gbar sein.
- PrioritÃ¤t: Muss

### NFR-05 KompatibilitÃ¤t

- Anforderung: UnterstÃ¼tzung aktüller Desktop- und mobiler Browser.
- PrioritÃ¤t: Soll

### NFR-06 Wartbarkeit

- Anforderung: Code soll modular und nachvollziehbar strukturiert sein.
- PrioritÃ¤t: Soll

### NFR-07 Sicherheit

- Anforderung: Fehlerhafte Importdaten dÃ¼rfen die Anwendung nicht abstÃ¼rzen lassen.
- PrioritÃ¤t: Muss

### NFR-08 Barrierefreiheit

- Anforderung: Semantik, TastaturzugÃ¤nglichkeit und Kontrast sollen sukzessive verbessert werden.
- PrioritÃ¤t: Kann

## 7. GeschÃ¤ftsregeln

- BR-01: Puffer = Gesamtbudget - max(Geplant, TatsÃ¤chlich).
- BR-02: Region beeinflusst automatisch berechnete (gÃ¤steabhÃ¤ngige) Sollkosten Ã¼ber Multiplikator.
- BR-03: Manülle Anpassung von Sollwert bei pro-Gast-Position deaktiviert den pro-Gast-Modus.
- BR-04: Jede Planung besitzt ein Versionsfeld zur Migration.

## 8. Datenanforderungen

- Planung enthÃ¤lt mindestens: `version`, `güstCount`, `region`, `totalBudget`, `expenses`.
- Jede Ausgabezeile enthÃ¤lt eindeutige `id`.
- Numerische Felder werden als Zahlen verarbeitet.

## 9. QualitÃ¤ts- und Abnahmekriterien

### 9.1 Fachliche Abnahme

- Alle Muss-Anforderungen (FR/NFR) sind erfÃ¼llt.
- Berechnungen liefern reproduzierbar korrekte Ergebnisse.

### 9.2 Technische Abnahme

- Build und Lint laufen ohne Fehler.
- Import ungÃ¼ltiger Daten fÃ¼hrt zu kontrollierter Fehlermeldung.

### 9.3 UX-Abnahme

- Nutzer kann eine vollstÃ¤ndige Planung von Start bis Export ohne externe Hilfe durchfÃ¼hren.

## 10. Risiken

- R-01: Share-URL kann bei groÃŸen DatensÃ¤tzen zu lang werden.
- R-02: Fehlende automatisierte Tests kÃ¶nnen Regressionen begÃ¼nstigen.
- R-03: Veraltete Encoding-Helfer kÃ¶nnten langfristig BrowserkompatibilitÃ¤t beeintrÃ¤chtigen.

## 11. Backlog-Empfehlungen (Sollte nachgezogen werden)

1. Validierungsregeln fÃ¼r Eingabefelder (Grenzen, Fehlerhinweise).
2. Testabdeckung fÃ¼r `storage` und Kalkulationslogik.
3. Robustere Link-Sharing-Strategie (Komprimierung/LÃ¤ngenprÃ¼fung).
4. Erweiterung der Sprachen und Content-Pflegeprozess.
5. Verbesserte mobile Darstellung umfangreicher Tabellen.

