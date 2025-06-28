/**
 * Offline-Recovery-System
 *
 * Diese Bibliothek bietet Funktionen für die Offline-Verfügbarkeit und Datensynchronisation
 * und stellt sicher, dass die Anwendung auch bei Verbindungsproblemen funktioniert.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from './queryClient';

// Netzwerkstatus-Typen
export enum NetworkStatus {
  Online = 'online',
  Offline = 'offline',
  Limited = 'limited'
}

// Speicher für ausstehende Requests
interface PendingRequest {
  id: string;
  url: string;
  method: string;
  body: any;
  timestamp: number;
  retryCount: number;
  lastRetry: number | null;
}

// Lokaler Store für ausstehende Anfragen
const STORAGE_KEY = 'bau-structura-pending-requests';
const MAX_RETRIES = 5;
const RETRY_DELAY_BASE = 5000; // 5 Sekunden Basisverzögerung

// Speichert ausstehende Requests für die spätere Synchronisation
function storePendingRequest(req: PendingRequest): void {
  try {
    // Bestehende Anfragen laden
    const pendingRequestsStr = localStorage.getItem(STORAGE_KEY);
    const pendingRequests: PendingRequest[] = pendingRequestsStr 
      ? JSON.parse(pendingRequestsStr) 
      : [];

    // Doppelte Anfragen vermeiden
    const existingReqIndex = pendingRequests.findIndex(r => r.id === req.id);
    if (existingReqIndex >= 0) {
      pendingRequests[existingReqIndex] = req;
    } else {
      pendingRequests.push(req);
    }

    // Speichern
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingRequests));
  } catch (error) {
    console.error('Fehler beim Speichern ausstehender Anfrage:', error);
  }
}

// Lädt alle ausstehenden Requests
function loadPendingRequests(): PendingRequest[] {
  try {
    const pendingRequestsStr = localStorage.getItem(STORAGE_KEY);
    return pendingRequestsStr ? JSON.parse(pendingRequestsStr) : [];
  } catch (error) {
    console.error('Fehler beim Laden ausstehender Anfragen:', error);
    return [];
  }
}

// Entfernt einen Request aus dem Speicher
function removePendingRequest(id: string): void {
  try {
    const pendingRequestsStr = localStorage.getItem(STORAGE_KEY);
    if (!pendingRequestsStr) return;
    
    const pendingRequests: PendingRequest[] = JSON.parse(pendingRequestsStr);
    const filteredRequests = pendingRequests.filter(req => req.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRequests));
  } catch (error) {
    console.error('Fehler beim Entfernen ausstehender Anfrage:', error);
  }
}

// Aktualisiert den Retry-Zähler einer ausstehenden Anfrage
function updatePendingRequestRetry(id: string): void {
  try {
    const pendingRequests = loadPendingRequests();
    const reqIndex = pendingRequests.findIndex(req => req.id === id);
    
    if (reqIndex >= 0) {
      pendingRequests[reqIndex].retryCount++;
      pendingRequests[reqIndex].lastRetry = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingRequests));
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Retry-Zählers:', error);
  }
}

// Überwacht den Netzwerkstatus
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(
    navigator.onLine ? NetworkStatus.Online : NetworkStatus.Offline
  );

  useEffect(() => {
    // Grundlegende Online/Offline-Erkennung
    const handleOnline = () => setStatus(NetworkStatus.Online);
    const handleOffline = () => setStatus(NetworkStatus.Offline);

    // Detailliertere Verbindungsprüfung mit Connectivity-API wenn verfügbar
    const checkConnectivity = async () => {
      if (!navigator.onLine) {
        setStatus(NetworkStatus.Offline);
        return;
      }

      try {
        // Einfachen Ping-Endpunkt prüfen
        const startTime = Date.now();
        const response = await fetch('/api/ping', { 
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
          // Kurzes Timeout für Verbindungsprüfung
          signal: AbortSignal.timeout(3000)
        });

        if (!response.ok) {
          setStatus(NetworkStatus.Limited);
          return;
        }

        const endTime = Date.now();
        const latency = endTime - startTime;

        // Hohe Latenz deutet auf eingeschränkte Verbindung hin
        if (latency > 1000) {
          setStatus(NetworkStatus.Limited);
        } else {
          setStatus(NetworkStatus.Online);
        }
      } catch (error) {
        // Verbindungsprobleme zum Server
        if (navigator.onLine) {
          setStatus(NetworkStatus.Limited);
        } else {
          setStatus(NetworkStatus.Offline);
        }
      }
    };

    // Event-Listener für grundlegende Statusänderungen
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Regelmäßige Prüfung für genaueren Status
    const intervalId = setInterval(checkConnectivity, 30000); // Alle 30 Sekunden
    
    // Initiale Prüfung
    checkConnectivity();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return status;
}

// Hook für die Synchronisierung von offline gespeicherten Daten
export function useSyncStatus() {
  const networkStatus = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lastSuccessfulSync, setLastSuccessfulSync] = useState<Date | null>(null);

  // Lädt die Anzahl der ausstehenden Änderungen
  const loadPendingChangesCount = useCallback(() => {
    const pendingRequests = loadPendingRequests();
    setPendingChanges(pendingRequests.length);
  }, []);

  // Versucht, eine einzelne Anfrage zu senden
  const processPendingRequest = useCallback(async (request: PendingRequest): Promise<boolean> => {
    try {
      // Exponentielles Backoff für Wiederholungen
      const backoffDelay = RETRY_DELAY_BASE * Math.pow(2, request.retryCount);
      const now = Date.now();
      
      // Wenn die letzte Wiederholung zu kurz her ist, überspringen
      if (request.lastRetry && (now - request.lastRetry) < backoffDelay) {
        return false;
      }
      
      // Request ausführen
      const response = await apiRequest(
        request.method,
        request.url,
        request.body
      );
      
      if (response.ok) {
        // Erfolgreiche Anfrage
        removePendingRequest(request.id);
        return true;
      } else {
        // Fehlgeschlagene Anfrage
        if (request.retryCount >= MAX_RETRIES) {
          // Maximale Wiederholungen erreicht
          console.warn('Maximale Wiederholungen erreicht für:', request);
          removePendingRequest(request.id);
          return true; // Als erledigt markieren, um Fortschritt zu machen
        } else {
          // Wiederholung planen
          updatePendingRequestRetry(request.id);
          return false;
        }
      }
    } catch (error) {
      console.error('Fehler bei Verarbeitung ausstehender Anfrage:', error);
      
      // Bei Netzwerkfehlern Wiederholung planen
      if (request.retryCount < MAX_RETRIES) {
        updatePendingRequestRetry(request.id);
      } else {
        removePendingRequest(request.id);
      }
      
      return false;
    }
  }, []);

  // Synchronisiert alle ausstehenden Anfragen
  const syncNow = useCallback(async () => {
    if (isSyncing || networkStatus !== NetworkStatus.Online) return;
    
    try {
      setIsSyncing(true);
      setProgress(0);
      
      const pendingRequests = loadPendingRequests();
      let completed = 0;
      
      if (pendingRequests.length === 0) {
        setIsSyncing(false);
        return;
      }
      
      for (const request of pendingRequests) {
        const success = await processPendingRequest(request);
        if (success) {
          completed++;
          setProgress(Math.round((completed / pendingRequests.length) * 100));
        }
      }
      
      // Aktualisiere den Status nach der Synchronisation
      setLastSuccessfulSync(new Date());
      loadPendingChangesCount();
    } catch (error) {
      console.error('Fehler bei der Synchronisierung:', error);
    } finally {
      setIsSyncing(false);
      setProgress(0);
    }
  }, [isSyncing, networkStatus, processPendingRequest, loadPendingChangesCount]);

  // Automatische Synchronisierung bei Netzwerkänderungen
  useEffect(() => {
    if (networkStatus === NetworkStatus.Online) {
      syncNow();
    }
  }, [networkStatus, syncNow]);

  // Überwache ausstehende Änderungen
  useEffect(() => {
    loadPendingChangesCount();
    
    // Regelmäßig ausstehende Änderungen aktualisieren
    const intervalId = setInterval(loadPendingChangesCount, 10000);
    
    return () => clearInterval(intervalId);
  }, [loadPendingChangesCount]);

  return {
    isSyncing,
    pendingChanges,
    progress,
    lastSuccessfulSync,
    syncNow
  };
}

// Wrapper für die API-Anfragen mit Offline-Unterstützung
export async function apiRequestWithOfflineSupport(
  method: string,
  url: string,
  body?: any
) {
  try {
    // Normale Anfrage versuchen
    const response = await apiRequest(method, url, body);
    return response;
  } catch (error) {
    // Bei Netzwerkfehlern im lokalen Speicher speichern
    if (!navigator.onLine) {
      const request: PendingRequest = {
        id: `${method}-${url}-${Date.now()}`,
        url,
        method,
        body,
        timestamp: Date.now(),
        retryCount: 0,
        lastRetry: null
      };
      
      storePendingRequest(request);
      
      // Ein simuliertes erfolgreiches Ergebnis zurückgeben, damit die UI nicht abstürzt
      return new Response(JSON.stringify({ 
        success: true, 
        offlineQueued: true,
        message: 'Anfrage wird synchronisiert, sobald die Verbindung wiederhergestellt ist'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Bei anderen Fehlern den Fehler durchreichen
    throw error;
  }
}

export default {
  useNetworkStatus,
  useSyncStatus,
  apiRequestWithOfflineSupport
};