import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Workers from "./pages/Workers";
import GitHub from "./pages/GitHub";
import Google from "./pages/Google";
import Chat from "./pages/Chat";

function Router() {
  return (
    <Switch>
      <Route path={"/(.*)?"}>{() => (
        <DashboardLayout>
          <Switch>
            <Route path={"/"} component={Overview} />
            <Route path={"/workers"} component={Workers} />
            <Route path={"/github"} component={GitHub} />
            <Route path={"/google"} component={Google} />
            <Route path={"/chat"} component={Chat} />
            <Route path={"/404"} component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </DashboardLayout>
      )}</Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
