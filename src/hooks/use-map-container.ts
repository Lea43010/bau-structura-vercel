import { useRef, useEffect, useState } from 'react';

// Eindeutige Static ID für die Anwendung
// Wir verwenden eine statische ID statt dynamischer IDs, um doppelte Maps zu vermeiden
const GLOBAL_MAP_CONTAINER_ID = 'google-map-container';

/**
 * Custom Hook zur Verwaltung der Map-Container-Referenz
 * 
 * Diese Version verwendet eine statische ID statt dynamischer IDs, 
 * um zu verhindern, dass mehrere Map-Container erzeugt werden.
 * 
 * @returns Ein Objekt mit der Container-ID und einer Funktion, die prüft, ob der Container existiert
 */
export function useMapContainer() {
  // Statische ID für alle Map-Instanzen
  const mapContainerId = useRef<string>(GLOBAL_MAP_CONTAINER_ID);
  const [isReady, setIsReady] = useState(false);
  
  // Funktion zur Überprüfung, ob der Container existiert
  const isContainerMounted = (): boolean => {
    return !!document.getElementById(mapContainerId.current);
  };
  
  // Stellt sicher, dass der Container existiert und korrekt im DOM eingebunden ist
  const ensureContainerExists = (): void => {
    if (!isContainerMounted()) {
      console.info(`Versuche Map-Container mit ID ${mapContainerId.current} zu erstellen...`);
      
      try {
        // Alle vorhandenen Map-Container vorher entfernen
        document.querySelectorAll('.google-map-container').forEach(container => {
          console.info(`Entferne vorhandenen Map-Container: ${container.id}`);
          container.remove();
        });
        
        // Neuen Container erstellen
        const containerDiv = document.createElement('div');
        containerDiv.id = mapContainerId.current;
        containerDiv.className = 'google-map-container';
        containerDiv.style.width = '100%';
        containerDiv.style.height = '600px';
        containerDiv.style.borderRadius = '0.375rem';
        containerDiv.style.overflow = 'hidden';
        
        // Dem Karten-Bereich hinzufügen
        const mapArea = document.querySelector('.map-area') || 
                        document.querySelector('.card-content') || 
                        document.body;
        
        if (mapArea) {
          mapArea.appendChild(containerDiv);
          console.info(`Map-Container mit ID ${mapContainerId.current} wurde erstellt.`);
        }
      } catch (error) {
        console.error('Fehler beim Erstellen des Map-Containers:', error);
      }
    }
  };
  
  // Initialisierung des Containers
  useEffect(() => {
    // Kurze Verzögerung für React-Rendering
    const timer = setTimeout(() => {
      if (!isContainerMounted()) {
        ensureContainerExists();
      }
      setIsReady(isContainerMounted());
    }, 100);
    
    return () => clearTimeout(timer);
  // Leeres Dependency-Array, damit der Effect nur einmal ausgeführt wird
  }, []);
  
  return {
    containerId: mapContainerId.current,
    isContainerMounted,
    ensureContainerExists,
    isReady
  };
}