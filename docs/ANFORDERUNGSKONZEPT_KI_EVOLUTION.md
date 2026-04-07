# Anforderungskonzept KI-Evolution fuer WedBudget

## 1. Ziel des Dokuments
Dieses Dokument beschreibt, wie die aktuelle WedBudget-App fachlich, technisch und marktseitig in Richtung KI-unterstuetzte Hochzeitsplanung weiterentwickelt werden kann.

Ziel ist nicht, "irgendwo KI draufzusetzen", sondern die bestehende Privacy-first-Budget-App gezielt so auszubauen, dass:
- die aktuellen Kernfunktionen voll erhalten bleiben,
- die groessten Nutzerprobleme besser geloest werden,
- KI dort eingesetzt wird, wo sie echten Mehrwert liefert,
- Vertrauen, Datenhoheit und Nachvollziehbarkeit gewahrt bleiben,
- ein naechster Bot oder Entwickler daraus direkt eine belastbare Umsetzungsroadmap ableiten kann.

---

## 2. Executive Summary
WedBudget besitzt bereits eine starke Produktbasis: lokales Speichern, gefuehrtes Onboarding, Budgetsteuerung, Statuslogik, Diagramme, Checklisten, Kommentare, Import/Export und Share-Link. Das Produkt adressiert damit ein reales Kernproblem von Paaren: Kostenkontrolle ohne Konto, ohne Werbedruck und ohne Datenabgabe.

Die Marktsignale zeigen inzwischen klar, dass KI im Hochzeits- und Consumer-Software-Umfeld nicht mehr experimentell ist, sondern erwartbar wird. Gleichzeitig ist das Vertrauen der Nutzer fragil. Daraus folgt fuer WedBudget eine klare strategische Leitlinie:

**KI soll bei WedBudget zuerst beraten, erklaeren, strukturieren und warnen - nicht autonom finanzielle Entscheidungen treffen.**

Die sinnvollsten ersten KI-Funktionen sind daher nicht "Agenten mit Vollzugriff", sondern:
- KI-Budget-Coach
- KI-Luecken- und Risikoanalyse
- KI-Onboarding-Assistent
- KI-Naechste-Schritte-Empfehlungen
- KI-gestuetzte Text- und Eingabehilfe
- spaeter: KI-Vendor- und Preisorientierung

Die beste Produktstrategie ist ein **Hybridmodell**:
- Kernprodukt bleibt offline-faehig und privacy-first
- KI ist optional, transparent und consent-basiert
- sensible Berechnungen bleiben nachvollziehbar
- jede KI-Aenderung wird als Vorschlag mit Preview gezeigt

---

## 3. Ist-Analyse der aktuellen App

### 3.1 Produktposition heute
WedBudget ist derzeit eine browserbasierte, lokale Hochzeits-Budget-App ohne Login und ohne serverseitige Pflichtspeicherung. Sie ist stark in Datenschutz, Einfachheit und direkter Nutzbarkeit.

### 3.2 Aktuelle Kernfunktionen
Auf Basis des Repositories deckt die App aktuell folgende Funktionsgruppen ab:

#### A. Einstieg und Planinitialisierung
- Landing Page mit Weiterfuehren, Neu starten, JSON-Import
- Schutzdialog bei bestehendem lokalen Datenstand
- Weiterleitung von Share-Links via URL-Parameter
- Initialisierung ueber lokale Daten, URL-Daten oder frische Planung

#### B. Gefuehrtes Onboarding
- Erfassung von Hochzeitsname, Datum, Gaesteanzahl, Budget
- Auswahl typischer Kostenbloecke
- Betraege pro Kostenblock
- personenabhaengige Kosten
- Erzeugung initialer Expense-Posten

#### C. Rechner und Bearbeitung
- Reiterstruktur: Eckdaten, Dashboard, Details
- Bearbeitung von Hochzeitsname, Datum, Gaesten, Budget
- CRUD fuer Budgetpositionen
- Statusmodell: open, in_progress, paid, done
- Zieldaten, Checklisten, Updates, Anhaenge im Datenmodell

