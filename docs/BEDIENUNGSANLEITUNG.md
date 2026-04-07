# WedBudget Bedienungsanleitung

## 1. Zweck der App
WedBudget ist ein lokaler Hochzeits-Budgetplaner im Browser. Die App hilft bei:
- strukturierter Planung von Kostenposten
- laufender Pflege von geplanten und bereits ausgegebenen Beträgen
- transparenter Übersicht über offene Restkosten
- Export, Import, Teilen und PDF-Ausgabe

Es ist kein Login erforderlich. Daten werden lokal im Browser gespeichert.

## 2. Start und Einstieg
### 2.1 Startseite
Auf der Startseite stehen drei Einstiegspunkte zur Verfügung:
- Letzte Planung fortsetzen: Öffnet den zuletzt gespeicherten Stand.
- Neue Planung starten: Startet den geführten Onboarding-Prozess.
- Backup Datei laden (.json): Importiert einen früher exportierten Stand.

### 2.2 Sprache und Theme
Oben rechts können jederzeit eingestellt werden:
- Sprache: Deutsch/English
- Theme: Hell/Dunkel (Symbol-Button)

### 2.3 Bestehende Daten beim Neustart
Wenn bereits lokale Daten existieren und eine neue Planung gestartet wird:
- Modal zur Auswahl wird angezeigt
- Optionen:
- Abbrechen
- Daten exportieren
- Überschreiben und neu starten

## 3. Onboarding (Geführte Ersteinrichtung)
Das Onboarding sammelt Grunddaten und optionale Posten.

### 3.1 Eckdaten
- Planungsname
- Hochzeitsdatum
- Gästeanzahl
- Budget

### 3.2 Kostenblöcke
Je nach Frage können Posten direkt angelegt werden:
- Location
- Catering
- Einladungen/Papeterie
- Dekoration
- Kleid
- Anzug
- Ringe
- Dienstleister (Moderator, DJ, Fotograf, Videograf)

### 3.3 Personenabhängige Kosten
Bei geeigneten Posten kann aktiviert werden:
- Kosten sind personenabhängig
Dann wird der Planwert aus Kosten pro Person x Gästeanzahl berechnet.

### 3.4 Abschluss
Mit "Zur Planung" wird der erzeugte Plan in den Rechner übernommen.

## 4. Rechner: Reiter und Bedienung
Der Rechner hat drei Reiter:
- Eckdaten
- Dashboard
- Details

### 4.1 Reiter Eckdaten
Bearbeitbar:
- Hochzeitsname
- Hochzeitsdatum
- Gästeanzahl
- Budget

Mit "Änderungen übernehmen" werden Werte übernommen.
Bei geänderter Gästeanzahl werden personenabhängige Planwerte neu berechnet.

### 4.2 Reiter Dashboard
Zeigt KPIs und Diagramme.

KPIs:
- Budget
- Geplante Ausgaben
- Geplante Restausgaben
- Ausgegeben (nur Status Bezahlt/Fertig)
- Planungsdifferenz
- Gewinn/Verlust

Diagramme:
- Balkendiagramm Planungsdifferenz
- Balkendiagramm Gewinn/Verlust
- Tortendiagramm Anteil Geplant/Ausgegeben

Hinweistexte unter den KPIs erklären die exakte Formelbasis.

### 4.3 Reiter Details
#### 4.3.1 Tabellenansicht
Zeigt alle Kostenposten mit:
- Position
- Zieldatum
- Status
- Faktor (Fixbetrag oder pro Person)
- Geplant
- Ausgegeben

Funktionen:
- Position hinzufügen
- Position löschen
- Position anklicken für Detailbearbeitung

#### 4.3.2 Detailansicht eines Postens
Bearbeitbar:
- Kategorie
- Titel
- Status
- Zieldatum
- Schalter: abhängig von Gästen
- Kosten pro Person (falls aktiv)
- Geplant
- Ausgegeben

Weitere Bereiche:
- Checkliste pro Posten
- Historie/Kommentare pro Posten

## 5. Status und Finanzlogik
### 5.1 Statuswerte
- Offen
- In Arbeit
- Bezahlt
- Fertig

### 5.2 Wichtiger Grundsatz
Als "Ausgegeben" in Dashboard-Berechnungen zählen nur Posten mit Status:
- Bezahlt
- Fertig

Damit bleiben Kennzahlen auf tatsächlich abgeschlossenen Kosten fokussiert.

### 5.3 Formeln
- Geplante Restausgaben = Geplante Ausgaben gesamt - Geplante Ausgaben in Bezahlt/Fertig
- Planungsdifferenz = Geplante Ausgaben gesamt - Ausgegeben in Bezahlt/Fertig
- Gewinn/Verlust = Budget - Ausgegeben in Bezahlt/Fertig

## 6. Speichern, Teilen, Import/Export
### 6.1 Auto-Save
Alle Änderungen werden automatisch lokal gespeichert.

### 6.2 JSON-Export
Button "Datei":
- Öffnet nativen Speichern-Dialog (wenn Browser es unterstützt)
- Fällt sonst auf klassischen Download zurück

### 6.3 JSON-Import
Auf Startseite über "Backup Datei laden (.json)".
Ungültige Dateien werden mit Fehlermeldung abgewiesen.

### 6.4 Link teilen
Button "Link":
- kodiert den aktuellen Plan in die URL
- kopiert die URL in die Zwischenablage

## 7. PDF-Export
Button "PDF" öffnet einen Dialog:
- aktuellen Reiter exportieren
- alle Reiter exportieren

Die Druckansicht optimiert Darstellung für PDF.

## 8. Typische Arbeitsabläufe
### Ablauf A: Neue Planung
1. Neue Planung starten
2. Onboarding beantworten
3. Im Reiter Details Positionen pflegen
4. Status laufend aktualisieren
5. Dashboard für Restkosten und Differenzen nutzen

### Ablauf B: Weiterarbeiten
1. Startseite öffnen
2. Letzte Planung fortsetzen
3. Änderungen erfolgen automatisch im lokalen Speicher

### Ablauf C: Backup
1. In der App "Datei" klicken und JSON speichern
2. Später auf Startseite per JSON wieder importieren

## 9. Fehlerbehebung
- Keine Daten sichtbar: Prüfen, ob Browser-Storage gelöscht wurde.
- Import schlägt fehl: Sicherstellen, dass Datei ein WedBudget-JSON ist.
- Link öffnet nicht richtig: Vollständige URL ohne Kürzung verwenden.
- PDF sieht unvollständig aus: Im PDF-Dialog "Alle Reiter exportieren" wählen.

## 10. Datenschutz
- Keine serverseitige Kontoverwaltung
- Keine Cloud-Pflichtspeicherung
- Datenhaltung primär lokal im Browser
