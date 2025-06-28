import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Database, 
  Activity,
  Eye,
  Download,
  Trash2,
  Play,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  Zap,
  RefreshCw
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ModernDataQualityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  // Mock data for demonstration - in real app this would come from API
  const qualityReports = [
    {
      id: 1,
      name: "Vollständige Datenprofilierung - tblproject",
      type: "profile",
      status: "completed",
      createdAt: "2024-05-20",
      fileSize: "2.4 MB",
      issues: 3,
      score: 92
    },
    {
      id: 2,
      name: "Ausreißer-Analyse - tblcompany",
      type: "outliers",
      status: "completed",
      createdAt: "2024-05-19",
      fileSize: "1.8 MB",
      issues: 1,
      score: 98
    },
    {
      id: 3,
      name: "Datenvalidierung - tblcustomer",
      type: "validation",
      status: "running",
      createdAt: "2024-05-18",
      fileSize: "3.2 MB",
      issues: 0,
      score: 95
    }
  ];

  const qualityMetrics = {
    totalTables: 15,
    tablesChecked: 12,
    overallScore: 94,
    criticalIssues: 2,
    warnings: 8,
    lastCheck: "Vor 2 Stunden"
  };

  const filteredReports = qualityReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === "all" || report.type === filterType)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Abgeschlossen</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Läuft</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Fehler</Badge>;
      default:
        return <Badge variant="secondary">Unbekannt</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'profile':
        return <Badge className="bg-purple-100 text-purple-800">Profilierung</Badge>;
      case 'outliers':
        return <Badge className="bg-orange-100 text-orange-800">Ausreißer</Badge>;
      case 'validation':
        return <Badge className="bg-blue-100 text-blue-800">Validierung</Badge>;
      default:
        return <Badge variant="secondary">Sonstige</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout title="Datenqualität">
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-teal-600 to-teal-800 text-white border-0">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2 flex items-center">
                      <Database className="mr-3 h-8 w-8" />
                      Datenqualität
                    </CardTitle>
                    <CardDescription className="text-teal-100 text-lg">
                      Überwachen und verbessern Sie die Qualität Ihrer Daten
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{qualityMetrics.overallScore}%</div>
                    <div className="text-teal-200 text-sm">Gesamtbewertung</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-teal-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Geprüfte Tabellen</p>
                    <p className="text-2xl font-bold">{qualityMetrics.tablesChecked}/{qualityMetrics.totalTables}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Kritische Probleme</p>
                    <p className="text-2xl font-bold text-red-600">{qualityMetrics.criticalIssues}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Warnungen</p>
                    <p className="text-2xl font-bold text-yellow-600">{qualityMetrics.warnings}</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Letzte Prüfung</p>
                    <p className="text-lg font-semibold">{qualityMetrics.lastCheck}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">Qualitätsberichte</TabsTrigger>
              <TabsTrigger value="analysis">Neue Prüfung</TabsTrigger>
              <TabsTrigger value="monitoring">Überwachung</TabsTrigger>
            </TabsList>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Datenqualitätsberichte</CardTitle>
                      <CardDescription>Übersicht aller durchgeführten Qualitätsprüfungen</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Aktualisieren
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Berichte durchsuchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={filterType === "all" ? "default" : "outline"}
                        onClick={() => setFilterType("all")}
                        size="sm"
                      >
                        Alle
                      </Button>
                      <Button
                        variant={filterType === "profile" ? "default" : "outline"}
                        onClick={() => setFilterType("profile")}
                        size="sm"
                      >
                        Profile
                      </Button>
                      <Button
                        variant={filterType === "outliers" ? "default" : "outline"}
                        onClick={() => setFilterType("outliers")}
                        size="sm"
                      >
                        Ausreißer
                      </Button>
                      <Button
                        variant={filterType === "validation" ? "default" : "outline"}
                        onClick={() => setFilterType("validation")}
                        size="sm"
                      >
                        Validierung
                      </Button>
                    </div>
                  </div>

                  {/* Reports Grid */}
                  {filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                      <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Keine Berichte gefunden
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Starten Sie eine neue Datenqualitätsprüfung.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredReports.map((report) => (
                        <Card key={report.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-teal-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-semibold text-gray-900 truncate mb-2">
                                  {report.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeBadge(report.type)}
                                  {getStatusBadge(report.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Bewertung:</span>
                                  <span className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                                    {report.score}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Größe:</span>
                                <span>{report.fileSize}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Probleme:</span>
                                <span className={report.issues > 0 ? "text-red-600" : "text-green-600"}>
                                  {report.issues}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(report.createdAt).toLocaleDateString('de-DE')}</span>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ansehen
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Neue Datenqualitätsprüfung</CardTitle>
                  <CardDescription>Starten Sie eine umfassende Analyse Ihrer Daten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Prüfungsoptionen</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Datenprofilierung</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Ausreißer-Erkennung</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>Datenvalidierung</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>Vollständigkeitsprüfung</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Tabellen auswählen</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>Alle Tabellen</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>tblproject</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>tblcompany</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span>tblcustomer</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                      <Play className="mr-2 h-4 w-4" />
                      Prüfung starten
                    </Button>
                    <Button variant="outline">
                      <Zap className="mr-2 h-4 w-4" />
                      Schnellprüfung
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kontinuierliche Überwachung</CardTitle>
                  <CardDescription>Automatische Datenqualitätsprüfungen und Trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Überwachung konfigurieren
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Richten Sie automatische Prüfungen und Benachrichtigungen ein.
                    </p>
                    <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                      <Activity className="mr-2 h-4 w-4" />
                      Überwachung einrichten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}