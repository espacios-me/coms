import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Atom from "./pages/Atom";
import Integrations from "./pages/Integrations";
import Panel from "./pages/Panel";
import Friends from "./pages/Friends";

function Router() {
  return (
    <Switch>
      <Route path="/(.*)?">
        {() => (
          <DashboardLayout>
            <Switch>
              <Route path="/" component={Atom} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/panel" component={Panel} />
              <Route path="/friends" component={Friends} />
              <Route path="/404" component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
