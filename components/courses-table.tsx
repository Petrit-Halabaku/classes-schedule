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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useState, useMemo } from "react";

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  ects_credits: number;
  program?: {
    name: string;
  };
}

interface ProgramOption {
  id: string;
  name: string;
}

interface EditableCourse extends Course {
  program_id?: string;
}

interface CoursesTableProps {
  courses: Course[];
  programs: ProgramOption[];
}

export function CoursesTable({ courses, programs }: CoursesTableProps) {
  const [localCourses, setLocalCourses] = useState<EditableCourse[]>(
    courses as EditableCourse[]
  );
  const { toast } = useToast();

  const programIdToName = useMemo(() => {
    const map = new Map<string, string>();
    programs.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [programs]);

  function CourseEditDialog({ course }: { course: EditableCourse }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(course.name);
    const [code, setCode] = useState(course.code);
    const [credits, setCredits] = useState<number>(course.credits);
    const [ects, setEcts] = useState<number>(course.ects_credits);
    const [programId, setProgramId] = useState<string | undefined>(
      course.program_id
    );
    const [isSaving, setIsSaving] = useState(false);

    const onSave = async () => {
      setIsSaving(true);
      const supabase = createClient();
      try {
        const { error } = await supabase
          .from("courses")
          .update({
            name,
            code,
            credits,
            ects_credits: ects,
            program_id: programId || null,
          })
          .eq("id", course.id);
        if (error) throw error;
        setLocalCourses((prev) =>
          prev.map((c) =>
            c.id === course.id
              ? {
                  ...c,
                  name,
                  code,
                  credits,
                  ects_credits: ects,
                  program_id: programId,
                }
              : c
          )
        );
        toast({ title: "Saved", description: "Course updated" });
        setOpen(false);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to update course",
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
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm" htmlFor="course-name">
                Name
              </label>
              <Input
                id="course-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="course-code">
                Code
              </label>
              <Input
                id="course-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="course-credits">
                Credits
              </label>
              <Input
                id="course-credits"
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="course-ects">
                ECTS
              </label>
              <Input
                id="course-ects"
                type="number"
                value={ects}
                onChange={(e) => setEcts(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm">Program</label>
              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
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

  function CourseDeleteDialog({ course }: { course: EditableCourse }) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
      setIsDeleting(true);
      const supabase = createClient();
      try {
        const { error } = await supabase
          .from("courses")
          .delete()
          .eq("id", course.id);
        if (error) throw error;
        setLocalCourses((prev) => prev.filter((c) => c.id !== course.id));
        toast({ title: "Deleted", description: "Course removed" });
        setOpen(false);
      } catch (e) {
        toast({
          title: "Error",
          description:
            "Failed to delete course. It may be referenced by schedules.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              {course.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>ECTS</TableHead>
                <TableHead>Program</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.ects_credits}</TableCell>
                  <TableCell>
                    {course.program?.name ||
                      (course.program_id
                        ? programIdToName.get(course.program_id)
                        : undefined)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <CourseEditDialog course={course} />
                      <CourseDeleteDialog course={course} />
                    </div>
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
