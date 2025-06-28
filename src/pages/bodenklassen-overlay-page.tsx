import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Map } from 'lucide-react';
import { useLocation } from 'wouter';
import IntegratedGoogleMap from '@/components/maps/integrated-google-map';
import SoilClassOverlay from '@/components/maps/soil-class-overlay';
import MainLayout from '@/components/layouts/main-layout';

/**
 * Bodenklassen-Overlay Seite
 * 
 * Diese Seite zeigt eine Karte mit Bodenklassen-Overlay an, ohne die komplexe
 * Funktionalität der Tiefbau-Map-Seite, um die Performance zu verbessern.
 */
const BodenklassenOverlayPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const { toast } = useToast();

  const defaultCenter = { lat: 51.1657, lng: 10.4515 }; // Deutschland-Mitte
  
  // Toast-Benachrichtigung bei Seitenladung
  useEffect(() => {
    toast({
      title: 'Bodenklassen-Overlay',
      description: 'Hier können Sie die Bodenklassen für verschiedene Regionen in Deutschland erkunden.',
      duration: 5000,
    });
  }, [toast]);

  // Overlay-Sichtbarkeit umschalten
  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Bodenklassen-Overlay | Bau-Structura</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bodenklassen-Overlay</h1>
            <p className="text-muted-foreground">
              Erkunden Sie die verschiedenen Bodenklassen und -eigenschaften in Deutschland
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/tiefbau-map')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Tiefbau-Karte
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Hauptkarte */}
          <Card className="lg:col-span-3 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Map className="w-5 h-5 mr-2" />
                Interaktive Bodenklassen-Karte
              </CardTitle>
              <CardDescription>
                Klicken Sie auf die Karte, um Bodenklassen-Informationen an diesem Standort anzuzeigen
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 relative map-area">
              <IntegratedGoogleMap
                initialCenter={defaultCenter}
                initialZoom={6}
                height="700px"
                className="w-full rounded-b-md overflow-hidden"
                onMapReady={setMapInstance}
                showTerrainControls
              />
            </CardContent>
          </Card>
          
          {/* Sidebar mit Steuerungselementen und Bodenklassen-Overlay */}
          <div className="space-y-6">
            {/* Overlay-Steuerung */}
            <Card className="shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="text-base">Overlay-Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={toggleOverlay} 
                  variant={overlayVisible ? "default" : "outline"}
                  className="w-full"
                >
                  {overlayVisible ? 'Overlay ausblenden' : 'Overlay einblenden'}
                </Button>
              </CardContent>
            </Card>
            
            {/* Bodenklassen-Overlay-Komponente */}
            {mapInstance && (
              <SoilClassOverlay
                map={mapInstance}
                containerId="google-map-container"
                isVisible={overlayVisible}
                onVisibleChange={setOverlayVisible}
              />
            )}
            
            {/* Legende */}
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base">Legende</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-[#76a730] mr-2 opacity-60"></div>
                    <span>Norddeutsche Tiefebene</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-[#f59e0b] mr-2 opacity-60"></div>
                    <span>Mittelgebirge</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-[#3b82f6] mr-2 opacity-60"></div>
                    <span>Süddeutschland/Alpen</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Informationsbereich */}
        <Card className="mt-6 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Über Bodenklassen im Tiefbau</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Bodenklassen sind ein wichtiges Kriterium bei der Planung und Durchführung von Tiefbauarbeiten. 
              Sie geben Auskunft über die Beschaffenheit des Bodens und sind entscheidend für die Wahl 
              der richtigen Baumaschinen und Arbeitsmethoden.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium mb-2">Bodenklassen nach DIN 18300</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Klasse 1: Oberboden</li>
                  <li>Klasse 2: Leicht lösbare Böden (Sand, Kies)</li>
                  <li>Klasse 3: Mittelschwer lösbare Böden (Lehm, Mergel)</li>
                  <li>Klasse 4: Schwer lösbare Böden (toniger Boden)</li>
                  <li>Klasse 5: Leicht lösbarer Fels (stark verwitterter Fels)</li>
                  <li>Klasse 6: Schwer lösbarer Fels (fester Fels)</li>
                  <li>Klasse 7: Sehr schwer lösbarer Fels (sehr fester Fels)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Bedeutung für Tiefbau-Projekte</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bestimmung der Aushubmethoden</li>
                  <li>Kalkulation von Kosten und Zeitaufwand</li>
                  <li>Auswahl der geeigneten Baumaschinen</li>
                  <li>Planung von Entwässerungssystemen</li>
                  <li>Bewertung der Tragfähigkeit des Untergrundes</li>
                  <li>Bestimmung von Verdichtungsanforderungen</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BodenklassenOverlayPage;