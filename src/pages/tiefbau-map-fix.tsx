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
  BarChart,
  Activity,
  Eye
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
import MapContainer from '@/components/maps/map-container';

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

// Tiefbau-Map Komponente mit korrigierter Layout-Struktur
const TiefbauMapFix: React.FC = () => {
  // Route und ID des Projekts
  const [match, params] = useRoute('/tiefbau-map-fix/:id');
  const projectId = match ? parseInt(params.id) : undefined;
  const [, navigate] = useLocation();

  // Berechtigungs-Hook
  const permissions = usePermissions();
  const canEdit = permissions.isAdmin || permissions.isManager;
  const canDeleteAttachments = permissions.isAdmin;
  
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
  const [projectDetailsVisible, setProjectDetailsVisible] = useState(true);
  const [apiStatusDialogOpen, setApiStatusDialogOpen] = useState(false);
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
    data: project = {} as ProjectData, 
    isLoading: projectLoading,
    error: projectError,
  } = useQuery<ProjectData>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });
  
  // Notizen laden
  const {
    data: projectNotes = [], 
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

  // Rendert die Hauptkomponente
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shovel className="h-6 w-6 text-primary" />
            Tiefbau-Kartografie
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            Detaillierte Karten mit Bodeninformationen und Projektdaten
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Zurück
          </Button>
        </div>
      </div>
      
      {projectLoading ? (
        <div className="flex justify-center my-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span>Projekt wird geladen...</span>
          </div>
        </div>
      ) : projectError ? (
        <div className="my-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Fehler beim Laden des Projekts</h2>
          <p className="text-muted-foreground mb-4">Das Projekt konnte nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
          <Button onClick={() => navigate('/')} variant="outline">Zurück zur Übersicht</Button>
        </div>
      ) : (
        <>
          {/* Projekt-Header */}
          {project && projectDetailsVisible && (
            <Card className="shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Projekt: {project.name}
                </CardTitle>
                <CardDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-sm font-medium block">Kunde:</span>
                      <span className="text-sm text-muted-foreground">{project.customerName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Firma:</span>
                      <span className="text-sm text-muted-foreground">{project.companyName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Adresse:</span>
                      <span className="text-sm text-muted-foreground">{project.address}, {project.city}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Zeitraum:</span>
                      <span className="text-sm text-muted-foreground">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('de-DE') : 'k.A.'} - 
                        {project.endDate ? new Date(project.endDate).toLocaleDateString('de-DE') : 'k.A.'}
                      </span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          
          {/* Tab-Navigation */}
          <Tabs defaultValue="karte" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="karte" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                Karte
              </TabsTrigger>
              <TabsTrigger value="notizen" className="flex items-center gap-1">
                <SquarePen className="h-4 w-4" />
                Notizen
              </TabsTrigger>
              <TabsTrigger value="dokumente" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Dokumente
              </TabsTrigger>
              <TabsTrigger value="datenbank" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                Datenbank
              </TabsTrigger>
            </TabsList>
            
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

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 shadow-sm bg-white hover:bg-white"
                                onClick={() => setProjectDetailsVisible(!projectDetailsVisible)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              Projektdetails {projectDetailsVisible ? 'verbergen' : 'anzeigen'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Bodenklassen-Steuerung */}
                <div className="space-y-4">
                  <SoilClassOverlay 
                    map={mapInstance}
                    containerId={`map-${projectId || 'new'}`}
                    isVisible={true}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Weitere Tabs wie im Original */}
          </Tabs>

          {/* Dialoge und Modals */}
          <TiefbauPDFDialog
            open={pdfDialogOpen}
            onOpenChange={setPdfDialogOpen}
            projectData={project}
            notes={notes}
            photos={[]}
            soilClasses={selectedSoilClass ? [selectedSoilClass] : []}
            routeData={routeData || []}
          />

          {/* API-Status-Dialog */}
          <Dialog open={apiStatusDialogOpen} onOpenChange={setApiStatusDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Google Maps API Status
                </DialogTitle>
              </DialogHeader>
              <MapStatistics isVisible={true} onClose={() => setApiStatusDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default TiefbauMapFix;