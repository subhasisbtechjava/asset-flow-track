
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
import StoreAddAssets from "./pages/stores/StoreAddAssets";
import AssetList from "./pages/assets/AssetList";
import AssetForm from "./pages/assets/AssetForm";
import StoreForm from "./pages/stores/StoreForm";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import UserList from "./pages/users/UserList";
import ProfileSettings from "./pages/profile/ProfileSettings";
import ChangePassword from "./pages/profile/ChangePassword";

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
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/stores" replace />} />
                <Route path="stores" element={<Dashboard />} />
                <Route path="stores/:id" element={<StoreDetail />} />
                <Route path="stores/new" element={<StoreForm />} />
                <Route path="stores/edit/:id" element={<StoreForm />} />
                <Route path="stores/:id/add-assets" element={<StoreAddAssets />} />
                <Route path="assets" element={<AssetList />} />
                <Route path="assets/new" element={<AssetForm />} />
                <Route path="assets/edit/:id" element={<AssetForm />} />
                <Route path="users" element={<UserList />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="changepassword" element={<ChangePassword />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
