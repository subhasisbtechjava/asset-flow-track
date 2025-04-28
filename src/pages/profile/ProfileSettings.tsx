
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const ProfileSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input defaultValue={user?.name} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue={user?.email} type="email" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <div>
              <Badge variant="outline" className="text-sm">{user?.role}</Badge>
            </div>
          </div>
          
          <Button className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
