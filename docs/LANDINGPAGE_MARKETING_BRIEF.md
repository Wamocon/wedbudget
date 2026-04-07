# WedBudget Landingpage Marketing Brief

## 1. Zweck und Nutzung
Dieses Dokument ist die zentrale Arbeitsgrundlage fuer die Erstellung und Ueberarbeitung der WedBudget Landingpage.

Ziel:
- Produktfunktion und Nutzen klar kommunizieren
- USPs sichtbar und vertrauensbildend darstellen
- Conversion auf "Neue Planung starten" und "Letzte Planung fortsetzen" steigern
- Als direktes Input-Dokument fuer Design, Copywriting und Implementierung dienen

Geltungsbereich:
- Brandname bleibt: WedBudget
- Primaeres Logo/Icon: `public/app-icon-light.svg`
- Primäre Kernpositionierung: kostenlos, werbefrei, privacy-first, sofort nutzbar

---

## 2. Dokumentenpruefung (Marketing-relevante Quellen)
Folgende Dokumente wurden fuer dieses Briefing fachlich ausgewertet:
- `docs/FUNKTIONSDOKUMENTATION.md`
- `docs/BEDIENUNGSANLEITUNG.md`
- `docs/ANFORDERUNGSDOKUMENT.md`
- `docs/PROJEKTDOKUMENTATION.md`
- `docs/MARKTANALYSE_MARKETING.md`
- `docs/ANFORDERUNGSKONZEPT_KI_EVOLUTION.md`
- `docs/TRANSFORMATIONSKONZEPT_NEXT_SUPABASE.md`

Ergebnis der Pruefung:
- Produktfunktionalitaet ist robust und klar strukturiert.
- Marketingbotschaften sind verteilt ueber mehrere Dokumente.
- Es fehlte bisher ein kompaktes, umsetzbares Landingpage-Briefing mit Copy-Assets.
- Dieses Dokument schliesst diese Luecke als Single Source fuer Landingpage-Material.

---

## 3. Produktkern in einem Satz
WedBudget ist ein kostenloser Hochzeits-Budgetplaner, der ohne Login sofort nutzbar ist und eure Daten standardmaessig lokal im Browser behaelt.

---

## 4. Zielgruppen und Hauptprobleme

### 4.1 Primaere Zielgruppe
Verlobte Paare (ca. 24-40), die ihre Hochzeit selbst planen und Kostenkontrolle wollen.

### 4.2 Sekundaere Zielgruppe
Datenschutzsensible Nutzer, die keine Accounts, keine Datenweitergabe und keine Werbe-Tracker wollen.

### 4.3 Hauptprobleme der Zielgruppe
- Budgetstress und Angst vor Kostenueberraschungen
- Zu viele Einzelaufgaben, zu wenig Struktur
- Spreadsheet-Overload und fehlende Priorisierung
- Unsicherheit, ob die Planung vollstaendig ist
- Friktion durch Apps mit Login-Pflicht oder Paywall

---

## 5. Funktionsabdeckung der Software (fuer Landingpage relevant)

### 5.1 Einstieg und Setup
- Neue Planung starten (gefuehrtes Onboarding)
- Letzte Planung fortsetzen
- JSON-Import vorhandener Planung
- Schutzdialog vor Ueberschreiben bestehender Daten

### 5.2 Budgetmanagement
- Verwaltung geplanter und tatsaechlicher Kosten
- Statusmodell je Position (offen, in Arbeit, bezahlt, fertig)
- Personenabhaengige Kosten (pro Gast)
- Heuristische Neuberechnung bei Aenderung der Gaestezahl

### 5.3 Kontrolle und Transparenz
- KPI-Dashboard (Budget, geplant, Rest, ausgegeben, Differenzen)
- Diagramme zur schnellen Lagebewertung
- Detailansicht mit Zielterminen, Checklisten und Updates

### 5.4 Datenaustausch und Sicherheit
- Auto-Save im Browser
- JSON-Export / JSON-Import
- Share-Link mit Planungsstand
- Kein Pflicht-Account

### 5.5 Bedienkomfort
- DE/EN Sprachumschaltung
- Light/Dark Theme
- PDF/Print-Export

---

## 6. USP-Framework

### USP 1: Privacy-first ohne Konto
Keine Pflichtregistrierung. Daten bleiben standardmaessig lokal.

