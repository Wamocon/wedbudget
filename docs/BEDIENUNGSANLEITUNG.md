# WedBudget Bedienungsanleitung

## 1. Zweck der App
WedBudget ist ein lokaler Hochzeits-Budgetplaner im Browser. Die App hilft bei:
- strukturierter Planung von Kostenposten
- laufender Pflege von geplanten und bereits ausgegebenen BetrÄgen
- transparenter Übersicht Über offene Restkosten
- Export, Import, Teilen und PDF-Ausgabe

Es ist kein Login erforderlich. Daten werden lokal im Browser gespeichert.

## 2. Start und Einstieg
### 2.1 Startseite
Auf der Startseite stehen drei Einstiegspunkte zur VerfÜgung:
- Letzte Planung fortsetzen: Öffnet den zuletzt gespeicherten Stand.
- NeÜ Planung starten: Startet den gefÜhrten Onboarding-Prozess.
- Backup Datei laden (.json): Importiert einen frÜher exportierten Stand.

### 2.2 Sprache und Theme
Oben rechts können jederzeit eingestellt werden:
- Sprache: Deutsch/English
- Theme: Hell/Dunkel (Symbol-Button)

### 2.3 Bestehende Daten beim Neustart
Wenn bereits lokale Daten existieren und eine neÜ Planung gestartet wird:
- Modal zur Auswahl wird angezeigt
- Optionen:
- Abbrechen
- Daten exportieren
- Überschreiben und neu starten

## 3. Onboarding (GefÜhrte Ersteinrichtung)
Das Onboarding sammelt Grunddaten und optionale Posten.

### 3.1 Eckdaten
- Planungsname
- Hochzeitsdatum
- GÄsteanzahl
- Budget

### 3.2 KostenblÖcke
Je nach Frage können Posten direkt angelegt werden:
- Location
- Catering
- Einladungen/Papeterie
- Dekoration
- Kleid
- Anzug
- Ringe
- Dienstleister (Moderator, DJ, Fotograf, Videograf)

### 3.3 PersonenabhÄngige Kosten
Bei geeigneten Posten kann aktiviert werden:
- Kosten sind personenabhÄngig
Dann wird der Planwert aus Kosten pro Person x GÄsteanzahl berechnet.

### 3.4 Abschluss
Mit "Zur Planung" wird der erzeugte Plan in den Rechner Übernommen.

## 4. Rechner: Reiter und Bedienung
Der Rechner hat drei Reiter:
- Eckdaten
- Dashboard
- Details

### 4.1 Reiter Eckdaten
Bearbeitbar:
- Hochzeitsname
- Hochzeitsdatum
- GÄsteanzahl
- Budget

Mit "Weiter zum Dashboard" werden Werte Übernommen.
Bei geÄnderter GÄsteanzahl werden personenabhÄngige Planwerte neu berechnet.

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

Hinweistexte unter den KPIs erklÄren die exakte Formelbasis.

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
- Position hinzufÜgen
- Position löschen
- Position anklicken für Detailbearbeitung

#### 4.3.2 Detailansicht eines Postens
Bearbeitbar:
- Kategorie
- Titel
- Status
- Zieldatum
- Schalter: abhÄngig von GÄsten
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
Als "Ausgegeben" in Dashboard-Berechnungen zÄhlen nur Posten mit Status:
- Bezahlt
- Fertig

Damit bleiben Kennzahlen auf tatsÄchlich abgeschlossenen Kosten fokussiert.

### 5.3 Formeln
- Geplante Restausgaben = Geplante Ausgaben gesamt - Geplante Ausgaben in Bezahlt/Fertig
- Planungsdifferenz = Geplante Ausgaben gesamt - Ausgegeben in Bezahlt/Fertig
- Gewinn/Verlust = Budget - Ausgegeben in Bezahlt/Fertig

## 6. Speichern, Teilen, Import/Export
### 6.1 Auto-Save
Alle Änderungen werden automatisch lokal gespeichert.

### 6.2 JSON-Export
Button "Datei":
- Öffnet nativen Speichern-Dialog (wenn Browser es unterstÜtzt)
- FÄllt sonst auf klassischen Download zurück

### 6.3 JSON-Import
Auf Startseite Über "Backup Datei laden (.json)".
UngÜltige Dateien werden mit Fehlermeldung abgewiesen.

### 6.4 Link teilen
Button "Link":
- kodiert den aktÜllen Plan in die URL
- kopiert die URL in die Zwischenablage

## 7. PDF-Export
Button "PDF" Öffnet einen Dialog:
- aktÜllen Reiter exportieren
- alle Reiter exportieren

Die Druckansicht optimiert Darstellung für PDF.

## 8. Typische ArbeitsablÄufe
### Ablauf A: NeÜ Planung
1. NeÜ Planung starten
2. Onboarding beantworten
3. Im Reiter Details Positionen pflegen
4. Status laufend aktualisieren
5. Dashboard für Restkosten und Differenzen nutzen

### Ablauf B: Weiterarbeiten
1. Startseite Öffnen
2. Letzte Planung fortsetzen
3. Änderungen erfolgen automatisch im lokalen Speicher

### Ablauf C: Backup
1. In der App "Datei" klicken und JSON speichern
2. SpÄter auf Startseite per JSON wieder importieren

## 9. Fehlerbehebung
- Keine Daten sichtbar: Prüfen, ob Browser-Storage gelöscht wurde.
- Import schlÃ¤gt fehl: Sicherstellen, dass Datei ein WedBudget-JSON ist.
- Link Öffnet nicht richtig: VollstÄndige URL ohne KÜrzung verwenden.
- PDF sieht unvollständig aus: Im PDF-Dialog "Alle Reiter exportieren" wählen.

## 10. Datenschutz
- Keine serverseitige Kontoverwaltung
- Keine Cloud-Pflichtspeicherung
- Datenhaltung primÄr lokal im Browser




<!-- umlaut-test -->



