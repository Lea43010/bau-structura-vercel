import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Download, FileText, Users, Shield, Monitor } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";

export default function TestingGuidePage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generateTestingPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // PDF generation logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const testScenarios = [
    {
      category: "Benutzeroberfläche",
      icon: <Monitor className="h-4 w-4" />,
      color: "blue",
      tests: [
        { name: "Navigation und Menüs", status: "✓ Kritisch" },
        { name: "Responsive Design", status: "✓ Wichtig" },
        { name: "Formular-Validierung", status: "✓ Kritisch" }
      ]
    },
    {
      category: "Sicherheit",
      icon: <Shield className="h-4 w-4" />,
      color: "red", 
      tests: [
        { name: "Authentifizierung", status: "✓ Kritisch" },
        { name: "Autorisierung", status: "✓ Kritisch" },
        { name: "Datenschutz", status: "✓ Wichtig" }
      ]
    },
    {
      category: "Funktionalität",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "green",
      tests: [
        { name: "CRUD-Operationen", status: "✓ Kritisch" },
        { name: "Datenintegrität", status: "✓ Kritisch" },
        { name: "API-Integration", status: "✓ Wichtig" }
      ]
    }
  ];

  return (
    <DashboardLayout 
      title="End-to-End Testing Guide" 
      description="Umfassender Leitfaden für das Testen aller Anwendungsfunktionen"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mt-2">Umfassende Testanleitung für Bau-Structura</p>
          </div>
          <Button 
            onClick={generateTestingPDF}
            disabled={isGeneratingPDF}
            className="flex items-center space-x-2"
          >
            {isGeneratingPDF ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Erstelle PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>PDF herunterladen</span>
              </>
            )}
          </Button>
        </div>

        {/* Test Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Test-Szenarien</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {testScenarios.reduce((total, category) => total + category.tests.length, 0)}
              </div>
              <p className="text-sm text-gray-600">Gesamt-Tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Kategorien</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testScenarios.length}</div>
              <p className="text-sm text-gray-600">Test-Bereiche</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span>Dokumentation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-sm text-gray-600">Abdeckung</p>
            </CardContent>
          </Card>
        </div>

        {/* Test Categories */}
        <div className="space-y-6">
          {testScenarios.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {category.icon}
                  <span>{category.category}</span>
                  <Badge variant="outline">{category.tests.length} Tests</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tests.map((test, testIndex) => (
                    <div key={testIndex} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{test.status}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Wichtige Hinweise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Wichtige Hinweise:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Testen Sie immer mit echten Daten, keine Dummy-Daten verwenden</li>
                <li>• Bei Fehlern: Browser-Konsole, Netzwerk-Tab und Screenshots dokumentieren</li>
                <li>• Performance-Tests bei größeren Datenmengen durchführen</li>
                <li>• Sicherheitstests nur in der Test-Umgebung durchführen</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}