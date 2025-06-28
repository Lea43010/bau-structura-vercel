import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Project, Milestone } from "@shared/schema";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit, Save, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CapacitySection } from "@/components/project/capacity-section";
import { MilestoneSection } from "@/components/project/milestone-section";
import { CostGroups } from "@/components/project/cost-groups";
import { ModernConstructionDiarySection } from "@/components/project/modern-construction-diary";
import PermissionSection from "@/components/project/permission-section";
import ProjectForm from "@/components/project/project-form";
import AttachmentUpload from "@/components/project/attachment-upload";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarClock, CheckSquare } from "lucide-react";
import SimpleProjectReportGenerator from "@/components/pdf/simple-project-report";

// Hilfsfunktion zur Berechnung der Kalenderwoche (ISO-Format)
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Berechnet die nächsten X Tage ab heute
const getDateXDaysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Konvertiert eine Kalenderwoche und ein Jahr in ein Date-Objekt
const approximateDateFromWeekAndYear = (week: number, year: number): Date => {
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  return date;
};

// Prüft, ob eine Kalenderwoche/Jahr in der Vergangenheit liegt
const isInPast = (week: number, year: number): boolean => {
  const today = new Date();
  const milestoneDate = approximateDateFromWeekAndYear(week, year);
  return milestoneDate < today;
};

// Prüft, ob eine Kalenderwoche/Jahr in den nächsten X Tagen liegt
const isInNextXDays = (week: number, year: number, days: number): boolean => {
  const today = new Date();
  const futureDate = getDateXDaysFromNow(days);
  const milestoneDate = approximateDateFromWeekAndYear(week, year);
  
  return milestoneDate >= today && milestoneDate <= futureDate;
};

// Hilfsfunktion für Kalenderwochenfarben basierend auf der Bauphase
const getBauphaseColor = (bauphase: string | null) => {
  switch (bauphase) {
    case 'Baustart Tiefbau FÖB':
      return 'bg-blue-100 border-blue-500 text-blue-700';
    case 'Baustart Tiefbau EWB':
      return 'bg-green-100 border-green-500 text-green-700';
    case 'Tiefbau EWB':
      return 'bg-teal-100 border-teal-500 text-teal-700';
    case 'Tiefbau FÖB':
      return 'bg-cyan-100 border-cyan-500 text-cyan-700';
    case 'Montage NE3 EWB':
      return 'bg-amber-100 border-amber-500 text-amber-700';
    case 'Montage NE3 FÖB':
      return 'bg-orange-100 border-orange-500 text-orange-700';
    case 'Endmontage NE4 EWB':
      return 'bg-purple-100 border-purple-500 text-purple-700';
    case 'Endmontage NE4 FÖB':
      return 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-700';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-700';
  }
};

// Berechnet die aktuelle Kalenderwoche
const getCurrentWeek = (): number => {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return weekNumber;
};

