import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Database, 
  Server, 
  Layers, 
  TestTube, 
  Rocket, 
  Shield,
  FileText,
  Settings,
  GitBranch,
  Package,
  Globe,
  Lock,
  Play
} from 'lucide-react';
// Layout wird inline definiert

export default function DeveloperDocumentationPage() {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Entwicklerdokumentation</h1>
            <p className="text-gray-600 mt-2">Bau-Structura • Technische Dokumentation & Entwicklerhandbuch</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Version 2.1.0
          </Badge>
        </div>

        {/* Hauptdokumentation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="architecture" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Architektur</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Datenbank</span>
            </TabsTrigger>
            <TabsTrigger value="standards" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Standards</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center space-x-2">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center space-x-2">
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Deployment</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sicherheit</span>
            </TabsTrigger>
          </TabsList>

          {/* Architektur-Übersicht */}
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Architektur-Übersicht</span>
                </CardTitle>
                <CardDescription>
                  Vollstack JavaScript-Anwendung mit moderner Architektur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Frontend</h3>
                    <div className="space-y-2">
                      <Badge variant="secondary">React 18</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Vite</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                      <Badge variant="secondary">Shadcn/ui</Badge>
                      <Badge variant="secondary">React Query</Badge>
                      <Badge variant="secondary">Wouter (Router)</Badge>
                      <Badge variant="secondary">React Leaflet</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Backend</h3>
                    <div className="space-y-2">
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Express.js</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Drizzle ORM</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">Passport.js</Badge>
                      <Badge variant="secondary">bcrypt</Badge>
                      <Badge variant="secondary">Winston Logging</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">Projektstruktur</h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    <div>📁 client/ - Frontend React-Anwendung</div>
                    <div>  ├── src/components/ - Wiederverwendbare UI-Komponenten</div>
                    <div>  ├── src/pages/ - Seitenkomponenten</div>
                    <div>  ├── src/hooks/ - Custom React Hooks</div>
                    <div>  └── src/lib/ - Utilities und Konfiguration</div>
                    <div>📁 server/ - Backend Express-Server</div>
                    <div>  ├── auth.ts - Authentifizierung</div>
                    <div>  ├── routes.ts - API-Endpunkte</div>
                    <div>  ├── db.ts - Datenbankverbindung</div>
                    <div>  └── storage.ts - Datenbank-Abstraktionsschicht</div>
                    <div>📁 shared/ - Geteilte TypeScript-Typen</div>
                    <div>  └── schema.ts - Drizzle-Schemas</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Externe Services & APIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Stripe</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Zahlungsabwicklung und Abonnement-Management</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">PostgreSQL</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Hauptdatenbank (Neon DB)</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">OpenAI/Anthropic</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">KI-Features und Bildanalyse</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Brevo/SendGrid</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">E-Mail-Versand und -Marketing</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">DeepAI</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Erweiterte Bildanalyse und KI-Processing</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Google Maps/Mapbox</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Kartendienste und Geolocation</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">GitHub</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Automatische Backups und Versionskontrolle</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">CleverReach</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Newsletter und E-Mail-Marketing</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Notion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Dokumentation und Projektmanagement</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Wichtige Bibliotheken</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline">jsPDF - PDF Generation</Badge>
                    <Badge variant="outline">Winston - Logging</Badge>
                    <Badge variant="outline">Sharp - Bildverarbeitung</Badge>
                    <Badge variant="outline">Multer - File Uploads</Badge>
                    <Badge variant="outline">bcrypt - Passwort Hashing</Badge>
                    <Badge variant="outline">Cron - Scheduled Tasks</Badge>
                    <Badge variant="outline">Helmet - Security Headers</Badge>
                    <Badge variant="outline">Express-Rate-Limit</Badge>
                    <Badge variant="outline">Passport.js - Auth</Badge>
                    <Badge variant="outline">React Query - State</Badge>
                    <Badge variant="outline">Zod - Validation</Badge>
                    <Badge variant="outline">Canvas - Image Processing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup-Anleitung */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Lokale Entwicklungsumgebung</span>
                </CardTitle>
                <CardDescription>
                  Schritt-für-Schritt Anleitung zur Einrichtung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Voraussetzungen</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Node.js 18+ und npm</li>
                    <li>• PostgreSQL-Datenbank (oder Neon DB Account)</li>
                    <li>• Git</li>
                    <li>• Code-Editor (VS Code empfohlen)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Installation</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div># Repository klonen</div>
                    <div>git clone &lt;repository-url&gt;</div>
                    <div>cd bau-structura</div>
                    <div></div>
                    <div># Abhängigkeiten installieren</div>
                    <div>npm install</div>
                    <div></div>
                    <div># Umgebungsvariablen konfigurieren</div>
                    <div>cp .env.example .env</div>
                    <div>nano .env</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Umgebungsvariablen</h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Datenbank</div>
                    <div>DATABASE_URL=postgresql://...</div>
                    <div>SESSION_SECRET=your-session-secret</div>
                    <div></div>
                    <div># Zahlungen</div>
                    <div>STRIPE_SECRET_KEY=sk_test_...</div>
                    <div>VITE_STRIPE_PUBLIC_KEY=pk_test_...</div>
                    <div>STRIPE_PRICE_ID=price_...</div>
                    <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
                    <div></div>
                    <div># KI-Services</div>
                    <div>OPENAI_API_KEY=sk-...</div>
                    <div>ANTHROPIC_API_KEY=sk-ant-...</div>
                    <div>DEEPAI_API_KEY=your-key</div>
                    <div></div>
                    <div># E-Mail Services</div>
                    <div>BREVO_API_KEY=your-key</div>
                    <div>SENDGRID_API_KEY=SG....</div>
                    <div></div>
                    <div># Maps & Location</div>
                    <div>GOOGLE_API_KEY=your-key</div>
                    <div>GOOGLE_MAPS_API_KEY=your-key</div>
                    <div>MAPBOX_ACCESS_TOKEN=pk....</div>
                    <div></div>
                    <div># Marketing</div>
                    <div>CLEVERREACH_CLIENT_ID=your-id</div>
                    <div>CLEVERREACH_CLIENT_SECRET=your-secret</div>
                    <div></div>
                    <div># Backups & Integration</div>
                    <div>GITHUB_TOKEN=ghp_...</div>
                    <div>NOTION_INTEGRATION_SECRET=secret_...</div>
                    <div>NOTION_PAGE_URL=https://notion.so/...</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Entwicklungsserver starten</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div># Datenbank-Schema initialisieren</div>
                    <div>npm run db:push</div>
                    <div></div>
                    <div># Entwicklungsserver starten</div>
                    <div>npm run dev</div>
                    <div></div>
                    <div># Anwendung öffnet sich auf http://localhost:5000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API-Dokumentation */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>REST API Dokumentation</span>
                </CardTitle>
                <CardDescription>
                  Vollständige API-Referenz mit Endpunkten und Authentifizierung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Authentifizierung</h3>
                  <p className="text-gray-600 mb-3">Session-basierte Authentifizierung mit Passport.js</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-green-600">POST /api/login</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">Benutzer-Anmeldung</p>
                        <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                          {`{ "username": "string", "password": "string" }`}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-red-600">POST /api/logout</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Benutzer-Abmeldung</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Hauptendpunkte</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-blue-600 mb-2">Unternehmen (/api/companies)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <Badge variant="outline">GET - Liste</Badge>
                        <Badge variant="outline">POST - Erstellen</Badge>
                        <Badge variant="outline">PUT - Bearbeiten</Badge>
                        <Badge variant="outline">DELETE - Löschen</Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-green-600 mb-2">Projekte (/api/projects)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <Badge variant="outline">GET - Liste</Badge>
                        <Badge variant="outline">POST - Erstellen</Badge>
                        <Badge variant="outline">PUT - Bearbeiten</Badge>
                        <Badge variant="outline">DELETE - Löschen</Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-purple-600 mb-2">Bautagebuch (/api/construction-diary)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <Badge variant="outline">GET - Einträge</Badge>
                        <Badge variant="outline">POST - Eintrag</Badge>
                        <Badge variant="outline">GET - PDF Export</Badge>
                        <Badge variant="outline">POST - Anhänge</Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-amber-600 mb-2">E-Mail Service (/api/email)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <Badge variant="outline">POST - Send</Badge>
                        <Badge variant="outline">GET - Queue</Badge>
                        <Badge variant="outline">GET - Status</Badge>
                        <Badge variant="outline">POST - Bulk</Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-cyan-600 mb-2">Backup & GitHub (/api/backup, /api/github)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <Badge variant="outline">POST - Create</Badge>
                        <Badge variant="outline">GET - Status</Badge>
                        <Badge variant="outline">POST - GitHub Sync</Badge>
                        <Badge variant="outline">GET - History</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Demo- und Testseiten</h3>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-amber-800 mb-2">⚠️ Demo-Routen (für Entwicklung/Tests)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-700">
                      <div>/error-demo/* - Fehlerseiten-Demos</div>
                      <div>/bodenanalyse-test - Bodenanalyse Test</div>
                      <div>/image-optimization - Bildoptimierung Demo</div>
                      <div>/image-optimization-simple - Einfache Demo</div>
                      <div>/construction-diary-debug - Debug-Seite</div>
                      <div>/tiefbau-map-fix/:id - Karten-Reparatur</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">📍 Alternative Karten-Implementierungen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                      <div>/tiefbau-map - Original Karte</div>
                      <div>/tiefbau-map-searchable - Durchsuchbare Version</div>
                      <div>/new-tiefbau-map - Neue Implementierung</div>
                      <div>/simple-tiefbau-map/:id - Vereinfachte Version</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">🔧 Admin & Monitoring Tools</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                      <div>/admin/logs - System-Logs</div>
                      <div>/admin/sql-analytics - SQL-Performance</div>
                      <div>/admin/backup-status - Backup-Status</div>
                      <div>/admin/emails - E-Mail-Queue</div>
                      <div>/admin/users - Benutzerverwaltung</div>
                      <div>/admin/documentation - Diese Dokumentation</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Fehler-Codes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Client-Fehler</h4>
                      <div className="space-y-1 text-sm">
                        <div>400 - Ungültige Anfrage</div>
                        <div>401 - Nicht authentifiziert</div>
                        <div>403 - Keine Berechtigung</div>
                        <div>404 - Nicht gefunden</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Server-Fehler</h4>
                      <div className="space-y-1 text-sm">
                        <div>500 - Interner Serverfehler</div>
                        <div>502 - Gateway-Fehler</div>
                        <div>503 - Service nicht verfügbar</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Datenbank-Schema */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Datenbank-Schema</span>
                </CardTitle>
                <CardDescription>
                  PostgreSQL-Datenbank mit Drizzle ORM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Haupttabellen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">tbluser</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• id (Primary Key)</div>
                          <div>• username, password</div>
                          <div>• email, role</div>
                          <div>• subscription_status</div>
                          <div>• stripe_customer_id</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">tblcompany</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• id (Primary Key)</div>
                          <div>• company_name</div>
                          <div>• address, contact</div>
                          <div>• created_by (FK)</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">tblproject</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• id (Primary Key)</div>
                          <div>• project_name</div>
                          <div>• company_id (FK)</div>
                          <div>• customer_id (FK)</div>
                          <div>• coordinates</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">tblconstruction_diary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• id (Primary Key)</div>
                          <div>• project_id (FK)</div>
                          <div>• date, weather</div>
                          <div>• work_description</div>
                          <div>• attachments</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Beziehungen</h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-1">
                    <div>User → Company (1:n)</div>
                    <div>Company → Project (1:n)</div>
                    <div>Project → Construction_Diary (1:n)</div>
                    <div>Project → Attachments (1:n)</div>
                    <div>User → Subscription (1:1)</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Wichtige Indizes</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary">tbluser.username (UNIQUE)</Badge>
                    <Badge variant="secondary">tblproject.project_name</Badge>
                    <Badge variant="secondary">tblconstruction_diary.date</Badge>
                    <Badge variant="secondary">sessions.expire</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Migrationen</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div># Schema zur Datenbank pushen</div>
                    <div>npm run db:push</div>
                    <div></div>
                    <div># Studio für Datenbank-Verwaltung</div>
                    <div>npm run db:studio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code-Standards */}
          <TabsContent value="standards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Code-Standards & Guidelines</span>
                </CardTitle>
                <CardDescription>
                  Konventionen und Best Practices für das Projekt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Naming Conventions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Frontend</h4>
                      <div className="space-y-1 text-sm">
                        <div>• Komponenten: PascalCase</div>
                        <div>• Hooks: camelCase (use...)</div>
                        <div>• Variablen: camelCase</div>
                        <div>• Dateien: kebab-case</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Backend</h4>
                      <div className="space-y-1 text-sm">
                        <div>• Tabellen: tbl + lowercase</div>
                        <div>• API-Routen: kebab-case</div>
                        <div>• Funktionen: camelCase</div>
                        <div>• Konstanten: UPPER_CASE</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Projektstruktur-Regeln</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Komponenten in eigene Ordner mit index.ts</li>
                    <li>• Shared Types in /shared/schema.ts</li>
                    <li>• API-Logik in /server/routes.ts</li>
                    <li>• Utilities in /lib/-Ordnern</li>
                    <li>• Tests neben den zu testenden Dateien</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">TypeScript Guidelines</h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-1">
                    <div>// Strenge TypeScript-Konfiguration</div>
                    <div>// Keine any-Typen ohne Begründung</div>
                    <div>// Zod für Runtime-Validierung</div>
                    <div>// Drizzle-Schemas für Typen nutzen</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Git Workflow</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary">main - Produktion</Badge>
                    <Badge variant="secondary">develop - Development</Badge>
                    <Badge variant="secondary">feature/ - Features</Badge>
                    <Badge variant="secondary">fix/ - Bugfixes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Testing Strategy</span>
                </CardTitle>
                <CardDescription>
                  Test-Framework und Ausführung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Test-Framework</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary">Jest - Unit Tests</Badge>
                    <Badge variant="secondary">React Testing Library</Badge>
                    <Badge variant="secondary">Supertest - API Tests</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Test-Befehle</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div># Alle Tests ausführen</div>
                    <div>npm test</div>
                    <div></div>
                    <div># Tests im Watch-Modus</div>
                    <div>npm run test:watch</div>
                    <div></div>
                    <div># Coverage-Report</div>
                    <div>npm run test:coverage</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Test-Kategorien</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Unit Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Einzelne Funktionen und Komponenten</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Integration Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">API-Endpunkte und Datenbankinteraktionen</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">E2E Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Vollständige Benutzer-Workflows</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5" />
                  <span>Deployment & Hosting</span>
                </CardTitle>
                <CardDescription>
                  Produktions-Deployment auf Replit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Replit Deployment</h3>
                  <p className="text-gray-600 mb-4">Die Anwendung läuft auf Replit mit automatischem Hosting und SSL.</p>
                  
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Produktions-URL</span>
                    </div>
                    <p className="text-green-700">https://bau-structura.replit.app</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Umgebungen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-blue-600">Development</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• Lokale Entwicklung</div>
                          <div>• Hot Reload</div>
                          <div>• Debug-Modi aktiv</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-green-600">Production</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• Optimierte Builds</div>
                          <div>• SSL/HTTPS</div>
                          <div>• Performance-Monitoring</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Build-Prozess</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div># Frontend Build</div>
                    <div>npm run build</div>
                    <div></div>
                    <div># TypeScript Kompilierung</div>
                    <div>npm run build:server</div>
                    <div></div>
                    <div># Produktions-Start</div>
                    <div>npm start</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Monitoring</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Automatische Gesundheitschecks</li>
                    <li>• Performance-Metriken</li>
                    <li>• Error-Logging mit Winston</li>
                    <li>• Uptime-Monitoring</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sicherheit */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Sicherheitskonzept</span>
                </CardTitle>
                <CardDescription>
                  Sicherheitsmaßnahmen und Best Practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Authentifizierung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Session-Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• Sichere Session-Cookies</div>
                          <div>• Automatisches Ablaufen</div>
                          <div>• PostgreSQL Session Store</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Passwort-Sicherheit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-1">
                          <div>• bcrypt Hashing</div>
                          <div>• Salt-Rounds: 12</div>
                          <div>• Passwort-Richtlinien</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Datenschutz (DSGVO)</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Explizite Einwilligung erforderlich</li>
                    <li>• Datenminimierung implementiert</li>
                    <li>• Löschrecht für Benutzer</li>
                    <li>• Datenexport-Funktionen</li>
                    <li>• Privacy-by-Design Prinzipien</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">API-Sicherheit</h3>
                  <div className="space-y-2">
                    <Badge variant="secondary">Rate Limiting</Badge>
                    <Badge variant="secondary">Input Validation</Badge>
                    <Badge variant="secondary">SQL Injection Schutz</Badge>
                    <Badge variant="secondary">XSS Prevention</Badge>
                    <Badge variant="secondary">CORS Konfiguration</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Umgebungsvariablen</h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Wichtiger Hinweis</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Alle sensiblen Daten (API-Keys, Passwörter, etc.) werden als Umgebungsvariablen gespeichert 
                      und niemals im Code committet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}