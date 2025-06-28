import { useEffect, Suspense } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import AuthPage from "./pages/auth-page";
import NotFound from "./pages/not-found";
import ErrorPage from "./pages/error-page";
import DownloadPage from "@/pages/download-page";
import AttachmentPage from "@/pages/attachment-page";
import InformationPage from "@/pages/information-page";
import ModernInformationPage from "@/pages/modern-information-page";
import LandingPage from "@/pages/landing-page";
import SimpleLoginPage from "@/pages/simple-login";
import AdminPage from "@/pages/admin-page";
import DeploymentDocsPage from "@/pages/admin/deployment-docs";
import UserManagementPage from "@/pages/admin/user-management";
import BackupStatusPage from "@/pages/admin/backup-status";
// Import-Korrektur für SystemLogs-Komponente
import SystemLogsPage from "./pages/admin/system-logs";
import SQLAnalyticsPage from "@/pages/admin/sql-analytics";
import SubscriptionPage from "@/pages/subscription-page";
import DataQualityPage from "@/pages/data-quality-page";
import SearchPage from "@/pages/search-page";
import DataQualityDashboard from "@/pages/data-quality-dashboard";
import ModernDataQualityPage from "@/pages/modern-data-quality-page";
import DbStructureQualityPage from "@/pages/db-structure-quality-page";
import DbStructureFixPage from "@/pages/db-structure-fix-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import ConstructionDiaryDebugPage from "@/pages/construction-diary-debug";
import AdminEmailsPage from "@/pages/admin-emails";
import ModernUserManagement from "@/pages/admin/modern-user-management";
import DeveloperDocumentationPage from "@/pages/admin/developer-documentation-page";
import TestingGuidePage from "@/pages/admin/testing-guide-page";
import SystemAnalysisPage from "@/pages/system-analysis-page";
import AdminSystemOptimization from "@/pages/admin-system-optimization";
import FileSecurityAdmin from "@/pages/file-security-admin";
// HelpPage nicht mehr benötigt, Redirect zu InformationPage
import StreetModulesPage from "@/pages/street-modules-new";
import TiefbauMap from "@/pages/tiefbau-map";
// Direkter Import als JSX.Element-Komponente
import TiefbauMapSearchable from "@/pages/tiefbau-map-searchable";
import NewTiefbauMap from "@/pages/new-tiefbau-map";
import type { ComponentType } from "react";
import BodenAnalyse from "@/pages/BodenAnalyse";
import MaschinenAuswahl from "@/pages/MaschinenAuswahl";
import KostenKalkulationPage from "@/pages/kostenkalkulation";
import ConstructionDiaryPage from "@/pages/construction-diary-page";
import MilestonesPage from "@/pages/milestones-page";
import MarketingPage from "@/pages/marketing-page";
import DenkmalAtlasPage from "@/pages/denkmal-atlas-page";
import BodenklassenOverlayPage from "@/pages/bodenklassen-overlay-page";
import TiefbauMapFix from "@/pages/tiefbau-map-fix";
import SimpleTiefbauMap from "@/pages/simple-tiefbau-map";
import ImageOptimizationDemo from "@/pages/image-optimization-demo";
import SimpleImageOptimizationDemo from "@/pages/image-optimization-demo-simple";
import { NetworkStatusProvider } from "@/hooks/use-network-status";
import PageTransition from "@/components/ui/page-transition";

