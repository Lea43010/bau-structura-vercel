import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DenkmalAtlas from '@/components/external-integrations/denkmal-atlas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, Copy } from 'lucide-react';
import MainLayout from '@/components/layouts/main-layout';

const DenkmalAtlasPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const handleCoordinateSelect = (lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng, name });
  };

  const copyCoordinates = () => {
    if (!selectedLocation) return;
    
    const coordString = `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordString).then(() => {
      toast({
        title: "Koordinaten kopiert",
        description: "Die Koordinaten wurden in die Zwischenablage kopiert.",
      });
    }).catch(err => {
      console.error('Fehler beim Kopieren:', err);
      toast({
        title: "Fehler beim Kopieren",
        description: "Die Koordinaten konnten nicht kopiert werden.",
        variant: "destructive",
      });
    });
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Denkmal-Atlas | Bau-Structura</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <DenkmalAtlas 
              height="calc(100vh - 12rem)" 
              onCoordinateSelect={handleCoordinateSelect}
            />
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Über den Denkmal-Atlas
                </CardTitle>
                <CardDescription>
                  Die Online-Version der Bayerischen Denkmalliste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Der Bayerische Denkmal-Atlas bietet eine interaktive Karte aller bekannten Baudenkmäler und Bodendenkmäler in Bayern. 
                </p>
                <p>
                  Sie können nach Denkmälern suchen, indem Sie einen Ort, eine Adresse oder eine Denkmalnummer eingeben. Zudem können Sie den Suchradius anpassen, um mehr oder weniger Ergebnisse zu erhalten.
                </p>
                <p>
                  Wählen Sie ein Denkmal aus der Karte aus, um Informationen zu erhalten und die Koordinaten in Ihr Projekt zu übernehmen.
                </p>
              </CardContent>
            </Card>
            
            {selectedLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Ausgewähltes Denkmal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-medium">{selectedLocation.name || "Unbenanntes Denkmal"}</h3>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Koordinaten:</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="px-3 py-1 text-xs">
                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </Badge>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={copyCoordinates}
                        title="Koordinaten kopieren"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Hier könnte die Integration mit der Google Maps Komponente erfolgen
                        toast({
                          title: "Denkmal auf Karte anzeigen",
                          description: `Der Standort wird auf der Projektkarte markiert.`,
                        });
                      }}
                    >
                      Auf Projektkarte anzeigen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DenkmalAtlasPage;