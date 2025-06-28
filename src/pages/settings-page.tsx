import { useState } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Lock,
  Palette,
  Globe,
  CreditCard,
  Settings,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [designSettings, setDesignSettings] = useState({
    theme: 'light',
    primaryColor: 'blue'
  });

  const [languageSettings, setLanguageSettings] = useState({
    language: 'de'
  });

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      // Hier würde die API-Anfrage zur Aktualisierung des Profils erfolgen
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profildaten wurden erfolgreich gespeichert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Profil konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Hier würde die API-Anfrage zur Passwort-Änderung erfolgen
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      toast({
        title: "Passwort geändert",
        description: "Ihr Passwort wurde erfolgreich aktualisiert.",
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Passwort konnte nicht geändert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionBadge = () => {
    const status = user?.subscriptionStatus || 'trial';
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Aktiv</Badge>;
      case 'trial':
        return <Badge variant="secondary">Testphase</Badge>;
      case 'expired':
        return <Badge variant="destructive">Abgelaufen</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  return (
    <DashboardLayout title="Einstellungen" tabs={[]}>
      {/* Header */}
      <div className="mb-6 p-6 bg-gradient-to-r from-gray-600 to-slate-700 rounded-xl text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Einstellungen</h1>
            <p className="text-gray-100 mt-1">Verwalten Sie Ihr Profil und Ihre Präferenzen</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Benutzerprofil */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Benutzerprofil</CardTitle>
                <CardDescription>Bearbeiten Sie Ihre persönlichen Daten</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Ihr vollständiger Name"
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="ihre@email.de"
              />
            </div>
            <div>
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                placeholder="benutzername"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleProfileSave}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Profil speichern
            </Button>
          </CardFooter>
        </Card>

        {/* Passwort ändern */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Passwort ändern</CardTitle>
                <CardDescription>Aktualisieren Sie Ihr Passwort</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Aktuelles Passwort"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Neues Passwort"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Passwort bestätigen"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handlePasswordChange}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Lock className="h-4 w-4 mr-2" />
              Passwort ändern
            </Button>
          </CardFooter>
        </Card>

        {/* Design-Einstellungen */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Design-Einstellungen</CardTitle>
                <CardDescription>Personalisieren Sie das Erscheinungsbild</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Design-Modus</Label>
              <Select value={designSettings.theme} onValueChange={(value) => setDesignSettings({ ...designSettings, theme: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Design auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Hell</SelectItem>
                  <SelectItem value="dark">Dunkel</SelectItem>
                  <SelectItem value="auto">Automatisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="primaryColor">Primärfarbe</Label>
              <Select value={designSettings.primaryColor} onValueChange={(value) => setDesignSettings({ ...designSettings, primaryColor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Farbe auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blau</SelectItem>
                  <SelectItem value="green">Grün</SelectItem>
                  <SelectItem value="purple">Lila</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Palette className="h-4 w-4 mr-2" />
              Design speichern
            </Button>
          </CardFooter>
        </Card>

        {/* Spracheinstellungen */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Spracheinstellungen</CardTitle>
                <CardDescription>Wählen Sie Ihre bevorzugte Sprache</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Sprache</Label>
              <Select value={languageSettings.language} onValueChange={(value) => setLanguageSettings({ ...languageSettings, language: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sprache auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Globe className="h-4 w-4 mr-2" />
              Sprache speichern
            </Button>
          </CardFooter>
        </Card>

        {/* Abonnement-Übersicht */}
        <Card className="lg:col-span-2 shadow-sm border-0 bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Abonnement-Übersicht</CardTitle>
                <CardDescription>Informationen zu Ihrem aktuellen Abonnement</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <div>{getSubscriptionBadge()}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Plan</Label>
                <p className="text-lg font-semibold">Professional</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Nächste Zahlung</Label>
                <p className="text-lg font-semibold">{user?.lastPaymentDate ? new Date(user.lastPaymentDate).toLocaleDateString('de-DE') : 'Nicht verfügbar'}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Kundennummer: {user?.id}</p>
                <p className="text-sm text-gray-600">Seit: {user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString('de-DE') : 'Nicht verfügbar'}</p>
              </div>
              <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
                Plan verwalten
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}