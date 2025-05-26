import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  User,
  Users,
  LogOut,
  Settings,
  Sun,
  Moon,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLoadertime } from "@/contexts/loadertimeContext";
import Loader from '../loader/Loader';



export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const loadintime = useLoadertime();
  const navigate = useNavigate();
  const location = useLocation();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  function onBack() {
    setLoading(true);
    navigate(-1);
   setTimeout(() => {
      setLoading(false)
    }, loadintime);
  }
  return (
    
    <header className="border-b bg-card shadow-sm animate-fade-in flex items-center justify-center " >
       <Loader loading={loading} />
      {location.pathname!="/stores"&& <ChevronLeft size={"35"} style={{marginLeft:"20px",cursor: "pointer"}} onClick={() => onBack()} />}
          <Link style={{marginLeft:"20px"}} to="/" >
            <div className="flex">
              {/* <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent1 bg-clip-text text-transparent">
                StoreTracker
              </h1>
              <p className="text-xs text-muted-foreground">QSR Asset Tracking</p> */}
              <img src="/images/Wow_MomoLogo.png" alt="" className="h-11" />
            </div>
          </Link>
      <div  className="container flex h-16 items-center justify-between px-4">
        
    
   
<p></p>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-accent1" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 animate-scale-in"
              >
                <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/assets"
                    className="flex items-center cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span> Manage Master Assets</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link
                to="/manage-vendors" // Update the route as needed
                className="flex items-center cursor-pointer"
                >
                <Users className="mr-2 h-4 w-4" />
                <span>Manage Vendor Master</span>
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/manage-brands"
                    className="flex items-center cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span> Manage Master Brands</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/users"
                    className="flex items-center cursor-pointer"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Manage Users</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 rounded-full overflow-hidden flex items-center gap-2"
                >
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium hidden sm:inline-block">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/changepassword">Change Password</Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
