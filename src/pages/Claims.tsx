import { useState } from "react";
import { AlertCircle, Upload, X, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface ClaimSubmission {
  id: number;
  moduleCode: string;
  moduleName: string;
  claimType: string;
  reason: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  response?: string;
}

const existingClaims: ClaimSubmission[] = [
  {
    id: 1,
    moduleCode: "CS201",
    moduleName: "Data Structures & Algorithms",
    claimType: "CAT1 Marks",
    reason: "I believe my CAT1 marks were not correctly calculated. The answer sheet shows I answered 4 questions correctly but only got marks for 3.",
    submittedDate: "2025-12-15",
    status: "approved",
    response: "After review, your marks have been updated from 18 to 20.",
  },
  {
    id: 2,
    moduleCode: "CS203",
    moduleName: "Database Systems",
    claimType: "Exam Marks",
    reason: "Question 5 was incorrectly marked. I provided the correct normalization steps.",
    submittedDate: "2025-12-20",
    status: "under_review",
  },
  {
    id: 3,
    moduleCode: "MATH201",
    moduleName: "Linear Algebra",
    claimType: "CAT2 Marks",
    reason: "Missing marks for partial solutions in matrix operations question.",
    submittedDate: "2025-12-28",
    status: "pending",
  },
];

const modules = [
  { code: "CS201", name: "Data Structures & Algorithms" },
  { code: "CS202", name: "Web Development Fundamentals" },
  { code: "MATH201", name: "Linear Algebra" },
  { code: "CS203", name: "Database Systems" },
  { code: "CS204", name: "Software Engineering" },
  { code: "CS205", name: "Computer Networks" },
];

const claimTypes = [
  "CAT1 Marks",
  "CAT2 Marks",
  "Exam Marks",
  "Total Calculation Error",
  "Missing Marks",
  "Other",
];

const getStatusBadge = (status: ClaimSubmission["status"]) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
    case "under_review":
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Under Review</Badge>;
    default:
      return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
  }
};

export default function Claims() {
  const [claims, setClaims] = useState<ClaimSubmission[]>(existingClaims);
  const [selectedModule, setSelectedModule] = useState("");
  const [claimType, setClaimType] = useState("");
  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModule || !claimType || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const module = modules.find(m => m.code === selectedModule);
    const newClaim: ClaimSubmission = {
      id: claims.length + 1,
      moduleCode: selectedModule,
      moduleName: module?.name || "",
      claimType,
      reason,
      submittedDate: new Date().toISOString().split('T')[0],
      status: "pending",
    };

    setClaims([newClaim, ...claims]);
    setSelectedModule("");
    setClaimType("");
    setReason("");
    setSelectedFile(null);

    toast({
      title: "Claim Submitted",
      description: "Your marks claim has been submitted successfully. You will be notified once it's reviewed.",
    });
  };

  const pendingCount = claims.filter(c => c.status === "pending" || c.status === "under_review").length;
  const approvedCount = claims.filter(c => c.status === "approved").length;
  const rejectedCount = claims.filter(c => c.status === "rejected").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Marks Claims</h1>
          <p className="text-muted-foreground">Submit and track your grade review requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Claims</p>
                <p className="text-2xl font-bold text-primary">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList>
          <TabsTrigger value="submit">Submit New Claim</TabsTrigger>
          <TabsTrigger value="history">Claim History ({claims.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="mt-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Submit Marks Claim
              </CardTitle>
              <CardDescription>
                If you believe there's an error in your marks, submit a claim for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitClaim} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="module">Select Module *</Label>
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a module" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map((module) => (
                          <SelectItem key={module.code} value={module.code}>
                            {module.code} - {module.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claimType">Claim Type *</Label>
                    <Select value={claimType} onValueChange={setClaimType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        {claimTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Claim *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed explanation of why you believe your marks are incorrect. Include specific questions, expected marks, and any supporting details..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence">Supporting Evidence (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="evidence"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("evidence")?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {selectedFile ? selectedFile.name : "Upload Supporting Document"}
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Claim
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
              <CardDescription>
                Track the status of your submitted claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              {claims.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No claims submitted yet</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Module</TableHead>
                        <TableHead>Claim Type</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claims.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{claim.moduleCode}</p>
                              <p className="text-xs text-muted-foreground">{claim.moduleName}</p>
                            </div>
                          </TableCell>
                          <TableCell>{claim.claimType}</TableCell>
                          <TableCell>{new Date(claim.submittedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(claim.status)}</TableCell>
                          <TableCell className="max-w-xs">
                            {claim.response ? (
                              <p className="text-sm text-muted-foreground truncate">{claim.response}</p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">Awaiting response...</p>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
