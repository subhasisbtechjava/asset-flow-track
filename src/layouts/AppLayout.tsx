
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background transition-colors duration-300">
        <Header />
        <div className="flex flex-1">
          {/* <Sidebar /> */}
          <main className="flex-1 p-4 md:p-6 overflow-auto container mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
