import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import StoreDetail from "./pages/stores/StoreDetail";
import AssetList from "./pages/assets/AssetList";
import AssetForm from "./pages/assets/AssetForm";
import StoreForm from "./pages/stores/StoreForm";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import UserList from "./pages/users/UserList";
import ProfileSettings from "./pages/profile/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="stores/:id" element={<StoreDetail />} />
              <Route path="assets" element={<AssetList />} />
              <Route path="assets/new" element={<AssetForm />} />
              <Route path="assets/edit/:id" element={<AssetForm />} />
              <Route path="users" element={<UserList />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
