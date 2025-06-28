import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, useLocation } from "wouter";
import AuthPage from "./pages/auth-page";

const queryClient = new QueryClient();

export default function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/">
            <div className="flex flex-col items-center justify-center min-h-screen p-8">
              <h1 className="text-4xl font-bold text-primary mb-6">
                BauStructura
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
                Professionelle Bau- und Projektverwaltung für Sachverständige und Bauunternehmen
              </p>
              <div className="flex gap-4">
                <a 
                  href="/auth" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Anmelden
                </a>
                <a 
                  href="/auth" 
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Registrieren
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  );
}
