import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  Mail,
  Calendar,
  MapPin,
  Phone,
  Building,
  Filter,
  Download,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layouts/dashboard-layout";

interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  phone?: string;
  company?: string;
  location?: string;
}

export default function ModernUserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  // Neue Benutzer-Formulardaten
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "user",
    password: "",
    phone: "",
    company: "",
    location: ""
  });

  // Benutzer laden
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        // Debug: Zeige die rohen Daten in der Konsole
        console.log('Rohe Benutzerdaten von API:', userData);
        
        // Verarbeite die Daten und stelle sicher, dass isActive korrekt gesetzt ist
        const processedUsers = userData.map(user => ({
          ...user,
          isActive: user.subscriptionStatus === 'active',
          subscription_status: user.subscriptionStatus || 'none'
        }));
        
        console.log('Verarbeitete Benutzerdaten:', processedUsers);
        setUsers(processedUsers);
      } else {
        toast({
          title: "Fehler beim Laden",
          description: "Benutzer konnten nicht geladen werden.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
      toast({
        title: "Verbindungsfehler",
        description: "Keine Verbindung zum Server möglich.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Benutzer hinzufügen
  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        toast({
          title: "Benutzer hinzugefügt",
          description: `${newUser.username} wurde erfolgreich erstellt.`
        });
        setIsAddDialogOpen(false);
        setNewUser({
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          role: "user",
          password: "",
          phone: "",
          company: "",
          location: ""
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Fehler beim Hinzufügen",
          description: errorData.message || "Benutzer konnte nicht erstellt werden.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verbindungsfehler",
        description: "Keine Verbindung zum Server möglich.",
        variant: "destructive"
      });
    }
  };

  // Benutzer bearbeiten
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(selectedUser)
      });

      if (response.ok) {
        toast({
          title: "Benutzer aktualisiert",
          description: `${selectedUser.username} wurde erfolgreich aktualisiert.`
        });
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Fehler beim Aktualisieren",
          description: errorData.message || "Benutzer konnte nicht aktualisiert werden.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verbindungsfehler",
        description: "Keine Verbindung zum Server möglich.",
        variant: "destructive"
      });
    }
  };

  // Benutzer löschen
  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Möchten Sie den Benutzer "${username}" wirklich löschen?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Benutzer gelöscht",
          description: `${username} wurde erfolgreich gelöscht.`
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast({
          title: "Fehler beim Löschen",
          description: errorData.message || "Benutzer konnte nicht gelöscht werden.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verbindungsfehler",
        description: "Keine Verbindung zum Server möglich.",
        variant: "destructive"
      });
    }
  };

  // Filterfunktionen
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.isActive !== false) ||
                         (statusFilter === "inactive" && user.isActive === false);
    const matchesVisibility = showInactiveUsers || user.isActive !== false;

    return matchesSearch && matchesRole && matchesStatus && matchesVisibility;
  });

  // Rollen-Badge-Farben
  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'administrator': return 'destructive';
      case 'manager': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  // Status-Badge-Farben und Text
  const getStatusBadgeVariant = (user: any) => {
    // Verwende das isActive Feld vom Backend oder prüfe status direkt
    return user && user.isActive === false ? 'destructive' : 'default';
  };

  const getStatusText = (user: any) => {
    // Verwende das isActive Feld vom Backend oder prüfe status direkt
    return user && user.isActive === false ? 'Inaktiv' : 'Aktiv';
  };

  // Statistiken berechnen (mit Null-Check)
  const stats = {
    total: users?.length || 0,
    active: users?.filter(u => u && u.isActive !== false).length || 0,
    inactive: users?.filter(u => u && u.isActive === false).length || 0,
    administrators: users?.filter(u => u && u.role === 'administrator').length || 0,
    managers: users?.filter(u => u && u.role === 'manager').length || 0,
    regularUsers: users?.filter(u => u && u.role === 'user').length || 0
  };

  if (loading) {
    return (
      <DashboardLayout title="Benutzerverwaltung" description="Moderne Benutzerverwaltung wird geladen...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Benutzerverwaltung" description="Moderne Verwaltung aller Systembenutzer">
      <div className="space-y-6">
        {/* Header mit Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gesamt</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aktiv</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inaktiv</p>
                  <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.administrators}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Steuerungsbereich */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Benutzerübersicht
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInactiveUsers(!showInactiveUsers)}
                  className="gap-2"
                >
                  {showInactiveUsers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showInactiveUsers ? "Inaktive ausblenden" : "Inaktive anzeigen"}
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Benutzer hinzufügen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Neuen Benutzer hinzufügen</DialogTitle>
                      <DialogDescription>
                        Erstellen Sie einen neuen Benutzeraccount.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Vorname</Label>
                          <Input
                            id="firstName"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            placeholder="Max"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nachname</Label>
                          <Input
                            id="lastName"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            placeholder="Mustermann"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="username">Benutzername</Label>
                        <Input
                          id="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          placeholder="mmustermann"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="max@beispiel.de"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Passwort</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="Sicheres Passwort"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Rolle</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Benutzer</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="administrator">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Telefon</Label>
                          <Input
                            id="phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                            placeholder="+49 123 456789"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Firma</Label>
                          <Input
                            id="company"
                            value={newUser.company}
                            onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                            placeholder="Musterfirma GmbH"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location">Standort</Label>
                        <Input
                          id="location"
                          value={newUser.location}
                          onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                          placeholder="München, Deutschland"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Abbrechen
                        </Button>
                        <Button onClick={handleAddUser}>
                          Benutzer erstellen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Benutzer suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rolle filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Rollen</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">Benutzer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Benutzerliste */}
            <div className="grid gap-4">
              {filteredUsers.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Keine Benutzer gefunden</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || roleFilter !== "all" || statusFilter !== "all" 
                      ? "Keine Benutzer entsprechen den aktuellen Filterkriterien."
                      : "Noch keine Benutzer im System vorhanden."}
                  </p>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {user.firstName && user.lastName 
                                ? `${user.firstName[0]}${user.lastName[0]}`
                                : user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.username}
                              </h3>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role === 'administrator' ? 'Admin' : 
                                 user.role === 'manager' ? 'Manager' : 'Benutzer'}
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(user.isActive)}>
                                {user.isActive !== false ? 'Aktiv' : 'Inaktiv'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                {user.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                  </div>
                                )}
                                {user.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                {user.company && (
                                  <div className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    {user.company}
                                  </div>
                                )}
                                {user.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {user.location}
                                  </div>
                                )}
                              </div>
                              {user.lastLogin && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Letzter Login: {new Date(user.lastLogin).toLocaleDateString('de-DE')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bearbeiten Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Benutzer bearbeiten</DialogTitle>
              <DialogDescription>
                Bearbeiten Sie die Benutzerdaten.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">Vorname</Label>
                    <Input
                      id="editFirstName"
                      value={selectedUser.firstName || ""}
                      onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">Nachname</Label>
                    <Input
                      id="editLastName"
                      value={selectedUser.lastName || ""}
                      onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editUsername">Benutzername</Label>
                  <Input
                    id="editUsername"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">E-Mail</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={selectedUser.email || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editRole">Rolle</Label>
                  <Select 
                    value={selectedUser.role || "user"} 
                    onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Benutzer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPhone">Telefon</Label>
                    <Input
                      id="editPhone"
                      value={selectedUser.phone || ""}
                      onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCompany">Firma</Label>
                    <Input
                      id="editCompany"
                      value={selectedUser.company || ""}
                      onChange={(e) => setSelectedUser({...selectedUser, company: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editLocation">Standort</Label>
                  <Input
                    id="editLocation"
                    value={selectedUser.location || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, location: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleEditUser}>
                    Speichern
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}