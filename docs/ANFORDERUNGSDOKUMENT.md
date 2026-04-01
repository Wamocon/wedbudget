# Anforderungsdokument

## 1. Dokumentinformationen

- Projekt: Hochzeitsrechner (WedBudget)
- Version: 1.0
- Datum: 2026-04-01
- Status: Entwurf auf Basis des implementierten Ist-Systems

## 2. Ziel und Abgrenzung

### 2.1 Ziel

Bereitstellung einer webbasierten Anwendung, mit der Nutzer ein Hochzeitsbudget planen, fortlaufend pflegen und auswerten können, ohne Konto und ohne zentrale Datenspeicherung.

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

- Primär: Brautpaare/Nutzer
- Sekundär: Projektbetreiber, zukünftige Maintainer/Entwickler

## 4. Annahmen und Randbedingungen

- Nutzer verfügen über einen modernen Browser.
- Daten sollen standardmäßig lokal bleiben.
- Internetzugang ist für erstmaligen Seitenaufruf und Webfonts hilfreich, aber Kernfunktionen sind clientseitig.

## 5. Funktionale Anforderungen

### FR-01 Neue Planung starten

- Beschreibung: Nutzer können eine neue Standardplanung erzeugen.
- Priorität: Muss
- Akzeptanzkriterium:
  - Beim Start einer neuen Planung werden Defaultwerte für Gästezahl, Region, Budget und Positionen gesetzt.

### FR-02 Bestehende Planung fortsetzen

- Beschreibung: Wenn lokale Daten vorhanden sind, kann der letzte Stand geladen werden.
- Priorität: Muss
- Akzeptanzkriterium:
  - Bei vorhandenen LocalStorage-Daten ist auf der Landing Page eine Fortsetzen-Option sichtbar.

### FR-03 Import aus JSON

- Beschreibung: Nutzer können eine gültige Backup-Datei importieren.
- Priorität: Muss
- Akzeptanzkriterium:
  - Nach Import einer gültigen Datei wird die Planung geladen.
  - Bei ungültiger Datei wird eine Fehlermeldung gezeigt.

### FR-04 Export als JSON

- Beschreibung: Nutzer können die Planung als Datei herunterladen.
- Priorität: Muss
- Akzeptanzkriterium:
  - Download einer `.json`-Datei mit vollständigen Planungsdaten inkl. Version.

### FR-05 Teilen über Link

- Beschreibung: Nutzer können einen Share-Link in die Zwischenablage kopieren.
- Priorität: Soll
- Akzeptanzkriterium:
  - Link enthält den codierten Datenstand.
  - Aufruf des Links lädt den Datenstand in der Anwendung.

### FR-06 Setup-Parameter bearbeiten

- Beschreibung: Gästezahl, Region und Gesamtbudget müssen editierbar sein.
- Priorität: Muss
- Akzeptanzkriterium:
  - Änderungen aktualisieren abhängige Berechnungen und UI-Werte.

### FR-07 Ausgabenpositionen verwalten

- Beschreibung: Nutzer können Positionen hinzufügen, bearbeiten und löschen.
- Priorität: Muss
- Akzeptanzkriterium:
  - Jede Position ist in Tabelle sichtbar und editierbar.

### FR-08 Gästeabhängige Kosten

- Beschreibung: Positionen können als pro Gast geführt werden.
- Priorität: Muss
- Akzeptanzkriterium:
  - Bei aktivem pro-Gast-Faktor wird Sollwert aus Faktor x Gästezahl x Regionsmultiplikator berechnet.

### FR-09 Zahlungsstatus

- Beschreibung: Positionen können als offen/bezahlt markiert werden.
- Priorität: Soll
- Akzeptanzkriterium:
  - Statusänderung wird visuell angezeigt und persistiert.

### FR-10 Kennzahlen und Diagramm

- Beschreibung: Anwendung zeigt aggregierte Summen und kategoriebasiertes Diagramm.
- Priorität: Muss
- Akzeptanzkriterium:
  - Geplant, Tatsächlich und Puffer werden korrekt berechnet.
  - Diagramm spiegelt Daten je Kategorie wider.

