export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <article className="prose prose-sm max-w-none">
        <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Rechtliches</span>
        <h1 className="mt-2 text-2xl font-semibold">Impressum</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Stand: 30.03.2026</p>

        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          WAMOCON GmbH<br />
          Mergenthalerallee 79 - 81<br />
          65760 Eschborn<br />
          Deutschland
        </p>

        <h3>Kontakt</h3>
        <p>
          Telefon: +49 6196 5838311<br />
          E-Mail: info@wamocon.com<br />
          Projektkontakt WedBudget: info@wedbudget.app
        </p>

        <h3>Vertretungsberechtigter Geschäftsführer</h3>
        <p>Dipl.-Ing. Waleri Moretz</p>

        <h3>Registereintrag</h3>
        <p>
          Sitz der Gesellschaft: Eschborn<br />
          Handelsregister: Eschborn HRB 123666<br />
          Umsatzsteuer-Identifikationsnummer: DE344930486
        </p>

        <h3>Angaben zum Angebot</h3>
        <p>
          WedBudget ist eine webbasierte Software-as-a-Service-Plattform für Hochzeitsbudgetplanung.
          Das Angebot richtet sich an Brautpaare, Hochzeitsplaner und sonstige Personen,
          die ihre Hochzeit finanziell planen und verwalten möchten.
        </p>

        <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
        <p>
          Dipl.-Ing. Waleri Moretz<br />
          WAMOCON GmbH<br />
          Mergenthalerallee 79 - 81<br />
          65760 Eschborn
        </p>

        <h3>Streitschlichtung</h3>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          https://ec.europa.eu/consumers/odr/. Wir sind nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </article>
    </div>
  );
}