#### D. Budgetlogik und Kennzahlen
- geplante Kosten
- tatsaechliche Kosten
- geplante Restausgaben
- Planungsdifferenz
- Gewinn/Verlust
- Chart-Auswertungen
- statusbasierte finanzielle Interpretation (closed = paid/done)

#### E. Persistenz und Datenaustausch
- Auto-Save in localStorage
- JSON Export/Import
- Share-Link-Generierung ueber codierte URL
- Datenmigration und Sanitizing

#### F. UX-Basis
- DE/EN Sprachumschaltung
- Theme Light/Dark
- Druck/PDF-Export
- Basisvalidierung, numerische Begrenzungen, Fehlerrobustheit

### 3.3 Aktuelle Staerken
- Sehr niedrige Einstiegshuerde
- Datenschutz als echter USP
- Gute Grunddaten fuer spaetere KI-Kontextualisierung
- Strukturierte Datenbasis statt freiem Textchaos
- Gefuehrtes Onboarding bereits vorhanden
- Solide Fachlogik fuer KPI- und Budget-Berechnungen

### 3.4 Aktuelle Luecken aus KI- und Marktlogik
- Keine intelligente Priorisierung von Ausgaben
- Keine Erkennung fehlender Kategorien oder riskanter Budgetverteilungen
- Keine persoenliche Handlungsempfehlung aus dem aktuellen Planstand
- Keine automatische Erklaerung, warum das Budget kritisch wird
- Keine semantische Eingabehilfe fuer Texte, Notizen oder Belege
- Keine Terminintelligenz aus Hochzeitsdatum plus Status plus offenen Posten
- Keine Vendor- oder Marktpreisorientierung ausser statischer Heuristik
- Keine aktive Hilfestellung bei Unsicherheit oder Entscheidungsstress

---

## 4. Marktrecherche und Bedarf fuer KI-Funktionen

### 4.1 Marktbeobachtung: Hochzeiten bleiben ausgabenintensiv und beratungsbeduerftig
Externe Marktsignale zeigen, dass Hochzeit weiterhin ein hoch emotionaler und kostenkritischer Markt ist:
- The Knot 2026 Real Weddings Study beschreibt den Hochzeitsmarkt als durch Personalisierung, Technologieeinsatz und hohe Entscheidungsintensitaet gepraegt.
- Laut The Knot lag der durchschnittliche US-Hochzeitspreis 2026 bei 34.200 USD.
- Der durchschnittliche Betrag pro Gast lag laut The Knot bei 292 USD.
- Laut The Knot sind Gastanzahl, Region, Saison und Vendor-Auswahl wesentliche Kostentreiber.
- The Knot weist darauf hin, dass Paare im Schnitt 13 Vendoren engagieren.

**Ableitung fuer WedBudget:**
Budget- und Priorisierungsdruck ist hoch. Nutzer brauchen nicht nur ein Eingabewerkzeug, sondern Orientierung, Einordnung und aktive Warnungen.

### 4.2 Marktbeobachtung: Digitale Planungstools und strukturierte Helfer sind etabliert
- The Knot vermarktet aktiv Budget Advisor, Checklisten, Tabellen, Timeline-Tools, Vendor Manager und Guest List Tools.
- The Knot beschreibt Wedding Planning Spreadsheets weiterhin als stark nachgefragt und kollaborativ nutzbar.
- Gleichzeitig zeigt genau diese Spreadsheet-Nachfrage, dass viele Nutzer noch immer in semimanualen Planungsprozessen stecken.

**Ableitung fuer WedBudget:**
Das Problem ist nicht, ob Nutzer digitale Planung wollen - sondern ob ein Tool ihnen schneller und intelligenter hilft als Excel/Sheets.

### 4.3 Marktbeobachtung: KI ist in Wedding Planning bereits sichtbar angekommen
Ein besonders relevantes Signal liefert The Knot selbst:
- Laut The Knot nutzten 36 Prozent der Paare KI-Tools zur Hochzeitsplanung; das sei doppelt so viel wie im Januar 2025.
- The Knot hat eine ChatGPT-Integration fuer Vendor Discovery eingefuehrt.
- The Knot positioniert KI dort als Personalisierungs- und Recherchehilfe, nicht als vollautonome Steuerung.