### USP 2: Sofortiger Start ohne Friktion
Keine Setup-Huerde. Direkt planen statt erst Accounts anlegen.

### USP 3: Kostenkontrolle mit Klarheit
Statusbasierte Kennzahlen und visuelle Auswertung statt Tabellenchaos.

### USP 4: Praxisnah fuer echte Hochzeitsplanung
Onboarding, Kategorien, pro-Gast-Logik, Checklisten und Druck/PDF decken reale Workflows ab.

### USP 5: Kostenlos und werbefrei
Starker Vertrauens- und Sympathiefaktor gegenueber ueberladenen Portalen.

---

## 7. Positionierung und Messaging House

### 7.1 Positionierungsstatement
WedBudget ist der datenschutzfreundliche Hochzeits-Budgetplaner fuer Paare, die sofort starten und ihre Kosten transparent im Griff behalten wollen.

### 7.2 Kernbotschaft
Plane deine Hochzeit entspannt, behalte das Budget im Blick und behalte deine Daten bei dir.

### 7.3 Supporting Pillars
- Schnell startklar
- Finanziell transparent
- Lokal und privat
- Kostenlos nutzbar

### 7.4 Proof Points
- Kein Login fuer Kernnutzung
- Lokaler Speicherstandard (localStorage)
- JSON-Backup und Wiederherstellung
- KPI- und Chart-Logik fuer Budgetkontrolle

---

## 8. Landingpage Informationsarchitektur

### Section A: Hero
Ziel: Value Proposition in 3 Sekunden.

Inhalt:
- Brand: WedBudget + app-icon-light.svg
- Headline: klares Nutzenversprechen
- Subheadline: Budgetkontrolle + Datenschutz
- CTA primar: Neue Planung starten
- CTA sekundar: Letzte Planung fortsetzen
- Trust line: Kein Login, keine Pflicht-Cloud, kostenlos

### Section B: Problem -> Loesung
Ziel: Nutzerproblem spiegeln und loesen.

Inhalt:
- "Excel-Chaos" / "Kostenstress" / "Unklarheit"
- WedBudget als strukturierte, einfache Loesung

### Section C: Kernfunktionen
Ziel: Funktionskompetenz mit Nutzenkommunikation.

Inhalt als Karten:
- Gefuehrtes Onboarding
- Intelligente Budgetuebersicht
- Detailverwaltung mit Status und To-dos
- Import/Export/Teilen

### Section D: Datenschutz-Trust
Ziel: Differenzierung gegenueber accountbasierten Plattformen.

Inhalt:
- Daten bleiben lokal
- Kein Pflichtkonto
- Kontrolle ueber Export/Backup

### Section E: So funktioniert es
Ziel: Aktivierungsbarriere senken.

3 Schritte:
1. Planung starten
2. Kosten erfassen und priorisieren
3. Dashboard pruefen und exportieren

### Section F: FAQ
Ziel: Einwaende vorwegnehmen.

### Section G: Final CTA
Ziel: Abschluss mit klarer Handlungsoption.

---

## 9. Copy Bausteine (fertig nutzbar)

### 9.1 Hero Varianten

Variante A:
- Headline: Eure Hochzeit. Euer Budget. Eure Kontrolle.
- Subheadline: WedBudget hilft euch, Kosten klar zu planen - kostenlos, ohne Login und ohne Datenabgabe.

Variante B:
- Headline: Hochzeitsbudget planen ohne Tabellenchaos.
- Subheadline: Startet in Minuten, behaltet Ausgaben im Blick und speichert alles lokal im Browser.

Variante C:
- Headline: Die einfachste Art, euer Hochzeitsbudget im Griff zu behalten.
- Subheadline: Von der ersten Schaetzung bis zum finalen Export: klar, privat und kostenlos.

### 9.2 CTA Texte
- Primaer: Neue Planung starten
- Sekundaer: Letzte Planung fortsetzen
- Tertiaer: Backup laden

### 9.3 Trust Microcopy
- Kein Login erforderlich.
- Keine Werbung im Planungsflow.
- Eure Daten bleiben lokal im Browser.

### 9.4 Funktionskarten (Titel + Nutzen)
1. Gefuehrter Start
   - In wenigen Schritten zu einem belastbaren Budget-Setup.
2. Live Budgetkontrolle
   - Seht sofort, was geplant, offen und bereits bezahlt ist.
