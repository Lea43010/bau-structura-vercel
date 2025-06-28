/**
 * Google Maps Caching-System
 * 
 * Dieses Modul bietet Funktionen zum Caching von Google Maps API-Anfragen,
 * um die Anzahl der API-Aufrufe zu reduzieren und damit das Kontingent zu schonen.
 * 
 * Implementiert werden:
 * 1. Geocoding-Caching: Speichert Adress-zu-Koordinaten-Umwandlungen
 * 2. Routing-Caching: Speichert Routen zwischen Punkten
 * 3. Places-Caching: Speichert Ortsdetails und Suchergebnisse
 */

// Typdefinitionen für die Cache-Einträge
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number; // Ablaufzeit in Millisekunden
}

// Cache für Geocoding-Ergebnisse
interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

// Cache für Routen
interface RouteResult {
  distance: number;
  duration: number;
  polyline: string;
  steps: any[];
}

// Cache für Ortsdetails
interface PlaceResult {
  details: any;
  photos: string[];
}

// Cache-Klasse für verschiedene Arten von Google Maps Daten
class GoogleMapsCache {
  private geocodingCache: Map<string, CacheEntry<GeocodingResult>> = new Map();
  private routingCache: Map<string, CacheEntry<RouteResult>> = new Map();
  private placesCache: Map<string, CacheEntry<PlaceResult>> = new Map();
  
  // Standard-Ablaufzeiten für verschiedene Cache-Typen (in Millisekunden)
  private readonly DEFAULT_GEOCODING_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 Tage
  private readonly DEFAULT_ROUTING_EXPIRY = 7 * 24 * 60 * 60 * 1000;    // 7 Tage
  private readonly DEFAULT_PLACES_EXPIRY = 24 * 60 * 60 * 1000;         // 1 Tag
  
  constructor() {
    // Beim Erstellen versuchen, Cache aus dem localStorage zu laden
    this.loadFromStorage();
    
    // Regelmäßige Bereinigung des Caches einrichten
    setInterval(() => this.cleanExpiredEntries(), 60 * 60 * 1000); // Stündlich
  }
  
  /**
   * Speichert ein Geocoding-Ergebnis im Cache
   */
  cacheGeocodingResult(address: string, result: GeocodingResult, expiryMs: number = this.DEFAULT_GEOCODING_EXPIRY): void {
    this.geocodingCache.set(this.normalizeAddressKey(address), {
      data: result,
      timestamp: Date.now(),
      expiry: expiryMs
    });
    
    this.saveToStorage();
  }
  
