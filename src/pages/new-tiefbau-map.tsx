import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import MapStatistics from '@/components/maps/map-statistics';
import SimpleGoogleMap from '@/components/maps/simple-google-map';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { usePermissions } from '@/hooks/use-permissions';
import TiefbauPDFGenerator from '@/components/pdf/tiefbau-pdf-generator';
import TiefbauPDFGeneratorUpdated from '@/components/pdf/tiefbau-pdf-generator-updated';
import TiefbauPDFDialog from '@/components/pdf/tiefbau-pdf-dialog';
import { checkIfFileExists } from '@/utils/file-utils';

// Icons
import { 
  Map, 
  SquarePen, 
  Save, 
  Trash, 
  Share2, 
  Download, 
  FileText, 
  Image, 
  PlusCircle, 
  Layers, 
  FileUp, 
  FileDown, 
  FileCheck,
  Check, 
  MapPin, 
  Route as RouteIcon, 
  Filter, 
  ArrowRight, 
  Search, 
  Mic, 
  MicOff,
  Camera,
  XCircle,
  Truck,
  Ruler,
  AlertCircle,
  CloudUpload,
  UserCircle,
  CalendarClock,
  Loader2,
  ListChecks,
  Table,
  Database,
  BarChart
} from 'lucide-react';

// Benutzerdefiniertes Schaufel-Icon für Bodenarbeiten
const Shovel = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 22v-5l5-5 5 5-5 5z" />
    <path d="M9.5 14.5L16 8" />
    <path d="M17 2l5 5-.5.5c-3.5 3.5-7 7-10.5 10.5L6 13c3.5-3.5 7-7 10.5-10.5L17 2z" />
  </svg>
);

// Kartenkomponenten
import IntegratedGoogleMap from '@/components/maps/integrated-google-map';
import SoilClassOverlay from '@/components/maps/soil-class-overlay';

// Spracherkennung
import { createSpeechRecognition, correctText } from '@/utils/speech-recognition';

// Bodenklassen-Typen 
interface Bodenklasse {
  id: number;
  name: string;
  beschreibung?: string;
  dichte?: number;
  belastungsklasse?: string;
  material_kosten_pro_m2?: number;
  bearbeitungshinweise?: string;
  color?: string;
}

