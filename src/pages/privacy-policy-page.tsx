import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicyPage() {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout title="Datenschutzerklärung" description="Informationen zum Datenschutz und zur Datenverarbeitung">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl text-blue-900">Datenschutzerklärung</CardTitle>
                <CardDescription className="text-blue-700">
                  Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Verantwortliche Stelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              1. Verantwortliche Stelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Sachverständigenbüro Justitia</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Oberdorfstraße 14, 97225 Zellingen OT Retzbach</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+49 (0) 152 335 31845</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>datenschutz@bau-structura.de</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Datenschutzbeauftragte/r</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>datenschutz@bau-structura.de</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+49 (0) 152 335 31845</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datenverarbeitung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              2. Art und Umfang der Datenverarbeitung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">2.1 Benutzerregistrierung und -verwaltung</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Bei der Registrierung und Nutzung der Bau-Structura App verarbeiten wir folgende Daten:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                <li>Benutzername und E-Mail-Adresse</li>
                <li>Passwort (verschlüsselt gespeichert)</li>
                <li>Profilinformationen (Name, Telefonnummer, optional)</li>
                <li>Zeitstempel der Registrierung und letzten Anmeldung</li>
                <li>IP-Adresse zum Zeitpunkt der Registrierung</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">2.2 Projektdaten und Baustelleninformationen</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Im Rahmen der Projektdokumentation verarbeiten wir:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                <li>Projektbezeichnungen und -beschreibungen</li>
                <li>Baustellenadressen und Geodaten</li>
                <li>Zeitpläne und Meilensteine</li>
                <li>Dokumentenanhänge (Pläne, Fotos, Berichte)</li>
                <li>Kostendaten und Kalkulationen</li>
                <li>Ansprechpartner und Kontaktdaten</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">2.3 Technische Daten und Protokolle</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Für den sicheren Betrieb der Anwendung erfassen wir:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                <li>Server-Logs mit IP-Adressen und Zugriffsdaten</li>
                <li>Session-Informationen und Authentifizierungsdaten</li>
                <li>Fehlerprotokolle und Performance-Metriken</li>
                <li>Backup-Daten zur Datensicherheit</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Speicherdauer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              3. Speicherdauer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Benutzerdaten</h4>
                  <p className="text-sm text-muted-foreground">
                    Bis zur Löschung des Benutzerkontos oder auf Anfrage (maximal 3 Jahre nach letzter Aktivität)
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Projektdaten</h4>
                  <p className="text-sm text-muted-foreground">
                    Für die Dauer der Projektlaufzeit plus 10 Jahre (gesetzliche Aufbewahrungspflichten)
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Server-Logs</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatische Löschung nach 30 Tagen (außer bei Sicherheitsvorfällen)
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Backup-Daten</h4>
                  <p className="text-sm text-muted-foreground">
                    Aufbewahrung für maximal 90 Tage, dann automatische Löschung
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Betroffenenrechte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              4. Ihre Rechte als betroffene Person
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Grundrechte</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 15</span>
                    <span>Recht auf Auskunft über verarbeitete Daten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 16</span>
                    <span>Recht auf Berichtigung unrichtiger Daten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 17</span>
                    <span>Recht auf Löschung ("Recht auf Vergessenwerden")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 18</span>
                    <span>Recht auf Einschränkung der Verarbeitung</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Weitere Rechte</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 20</span>
                    <span>Recht auf Datenübertragbarkeit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 21</span>
                    <span>Widerspruchsrecht gegen Verarbeitung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mt-0.5">Art. 77</span>
                    <span>Recht auf Beschwerde bei der Aufsichtsbehörde</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Kontakt für Betroffenenrechte</h4>
              <p className="text-sm text-blue-800">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: 
                <strong className="ml-1">datenschutz@bau-structura.de</strong>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Wir bearbeiten Ihre Anfrage innerhalb von 30 Tagen gemäß Art. 12 DSGVO.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sicherheitsmaßnahmen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              5. Technische und organisatorische Maßnahmen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Verschlüsselung</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• SSL/TLS-Verschlüsselung</li>
                  <li>• Passwort-Hashing (bcrypt)</li>
                  <li>• Verschlüsselte Datenspeicherung</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Zugriffskontrolle</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Rollenbasierte Berechtigungen</li>
                  <li>• Session-Management</li>
                  <li>• Authentifizierungssystem</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Datensicherung</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Automatische Backups</li>
                  <li>• Versionskontrolle</li>
                  <li>• Disaster Recovery</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stand der Datenschutzerklärung */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong>Stand dieser Datenschutzerklärung:</strong> {new Date().toLocaleDateString('de-DE')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren. 
                  Die jeweils aktuelle Version finden Sie auf dieser Seite.
                </p>
              </div>
              <Button variant="outline" onClick={() => setLocation('/')}>
                Zurück zur Startseite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}