// Aktuelles Jahr
const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// MilestoneOverview-Komponente
function MilestoneOverview({ projectId }: { projectId: number }) {
  // Abfrage der Meilensteine für das Projekt
  const { data: milestones, isLoading } = useQuery<Milestone[]>({
    queryKey: [`/api/projects/${projectId}/milestones`], 
    enabled: !!projectId
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-36">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!milestones || milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-36 text-center text-muted-foreground">
        <CalendarClock className="h-10 w-10 mb-2 text-muted-foreground/50" />
        <p>Keine Meilensteine vorhanden.</p>
        <p className="text-sm">Fügen Sie Meilensteine im Reiter "Meilensteine" hinzu.</p>
      </div>
    );
  }
  
  // Sortiere Meilensteine nach Priorität
  const sortedMilestones = [...milestones].sort((a, b) => {
    // Priorität 1: Meilensteine in den nächsten 14 Tagen
    const aInNext14Days = isInNextXDays(a.startKW, a.jahr, 14);
    const bInNext14Days = isInNextXDays(b.startKW, b.jahr, 14);
    
    if (aInNext14Days && !bInNext14Days) return -1;
    if (!aInNext14Days && bInNext14Days) return 1;
    
    // Priorität 2: Aktuelle Meilensteine (startKW in Vergangenheit, endKW in Zukunft)
    const aIsActive = isInPast(a.startKW, a.jahr) && !isInPast(a.endKW, a.jahr);
    const bIsActive = isInPast(b.startKW, b.jahr) && !isInPast(b.endKW, b.jahr);
    
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    
    // Priorität 3: Zukünftige Meilensteine vor vergangenen
    const aInFuture = !isInPast(a.startKW, a.jahr);
    const bInFuture = !isInPast(b.startKW, b.jahr);
    
    if (aInFuture && !bInFuture) return -1;
    if (!aInFuture && bInFuture) return 1;
    
    // Priorität 4: Nach Kalenderwoche sortieren
    if (a.jahr !== b.jahr) return a.jahr - b.jahr;
    return a.startKW - b.startKW;
  });
  
  // Aktuelle KW und Jahr
  const currentWeek = getCurrentWeek();
  const currentYear = getCurrentYear();
  
  // Gruppieren nach Zeitpunkt (aktuell, bevorstehend, zukünftig, vergangen)
  const currentMilestones = sortedMilestones.filter(m => 
    isInPast(m.startKW, m.jahr) && 
    !isInPast(m.endKW, m.jahr)
  );
  
  const upcomingMilestones = sortedMilestones.filter(m => 
    isInNextXDays(m.startKW, m.jahr, 14) && 
    !isInPast(m.startKW, m.jahr)
  );
  
  // Maximale Anzahl der anzuzeigenden Elemente
  const maxItemsToShow = 6;
  
  // Bestimme, welche Meilensteine angezeigt werden sollen (Priorisierung)
  let milestonesToShow: Milestone[] = [];
  
  // Priorität 1: Aktuelle Meilensteine
  milestonesToShow = [...milestonesToShow, ...currentMilestones];
  
  // Priorität 2: Bevorstehende Meilensteine
  if (milestonesToShow.length < maxItemsToShow) {
    milestonesToShow = [
      ...milestonesToShow, 
      ...upcomingMilestones.slice(0, maxItemsToShow - milestonesToShow.length)
    ];
  }
  
  // Priorität 3: Die nächsten Meilensteine chronologisch
  if (milestonesToShow.length < maxItemsToShow) {
    const remainingMilestones = sortedMilestones
      .filter(m => !milestonesToShow.some(shown => shown.id === m.id))
      .slice(0, maxItemsToShow - milestonesToShow.length);
      
    milestonesToShow = [...milestonesToShow, ...remainingMilestones];
  }
  
  return (
    <div className="space-y-4">
      {milestonesToShow.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-36 text-center text-muted-foreground">
          <CalendarClock className="h-10 w-10 mb-2 text-muted-foreground/50" />
          <p>Keine Meilensteine vorhanden.</p>
          <p className="text-sm">Fügen Sie Meilensteine im Reiter "Meilensteine" hinzu.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {milestonesToShow.map((milestone, index) => {
              const isActive = isInPast(milestone.startKW, milestone.jahr) && 
                               !isInPast(milestone.endKW, milestone.jahr);
              
              const isUpcoming = isInNextXDays(milestone.startKW, milestone.jahr, 14) && 
                                !isInPast(milestone.startKW, milestone.jahr);
              
              return (
                <TooltipProvider key={milestone.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`flex justify-between items-center p-2 rounded-md border ${
                          getBauphaseColor(milestone.bauphase)
                        } hover:opacity-90 transition-opacity cursor-pointer relative overflow-hidden`}
                      >
                        {/* Status-Indikator */}
                        {isActive && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                        )}
                        {isUpcoming && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                        )}
                        
                        <div className="flex-1 pl-1">
                          <div className="font-medium line-clamp-1">
                            {milestone.name}
                          </div>
                          <div className="text-xs flex items-center space-x-1">
                            <span>
                              KW {milestone.startKW}-{milestone.endKW} ({milestone.jahr})
                            </span>
                            <Badge 
                              variant="secondary"
                              className={`text-xs ${
                                milestone.ewbFoeb === 'EWB' ? 'bg-green-100 text-green-800' :
                                milestone.ewbFoeb === 'FÖB' ? 'bg-blue-100 text-blue-800' :
                                milestone.ewbFoeb === 'EWB,FÖB' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {milestone.ewbFoeb || 'keine'}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Status-Anzeige */}
                        <div className="flex items-center">
                          {isActive && (
                            <Badge className="bg-green-500">
                              Aktiv
                            </Badge>
                          )}
                          {isUpcoming && (
                            <Badge className="bg-amber-500">
                              Bevorstehend
                            </Badge>
                          )}
                          {!isActive && !isUpcoming && isInPast(milestone.endKW, milestone.jahr) && (
                            <Badge variant="outline" className="border-green-500 text-green-700">
                              <CheckSquare className="h-3 w-3 mr-1" />
                              Abgeschlossen
                            </Badge>
                          )}
                          {!isActive && !isUpcoming && !isInPast(milestone.endKW, milestone.jahr) && (
                            <Badge variant="outline" className="border-gray-500 text-gray-700">
                              Geplant
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="space-y-1">
                        <div><strong>Meilenstein:</strong> {milestone.name}</div>
                        <div><strong>Bauphase:</strong> {milestone.bauphase}</div>
                        <div><strong>Typ:</strong> {milestone.type}</div>
                        <div><strong>EWB/FÖB:</strong> {milestone.ewbFoeb}</div>
                        {milestone.sollMenge && (
                          <div><strong>Soll-Menge:</strong> {milestone.sollMenge}</div>
                        )}
                        <div><strong>Zeitraum:</strong> KW {milestone.startKW} - KW {milestone.endKW} ({milestone.jahr})</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          
          {sortedMilestones.length > maxItemsToShow && (
            <div className="text-center text-sm text-muted-foreground pt-2">
              Weitere {sortedMilestones.length - maxItemsToShow} Meilensteine im Reiter "Meilensteine"
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const [, navigate] = useLocation();
  const [_, params] = useRoute("/projects/:id");
  const { user } = useAuth();
  const { toast } = useToast(); 
  const [isEditing, setIsEditing] = useState(false);
  const projectId = params?.id ? parseInt(params.id) : null;
  
  // Tab-Parameter aus URL extrahieren
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  // Redirect if no project ID is provided
  useEffect(() => {
    if (!projectId) {
      navigate("/projects");
    }
  }, [projectId, navigate]);

  // Fetch project data
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  // Berechtigungsprüfung mit useEffect
  useEffect(() => {
    if (project && user) {
      if (
        user.role !== "administrator" && 
        user.role !== "manager" && 
        project.createdBy !== user.id
      ) {
        toast({
          title: "Keine Berechtigung",
          description: "Sie haben keine Berechtigung, dieses Projekt anzusehen.",
          variant: "destructive"
        });
        navigate("/projects");
      }
    }
  }, [project, user, toast, navigate]);

  // Project update mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (!projectId) throw new Error("Projekt-ID fehlt");
      const response = await apiRequest("PUT", `/api/projects/${projectId}`, data);
      return await response.json();
    },
    onSuccess: (updatedProject) => {
      // Update cache
      queryClient.setQueryData([`/api/projects/${projectId}`], updatedProject);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/projects"] });
      
      // Exit editing mode
      setIsEditing(false);
      
      toast({
        title: "Projekt aktualisiert",
        description: "Das Projekt wurde erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: `Fehler beim Aktualisieren des Projekts: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleFormSubmit = async (data: Partial<Project>): Promise<Project> => {
    return new Promise((resolve, reject) => {
      updateProjectMutation.mutate(data, {
        onSuccess: (savedProject) => resolve(savedProject),
        onError: (error) => reject(error)
      });
    });
  };

  // Go back to projects list
  const handleBackToList = () => {
    navigate("/projects");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Projekt nicht gefunden.</p>
            <Button onClick={handleBackToList} className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Projektliste
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30"
                >
                  {project.projectStop ? "Gestoppt" : "Aktiv"}
                </Badge>
                <span className="text-purple-100">
                  Projektart: {project.projectArt || "Nicht angegeben"}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Liste
              </Button>
              <SimpleProjectReportGenerator project={project} />
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                Projekt bearbeiten
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isEditing ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="mb-6 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu Projektdetails
            </Button>

            <ProjectForm
              project={project}
              onSubmit={handleFormSubmit}
              isLoading={updateProjectMutation.isPending}
            />
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 bg-purple-50 p-2 rounded-lg">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Übersicht
                  </TabsTrigger>
                  <TabsTrigger 
                    value="permissions" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Genehmigungen
                  </TabsTrigger>
                  <TabsTrigger 
                    value="milestones" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Meilensteine
                  </TabsTrigger>
                  <TabsTrigger 
                    value="capacity" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Bedarf/Kapazitäten
                  </TabsTrigger>
                  <TabsTrigger 
                    value="diary" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Bautagebuch
                  </TabsTrigger>
                  {project.projectArt === "Hochbau" && (
                    <TabsTrigger 
                      value="costgroups" 
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                    >
                      Kostengruppen
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="attachments" 
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    Anhänge
                  </TabsTrigger>
                </TabsList>
              </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                    <CardTitle className="text-purple-900">Projektinformationen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Projektname:</div>
                      <div>{project.projectName}</div>
                      
                      <div className="font-medium">Projektart:</div>
                      <div>{project.projectArt || "Nicht angegeben"}</div>
                      
                      <div className="font-medium">Status:</div>
                      <div>
                        <Badge variant={project.projectStop ? "destructive" : "default"} className={project.projectStop ? "" : "bg-green-600"}>
                          {project.projectStop ? "Gestoppt" : "Aktiv"}
                        </Badge>
                      </div>
                      
                      <div className="font-medium">Startdatum:</div>
                      <div>
                        {project.projectStartdate ? (
                          <>
                            <span className="font-medium">KW {getWeekNumber(new Date(project.projectStartdate))}</span>
                            <span> {new Date(project.projectStartdate).toLocaleDateString()}</span>
                          </>
                        ) : (
                          "Nicht angegeben"
                        )}
                      </div>
                      
                      <div className="font-medium">Enddatum:</div>
                      <div>
                        {project.projectEnddate ? (
                          <>
                            <span className="font-medium">KW {getWeekNumber(new Date(project.projectEnddate))}</span>
                            <span> {new Date(project.projectEnddate).toLocaleDateString()}</span>
                          </>
                        ) : (
                          "Nicht angegeben"
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                    <CardTitle className="text-purple-900">Meilenstein-Übersicht</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <MilestoneOverview projectId={projectId!} />
                  </CardContent>
                </Card>

                {project.projectText && (
                  <Card className="md:col-span-2 border-purple-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                      <CardTitle className="text-purple-900">Projektnotizen</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="whitespace-pre-wrap text-gray-700">{project.projectText}</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                {project.id && <PermissionSection projectId={project.id} />}
              </div>
            </TabsContent>
            
            <TabsContent value="milestones" className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                {project.id && <MilestoneSection projectId={project.id} />}
              </div>
            </TabsContent>

            <TabsContent value="capacity" className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                {project.id && <CapacitySection projectId={project.id} />}
              </div>
            </TabsContent>

            {project.projectArt === "Hochbau" && (
              <TabsContent value="costgroups" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                  {project.id && <CostGroups projectId={project.id} />}
                </div>
              </TabsContent>
            )}

            <TabsContent value="diary" className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                {project.id && <ModernConstructionDiarySection projectId={project.id} />}
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                {project.id && <AttachmentUpload projectId={project.id} />}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>
    </div>
  );
}