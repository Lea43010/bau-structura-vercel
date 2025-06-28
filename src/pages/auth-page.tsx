import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Loader2, 
  Info, 
  X,
  MapPin,
  BarChart3,
  Layers,
  LayoutGrid,
  FileText,
  Users,
  Building,
  Building2,
  Settings,
  MailCheck,
  Key,
  Terminal
} from "lucide-react";
import logoImage from "@/assets/Logo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { insertUserSchema } from "@shared/schema";

// Da insertUserSchema jetzt eine transform-Methode verwendet, 
// müssen wir die Basis-Validierung direkt definieren
const loginSchema = z.object({
  username: z.string().min(1, "Benutzername ist erforderlich"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

const registerSchema = z.object({
  username: z.string().min(1, "Benutzername ist erforderlich"),
  password: z.string().min(1, "Passwort ist erforderlich"),
  name: z.string().optional(),
  email: z.string().email("Ungültige E-Mail-Adresse").optional(),
  role: z.enum(["administrator", "manager", "benutzer"]).optional(),
  confirmPassword: z.string(),
  gdprConsent: z.boolean(),
  // Erforderliche Felder für vollständige User-Schema-Kompatibilität
  trialEndDate: z.string().optional(),
  subscriptionStatus: z.enum(["trial", "active", "inactive", "cancelled"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
}).refine((data) => data.gdprConsent === true, {
  message: "Sie müssen den Datenschutzbestimmungen zustimmen, um sich zu registrieren",
  path: ["gdprConsent"],
});

// Verifizierungscode Schema
const verificationCodeSchema = z.object({
  code: z.string().min(6, "Bitte geben Sie den 6-stelligen Code ein").max(6, "Der Code muss 6 Ziffern haben"),
});

// Passwort-Reset Anforderungs-Schema
const resetRequestSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
});

// Passwort-Reset Schema
const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein"),
  confirmPassword: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { 
    user, 
    loginMutation, 
    registerMutation, 
    verifyCodeMutation, 
    requestPasswordResetMutation, 
    resetPasswordMutation,
    requiresTwoFactor,
    pendingUserId
  } = useAuth();
  
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetUserId, setResetUserId] = useState<number | null>(null);

  // If user is already logged in, redirect to dashboard page
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Überprüfe URL-Parameter für Passwort-Reset
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const userId = params.get('userId');
    
    if (code && userId) {
      setResetToken(code);
      setResetUserId(parseInt(userId, 10));
      setShowPasswordReset(true);
    }
  }, []);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      gdprConsent: false,
    },
  });
  
  // Verification code form
  const verificationForm = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });
  
  // Passwort-Reset-Anforderungs-Formular
  const resetRequestForm = useForm<z.infer<typeof resetRequestSchema>>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Passwort-Reset-Formular
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...userData } = values;
    
    // Standardwerte für fehlende Felder hinzufügen
    const completeUserData = {
      ...userData,
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Tage Testphase
      subscriptionStatus: 'trial' as const
    };
    
    registerMutation.mutate(completeUserData);
  };
  
  const onVerificationSubmit = (values: z.infer<typeof verificationCodeSchema>) => {
    if (pendingUserId) {
      verifyCodeMutation.mutate({
        userId: pendingUserId,
        code: values.code
      });
    }
  };
  
  const onResetRequestSubmit = (values: z.infer<typeof resetRequestSchema>) => {
    requestPasswordResetMutation.mutate(values);
    resetRequestForm.reset();
  };
  
  const onResetPasswordSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    if (resetToken && resetUserId) {
      resetPasswordMutation.mutate({
        userId: resetUserId,
        code: resetToken,
        newPassword: values.newPassword
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex-1 flex flex-col px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 pt-16">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4">
              <img src={logoImage} alt="Bau-Structura" className="h-24" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-center">
              Bau-Structura
            </h2>
            <p className="text-lg text-gray-600 text-center mt-2">
              Anmeldung
            </p>
          </div>

          {/* 2FA Verifizierungsformular, wenn auf einen Verifizierungscode gewartet wird */}
          {requiresTwoFactor && pendingUserId ? (
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5 text-primary" />
                    Zwei-Faktor-Authentifizierung
                  </CardTitle>
                  <CardDescription>
                    Bitte geben Sie den Verifizierungscode ein, der an Ihre E-Mail-Adresse gesendet wurde.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...verificationForm}>
                    <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                      <FormField
                        control={verificationForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verifizierungscode</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={6} placeholder="123456" className="text-center text-lg font-mono" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-[#6a961f] hover:bg-[#5a8418] text-white"
                        disabled={verifyCodeMutation.isPending}
                      >
                        {verifyCodeMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Verifizieren
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          ) : showPasswordReset && resetToken && resetUserId ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5 text-primary" />
                  Passwort zurücksetzen
                </CardTitle>
                <CardDescription>
                  Bitte geben Sie Ihr neues Passwort ein.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resetPasswordForm}>
                  <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={resetPasswordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neues Passwort</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetPasswordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort bestätigen</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-[#6a961f] hover:bg-[#5a8418] text-white"
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Passwort zurücksetzen
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : null}
        
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-green-100 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-green-700">Anmelden</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-green-700">Registrieren</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Benutzername</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Checkbox id="remember-me" />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Angemeldet bleiben
                        </label>
                      </div>

                      <div className="text-sm">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button 
                              className="font-medium text-green-600 hover:text-green-700"
                              type="button" 
                            >
                              Passwort vergessen?
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <MailCheck className="mr-2 h-5 w-5 text-primary" />
                                Passwort zurücksetzen
                              </DialogTitle>
                              <DialogDescription>
                                Geben Sie Ihre E-Mail-Adresse ein, um einen Verifizierungscode zum Zurücksetzen Ihres Passworts zu erhalten.
                                <Alert className="mt-2 bg-blue-50 border-blue-200">
                                  <Terminal className="h-4 w-4 text-blue-500" />
                                  <AlertTitle className="text-blue-700">Testumgebung</AlertTitle>
                                  <AlertDescription className="text-blue-600">
                                    Der Verifizierungscode wird in der Serverkonsole angezeigt.
                                  </AlertDescription>
                                </Alert>
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...resetRequestForm}>
                              <form onSubmit={resetRequestForm.handleSubmit(onResetRequestSubmit)} className="space-y-4">
                                <FormField
                                  control={resetRequestForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>E-Mail-Adresse</FormLabel>
                                      <FormControl>
                                        <Input {...field} type="email" autoComplete="email" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end gap-3">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline">Abbrechen</Button>
                                  </DialogClose>
                                  <Button 
                                    type="submit" 
                                    className="bg-[#6a961f] hover:bg-[#5a8418] text-white"
                                    disabled={requestPasswordResetMutation.isPending}
                                  >
                                    {requestPasswordResetMutation.isPending && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Code anfordern
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#6a961f] hover:bg-[#5a8418] text-white"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Anmelden
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Benutzername</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} autoComplete="name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-Mail</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passwort bestätigen</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="gdprConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Datenschutzerklärung</FormLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
                                  Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten gemäß DSGVO zu.
                                </p>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Datenschutzerklärung</DialogTitle>
                                  <DialogDescription>
                                    Bitte lesen Sie unsere Datenschutzerklärung sorgfältig durch.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4 text-sm">
                                  <h3 className="text-lg font-semibold">1. Datenschutzerklärung</h3>
                                  <p>
                                    Wir informieren Sie darüber, welche personenbezogenen Daten (z.B. Name, E-Mail, Standort, IP-Adresse) 
                                    zu welchen Zwecken und auf welcher Rechtsgrundlage verarbeitet werden.
                                  </p>
                                  
                                  <h4 className="text-md font-semibold">Verantwortliche Stelle</h4>
                                  <p>
                                    Sachverständigenbüro - Justitia<br />
                                    E-Mail: info@baustructura.de<br />
                                    Telefon: +49 0123 456789
                                  </p>
                                  
                                  <h4 className="text-md font-semibold">Art, Umfang und Zweck der Datenerhebung</h4>
                                  <p>
                                    Wir erheben und verarbeiten folgende personenbezogene Daten:
                                    <ul className="list-disc pl-5 mt-2">
                                      <li>Benutzeranmeldedaten (Benutzername, Passwort)</li>
                                      <li>Kontaktdaten (Name, E-Mail)</li>
                                      <li>Technische Daten (IP-Adresse, Zugriffszeitpunkte)</li>
                                      <li>Standortdaten bei Nutzung der Kartenfunktion</li>
                                    </ul>
                                  </p>
                                  
                                  <h4 className="text-md font-semibold">Zweck der Verarbeitung</h4>
                                  <p>
                                    Die Datenverarbeitung erfolgt zu folgenden Zwecken:
                                    <ul className="list-disc pl-5 mt-2">
                                      <li>Bereitstellung der Bau-Structura-App und ihrer Funktionen</li>
                                      <li>Kommunikation mit Nutzern</li>
                                      <li>Absicherung und Optimierung der App</li>
                                      <li>Erfüllung gesetzlicher Pflichten</li>
                                    </ul>
                                  </p>
                                  
                                  <h3 className="text-lg font-semibold mt-6">2. Speicherdauer</h3>
                                  <p>
                                    Wir speichern Ihre Daten so lange, wie es für die Erbringung unserer Dienste notwendig ist 
                                    oder gesetzliche Aufbewahrungspflichten dies erfordern.
                                  </p>
                                  
                                  <h3 className="text-lg font-semibold mt-6">3. Rechte der Nutzer</h3>
                                  <p>
                                    Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                                    <ul className="list-disc pl-5 mt-2">
                                      <li>Recht auf Auskunft</li>
                                      <li>Recht auf Berichtigung</li>
                                      <li>Recht auf Löschung</li>
                                      <li>Recht auf Einschränkung der Verarbeitung</li>
                                      <li>Recht auf Datenübertragbarkeit</li>
                                      <li>Widerspruchsrecht</li>
                                    </ul>
                                  </p>
                                  
                                  <h3 className="text-lg font-semibold mt-6">4. Datensicherheit</h3>
                                  <p>
                                    Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, 
                                    um Ihre personenbezogenen Daten gegen zufällige oder vorsätzliche Manipulationen, 
                                    Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen zu schützen.
                                  </p>
                                  
                                  <h3 className="text-lg font-semibold mt-6">5. Beschwerderecht</h3>
                                  <p>
                                    Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung 
                                    Ihrer personenbezogenen Daten zu beschweren.
                                  </p>
                                </div>
                                <DialogClose asChild>
                                  <Button>Schließen</Button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-[#6a961f] hover:bg-[#5a8418] text-white"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Registrieren
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="relative flex-1 hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700">
          <div className="flex flex-col justify-center h-full px-10 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">Bau-Structura</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="rounded-full bg-white/30 hover:bg-white/40 p-2">
                    <Info className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center">
                      <Info className="mr-2 h-6 w-6 text-green-600" />
                      Über Bau-Structura
                    </DialogTitle>
                    <DialogDescription className="text-base py-2">
                      Eine umfassende Lösung für die Verwaltung von Baustellen und Straßenbauprojekten
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="mt-4 space-y-6">
                    <div className="flex flex-col space-y-4">
                      {/* Einführung */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Allgemeine Funktionen</h3>
                        <p className="text-gray-600 mb-2">
                          Die Bau - Structura App bietet eine vollständige Lösung für die Verwaltung von Baustellen und Straßenbauprojekten. 
                          Mit einer benutzerfreundlichen Oberfläche können Unternehmen ihre Projekte, Kunden und Materialien 
                          effizient organisieren. Die App wurde für optimale Leistung und stabilen Betrieb entwickelt und unterstützt
                          responsive Nutzung auf Tablets und Smartphones.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                          <div className="flex items-start p-3 rounded-lg border">
                            <Building className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Firmendaten</h4>
                              <p className="text-sm text-gray-500">Verwaltung von Unternehmens- und Partnerfirmendaten</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <Users className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Kundendaten</h4>
                              <p className="text-sm text-gray-500">Zentrale Kundenverwaltung und Kontaktdatenbank</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <Building2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Projektverwaltung</h4>
                              <p className="text-sm text-gray-500">Projektorganisation mit Status- und Fortschrittsverfolgung</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Geo-Informationen */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Geo-Informationen & Standortanalyse</h3>
                        <p className="text-gray-600 mb-3">
                          Erweiterte Funktionen zur Standortanalyse, Routenplanung und Materialkostenberechnung für Straßenbauprojekte.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          <div className="flex items-start p-3 rounded-lg border">
                            <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Standortmarkierung</h4>
                              <p className="text-sm text-gray-500">Interaktive Karte zur Markierung von Baustellen und geplanten Strecken</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <LayoutGrid className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Straßenplanung</h4>
                              <p className="text-sm text-gray-500">Verbindung von Standorten mit automatischer Routenerstellung</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <Layers className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">RStO 12 Integration</h4>
                              <p className="text-sm text-gray-500">Auswahl und Visualisierung von Belastungsklassen nach RStO 12</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <BarChart3 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Materialkostenberechnung</h4>
                              <p className="text-sm text-gray-500">Automatische Berechnung von Material- und Maschinenkosten</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dokumentation und Analyse */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Dokumentation & Analyse</h3>
                        <p className="text-gray-600 mb-3">
                          Umfangreiche Funktionen für die Dokumentverwaltung, Bodenanalyse und Meilenstein-Tracking mit EWB/FÖB-Status:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          <div className="flex items-start p-3 rounded-lg border">
                            <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Dokumentenverwaltung</h4>
                              <p className="text-sm text-gray-500">Zentrale Speicherung und Verwaltung aller projektbezogenen Dokumente</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <Settings className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Bodenanalyse</h4>
                              <p className="text-sm text-gray-500">KI-gestützte Analyse von Bodenbildern zur Bestimmung von Bodenklassen</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <BarChart3 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Meilenstein-Tracking</h4>
                              <p className="text-sm text-gray-500">Visualisierung von Meilensteinen mit EWB/FÖB-Status nach Kalenderwochen</p>
                            </div>
                          </div>
                          <div className="flex items-start p-3 rounded-lg border">
                            <Users className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Kapazitätsplanung</h4>
                              <p className="text-sm text-gray-500">Ressourcenplanung für Projekte mit Bedarfs- und Kapazitätsansicht</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4 flex justify-end">
                    <DialogClose asChild>
                      <Button variant="outline">Schließen</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xl mb-8">
              Verwalten Sie Ihre Baustellen und Projekte effizient und übersichtlich.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Kundendatenbank pflegen
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Projekte organisieren
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Geo-Informationen und Straßenplanung
              </li>
            </ul>
            
            {/* Schnellzugriff-Bereich wurde entfernt, um den Login-Bereich zu vereinfachen */}
          </div>
        </div>
      </div>
    </div>
  );
}
