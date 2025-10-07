import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseForm } from "@/components/course-form";
import { InstructorForm } from "@/components/instructor-form";
import { RoomForm } from "@/components/room-form";
import { ScheduleForm } from "@/components/schedule-form";
import { CoursesTable } from "@/components/courses-table";
import { InstructorsTable } from "@/components/instructors-table";
import { RoomsTable } from "@/components/rooms-table";
import { SchedulesTable } from "@/components/schedules-table";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { NotificationForm } from "@/components/notification-form";
import { NotificationsTable } from "@/components/notifications-table";

export default async function ManagePage() {
  const supabase = await createClient();

  // Fetch all data for dropdowns and tables
  const [
    { data: programs },
    { data: instructors },
    { data: rooms },
    { data: courses },
    { data: schedules },
    { data: notifications },
  ] = await Promise.all([
    supabase.from("programs").select("*").order("name"),
    supabase.from("instructors").select("*").order("name"),
    supabase.from("rooms").select("*").order("name"),
    supabase.from("courses").select("*, program:programs(*)").order("name"),
    supabase
      .from("schedules")
      .select(
        `
      *,
      course:courses(*),
      instructor:instructors(*),
      room:rooms(*)
    `
      )
      .order("day_of_week")
      .order("start_time"),
    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Course Management System
            </h1>
            <p className="text-muted-foreground">
              Manage courses, instructors, rooms, and schedules
            </p>
          </div>

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="instructors">Instructors</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="schedules">Schedules</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseForm programs={programs || []} />
                </CardContent>
              </Card>
              <CoursesTable courses={courses || []} programs={programs || []} />
            </TabsContent>

            <TabsContent value="instructors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <InstructorForm />
                </CardContent>
              </Card>
              <InstructorsTable instructors={instructors || []} />
            </TabsContent>

            <TabsContent value="rooms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <RoomForm />
                </CardContent>
              </Card>
              <RoomsTable rooms={rooms || []} />
            </TabsContent>

            <TabsContent value="schedules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScheduleForm
                    courses={courses || []}
                    instructors={instructors || []}
                    rooms={rooms || []}
                  />
                </CardContent>
              </Card>
              <SchedulesTable
                schedules={schedules || []}
                courses={courses || []}
                instructors={instructors || []}
                rooms={rooms || []}
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationForm />
                </CardContent>
              </Card>
              <NotificationsTable notifications={notifications || []} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