**Ableitung fuer WedBudget:**
KI in Wedding Planning ist keine Zukunftsvision mehr. Wer 2026/2027 relevant bleiben will, braucht mindestens KI-gestuetzte Hilfe, Analyse und Personalisierung.

### 4.4 Marktbeobachtung: Nutzer erwarten Personalisierung, aber nur unter Vertrauensbedingungen
Salesforce State of the AI Connected Customer liefert klare Leitplanken:
- 73 Prozent der Kunden sagen, dass Unternehmen sie heute eher individuell behandeln als frueher.
- 71 Prozent fuehlen sich gleichzeitig zunehmend schuetzend gegenueber ihren persoenlichen Daten.
- 61 Prozent sagen, dass AI-Fortschritte Vertrauen noch wichtiger machen.
- 72 Prozent finden es wichtig zu wissen, ob sie mit einer AI interagieren.
- Nur 17 Prozent fuehlen sich wohl damit, wenn AI finanzielle Entscheidungen fuer sie trifft.
- 38 Prozent sind offen dafuer, dass AI personalisierte Inhalte erstellt.

**Ableitung fuer WedBudget:**
- KI darf Budgetentscheidungen nicht "uebernehmen".
- KI muss klar gekennzeichnet sein.
- KI darf Vorschlaege machen, Erklaerungen liefern und Inhalte strukturieren.
- Finanzielle Endentscheidungen muessen beim Paar bleiben.

### 4.5 Marktbeobachtung: Soforthilfe, Personalisierung und einfache Automatisierung werden erwartet
Zendesk CX Trends 2026 zeigt branchenuebergreifend relevante Muster:
- 76 Prozent der Kunden erwarten Personalisierung.
- Fast zwei Drittel erwarten mit AI noch staerker personalisierte Erlebnisse.
- 62 Prozent halten personalisierte Empfehlungen fuer besser als allgemeine Empfehlungen.
- Fast 8 von 10 Konsumenten finden AI-Bots bei einfachen Problemen hilfreich.
- 67 Prozent sind bereit, persoenliche AI-Assistenten fuer bestimmte Aufgaben zu nutzen.
- 51 Prozent bevorzugen Bots gegenueber Menschen, wenn sie sofortige Hilfe wollen.
- 70 Prozent der Konsumenten sehen eine Luecke zwischen Unternehmen, die AI gut einsetzen, und solchen, die es nicht tun.
- 70 Prozent kaufen nicht bei Unternehmen, deren Sicherheitsmassnahmen schwach wirken.

**Ableitung fuer WedBudget:**
- KI sollte zuerst "schnelle Hilfen" und "klar personalisierte Empfehlungen" liefern.
- Datenschutz und Sicherheitskommunikation sind nicht optional, sondern conversion-relevant.
- Ein guter AI-Coach kann Nutzungsqualitaet und wahrgenommenen Produktwert stark steigern.

---

## 5. Strategische Leitlinie fuer KI in WedBudget

### 5.1 Produktthese
WedBudget sollte sich nicht zu einem generischen Chatbot fuer Hochzeiten entwickeln, sondern zu einem **intelligenten Budget- und Entscheidungs-Coach fuer Brautpaare**.

### 5.2 Rollenbild der KI in der App
Die KI soll drei Rollen einnehmen:

#### 1. Erklaerer
- erklaert Budgets, Kennzahlen, Abweichungen, Risiken
- macht Berechnungen verstaendlich
- reduziert Unsicherheit

#### 2. Coach
- priorisiert Naechste Schritte
- erkennt Luecken, Overspending-Risiken, unlogische Verteilungen
- gibt umsetzbare Vorschlaege

#### 3. Assistent
- hilft bei Texteingaben, Strukturierung, Erfassung und Zusammenfassung
- spaeter auch bei Vendor-Recherche und Preisorientierung

### 5.3 Was die KI explizit nicht tun sollte
- keine autonomen Budgetfreigaben
- keine verdeckten Aenderungen an Finanzdaten
- keine undurchsichtigen Scorings ohne Erklaerung
- keine serverseitige Dauerspeicherung ohne Consent
- keine Halluzinationen als harte Tatsachen darstellen

