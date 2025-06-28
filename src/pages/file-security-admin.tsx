import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Shield, Download, FolderOpen, AlertTriangle } from 'lucide-react';

export default function FileSecurityAdmin() {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileAccessData, setFileAccessData] = useState(null);
  const [fileStatus, setFileStatus] = useState(null);
  const { toast } = useToast();

  const createCustomerAccess = async () => {
    if (!customerId) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine Kunden-ID ein",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', `/api/secure-file-access/create-customer-access/${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        setFileAccessData(data);
        toast({
          title: "Erfolg",
          description: `Sicherer Dateizugang für Kunde ${customerId} erstellt (${data.fileCount} Dateien)${data.emailSent ? ' und per E-Mail versendet' : ''}`,
        });
      } else {
        throw new Error(data.error || 'Unbekannter Fehler');
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: `Dateizugang konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFileStatus = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/secure-file-access/check-files-status');
      const data = await response.json();
      
      if (data.success) {
        setFileStatus(data);
        toast({
          title: "Status-Check abgeschlossen",
          description: `${data.summary.available} von ${data.summary.total} Dateien verfügbar (${data.summary.availabilityRate}%)`,
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: `Status-Check fehlgeschlagen: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Dateisicherheit & Kundenzugang</h1>
      </div>

      {/* Kritische Warnung */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Kritische Dateispeicher-Situation
          </CardTitle>
          <CardDescription className="text-orange-700">
            Alle Kundendateien sind aktuell nur lokal gespeichert. Bei System-Neustarts können Dateien verloren gehen.
            Erstellen Sie sofort sichere Kundenzugänge für wichtige Kunden.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dateistatus-Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Dateistatus-Übersicht
          </CardTitle>
          <CardDescription>
            Prüfen Sie die Verfügbarkeit aller gespeicherten Dateien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkFileStatus} disabled={loading} className="mb-4">
            {loading ? 'Prüfe...' : 'Dateistatus prüfen'}
          </Button>
          
          {fileStatus && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{fileStatus.summary.total}</div>
                <div className="text-sm text-blue-800">Gesamt</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{fileStatus.summary.available}</div>
                <div className="text-sm text-green-800">Verfügbar</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{fileStatus.summary.missing}</div>
                <div className="text-sm text-red-800">Fehlt</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-600">{fileStatus.summary.availabilityRate}%</div>
                <div className="text-sm text-gray-800">Verfügbarkeit</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kundenzugang erstellen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Sicheren Kundenzugang erstellen
          </CardTitle>
          <CardDescription>
            Erstellen Sie unabhängige Download-Links für einen Kunden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customerId">Kunden-ID</Label>
            <Input
              id="customerId"
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="z.B. 1"
            />
          </div>
          
          <Button onClick={createCustomerAccess} disabled={loading} className="w-full">
            {loading ? 'Erstelle Zugang...' : 'Sicheren Dateizugang erstellen'}
          </Button>
        </CardContent>
      </Card>

      {/* Ergebnis-Anzeige */}
      {fileAccessData && (
        <Card>
          <CardHeader>
            <CardTitle>Dateizugang erfolgreich erstellt</CardTitle>
            <CardDescription>
              Kunde {fileAccessData.customerId} - {fileAccessData.fileCount} Dateien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* FTP-Zugangsdaten */}
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-2">FTP-Zugangsdaten</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Server:</strong> {fileAccessData.ftpAccess.server}</div>
                <div><strong>Port:</strong> {fileAccessData.ftpAccess.port}</div>
                <div><strong>Benutzername:</strong> {fileAccessData.ftpAccess.username}</div>
                <div><strong>Passwort:</strong> {fileAccessData.ftpAccess.password}</div>
              </div>
            </div>

            {/* Download-Links */}
            <div>
              <h3 className="font-semibold mb-2">Sichere Download-Links ({fileAccessData.secureLinks.length})</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {fileAccessData.secureLinks.map((link, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                    <div className="font-medium">{link.fileName}</div>
                    <div className="text-gray-600">Projekt: {link.projectName}</div>
                    <div className="text-blue-600 break-all">{link.downloadUrl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vollständiges Zugangs-Dokument */}
            <div>
              <Label htmlFor="accessDocument">Vollständiges Zugangs-Dokument (zum Kopieren)</Label>
              <Textarea
                id="accessDocument"
                value={fileAccessData.accessDocument}
                readOnly
                rows={10}
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}