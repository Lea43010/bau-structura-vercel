// Erweiterte Spracherkennung mit Browser-Web-Speech-API und OpenAI-Whisper-Fallback

// Interface für die Spracherkennung
export interface ISpeechRecognition {
  start: () => void;
  stop: () => void;
  onresult: (callback: (text: string) => void) => void;
  onend: (callback: () => void) => void;
  onerror: (callback: (error: any) => void) => void;
  isSupported: () => boolean;
  isListening: () => boolean;
}

// Konfiguration für die Spracherkennung
export interface SpeechRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  useFallback?: boolean;
  fallbackApiUrl?: string;
}

// Default-Konfiguration
const defaultConfig: SpeechRecognitionConfig = {
  language: 'de-DE', // Deutsch als Standard
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  useFallback: true,
  fallbackApiUrl: '/api/speech-to-text'
};

// Browser Speech Recognition
class BrowserSpeechRecognition implements ISpeechRecognition {
  private recognition: any;
  private resultCallback: ((text: string) => void) | null = null;
  private endCallback: (() => void) | null = null;
  private errorCallback: ((error: any) => void) | null = null;
  private listening = false;

  constructor(config: SpeechRecognitionConfig) {
    // Standard-Web-Speech-API oder webkit-präfixierte Version
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Web Speech API wird in diesem Browser nicht unterstützt');
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.lang = config.language || 'de-DE';
    this.recognition.continuous = config.continuous || true;
    this.recognition.interimResults = config.interimResults || true;
    this.recognition.maxAlternatives = config.maxAlternatives || 1;
    
    this.recognition.onresult = (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript;
      
      if (this.resultCallback) {
        this.resultCallback(transcript);
      }
    };
    
    this.recognition.onend = () => {
      this.listening = false;
      if (this.endCallback) {
        this.endCallback();
      }
    };
    
    this.recognition.onerror = (event: any) => {
      if (this.errorCallback) {
        this.errorCallback(event.error);
      }
    };
  }
  
  start() {
    try {
      this.recognition.start();
      this.listening = true;
    } catch (e) {
      console.error('Fehler beim Starten der Spracherkennung:', e);
      if (this.errorCallback) {
        this.errorCallback(e);
      }
    }
  }
  
  stop() {
    try {
      this.recognition.stop();
      this.listening = false;
    } catch (e) {
      console.error('Fehler beim Stoppen der Spracherkennung:', e);
    }
  }
  
  onresult(callback: (text: string) => void) {
    this.resultCallback = callback;
  }
  
  onend(callback: () => void) {
    this.endCallback = callback;
  }
  
  onerror(callback: (error: any) => void) {
    this.errorCallback = callback;
  }
  
  isSupported() {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
  
  isListening() {
    return this.listening;
  }
}

// Server Fallback mit OpenAI Whisper API
class ServerSpeechRecognition implements ISpeechRecognition {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private resultCallback: ((text: string) => void) | null = null;
  private endCallback: (() => void) | null = null;
  private errorCallback: ((error: any) => void) | null = null;
  private stream: MediaStream | null = null;
  private apiUrl: string;
  private listening = false;
  
  constructor(config: SpeechRecognitionConfig) {
    this.apiUrl = config.fallbackApiUrl || '/api/speech-to-text';
  }
  
  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        this.audioChunks.push(event.data);
      });
      
      this.mediaRecorder.addEventListener('stop', async () => {
        if (this.audioChunks.length > 0) {
          await this.processAudio();
        }
        
        if (this.endCallback) {
          this.endCallback();
        }
        
        // Stream-Tracks stoppen
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
        
        this.listening = false;
      });
      
      this.mediaRecorder.start(1000); // Alle 1000ms einen Chunk senden
      this.listening = true;
    } catch (e) {
      console.error('Fehler beim Starten der Server-Spracherkennung:', e);
      if (this.errorCallback) {
        this.errorCallback(e);
      }
    }
  }
  
  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.listening = false;
  }
  
  onresult(callback: (text: string) => void) {
    this.resultCallback = callback;
  }
  
  onend(callback: () => void) {
    this.endCallback = callback;
  }
  
  onerror(callback: (error: any) => void) {
    this.errorCallback = callback;
  }
  
  isSupported() {
    return !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
  }
  
  isListening() {
    return this.listening;
  }
  
  private async processAudio() {
    try {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Server-Fehler: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.text && this.resultCallback) {
        this.resultCallback(data.text);
      }
    } catch (e) {
      console.error('Fehler bei der Audioverarbeitung:', e);
      if (this.errorCallback) {
        this.errorCallback(e);
      }
    }
  }
}

// Hauptklasse für beide Implementierungen
export class SpeechRecognitionService implements ISpeechRecognition {
  private browserImpl: BrowserSpeechRecognition | null = null;
  private serverImpl: ServerSpeechRecognition | null = null;
  private activeImpl: ISpeechRecognition | null = null;
  private config: SpeechRecognitionConfig;
  
  constructor(config: Partial<SpeechRecognitionConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    
    try {
      this.browserImpl = new BrowserSpeechRecognition(this.config);
    } catch (e) {
      console.warn('Browser-Spracherkennung nicht verfügbar:', e);
    }
    
    if (this.config.useFallback) {
      try {
        this.serverImpl = new ServerSpeechRecognition(this.config);
      } catch (e) {
        console.warn('Server-Spracherkennung konnte nicht initialisiert werden:', e);
      }
    }
    
    // Standardmäßig Browser-Implementierung bevorzugen
    this.activeImpl = this.browserImpl && this.browserImpl.isSupported() 
      ? this.browserImpl 
      : this.serverImpl;
  }
  
  start() {
    if (!this.activeImpl) {
      throw new Error('Keine Spracherkennung verfügbar');
    }
    this.activeImpl.start();
  }
  
  stop() {
    if (this.activeImpl) {
      this.activeImpl.stop();
    }
  }
  
  onresult(callback: (text: string) => void) {
    if (this.activeImpl) {
      this.activeImpl.onresult(callback);
    }
  }
  
  onend(callback: () => void) {
    if (this.activeImpl) {
      this.activeImpl.onend(callback);
    }
  }
  
  onerror(callback: (error: any) => void) {
    if (this.activeImpl) {
      this.activeImpl.onerror(callback);
    }
  }
  
  isSupported() {
    return !!this.activeImpl;
  }
  
  isListening() {
    return this.activeImpl ? this.activeImpl.isListening() : false;
  }
  
  useBrowserImplementation() {
    if (this.browserImpl && this.browserImpl.isSupported()) {
      this.activeImpl = this.browserImpl;
      return true;
    }
    return false;
  }
  
  useServerImplementation() {
    if (this.serverImpl && this.serverImpl.isSupported()) {
      this.activeImpl = this.serverImpl;
      return true;
    }
    return false;
  }
}

// Global-Definition für die SpeechRecognition API des Browsers
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

// Hilfs-Hook für React-Komponenten
export const createSpeechRecognition = (config?: Partial<SpeechRecognitionConfig>) => {
  return new SpeechRecognitionService(config);
};

// Text-Korrektur mit OpenAI-API
export const correctText = async (text: string): Promise<string> => {
  try {
    const response = await fetch('/api/text-correction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error(`Server-Fehler: ${response.status}`);
    }
    
    const data = await response.json();
    return data.correctedText || text;
  } catch (e) {
    console.error('Fehler bei der Textkorrektur:', e);
    return text; // Im Fehlerfall den Originaltext zurückgeben
  }
};

export default SpeechRecognitionService;