---

## 6. Anforderungskonzept fuer die Produkt-Evolution

## 6.1 Muss-Anforderungen: Bestehende Funktionen muessen erhalten bleiben
Die KI-Evolution darf die aktuelle Kernnutzung nicht verschlechtern.

### FR-BASIS-01 Privacy-first bleibt Standard
- Ohne Login nutzbar
- Lokale Datenspeicherung bleibt Standardmodus
- KI-Funktionen muessen optional aktivierbar sein

### FR-BASIS-02 Aktuelle Budgetlogik bleibt fachliche Wahrheit
- Bestehende KPI-Formeln bleiben nachvollziehbar und reproduzierbar
- KI darf keine hidden business rules einfuehren
- Jede AI-Empfehlung muss von der bestehenden Fachlogik unterscheidbar sein

### FR-BASIS-03 Onboarding, Details, Export, Import, Share muessen weiter funktionieren
- Alle aktuellen Flows bleiben voll intakt
- KI darf keine Kernfunktion ersetzen, bevor eine gleichwertige Alternative stabil ist

### FR-BASIS-04 Offline-/Degradationsfaehigkeit
- Fallback ohne KI muss sauber funktionieren
- Wenn AI-Dienst nicht verfuegbar ist, bleibt die App nutzbar

---

## 6.2 Empfohlene KI-Funktionen mit Marktbedarf und Nutzen

### KI-Funktion 1: Budget Coach
**Beschreibung:**
Ein KI-Modul analysiert den aktuellen Plan und erklaert in natuerlicher Sprache:
- wie realistisch der Gesamtplan ist,
- welche Kostenbloecke auffaellig hoch/niedrig sind,
- wo Budgetrisiken bestehen,
- welche 3-5 konkreten Anpassungen sinnvoll waeren.

**Marktbedarf:** Hoch
- Hohe Hochzeitskosten
- starke Unsicherheit bei Priorisierung
- AI wird fuer personalisierte Empfehlungen zunehmend erwartet

**Passung zur App:** Sehr hoch
- alle benoetigten Daten liegen bereits vor
- klare Differenzierung gegenueber Tabellen-Tools

**Beispielausgabe:**
- "Euer Catering-Anteil liegt deutlich ueber typischen Spannweiten fuer 80 Gaeste. Wenn euch Food nicht absolute Prioritaet ist, prueft hier zuerst Einsparpotenzial."
- "Ihr habt ein knappes Restbudget, aber noch keine Transport- oder Papeteriepositionen. Das deutet auf eine unvollstaendige Planung hin."

**Anforderungen:**
- FR-AI-01 Analyse des Gesamtplans auf Basis strukturierter Planungsdaten
- FR-AI-02 Ausgabe von max. 5 priorisierten Empfehlungen
- FR-AI-03 Jede Empfehlung enthaelt Begruendung und erwarteten Effekt
- FR-AI-04 Keine automatische Aenderung ohne User-Bestaetigung

### KI-Funktion 2: Luecken- und Vollstaendigkeitsanalyse
**Beschreibung:**
Die KI erkennt, ob fuer einen Hochzeitstyp wichtige Kategorien, Aufgaben oder Daten fehlen.

**Marktbedarf:** Hoch
- Nutzer vergessen oft Nebenkosten
- The Knot positioniert Checklisten und Vorlagen stark, was den Bedarf an Vollstaendigkeit zeigt

**Passung zur App:** Sehr hoch
- aktuelles Onboarding legt nur initiale Kostenbloecke an
- spaetere Lueckenpruefung fehlt komplett

**Anforderungen:**
- FR-AI-05 Erkennung fehlender Budgetkategorien basierend auf Gastzahl, Datum und bestehendem Setup
- FR-AI-06 Erkennung fehlender Pflichtdaten oder riskanter Blind Spots
- FR-AI-07 Vorschlag neuer Posten mit Preview, nicht mit stiller Uebernahme

