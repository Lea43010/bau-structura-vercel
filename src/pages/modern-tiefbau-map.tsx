import React, { useState, useRef, useEffect } from 'react';
import { Map, Navigation, Route, Search, MapPin, Calculator, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { useToast } from "@/hooks/use-toast";

export default function ModernTiefbauMap() {
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Route calculation state
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  
  // Soil analysis state
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  
  const [soilData, setSoilData] = useState<{
    type: string;
    description: string;
    geologicalAge: string;
  } | null>(null);

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      if (window.google && mapRef.current) {
        setIsMapLoaded(true);
        // Map initialization would happen here
        toast({
          title: "Karte geladen",
          description: "Die interaktive Karte ist einsatzbereit.",
        });
      }
    };

    initMap();
  }, [toast]);

  const calculateRoute = async () => {
    if (!startAddress || !endAddress) {
      toast({
        title: "Unvollständige Eingabe",
        description: "Bitte geben Sie Start- und Zieladresse ein.",
        variant: "destructive",
      });
      return;
    }

    // Simulate route calculation
    setRouteInfo({
      distance: "12.5 km",
      duration: "18 Min."
    });

    toast({
      title: "Route berechnet",
      description: "Die optimale Route wurde gefunden.",
    });
  };

  const analyzeSoil = async (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    
    // Simulate soil analysis
    setSoilData({
      type: "Sandig-lehmiger Ton",
      description: "Mitteldichte Lagerung, gute Tragfähigkeit",
      geologicalAge: "Quartär"
    });

    toast({
      title: "Bodenanalyse abgeschlossen",
      description: "Geologische Daten für den Standort wurden geladen.",
    });
  };

  return (
    <DashboardLayout
      title="Tiefbau-Planung"
      description="Interaktive Karte mit Routenplanung und Bodenanalyse"
    >
      <div className="space-y-6">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Tiefbau-Planung</h1>
                <Map className="h-8 w-8" />
              </div>
              <p className="text-teal-100 text-lg max-w-2xl">
                Interaktive Kartentools für Routenplanung, Bodenanalyse und Infrastrukturprojekte.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/projects">
                <Button className="bg-white text-teal-600 hover:bg-gray-100 font-semibold">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zu Projekten
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-teal-600" />
                  Interaktive Karte
                </CardTitle>
                <CardDescription>
                  Klicken Sie auf die Karte für Bodenanalyse oder nutzen Sie die Routenplanung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapRef}
                  className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                >
                  {isMapLoaded ? (
                    <div className="text-center">
                      <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Interaktive Karte</p>
                      <p className="text-sm text-gray-500">Klicken Sie für Bodenanalyse</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Karte wird geladen...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Sidebar */}
          <div className="space-y-6">
            {/* Route Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-teal-600" />
                  Routenplanung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="start">Startadresse</Label>
                  <Input
                    id="start"
                    value={startAddress}
                    onChange={(e) => setStartAddress(e.target.value)}
                    placeholder="z.B. München Hauptbahnhof"
                  />
                </div>
                <div>
                  <Label htmlFor="end">Zieladresse</Label>
                  <Input
                    id="end"
                    value={endAddress}
                    onChange={(e) => setEndAddress(e.target.value)}
                    placeholder="z.B. Würzburg Zentrum"
                  />
                </div>
                <Button 
                  onClick={calculateRoute} 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Route berechnen
                </Button>
                
                {routeInfo && (
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">Routeninformationen</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Entfernung:</span>
                        <Badge variant="secondary">{routeInfo.distance}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Fahrzeit:</span>
                        <Badge variant="secondary">{routeInfo.duration}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Soil Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-teal-600" />
                  Bodenanalyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLocation ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Ausgewählter Standort
                      </h4>
                      <p className="text-sm text-blue-700">{selectedLocation.address}</p>
                    </div>
                    
                    {soilData && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-3">Bodendaten</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Bodentyp:</span>
                            <p className="text-green-700">{soilData.type}</p>
                          </div>
                          <div>
                            <span className="font-medium">Beschreibung:</span>
                            <p className="text-green-700">{soilData.description}</p>
                          </div>
                          <div>
                            <span className="font-medium">Geologisches Alter:</span>
                            <p className="text-green-700">{soilData.geologicalAge}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Klicken Sie auf die Karte, um eine Bodenanalyse durchzuführen
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Route className="h-6 w-6 text-teal-600" />
                <h3 className="font-semibold">Routenoptimierung</h3>
              </div>
              <p className="text-sm text-gray-600">
                Berechnung der optimalen Route zwischen Baustellenstandorten mit Berücksichtigung von Verkehr und Straßenbeschränkungen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Search className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold">Bodenanalyse</h3>
              </div>
              <p className="text-sm text-gray-600">
                Geologische Informationen und Bodendaten für fundierte Planungsentscheidungen bei Tiefbauprojekten.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Map className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold">Vermessung</h3>
              </div>
              <p className="text-sm text-gray-600">
                Präzise Distanzmessungen und Flächenberechnungen direkt auf der interaktiven Karte.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
            <CardDescription>Häufig verwendete Funktionen und Werkzeuge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Navigation className="h-6 w-6" />
                <span className="text-sm">Navigation</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Search className="h-6 w-6" />
                <span className="text-sm">Standort suchen</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Calculator className="h-6 w-6" />
                <span className="text-sm">Entfernung messen</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Markierung setzen</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}