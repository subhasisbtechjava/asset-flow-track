
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams,useNavigate } from "react-router-dom";
import { User, UserRole } from "@/types";
import { authAPI } from "../../api/authAPI"; // ADDED ON 30-04-2025//////

const loginSchema = z.object({
  empcode: z.string().min(1, { message: "Employee Id is required" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const SSOBypass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
   const [user, setUser] = useState<User | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      empcode: ""     
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {     
      //alert(values.empcode);
      const ssoBypass = await authAPI.ssoBypasslogin(values.empcode);
       if (ssoBypass) { 
          localStorage.setItem("user", JSON.stringify(ssoBypass));
          setUser(ssoBypass); // Set user directly from response
          navigate("/stores"); // Navigate immediately after setting user
        }  
    } catch (error) {
      toast({
        title: "SSO Login failed",
        description: "Invalid employee id. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-[84px] w-[84px]  flex items-center justify-center">
              {/* <Package className="h-6 w-6 text-primary-foreground" /> */}
              <img src="/images/Wow_MomoLogo.png" alt="" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Store Tracker</CardTitle>
          <CardDescription>
            Store Tracking System
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="empcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Employee ID" 
                          {...field} 
                          autoComplete="email" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* <div className="text-sm text-muted-foreground">
                <p>Demo accounts:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Admin: admin@example.com</li>
                  <li>Procurement: procurement@example.com</li>
                  <li>Project Head: projecthead@example.com</li>
                  <li>Finance: finance@example.com</li>
                  <li>Password: password (for all accounts)</li>
                </ul>
              </div> */}
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SSOBypass;