### KI-Funktion 3: Naechste Schritte Assistent
**Beschreibung:**
Die KI generiert personalisierte To-dos fuer die naechsten 7/14/30 Tage auf Basis von:
- Hochzeitsdatum
- Status offener Ausgaben
- Checklisten
- faelligen Zielterminen
- fehlenden Positionen

**Marktbedarf:** Sehr hoch
- Paare wollen nicht nur wissen, wie viel fehlt, sondern was sie als naechstes tun sollen
- The Knot bietet Timeline- und Checklist-Produkte explizit an

**Passung zur App:** Sehr hoch
- weddingDate, targetDate, checklist und status sind bereits vorhanden

**Anforderungen:**
- FR-AI-08 Generierung einer priorisierten Aufgabenliste mit Datumskontext
- FR-AI-09 Kennzeichnung von Dringlichkeit, Risiko und empfohlenem Zeitpunkt
- FR-AI-10 optionales Uebernehmen vorgeschlagener Tasks in bestehende Checklisten

### KI-Funktion 4: Konversationelles Onboarding
**Beschreibung:**
Statt nur Formularschritten kann optional ein AI-Assistent das Onboarding in natuerlicher Sprache begleiten.

**Marktbedarf:** Mittel bis hoch
- reduziert Einstiegsbarriere
- hilfreich fuer unsichere Nutzer
- steigert wahrgenommene Intelligenz des Produkts

**Passung zur App:** Hoch
- der bestehende Onboarding-Flow kann fachlich erhalten bleiben, KI wird nur als Schicht darueber gelegt

**Anforderungen:**
- FR-AI-11 AI erklaert Fragen im Onboarding und schlaegt typische Werte vor
- FR-AI-12 User kann zwischen klassischem und AI-unterstuetztem Onboarding wechseln
- FR-AI-13 Ergebnis wird immer in strukturierte Felder ueberfuehrt und vor Bestaetigung angezeigt

### KI-Funktion 5: Natural-Language Expense Capture
**Beschreibung:**
Nutzer koennen freie Texte eingeben wie:
- "Fotograf 2.400 EUR, 800 angezahlt, Rest im August"
- "DJ will 1.300, Angebot liegt vor, noch offen"
und die App wandelt das in strukturierte Felder um.

**Marktbedarf:** Hoch
- senkt Pflegeaufwand massiv
- besonders mobil sehr wertvoll

**Passung zur App:** Hoch
- Expense-Datenmodell ist bereits strukturiert genug

**Anforderungen:**
- FR-AI-14 Extraktion von Kategorie, Titel, Betrag, Status und Datum aus Freitext
- FR-AI-15 Vorschau vor Speicherung
- FR-AI-16 Unsichere Felder werden kenntlich gemacht

### KI-Funktion 6: KPI-Erklaerer und What-if-Szenarien
**Beschreibung:**
Die KI erklaert Kennzahlen und beantwortet Fragen wie:
- "Warum ist unser Ergebnis negativ?"
- "Was passiert, wenn wir 20 Gaeste weniger einladen?"
- "Wie viel muessen wir sparen, um unter 25.000 EUR zu bleiben?"

**Marktbedarf:** Hoch
- hohe Unsicherheit bei Finanzinterpretation
- kombiniert Erklaerung mit Entscheidungshilfe

**Passung zur App:** Sehr hoch
- basiert voll auf vorhandenen Daten und Logik

**Anforderungen:**
- FR-AI-17 Natuerlichsprachliche Erklaerung aller Kernmetriken
- FR-AI-18 Simulationsmodus fuer Szenarien ohne echte Datenmutation
- FR-AI-19 Vergleichsansicht zwischen Ist und Simulation

### KI-Funktion 7: Preis- und Vendor-Orientierung
**Beschreibung:**
AI hilft spaeter mit Richtwerten und Vendor-Recherche, z. B. fuer Fotografen, Catering, Musik.

**Marktbedarf:** Hoch
- The Knot investiert bereits in AI-gestuetzte Vendor Discovery
- Preis- und Vendor-Auswahl ist einer der groessten Kostenhebel

**Passung zur App:** Mittel
- in der aktuellen App fehlen externe Marktdatenquellen
- daher eher Phase 2/3 statt MVP

