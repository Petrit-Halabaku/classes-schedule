import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewStats } from "@/components/overview-stats";
import { RecentSchedules } from "@/components/recent-schedules";
import { ScheduleChart } from "@/components/schedule-chart";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch overview statistics
  const [
    { count: coursesCount },
    { count: instructorsCount },
    { count: roomsCount },
    { count: schedulesCount },
    { data: recentSchedules },
    { data: schedulesByDay },
  ] = await Promise.all([
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("instructors").select("*", { count: "exact", head: true }),
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase.from("schedules").select("*", { count: "exact", head: true }),
    supabase
      .from("schedules")
      .select(
        `
        *,
        course:courses(name, code),
        instructor:instructors(name),
        room:rooms(name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("schedules").select("day_of_week").order("day_of_week"),
  ]);

  // Process schedule data for chart
  const dayStats =
    schedulesByDay?.reduce((acc: Record<number, number>, schedule) => {
      acc[schedule.day_of_week] = (acc[schedule.day_of_week] || 0) + 1;
      return acc;
    }, {}) || {};

  const chartData = [
    { day: "Monday", count: dayStats[1] || 0 },
    { day: "Tuesday", count: dayStats[2] || 0 },
    { day: "Wednesday", count: dayStats[3] || 0 },
    { day: "Thursday", count: dayStats[4] || 0 },
    { day: "Friday", count: dayStats[5] || 0 },
    { day: "Saturday", count: dayStats[6] || 0 },
    { day: "Sunday", count: dayStats[7] || 0 },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of your class scheduling system
            </p>
          </div>

          <OverviewStats
            coursesCount={coursesCount || 0}
            instructorsCount={instructorsCount || 0}
            roomsCount={roomsCount || 0}
            schedulesCount={schedulesCount || 0}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedules by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduleChart data={chartData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSchedules schedules={recentSchedules || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
