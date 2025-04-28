
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background transition-colors duration-300">
      <Header />
      <main className="flex-1 p-4 md:p-6 overflow-auto container mx-auto max-w-7xl animate-fade-in">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
