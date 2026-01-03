import { BookOpen, User, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    code: "CS301",
    instructor: "Dr. Sarah Chen",
    progress: 75,
    credits: 4,
    schedule: "Mon, Wed 10:00 AM",
    status: "active",
  },
  {
    id: 2,
    name: "Web Development Fundamentals",
    code: "CS302",
    instructor: "Prof. Michael Torres",
    progress: 60,
    credits: 3,
    schedule: "Tue, Thu 2:00 PM",
    status: "active",
  },
  {
    id: 3,
    name: "Linear Algebra",
    code: "MATH201",
    instructor: "Dr. Emily Watson",
    progress: 85,
    credits: 3,
    schedule: "Mon, Wed, Fri 9:00 AM",
    status: "active",
  },
  {
    id: 4,
    name: "Database Systems",
    code: "CS303",
    instructor: "Prof. James Liu",
    progress: 45,
    credits: 4,
    schedule: "Tue, Thu 11:00 AM",
    status: "active",
  },
  {
    id: 5,
    name: "Software Engineering",
    code: "CS304",
    instructor: "Dr. Rachel Kim",
    progress: 55,
    credits: 3,
    schedule: "Wed, Fri 1:00 PM",
    status: "active",
  },
  {
    id: 6,
    name: "Computer Networks",
    code: "CS305",
    instructor: "Prof. David Brown",
    progress: 30,
    credits: 3,
    schedule: "Mon, Thu 3:00 PM",
    status: "active",
  },
];

export default function Courses() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Courses</h1>
          <p className="text-muted-foreground">
            Spring 2026 Semester • 6 courses enrolled
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          20 Credits Total
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <Card
            key={course.id}
            className="group hover:shadow-md transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs font-normal mb-1">
                      {course.code}
                    </Badge>
                    <CardTitle className="text-base leading-tight">
                      {course.name}
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.schedule}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {course.credits} Credits
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary group-hover:bg-primary/10"
                >
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