### FR-11 Drucken/PDF

- Beschreibung: Nutzer können eine druckfreundliche Ansicht erzeugen.
- Priorität: Soll
- Akzeptanzkriterium:
  - Interaktive Bedienelemente werden im Druck ausgeblendet.

### FR-12 Mehrsprachigkeit

- Beschreibung: UI-Texte sind auf Deutsch und Russisch verfügbar.
- Priorität: Muss
- Akzeptanzkriterium:
  - Sprachwechsel aktualisiert alle relevanten UI-Texte.
  - Auswahl bleibt über Reload hinweg erhalten.

## 6. Nicht-funktionale Anforderungen

### NFR-01 Datenschutz

- Anforderung: Keine serverseitige Standard-Speicherung personenbezogener Planungsdaten.
- Priorität: Muss

### NFR-02 Usability

- Anforderung: Kernaktionen sind ohne Anleitung auffindbar (Starten, Bearbeiten, Speichern, Exportieren).
- Priorität: Muss

### NFR-03 Performance

- Anforderung: Reaktionszeit bei üblichen Nutzungsdaten (bis 150 Positionen) subjektiv flüssig.
- Priorität: Soll

### NFR-04 Zuverlässigkeit

- Anforderung: Daten sollen nach Seitenreload über Auto-Save wieder verfügbar sein.
- Priorität: Muss

### NFR-05 Kompatibilität

- Anforderung: Unterstützung aktueller Desktop- und mobiler Browser.
- Priorität: Soll

### NFR-06 Wartbarkeit

- Anforderung: Code soll modular und nachvollziehbar strukturiert sein.
- Priorität: Soll

### NFR-07 Sicherheit

- Anforderung: Fehlerhafte Importdaten dürfen die Anwendung nicht abstürzen lassen.
- Priorität: Muss

### NFR-08 Barrierefreiheit

- Anforderung: Semantik, Tastaturzugänglichkeit und Kontrast sollen sukzessive verbessert werden.
- Priorität: Kann

## 7. Geschäftsregeln

- BR-01: Puffer = Gesamtbudget - max(Geplant, Tatsächlich).
- BR-02: Region beeinflusst automatisch berechnete (gästeabhängige) Sollkosten über Multiplikator.
- BR-03: Manuelle Anpassung von Sollwert bei pro-Gast-Position deaktiviert den pro-Gast-Modus.
- BR-04: Jede Planung besitzt ein Versionsfeld zur Migration.

## 8. Datenanforderungen

- Planung enthält mindestens: `version`, `guestCount`, `region`, `totalBudget`, `expenses`.
- Jede Ausgabezeile enthält eindeutige `id`.
- Numerische Felder werden als Zahlen verarbeitet.

## 9. Qualitäts- und Abnahmekriterien

### 9.1 Fachliche Abnahme

- Alle Muss-Anforderungen (FR/NFR) sind erfüllt.
- Berechnungen liefern reproduzierbar korrekte Ergebnisse.

### 9.2 Technische Abnahme

- Build und Lint laufen ohne Fehler.
- Import ungültiger Daten führt zu kontrollierter Fehlermeldung.

### 9.3 UX-Abnahme

- Nutzer kann eine vollständige Planung von Start bis Export ohne externe Hilfe durchführen.

## 10. Risiken

- R-01: Share-URL kann bei großen Datensätzen zu lang werden.
- R-02: Fehlende automatisierte Tests können Regressionen begünstigen.
- R-03: Veraltete Encoding-Helfer könnten langfristig Browserkompatibilität beeinträchtigen.

## 11. Backlog-Empfehlungen (Sollte nachgezogen werden)

1. Validierungsregeln für Eingabefelder (Grenzen, Fehlerhinweise).
2. Testabdeckung für `storage` und Kalkulationslogik.
3. Robustere Link-Sharing-Strategie (Komprimierung/Längenprüfung).
4. Erweiterung der Sprachen und Content-Pflegeprozess.
5. Verbesserte mobile Darstellung umfangreicher Tabellen.
