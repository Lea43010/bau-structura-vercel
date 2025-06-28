import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Building, 
  Users, 
  Map, 
  Database, 
  Shield, 
  Calendar,
  Send,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera,
  BarChart3,
  Smartphone,
  Globe,
  Star,
  Zap,
  Target,
  Headphones,
  Loader2,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';


export default function MarketingPage() {
  console.log('Marketing page loaded successfully');
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleMemberAccess = () => {
    setIsLoadingDemo(true);
    // Weiterleitung zur Anmeldeseite für Mitglieder
    window.location.href = 'https://bau-structura.de/auth';
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const formData = new FormData(e.currentTarget);
      const contactData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        phone: formData.get('phone') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        setContactSuccess(true);
        toast({
          title: 'Nachricht gesendet',
          description: result.message,
        });
        // Formular zurücksetzen
        e.currentTarget.reset();
      } else {
        throw new Error(result.message || 'Fehler beim Senden der Nachricht');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      toast({
        title: 'Fehler',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };;

  const features = [
    {
      icon: Building,
      title: "Projektmanagement",
      description: "Vollständige Verwaltung Ihrer Bauprojekte von der Planung bis zur Fertigstellung",
      color: "bg-purple-500",
      priority: 1
    },
    {
      icon: Calendar,
      title: "Bautagebuch",
      description: "Digitale Dokumentation aller Bauaktivitäten mit Zeiterfassung und Mitarbeiterverwaltung",
      color: "bg-blue-500",
      priority: 1
    },
    {
      icon: Users,
      title: "Kunden- & Firmenverwaltung",
      description: "Zentrale Verwaltung aller Geschäftspartner mit Kontaktdaten und Projekthistorie",
      color: "bg-green-500",
      priority: 1
    },
    {
      icon: Map,
      title: "Geo-Mapping",
      description: "Spracherkennung für einfache Dateneingabe und unkomplizierte Datenübertragung",
      color: "bg-orange-500",
      priority: 2
    },
    {
      icon: Camera,
      title: "KI-Bildanalyse",
      description: "Automatische Erkennung von Straßenschäden und Oberflächenklassifikation",
      color: "bg-red-500",
      priority: 2
    },
    {
      icon: Database,
      title: "Bodenanalyse",
      description: "Integration mit BGR-Daten für detaillierte Bodenuntersuchungen",
      color: "bg-teal-500",
      priority: 2
    },
    {
      icon: FileText,
      title: "Dokumentenverwaltung",
      description: "Sichere Speicherung und Organisation aller projektbezogenen Dokumente",
      color: "bg-indigo-500",
      priority: 2
    },
    {
      icon: BarChart3,
      title: "Reporting & Analytics",
      description: "Umfassende Berichte und Datenanalysen für bessere Projektentscheidungen",
      color: "bg-pink-500",
      priority: 2
    }
  ];

  const benefits = [
    "Bis zu 40% Zeitersparnis bei der Projektverwaltung",
    "🔒 100% DSGVO-konforme Datensicherheit & SSL-Verschlüsselung",
    "Mobile Nutzung auf allen Geräten",
    "Automatische Backups und Synchronisation",
    "🛡️ Höchste Sicherheitsstandards & Datenschutz"
  ];



  const pricingPlans = [
    {
      name: "Basic",
      price: "21€",
      period: "pro Monat",
      description: "Ideal für Einzelanwender",
      features: [
        "Unbegrenzte Projekte",
        "Grundlegendes Bautagebuch",
        "Kunden- & Firmenverwaltung",
        "Mobile App",
        "E-Mail Support"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "34€",
      period: "pro Monat",
      description: "Für Teams und Organisationen",
      features: [
        "Unbegrenzte Projekte",
        "Erweiterte Dokumentation",
        "KI-Bildanalyse",
        "Geo-Mapping",
        "Priority Support"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Preis auf Anfrage",
      period: "",
      description: "Für Institutionen und Großkunden",
      features: [
        "Alle Professional Features",
        "Bodenanalyse (BGR-Integration)",
        "Custom Workflows",
        "API-Zugang",
        "Individuell anpassbar"
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/company-logo.png" 
                alt="Sachverständigenbüro Logo" 
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  // Fallback to Building icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-gray-700 tracking-tight">Bau-Structura</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600">Funktionen</a>
              <a href="#pricing" className="text-gray-600 hover:text-green-600">Preise</a>
              <a href="#contact" className="text-gray-600 hover:text-green-600">Kontakt</a>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleMemberAccess}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lade...
                  </>
                ) : (
                  <>
                    Für Mitglieder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <a 
              href="#features" 
              className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funktionen
            </a>
            <a 
              href="#pricing" 
              className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preise
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontakt
            </a>
            <div className="px-3 py-2">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleMemberAccess();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lade...
                  </>
                ) : (
                  <>
                    Für Mitglieder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4">
                <Star className="h-4 w-4 mr-1" />
                #1 Baumanagement-Software
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Revolutionäres
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Projektmanagement </span>
                für den Bau
              </h1>
              <p className="text-lg sm:text-xl text-green-100 mb-8 leading-relaxed">
                Verwalten Sie Ihre Bauprojekte effizienter mit KI-gestützter Technologie, 
                digitalem Bautagebuch und intelligenter Datenanalyse. 
                <strong>DSGVO-konform und höchste Sicherheitsstandards</strong> - 
                Sparen Sie Zeit, reduzieren Sie Kosten und steigern Sie die Qualität.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-8 py-4 shadow-lg">
                    <Zap className="mr-2 h-5 w-5" />
                    Kostenlos starten
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 bg-transparent"
                  onClick={() => window.open('https://www.sachverstaendigenbuero-justitia.com/book-online', '_blank')}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Demo buchen
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center mt-8 space-y-2 sm:space-y-0 sm:space-x-6 text-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">30 Tage kostenlos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">Keine Kreditkarte nötig</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-lg">Dashboard aktiv</span>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Aktuelle Projekte</span>
                      <Badge className="bg-green-500">+12%</Badge>
                    </div>
                    <div className="text-3xl font-bold">24</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-sm opacity-80">Heute erfasst</div>
                      <div className="text-xl font-bold">8.5h</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-sm opacity-80">Qualitätsscore</div>
                      <div className="text-xl font-bold">97%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-600 mb-4">
              <Target className="h-4 w-4 mr-1" />
              Kernfunktionen
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Alles was Sie für erfolgreiches Bauprojektmanagement brauchen
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Von der ersten Projektidee bis zur finalen Abrechnung - Bau-Structura begleitet Sie durch den gesamten Bauprozess.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`${feature.color} p-4 rounded-2xl text-white mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-600 mb-4">
                <Zap className="h-4 w-4 mr-1" />
                Ihre Vorteile
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Warum Bau-Structura die richtige Wahl für Ihr Unternehmen ist
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

            </div>
            <div className="space-y-6">
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Modernste Technologie für den Bau
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Bau-Structura vereint jahrelange Branchenerfahrung mit neuester Technologie, 
                      um Ihnen die beste Projektmanagement-Lösung für den Baubereich zu bieten.
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-600">Sichere Cloud-Infrastruktur</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-600">KI-gestützte Analysen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-600 mb-4">
              <BarChart3 className="h-4 w-4 mr-1" />
              Transparente Preise
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Wählen Sie den Plan, der zu Ihrem Unternehmen passt
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Alle Pläne beinhalten 30 Tage kostenlosen Test ohne Risiko
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'ring-2 ring-purple-500 scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">Beliebtester Plan</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">/{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="https://bau-structura.de/auth">
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                      size="lg"
                    >
                      30 Tage kostenlos testen
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Bereit, Ihr Bauunternehmen zu digitalisieren?
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 mb-8">
            Starten Sie heute noch mit Bau-Structura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-8 py-4 shadow-lg">
                <Zap className="mr-2 h-5 w-5" />
                Jetzt kostenlos starten
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 bg-transparent"
              onClick={() => window.open('https://www.sachverstaendigenbuero-justitia.com/book-online', '_blank')}
            >
              <Headphones className="mr-2 h-5 w-5" />
              Persönliche Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kontakt aufnehmen
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Haben Sie Fragen? Wir helfen Ihnen gerne weiter.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nachricht senden
              </h3>
              {contactSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Vielen Dank für Ihre Nachricht!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Wir haben Ihre Anfrage erhalten und melden uns zeitnah bei Ihnen zurück.
                  </p>
                  <Button 
                    onClick={() => setContactSuccess(false)}
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Weitere Nachricht senden
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      disabled={isSubmittingContact}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Unternehmen
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Betreff *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="demo">Demo-Termin vereinbaren</option>
                    <option value="pricing">Preise und Angebote</option>
                    <option value="technical">Technische Fragen</option>
                    <option value="support">Support</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 py-3"
                  disabled={isSubmittingContact}
                >
                  {isSubmittingContact ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      Nachricht senden
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Kontaktinformationen
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-green-600 mt-1" />
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">E-Mail</h4>
                      <p className="text-gray-600">info@bau-structura.de</p>
                      <p className="text-gray-600">support@bau-structura.de</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-green-600 mt-1" />
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">Telefon</h4>
                      <p className="text-gray-600">+49 (0) 152 335 31845</p>
                      <p className="text-sm text-gray-500">Mo-Fr: 9:00 - 18:00 Uhr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-green-600 mt-1" />
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">Adresse</h4>
                      <p className="text-gray-600">
                        Oberdorfstraße 14<br />
                        97225 Zellingen OT Retzbach<br />
                        Deutschland
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Schnelle Antwort gewünscht?
                </h4>
                <p className="text-gray-600 mb-4">
                  Vereinbaren Sie direkt einen kostenlosen Demo-Termin und lernen Sie Bau-Structura kennen.
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('https://www.sachverstaendigenbuero-justitia.com/book-online', '_blank')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Demo-Termin buchen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold">Bau-Structura</span>
              </div>
              <p className="text-gray-400">
                Die führende Projektmanagement-Software für moderne Bauunternehmen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produkt</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Funktionen</a></li>
                <li><a href="#pricing" className="hover:text-white">Preise</a></li>

              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Unternehmen</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.sachverstaendigenbuero-justitia.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Über uns</a></li>
                <li><a href="https://www.sachverstaendigenbuero-justitia.com/_files/ugd/4e8b1e_b9c9911df0854a31bbc15ddfa0345a94.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white">Newsletter</a></li>
                <li><a href="https://www.linkedin.com/company/sachverst%C3%A4ndigenb%C3%BCro-justitia/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Hilfe-Center</a></li>
                <li><a href="#" className="hover:text-white">Kontakt</a></li>
                <li><a href="/datenschutz" className="hover:text-white">Datenschutz</a></li>
                <li><a href="#" className="hover:text-white">AGB</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Bau-Structura. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}