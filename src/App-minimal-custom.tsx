import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import AuthPage from "./pages/auth-page";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/">
            {/* Header */}
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div className="flex items-center">
                    <img 
                      src="/api/placeholder/40/40" 
                      alt="BauStructura Logo" 
                      className="h-10 w-10 mr-3"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">BauStructura</h1>
                  </div>
                  <nav className="hidden md:flex space-x-8">
                    <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
                    <a href="#pricing" className="text-gray-500 hover:text-gray-900">Preise</a>
                    <a href="#contact" className="text-gray-500 hover:text-gray-900">Kontakt</a>
                  </nav>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="/auth" 
                      className="text-gray-500 hover:text-gray-900"
                    >
                      Anmelden
                    </a>
                    <a 
                      href="/auth" 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Kostenlos testen
                    </a>
                  </div>
                </div>
              </div>
            </header>

            {/* Hero Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-8">
                  Professionelle Bauprojekt-<br />
                  <span className="text-indigo-600">Verwaltung</span>
                </h1>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                  Digitalisieren Sie Ihre Bauprojekte mit BauStructura. 
                  Von der Planung bis zur Abnahme - alles in einer intelligenten Plattform 
                  für Sachverständige und Bauunternehmen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/auth" 
                    className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    Jetzt kostenlos starten
                  </a>
                  <a 
                    href="#demo" 
                    className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    Live Demo ansehen
                  </a>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Alles was Sie für Ihre Bauprojekte brauchen
                  </h2>
                  <p className="text-xl text-gray-600">
                    Moderne Tools für effiziente Projektabwicklung
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Projektmanagement</h3>
                    <p className="text-gray-600">
                      Verwalten Sie alle Ihre Bauprojekte zentral mit Zeitplänen, Meilensteinen und Dokumentation.
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Digitales Bautagebuch</h3>
                    <p className="text-gray-600">
                      Erfassen Sie Arbeitsfortschritte, Wetter und besondere Vorkommnisse digital und rechtssicher.
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Geodatenanalyse</h3>
                    <p className="text-gray-600">
                      Integrierte Karten und Geodatenanalyse für präzise Standortbestimmung und Flächenberechnung.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">BauStructura</h3>
                    <p className="text-gray-400">
                      Die professionelle Lösung für Ihre Bauprojekte.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Produkt</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#features" className="hover:text-white">Features</a></li>
                      <li><a href="#pricing" className="hover:text-white">Preise</a></li>
                      <li><a href="#demo" className="hover:text-white">Demo</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="/help" className="hover:text-white">Hilfe</a></li>
                      <li><a href="/contact" className="hover:text-white">Kontakt</a></li>
                      <li><a href="/documentation" className="hover:text-white">Dokumentation</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Rechtliches</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="/privacy" className="hover:text-white">Datenschutz</a></li>
                      <li><a href="/terms" className="hover:text-white">AGB</a></li>
                      <li><a href="/imprint" className="hover:text-white">Impressum</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; 2025 BauStructura. Alle Rechte vorbehalten.</p>
                </div>
              </div>
            </footer>
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  );
}
