import { Badge } from "@/components/kit";
import { statusLabel, type MaintenanceStatus } from "@/lib/resident-store";

export function MaintenanceBadge({ status }: { status: MaintenanceStatus }) {
  const variant = status === "paid" ? "gold" : status === "pending" ? "muted" : "navy";
  return (
    <Badge variant={variant} className={status === "rejected" ? "bg-destructive/10 text-destructive" : ""}>
      {statusLabel[status]}
    </Badge>
  );
}

export function ComplaintBadge({ status }: { status: "Open" | "In Progress" | "Resolved" }) {
  const variant = status === "Resolved" ? "gold" : status === "Open" ? "muted" : "navy";
  return <Badge variant={variant}>{status}</Badge>;
}
