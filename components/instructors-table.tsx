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
import { useState } from "react";

interface Instructor {
  id: string;
  name: string;
  title?: string;
  email?: string;
}

interface InstructorsTableProps {
  instructors: Instructor[];
}

export function InstructorsTable({ instructors }: InstructorsTableProps) {
  const [localInstructors, setLocalInstructors] =
    useState<Instructor[]>(instructors);
  const { toast } = useToast();

  function InstructorEditDialog({ instructor }: { instructor: Instructor }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(instructor.name);
    const [email, setEmail] = useState(instructor.email || "");
    const [title, setTitle] = useState(instructor.title || "");
    const [isSaving, setIsSaving] = useState(false);

    const onSave = async () => {
      setIsSaving(true);
      const supabase = createClient();
      try {
        const { error } = await supabase
          .from("instructors")
          .update({ name, email: email || null, title: title || null })
          .eq("id", instructor.id);
        if (error) throw error;
        setLocalInstructors((prev) =>
          prev.map((i) =>
            i.id === instructor.id
              ? {
                  ...i,
                  name,
                  email: email || undefined,
                  title: title || undefined,
                }
              : i
          )
        );
        toast({ title: "Saved", description: "Instructor updated" });
        setOpen(false);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to update instructor",
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
            <DialogTitle>Edit Instructor</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm" htmlFor="inst-name">
                Name
              </label>
              <Input
                id="inst-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="inst-email">
                Email
              </label>
              <Input
                id="inst-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm">Title</label>
              <Select value={title} onValueChange={setTitle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Associate Professor">
                    Associate Professor
                  </SelectItem>
                  <SelectItem value="Assistant Professor">
                    Assistant Professor
                  </SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                  <SelectItem value="Teaching Assistant">
                    Teaching Assistant
                  </SelectItem>
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

  function InstructorDeleteDialog({ instructor }: { instructor: Instructor }) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
      setIsDeleting(true);
      const supabase = createClient();
      try {
        const { error } = await supabase
          .from("instructors")
          .delete()
          .eq("id", instructor.id);
        if (error) throw error;
        setLocalInstructors((prev) =>
          prev.filter((i) => i.id !== instructor.id)
        );
        toast({ title: "Deleted", description: "Instructor removed" });
        setOpen(false);
      } catch (e) {
        toast({
          title: "Error",
          description:
            "Failed to delete instructor. They may be referenced by schedules.",
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
            <AlertDialogTitle>Delete instructor?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              {instructor.name}".
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
        <CardTitle>All Instructors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localInstructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">
                    {instructor.name}
                  </TableCell>
                  <TableCell>{instructor.title || "—"}</TableCell>
                  <TableCell>{instructor.email || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <InstructorEditDialog instructor={instructor} />
                      <InstructorDeleteDialog instructor={instructor} />
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
