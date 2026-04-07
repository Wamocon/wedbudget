export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <article className="prose prose-sm max-w-none">
        <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Rechtliches</span>
        <h1 className="mt-2 text-2xl font-semibold">Datenschutzerklärung</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Stand: 30.03.2026</p>

        <h3>1. Verantwortlicher</h3>
        <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:</p>
        <p>
          WAMOCON GmbH<br />
          Mergenthalerallee 79 - 81<br />
          65760 Eschborn<br />
          Telefon: +49 6196 5838311<br />
          E-Mail: info@wamocon.com<br />
          Projektkontakt: info@wedbudget.app<br />
          Geschäftsführer: Dipl.-Ing. Waleri Moretz<br />
          Handelsregister: Eschborn HRB 123666<br />
          USt-ID: DE344930486
        </p>

        <h3>2. Überblick über die Datenverarbeitung</h3>
        <p>Diese Datenschutzerklärung gilt für die Website und Webanwendung WedBudget. WedBudget ist eine digitale Plattform für Hochzeitsbudgetplanung, Kostenverwaltung und Finanzübersicht rund um die Hochzeit.</p>
        <p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Plattform sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des Nutzers oder auf einer anderen gesetzlichen Grundlage.</p>

        <h3>3. Rechtsgrundlagen der Verarbeitung</h3>
        <p>Die Verarbeitung personenbezogener Daten erfolgt auf folgenden Rechtsgrundlagen:</p>
        <ul>
          <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
          <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung oder vorvertragliche Maßnahmen)</li>
          <li>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung)</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse)</li>
        </ul>

        <h3>4. Hosting und Infrastruktur</h3>
        <p>Unsere Plattform wird über moderne Cloud-Infrastruktur bereitgestellt. Wir nutzen insbesondere folgende Dienste:</p>
        <p><strong>Vercel Inc.</strong> — Hosting der Website und Webanwendung; Verarbeitung technisch notwendiger Verbindungsdaten (z. B. IP-Adresse, Zeitstempel, Browserinformationen). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p><strong>Supabase Inc.</strong> — Datenbank, Authentifizierung, Dateispeicher und Teile der Backend-Infrastruktur; Verarbeitung insbesondere von Authentifizierungsdaten, Session-Informationen und gespeicherten Planungsdaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>

        <h3>5. Registrierung und Authentifizierung</h3>
        <p>Für die Nutzung von WedBudget ist eine Registrierung erforderlich. Dabei werden insbesondere folgende Daten verarbeitet:</p>
        <ul>
          <li>E-Mail-Adresse</li>
          <li>Vor- und Nachname</li>
          <li>Passwort in gehashter Form</li>
          <li>Session-Tokens und sicherheitsrelevante Authentifizierungsinformationen</li>
        </ul>
        <p>Die Authentifizierung erfolgt über Supabase Auth. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>

        <h3>6. Datenverarbeitung auf der Plattform</h3>
        <p>Im Rahmen der Nutzung von WedBudget werden insbesondere folgende Kategorien personenbezogener und planungsbezogener Daten verarbeitet:</p>
        <ul>
          <li>Hochzeitsbudget und Kostenpositionen</li>
          <li>Gästeliste und Sitzplatzdaten</li>
          <li>Aufgaben, Checklisten und Notizen</li>
          <li>Statusverläufe und Fortschrittsdokumentationen</li>
          <li>Einladungen und Benachrichtigungseinstellungen</li>
        </ul>
        <p>Diese Daten werden zur Vertragserfüllung und Bereitstellung der Planungsfunktionen verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>

        <h3>7. Cookies und lokale Speicherung</h3>
        <p>WedBudget verwendet technisch notwendige Cookies und ähnliche Technologien, soweit dies für Anmeldung, Sitzungsverwaltung, Sicherheit und den Betrieb der Plattform erforderlich ist.</p>
        <p>Zusätzlich nutzt die Plattform lokale Browser-Speichertechnologien wie localStorage, um Spracheinstellungen, Offline-Daten und Synchronisationszustände lokal zu speichern.</p>
        <p>Tracking-, Werbe- oder Analyse-Cookies werden derzeit nicht eingesetzt.</p>

        <h3>8. Kontaktaufnahme</h3>
        <p>Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen mitgeteilten Daten verarbeitet, um Ihre Anfrage zu bearbeiten und für Anschlussfragen bereitzuhalten. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO; bei vertragsbezogenen Anfragen zusätzlich Art. 6 Abs. 1 lit. b DSGVO.</p>

        <h3>9. Webanalyse</h3>
        <p>Derzeit setzt WedBudget keine Webanalyse-, Tracking- oder Marketing-Tools ein. Sollte sich dies ändern, erfolgt die Verarbeitung nur auf Basis der jeweils erforderlichen gesetzlichen Grundlage.</p>

        <h3>10. SSL- bzw. TLS-Verschlüsselung</h3>
        <p>Diese Website und Webanwendung nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung.</p>

        <h3>11. Weitergabe von Daten an Dritte</h3>
        <p>Eine Übermittlung personenbezogener Daten an Dritte findet grundsätzlich nur statt, wenn:</p>
        <ul>
          <li>Sie Ihre ausdrückliche Einwilligung erteilt haben</li>
          <li>Die Weitergabe zur Vertragserfüllung erforderlich ist</li>
          <li>Eine rechtliche Verpflichtung besteht</li>
          <li>Berechtigte Interessen die Weitergabe erfordern und keine überwiegenden Schutzinteressen entgegenstehen</li>
        </ul>
        <p>Im Rahmen der Auftragsverarbeitung setzen wir insbesondere Vercel und Supabase ein.</p>

        <h3>12. Speicherdauer und Datenlöschung</h3>
        <p>Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Verarbeitungszweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
        <ul>
          <li>Kontodaten werden mit Löschung des Benutzerkontos gelöscht, sofern keine gesetzlichen Pflichten entgegenstehen.</li>
          <li>Planungs- und Budgetdaten werden grundsätzlich bis zur Löschung des jeweiligen Projekts oder Kontos gespeichert.</li>
          <li>Lokal gespeicherte Offline-Daten verbleiben auf dem Gerät, bis sie synchronisiert oder durch den Nutzer entfernt werden.</li>
        </ul>

        <h3>13. Rechte der betroffenen Personen</h3>
        <p>Ihnen stehen folgende Rechte gemäß DSGVO zu:</p>
        <ul>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
          <li>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p>Wenden Sie sich an info@wamocon.com oder info@wedbudget.app.</p>

        <h3>14. Beschwerderecht bei einer Aufsichtsbehörde</h3>
        <p>Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.</p>

        <h3>15. Änderungen dieser Datenschutzerklärung</h3>
        <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den aktuellen rechtlichen Anforderungen anzupassen oder Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt dann die jeweils aktuelle Fassung.</p>
      </article>
    </div>
  );
}
