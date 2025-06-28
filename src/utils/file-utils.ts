/**
 * Hilfsfunktionen für die Dateiverwaltung in der Bau-Structura-Anwendung
 */

/**
 * Prüft, ob eine Datei existiert, indem HEAD-Request an die URL gesendet wird.
 * Funktioniert für statische Dateien und API-Endpunkte.
 */
export const checkIfFileExists = async (url: string): Promise<boolean> => {
  try {
    // Wenn URL bereits absolut ist, unverändert verwenden, sonst relative URL erstellen
    const fileUrl = url.startsWith('http') ? url : window.location.origin + url;
    
    // HEAD-Request senden, um zu prüfen, ob die Datei existiert, ohne den Inhalt herunterzuladen
    const response = await fetch(fileUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Fehler beim Prüfen der Datei:', error);
    return false;
  }
};

/**
 * Konvertiert ein File-Objekt in eine Base64-Zeichenkette
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Entferne den Data-URL-Präfix (z.B. "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Konvertiert eine URL eines Bildes in eine Base64-Zeichenkette
 */
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Entferne den Data-URL-Präfix (z.B. "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  } catch (error) {
    console.error('Fehler beim Konvertieren des Bildes:', error);
    throw error;
  }
};

/**
 * Konvertiert einen Dateinamen in einen sicheren Dateinamen ohne Sonderzeichen
 */
export const sanitizeFileName = (fileName: string): string => {
  // Umlaute ersetzen
  let sanitized = fileName
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss');
  
  // Sonderzeichen entfernen und durch Bindestrich ersetzen
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '-');
  
  // Mehrfache Bindestriche durch einen ersetzen
  sanitized = sanitized.replace(/-+/g, '-');
  
  return sanitized;
};

/**
 * Fügt einen Zeitstempel zum Dateinamen hinzu, um Duplikate zu vermeiden
 */
export const addTimestampToFileName = (fileName: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const lastDotIndex = fileName.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    // Datei hat keine Erweiterung
    return `${fileName}_${timestamp}`;
  }
  
  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);
  
  return `${name}_${timestamp}${extension}`;
};

/**
 * Formatiert Dateigröße in lesbare Form
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Ermittelt den MIME-Typ anhand der Dateiendung
 */
export const getMimeTypeFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};