import AutoTour from "@/components/onboarding/auto-tour";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  return (
    <Switch>
      <Route path="/marketing" component={MarketingPage} />
      <Route path="/login" component={SimpleLoginPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/landing" component={LandingPage} />
      <Route path="/" component={() => {
        // Für Produktions-Domain direkt zur Marketing-Seite weiterleiten
        const hostname = window.location.hostname;
        if (hostname === 'www.bau-structura.de' || hostname === 'bau-structura.de') {
          return <Redirect to="/marketing" />;
        }
        return <AuthPage />;
      }} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/companies" component={ModernCompanyPage} />
      <ProtectedRoute path="/customers" component={ModernCustomerPage} />
      <ProtectedRoute path="/projects" component={ModernProjectPage} />
      <ProtectedRoute path="/projektverwaltung" component={ModernProjectPage} />
      <ProtectedRoute path="/construction-diary" component={ConstructionDiaryPage} />
      <ProtectedRoute path="/milestones" component={MilestonesPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/projects/:id" component={ProjectDetailPage} />
      
      {/* Admin-Bereich mit spezieller Zugriffsbeschränkung */}
      <AdminProtectedRoute path="/admin" component={AdminPage} />
      <AdminProtectedRoute path="/admin/deployment-docs" component={DeploymentDocsPage} />
      <AdminProtectedRoute path="/admin/users" component={UserManagementPage} />
      <AdminProtectedRoute path="/admin/modern-users" component={ModernUserManagement} />
      <AdminProtectedRoute path="/admin/emails" component={AdminEmailsPage} />
      <AdminProtectedRoute path="/admin/backup-status" component={BackupStatusPage} />
      <AdminProtectedRoute path="/admin/logs" component={SystemLogsPage} />
      <AdminProtectedRoute path="/admin/sql-analytics" component={SQLAnalyticsPage} />
      <AdminProtectedRoute path="/admin/documentation" component={DeveloperDocumentationPage} />
      <AdminProtectedRoute path="/admin/testing-guide" component={TestingGuidePage} />
      <AdminProtectedRoute path="/admin/system-analysis" component={SystemAnalysisPage} />
      <AdminProtectedRoute path="/admin/system-optimization" component={AdminSystemOptimization} />
      <AdminProtectedRoute path="/file-security-admin" component={FileSecurityAdmin} />
      
      <ProtectedRoute path="/quick-entry" component={QuickEntryPage} />
      <ProtectedRoute path="/db-migration" component={DownloadPage} />
      <ProtectedRoute path="/attachments" component={AttachmentPage} />
      {/* Alte Geo-Map-Routen werden auf Tiefbau-Map umgeleitet */}
      <Route path="/geo-map">
        {() => <Redirect to="/tiefbau-map" />}
      </Route>
      <Route path="/geo-map-new">
        {() => <Redirect to="/tiefbau-map" />}
      </Route>
      <Route path="/geo-map-simple">
        {() => <Redirect to="/tiefbau-map" />}
      </Route>
      <ProtectedRoute path="/information" component={InformationPage} />
      <ProtectedRoute path="/modern-information" component={ModernInformationPage} />
      <ProtectedRoute path="/street-modules" component={StreetModulesPage} />
      <ProtectedRoute path="/subscription" component={SubscriptionPage} />
      <RoleProtectedRoute 
        path="/data-quality" 
        component={DataQualityPage} 
        requiredRole={['administrator', 'manager']} 
      />
      <ProtectedRoute path="/search" component={SearchPage} />
      <RoleProtectedRoute 
        path="/admin/data-quality" 
        component={DataQualityPage}
        requiredRole="administrator"
      />
      <RoleProtectedRoute 
        path="/admin/data-quality-dashboard" 
        component={DataQualityDashboard}
        requiredRole="administrator"
      />
      <RoleProtectedRoute 
        path="/modern-data-quality" 
        component={ModernDataQualityPage}
        requiredRole={['administrator', 'manager']} 
      />
      <ProtectedRoute path="/construction-diary-debug" component={ConstructionDiaryDebugPage} />
      <ProtectedRoute path="/tiefbau-map" component={() => <TiefbauMap />} />
      <ProtectedRoute path="/tiefbau-map-searchable" component={TiefbauMapSearchable} />
      <ProtectedRoute path="/new-tiefbau-map" component={() => <SimpleTiefbauMap />} />
      <ProtectedRoute path="/tiefbau-map/new/:id" component={() => <SimpleTiefbauMap />} />
      <ProtectedRoute path="/tiefbau-map-fix/:id" component={() => <TiefbauMapFix />} />
      <ProtectedRoute path="/simple-tiefbau-map/:id" component={() => <SimpleTiefbauMap />} />
      <ProtectedRoute path="/bodenanalyse" component={BodenAnalyse} />
      <ProtectedRoute path="/boden-analyse" component={BodenAnalyse} />
      <ProtectedRoute path="/bodenanalyse-test" component={React.lazy(() => import("@/pages/bodenanalyse-test"))} />
      <ProtectedRoute path="/bodenklassen-overlay" component={BodenklassenOverlayPage} />
      <ProtectedRoute path="/maschinen-auswahl" component={() => <MaschinenAuswahl />} />
      <ProtectedRoute path="/kostenkalkulation" component={KostenKalkulationPage} />
      {/* DenkmalAtlas integrierte Seite */}
      <ProtectedRoute path="/denkmal-atlas" component={DenkmalAtlasPage} />
      <ProtectedRoute path="/image-optimization" component={ImageOptimizationDemo} />
      <ProtectedRoute path="/image-optimization-simple" component={SimpleImageOptimizationDemo} />
      <Route path="/help">
        {() => <Redirect to="/information" />}
      </Route>
      <Route path="/geo">
        {() => <Redirect to="/tiefbau-map" />}
      </Route>
      <Route path="/auth" component={AuthPage} />
      <Route path="/datenschutz" component={PrivacyPolicyPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/datenschutzerklärung" component={PrivacyPolicyPage} />
      <Route path="/home" component={HomePage} /> {/* Direkte Route zur Homepage, wenn eingeloggt */}
      {/* Maps-Test-Seite temporär entfernt */}
      <Route path="/startup-test">
        {() => {
          // Einfache statische Testseite direkt hier
          return (
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                Startup Test
              </h1>
              
              <div style={{ 
                border: "1px solid #e2e8f0", 
                borderRadius: "0.5rem", 
                padding: "1.5rem", 
                marginBottom: "1.5rem", 
                background: "white" 
              }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  Server Status
                </h2>
                
                <div style={{ 
                  padding: "1rem", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "0.375rem", 
                  background: "#f8fafc" 
                }}>
                  <p style={{ marginBottom: "1rem" }}>
                    Erfolgreicher Server-Start bestätigt.
                    Einfache Testseite ohne komplexe Komponenten.
                  </p>
                  
                  <button 
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.25rem",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Test Button
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      </Route> {/* Sehr einfache Test-Seite direkt in App.tsx */}

      {/* Öffentliche Beispielrouten für Fehlerseiten ohne Login-Erfordernis */}
      <Route path="/error-demo" component={() => <ErrorPage />} />
      <Route path="/error-demo/500" component={() => <ErrorPage statusCode={500} />} />
      <Route path="/error-demo/403" component={() => (
        <ErrorPage 
          statusCode={403} 
          title="Zugriff verweigert" 
          message="Sie haben keine Berechtigung, auf diese Ressource zuzugreifen." 
        />
      )} />
      <Route path="/error-demo/404" component={() => (
        <ErrorPage 
          statusCode={404} 
          title="Seite nicht gefunden" 
          message="Die angeforderte Seite konnte nicht gefunden werden." 
        />
      )} />
      <Route path="/error-demo/401" component={() => (
        <ErrorPage 
          statusCode={401} 
          title="Nicht autorisiert" 
          message="Sie müssen sich anmelden, um auf diese Ressource zuzugreifen." 
        />
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Automatische Weiterleitung von www.bau-structura.de zur Marketingseite
  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    console.log('App loading on hostname:', hostname, 'pathname:', pathname);
    
    if (hostname === 'www.bau-structura.de' || hostname === 'bau-structura.de') {
      // Weiterleitung zur Marketing-Seite für die Produktions-Domain
      if (pathname === '/') {
        window.location.href = '/marketing';
        return;
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <NetworkStatusProvider>
        <PageTransition transitionType="fade" duration={0.2}>
          <Router />
        </PageTransition>
        <Toaster />
        <AutoTour />
        <GDPRConsentBanner />
      </NetworkStatusProvider>
    </ErrorBoundary>
  );
}

export default App;
