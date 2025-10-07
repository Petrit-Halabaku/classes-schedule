"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export function NotificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();
    const formData = new FormData(e.currentTarget);

    try {
      const startAt = formData.get("start_at") as string | null;
      const endAt = formData.get("end_at") as string | null;
      const { error } = await supabase.from("notifications").insert({
        title: formData.get("title") as string,
        message: formData.get("message") as string,
        severity: formData.get("severity") as string,
        is_active: Boolean(formData.get("is_active")),
        start_at: startAt ? new Date(startAt).toISOString() : null,
        end_at: endAt ? new Date(endAt).toISOString() : null,
      });

      if (error) throw error;

      toast({ title: "Saved", description: "Notification created" });
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create notification",
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
          <Label htmlFor="title">Title</Label>
          <Input name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <Select name="severity" defaultValue="info" required>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea name="message" required rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_at">Start At</Label>
          <Input name="start_at" type="datetime-local" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_at">End At</Label>
          <Input name="end_at" type="datetime-local" />
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <Checkbox id="is_active" name="is_active" defaultChecked />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Create Notification"}
      </Button>
    </form>
  );
}
