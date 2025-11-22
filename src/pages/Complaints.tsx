import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Send,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  UploadCloud,
} from "lucide-react";
import { toast } from "react-toastify";

// Mock Data for Complaint History
const complaintHistory = [
  {
    id: "CPL-2023-001",
    subject: "Noise Complaint - Late Night Karaoke",
    date: "Oct 15, 2023",
    status: "Resolved",
    statusColor: "text-green-500 bg-green-500/10",
    description: "Neighbors singing loudly past 10 PM on a weekday.",
  },
  {
    id: "CPL-2023-005",
    subject: "Uncollected Garbage",
    date: "Nov 02, 2023",
    status: "Pending",
    statusColor: "text-orange-500 bg-orange-500/10",
    description: "Garbage truck missed our street for 2 consecutive schedules.",
  },
];

const Complaints = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Complaint submitted successfully. Reference ID: CPL-2023-006"
      );
      setActiveTab("history");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Complaints & Reports
          </h1>
          <p className="text-muted-foreground">
            File a complaint or report an incident securely. Track the status of
            your reports here.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] p-1 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            File New Complaint
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Clock className="mr-2 h-4 w-4" />
            History & Status
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="new"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Complaint Form</CardTitle>
                  <CardDescription>
                    Please provide detailed information about the incident. Your
                    identity will be kept confidential if requested.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    id="complaint-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Type of Complaint" required>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="">Select type...</option>
                          <option value="noise">Noise Disturbance</option>
                          <option value="sanitation">
                            Sanitation / Garbage
                          </option>
                          <option value="security">Security Concern</option>
                          <option value="dispute">Neighbor Dispute</option>
                          <option value="other">Other</option>
                        </select>
                      </FormField>

                      <FormField label="Date of Incident" required>
                        <Input type="date" className="bg-background" />
                      </FormField>
                    </div>

                    <FormField label="Subject" required>
                      <Input
                        placeholder="Brief summary of the issue"
                        className="bg-background"
                      />
                    </FormField>

                    <FormField label="Detailed Description" required>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Please describe what happened, including time, location, and persons involved..."
                      />
                    </FormField>

                    <FormField label="Evidence / Attachments (Optional)">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/20 transition-colors cursor-pointer">
                        <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files here, or click to select files
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports JPG, PNG, PDF (Max 5MB)
                        </p>
                      </div>
                    </FormField>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="confidential"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="confidential"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Keep my identity confidential
                      </label>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-muted/10 p-6">
                  <Button
                    type="submit"
                    form="complaint-form"
                    size="lg"
                    disabled={isSubmitting}
                    className="shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                    {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/50">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-400 text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Important Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Please ensure all information provided is accurate. False
                    reporting may lead to legal consequences.
                  </p>
                  <p>
                    For emergencies requiring immediate police or medical
                    assistance, please call <strong>911</strong> or the Barangay
                    Emergency Hotline: <strong>(02) 8123-4567</strong>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Process Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l-2 border-muted space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <h4 className="font-medium text-sm">Submission</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fill out the form with details and evidence.
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <h4 className="font-medium text-sm">Review</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Barangay officials will review your complaint within 24
                        hours.
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <h4 className="font-medium text-sm">Action/Mediation</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Schedule for mediation or appropriate action will be
                        taken.
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <h4 className="font-medium text-sm">Resolution</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Case closed upon agreement or escalation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="history"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>My Complaints</CardTitle>
              <CardDescription>
                Track the status of your submitted reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {item.subject}
                        </span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                          {item.id}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <Clock className="h-3 w-3" />
                        <span>Filed on {item.date}</span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${item.statusColor}`}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Complaints;
