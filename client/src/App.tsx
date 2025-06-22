import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Pages
import LoginPage from "@/pages/login";
import OnboardingPage from "@/pages/onboarding";
import EmployeeDashboardPage from "@/pages/employee-dashboard";
import AdminDashboardPage from "@/pages/admin-dashboard";
import DemoLoginPage from "@/pages/demo-login";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
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
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard">
        {user?.profile?.role === 'admin' ? <AdminDashboardPage /> : <EmployeeDashboardPage />}
      </Route>
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/">
        {user ? (
          user.profile?.profileCompleted ? (
            user.profile.role === 'admin' ? <AdminDashboardPage /> : <EmployeeDashboardPage />
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
