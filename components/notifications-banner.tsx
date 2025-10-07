import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_active: boolean;
  severity: "info" | "success" | "warning" | "destructive" | undefined;
};

export async function NotificationsBanner() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, message, severity, is_active")
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-3 w-1/2 mx-auto">
      {data
        .filter((n: Notification) => n.is_active)
        .map((n: Notification) => (
          <Alert
            key={n.id}
            variant={
              n.severity === "destructive"
                ? "destructive"
                : n?.severity || "default"
            }
            className={cn("border", {
              "border-yellow-300": n.severity === "warning",
              "border-green-300": n.severity === "success",
              "border-blue-300": n.severity === "info",
            })}
          >
            <AlertTitle>{n.title}</AlertTitle>
            <AlertDescription className="text-black font-bold py-2">
              {n.message}
            </AlertDescription>
          </Alert>
        ))}
    </div>
  );
}
