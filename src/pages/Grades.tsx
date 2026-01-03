import { useState, useRef } from "react";
import { Download, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface GradeEntry {
  id: number;
  code: string;
  module: string;
  credits: number;
  totalMarks: number;
  examMarks: number;
  cat1: number;
  cat2: number;
  totalObtained: number;
  obtainedMarks: number;
}

interface YearData {
  year: number;
  semester: string;
  grades: GradeEntry[];
  percentage: number;
  grade: string;
  deliberation: string;
}

const yearData: YearData[] = [
  {
    year: 1,
    semester: "2024-2025",
    grades: [
      { id: 1, code: "CS101", module: "Introduction to Programming", credits: 4, totalMarks: 100, examMarks: 60, cat1: 15, cat2: 15, totalObtained: 78, obtainedMarks: 78 },
      { id: 2, code: "MATH101", module: "Calculus I", credits: 3, totalMarks: 100, examMarks: 60, cat1: 15, cat2: 15, totalObtained: 82, obtainedMarks: 82 },
      { id: 3, code: "ENG101", module: "Technical Writing", credits: 2, totalMarks: 100, examMarks: 60, cat1: 15, cat2: 15, totalObtained: 75, obtainedMarks: 75 },
      { id: 4, code: "PHY101", module: "Physics I", credits: 3, totalMarks: 100, examMarks: 60, cat1: 15, cat2: 15, totalObtained: 70, obtainedMarks: 70 },
      { id: 5, code: "CS102", module: "Computer Fundamentals", credits: 3, totalMarks: 100, examMarks: 60, cat1: 15, cat2: 15, totalObtained: 85, obtainedMarks: 85 },
    ],
    percentage: 78.0,
    grade: "B+",
    deliberation: "Promoted to Year 2",
  },
  {
    year: 2,
    semester: "2025-2026",
    grades: [
      { id: 1, code: "CS201", module: "Data Structures & Algorithms", credits: 4, totalMarks: 100, examMarks: 60, cat1: 18, cat2: 17, totalObtained: 92, obtainedMarks: 92 },
      { id: 2, code: "CS202", module: "Web Development Fundamentals", credits: 3, totalMarks: 100, examMarks: 60, cat1: 14, cat2: 16, totalObtained: 84, obtainedMarks: 84 },
      { id: 3, code: "MATH201", module: "Linear Algebra", credits: 3, totalMarks: 100, examMarks: 60, cat1: 19, cat2: 18, totalObtained: 95, obtainedMarks: 95 },
      { id: 4, code: "CS203", module: "Database Systems", credits: 4, totalMarks: 100, examMarks: 60, cat1: 12, cat2: 14, totalObtained: 79, obtainedMarks: 79 },
      { id: 5, code: "CS204", module: "Software Engineering", credits: 3, totalMarks: 100, examMarks: 60, cat1: 16, cat2: 17, totalObtained: 88, obtainedMarks: 88 },
      { id: 6, code: "CS205", module: "Computer Networks", credits: 3, totalMarks: 100, examMarks: 60, cat1: 13, cat2: 12, totalObtained: 75, obtainedMarks: 75 },
    ],
    percentage: 85.5,
    grade: "A-",
    deliberation: "In Progress",
  },
];

const getGradeBadgeVariant = (grade: string) => {
  if (grade.startsWith("A")) return "default";
  if (grade.startsWith("B")) return "secondary";
  return "outline";
};

const getDeliberationBadgeVariant = (deliberation: string) => {
  if (deliberation.includes("Promoted")) return "default";
  if (deliberation.includes("Progress")) return "secondary";
  return "outline";
};

export default function Grades() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  // Default to the last/current year
  const [selectedYear, setSelectedYear] = useState(yearData[yearData.length - 1].year.toString());
  
  const currentYearData = yearData.find(y => y.year.toString() === selectedYear) || yearData[yearData.length - 1];

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to print your transcript.",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Academic Transcript - Year ${selectedYear}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #1e40af; }
            h2 { color: #374151; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: 600; }
            .summary { display: flex; justify-content: space-between; margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; }
            .summary-item { text-align: center; }
            .summary-label { font-size: 12px; color: #6b7280; }
            .summary-value { font-size: 18px; font-weight: 600; color: #1f2937; }
            .header-info { text-align: center; margin-bottom: 30px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header-info">
            <h1>EduPortal University</h1>
            <p>Official Academic Transcript</p>
            <p>Academic Year: ${currentYearData.semester}</p>
          </div>
          <h2>Year ${selectedYear} - Grade Report</h2>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Module</th>
                <th>Credits</th>
                <th>Total Marks</th>
                <th>Exam Marks</th>
                <th>CAT1</th>
                <th>CAT2</th>
                <th>Total Obtained</th>
                <th>Obtained Marks</th>
              </tr>
            </thead>
            <tbody>
              ${currentYearData.grades.map(entry => `
                <tr>
                  <td>${entry.code}</td>
                  <td>${entry.module}</td>
                  <td>${entry.credits}</td>
                  <td>${entry.totalMarks}</td>
                  <td>${entry.examMarks}</td>
                  <td>${entry.cat1}</td>
                  <td>${entry.cat2}</td>
                  <td>${entry.totalObtained}</td>
                  <td>${entry.obtainedMarks}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Overall Percentage</div>
              <div class="summary-value">${currentYearData.percentage}%</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Final Grade</div>
              <div class="summary-value">${currentYearData.grade}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Deliberation Decision</div>
              <div class="summary-value">${currentYearData.deliberation}</div>
            </div>
          </div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>This is an official document from EduPortal University</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const content = `
EDUPORTAL UNIVERSITY
Official Academic Transcript
Academic Year: ${currentYearData.semester}
Year ${selectedYear} - Grade Report

${'='.repeat(120)}
${'Code'.padEnd(10)} | ${'Module'.padEnd(35)} | ${'Credits'.padEnd(8)} | ${'Total'.padEnd(8)} | ${'Exam'.padEnd(8)} | ${'CAT1'.padEnd(6)} | ${'CAT2'.padEnd(6)} | ${'Obtained'.padEnd(10)} | ${'Marks'.padEnd(8)}
${'='.repeat(120)}
${currentYearData.grades.map(entry => 
  `${entry.code.padEnd(10)} | ${entry.module.padEnd(35)} | ${entry.credits.toString().padEnd(8)} | ${entry.totalMarks.toString().padEnd(8)} | ${entry.examMarks.toString().padEnd(8)} | ${entry.cat1.toString().padEnd(6)} | ${entry.cat2.toString().padEnd(6)} | ${entry.totalObtained.toString().padEnd(10)} | ${entry.obtainedMarks.toString().padEnd(8)}`
).join('\n')}
${'='.repeat(120)}

SUMMARY
-------
Overall Percentage: ${currentYearData.percentage}%
Final Grade: ${currentYearData.grade}
Deliberation Decision: ${currentYearData.deliberation}

Generated on ${new Date().toLocaleDateString()}
This is an official document from EduPortal University
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-year-${selectedYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Your transcript has been downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Grades & Transcripts</h1>
          <p className="text-muted-foreground">View your academic performance by year</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={() => navigate('/claims')}>
            Claim Marks
          </Button>
        </div>
      </div>

      <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
        <TabsList className="mb-4">
          {yearData.map((year) => (
            <TabsTrigger key={year.year} value={year.year.toString()}>
              Year {year.year} ({year.semester})
            </TabsTrigger>
          ))}
        </TabsList>

        {yearData.map((year) => (
          <TabsContent key={year.year} value={year.year.toString()}>
            <Card className="animate-slide-up" ref={year.year.toString() === selectedYear ? printRef : null}>
              <CardHeader>
                <CardTitle className="text-lg">Year {year.year} - Grade Summary</CardTitle>
                <CardDescription>
                  Academic Year {year.semester}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Code</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-center">Credits</TableHead>
                        <TableHead className="text-center">Total Marks</TableHead>
                        <TableHead className="text-center">Exam Marks</TableHead>
                        <TableHead className="text-center">CAT1</TableHead>
                        <TableHead className="text-center">CAT2</TableHead>
                        <TableHead className="text-center">Total Obtained</TableHead>
                        <TableHead className="text-center">Obtained Marks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {year.grades.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.code}</TableCell>
                          <TableCell>{entry.module}</TableCell>
                          <TableCell className="text-center">{entry.credits}</TableCell>
                          <TableCell className="text-center">{entry.totalMarks}</TableCell>
                          <TableCell className="text-center">{entry.examMarks}</TableCell>
                          <TableCell className="text-center">{entry.cat1}</TableCell>
                          <TableCell className="text-center">{entry.cat2}</TableCell>
                          <TableCell className="text-center font-medium">{entry.totalObtained}</TableCell>
                          <TableCell className="text-center">{entry.obtainedMarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Summary Section */}
                <div className="rounded-lg bg-secondary/30 p-6">
                  <h3 className="text-lg font-semibold mb-4">Year Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-background rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Overall Percentage</p>
                      <p className="text-3xl font-bold text-primary">{year.percentage}%</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Final Grade</p>
                      <Badge variant={getGradeBadgeVariant(year.grade)} className="text-lg px-4 py-1">
                        {year.grade}
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Deliberation Decision</p>
                      <Badge variant={getDeliberationBadgeVariant(year.deliberation)} className="text-sm px-3 py-1">
                        {year.deliberation}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
