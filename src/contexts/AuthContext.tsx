
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, UserRole } from "@/types";
import { authAPI } from "@/api/authAPI";





// interface User {
//   id: string;
//   email: string;
//   name: string; 
// }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - would be replaced with real authentication
// const MOCK_USERS: User[] = [
//   {
//     id: "1",
//     name: "Admin User",
//     email: "admin@gmail.com",
//     role: "admin" as UserRole
//   },
//   {
//     id: "2",
//     name: "Procurement User",
//     email: "procurement@gmail.com",
//     role: "procurement" as UserRole
//   },
//   {
//     id: "3",
//     name: "Project Head",
//     email: "projecthead@gmail.com",
//     role: "projectHead" as UserRole
//   },
//   {
//     id: "4",
//     name: "Finance User",
//     email: "finance@gmail.com",
//     role: "finance" as UserRole
//   }
// ];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   // Check if user is stored in localStorage on component mount
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  //   setIsLoading(false);
  // }, []);
  useEffect(() => {
    // Check if user is stored in localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    // Redirect to login if user is not authenticated and not already on login page
    if (!isLoading && !user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, isLoading, location.pathname, navigate]);
  // useEffect(() => {
  //   // Redirect to login if user is not authenticated and not already on login page
  //   if (!isLoading && !user && location.pathname !== "/login") {
  //     navigate("/login");
  //   }
  // }, [user, isLoading, location.pathname, navigate]);

  // const login = async (email: string, password: string) => {
  //   // Mock authentication - would be replaced with real authentication service
  //   setIsLoading(true);
    
  //   // Simulate API call delay
  //   await new Promise(resolve => setTimeout(resolve, 1000));
    
  //   const foundUser = MOCK_USERS.find(u => u.email === email);
    
  //   if (foundUser && password === "password") { // Simplified for demo purposes
  //     setUser(foundUser);
  //     localStorage.setItem("user", JSON.stringify(foundUser));
  //     navigate("/");
  //   } else {
  //     throw new Error("Invalid email or password");
  //   }
    
  //   setIsLoading(false);
  // };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the actual API instead of mock
      const user = await authAPI.login(email, password);
      console.log(user)
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to let the login form handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
