import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, MapPin, Database, FileSpreadsheet, Building2 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface BodenanalyseErgebnis {
  coordinates: {
    lat: number;
    lng: number;
    utm32?: {
      x: number;
      y: number;
    };
  };
  success: boolean;
  data: {
    bodenart: string;
    hauptbodentyp: string;
    leitbodentyp: string;
    bodenregion: string;
    nutzung: string;
    bodeneinheit: string;
    bodengesellschaft: string;
    substratsystematik: string;
  } | {
    error: boolean;
    message: string;
  };
  error?: string;
  message?: string;
}

const BodenAnalyse: React.FC = () => {
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [useManualCoordinates, setUseManualCoordinates] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<BodenanalyseErgebnis | null>(null);
  const [batchResults, setBatchResults] = useState<BodenanalyseErgebnis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [savedResults, setSavedResults] = useState<any[]>([]);
  const [showSavedResults, setShowSavedResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Projekte laden
  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Gespeicherte Bodenanalyseergebnisse laden
  const { data: savedResultsData = [] } = useQuery({
    queryKey: ['/api/bodenanalyse/results'],
  });

  // Ergebnis speichern
  const saveAnalysisResult = async (result: BodenanalyseErgebnis, analysisType = 'einzelpunkt') => {
    try {
      if (!result.success || !result.data || 'error' in result.data) {
        return;
      }

      const saveData = {
        project_id: selectedProjectId ? parseInt(selectedProjectId) : null,
        latitude: result.coordinates.lat,
        longitude: result.coordinates.lng,
        utm32_x: result.coordinates.utm32?.x || null,
        utm32_y: result.coordinates.utm32?.y || null,
        bodenart: result.data.bodenart,
        hauptbodentyp: result.data.hauptbodentyp,
        leitbodentyp: result.data.leitbodentyp,
        bodenregion: result.data.bodenregion,
        nutzung: result.data.nutzung,
        bodeneinheit: result.data.bodeneinheit,
        bodengesellschaft: result.data.bodengesellschaft,
        substratsystematik: result.data.substratsystematik,
        eigenschaften: JSON.stringify(result.data),
        quelle: 'BGR-WMS',
        analysis_type: analysisType
      };

      const response = await fetch('/api/bodenanalyse/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        toast({
          title: "Analyse gespeichert",
          description: "Die Bodenanalyse wurde erfolgreich in der Datenbank gespeichert.",
        });
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Analyse:', error);
    }
  };

  // Koordinaten aus ausgewähltem Projekt laden
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    
    // Nur automatisch laden, wenn nicht im manuellen Modus
    if (!useManualCoordinates && projectId && projectId !== 'none') {
      const selectedProjectData = projects.find((p: any) => p.id.toString() === projectId);
      if (selectedProjectData && selectedProjectData.project_latitude && selectedProjectData.project_longitude) {
        setLat(selectedProjectData.project_latitude.toString());
        setLng(selectedProjectData.project_longitude.toString());
        toast({
          title: "Projektkoordinaten geladen",
          description: `Koordinaten von "${selectedProjectData.project_name}" übernommen.`,
        });
      } else {
        toast({
          title: "Keine Koordinaten verfügbar",
          description: "Das ausgewählte Projekt hat keine gespeicherten Koordinaten.",
          variant: "destructive",
        });
      }
    } else if (!useManualCoordinates && (!projectId || projectId === 'none')) {
      setLat('');
      setLng('');
    }
  };

  // Projektkoordinaten manuell laden
  const loadProjectCoordinates = () => {
    if (selectedProjectId && selectedProjectId !== 'none') {
      const selectedProjectData = projects.find((p: any) => p.id.toString() === selectedProjectId);
      if (selectedProjectData && selectedProjectData.project_latitude && selectedProjectData.project_longitude) {
        setLat(selectedProjectData.project_latitude.toString());
        setLng(selectedProjectData.project_longitude.toString());
        toast({
          title: "Projektkoordinaten geladen",
          description: `Koordinaten von "${selectedProjectData.project_name}" übernommen.`,
        });
      }
    }
  };

  // Einzelpunkt-Koordinaten abfragen
  const handleAnalyzePoint = async () => {
    if (!lat || !lng) {
      toast({
        title: "Eingabefehler",
        description: "Bitte geben Sie gültige Koordinaten ein.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(`/api/soil-analysis/point?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error('Fehler bei der Bodenanalyse');
      }
      
      const data = await response.json();
      setAnalysisResult(data.data);
      
      if (!data.success) {
        toast({
          title: "Fehler",
          description: data.message || "Fehler bei der Bodenanalyse",
          variant: "destructive",
        });
      } else if (data.data && data.data.success && !('error' in data.data.data)) {
        // Automatisch speichern, wenn Analyse erfolgreich
        await saveAnalysisResult(data.data, 'einzelpunkt');
      }
    } catch (error) {
      console.error('Fehler bei der Bodenanalyse:', error);
      toast({
        title: "Fehler",
        description: "Die Bodenanalyse konnte nicht durchgeführt werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Batch-Koordinaten abfragen - verwendet ausgewähltes Projekt oder Beispielstädte
  const handleBatchAnalysis = async () => {
    let points;
    
    if (selectedProjectId && Array.isArray(projects)) {
      // Verwende das ausgewählte Projekt direkt aus der Projektliste
      const selectedProjectData = projects.find((p: any) => p.id.toString() === selectedProjectId);
      if (selectedProjectData && selectedProjectData.project_latitude && selectedProjectData.project_longitude) {
        points = [{
          lat: selectedProjectData.project_latitude,
          lng: selectedProjectData.project_longitude,
          name: selectedProjectData.project_name || selectedProjectData.project_location || "Ausgewähltes Projekt"
        }];
      } else {
        // Fallback auf Beispielstädte wenn Projekt keine Koordinaten hat
        points = [
          { lat: 48.1351, lng: 11.5820, name: "München" },
          { lat: 52.5200, lng: 13.4050, name: "Berlin" },
          { lat: 50.9375, lng: 6.9603, name: "Köln" },
          { lat: 53.5511, lng: 9.9937, name: "Hamburg" },
          { lat: 50.1109, lng: 8.6821, name: "Frankfurt" }
        ];
      }
    } else {
      // Fallback auf Beispielstädte wenn kein Projekt ausgewählt
      points = [
        { lat: 48.1351, lng: 11.5820, name: "München" },
        { lat: 52.5200, lng: 13.4050, name: "Berlin" },
        { lat: 50.9375, lng: 6.9603, name: "Köln" },
        { lat: 53.5511, lng: 9.9937, name: "Hamburg" },
        { lat: 50.1109, lng: 8.6821, name: "Frankfurt" }
      ];
    }

    setBatchLoading(true);
    setBatchResults([]);

    try {
      const response = await fetch('/api/soil-analysis/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Batch-Bodenanalyse');
      }
      
      const data = await response.json();
      setBatchResults(data.data);
      
      if (!data.success) {
        toast({
          title: "Fehler",
          description: data.message || "Fehler bei der Batch-Bodenanalyse",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fehler bei der Batch-Bodenanalyse:', error);
      toast({
        title: "Fehler",
        description: "Die Batch-Bodenanalyse konnte nicht durchgeführt werden.",
        variant: "destructive",
      });
    } finally {
      setBatchLoading(false);
    }
  };

  // CSV-Upload für Batch-Analyse
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv', file);

    setBatchLoading(true);
    setBatchResults([]);

    try {
      const response = await fetch('/api/soil-analysis/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Fehler beim Verarbeiten der CSV-Datei');
      }
      
      const data = await response.json();
      setBatchResults(data.data);
      
      if (!data.success) {
        toast({
          title: "Fehler",
          description: data.message || "Fehler beim Verarbeiten der CSV-Datei",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erfolg",
          description: `${data.data.length} Koordinaten erfolgreich analysiert.`,
        });
      }
    } catch (error) {
      console.error('Fehler beim CSV-Upload:', error);
      toast({
        title: "Fehler",
        description: "Die CSV-Datei konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
    } finally {
      setBatchLoading(false);
      // Formular zurücksetzen
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Funktion zur Anzeige der Bodenanalyseergebnisse
  const renderAnalysisResult = (result: BodenanalyseErgebnis) => {
    if (!result.success) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-medium">Fehler bei der Analyse</p>
          <p className="text-sm text-gray-600">{result.message || 'Unbekannter Fehler'}</p>
        </div>
      );
    }

    const data = result.data as { 
      bodenart: string;
      hauptbodentyp?: string;
      leitbodentyp?: string;
      bodenregion?: string;
      nutzung?: string;
      bodeneinheit?: string;
      bodengesellschaft?: string;
      substratsystematik?: string;
      bodentyp?: string;
      hinweis?: string;
    };

    // Farbzuordnung für Bodenarten
    const getBodenartColor = (bodenart: string) => {
      const colorMap: Record<string, string> = {
        'Sand': 'bg-yellow-100 text-yellow-800',
        'Lehm': 'bg-amber-100 text-amber-800',
        'Schluff': 'bg-orange-100 text-orange-800',
        'Ton': 'bg-red-100 text-red-800',
        'Löss': 'bg-yellow-200 text-yellow-900',
        'Mergel': 'bg-blue-100 text-blue-800',
        'Moor': 'bg-brown-100 text-brown-800',
        'Kies': 'bg-gray-100 text-gray-800',
        'Fels': 'bg-slate-200 text-slate-800',
      };
      
      // Prüfen, ob der Bodenart-String eines der Schlüsselwörter enthält
      for (const [key, color] of Object.entries(colorMap)) {
        if (bodenart.toLowerCase().includes(key.toLowerCase())) {
          return color;
        }
      }
      
      return 'bg-gray-100 text-gray-800'; // Standardfarbe
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Koordinaten</h3>
            <p>
              Lat: {result.coordinates.lat.toFixed(6)}, 
              Lng: {result.coordinates.lng.toFixed(6)}
            </p>
            {result.coordinates.utm32 && (
              <p className="text-xs text-gray-500 mt-1">
                UTM32: {result.coordinates.utm32.x.toFixed(1)}, {result.coordinates.utm32.y.toFixed(1)}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Klassifikation</h3>
            <div className={`inline-block px-2 py-1 rounded ${getBodenartColor(data.bodenart)}`}>
              {data.bodenart || 'Unbekannt'}
            </div>
            {data.hinweis && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                <p><strong>Hinweis:</strong> {data.hinweis}</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Hauptbodentyp</h3>
          <p>{data.hauptbodentyp || data.bodentyp || 'Nicht verfügbar'}</p>
          
          {/* Nur anzeigen, wenn Daten vorhanden sind */}
          {data.leitbodentyp && (
            <>
              <h3 className="text-sm font-medium text-gray-500 mt-2">Leitbodentyp</h3>
              <p>{data.leitbodentyp}</p>
            </>
          )}
          
          {data.bodenregion && (
            <>
              <h3 className="text-sm font-medium text-gray-500 mt-2">Bodenregion</h3>
              <p>{data.bodenregion}</p>
            </>
          )}
          
          {data.nutzung && (
            <>
              <h3 className="text-sm font-medium text-gray-500 mt-2">Nutzung</h3>
              <p>{data.nutzung}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="BGR Bodenanalyse">
      <div className="space-y-8">
        {/* Header mit Gradient Background und Entwicklungshinweis */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">BGR Bodenanalyse</h1>
                <span className="bg-amber-500 text-amber-900 px-3 py-1 rounded-full text-sm font-medium">
                  In Entwicklung
                </span>
              </div>
              <p className="text-teal-100 text-lg max-w-2xl">
                Analyse von Bodenarten basierend auf BGR-Daten (Bundesanstalt für Geowissenschaften und Rohstoffe)
              </p>
              <div className="mt-3 p-3 bg-teal-700 bg-opacity-50 rounded-lg border border-teal-500">
                <p className="text-teal-100 text-sm">
                  <strong>Hinweis:</strong> Diese Funktion befindet sich noch in der Entwicklungsphase. 
                  Die BGR-Schnittstelle wird derzeit konfiguriert und optimiert.
                </p>
              </div>
            </div>
            <Link href="/tiefbau-map">
              <Button variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Karte
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <MapPin size={16} />
            Einzelpunkt-Analyse
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <Database size={16} />
            Batch-Analyse
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileSpreadsheet size={16} />
            CSV-Upload
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2" onClick={() => setShowSavedResults(true)}>
            <Building2 size={16} />
            Gespeicherte Analysen
          </TabsTrigger>
        </TabsList>
        
        {/* Einzelpunkt-Analyse */}
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Einzelpunkt-Bodenanalyse</CardTitle>
              <CardDescription>
                Analysen Sie die Bodenart an einem einzelnen Standort durch Eingabe von WGS84-Koordinaten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Projektauswahl */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Projekt auswählen</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Wählen Sie ein Projekt aus der Tiefbau-Planung, um die Koordinaten automatisch zu übernehmen.
                </p>
                <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Projekt auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Kein Projekt ausgewählt</SelectItem>
                    {projects.map((project: any) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.projectName} - {project.projectLocation || 'Keine Adresse'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Koordinaten-Eingabe-Modus */}
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="manual-coordinates"
                      checked={useManualCoordinates}
                      onChange={(e) => setUseManualCoordinates(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="manual-coordinates" className="text-sm font-medium">
                      Manuelle Koordinateneingabe
                    </Label>
                  </div>
                  {!useManualCoordinates && selectedProjectId && selectedProjectId !== 'none' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadProjectCoordinates}
                    >
                      Projektkoordinaten laden
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {useManualCoordinates 
                    ? "Geben Sie die Koordinaten manuell ein. Die Eingabefelder werden nicht automatisch überschrieben."
                    : "Koordinaten werden automatisch vom ausgewählten Projekt übernommen."
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Breitengrad (Latitude, z.B. 52.5200)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="z.B. 48.1351"
                    disabled={!useManualCoordinates && selectedProjectId && selectedProjectId !== 'none'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Längengrad (Longitude, z.B. 13.4050)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="z.B. 11.5820"
                    disabled={!useManualCoordinates && selectedProjectId && selectedProjectId !== 'none'}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleAnalyzePoint}
                disabled={loading}
              >
                {loading ? 'Analysiere...' : 'Bodenart analysieren'}
              </Button>
              
              {loading && (
                <div className="mt-6 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
              
              {!loading && analysisResult && (
                <div className="mt-6 border rounded-lg p-4">
                  {renderAnalysisResult(analysisResult)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Batch-Analyse */}
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch-Bodenanalyse</CardTitle>
              <CardDescription>
                Führen Sie eine Bodenanalyse für das ausgewählte Projekt oder Beispielstandorte durch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {selectedProjectId && Array.isArray(projects) ? (() => {
                  const selectedProjectData = projects.find((p: any) => p.id.toString() === selectedProjectId);
                  if (selectedProjectData && selectedProjectData.project_latitude && selectedProjectData.project_longitude) {
                    return `Analysiert das ausgewählte Projekt: ${selectedProjectData.project_name || selectedProjectData.project_location} (${selectedProjectData.project_latitude.toFixed(4)}, ${selectedProjectData.project_longitude.toFixed(4)})`;
                  } else {
                    return 'Diese Beispiel-Analyse verwendet folgende Standorte: München, Berlin, Köln, Hamburg und Frankfurt.';
                  }
                })() : 'Diese Beispiel-Analyse verwendet folgende Standorte: München, Berlin, Köln, Hamburg und Frankfurt.'
                }
              </p>
              
              <Button 
                className="w-full" 
                onClick={handleBatchAnalysis}
                disabled={batchLoading}
              >
                {batchLoading ? 'Analysiere...' : 'Batch-Analyse starten'}
              </Button>
              
              {batchLoading && (
                <div className="mt-6 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              )}
              
              {!batchLoading && batchResults.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <Table>
                    <TableCaption>Batch-Analyseergebnisse</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Standort</TableHead>
                        <TableHead>Koordinaten</TableHead>
                        <TableHead>Bodenart</TableHead>
                        <TableHead>Hauptbodentyp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {result.data?.standort || `Standort ${index + 1}`}
                          </TableCell>
                          <TableCell>
                            {result.coordinates.lat.toFixed(4)}, {result.coordinates.lng.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            {result.success && 'error' in result.data ? (
                              <span className="text-red-500">Fehler: {(result.data as any).message}</span>
                            ) : (
                              <span>
                                {result.success ? (result.data as any).bodenart || 'Unbekannt' : 'Fehler'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.success && !('error' in result.data) ? 
                              (result.data as any).hauptbodentyp || 'Unbekannt' : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* CSV-Upload */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>CSV-Upload für Bodenanalyse</CardTitle>
              <CardDescription>
                Laden Sie eine CSV-Datei mit Koordinaten hoch, um Bodenanalysen für mehrere Standorte durchzuführen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">CSV-Datei mit Koordinaten</Label>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="mt-1"
                    disabled={batchLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Die CSV-Datei sollte Spalten mit den Namen "lat"/"latitude" und "lng"/"longitude" enthalten.
                  </p>
                </div>
                
                {batchLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
                    <span className="ml-2">CSV wird verarbeitet...</span>
                  </div>
                )}
                
                {!batchLoading && batchResults.length > 0 && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>CSV-Upload Ergebnisse</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Koordinaten</TableHead>
                          <TableHead>Bodenart</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchResults.slice(0, 100).map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {result.coordinates.lat.toFixed(4)}, {result.coordinates.lng.toFixed(4)}
                            </TableCell>
                            <TableCell>
                              {result.success && !('error' in result.data) && result.data && typeof result.data === 'object' ? 
                                ((result.data as any).bodenart || 'Unbekannt') : '-'}
                            </TableCell>
                            <TableCell>
                              {result.success ? (
                                <span className="text-green-500">Erfolg</span>
                              ) : (
                                <span className="text-red-500">Fehler</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {batchResults.length > 100 && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Zeige 100 von {batchResults.length} Ergebnissen
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Upload size={16} className="mr-2" />
                <span>Max. Dateigröße: 5MB</span>
              </div>
              <div>Format: CSV mit Spalten "lat", "lng"</div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Gespeicherte Analysen */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Gespeicherte Bodenanalyseergebnisse</CardTitle>
              <CardDescription>
                Übersicht aller in der Datenbank gespeicherten Bodenanalysen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedResultsData && savedResultsData.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableCaption>Alle gespeicherten Bodenanalyseergebnisse</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Projekt</TableHead>
                        <TableHead>Koordinaten</TableHead>
                        <TableHead>Bodenart</TableHead>
                        <TableHead>Hauptbodentyp</TableHead>
                        <TableHead>Typ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedResultsData.map((result: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(result.created_at).toLocaleDateString('de-DE')}
                          </TableCell>
                          <TableCell>
                            {result.projectName || 'Kein Projekt'}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>Lat: {result.latitude}</div>
                              <div>Lng: {result.longitude}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-block px-2 py-1 rounded text-xs ${
                              result.bodenart?.toLowerCase().includes('kies') ? 'bg-orange-100 text-orange-800' :
                              result.bodenart?.toLowerCase().includes('sand') ? 'bg-yellow-100 text-yellow-800' :
                              result.bodenart?.toLowerCase().includes('ton') ? 'bg-red-100 text-red-800' :
                              result.bodenart?.toLowerCase().includes('lehm') ? 'bg-brown-100 text-brown-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {result.bodenart || 'Unbekannt'}
                            </div>
                          </TableCell>
                          <TableCell>{result.hauptbodentyp || 'Nicht verfügbar'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              result.analysis_type === 'einzelpunkt' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {result.analysis_type === 'einzelpunkt' ? 'Einzelpunkt' : 'Batch'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : savedResultsData && savedResultsData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Keine gespeicherten Analysen</h3>
                  <p>Führen Sie eine Bodenanalyse durch, um Ergebnisse zu speichern.</p>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <Skeleton className="h-64 w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BodenAnalyse;