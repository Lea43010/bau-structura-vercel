import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileText, 
  Users, 
  Building2, 
  MapPin, 
  Calculator, 
  Settings, 
  Shield, 
  Database,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/dashboard-layout';

interface PageInfo {
  id: string;
  name: string;
  route: string;
  category: string;
  status: 'completed' | 'in-progress' | 'needs-update';
  description: string;
  features: string[];
  lastUpdated: string;
  icon: React.ReactNode;
  screenshots?: string[];
}

const statusIcons = {
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  'in-progress': <Clock className="h-4 w-4 text-yellow-500" />,
  'needs-update': <AlertCircle className="h-4 w-4 text-red-500" />
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'needs-update': 'bg-red-100 text-red-800'
};

const allPages: PageInfo[] = [
  // Hauptanwendung
  {
    id: 'home',
    name: 'Dashboard / Startseite',
    route: '/',
    category: 'main',
    status: 'completed',
    description: 'Zentrale Übersichtsseite mit Projekt-Statistiken, aktuellen Aktivitäten und Schnellzugriffen',
    features: ['Projekt-Übersicht', 'Aktivitäts-Feed', 'Schnellzugriffe', 'Benutzer-Begrüßung'],
    lastUpdated: '2025-05-25',
    icon: <FileText className="h-4 w-4" />
  },
  
  // Unternehmen & Kunden
  {
    id: 'companies',
    name: 'Unternehmen',
    route: '/companies',
    category: 'business',
    status: 'completed',
    description: 'Moderne Unternehmens-Verwaltung mit Karten-Layout und erweiterten Funktionen',
    features: ['CRUD-Operationen', 'Suchfunktion', 'Filterung', 'Responsive Design', 'Export-Funktionen'],
    lastUpdated: '2025-05-25',
    icon: <Building2 className="h-4 w-4" />
  },
  {
    id: 'customers',
    name: 'Kunden',
    route: '/customers',
    category: 'business',
    status: 'completed',
    description: 'Kunden-Management mit detaillierter Kontaktverwaltung und Projektverknüpfung',
    features: ['Kontaktdaten-Management', 'Projekt-Zuordnung', 'Aktivitäts-Tracking', 'Export-Funktionen'],
    lastUpdated: '2025-05-25',
    icon: <Users className="h-4 w-4" />
  },
  
  // Projekte
  {
    id: 'projects',
    name: 'Projekte',
    route: '/projects',
    category: 'projects',
    status: 'completed',
    description: 'Umfassende Projektverwaltung mit Geo-Mapping und Tiefbau-Funktionen',
    features: ['Projekt-CRUD', 'Geo-Lokalisierung', 'Baustellenstraße-Management', 'Tiefbau-Integration', 'PDF-Export'],
    lastUpdated: '2025-05-25',
    icon: <MapPin className="h-4 w-4" />
  },
  {
    id: 'geo-map',
    name: 'Geo-Karte',
    route: '/geo-map',
    category: 'projects',
    status: 'completed',
    description: 'Interaktive Leaflet-Karte mit Projekt-Markierungen und BayernAtlas-Integration',
    features: ['Leaflet-Karte', 'Projekt-Marker', 'BayernAtlas-Integration', 'Koordinaten-Verwaltung'],
    lastUpdated: '2025-05-25',
    icon: <MapPin className="h-4 w-4" />
  },
  
  // Kostenkalkulation
  {
    id: 'cost-calculation',
    name: 'Kostenkalkulation',
    route: '/cost-calculation',
    category: 'calculation',
    status: 'completed',
    description: 'Detaillierte Kostenkalkulation für Bauprojekte mit Routen- und Materialverwaltung',
    features: ['Routen-Management', 'Kostenberechnung', 'Material-Kalkulation', 'PDF-Export', 'Benutzer-Autorisierung'],
    lastUpdated: '2025-05-25',
    icon: <Calculator className="h-4 w-4" />
  },
  
  // Dokumente
  {
    id: 'documents',
    name: 'Dokumente',
    route: '/documents',
    category: 'documents',
    status: 'completed',
    description: 'Moderne Dokumentenverwaltung mit Upload, Kategorisierung und Volltextsuche',
    features: ['Datei-Upload', 'Kategorisierung', 'Volltextsuche', 'Vorschau', 'Versionierung', 'Zugriffsrechte'],
    lastUpdated: '2025-05-25',
    icon: <FileText className="h-4 w-4" />
  },
  
  // Datenqualität
  {
    id: 'data-quality',
    name: 'Datenqualität',
    route: '/data-quality',
    category: 'quality',
    status: 'completed',
    description: 'Automatische Datenqualitätsprüfung mit Berichten und Empfehlungen',
    features: ['Qualitätsprüfung', 'Berichte generieren', 'Probleme identifizieren', 'Verbesserungsvorschläge'],
    lastUpdated: '2025-05-25',
    icon: <Database className="h-4 w-4" />
  },
  
  // Admin-Bereich
  {
    id: 'user-management',
    name: 'Benutzerverwaltung (Modern)',
    route: '/admin/modern-users',
    category: 'admin',
    status: 'completed',
    description: 'Moderne Benutzerverwaltung mit Abonnement-Status und erweiterten Filterfunktionen',
    features: ['Benutzer-CRUD', 'Rollen-Management', 'Abonnement-Status', 'Aktivitäts-Tracking', 'Filter & Suche'],
    lastUpdated: '2025-05-25',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'settings',
    name: 'Einstellungen',
    route: '/settings',
    category: 'admin',
    status: 'completed',
    description: 'Systemeinstellungen mit Sicherheits-, Backup- und Benachrichtigungsoptionen',
    features: ['Profil-Management', 'Sicherheitseinstellungen', 'Backup-Verwaltung', 'E-Mail-Konfiguration'],
    lastUpdated: '2025-05-25',
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 'privacy-policy',
    name: 'Datenschutzerklärung',
    route: '/privacy-policy',
    category: 'legal',
    status: 'completed',
    description: 'DSGVO-konforme Datenschutzerklärung mit moderner UI',
    features: ['DSGVO-Konformität', 'Mehrere Zugriffswege', 'Responsive Design', 'Strukturierte Inhalte'],
    lastUpdated: '2025-05-25',
    icon: <Shield className="h-4 w-4" />
  },
  
  // Authentifizierung
  {
    id: 'login',
    name: 'Anmeldung',
    route: '/login',
    category: 'auth',
    status: 'completed',
    description: 'Sichere Benutzeranmeldung mit bcrypt-Verschlüsselung',
    features: ['Passwort-Verschlüsselung', 'Session-Management', 'Fehlbehandlung', 'Responsive Design'],
    lastUpdated: '2025-05-25',
    icon: <Shield className="h-4 w-4" />
  }
];

