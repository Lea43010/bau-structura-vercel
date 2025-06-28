/**
 * Geocoding-Service mit Caching-Unterstützung
 * 
 * Dieser Service kümmert sich um die Umwandlung von Adressen in Koordinaten und umgekehrt,
 * unter Verwendung des Google Maps Caching-Systems zur Reduzierung von API-Aufrufen.
 */

import { googleMapsCache, GeocodingResult } from '../utils/google-maps-cache';

interface GeocodeOptions {
  useCache?: boolean;
  region?: string;
  language?: string;
}

interface ReverseGeocodeOptions {
  useCache?: boolean;
  language?: string;
}

export class GeocodingService {
  private geocoder: google.maps.Geocoder | null = null;
  
  constructor() {
    // Geocoder wird bei Bedarf initialisiert
    this.initGeocoder();
  }
  
  /**
   * Initialisiert den Google Maps Geocoder
   */
  private initGeocoder() {
    if (window.google && window.google.maps) {
      this.geocoder = new google.maps.Geocoder();
    } else {
      console.warn('Google Maps API noch nicht geladen. Geocoder wird später initialisiert.');
    }
  }
  
  /**
   * Stellt sicher, dass der Geocoder initialisiert ist
   */
  private ensureGeocoder(): Promise<google.maps.Geocoder> {
    return new Promise((resolve, reject) => {
      if (this.geocoder) {
        resolve(this.geocoder);
        return;
      }
      
      // Wenn Google Maps bereits geladen ist, initialisieren
      if (window.google && window.google.maps) {
        this.geocoder = new google.maps.Geocoder();
        resolve(this.geocoder);
        return;
      }
      
      // Andernfalls warten, bis die API geladen ist
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          
          this.geocoder = new google.maps.Geocoder();
          resolve(this.geocoder);
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
   * Geocodiert eine Adresse zu Koordinaten
   */
  async geocodeAddress(address: string, options: GeocodeOptions = {}): Promise<GeocodingResult> {
    const { useCache = true, region = 'de', language = 'de' } = options;
    
    // Prüfen, ob im Cache vorhanden
    if (useCache) {
      const cachedResult = googleMapsCache.getGeocodingResult(address);
      if (cachedResult) {
        console.log(`[Geocoding] Cache-Hit für Adresse: ${address}`);
        return cachedResult;
      }
    }
    
    try {
      // Sicherstellen, dass der Geocoder initialisiert ist
      await this.ensureGeocoder();
      
      // Geocoding-Anfrage durchführen
      const response = await this.geocoder!.geocode({
        address,
        region,
        language
      });
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const geocodingResult: GeocodingResult = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          formatted_address: result.formatted_address
        };
        
        // Im Cache speichern, wenn gewünscht
        if (useCache) {
          googleMapsCache.cacheGeocodingResult(address, geocodingResult);
          console.log(`[Geocoding] Adresse wurde gecacht: ${address}`);
        }
        
        return geocodingResult;
      } else {
        throw new Error('Keine Ergebnisse für diese Adresse gefunden');
      }
    } catch (error) {
      console.error('Geocoding-Fehler:', error);
      throw error;
    }
  }
  
  /**
   * Reverse-Geocodiert Koordinaten zu einer Adresse
   */
  async reverseGeocode(lat: number, lng: number, options: ReverseGeocodeOptions = {}): Promise<string> {
    const { useCache = true, language = 'de' } = options;
    const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    
    // Prüfen, ob im Cache vorhanden
    if (useCache) {
      const cachedResult = googleMapsCache.getGeocodingResult(cacheKey);
      if (cachedResult) {
        console.log(`[Reverse-Geocoding] Cache-Hit für Koordinaten: ${cacheKey}`);
        return cachedResult.formatted_address;
      }
    }
    
    try {
      // Sicherstellen, dass der Geocoder initialisiert ist
      await this.ensureGeocoder();
      
      // Reverse-Geocoding-Anfrage durchführen
      const response = await this.geocoder!.geocode({
        location: { lat, lng },
        language
      });
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const address = result.formatted_address;
        
        // Im Cache speichern, wenn gewünscht
        if (useCache) {
          const geocodingResult: GeocodingResult = {
            lat,
            lng,
            formatted_address: address
          };
          googleMapsCache.cacheGeocodingResult(cacheKey, geocodingResult);
          console.log(`[Reverse-Geocoding] Koordinaten wurden gecacht: ${cacheKey}`);
        }
        
        return address;
      } else {
        throw new Error('Keine Adresse für diese Koordinaten gefunden');
      }
    } catch (error) {
      console.error('Reverse-Geocoding-Fehler:', error);
      throw error;
    }
  }
  
  /**
   * Löscht den Geocoding-Cache
   */
  clearGeocodingCache(): void {
    // Hier könnten wir eine spezifischere Methode implementieren,
    // aber aktuell nur den gesamten Cache leeren
    googleMapsCache.clearAllCaches();
  }
}

// Singleton-Instanz für die Anwendung
export const geocodingService = new GeocodingService();