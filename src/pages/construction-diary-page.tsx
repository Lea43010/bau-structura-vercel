import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Clock, FileText } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { useQuery } from '@tanstack/react-query';

export default function ConstructionDiaryPage() {
  // Projekte für Dropdown laden
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  return (
    <DashboardLayout title="Bautagebuch">
      <div className="space-y-8">
        {/* Header mit Gradient Background */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Bautagebuch</h1>
                <Calendar className="h-8 w-8" />
              </div>
              <p className="text-purple-100 text-lg max-w-2xl">
                Dokumentieren Sie täglich alle Bauaktivitäten, Arbeitszeiten und wichtige Ereignisse auf der Baustelle.
              </p>
            </div>
            <Link href="/projects">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zu den Projekten
              </Button>
            </Link>
          </div>
        </div>

        {/* Projekt auswählen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Projekt für Bautagebuch auswählen
            </CardTitle>
            <CardDescription>
              Wählen Sie ein Projekt aus, um das zugehörige Bautagebuch zu verwalten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project: any) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-purple-300">
                    <CardContent className="p-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{project.projectName}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            {project.customer && (
                              <p><strong>Kunde:</strong> {project.customer}</p>
                            )}
                            {project.projectLocation && (
                              <p><strong>Standort:</strong> {project.projectLocation}</p>
                            )}
                            {project.startDate && (
                              <p><strong>Beginn:</strong> {new Date(project.startDate).toLocaleDateString('de-DE')}</p>
                            )}
                          </div>
                          <Link href={`/projects/${project.id}?tab=diary`}>
                            <Button 
                              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Bautagebuch öffnen
                            </Button>
                          </Link>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Projekte gefunden</h3>
                <p className="text-gray-600 mb-4">
                  Sie benötigen mindestens ein Projekt, um ein Bautagebuch zu führen.
                </p>
                <Link href="/projects">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Neues Projekt erstellen
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold">Arbeitszeiten</h3>
              </div>
              <p className="text-sm text-gray-600">
                Erfassen Sie täglich Beginn und Ende der Arbeitszeiten für alle Mitarbeiter.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold">Mitarbeiter</h3>
              </div>
              <p className="text-sm text-gray-600">
                Dokumentieren Sie, welche Mitarbeiter an welchen Tätigkeiten beteiligt waren.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold">Dokumentation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Halten Sie wichtige Ereignisse, Materialverbrauch und Besonderheiten fest.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}