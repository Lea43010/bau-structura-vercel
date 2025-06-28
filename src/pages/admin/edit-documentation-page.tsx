import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Layout wird inline definiert

interface PageInfo {
  id: string;
  title: string;
  description: string;
  route: string;
  category: string;
  status: string;
  features: string[];
  lastUpdated: string;
  technicalNotes?: string;
}

const categories = {
  main: 'Hauptfunktionen',
  business: 'Geschäftsobjekte',
  projects: 'Projektmanagement',
  calculation: 'Kalkulation',
  documents: 'Dokumentenverwaltung',
  quality: 'Datenqualität',
  admin: 'Administration',
  legal: 'Rechtliches',
  auth: 'Authentifizierung'
};

const statusOptions = [
  { value: 'finished', label: 'Fertiggestellt', color: 'bg-green-100 text-green-800' },
  { value: 'in-progress', label: 'In Bearbeitung', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'needs-update', label: 'Aktualisierung erforderlich', color: 'bg-red-100 text-red-800' }
];

export default function EditDocumentationPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/admin/documentation/edit/:pageId');
  const { toast } = useToast();
  
  const [pageData, setPageData] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Definiere alle Seiten (gleiche Daten wie in der Hauptdokumentation)
  const allPages: PageInfo[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Zentrale Übersichtsseite mit wichtigen Kennzahlen und schnellem Zugriff auf Hauptfunktionen',
      route: '/',
      category: 'main',
      status: 'finished',
      features: ['Benutzer-Begrüßung', 'Schnellzugriff-Buttons', 'Responsive Design'],
      lastUpdated: '2024-11-15'
    },
    {
      id: 'companies',
      title: 'Unternehmensverwaltung',
      description: 'Verwaltung von Firmendaten, Kontaktinformationen und Geschäftsbeziehungen',
      route: '/companies',
      category: 'business',
      status: 'finished',
      features: ['CRUD-Operationen', 'Suchfunktion', 'Datenexport', 'Validierung'],
      lastUpdated: '2024-11-20'
    },
    {
      id: 'customers',
      title: 'Kundenverwaltung',
      description: 'Zentrale Verwaltung aller Kundendaten mit erweiterten Such- und Filterfunktionen',
      route: '/customers',
      category: 'business',
      status: 'finished',
      features: ['Kundendaten-CRUD', 'Erweiterte Suche', 'Kategorisierung', 'Kontakthistorie'],
      lastUpdated: '2024-11-18'
    },
    {
      id: 'projects',
      title: 'Projektverwaltung',
      description: 'Umfassende Projektplanung und -verfolgung mit Milestone-Management',
      route: '/projects',
      category: 'projects',
      status: 'finished',
      features: ['Projektplanung', 'Milestone-Tracking', 'Ressourcenverwaltung', 'Fortschrittsverfolgung'],
      lastUpdated: '2024-11-22'
    },
    {
      id: 'construction-diary',
      title: 'Bautagebuch',
      description: 'Digitales Bautagebuch mit täglichen Einträgen, Wetteraufzeichnung und Fortschrittsdokumentation',
      route: '/construction-diary',
      category: 'projects',
      status: 'finished',
      features: ['Tägliche Einträge', 'Wetteraufzeichnung', 'Mitarbeiter-Tracking', 'PDF-Export'],
      lastUpdated: '2024-11-25'
    },
    {
      id: 'geo-map',
      title: 'Geokarte',
      description: 'Interaktive Karte mit Projektstandorten und geografischen Analysefunktionen',
      route: '/geo-map',
      category: 'projects',
      status: 'finished',
      features: ['Interaktive Karte', 'Projektmarkierungen', 'Layering', 'GPS-Integration'],
      lastUpdated: '2024-11-10'
    },
    {
      id: 'cost-calculation',
      title: 'Kostenkalkulation',
      description: 'Detaillierte Kostenplanung und -verfolgung für Bauprojekte',
      route: '/kostenkalkulation',
      category: 'calculation',
      status: 'finished',
      features: ['Kostenplanung', 'Materialberechnung', 'Arbeitszeit-Kalkulation', 'Preishistorie'],
      lastUpdated: '2024-11-12'
    },
    {
      id: 'documents',
      title: 'Dokumentenverwaltung',
      description: 'Zentrale Verwaltung aller projektbezogenen Dokumente mit Versionskontrolle',
      route: '/documents',
      category: 'documents',
      status: 'finished',
      features: ['Dateien-Upload', 'Versionskontrolle', 'Kategorisierung', 'Suchfunktion'],
      lastUpdated: '2024-11-14'
    },
    {
      id: 'data-quality',
      title: 'Datenqualität',
      description: 'Überwachung und Verbesserung der Datenqualität mit automatischen Prüfungen',
      route: '/data-quality',
      category: 'quality',
      status: 'finished',
      features: ['Automatische Prüfungen', 'Qualitäts-Reports', 'Bereinigungsvorschläge'],
      lastUpdated: '2024-11-08'
    },
    {
      id: 'user-management',
      title: 'Benutzerverwaltung',
      description: 'Administration von Benutzerkonten, Rollen und Berechtigungen',
      route: '/admin/modern-users',
      category: 'admin',
      status: 'finished',
      features: ['Benutzerverwaltung', 'Rollenvergabe', 'Berechtigungen', 'Aktivitätsprotokolle'],
      lastUpdated: '2024-11-23'
    },
    {
      id: 'privacy-policy',
      title: 'Datenschutzerklärung',
      description: 'DSGVO-konforme Datenschutzerklärung mit allen erforderlichen Informationen',
      route: '/privacy-policy',
      category: 'legal',
      status: 'finished',
      features: ['DSGVO-Konformität', 'Benutzerrechte', 'Datenverarbeitung', 'Kontaktinformationen'],
      lastUpdated: '2024-11-05'
    }
  ];

  useEffect(() => {
    if (params?.pageId) {
      const page = allPages.find(p => p.id === params.pageId);
      if (page) {
        setPageData({ ...page });
      } else {
        toast({
          title: "Fehler",
          description: "Seite nicht gefunden",
          variant: "destructive"
        });
        setLocation('/admin/documentation');
      }
    }
    setLoading(false);
  }, [params?.pageId]);

  const handleSave = () => {
    if (!pageData) return;
    
    // Hier würde normalerweise eine API-Anfrage erfolgen
    toast({
      title: "Erfolgreich gespeichert",
      description: `Dokumentation für "${pageData.title}" wurde aktualisiert.`
    });
    
    setLocation('/admin/documentation');
  };

  const handleStatusChange = (newStatus: string) => {
    if (pageData) {
      setPageData({ ...pageData, status: newStatus });
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    if (pageData) {
      setPageData({ ...pageData, category: newCategory });
    }
  };

  const addFeature = () => {
    if (pageData) {
      setPageData({ 
        ...pageData, 
        features: [...pageData.features, 'Neue Funktion'] 
      });
    }
  };

  const updateFeature = (index: number, value: string) => {
    if (pageData) {
      const newFeatures = [...pageData.features];
      newFeatures[index] = value;
      setPageData({ ...pageData, features: newFeatures });
    }
  };

  const removeFeature = (index: number) => {
    if (pageData) {
      setPageData({ 
        ...pageData, 
        features: pageData.features.filter((_, i) => i !== index) 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600">Seite nicht gefunden</h2>
          <Button onClick={() => setLocation('/admin/documentation')} className="mt-4">
            Zurück zur Dokumentation
          </Button>
        </div>
      </div>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === pageData.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/admin/documentation')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Zurück</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dokumentation bearbeiten</h1>
              <p className="text-gray-600">Bearbeiten Sie die Dokumentation für: {pageData.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => window.open(pageData.route, '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Seite öffnen</span>
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Speichern</span>
            </Button>
          </div>
        </div>

        {/* Bearbeitungsformular */}
        <Card>
          <CardHeader>
            <CardTitle>Grundinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Titel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel
              </label>
              <Input
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                placeholder="Seitentitel eingeben"
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <Textarea
                value={pageData.description}
                onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                placeholder="Beschreibung der Seite eingeben"
                rows={3}
              />
            </div>

            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route
              </label>
              <Input
                value={pageData.route}
                onChange={(e) => setPageData({ ...pageData, route: e.target.value })}
                placeholder="/pfad/zur/seite"
              />
            </div>

            {/* Kategorie und Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <Select value={pageData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select value={pageData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Aktuelle Status-Anzeige */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aktueller Status
              </label>
              {currentStatus && (
                <Badge className={currentStatus.color}>
                  {currentStatus.label}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Funktionen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pageData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Funktionsbeschreibung"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  Entfernen
                </Button>
              </div>
            ))}
            
            <Button variant="outline" onClick={addFeature}>
              Funktion hinzufügen
            </Button>
          </CardContent>
        </Card>

        {/* Technische Notizen */}
        <Card>
          <CardHeader>
            <CardTitle>Technische Notizen</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={pageData.technicalNotes || ''}
              onChange={(e) => setPageData({ ...pageData, technicalNotes: e.target.value })}
              placeholder="Technische Details, Implementierungshinweise, bekannte Probleme..."
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}