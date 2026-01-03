import { useState } from "react";
import { MessageSquare, Mail, Phone, FileQuestion, Send, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How do I request a grade review?",
    answer: "Navigate to the Grades page, find the course you want to review, and click the 'Request Review' button. Fill out the form with your reason and any supporting evidence.",
  },
  {
    question: "How long can I borrow library books?",
    answer: "Standard loan period is 14 days. You can renew books up to 2 times if no one else has reserved them. Overdue books incur a fee of $0.50 per day.",
  },
  {
    question: "How do I access my course materials?",
    answer: "Go to the Courses page and select your course. All materials including lecture notes, assignments, and resources are available in each course's detail page.",
  },
  {
    question: "Can I drop a course after registration?",
    answer: "You can drop courses within the first two weeks of the semester without penalty. After that, you'll need to fill out a course withdrawal form and get advisor approval.",
  },
  {
    question: "How is my GPA calculated?",
    answer: "GPA is calculated by multiplying each course grade's point value by its credit hours, summing these products, and dividing by total credit hours attempted.",
  },
];

const contactOptions = [
  { icon: MessageSquare, label: "Live Chat", description: "Chat with support (9 AM - 6 PM)", action: "Start Chat" },
  { icon: Mail, label: "Email Support", description: "support@university.edu", action: "Send Email" },
  { icon: Phone, label: "Phone Support", description: "+1 (555) 123-4567", action: "Call Now" },
];

export default function Support() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !category || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket Submitted",
      description: "We'll get back to you within 24-48 hours.",
    });
    
    setSubject("");
    setCategory("");
    setMessage("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">Get help with your academic journey</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Options */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-medium text-lg">Contact Us</h2>
          {contactOptions.map((option, index) => (
            <Card
              key={option.label}
              className="animate-slide-up cursor-pointer hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <option.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Ticket */}
        <Card className="lg:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Submit a Support Ticket</CardTitle>
            <CardDescription>
              Describe your issue and we'll respond within 24-48 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grades">Grades & Transcripts</SelectItem>
                      <SelectItem value="courses">Course Registration</SelectItem>
                      <SelectItem value="library">Library Services</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="animate-slide-up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
