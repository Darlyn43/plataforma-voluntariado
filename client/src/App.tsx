import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Pages
import LoginPage from "@/pages/login";
import OnboardingPage from "@/pages/onboarding";
import EmployeeDashboardPage from "@/pages/employee-dashboard";
import AdminDashboardPage from "@/pages/admin-dashboard";
import DemoLoginPage from "@/pages/demo-login";
import DemoDashboardPage from "@/pages/demo-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, loading } = useAuth();
  const { user: demoUser, loading: demoLoading } = useDemoAuth();

  // Combine Firebase and demo authentication
  const currentUser = user || demoUser;
  const isLoading = loading || demoLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/demo" component={DemoLoginPage} />
      <Route path="/demo-dashboard" component={DemoDashboardPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard">
        {currentUser?.profile?.role === 'admin' ? <AdminDashboardPage /> : <EmployeeDashboardPage />}
      </Route>
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/">
        {currentUser ? (
          currentUser.profile?.profileCompleted !== false ? (
            currentUser.profile?.role === 'admin' ? <AdminDashboardPage /> : <EmployeeDashboardPage />
          ) : (
            <OnboardingPage />
          )
        ) : (
          <LoginPage />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
