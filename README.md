# BauStructura Frontend - Vercel Deployment

## Deployment-Ready Frontend Package

Dieses Paket enthält das komplette Frontend der BauStructura-Anwendung, optimiert für Vercel-Deployment.

### Inhalt

- **React 18** Frontend mit TypeScript
- **Tailwind CSS** für Styling
- **Radix UI** Komponenten-Bibliothek
- **Vite** als Build-Tool
- **Google Maps** Integration
- **Stripe** Payment Integration

### Deployment-Schritte

1. **Upload zu Vercel:**
   - Gesamten `vercel-frontend/` Ordner hochladen
   - Als "Vite" Framework auswählen

2. **Environment Variables in Vercel setzen:**
   ```
   VITE_API_BASE_URL=https://bau-structura.de
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_APP_ENV=production
   ```

3. **Build-Konfiguration:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### API-Verbindung

Das Frontend wird automatisch API-Anfragen an `https://bau-structura.de/api/` weiterleiten.

### Features

- ✅ Responsive Design für alle Geräte
- ✅ Dashboard mit Projektübersicht
- ✅ Karten-Integration (Google Maps)
- ✅ PDF-Export-Funktionen
- ✅ Benutzer-Management
- ✅ Dokumenten-Upload
- ✅ Subscription-Management (Stripe)

### Support

Nach dem Deployment werden alle API-Calls automatisch an das Backend auf `bau-structura.de` weitergeleitet.

### Version

Basiert auf der stabilen deployed Version vom 25. Juni 2025 (Commit: bfb4d538)