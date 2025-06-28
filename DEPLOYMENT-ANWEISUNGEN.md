# 🚀 Vercel Deployment - Schritt-für-Schritt Anleitung

## Schnelle Deployment-Übersicht

### 1. **Dateien vorbereiten**
```bash
# Diesen kompletten vercel-frontend/ Ordner für Upload verwenden
# Enthält bereits alles Notwendige:
- Konfigurierte package.json (Frontend-only)
- Optimierte vite.config.ts
- vercel.json für API-Weiterleitung
```

### 2. **Vercel Setup**
1. Bei Vercel anmelden
2. "New Project" → Ordner `vercel-frontend/` hochladen
3. Framework: **"Vite"** auswählen
4. Root Directory: **"."** (Standard)

### 3. **Build-Einstellungen**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. **Environment Variables**
In Vercel-Dashboard hinzufügen:
```
VITE_API_BASE_URL=https://bau-structura.de
VITE_GOOGLE_MAPS_API_KEY=IHR_GOOGLE_MAPS_KEY
VITE_STRIPE_PUBLISHABLE_KEY=IHR_STRIPE_KEY
VITE_APP_ENV=production
```

### 5. **Deploy klicken**

## ✅ Was automatisch funktioniert

- **API-Weiterleitung**: Alle `/api/*` Anfragen → `https://bau-structura.de`
- **SPA-Routing**: Alle anderen Routen → React App
- **CORS-Header**: Automatisch konfiguriert
- **Build-Optimierung**: Vite produziert optimierte Builds

## 📁 Lokale Datei-Übersicht
```
vercel-frontend/
├── src/                    # React App (komplett)
├── package-frontend.json   # Saubere Frontend-Dependencies
├── vite.config.ts         # Vercel-optimiert
├── vercel.json           # Deployment-Config
├── index.html            # Entry Point
└── dist/                 # Build-Output (automatisch)
```

## 🔄 Nach Deployment

- Frontend läuft auf: `https://ihr-project-name.vercel.app`
- Backend bleibt auf: `https://bau-structura.de`
- Automatische API-Verbindung funktioniert

## 💡 Pro-Tipp
Die package-frontend.json hat bereits alle Backend-Dependencies entfernt - einfach umbenennen zu package.json vor Upload!