3. Detaillierte Postenpflege
   - Status, Zieltermine, Checklisten und Updates je Position.
4. Sicheres Backup und Teilen
   - JSON-Export/Import und Share-Link fuer euren Planungsstand.

### 9.5 Datenschutzblock
Titel:
- Eure Planung ist privat. Standardmaessig.

Text:
- WedBudget speichert Daten standardmaessig lokal in eurem Browser. Kein Pflichtkonto, keine verpflichtende Cloud-Speicherung.

### 9.6 Finaler Abschlussblock
- Headline: Startet jetzt mit einem klaren Budget statt Bauchgefuehl.
- Subheadline: Kostenlos, direkt nutzbar und auf das Wesentliche reduziert.
- Button: Jetzt mit WedBudget starten

---

## 10. FAQ Entwurf

1. Muss ich ein Konto erstellen?
- Nein. WedBudget ist ohne Login nutzbar.

2. Wo werden meine Daten gespeichert?
- Standardmaessig lokal in eurem Browser.

3. Kann ich meinen Plan sichern?
- Ja, per JSON-Export und spaeterem Import.

4. Koennen wir den Plan teilen?
- Ja, per Share-Link oder exportierter Datei.

5. Ist WedBudget kostenlos?
- Ja, die Kernfunktionen sind kostenlos nutzbar.

---

## 11. SEO und Snippet-Empfehlungen

### 11.1 Fokus-Keywords
- hochzeitsbudget planer
- hochzeitskosten berechnen
- hochzeits budget tool kostenlos
- hochzeitsplanung budget ohne login
- budgetplaner hochzeit datenschutz

### 11.2 Meta Title Vorschlaege
1. WedBudget - Kostenfreier Hochzeits-Budgetplaner ohne Login
2. WedBudget - Hochzeitsbudget planen, lokal speichern, kostenlos nutzen

### 11.3 Meta Description Vorschlaege
1. Plane dein Hochzeitsbudget kostenlos mit WedBudget. Ohne Login, mit Dashboard, Export und lokaler Datenspeicherung.
2. WedBudget hilft dir, Hochzeitskosten strukturiert zu planen und im Blick zu behalten - privat, werbefrei und direkt im Browser.

---

## 12. CI und Markeneinsatz

### 12.1 Name
- Verbindlich: WedBudget

### 12.2 Logo/Icon
- Verbindlich: `public/app-icon-light.svg`
- Einsatzorte:
  - Browser-Icon / App-Icon
  - Navbar Brand
  - Hero Brand Signet

### 12.3 Tonalitaet
- Warm
- Klar
- Vertrauensbildend
- Nicht aggressiv werblich
- Keine Ueberversprechen

---

## 13. Content-Regeln fuer Landingpage-Erstellung
- Immer Nutzen vor Feature nennen.
- Finanzkennzahlen einfach und alltagsnah erklaeren.
- Datenschutzversprechen sichtbar oberhalb der Falz platzieren.
- CTAs klar und handlungsorientiert formulieren.
- Keine unklaren Buzzwords ohne konkreten Mehrwert.
- Aussagen zur KI nur dann, wenn Funktion wirklich verfuegbar ist.

---

## 14. Akzeptanzkriterien fuer eine neue Landingpage
Eine Landingpage gilt als inhaltlich abgenommen, wenn:
- Name und Icon konsistent auf WedBudget und app-icon-light.svg gesetzt sind.
- Alle Kernfunktionen aus Abschnitt 5 klar erkennbar sind.
- USPs aus Abschnitt 6 explizit sichtbar sind.
- Hero, Feature-Sektion, Datenschutzblock, FAQ und Final CTA enthalten sind.
- Mindestens ein SEO-Title und eine Description aus Abschnitt 11 verwendet werden.
- Copy und Struktur als direkte Grundlage fuer Entwicklung nutzbar sind.

---

## 15. Kurzbriefing fuer den naechsten Bot
Wenn ein naechster Bot die Landingpage implementiert, soll er:
1. Dieses Dokument als Primarquelle verwenden.
2. Fokus auf Hero, USPs, Feature Cards, Datenschutz, FAQ und CTA legen.
3. Name/Logo unveraendert auf WedBudget + app-icon-light.svg halten.
4. Keine nicht implementierten Features bewerben.
5. Mobile-First und schnelle Lesbarkeit priorisieren.
