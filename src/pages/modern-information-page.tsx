import React, { useState } from "react";
import { ArrowLeft, BookOpen, Shield, Database, Settings, ExternalLink, Download, Search, HelpCircle, FileText, Users, Zap, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layouts/dashboard-layout";

const helpCategories = [
  {
    id: "getting-started",
    title: "Erste Schritte",
    icon: Zap,
    description: "Grundlagen und Einstieg in die Anwendung",
    color: "bg-blue-500",
    items: [
      { title: "Dashboard-Übersicht", description: "Navigation und Hauptfunktionen verstehen" },
      { title: "Erstes Projekt anlegen", description: "Schritt-für-Schritt Anleitung" },
      { title: "Benutzeroberfläche", description: "Elemente und Bedienung kennenlernen" },
      { title: "Mobile Nutzung", description: "App auf Tablet und Smartphone verwenden" }
    ]
  },
  {
    id: "project-management",
    title: "Projektverwaltung",
    icon: BookOpen,
    description: "Projekte erstellen, bearbeiten und verwalten",
    color: "bg-purple-500",
    items: [
      { title: "Projekte erstellen", description: "Neue Bauprojekte anlegen und konfigurieren" },
      { title: "Zeitplanung", description: "Meilensteine und Termine verwalten" },
      { title: "Bautagebuch führen", description: "Tägliche Einträge und Dokumentation" },
      { title: "Anhänge verwalten", description: "Dokumente und Bilder organisieren" }
    ]
  },
  {
    id: "data-analysis",
    title: "Datenanalyse",
    icon: Database,
    description: "Oberflächenanalyse und Bodenuntersuchung",
    color: "bg-green-500",
    items: [
      { title: "Oberflächenanalyse", description: "KI-gestützte Analyse von Straßenoberflächen" },
      { title: "Bodenklassifikation", description: "Automatische Bodenarten-Erkennung" },
      { title: "Belastungsklassen", description: "Straßenbeanspruchung bewerten" },
      { title: "Qualitätsberichte", description: "Detaillierte Analyseergebnisse" }
    ]
  },
  {
    id: "administration",
    title: "Administration",
    icon: Settings,
    description: "Systemverwaltung und Benutzerrechte",
    color: "bg-orange-500",
    items: [
      { title: "Benutzerverwaltung", description: "Nutzer hinzufügen und Rollen zuweisen" },
      { title: "Berechtigungen", description: "Zugriffskontrolle und Sicherheit" },
      { title: "Abonnements", description: "Pläne und Zahlungen verwalten" },
      { title: "Systemeinstellungen", description: "Konfiguration und Anpassungen" }
    ]
  },
  {
    id: "security",
    title: "Sicherheit & Datenschutz",
    icon: Shield,
    description: "Datenschutz, Sicherheit und Compliance",
    color: "bg-red-500",
    items: [
      { title: "DSGVO-Compliance", description: "Datenschutzbestimmungen und Rechte" },
      { title: "Datensicherheit", description: "Verschlüsselung und sichere Übertragung" },
      { title: "Backup & Recovery", description: "Datensicherung und Wiederherstellung" },
      { title: "Audit-Protokolle", description: "Nachverfolgung von Systemaktivitäten" }
    ]
  },
  {
    id: "external-services",
    title: "Externe Dienste",
    icon: Globe,
    description: "Integration mit externen Systemen",
    color: "bg-teal-500",
    items: [
      { title: "Kartendienste", description: "Google Maps und Mapbox Integration" },
      { title: "KI-Services", description: "OpenAI und DeepAI Funktionen" },
      { title: "E-Mail-Versand", description: "Brevo und SendGrid Konfiguration" },
      { title: "Zahlungsabwicklung", description: "Stripe Payment Integration" }
    ]
  }
];

const quickActions = [
  {
    title: "Benutzerhandbuch",
    description: "Vollständige Dokumentation",
    icon: FileText,
    action: "manual",
    color: "bg-blue-500"
  },
  {
    title: "Video-Tutorials",
    description: "Schritt-für-Schritt Anleitungen",
    icon: Users,
    action: "videos",
    color: "bg-purple-500"
  },
  {
    title: "Technische Dokumentation",
    description: "API und Entwicklerinfos",
    icon: Settings,
    action: "tech-docs",
    color: "bg-green-500"
  },
  {
    title: "Support kontaktieren",
    description: "Direkter Kontakt zum Support-Team",
    icon: HelpCircle,
    action: "support",
    color: "bg-orange-500"
  }
];

export default function ModernInformationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Navigation function to handle clicks on help items
  const handleItemClick = (categoryId: string, itemTitle: string) => {
    // Map help items to actual app routes
    const routeMap: { [key: string]: string } = {
      // Project Management routes
      "Projekte erstellen": "/projects",
      "Zeitplanung": "/projects",
      "Bautagebuch führen": "/construction-diary",
      "Anhänge verwalten": "/attachments",
      
      // Data Analysis routes
      "Oberflächenanalyse": "/boden-analyse",
      "Bodenklassifikation": "/boden-analyse",
      "Belastungsklassen": "/tiefbau-map",
      "Qualitätsberichte": "/modern-data-quality",
      
      // Administration routes
      "Benutzerverwaltung": "/admin/modern-users",
      "Berechtigungen": "/admin/modern-users",
      "Abonnements": "/subscription",
      "Systemeinstellungen": "/settings",
      
      // Security routes
      "DSGVO-Compliance": "/datenschutz",
      "Datensicherheit": "/settings",
      "Backup & Recovery": "/admin/backup-status",
      "Audit-Protokolle": "/admin/system-logs",
      
      // External Services routes
      "Kartendienste": "/tiefbau-map",
      "KI-Services": "/boden-analyse",
      "E-Mail-Versand": "/settings",
      "Zahlungsabwicklung": "/subscription"
    };

    const route = routeMap[itemTitle];
    if (route) {
      window.location.href = route;
    }
  };

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DashboardLayout title="Hilfe & Information">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Suche in Hilfe & Info..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.action} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Help Categories */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hilfe-Kategorien</h2>
              <p className="text-gray-600">Wählen Sie einen Bereich aus, um detaillierte Informationen zu erhalten</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={category.id} 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md overflow-hidden"
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className={`${category.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {category.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    {selectedCategory === category.id && (
                      <CardContent className="pt-0 border-t border-gray-100">
                        <div className="space-y-3">
                          {category.items.map((item, index) => (
                            <div 
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleItemClick(category.id, item.title)}
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm hover:text-blue-600 transition-colors">{item.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Benötigen Sie weitere Hilfe?</h3>
              <p className="text-blue-100 mb-6">
                Unser Support-Team steht Ihnen jederzeit zur Verfügung. Kontaktieren Sie uns bei Fragen oder Problemen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3"
                  onClick={() => window.location.href = '/admin/developer-documentation'}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Entwickler-Dokumentation
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3"
                  onClick={() => window.location.href = '/admin/testing-guide'}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Testing-Anleitung
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}