// Validierungsschema für Notizen
const noteSchema = z.object({
  text: z.string().min(1, 'Text ist erforderlich'),
  projectId: z.number().optional(),
  category: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  soilClass: z.string().optional(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NoteData {
  id: number;
  text: string;
  category: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
  soilClass?: string;
  author: string;
}

interface ProjectData {
  id: number;
  name: string;
  customerName: string;
  companyName: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  endDate?: string;
  notes?: NoteData[];
}

// Komponente für die neue Tiefbau-Map
const NewTiefbauMap: React.FC = () => {
  // Route und ID des Projekts
  const [match, params] = useRoute('/tiefbau-map/new/:id');
  const projectId = match ? parseInt(params.id) : undefined;
  const [, navigate] = useLocation();

  // Berechtigungs-Hook
  const { canEdit, isAdmin, canDeleteAttachments } = usePermissions();
  
  // States
  const [activeTab, setActiveTab] = useState('karte');
  const [selectedSoilClass, setSelectedSoilClass] = useState<Bodenklasse | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [temporaryNote, setTemporaryNote] = useState('');
  const [correctedNote, setCorrectedNote] = useState('');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('standard');
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [routeData, setRouteData] = useState<Array<{lat: number, lng: number}> | null>(null);
  const [visibleNotes, setVisibleNotes] = useState<NoteData[]>([]);
  const [noteFilter, setNoteFilter] = useState('all');
  const [saveMapViewOpen, setSaveMapViewOpen] = useState(false);
  const [savedMapViewName, setSavedMapViewName] = useState('');
  const [showStatistics, setShowStatistics] = useState(false);
  const [savedMapViews, setSavedMapViews] = useState<Array<{
    id: string, 
    name: string, 
    center: {lat: number, lng: number}, 
    zoom: number
  }>>([]);
  const [noteAttachments, setNoteAttachments] = useState<Array<{
    file: File,
    preview: string
  }>>([]);
  
  // Toast
  const { toast } = useToast();
  
  // Refs
  const speechRecognitionRef = useRef(createSpeechRecognition({ language: 'de-DE' }));
  const noteFormRef = useRef<HTMLFormElement>(null);
  
  // Form
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      text: '',
      projectId: projectId,
      category: 'allgemein',
    },
  });
  
  // Projekt-Daten laden
  const {
    data: project = {} as ProjectData, // Standardwert für TypeScript
    isLoading: projectLoading,
    error: projectError,
  } = useQuery<ProjectData>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });
  
  // Notizen laden
  const {
    data: projectNotes = [], // Default-Wert, damit es nie undefined ist
    isLoading: notesLoading,
    error: notesError,
  } = useQuery<NoteData[]>({
    queryKey: ['/api/tiefbau-notes', projectId],
    enabled: !!projectId,
  });
  
  // Mutation zum Speichern von Notizen
  const createNoteMutation = useMutation({
    mutationFn: async (note: NoteFormValues) => {
      const response = await apiRequest(
        'POST',
        '/api/tiefbau-notes',
        note
      );
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Notiz gespeichert',
        description: 'Die Notiz wurde erfolgreich gespeichert.',
      });
      form.reset({
        text: '',
        projectId: projectId,
        category: 'allgemein',
      });
      // Notizen neu laden
      queryClient.invalidateQueries({ queryKey: ['/api/tiefbau-notes', projectId] });
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Speichern der Notiz: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Effect zum Aktualisieren der Notizen
  useEffect(() => {
    if (projectNotes) {
      setNotes(projectNotes);
      filterNotes(noteFilter);
    }
  }, [projectNotes, noteFilter]);
  
  // Effect zum Aktualisieren der Karten-Position
  useEffect(() => {
    if (project?.latitude && project?.longitude) {
      setMapCenter({ lat: project.latitude, lng: project.longitude });
    } else {
      // Deutschland als Standard-Position
      setMapCenter({ lat: 51.1657, lng: 10.4515 });
    }
  }, [project]);
  
  // Effect zum Laden der gespeicherten Kartenansichten
  useEffect(() => {
    if (projectId) {
      try {
        const savedViews = localStorage.getItem(`tiefbau-map-views-${projectId}`);
        if (savedViews) {
          setSavedMapViews(JSON.parse(savedViews));
        }
      } catch (error) {
        console.error('Fehler beim Laden der gespeicherten Kartenansichten:', error);
      }
    }
  }, [projectId]);
  
  // Funktion zum Filtern der Notizen
  const filterNotes = (filter: string) => {
    setNoteFilter(filter);
    if (filter === 'all') {
      setVisibleNotes(notes);
    } else {
      setVisibleNotes(notes.filter(note => note.category === filter));
    }
  };
  
  // Funktion zum Starten der Spracherkennung
  const startRecording = () => {
    if (!speechRecognitionRef.current.isSupported()) {
      toast({
        title: 'Spracherkennung nicht unterstützt',
        description: 'Ihr Browser unterstützt leider keine Spracherkennung.',
        variant: 'destructive',
      });
      return;
    }
    
    setTemporaryNote('');
    setIsRecording(true);
    
    speechRecognitionRef.current.onresult((text) => {
      setTemporaryNote(text);
    });
    
    speechRecognitionRef.current.onend(() => {
      setIsRecording(false);
    });
    
    speechRecognitionRef.current.onerror((error) => {
      toast({
        title: 'Fehler bei der Spracherkennung',
        description: `Es ist ein Fehler aufgetreten: ${error}`,
        variant: 'destructive',
      });
      setIsRecording(false);
    });
    
    speechRecognitionRef.current.start();
  };
  
  // Funktion zum Stoppen der Spracherkennung
  const stopRecording = async () => {
    speechRecognitionRef.current.stop();
    setIsRecording(false);
    
    if (temporaryNote.trim()) {
      // Text korrigieren lassen
      try {
        const corrected = await correctText(temporaryNote);
        setCorrectedNote(corrected);
        form.setValue('text', corrected);
      } catch (error) {
        console.error('Fehler bei der Textkorrektur:', error);
        form.setValue('text', temporaryNote);
      }
    }
  };
  
  // PDF-Generierung mit der ausgewählten Vorlage wurde entfernt (doppelte Definition)
  
  // Funktion zum Speichern einer Notiz
  const saveNote = (data: NoteFormValues) => {
    // Position hinzufügen, wenn verfügbar
    if (currentLocation) {
      data.latitude = currentLocation.lat;
      data.longitude = currentLocation.lng;
    }
    
    // Bodenklasse hinzufügen, wenn ausgewählt
    if (selectedSoilClass) {
      data.soilClass = selectedSoilClass.name;
    }
    
    // Projekt-ID hinzufügen
    data.projectId = projectId;
    
    // Notiz speichern
    createNoteMutation.mutate(data);
  };
  
  // Funktion zum Generieren einer PDF-Datei
  const generatePDF = async () => {
    if (!project) return;
    
    setPdfGenerating(true);
    
    try {
      // PDF generieren und als Blob zurückgeben mit der ausgewählten Vorlage
      const pdfGenerator = TiefbauPDFGeneratorUpdated as any;
      
      // Beispiel-Vorschaubilder aus den Notiz-Anhängen umwandeln
      const photoAttachments = [];
      try {
        if (noteAttachments && noteAttachments.length > 0) {
          for (const attachment of noteAttachments) {
            photoAttachments.push({
              src: attachment.preview,
              caption: attachment.file.name
            });
          }
        }
      } catch (error) {
        console.warn('Fehler beim Verarbeiten der Anhänge:', error);
      }
      
      const pdfBlob = await pdfGenerator.generatePDF({
        project,
        route: routeData || [],
        notes: notes,
        soilClasses: selectedSoilClass ? [selectedSoilClass] : [],
        photos: photoAttachments,
        templateId: selectedTemplateId
      });
      
      // Blob-URL erstellen
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      toast({
        title: 'PDF generiert',
        description: `Die PDF-Datei wurde erfolgreich mit der Vorlage "${selectedTemplateId}" generiert.`,
      });
    } catch (error) {
      console.error('Fehler beim Generieren der PDF:', error);
      toast({
        title: 'Fehler',
        description: 'Die PDF-Datei konnte nicht generiert werden.',
        variant: 'destructive',
      });
    } finally {
      setPdfGenerating(false);
    }
  };
  
  // Funktion zum Herunterladen der PDF-Datei
  const downloadPDF = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Tiefbau-Bericht_${project?.name || 'Unbenannt'}_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Funktion zum Speichern der aktuellen Kartenansicht
  const saveMapView = () => {
    if (!mapInstance || !savedMapViewName.trim() || !projectId) return;
    
    const center = mapInstance.getCenter();
    const zoom = mapInstance.getZoom();
    
    if (!center || !zoom) return;
    
    const newView = {
      id: Date.now().toString(),
      name: savedMapViewName,
      center: { lat: center.lat(), lng: center.lng() },
      zoom
    };
    
    const updatedViews = [...savedMapViews, newView];
    setSavedMapViews(updatedViews);
    
    // In LocalStorage speichern
    try {
      localStorage.setItem(`tiefbau-map-views-${projectId}`, JSON.stringify(updatedViews));
      
      toast({
        title: 'Kartenansicht gespeichert',
        description: `Die Kartenansicht "${savedMapViewName}" wurde gespeichert.`,
      });
      
      setSavedMapViewName('');
      setSaveMapViewOpen(false);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Die Kartenansicht konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    }
  };
  
  // Funktion zum Laden einer gespeicherten Kartenansicht
  const loadMapView = (view: { center: {lat: number, lng: number}, zoom: number }) => {
    if (!mapInstance) return;
    
    mapInstance.setCenter(view.center);
    mapInstance.setZoom(view.zoom);
  };
  
  // Funktion zum Löschen einer gespeicherten Kartenansicht
  const deleteMapView = (id: string) => {
    const updatedViews = savedMapViews.filter(view => view.id !== id);
    setSavedMapViews(updatedViews);
    
    // In LocalStorage speichern
    try {
      localStorage.setItem(`tiefbau-map-views-${projectId}`, JSON.stringify(updatedViews));
      
      toast({
        title: 'Kartenansicht gelöscht',
        description: 'Die Kartenansicht wurde gelöscht.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Die Kartenansicht konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };
  
  // Handler für Kartenänderungen
  const handleRouteChange = (
    route: Array<{lat: number, lng: number}>, 
    startAddress?: string, 
    endAddress?: string,
    routeDistance?: number
  ) => {
    setRouteData(route);
  };
  
  // Handler für Bodenklassen-Auswahl
  const handleSoilClassSelect = (soilClass: Bodenklasse) => {
    setSelectedSoilClass(soilClass);
    toast({
      title: `Bodenklasse ${soilClass.name} ausgewählt`,
      description: soilClass.beschreibung || 'Keine Beschreibung verfügbar',
    });
  };
  
  // Wenn Projekt geladen wird
  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Projekt wird geladen...</span>
      </div>
    );
  }
  
  // Wenn ein Fehler auftritt
  if (projectError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Fehler beim Laden des Projekts</h2>
        <p className="text-muted-foreground text-center">
          Das Projekt konnte nicht geladen werden. Bitte versuchen Sie es später erneut.
        </p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/projekte')}
        >
          Zurück zur Projektübersicht
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-4 mx-auto">
      {/* Projekt-Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{project?.name || 'Unbenanntes Projekt'}</h1>
          <p className="text-muted-foreground">
            {project?.customerName ? `Kunde: ${project.customerName}` : 'Kein Kunde angegeben'} 
            {project?.address && ` | ${project.address}, ${project.city || ''}`}
          </p>
        </div>
        <div className="flex mt-2 md:mt-0 space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={pdfGenerating}>
                <FileText className="h-4 w-4 mr-2" />
                PDF generieren
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tiefbau-Bericht als PDF</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {pdfGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>PDF wird generiert...</p>
                  </div>
                ) : pdfUrl ? (
                  <div className="flex flex-col items-center">
                    <p className="mb-4">PDF wurde erfolgreich generiert.</p>
                    <Button onClick={downloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF herunterladen
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mb-4">
                      Generieren Sie einen vollständigen Tiefbau-Bericht als PDF-Datei.
                      Der Bericht enthält alle Projektdaten, Notizen, Streckeninformationen und Bodenklassen.
                    </p>
                    <Button onClick={generatePDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF jetzt generieren
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('/projekte')}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
      
      {/* Hauptinhalt */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-1">
          <TabsList>
            <TabsTrigger value="karte" className="px-4">
              <Map className="h-4 w-4 mr-2" />
              Karte
            </TabsTrigger>
            <TabsTrigger value="notizen" className="px-4">
              <SquarePen className="h-4 w-4 mr-2" />
              Feldnotizen
            </TabsTrigger>
            <TabsTrigger value="dokumente" className="px-4">
              <FileCheck className="h-4 w-4 mr-2" />
              Dokumente
            </TabsTrigger>
            <TabsTrigger value="datenbank" className="px-4">
              <Database className="h-4 w-4 mr-2" />
              Daten
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Kartenansicht */}
        <TabsContent value="karte" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Karte */}
            <Card className="lg:col-span-3 shadow-sm">
              <CardContent className="p-0 relative">
                {/* Karten-Container mit verbesserten Layout-Eigenschaften */}
                <div className="relative w-full h-[600px]" style={{ isolation: 'isolate' }}>
                  {mapCenter && (
                    <React.Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span>Karte wird geladen...</span>
                        </div>
                      </div>
                    }>
                      <div className="absolute inset-0 rounded-md overflow-hidden" style={{ zIndex: 1 }}>
                        <IntegratedGoogleMap
                          initialCenter={mapCenter}
                          initialZoom={14}
                          height="100%"
                          className="w-full"
                          onMapReady={setMapInstance}
                          showSearch={false}
                        />
                      </div>
                    </React.Suspense>
                  )}
                
                  {/* Aktionsbuttons - neu positioniert mit angepasstem z-index */}
                  <div className="absolute top-2 right-2 z-50 flex gap-2 p-1 rounded bg-white/90 shadow-md" style={{ isolation: 'isolate' }}>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 shadow-sm" 
                      onClick={() => setPdfDialogOpen(true)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      PDF-Bericht
                    </Button>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 shadow-sm bg-white hover:bg-white"
                            onClick={() => navigate('/bodenklassen-overlay')}
                          >
                            <Layers className="h-4 w-4 mr-1 text-green-600" />
                            Bodenklassen
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs">
                          Separate Seite mit Bodenklassen-Overlay für bessere Performance
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 shadow-sm bg-white hover:bg-white"
                            onClick={() => setShowStatistics(prev => !prev)}
                          >
                            <BarChart className="h-4 w-4 mr-1 text-blue-600" />
                            API-Status
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs">
                          Google Maps API Nutzungsstatistik mit Cache-Status anzeigen
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
                  
                  <Popover open={saveMapViewOpen} onOpenChange={setSaveMapViewOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 shadow-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        Ansichten
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-72">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Kartenansicht speichern</h4>
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Name der Ansicht" 
                            value={savedMapViewName}
                            onChange={(e) => setSavedMapViewName(e.target.value)}
                            className="text-xs"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={saveMapView}
                            disabled={!savedMapViewName.trim()}
                          >
                            <Save className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        {savedMapViews.length > 0 && (
                          <>
                            <h4 className="font-medium text-sm pt-2">Gespeicherte Ansichten</h4>
                            <ScrollArea className="h-48">
                              <div className="space-y-1">
                                {savedMapViews.map(view => (
                                  <div key={view.id} className="flex items-center justify-between py-1 border-b border-border/40 last:border-b-0">
                                    <button
                                      className="text-sm hover:text-primary transition-colors text-left flex-1 truncate"
                                      onClick={() => loadMapView(view)}
                                    >
                                      {view.name}
                                    </button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => deleteMapView(view.id)}
                                    >
                                      <Trash className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tiefbau-Map Content Ende */}
        </Tabs>
            
            {/* Bodenklassen-Steuerung */}
            <div className="space-y-4">
              <SoilClassOverlay 
                map={mapInstance}
                containerId={`map-${projectId || 'new'}`}
                isVisible={true}
                onVisibleChange={(visible) => {
                  console.log('Bodenklassen-Overlay sichtbar:', visible);
                }}
              />
              
              {/* Zusätzliche Karten-Tools */}
              <Card className="shadow-sm">
                <CardHeader className="py-3 px-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    Transport &amp; Logistik
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 space-y-2 text-sm">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="justify-start h-8">
                      <RouteIcon className="h-4 w-4 mr-2" />
                      Strecken berechnen
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start h-8">
                      <Ruler className="h-4 w-4 mr-2" />
                      Fläche vermessen
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start h-8">
                      <Shovel className="h-4 w-4 mr-2" />
                      Maschinenplanung
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Projektdaten */}
              {project && (
                <Card className="shadow-sm">
                  <CardHeader className="py-3 px-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <ListChecks className="h-4 w-4 mr-1" />
                      Projektdaten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 py-2 text-sm">
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-[80px_1fr] items-center">
                        <span className="text-muted-foreground">Projekt:</span>
                        <span className="font-medium truncate">{project.name}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] items-center">
                        <span className="text-muted-foreground">Kunde:</span>
                        <span>{project.customerName || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] items-center">
                        <span className="text-muted-foreground">Adresse:</span>
                        <span>{project.address || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] items-center">
                        <span className="text-muted-foreground">Ort:</span>
                        <span>{project.city || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] items-center">
                        <span className="text-muted-foreground">Notizen:</span>
                        <Badge variant="outline" className="w-fit">
                          {notes?.length || 0}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Notizen-Ansicht */}
        <TabsContent value="notizen" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Notiz-Editor */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Neue Feldnotiz</CardTitle>
                <CardDescription>
                  Erfassen Sie Notizen zur Baustelle mit optionaler Spracherkennung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form 
                    ref={noteFormRef}
                    onSubmit={form.handleSubmit(saveNote)} 
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notiz</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Textarea
                                placeholder="Notiz eingeben..."
                                className="min-h-[120px] pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute top-1 right-1 h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={isRecording ? stopRecording : startRecording}
                            >
                              {isRecording ? (
                                <MicOff className="h-4 w-4" />
                              ) : (
                                <Mic className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategorie</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Kategorie auswählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="allgemein">Allgemein</SelectItem>
                              <SelectItem value="bodenbeschaffenheit">Bodenbeschaffenheit</SelectItem>
                              <SelectItem value="hindernisse">Hindernisse</SelectItem>
                              <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                              <SelectItem value="material">Material</SelectItem>
                              <SelectItem value="maschinen">Maschinen</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="probleme">Probleme</SelectItem>
                              <SelectItem value="wetter">Wetter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isRecording && (
                      <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Spracherkennung aktiv</span>
                          <Badge variant="outline" className="bg-primary/10 text-xs">
                            aufzeichnend...
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          {temporaryNote || 'Sprechen Sie jetzt...'}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2">
                      {selectedSoilClass && (
                        <Badge 
                          variant="outline" 
                          className="flex items-center gap-1"
                          style={{ backgroundColor: `${selectedSoilClass.color || '#76a730'}20` }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: selectedSoilClass.color || '#76a730' }}
                          />
                          <span>{selectedSoilClass.name}</span>
                        </Badge>
                      )}
                      
                      <div className="flex gap-2 ml-auto">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => form.reset()}
                        >
                          Zurücksetzen
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createNoteMutation.isPending}
                        >
                          {createNoteMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Speichern
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Notizen-Liste */}
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Feldnotizen</CardTitle>
                  <Select
                    value={noteFilter}
                    onValueChange={filterNotes}
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Alle Kategorien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      <SelectItem value="allgemein">Allgemein</SelectItem>
                      <SelectItem value="bodenbeschaffenheit">Bodenbeschaffenheit</SelectItem>
                      <SelectItem value="hindernisse">Hindernisse</SelectItem>
                      <SelectItem value="infrastruktur">Infrastruktur</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="maschinen">Maschinen</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="probleme">Probleme</SelectItem>
                      <SelectItem value="wetter">Wetter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>
                  {notesLoading 
                    ? 'Notizen werden geladen...' 
                    : `${visibleNotes.length} Notizen gefunden`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : visibleNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <SquarePen className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Keine Notizen gefunden</p>
                    <p className="text-sm">
                      {noteFilter === 'all' 
                        ? 'Erstellen Sie eine neue Notiz, um sie hier anzuzeigen.'
                        : 'Versuchen Sie es mit einer anderen Kategorie oder erstellen Sie eine neue Notiz.'
                      }
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {visibleNotes.map((note) => (
                        <div 
                          key={note.id}
                          className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <Badge 
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {note.category}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarClock className="h-3 w-3" />
                              {new Date(note.createdAt).toLocaleDateString('de-DE')}
                            </div>
                          </div>
                          
                          <p className="text-sm mb-2">{note.text}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                              {note.soilClass && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-xs">
                                        {note.soilClass}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Bodenklasse: {note.soilClass}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              
                              {note.latitude && note.longitude && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Standort
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Koordinaten: {note.latitude.toFixed(6)}, {note.longitude.toFixed(6)}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            
                            <div className="text-xs flex items-center gap-1 text-muted-foreground">
                              <UserCircle className="h-3 w-3" />
                              {note.author || 'Anonym'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Dokumente-Ansicht */}
        <TabsContent value="dokumente" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Dokumentenverwaltung</CardTitle>
                <CardDescription>
                  Verwalten Sie alle projektbezogenen Dokumente und Dateien
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/40 border-2 border-dashed border-muted rounded-md p-8 text-center">
                  <CloudUpload className="h-10 w-10 mx-auto text-muted-foreground/70" />
                  <p className="mt-2 text-muted-foreground">
                    Zum Hochladen ziehen Sie Dateien hierher oder klicken Sie
                  </p>
                  <Button className="mt-4" variant="secondary">
                    <FileUp className="h-4 w-4 mr-2" />
                    Dateien auswählen
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Dokumentenstatistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">PDF-Dokumente</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bilder</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Excel-Tabellen</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sonstige</span>
                      <span className="font-medium">2</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-sm">Gesamt</span>
                      <span>25</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Aktionen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <FileDown className="h-4 w-4 mr-2" />
                      Alle herunterladen
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Freigabe-Link erstellen
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Table className="h-4 w-4 mr-2" />
                      Dokumentenliste exportieren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Datenbank-Ansicht */}
        <TabsContent value="datenbank" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="shadow-sm lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Projektdatenbank</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <CardDescription>
                  Zentrale Verwaltung aller projektbezogenen Daten und Informationen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-2 px-3 text-left font-medium">ID</th>
                        <th className="py-2 px-3 text-left font-medium">Bezeichnung</th>
                        <th className="py-2 px-3 text-left font-medium">Kategorie</th>
                        <th className="py-2 px-3 text-left font-medium">Status</th>
                        <th className="py-2 px-3 text-left font-medium">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2.5 px-3">TFB-{1001 + i}</td>
                          <td className="py-2.5 px-3">Beispieldatensatz</td>
                          <td className="py-2.5 px-3">Allgemein</td>
                          <td className="py-2.5 px-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              Aktiv
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3">
                            {new Date().toLocaleDateString('de-DE')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Datenbankaktionen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <FileDown className="h-4 w-4 mr-2" />
                      Daten exportieren
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileUp className="h-4 w-4 mr-2" />
                      Daten importieren
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Erweiterte Suche
                    </Button>
                    <Separator className="my-2" />
                    <Button className="w-full justify-start" variant="default">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Neuen Eintrag erstellen
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Datenbankstatistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Speicherauslastung</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Datensätze</span>
                        <span className="text-sm font-medium">215/500</span>
                      </div>
                      <Progress value={43} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Letzte Änderung</span>
                        <span className="text-sm">Heute, 09:45</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* PDF-Bericht Dialog mit Vorlagenauswahl */}
      <TiefbauPDFDialog 
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        projectData={project}
        routeData={routeData || []}
        notes={notes || []}
        photos={noteAttachments?.map(attachment => ({
          src: attachment.preview,
          caption: attachment.file.name
        })) || []}
        soilClasses={selectedSoilClass ? [selectedSoilClass] : []}
      />
    </div>
  );
};

export default NewTiefbauMap;