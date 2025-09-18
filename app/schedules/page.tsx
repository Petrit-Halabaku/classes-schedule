import { createClient } from "@/lib/supabase/server";
import { ScheduleTable } from "@/components/schedule-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SchedulesPage() {
  const supabase = await createClient();

  // Fetch schedule data with all related information
  const { data, error } = await supabase
    .from("schedules")
    .select(
      `
    *,
    courses!schedules_course_id_fkey(*, programs!courses_program_id_fkey(*)),
    instructors!schedules_instructor_id_fkey(*),
    rooms!schedules_room_id_fkey(*)
  `
    )
    .order("day_of_week")
    .order("start_time");

  if (!data) {
    console.error("Error fetching schedules: No data returned");
    return <div>Error loading schedule data</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Class Schedule Management System
          </h1>
          <p className="text-muted-foreground">
            Academic Year 2025 - Computer Science Master's Program
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              PROGRAMI: SHKENCA KOMPJUTERIKE (MASTER)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleTable schedules={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
