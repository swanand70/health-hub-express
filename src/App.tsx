import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { seedData } from "@/lib/storage";
import AuthPage from "@/pages/AuthPage";
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import OwnerDashboard from "@/pages/owner/OwnerDashboard";

// Seed demo data on first load
seedData();

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();

  if (!user) return <AuthPage />;
  if (user.role === 'owner') return <OwnerDashboard />;
  return <CustomerDashboard />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
