import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Map as MapIcon, MapPin, Database } from 'lucide-react';
import MapContainer from '@/components/maps/map-container';
import MapActions from '@/components/maps/map-actions';

// Vereinfachte Version der Tiefbau-Map mit korrigierter Layout-Struktur
const SimpleTiefbauMap: React.FC = () => {
  // Projekt-ID aus der URL
  const params = useParams();
  const projectId = params.id ? parseInt(params.id) : undefined;
  
  // Google Maps Instanz
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  // Projekt-Daten laden
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  // Standard-Kartenzentrum für Deutschland
  const defaultMapCenter = { lat: 51.1657, lng: 10.4515 };
  
  // Kartenzentrum basierend auf Projektdaten
  const mapCenter = project?.latitude && project?.longitude
    ? { lat: project.latitude, lng: project.longitude }
    : defaultMapCenter;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">
        {projectLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Projekt wird geladen...
          </div>
        ) : projectError ? (
          <div className="text-red-500">Fehler beim Laden des Projekts</div>
        ) : (
          <>
            <MapIcon className="inline-block mr-2 h-6 w-6" />
            Tiefbau-Karte: {project?.name || 'Unbenanntes Projekt'}
          </>
        )}
      </h1>
      
      <Separator className="my-4" />
      
      {/* Hauptinhalt mit optimierter Layout-Struktur */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Linke Spalte: Projektinformationen */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Projektinformationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : projectError ? (
                <div className="text-red-500">
                  Fehler beim Laden der Projektdaten
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>Projekt:</strong> {project?.name}</p>
                  <p><strong>Kunde:</strong> {project?.customerName}</p>
                  <p><strong>Firma:</strong> {project?.companyName}</p>
                  <p><strong>Adresse:</strong> {project?.address}, {project?.city}</p>
                  {project?.startDate && (
                    <p><strong>Startdatum:</strong> {new Date(project.startDate).toLocaleDateString('de-DE')}</p>
                  )}
                  {project?.endDate && (
                    <p><strong>Enddatum:</strong> {new Date(project.endDate).toLocaleDateString('de-DE')}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Kartensteuerung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapActions 
                mapInstance={mapInstance} 
                projectId={projectId} 
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Rechte Spalte: Karte */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full relative">
              <MapContainer
                center={mapCenter}
                zoom={13}
                onMapLoad={setMapInstance}
                containerId={`map-${projectId || 'new'}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Zurück
        </Button>
      </div>
    </div>
  );
};

export default SimpleTiefbauMap;