**Anforderungen:**
- FR-AI-20 AI kann regionale Preisorientierungen anzeigen
- FR-AI-21 AI kann externe Anbieterquellen integrieren oder spaeter anhaengen
- FR-AI-22 Jede Marktaussage wird als Richtwert markiert, nicht als Garantie

### KI-Funktion 8: Kommunikationshilfe
**Beschreibung:**
KI erstellt kurze Texte fuer Vendor-Anfragen, Nachfragen, Budgetverhandlungen oder interne Partner-Abstimmung.

**Marktbedarf:** Mittel
- nuetzlich, aber nicht Kernwert des Produkts
- steigert gefuehlte Produktintelligenz

**Passung zur App:** Mittel bis hoch
- benoetigt wenig strukturelle Erweiterung

**Anforderungen:**
- FR-AI-23 Vorlagen fuer Vendor-Anfragen basierend auf vorhandenen Budgetdaten
- FR-AI-24 Tonalitaeten: sachlich, freundlich, verbindlich
- FR-AI-25 Export/Copy-Funktion fuer Texte

---

## 7. Priorisierung der KI-Funktionen

### Phase 1: Hoher Nutzen, geringe bis mittlere Komplexitaet
1. Budget Coach
2. Luecken- und Vollstaendigkeitsanalyse
3. Naechste Schritte Assistent
4. KPI-Erklaerer / What-if-Szenarien
5. Natural-Language Expense Capture

### Phase 2: UX- und Conversion-Verstaerker
6. Konversationelles Onboarding
7. Kommunikationshilfe

### Phase 3: Plattform- und Datenhebel
8. Preis- und Vendor-Orientierung
9. Externe Datenintegration
10. spaeter moegliche Agent-Funktionen mit mehr Automatisierung

**Empfehlung:**
Phase 1 liefert den groessten Produktwert bei bester Vereinbarkeit mit Privacy-first und bestehender Architektur.

---

## 8. Fachliche Anforderungen im Zielsystem

### 8.1 Neue funktionale Anforderungen

#### FR-KI-01 Transparente KI-Nutzung
- Vor jeder KI-Nutzung wird klar kommuniziert, dass AI Vorschlaege erzeugt
- Nutzer sehen, welche Daten in die Anfrage eingehen
- KI-Antworten sind als Vorschlag gekennzeichnet

#### FR-KI-02 Human-in-the-loop
- Keine KI darf Finanzdaten ohne explizite Bestaetigung veraendern
- Jede strukturelle Aenderung hat Preview und Undo

#### FR-KI-03 Personalisierung auf Planbasis
- Empfehlungen basieren auf weddingDate, guestCount, totalBudget, existing expenses, statuses, targetDates und checklists
- generische Tipps ohne Datenkontext sollen vermieden werden

#### FR-KI-04 Erklaerbarkeit
- Jede Empfehlung benoetigt mindestens eine Begruendung
- Zahlenbezogene Vorschlaege muessen auf konkrete Planwerte rueckfuehrbar sein

#### FR-KI-05 Unsicherheitskommunikation
- Wenn AI Felder nur vermutet, wird das sichtbar gekennzeichnet
- wenn externe Marktdaten fehlen, darf keine Scheingenauigkeit erzeugt werden

#### FR-KI-06 Mehrsprachigkeit
- KI-Ausgaben sollen mindestens DE und EN unterstuetzen
- Sprache folgt dem aktuellen App-Kontext

### 8.2 Neue nicht-funktionale Anforderungen

#### NFR-KI-01 Datenschutz
- Standardmodus bleibt datensparsam
- KI nur nach transparenter Einwilligung oder in klar beschriebenem lokalen Modus
- keine dauerhafte Speicherung von Prompts oder Planungsdaten ohne Zweck und Consent

#### NFR-KI-02 Sicherheit
- Schutz vor Prompt Injection ueber importierte oder frei eingegebene Inhalte
- keine unkontrollierte Exfiltration von Planungsdaten
- Logging ohne sensible Vollinhalte, soweit moeglich

#### NFR-KI-03 Verfuegbarkeit
- Ausfall des KI-Dienstes darf Kernnutzung nicht beeintraechtigen
- saubere Fehlermeldung statt blockierender Fehler

