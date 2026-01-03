import { BookOpen, GraduationCap, Library, Clock, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  { label: "Enrolled Courses", value: "6", icon: BookOpen, color: "text-primary" },
  { label: "Current GPA", value: "3.75", icon: TrendingUp, color: "text-success" },
  { label: "Books Borrowed", value: "3", icon: Library, color: "text-warning" },
  { label: "Credits Earned", value: "78", icon: GraduationCap, color: "text-primary" },
];

const upcomingDeadlines = [
  { course: "CS301", task: "Database Project", due: "Jan 5, 2026", priority: "high" },
  { course: "CS302", task: "Algorithm Analysis", due: "Jan 8, 2026", priority: "medium" },
  { course: "MATH201", task: "Problem Set 4", due: "Jan 10, 2026", priority: "low" },
];

const courseProgress = [
  { name: "Data Structures", code: "CS301", progress: 75 },
  { name: "Web Development", code: "CS302", progress: 60 },
  { name: "Linear Algebra", code: "MATH201", progress: 85 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your academic progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="animate-slide-up">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Course Progress */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
            <CardDescription>Your current semester completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {courseProgress.map((course) => (
              <div key={course.code} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{course.name}</span>
                  <span className="text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">{deadline.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{deadline.due}</p>
                    <div
                      className={`inline-flex items-center gap-1 text-xs ${
                        deadline.priority === "high"
                          ? "text-destructive"
                          : deadline.priority === "medium"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {deadline.priority} priority
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "View All Courses", icon: BookOpen },
              { label: "Check Grades", icon: GraduationCap },
              { label: "Browse Library", icon: Library },
              { label: "Get Support", icon: Clock },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
