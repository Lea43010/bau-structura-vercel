import React, { useState } from 'react';
import { Target, Calendar, Users, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function MilestonesPage() {
  // Projekte für Dropdown laden
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Meilensteine für ausgewähltes Projekt laden
  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: [`/api/projects/${selectedProjectId}/milestones`],
    enabled: !!selectedProjectId,
  });

  const getMilestoneProgress = (milestone: any) => {
    // Vereinfachte Fortschrittsberechnung
    if (milestone.status === 'completed') return 100;
    if (milestone.status === 'in_progress') return 50;
    if (milestone.status === 'planned') return 0;
    return 25;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'in_progress': return 'In Bearbeitung';
      case 'planned': return 'Geplant';
      case 'delayed': return 'Verzögert';
      default: return 'Unbekannt';
    }
  };

  return (
    <DashboardLayout
      title="Meilensteine"
      description="Projektmeilensteine und Kapazitätsplanung verwalten"
    >
      <div className="space-y-6">
        {/* Header mit Projektauswahl */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Meilensteine verwalten
            </CardTitle>
            <CardDescription>
              Wählen Sie ein Projekt aus, um dessen Meilensteine anzuzeigen und zu verwalten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={selectedProjectId?.toString() || ""}
                  onValueChange={(value) => setSelectedProjectId(value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Projekt auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project: any) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.projectName || `Projekt ${project.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedProjectId && (
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Meilenstein
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meilensteine anzeigen */}
        {selectedProjectId ? (
          milestonesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Meilensteine werden geladen...</p>
            </div>
          ) : milestones && milestones.length > 0 ? (
            <div className="grid gap-4">
              {milestones.map((milestone: any) => (
                <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {milestone.name || `Meilenstein ${milestone.id}`}
                          </h3>
                          <Badge className={getStatusColor(milestone.status)}>
                            {getStatusText(milestone.status)}
                          </Badge>
                        </div>
                        
                        {milestone.description && (
                          <p className="text-gray-600 mb-3">{milestone.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {milestone.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Fällig: {new Date(milestone.dueDate).toLocaleDateString('de-DE')}</span>
                            </div>
                          )}
                          {milestone.assignedTo && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>Verantwortlich: {milestone.assignedTo}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Fortschrittsbalken */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Fortschritt</span>
                            <span>{getMilestoneProgress(milestone)}%</span>
                          </div>
                          <Progress value={getMilestoneProgress(milestone)} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                        <Link href={`/projects/${selectedProjectId}`}>
                          <Button variant="ghost" size="sm">
                            Zum Projekt
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Noch keine Meilensteine vorhanden
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Erstellen Sie den ersten Meilenstein für dieses Projekt.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Ersten Meilenstein erstellen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Projekt auswählen
                </h3>
                <p className="text-gray-500">
                  Wählen Sie oben ein Projekt aus, um dessen Meilensteine anzuzeigen.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schnellzugriff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/projects">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zur Projektverwaltung
                </Button>
              </Link>
              <Link href="/construction-diary">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Zum Bautagebuch
                </Button>
              </Link>
              <Link href="/tiefbau-map">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Zur Tiefbau-Planung
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}