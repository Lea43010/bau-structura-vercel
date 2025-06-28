import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Project } from "@shared/schema";
import ProjectForm from "@/components/project/project-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  PlusCircle, 
  Search, 
  FolderOpen, 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2,
  Grid,
  List,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function ModernProjectPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.baustellenstandort?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create or update project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (project: Partial<Project>) => {
      if (project.id) {
        const res = await apiRequest("PUT", `/api/projects/${project.id}`, project);
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/projects", project);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsEditing(false);
      setCurrentProject(null);
      toast({
        title: "Erfolgreich gespeichert",
        description: "Das Projekt wurde erfolgreich gespeichert.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler beim Speichern",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch projects data immediately
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.refetchQueries({ queryKey: ["/api/projects"] });
      setIsDeleteDialogOpen(false);
      setCurrentProject(null);
      toast({
        title: "Erfolgreich gelöscht",
        description: "Das Projekt wurde erfolgreich gelöscht.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler beim Löschen",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    },
  });

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsEditing(true);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleDeleteProject = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentProject?.id) {
      deleteProjectMutation.mutate(currentProject.id);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>;
      case 'on_hold':
        return <Badge className="bg-yellow-100 text-yellow-800">Pausiert</Badge>;
      default:
        return <Badge variant="secondary">Geplant</Badge>;
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <FolderOpen className="h-5 w-5 mr-2 text-purple-600" />
              {project.projectName || 'Unbenanntes Projekt'}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(project.status)}
              {getStatusBadge(project.status)}
            </div>
          </div>
          <div className="flex gap-1">
            <Link href={`/projects/${project.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                title="Details anzeigen"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditProject(project)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteProject(project)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {project.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}
          
          {project.baustellenstandort && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{project.baustellenstandort}</span>
            </div>
          )}
          
          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {project.startDate && new Date(project.startDate).toLocaleDateString('de-DE')}
                {project.startDate && project.endDate && ' - '}
                {project.endDate && new Date(project.endDate).toLocaleDateString('de-DE')}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {project.status && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fortschritt</span>
                <span>
                  {project.status === 'completed' ? '100%' : 
                   project.status === 'in_progress' ? '45%' : 
                   project.status === 'on_hold' ? '25%' : '0%'}
                </span>
              </div>
              <Progress 
                value={
                  project.status === 'completed' ? 100 : 
                  project.status === 'in_progress' ? 45 : 
                  project.status === 'on_hold' ? 25 : 0
                } 
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Projektverwaltung">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Projekte werden geladen...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Projektverwaltung">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2 flex items-center">
                      <FolderOpen className="mr-3 h-8 w-8" />
                      Projektverwaltung
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-lg">
                      Verwalten Sie Ihre Bauprojekte und verfolgen Sie den Fortschritt
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500 text-white border-purple-400">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'Projekt' : 'Projekte'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="mb-6 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Projekte durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* View Toggle and Add Button */}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      onClick={() => setViewMode('list')}
                      size="sm"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      size="sm"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    
                    <Button onClick={handleAddProject} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Neues Projekt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Keine Projekte gefunden' : 'Noch keine Projekte vorhanden'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Versuchen Sie einen anderen Suchbegriff.'
                      : 'Erstellen Sie Ihr erstes Projekt, um zu beginnen.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAddProject} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Erstes Projekt erstellen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentProject ? 'Projekt bearbeiten' : 'Neues Projekt erstellen'}
            </DialogTitle>
            <DialogDescription>
              {currentProject 
                ? 'Bearbeiten Sie die Projektdaten.'
                : 'Erstellen Sie ein neues Projekt mit allen notwendigen Informationen.'
              }
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={currentProject}
            onSubmit={(project) => saveProjectMutation.mutate(project)}
            isLoading={saveProjectMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Projekt löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie das Projekt "{currentProject?.projectName}" löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden und entfernt alle zugehörigen Daten.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteProjectMutation.isPending}
            >
              {deleteProjectMutation.isPending ? 'Wird gelöscht...' : 'Löschen'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}