const categories = {
  main: 'Hauptanwendung',
  business: 'Unternehmen & Kunden',
  projects: 'Projekte & Karten',
  calculation: 'Kalkulation',
  documents: 'Dokumente',
  quality: 'Datenqualität',
  admin: 'Administration',
  legal: 'Rechtliches',
  auth: 'Authentifizierung'
};

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPages = allPages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusCount = (status: string) => {
    return allPages.filter(page => page.status === status).length;
  };

  const getCategoryCount = (category: string) => {
    return allPages.filter(page => page.category === category).length;
  };

  return (
    <DashboardLayout 
      title="System-Dokumentation" 
      description="Übersicht aller implementierten Seiten und Features"
    >
      <div className="space-y-6">
        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{allPages.length}</p>
                  <p className="text-sm text-gray-600">Gesamt Seiten</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{getStatusCount('completed')}</p>
                  <p className="text-sm text-gray-600">Abgeschlossen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{getStatusCount('in-progress')}</p>
                  <p className="text-sm text-gray-600">In Bearbeitung</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{getStatusCount('needs-update')}</p>
                  <p className="text-sm text-gray-600">Benötigt Update</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suche und Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Seiten, Features oder Beschreibungen durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Alle ({allPages.length})
                </button>
                {Object.entries(categories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedCategory === key
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {label} ({getCategoryCount(key)})
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seiten-Liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {page.icon}
                    <CardTitle className="text-lg">{page.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {statusIcons[page.status]}
                    <Badge className={statusColors[page.status]}>
                      {page.status === 'completed' ? 'Fertig' : 
                       page.status === 'in-progress' ? 'In Arbeit' : 'Update nötig'}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {page.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {categories[page.category as keyof typeof categories]}
                    </Badge>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Route: {page.route}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 p-1"
                        onClick={() => window.open(page.route, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {page.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {page.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{page.features.length - 3} weitere
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Zuletzt aktualisiert: {page.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Keine Seiten gefunden
              </h3>
              <p className="text-gray-500">
                Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}