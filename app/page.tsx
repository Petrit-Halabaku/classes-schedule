import { createClient } from "@/lib/supabase/server";
import { ScheduleTable } from "@/components/schedule-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationsBanner } from "@/components/notifications-banner";

export default async function HomePage() {
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

  // Determine latest update time across schedules
  const latestUpdatedAtIso = data
    .map((s: any) => s?.updated_at || s?.created_at)
    .filter(Boolean)
    .sort()
    .pop();
  const lastUpdatedDisplay = latestUpdatedAtIso
    ? new Date(latestUpdatedAtIso).toLocaleString("en-EN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

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

        {/* Notifications section under Academic Year */}
        <NotificationsBanner />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">
              PROGRAMI: SHKENCA KOMPJUTERIKE (MASTER)
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Ligjeratat fillojne me daten 15 Stator 2025
              {lastUpdatedDisplay && (
                <span className="block mt-1 text-xs">
                  Last Updated: {lastUpdatedDisplay}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleTable schedules={data} />
          </CardContent>
        </Card>
        <div className="pt-12">
          <p className="text-center text-[10px] text-muted-foreground">
            Property of{" "}
            <a
              href="https://linkedin.com/in/petrit-halabaku"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Petrit Halabaku
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
