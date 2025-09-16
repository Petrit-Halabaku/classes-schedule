"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Course {
  id: string;
  name: string;
  code: string;
}
interface Instructor {
  id: string;
  name: string;
}
interface Room {
  id: string;
  name: string;
  code: string;
}

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  session_type: string;
  course_id?: string;
  instructor_id?: string;
  room_id?: string;
  course?: { name: string; code: string };
  instructor?: { name: string };
  room?: { name: string };
}

interface SchedulesTableProps {
  schedules: Schedule[];
  courses: Course[];
  instructors: Instructor[];
  rooms: Room[];
}

const dayNames: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  // 6: "Saturday",
  // 7: "Sunday",
};

export function SchedulesTable({
  schedules,
  courses,
  instructors,
  rooms,
}: SchedulesTableProps) {
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(schedules);
  const { toast } = useToast();

  const formatTime = (time: string) => time.slice(0, 5);

  function ScheduleEditDialog({ schedule }: { schedule: Schedule }) {
    const [open, setOpen] = useState(false);
    const [courseId, setCourseId] = useState<string>(schedule.course_id || "");
    const [instructorId, setInstructorId] = useState<string>(
      schedule.instructor_id || ""
    );
    const [roomId, setRoomId] = useState<string>(schedule.room_id || "");
    const [dayOfWeek, setDayOfWeek] = useState<string>(
      String(schedule.day_of_week)
    );
    const [startTime, setStartTime] = useState<string>(
      formatTime(schedule.start_time)
    );
    const [endTime, setEndTime] = useState<string>(
      formatTime(schedule.end_time)
    );
    const [sessionType, setSessionType] = useState<string>(
      schedule.session_type
    );
    const [isSaving, setIsSaving] = useState(false);

    const onSave = async () => {
      setIsSaving(true);
      const supabase = createClient();
      try {
        const payload = {
          course_id: courseId,
          instructor_id: instructorId,
          room_id: roomId,
          day_of_week: Number(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
          session_type: sessionType,
        };
        const { error } = await supabase
          .from("schedules")
          .update(payload)
          .eq("id", schedule.id);
        if (error) throw error;

        const courseMap = new Map(courses.map((c) => [c.id, c]));
        const instructorMap = new Map(instructors.map((i) => [i.id, i]));
        const roomMap = new Map(rooms.map((r) => [r.id, r]));

        setLocalSchedules((prev) =>
          prev.map((s) =>
            s.id === schedule.id
              ? {
                  ...s,
                  ...payload,
                  course: courseMap.get(courseId)
                    ? {
                        name: courseMap.get(courseId)!.name,
                        code: courseMap.get(courseId)!.code,
                      }
                    : s.course,
                  instructor: instructorMap.get(instructorId)
                    ? { name: instructorMap.get(instructorId)!.name }
                    : s.instructor,
                  room: roomMap.get(roomId)
                    ? { name: roomMap.get(roomId)!.name }
                    : s.room,
                }
              : s
          )
        );
        toast({ title: "Saved", description: "Schedule updated" });
        setOpen(false);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to update schedule",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Course</label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Instructor</label>
              <Select value={instructorId} onValueChange={setInstructorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Room</label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"-"}>-</SelectItem>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Day of Week</label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hënë</SelectItem>
                  <SelectItem value="2">Marte</SelectItem>
                  <SelectItem value="3">Mërkure</SelectItem>
                  <SelectItem value="4">Enjte</SelectItem>
                  <SelectItem value="5">Premte</SelectItem>
                  <SelectItem value="6">Shtune</SelectItem>
                  <SelectItem value="7">Diele</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="start-time">
                Start Time
              </label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="end-time">
                End Time
              </label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm">Session Type</label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LECTURE">Lecture</SelectItem>
                  <SelectItem value="LAB">Laboratory</SelectItem>
                  <SelectItem value="SEMINAR">Seminar</SelectItem>
                  <SelectItem value="EXAM">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.course?.name} ({schedule.course?.code})
                  </TableCell>
                  <TableCell>{schedule.instructor?.name}</TableCell>
                  <TableCell>{schedule.room?.name}</TableCell>
                  <TableCell>{dayNames[schedule.day_of_week]}</TableCell>
                  <TableCell>
                    {formatTime(schedule.start_time)} -{" "}
                    {formatTime(schedule.end_time)}
                  </TableCell>
                  <TableCell>{schedule.session_type}</TableCell>
                  <TableCell>
                    <ScheduleEditDialog schedule={schedule} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
