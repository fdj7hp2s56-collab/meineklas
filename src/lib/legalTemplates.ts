// German starter texts for the Impressum and Datenschutzerklärung.
// They prefill the CMS when you first open these pages, and show on the site
// until you publish your own version. Replace everything in [square brackets].
// This is a template, not legal advice — have it checked or use a generator.
import type { PortableTextBlock } from 'next-sanity'

let k = 0
const block = (style: string, text: string, listItem?: 'bullet'): PortableTextBlock =>
  ({
    _type: 'block',
    _key: `t${k++}`,
    style,
    markDefs: [],
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [{ _type: 'span', _key: `s${k++}`, text, marks: [] }],
  }) as PortableTextBlock
const h = (t: string) => block('h2', t)
const p = (t: string) => block('normal', t)
const li = (t: string) => block('normal', t, 'bullet')

export const impressumTemplate: PortableTextBlock[] = [
  h('Angaben gemäß § 5 DDG'),
  p('[Vorname Nachname]\n[Straße Hausnummer]\n[PLZ Ort]\nDeutschland'),
  h('Kontakt'),
  p('Telefon: [Telefonnummer]\nE-Mail: [E-Mail-Adresse]'),
  h('Umsatzsteuer-ID'),
  p('Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [Nummer — falls nicht vorhanden, diesen Abschnitt löschen]'),
  h('Redaktionell verantwortlich'),
  p('[Vorname Nachname, Anschrift wie oben — nur nötig, wenn Sie journalistisch-redaktionelle Inhalte veröffentlichen, sonst löschen]'),
  h('Bildrechte'),
  p(
    'Alle Fotografien auf dieser Website sind urheberrechtlich geschützt. Jede Verwendung, Vervielfältigung oder Veröffentlichung bedarf der vorherigen schriftlichen Zustimmung.',
  ),
]

export const datenschutzTemplate: PortableTextBlock[] = [
  h('1. Verantwortlicher'),
  p('[Vorname Nachname]\n[Straße Hausnummer, PLZ Ort]\nE-Mail: [E-Mail-Adresse]'),
  h('2. Überblick'),
  p(
    'Diese Website verwendet keine Analyse- oder Tracking-Werkzeuge, keine Werbe-Cookies und bindet keine Inhalte sozialer Netzwerke ein. Personenbezogene Daten werden nur verarbeitet, soweit dies für die Bereitstellung der Website technisch erforderlich ist oder Sie mich kontaktieren.',
  ),
  h('3. Hosting und Server-Logfiles'),
  p(
    'Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Seiten werden automatisch Informationen in Server-Logfiles gespeichert, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL sowie Browser und Betriebssystem. Diese Daten sind für die sichere und stabile Auslieferung der Website erforderlich (Art. 6 Abs. 1 lit. f DSGVO).',
  ),
  p(
    'Mit Vercel besteht ein Vertrag über Auftragsverarbeitung (Art. 28 DSGVO). Eine Übermittlung in die USA erfolgt auf Grundlage [des EU-U.S. Data Privacy Framework bzw. der EU-Standardvertragsklauseln — bitte prüfen und anpassen].',
  ),
  h('4. Auslieferung von Bildern und Inhalten (Sanity)'),
  p(
    'Bilder und Texte dieser Website werden über das Content-Management-System Sanity und dessen Content Delivery Network (cdn.sanity.io) ausgeliefert. Dabei wird Ihre IP-Adresse an Sanity übermittelt, damit die Bilder an Ihren Browser gesendet werden können (Art. 6 Abs. 1 lit. f DSGVO). Mit Sanity besteht ein Vertrag über Auftragsverarbeitung. [Anbieterangaben und Grundlage der Datenübermittlung aus dem Vertrag mit Sanity ergänzen.]',
  ),
  h('5. Lokale Speicherung im Browser'),
  p(
    'Die Archivseite merkt sich die von Ihnen gewählte Ansicht (Raster oder Liste) im lokalen Speicher Ihres Browsers (localStorage). Diese Information verbleibt auf Ihrem Gerät, wird nicht an mich übertragen und kann jederzeit über die Browsereinstellungen gelöscht werden. Die Speicherung ist für die von Ihnen gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).',
  ),
  h('6. Kontakt per E-Mail'),
  p(
    'Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre Angaben (z. B. Name, E-Mail-Adresse, Inhalt der Nachricht), um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Die Daten werden gelöscht, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.',
  ),
  h('7. Links zu anderen Websites'),
  p(
    'Diese Website enthält einfache Links, z. B. zu Instagram. Daten werden an den jeweiligen Anbieter erst übertragen, wenn Sie einen Link anklicken; ab dann gilt dessen Datenschutzerklärung.',
  ),
  h('8. Ihre Rechte'),
  p('Sie haben im Rahmen der gesetzlichen Vorgaben das Recht auf:'),
  li('Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)'),
  li('Berichtigung unrichtiger Daten (Art. 16 DSGVO)'),
  li('Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)'),
  li('Datenübertragbarkeit (Art. 20 DSGVO)'),
  li('Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)'),
  p(
    'Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Behörde Ihres Bundeslandes.',
  ),
  p('Stand: [Monat Jahr]'),
]
