import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Edit2, Save, X, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  studentId: string;
  enrollmentDate: string;
  program: string;
  department: string;
  currentYear: number;
  status: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { firstName, lastName } = user?.first_name && user?.last_name 
    ? { firstName: user.first_name, lastName: user.last_name }
    : { firstName: '', lastName: '' };

  const [profile, setProfile] = useState<StudentProfile>({
    firstName: firstName,
    lastName: lastName,
    email: user?.email || "",
    phone: String(user?.phone || "+1 (555) 123-4567"),
    address: user?.address || "",
    dateOfBirth: user?.birth_day || "",
    studentId: user?.student_id || user?.roll_no || user?.studentId || "",
    enrollmentDate: user?.enrollment || "",
    program: user?.program || "",
    department: user?.department || "",
    currentYear: user?.year || 1,
    status: user?.type || "Active",
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: String(user.phone || prev.phone),
        studentId: user.student_id || user.roll_no || user.studentId || prev.studentId,
        address: user.address || prev.address,
        dateOfBirth: user.birth_day || prev.dateOfBirth,
        enrollmentDate: user.enrollment || prev.enrollmentDate,
        program: user.program || prev.program,
        department: user.department || prev.department,
        currentYear: user.year || prev.currentYear,
        status: user.type || prev.status,
      }));
    }
  }, [user]);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      updateUser({
        name: `${editedProfile.firstName} ${editedProfile.lastName}`.trim() || user.name,
        first_name: editedProfile.firstName,
        last_name: editedProfile.lastName,
        email: editedProfile.email,
        phone: editedProfile.phone,
        address: editedProfile.address,
        birth_day: editedProfile.dateOfBirth,
        studentId: editedProfile.studentId,
        student_id: editedProfile.studentId,
        roll_no: editedProfile.studentId,
        enrollment: editedProfile.enrollmentDate,
        program: editedProfile.program,
        department: editedProfile.department,
        year: editedProfile.currentYear,
        type: editedProfile.status,
      });

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved to local storage.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof StudentProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Student Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={`${profile.firstName} ${profile.lastName}`} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{profile.studentId}</p>
              <Badge variant="default" className="mt-2">
                {profile.status}
              </Badge>

              <Separator className="my-4" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Year {profile.currentYear}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editedProfile.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.firstName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editedProfile.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.lastName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dob"
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedProfile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-lg">Academic Information</CardTitle>
              <CardDescription>Your enrollment and program details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                    <span className="font-mono">{profile.studentId}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Enrollment Date</Label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(profile.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Program</Label>
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.program}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                  <span>{profile.department}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Year</Label>
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2">
                  <span>Year {profile.currentYear}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
