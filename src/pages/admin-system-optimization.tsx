import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Database, 
  HardDrive, 
  Zap, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2,
  TrendingUp
} from "lucide-react";

export default function AdminSystemOptimization() {
  const { toast } = useToast();

  // Session-Statistiken
  const { data: sessionStats, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/admin/session-statistics"],
    refetchInterval: 30000
  });

  // Backup-Statistiken
  const { data: backupStats, isLoading: backupLoading } = useQuery({
    queryKey: ["/api/admin/backup-statistics"],
    refetchInterval: 60000
  });

  // Performance-Statistiken
  const { data: performanceStats, isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/admin/performance-statistics"],
    refetchInterval: 60000
  });

  // Session-Bereinigung
  const sessionCleanupMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/cleanup-sessions"),
    onSuccess: (data) => {
      toast({
        title: "Session-Bereinigung erfolgreich",
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session-statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler bei Session-Bereinigung",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Backup-Erstellung
  const createBackupMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/create-backup"),
    onSuccess: (data) => {
      toast({
        title: "Backup erfolgreich erstellt",
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/backup-statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler bei Backup-Erstellung",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Performance-Optimierung
  const optimizePerformanceMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/optimize-performance"),
    onSuccess: (data) => {
      toast({
        title: "Performance-Optimierung abgeschlossen",
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/performance-statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler bei Performance-Optimierung",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL': case 'OK': case 'SECURE': return 'bg-green-500';
      case 'WARNING': return 'bg-yellow-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return (
      <Badge className={`${color} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">System-Optimierung</h1>
          <p className="text-muted-foreground mt-2">
            Überwachung und Optimierung kritischer Systemkomponenten
          </p>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Session-Management
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Backup-Strategie
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance-Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktive Sessions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sessionLoading ? "..." : sessionStats?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Derzeit angemeldete Benutzer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abgelaufene Sessions</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sessionLoading ? "..." : sessionStats?.expired || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bereinigung erforderlich
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gesamt Sessions</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sessionLoading ? "..." : sessionStats?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  In der Datenbank
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Session-Bereinigung
              </CardTitle>
              <CardDescription>
                Automatische Bereinigung läuft alle 6 Stunden. Manuelle Bereinigung bei Bedarf.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => sessionCleanupMutation.mutate()}
                disabled={sessionCleanupMutation.isPending}
                className="bg-[#76a730] hover:bg-[#6a961f]"
              >
                {sessionCleanupMutation.isPending ? "Bereinige..." : "Sessions jetzt bereinigen"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backup-Status</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {backupLoading ? "..." : 
                    backupStats?.dataIntegrity?.status ? 
                    getStatusBadge(backupStats.dataIntegrity.status) : "Unbekannt"}
                </div>
                <p className="text-xs text-muted-foreground">
                  107 kritische NOT NULL Spalten
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Letzte Sicherung</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {backupLoading ? "..." : backupStats?.backupStats?.lastBackup || "Noch keine"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatisch täglich um 01:00 Uhr
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backup-Größe</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {backupLoading ? "..." : 
                    backupStats?.backupStats?.backupSize ? 
                    `${Math.round(backupStats.backupStats.backupSize / 1024)} KB` : "0 KB"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {backupStats?.backupStats?.totalBackups || 0} Backup-Dateien
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Kritische Daten-Sicherung
              </CardTitle>
              <CardDescription>
                Sicherung von 107 kritischen NOT NULL Spalten in 11 Haupttabellen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={() => createBackupMutation.mutate()}
                  disabled={createBackupMutation.isPending}
                  className="bg-[#76a730] hover:bg-[#6a961f]"
                >
                  {createBackupMutation.isPending ? "Erstelle Backup..." : "Backup jetzt erstellen"}
                </Button>
              </div>
              
              {backupStats?.dataIntegrity?.issues && backupStats.dataIntegrity.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Erkannte Integritätsprobleme:</h4>
                  <div className="space-y-1">
                    {backupStats.dataIntegrity.issues.map((issue: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>{issue.table}: {issue.issue} ({issue.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System-Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceLoading ? "..." : 
                    performanceStats?.systemHealth ? 
                    getStatusBadge(performanceStats.systemHealth) : "Unbekannt"}
                </div>
                <p className="text-xs text-muted-foreground">
                  30 unbegrenzte Textfelder überwacht
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ø Antwortzeit</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceLoading ? "..." : 
                    `${performanceStats?.queryPerformance?.avgResponseTime || 0}ms`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Letzte 24 Stunden
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Textfeld-Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceLoading ? "..." : 
                    performanceStats?.textFieldAnalysis?.status ? 
                    getStatusBadge(performanceStats.textFieldAnalysis.status) : "Unbekannt"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatische Überwachung alle 4h
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance-Optimierung
              </CardTitle>
              <CardDescription>
                Automatische Optimierung für Textfelder und Datenbankabfragen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => optimizePerformanceMutation.mutate()}
                disabled={optimizePerformanceMutation.isPending}
                className="bg-[#76a730] hover:bg-[#6a961f]"
              >
                {optimizePerformanceMutation.isPending ? "Optimiere..." : "Performance jetzt optimieren"}
              </Button>

              {performanceStats?.textFieldAnalysis?.recommendations && performanceStats.textFieldAnalysis.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Empfehlungen:</h4>
                  <div className="space-y-1">
                    {performanceStats.textFieldAnalysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}