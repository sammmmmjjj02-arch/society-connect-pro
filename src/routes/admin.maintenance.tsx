import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/kit";
import { MaintenanceBadge } from "@/components/status-badge";
import { useLedger } from "@/lib/admin-store";
import { formatINR, statusLabel, type MaintenanceStatus } from "@/lib/resident-store";

export const Route = createFileRoute("/admin/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Month-wise maintenance records for every flat with status filters." },
      { property: "og:title", content: "Maintenance — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Month-wise maintenance records for every flat." },
    ],
  }),
  component: AdminMaintenance,
});

const selectClass =
  "h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25";

function AdminMaintenance() {
  const ledger = useLedger();
  const [month, setMonth] = useState("all");
  const [status, setStatus] = useState<"all" | MaintenanceStatus>("all");

  const months = Array.from(new Set(ledger.map((r) => r.month)));
  const rows = ledger.filter(
    (r) => (month === "all" || r.month === month) && (status === "all" || r.status === status),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Maintenance</h1>
        <p className="mt-1 text-base text-muted-foreground">Month-wise maintenance records across the society.</p>
      </div>

      <Card>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="month-filter" className="block text-sm font-medium text-foreground">
              Month
            </label>
            <select id="month-filter" className={selectClass} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">All months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="status-filter" className="block text-sm font-medium text-foreground">
              Status
            </label>
            <select
              id="status-filter"
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | MaintenanceStatus)}
            >
              <option value="all">All statuses</option>
              {(["paid", "pending", "verification", "rejected"] as MaintenanceStatus[]).map((s) => (
                <option key={s} value={s}>
                  {statusLabel[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Resident</th>
                <th className="py-3 pr-4 font-medium">Flat</th>
                <th className="py-3 pr-4 font-medium">Month</th>
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{r.resident}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{r.flat}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.month}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{formatINR(r.amount)}</td>
                  <td className="py-3">
                    <MaintenanceBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? <p className="py-6 text-base text-muted-foreground">No records match these filters.</p> : null}
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        {rows.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-2xl text-primary">{r.month}</p>
              <MaintenanceBadge status={r.status} />
            </div>
            <p className="mt-1 text-base text-foreground">
              {r.resident} · {r.flat}
            </p>
            <p className="text-sm text-muted-foreground">{formatINR(r.amount)}</p>
          </Card>
        ))}
        {rows.length === 0 ? <Card>No records match these filters.</Card> : null}
      </div>
    </div>
  );
}