#### NFR-KI-04 Kostenkontrolle
- AI-Aufrufe muessen budgetiert, limitiert und nachvollziehbar sein
- Low-cost-Fallback fuer einfache Aufgaben bevorzugen

#### NFR-KI-05 Qualitaet
- AI-Ausgaben muessen mit Guardrails, Templates und Validierung stabilisiert werden
- kritische Finanzempfehlungen duerfen nicht ungeprueft uebernommen werden

#### NFR-KI-06 Performance
- AI sollte fuer leichte Aufgaben innerhalb weniger Sekunden antworten
- schwere Analysen duerfen asynchron laufen, muessen aber UI-seitig sauber kommuniziert werden

---

## 9. Daten- und Architekturkonzept fuer KI

### 9.1 Vorhandener Datenkontext, der bereits KI-tauglich ist
Die App hat bereits einen sehr guten strukturierten Kontext fuer KI:
- weddingName
- weddingDate
- guestCount
- totalBudget
- expenses[]
- status
- targetDate
- costPerPerson
- checklist[]
- updates[]
- attachments[]

Das ist ein grosser Vorteil: Viele KI-Funktionen koennen ohne neues Kernmodell starten.

### 9.2 Empfohlene neue Datenobjekte
Fuer einen sauberen KI-Ausbau sind folgende Datenstrukturen sinnvoll:

#### AIInsight
- id
- type
- severity
- title
- message
- relatedExpenseIds[]
- createdAt
- source: heuristic | ai

#### AIRecommendation
- id
- category
- rationale
- suggestedChanges[]
- confidence
- requiresConfirmation
- createdAt

#### AIConsentSettings
- enabled
- allowCloudInference
- allowDataRetention
- language
- lastUpdatedAt

#### AISessionLog
- id
- actionType
- inputScope
- outputSummary
- acceptedChanges
- createdAt

### 9.3 Empfohlene Zielarchitektur

#### Stufe 1: Assistive AI ohne Plattformumbau
- Frontend bleibt Next.js App Router
- AI-Aufrufe ueber serverseitige Route oder Edge Function
- strukturierter Prompt aus Planungsdaten
- Antwort wird validiert und als Vorschlag gerendert
- Speicherung optional lokal

#### Stufe 2: Hybrid mit optionalem Account
- lokale Nutzung bleibt moeglich
- optionaler Login fuer Verlauf, Sync, geteilte KI-Insights
- Supabase kann spaeter fuer Sessions, Freigaben und Team-Nutzung dienen

#### Stufe 3: Externe Datenanreicherung
- Marktpreise
- Vendor-Daten
- regionale Benchmarks
- spaeter Agenten fuer Recherche-Workflows

### 9.4 Produktarchitektonische Empfehlung
**Nicht mit agentischer Vollautomatisierung starten.**
Erst ein sauberer "copilot-style" Ansatz:
- analysieren
- erklaeren
- vorschlagen
- bestaetigen lassen
- anwenden

Das passt besser zu Vertrauen, Budgetsensibilitaet und der aktuellen App-Reife.

---

## 10. Risiken und Gegenmassnahmen

### Risiko 1: Nutzer vertrauen AI-finanziellen Aussagen zu stark
**Gegenmassnahme:**
- klare Kennzeichnung als Empfehlung
- Begruendung und Datengrundlage anzeigen
- keine automatische Budgetentscheidung

### Risiko 2: Datenschutzversprechen wird durch Cloud-AI verwischt
**Gegenmassnahme:**
- klarer Opt-in
- lokaler Standardmodus bleibt Standard
- Datenschutzhinweis pro KI-Funktion

### Risiko 3: Halluzinationen oder ungenaue Preisangaben
**Gegenmassnahme:**
- Zahlen nur aus echten Daten oder markierten Benchmarks ableiten
- Unsicherheit und Quelle sichtbar machen
- Regel: keine exakte Preisbehauptung ohne Datenbasis

### Risiko 4: Zu fruehe Produktueberladung
**Gegenmassnahme:**
- Phase-1-Fokus auf 3-5 Kernfunktionen
- UI modular halten
- AI nicht auf jeder Seite gleichzeitig aufdringlich einbauen

