
import {  Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authAPI } from '../../api/authAPI';  // ADDED ON 30-04-2025//////
import { Changepass} from '@/types';
import { toast } from "@/components/ui/use-toast";

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import LabelMandatorySymbol from "@/components/ui/labeMandatorySymbol";




const changePaswordSchema = z.object({
  currentpass: z.string().min(1, { message: "Current password is required" }),  
  newpass: z.string().min(1, { message: "New password is required" }),
  confirmmpass: z.string().min(1, { message: "Confirm password is required" }),  
});

type ChangePassFormValues = z.infer<typeof changePaswordSchema>;


const ChangePassword = () => {
  const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePassFormValues>({
      resolver: zodResolver(changePaswordSchema),
      defaultValues: {
       
      },
    });
    
      console.log(user);

      const onSubmit = async (values: ChangePassFormValues) => {
        setIsLoading(true);
    
        // Mock API call - would be replaced with real data persistence       
          
            // Mock creating new asset
            const passwordUpdateData:Changepass = {           
              currentpass: values.currentpass || '',
              newpass: values.newpass || '', // Fallback to empty string         
              confirmmpass: values.confirmmpass || "",
            };
              const userid = user.id;
              // console.log('=============');
              // console.log(userid);
              // console.log(passwordUpdateData);
              // console.log('+++++++++++++++++');
             const updatedAssets = await authAPI.userpasswordchange(userid,passwordUpdateData);
                    console.log(updatedAssets.message);
           
            if(updatedAssets.message == "New Password and Confirm Password not matched" || updatedAssets.message=="Current password is incorrect"){
              toast({
                title: "User Password Change",
                description: updatedAssets.message,
                variant: "destructive",
              });
            }else{
              toast({
                title: "User Password Change",
                description: `Password has been changed successfully.`,
              });
            }
           
          
          
          setIsLoading(false);
          form.reset({
            currentpass: '',
            newpass: '',
            confirmmpass: '',
          });
          navigate("/changepassword");
       
      };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-muted-foreground">
            Manage your password
          </p>
        </div>
  
        <Card className="max-w-2xl">
          {/* <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader> */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
             
                  <FormField
                    control={form.control}
                    name="currentpass"
                    render={({ field }) => (
                      <FormItem>
                        <h4>Current Password<LabelMandatorySymbol/></h4>
                        <FormControl>
                          <Input type="password" placeholder="Current Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <FormField
                    control={form.control}
                    name="newpass"
                    render={({ field }) => (
                      <FormItem>
                        <h4>New Password<LabelMandatorySymbol/></h4>
                        <FormControl>
                          <Input type="password" placeholder="New Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />                
  
                <FormField
                  control={form.control}
                  name="confirmmpass"
                  render={({ field }) => (
                    <FormItem>
                      <h4>Confirm Password<LabelMandatorySymbol/> </h4>
                      <FormControl>
                        <Input type="password" placeholder="Confirm Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
  
            
              </CardContent>
              <CardFooter className="flex justify-between">
                 <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    );
};


export default ChangePassword;
