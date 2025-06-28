import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Customer } from "@shared/schema";
import CustomerForm from "@/components/customer/customer-form";
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
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2,
  Grid,
  List,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ModernCustomerPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create or update customer mutation
  const saveCustomerMutation = useMutation({
    mutationFn: async (customer: Partial<Customer>) => {
      if (customer.id) {
        const res = await apiRequest("PUT", `/api/customers/${customer.id}`, customer);
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/customers", customer);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsEditing(false);
      setCurrentCustomer(null);
      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Kundendaten wurden erfolgreich gespeichert.",
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

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: number) => {
      await apiRequest("DELETE", `/api/customers/${customerId}`);
    },
    onSuccess: () => {
      // Invalidate and refetch customers data immediately
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.refetchQueries({ queryKey: ["/api/customers"] });
      setIsDeleteDialogOpen(false);
      setCurrentCustomer(null);
      toast({
        title: "Erfolgreich gelöscht",
        description: "Der Kunde wurde erfolgreich gelöscht.",
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

  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setIsEditing(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentCustomer?.id) {
      deleteCustomerMutation.mutate(currentCustomer.id);
    }
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unbenannter Kunde'}
            </CardTitle>
            {customer.customerType && (
              <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                {customer.customerType}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditCustomer(customer)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteCustomer(customer)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {(customer.street || customer.city) && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                {customer.street && <div>{customer.street} {customer.houseNumber}</div>}
                {customer.city && (
                  <div>
                    {customer.postalCode} {customer.city}
                    {customer.cityPart && `, ${customer.cityPart}`}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {customer.customerPhone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{customer.customerPhone}</span>
            </div>
          )}
          
          {customer.customerEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{customer.customerEmail}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Kundendaten">
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Kundendaten werden geladen...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Kundendaten">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white border-0">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2 flex items-center">
                      <Users className="mr-3 h-8 w-8" />
                      Kundendaten
                    </CardTitle>
                    <CardDescription className="text-green-100 text-lg">
                      Verwalten Sie Ihre Kundendaten und Kontaktinformationen
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-500 text-white border-green-400">
                    {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Kunde' : 'Kunden'}
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
                      placeholder="Kunden durchsuchen..."
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
                    
                    <Button onClick={handleAddCustomer} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Neuer Kunde
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Keine Kunden gefunden' : 'Noch keine Kunden vorhanden'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Versuchen Sie einen anderen Suchbegriff.'
                      : 'Erstellen Sie Ihren ersten Kunden, um zu beginnen.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAddCustomer} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ersten Kunden erstellen
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
              {filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
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
              {currentCustomer ? 'Kunde bearbeiten' : 'Neuen Kunden erstellen'}
            </DialogTitle>
            <DialogDescription>
              {currentCustomer 
                ? 'Bearbeiten Sie die Kundendaten.'
                : 'Erstellen Sie einen neuen Kunden mit allen notwendigen Informationen.'
              }
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            customer={currentCustomer}
            onSave={(customer) => saveCustomerMutation.mutate(customer)}
            onCancel={() => setIsEditing(false)}
            isLoading={saveCustomerMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kunde löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie den Kunden "{currentCustomer?.customerName}" löschen möchten? 
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
              disabled={deleteCustomerMutation.isPending}
            >
              {deleteCustomerMutation.isPending ? 'Wird gelöscht...' : 'Löschen'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}