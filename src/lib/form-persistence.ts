/**
 * Formular-Persistenz-System
 * 
 * Speichert Formulardaten im lokalen Speicher, um eine Wiederherstellung
 * nach Verbindungsverlusten oder Browser-Abstürzen zu ermöglichen.
 */

import localforage from 'localforage';
import { debounce } from './utils';

// Konfiguration für Formular-Persistenz
const FORM_STORAGE_KEY_PREFIX = 'bau-structura-form-';
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000; // 24 Stunden
const AUTO_SAVE_DELAY_MS = 500; // 500 ms Debouncing-Verzögerung

// Speicher-Instance für Formulardaten
const formStorage = localforage.createInstance({
  name: 'bau-structura-form-persistence'
});

// Gespeicherte Formular-Daten-Typ
interface StoredFormData<T> {
  formId: string;
  data: T;
  timestamp: number;
  formName?: string;
  path?: string;
}

/**
 * Speichert Formulardaten im lokalen Speicher
 * 
 * @param formId Eindeutige ID des Formulars
 * @param data Formulardaten
 * @param options Zusätzliche Optionen (Formularname, Pfad)
 */
async function saveFormData<T>(
  formId: string,
  data: T,
  options: { formName?: string; path?: string; } = {}
): Promise<void> {
  try {
    const storageKey = `${FORM_STORAGE_KEY_PREFIX}${formId}`;
    
    const formData: StoredFormData<T> = {
      formId,
      data,
      timestamp: Date.now(),
      ...options
    };
    
    await formStorage.setItem(storageKey, formData);
    
    console.debug(`Formulardaten für ${formId} erfolgreich gespeichert`);
  } catch (error) {
    console.error(`Fehler beim Speichern von Formulardaten für ${formId}:`, error);
  }
}

/**
 * Lädt gespeicherte Formulardaten aus dem lokalen Speicher
 * 
 * @param formId Eindeutige ID des Formulars
 * @returns Gespeicherte Formulardaten oder null, wenn keine Daten gefunden wurden
 */
async function loadFormData<T>(formId: string): Promise<StoredFormData<T> | null> {
  try {
    const storageKey = `${FORM_STORAGE_KEY_PREFIX}${formId}`;
    const formData = await formStorage.getItem<StoredFormData<T>>(storageKey);
    
    if (!formData) {
      return null;
    }
    
    // Prüfen, ob die Daten zu alt sind
    const age = Date.now() - formData.timestamp;
    if (age > MAX_FORM_AGE_MS) {
      // Alte Daten löschen
      await formStorage.removeItem(storageKey);
      return null;
    }
    
    return formData;
  } catch (error) {
    console.error(`Fehler beim Laden von Formulardaten für ${formId}:`, error);
    return null;
  }
}

/**
 * Löscht gespeicherte Formulardaten aus dem lokalen Speicher
 * 
 * @param formId Eindeutige ID des Formulars
 */
async function clearFormData(formId: string): Promise<void> {
  try {
    const storageKey = `${FORM_STORAGE_KEY_PREFIX}${formId}`;
    await formStorage.removeItem(storageKey);
    
    console.debug(`Formulardaten für ${formId} erfolgreich gelöscht`);
  } catch (error) {
    console.error(`Fehler beim Löschen von Formulardaten für ${formId}:`, error);
  }
}

/**
 * Bereinigt alle alten Formulardaten aus dem lokalen Speicher
 */
async function cleanupOldFormData(): Promise<void> {
  try {
    const keys = await formStorage.keys();
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const key of keys) {
      if (key.startsWith(FORM_STORAGE_KEY_PREFIX)) {
        const formData = await formStorage.getItem<StoredFormData<any>>(key);
        
        if (formData && (now - formData.timestamp > MAX_FORM_AGE_MS)) {
          await formStorage.removeItem(key);
          cleanedCount++;
        }
      }
    }
    
    if (cleanedCount > 0) {
      console.debug(`${cleanedCount} alte Formulardaten bereinigt`);
    }
  } catch (error) {
    console.error('Fehler bei der Bereinigung alter Formulardaten:', error);
  }
}

/**
 * Listet alle gespeicherten Formulardaten auf
 * 
 * @returns Liste aller gespeicherten Formulardaten
 */
async function listStoredForms(): Promise<Array<{ 
  formId: string; 
  formName?: string; 
  path?: string; 
  timestamp: number; 
}>> {
  try {
    const keys = await formStorage.keys();
    const result = [];
    
    for (const key of keys) {
      if (key.startsWith(FORM_STORAGE_KEY_PREFIX)) {
        const formData = await formStorage.getItem<StoredFormData<any>>(key);
        
        if (formData) {
          result.push({
            formId: formData.formId,
            formName: formData.formName,
            path: formData.path,
            timestamp: formData.timestamp
          });
        }
      }
    }
    
    // Nach Zeitstempel sortieren (neueste zuerst)
    return result.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Fehler beim Auflisten der gespeicherten Formulardaten:', error);
    return [];
  }
}

// Debounced-Version von saveFormData für automatisches Speichern
const autoSaveFormData = debounce(saveFormData, AUTO_SAVE_DELAY_MS);

/**
 * Hook für React-Formulare mit Persistenz
 * 
 * @param formId Eindeutige ID des Formulars
 * @param defaultValues Standardwerte für das Formular
 * @param options Zusätzliche Optionen (Formularname, Pfad)
 * @returns Formular-Hilfsfunktionen und wiederhergestellte Daten
 */
export function useFormPersistence<T>(
  formId: string, 
  defaultValues: T,
  options: { 
    formName?: string; 
    path?: string; 
    autoSave?: boolean;
  } = {}
) {
  const [initialValues, setInitialValues] = React.useState<T>(defaultValues);
  const [isRestored, setIsRestored] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  // Beim ersten Rendern gespeicherte Daten laden
  React.useEffect(() => {
    async function loadSavedData() {
      try {
        setIsLoading(true);
        
        const savedData = await loadFormData<T>(formId);
        
        if (savedData) {
          setInitialValues(savedData.data);
          setIsRestored(true);
          console.debug(`Formulardaten für ${formId} wiederhergestellt (Alter: ${Date.now() - savedData.timestamp}ms)`);
        } else {
          setInitialValues(defaultValues);
          setIsRestored(false);
        }
      } catch (error) {
        console.error(`Fehler beim Wiederherstellen von Formulardaten für ${formId}:`, error);
        setInitialValues(defaultValues);
        setIsRestored(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSavedData();
    
    // Bereinige alte Formulardaten beim Laden
    cleanupOldFormData().catch(console.error);
  }, [formId, defaultValues]);
  
  // Funktionen für Formularaktionen
  const persistForm = React.useCallback(async (data: T) => {
    await saveFormData(formId, data, options);
  }, [formId, options]);
  
  const clearForm = React.useCallback(async () => {
    await clearFormData(formId);
  }, [formId]);
  
  const autosave = React.useCallback((data: T) => {
    if (options.autoSave !== false) {
      autoSaveFormData(formId, data, options);
    }
  }, [formId, options]);
  
  return {
    initialValues,
    isRestored,
    isLoading,
    persistForm,
    clearForm,
    autosave
  };
}

// Exportiere auch die direkten Funktionen für nicht-React-Anwendungsfälle
export {
  saveFormData,
  loadFormData,
  clearFormData,
  listStoredForms,
  cleanupOldFormData
};