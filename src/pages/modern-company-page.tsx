import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Company } from "@shared/schema";
import CompanyForm from "@/components/company/company-form";
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
import { 
  PlusCircle, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2,
  Grid,
  List
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ModernCompanyPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch companies
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyArt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create or update company mutation
  const saveCompanyMutation = useMutation({
    mutationFn: async (company: Partial<Company>) => {
      if (company.id) {
        const res = await apiRequest("PUT", `/api/companies/${company.id}`, company);
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/companies", company);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsEditing(false);
      setCurrentCompany(null);
      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Firmendaten wurden erfolgreich gespeichert.",
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

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: number) => {
      await apiRequest("DELETE", `/api/companies/${companyId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch companies data immediately
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.refetchQueries({ queryKey: ["/api/companies"] });
      setIsDeleteDialogOpen(false);
      setCurrentCompany(null);
      toast({
        title: "Erfolgreich gelöscht",
        description: "Die Firma wurde erfolgreich gelöscht.",
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

  const handleAddCompany = () => {
    setCurrentCompany(null);
    setIsEditing(true);
  };

  const handleEditCompany = (company: Company) => {
    setCurrentCompany(company);
    setIsEditing(true);
  };

  const handleDeleteCompany = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentCompany?.id) {
      deleteCompanyMutation.mutate(currentCompany.id);
    }
  };

  const CompanyCard = ({ company }: { company: Company }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {company.companyName || 'Unbenannte Firma'}
            </CardTitle>
            {company.companyArt && (
              <Badge variant="secondary" className="mb-2">
                {company.companyArt}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditCompany(company)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteCompany(company)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {(company.street || company.city) && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                {company.street && <div>{company.street} {company.houseNumber}</div>}
                {company.city && (
                  <div>
                    {company.postalCode} {company.city}
                    {company.cityPart && `, ${company.cityPart}`}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {company.companyPhone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{company.companyPhone}</span>
            </div>
          )}
          
          {company.companyEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{company.companyEmail}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Firmendaten">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Firmendaten werden geladen...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2 flex items-center">
                      <Building2 className="mr-3 h-8 w-8" />
                      Firmendaten
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-lg">
                      Verwalten Sie Ihre Firmendaten und Kontaktinformationen
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500 text-white border-blue-400">
                    {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Firma' : 'Firmen'}
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
                      placeholder="Firmen durchsuchen..."
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
                    
                    <Button onClick={handleAddCompany} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Neue Firma
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          {filteredCompanies.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Keine Firmen gefunden' : 'Noch keine Firmen vorhanden'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Versuchen Sie einen anderen Suchbegriff.'
                      : 'Erstellen Sie Ihre erste Firma, um zu beginnen.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAddCompany} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Erste Firma erstellen
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
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentCompany ? 'Firma bearbeiten' : 'Neue Firma erstellen'}
            </DialogTitle>
            <DialogDescription>
              {currentCompany 
                ? 'Bearbeiten Sie die Firmendaten.'
                : 'Erstellen Sie eine neue Firma mit allen notwendigen Informationen.'
              }
            </DialogDescription>
          </DialogHeader>
          <CompanyForm
            company={currentCompany}
            onSave={(company) => saveCompanyMutation.mutate(company)}
            onCancel={() => setIsEditing(false)}
            isLoading={saveCompanyMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Firma löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie die Firma "{currentCompany?.companyName}" löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending ? 'Wird gelöscht...' : 'Löschen'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}