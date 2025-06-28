import { Switch, Route } from "wouter";
import AuthPage from "./pages/auth-page";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={AuthPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={() => <div>404 - Page not found</div>} />
      </Switch>
    </div>
  );
}

export default App;