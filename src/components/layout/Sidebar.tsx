
import { useNavigate } from "react-router-dom";
import { Home, Store, Package, Clipboard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Stores",
      icon: Store,
      path: "/stores",
    },
    {
      title: "Assets",
      icon: Package,
      path: "/assets",
    },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white">Asset Flow</h2>
          <p className="text-xs text-slate-300">QSR Asset Tracking</p>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild onClick={() => navigate(item.path)}>
                <div className="flex items-center gap-3 cursor-pointer">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-slate-300 capitalize">{user.role}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