  /**
   * Ruft ein gecachtes Geocoding-Ergebnis ab
   */
  getGeocodingResult(address: string): GeocodingResult | null {
    const normalizedKey = this.normalizeAddressKey(address);
    const entry = this.geocodingCache.get(normalizedKey);
    
    if (!entry) return null;
    
    // Prüfen, ob der Eintrag abgelaufen ist
    if (Date.now() - entry.timestamp > entry.expiry) {
      this.geocodingCache.delete(normalizedKey);
      this.saveToStorage();
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Speichert ein Routing-Ergebnis im Cache
   */
  cacheRouteResult(origin: string, destination: string, result: RouteResult, expiryMs: number = this.DEFAULT_ROUTING_EXPIRY): void {
    const routeKey = this.createRouteKey(origin, destination);
    this.routingCache.set(routeKey, {
      data: result,
      timestamp: Date.now(),
      expiry: expiryMs
    });
    
    this.saveToStorage();
  }
  
  /**
   * Ruft ein gecachtes Routing-Ergebnis ab
   */
  getRouteResult(origin: string, destination: string): RouteResult | null {
    const routeKey = this.createRouteKey(origin, destination);
    const entry = this.routingCache.get(routeKey);
    
    if (!entry) return null;
    
    // Prüfen, ob der Eintrag abgelaufen ist
    if (Date.now() - entry.timestamp > entry.expiry) {
      this.routingCache.delete(routeKey);
      this.saveToStorage();
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Speichert ein Places-Ergebnis im Cache
   */
  cachePlaceResult(placeId: string, result: PlaceResult, expiryMs: number = this.DEFAULT_PLACES_EXPIRY): void {
    this.placesCache.set(placeId, {
      data: result,
      timestamp: Date.now(),
      expiry: expiryMs
    });
    
    this.saveToStorage();
  }
  
  /**
   * Ruft ein gecachtes Places-Ergebnis ab
   */
  getPlaceResult(placeId: string): PlaceResult | null {
    const entry = this.placesCache.get(placeId);
    
    if (!entry) return null;
    
    // Prüfen, ob der Eintrag abgelaufen ist
    if (Date.now() - entry.timestamp > entry.expiry) {
      this.placesCache.delete(placeId);
      this.saveToStorage();
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Bereinigt abgelaufene Einträge aus allen Caches
   */
  cleanExpiredEntries(): void {
    const now = Date.now();
    let hasChanges = false;
    
    // Geocoding-Cache bereinigen
    for (const [key, entry] of this.geocodingCache.entries()) {
      if (now - entry.timestamp > entry.expiry) {
        this.geocodingCache.delete(key);
        hasChanges = true;
      }
    }
    
    // Routing-Cache bereinigen
    for (const [key, entry] of this.routingCache.entries()) {
      if (now - entry.timestamp > entry.expiry) {
        this.routingCache.delete(key);
        hasChanges = true;
      }
    }
    
    // Places-Cache bereinigen
    for (const [key, entry] of this.placesCache.entries()) {
      if (now - entry.timestamp > entry.expiry) {
        this.placesCache.delete(key);
        hasChanges = true;
      }
    }
    
    // Nur speichern, wenn sich etwas geändert hat
    if (hasChanges) {
      this.saveToStorage();
    }
  }
  
  /**
   * Speichert alle Caches im localStorage
   */
  private saveToStorage(): void {
    try {
      // Geocoding-Cache speichern
      const geocodingData = Object.fromEntries(this.geocodingCache.entries());
      localStorage.setItem('gmaps_geocoding_cache', JSON.stringify(geocodingData));
      
      // Routing-Cache speichern
      const routingData = Object.fromEntries(this.routingCache.entries());
      localStorage.setItem('gmaps_routing_cache', JSON.stringify(routingData));
      
      // Places-Cache speichern
      const placesData = Object.fromEntries(this.placesCache.entries());
      localStorage.setItem('gmaps_places_cache', JSON.stringify(placesData));
    } catch (error) {
      console.error('Fehler beim Speichern des Google Maps Caches:', error);
    }
  }
  
  /**
   * Lädt alle Caches aus dem localStorage
   */
  private loadFromStorage(): void {
    try {
      // Geocoding-Cache laden
      const geocodingData = localStorage.getItem('gmaps_geocoding_cache');
      if (geocodingData) {
        const parsed = JSON.parse(geocodingData);
        this.geocodingCache = new Map(Object.entries(parsed));
      }
      
      // Routing-Cache laden
      const routingData = localStorage.getItem('gmaps_routing_cache');
      if (routingData) {
        const parsed = JSON.parse(routingData);
        this.routingCache = new Map(Object.entries(parsed));
      }
      
      // Places-Cache laden
      const placesData = localStorage.getItem('gmaps_places_cache');
      if (placesData) {
        const parsed = JSON.parse(placesData);
        this.placesCache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Fehler beim Laden des Google Maps Caches:', error);
      
      // Bei Fehler die Caches zurücksetzen
      this.geocodingCache = new Map();
      this.routingCache = new Map();
      this.placesCache = new Map();
    }
  }
  
  /**
   * Erstellt einen normalisierten Schlüssel für Adressen
   */
  private normalizeAddressKey(address: string): string {
    // Entfernt überflüssige Leerzeichen, wandelt in Kleinbuchstaben um
    return address.trim().toLowerCase().replace(/\s+/g, ' ');
  }
  
  /**
   * Erstellt einen Schlüssel für eine Route
   */
  private createRouteKey(origin: string, destination: string): string {
    // Normalisiert beide Adressen und verbindet sie
    const originKey = this.normalizeAddressKey(origin);
    const destKey = this.normalizeAddressKey(destination);
    return `${originKey}|${destKey}`;
  }
  
  /**
   * Löscht den gesamten Cache
   */
  clearAllCaches(): void {
    this.geocodingCache.clear();
    this.routingCache.clear();
    this.placesCache.clear();
    
    localStorage.removeItem('gmaps_geocoding_cache');
    localStorage.removeItem('gmaps_routing_cache');
    localStorage.removeItem('gmaps_places_cache');
  }
  
  /**
   * Gibt Statistiken über den Cache zurück
   */
  getCacheStats(): {
    geocoding: {count: number, sizeBytes: number},
    routing: {count: number, sizeBytes: number},
    places: {count: number, sizeBytes: number},
    total: {count: number, sizeBytes: number}
  } {
    // Hilfsfunktion zur Berechnung der Größe
    const calculateSize = (data: any): number => {
      return new Blob([JSON.stringify(data)]).size;
    };
    
    const geocodingSize = calculateSize(Object.fromEntries(this.geocodingCache.entries()));
    const routingSize = calculateSize(Object.fromEntries(this.routingCache.entries()));
    const placesSize = calculateSize(Object.fromEntries(this.placesCache.entries()));
    
    return {
      geocoding: {
        count: this.geocodingCache.size,
        sizeBytes: geocodingSize
      },
      routing: {
        count: this.routingCache.size,
        sizeBytes: routingSize
      },
      places: {
        count: this.placesCache.size,
        sizeBytes: placesSize
      },
      total: {
        count: this.geocodingCache.size + this.routingCache.size + this.placesCache.size,
        sizeBytes: geocodingSize + routingSize + placesSize
      }
    };
  }
}

// Export einer einzelnen Instanz für die gesamte Anwendung
export const googleMapsCache = new GoogleMapsCache();

// Exportiere auch die Typen für die Verwendung in anderen Dateien
export type { GeocodingResult, RouteResult, PlaceResult };