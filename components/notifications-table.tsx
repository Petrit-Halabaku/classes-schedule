"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  title: string;
  message: string;
  severity: string;
  is_active: boolean;
  start_at: string | null;
  end_at: string | null;
};

export function NotificationsTable({
  notifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const toggleActive = async (id: string, newState: boolean) => {
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Not signed in",
        description: "You must be logged in to update notifications.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_active: newState })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      router.refresh();
    } else {
      toast({
        title: "Updated",
        description: `Notification is now ${newState ? "active" : "inactive"}.`,
      });
      router.refresh();
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive",
      });
    } else {
      toast({ title: "Deleted", description: "Notification removed" });
      router.refresh();
    }
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No notifications</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Window</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notifications.map((n) => (
          <TableRow key={n.id}>
            <TableCell className="font-medium">{n.title}</TableCell>
            <TableCell className="uppercase text-xs">{n.severity}</TableCell>
            <TableCell>
              <Switch
                defaultChecked={n.is_active}
                onCheckedChange={(checked) => toggleActive(n.id, checked)}
              />
            </TableCell>
            <TableCell>
              {n.start_at ? new Date(n.start_at).toLocaleString() : "—"} →{" "}
              {n.end_at ? new Date(n.end_at).toLocaleString() : "—"}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteNotification(n.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
