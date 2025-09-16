"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

interface ScheduleFormProps {
  courses: Course[];
  instructors: Instructor[];
  rooms: Room[];
}

const dayOptions = [
  { value: "1", label: "Hënë" },
  { value: "2", label: "Marte" },
  { value: "3", label: "Mërkure" },
  { value: "4", label: "Enjte" },
  { value: "5", label: "Premte" },
  { value: "6", label: "Shtune" },
  { value: "7", label: "Diele" },
];

export function ScheduleForm({
  courses,
  instructors,
  rooms,
}: ScheduleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartTime, setHasStartTime] = useState(true);
  const [hasEndTime, setHasEndTime] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    try {
      const startTimeValue = formData.get("start_time");
      const endTimeValue = formData.get("end_time");

      const { error } = await supabase.from("schedules").insert({
        course_id: formData.get("course_id") as string,
        instructor_id: formData.get("instructor_id") as string,
        room_id: formData.get("room_id") as string,
        day_of_week: Number.parseInt(formData.get("day_of_week") as string),
        start_time: startTimeValue ? (startTimeValue as string) : null,
        end_time: endTimeValue ? (endTimeValue as string) : null,
        session_type: formData.get("session_type") as string,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule added successfully",
      });

      // Reset form
      e.currentTarget.reset();
      setHasStartTime(true);
      setHasEndTime(true);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add schedule",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course_id">Course</Label>
          <Select name="course_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor_id">Instructor</Label>
          <Select name="instructor_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_id">Room</Label>
          <Select name="room_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} ({room.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="day_of_week">Day of Week</Label>
          <Select name="day_of_week" required>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="start_time">Start Time</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="no_start_time"
                checked={!hasStartTime}
                onCheckedChange={(checked) =>
                  setHasStartTime(!Boolean(checked))
                }
              />
              <Label htmlFor="no_start_time" className="text-sm font-normal">
                No start time for now
              </Label>
            </div>
          </div>
          <Input
            name="start_time"
            type="time"
            required={hasStartTime}
            disabled={!hasStartTime}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="end_time">End Time</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="no_end_time"
                checked={!hasEndTime}
                onCheckedChange={(checked) => setHasEndTime(!Boolean(checked))}
              />
              <Label htmlFor="no_end_time" className="text-sm font-normal">
                No end time for now
              </Label>
            </div>
          </div>
          <Input
            name="end_time"
            type="time"
            required={hasEndTime}
            disabled={!hasEndTime}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="session_type">Session Type</Label>
          <Select name="session_type" required>
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

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding Schedule..." : "Add Schedule"}
      </Button>
    </form>
  );
}
