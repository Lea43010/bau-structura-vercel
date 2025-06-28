/**
 * Routing-Service mit Caching-Unterstützung
 * 
 * Dieser Service kümmert sich um die Routenberechnung zwischen Orten,
 * unter Verwendung des Google Maps Caching-Systems zur Reduzierung von API-Aufrufen.
 */

import { googleMapsCache, RouteResult } from '../utils/google-maps-cache';

interface RoutingOptions {
  useCache?: boolean;
  travelMode?: google.maps.TravelMode;
  alternatives?: boolean;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
  avoidFerries?: boolean;
  unitSystem?: google.maps.UnitSystem;
  optimizeWaypoints?: boolean;
  language?: string;
}

export class RoutingService {
  private directionsService: google.maps.DirectionsService | null = null;
  
  constructor() {
    // DirectionsService wird bei Bedarf initialisiert
    this.initDirectionsService();
  }
  
  /**
   * Initialisiert den Google Maps DirectionsService
   */
  private initDirectionsService() {
    if (window.google && window.google.maps) {
      this.directionsService = new google.maps.DirectionsService();
    } else {
      console.warn('Google Maps API noch nicht geladen. DirectionsService wird später initialisiert.');
    }
  }
  
  /**
   * Stellt sicher, dass der DirectionsService initialisiert ist
   */
  private ensureDirectionsService(): Promise<google.maps.DirectionsService> {
    return new Promise((resolve, reject) => {
      if (this.directionsService) {
        resolve(this.directionsService);
        return;
      }
      
      // Wenn Google Maps bereits geladen ist, initialisieren
      if (window.google && window.google.maps) {
        this.directionsService = new google.maps.DirectionsService();
        resolve(this.directionsService);
        return;
      }
      
      // Andernfalls warten, bis die API geladen ist
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          
          this.directionsService = new google.maps.DirectionsService();
          resolve(this.directionsService);
        }
      }, 200);
      
      // Timeout nach 10 Sekunden
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout beim Warten auf Google Maps API'));
      }, 10000);
    });
  }
  
  /**
   * Berechnet eine Route zwischen Start- und Zielpunkten
   */
  async calculateRoute(
    origin: string | google.maps.LatLng | google.maps.Place,
    destination: string | google.maps.LatLng | google.maps.Place,
    options: RoutingOptions = {}
  ): Promise<RouteResult> {
    const { 
      useCache = true,
      travelMode = google.maps.TravelMode.DRIVING,
      alternatives = false,
      avoidHighways = false,
      avoidTolls = false, 
      avoidFerries = false,
      unitSystem = google.maps.UnitSystem.METRIC,
      optimizeWaypoints = true,
      language = 'de'
    } = options;
    
    // Cache-Schlüssel erstellen
    const originString = this.locationToString(origin);
    const destinationString = this.locationToString(destination);
    
    // Zusätzliche Optionen für den Cache-Schlüssel (kann die Cache-Hit-Rate reduzieren, aber ist genauer)
    const optionsString = JSON.stringify({
      travelMode,
      avoidHighways,
      avoidTolls,
      avoidFerries
    });
    
    // Prüfen, ob im Cache vorhanden
    if (useCache) {
      const cacheKey = `${originString}|${destinationString}|${optionsString}`;
      const cachedResult = googleMapsCache.getRouteResult(cacheKey, cacheKey);
      if (cachedResult) {
        console.log(`[Routing] Cache-Hit für Route: ${originString} -> ${destinationString}`);
        return cachedResult;
      }
    }
    
    try {
      // Sicherstellen, dass der DirectionsService initialisiert ist
      await this.ensureDirectionsService();
      
      // Routing-Anfrage durchführen
      const response = await this.directionsService!.route({
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        alternatives: alternatives,
        avoidHighways: avoidHighways,
        avoidTolls: avoidTolls,
        avoidFerries: avoidFerries,
        unitSystem: unitSystem,
        optimizeWaypoints: optimizeWaypoints,
        language: language
      });
      
      if (response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        const leg = route.legs[0];
        
        // Route-Ergebnis erstellen
        const routeResult: RouteResult = {
          distance: leg.distance?.value || 0,
          duration: leg.duration?.value || 0,
          polyline: route.overview_polyline,
          steps: leg.steps.map(step => ({
            distance: step.distance?.value || 0,
            duration: step.duration?.value || 0,
            instructions: step.instructions,
            polyline: step.polyline
          }))
        };
        
        // Im Cache speichern, wenn gewünscht
        if (useCache) {
          const cacheKey = `${originString}|${destinationString}|${optionsString}`;
          googleMapsCache.cacheRouteResult(cacheKey, cacheKey, routeResult);
          console.log(`[Routing] Route wurde gecacht: ${originString} -> ${destinationString}`);
        }
        
        return routeResult;
      } else {
        throw new Error('Keine Route für die angegebenen Orte gefunden');
      }
    } catch (error) {
      console.error('Routing-Fehler:', error);
      throw error;
    }
  }
  
  /**
   * Konvertiert einen Ort zu einem String für den Cache-Schlüssel
   */
  private locationToString(location: string | google.maps.LatLng | google.maps.Place): string {
    if (typeof location === 'string') {
      return location;
    } else if (location instanceof google.maps.LatLng) {
      return `${location.lat().toFixed(6)},${location.lng().toFixed(6)}`;
    } else if ('location' in location && location.location instanceof google.maps.LatLng) {
      return `${location.location.lat().toFixed(6)},${location.location.lng().toFixed(6)}`;
    } else if ('query' in location && typeof location.query === 'string') {
      return location.query;
    } else {
      throw new Error('Nicht unterstütztes Ortsformat');
    }
  }
  
  /**
   * Löscht den Routing-Cache
   */
  clearRoutingCache(): void {
    // Hier könnten wir eine spezifischere Methode implementieren,
    // aber aktuell nur den gesamten Cache leeren
    googleMapsCache.clearAllCaches();
  }
}

// Singleton-Instanz für die Anwendung
export const routingService = new RoutingService();