### Risiko 5: Kostenkontrolle bei LLM-Nutzung
**Gegenmassnahme:**
- strukturierte Prompts
- kleinere Modelle fuer einfache Extraktion
- groessere Modelle nur fuer tiefere Analysen
- Token-Limits und Feature-Gating

---

## 11. Empfohlene MVP-Definition fuer KI-Version 1

### Zielbild MVP
Eine erste KI-Version sollte **nicht** versuchen, den gesamten Hochzeitsmarkt abzudecken. Das MVP sollte die bestehende Budget-App intelligenter machen.

### MVP-Funktionsumfang
- KI-Budget Coach
- KI-Lueckenanalyse
- KI-Naechste-Schritte-Liste
- KI-KPI-Erklaerung
- Natural-Language Expense Capture

### Warum genau diese Kombination
- Hohe Marktpassung
- maximaler Nutzen auf vorhandener Datenbasis
- keine Vendor-Datenplattform noetig
- gute Balance zwischen Wow-Effekt und Realisierbarkeit
- erhaelt Privacy-first Profil

---

## 12. Konkrete Produktanforderungen fuer den naechsten Bot / Entwickler

### 12.1 UI-Einstiegspunkte
Empfohlene neue UI-Bereiche:
- Dashboard: Karte "KI-Einschaetzung"
- Details: Button "Mit KI erfassen" fuer neue Position
- Basics/Dashboard: Button "Was ist mein groesstes Risiko?"
- globale Sektion: "Naechste Schritte"
- optionaler Drawer oder Sidepanel: "WedBudget KI-Coach"

### 12.2 Technische Integrationspunkte im Bestand
Naheliegende Anknuepfungen im Code:
- Onboarding: `src/components/onboarding-survey.tsx`
- Hauptlogik / KPIs / Details: `src/components/calculator.tsx`
- Typen und Datenmodell: `src/lib/types.ts`
- lokale Persistenz: `src/lib/storage.ts`
- Domain- und Heuristiklogik: `src/lib/domain.ts`
- Planinitialisierung: `src/components/plan-client.tsx`

### 12.3 Empfohlene Implementierungsreihenfolge
1. Strukturierte AI-Analyse fuer Dashboard
2. What-if-Simulationen auf vorhandener Berechnungslogik
3. Natural-Language Expense Capture mit Preview
4. Next Steps Generator aus Datum, Status und Luecken
5. Consent- und Transparenzlayer
6. spaeter Vendor- und Marktpreis-Module

---

## 13. Fazit
WedBudget hat bereits genau die Art von Datenstruktur, die eine sinnvolle KI-Evolution erlaubt. Der Markt zeigt klar, dass Nutzer heute sowohl digitale Planung als auch personalisierte AI-Hilfe annehmen - aber nur dann, wenn Vertrauen, Transparenz und Kontrolle gewahrt bleiben.

Die strategisch richtige Weiterentwicklung ist deshalb:
- nicht "AI als Gimmick",
- nicht "AI ersetzt den Nutzer",
- sondern **AI als erklaerender, priorisierender Budget-Coach fuer reale Hochzeitsentscheidungen**.

Wenn der naechste Bot dieses Dokument als Grundlage nimmt, sollte er die App nicht in Richtung Chat-Spielerei ausbauen, sondern entlang dieser Prioritaeten:
- erst Analyse,
- dann Handlungsempfehlung,
- dann strukturierte Eingabehilfe,
- erst spaeter externe Recherche- und Agent-Funktionen.

So entsteht aus WedBudget kein generischer AI-Clone, sondern ein eigenstaendiges, differenziertes Produkt mit starkem Marktfit.

---

## 14. Verwendete Marktsignale (externe Recherche, April 2026)
- The Knot Real Weddings Study 2026
- The Knot: Average Wedding Cost (2026)
- The Knot: Wedding Planning Spreadsheet / Budget Advisor / Planning Helpers
- The Knot: AI prompts for wedding planning / ChatGPT integration
- Salesforce: State of the AI Connected Customer
- Zendesk: Customer Service Statistics / CX Trends 2026
