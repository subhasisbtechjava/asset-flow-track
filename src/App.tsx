
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./contexts/AuthContext";
import { Loadertime } from "./contexts/loadertimeContext";



import AllRoutes  from "./pages/allRoutes/allRoutes.jsx"
const App = () => {
  // Move QueryClient initialization inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
        
          <AuthProvider>
             <Loadertime>
           <AllRoutes />
           </Loadertime>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
