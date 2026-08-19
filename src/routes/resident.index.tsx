import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card } from "@/components/kit";
import { MaintenanceBadge } from "@/components/status-badge";
import {
  formatINR,
  lastPayment,
  nextPayableMonth,
  resident,
  totalPendingDues,
  useResidentState,
} from "@/lib/resident-store";

export const Route = createFileRoute("/resident/")({
  head: () => ({
    meta: [
      { title: "Resident Dashboard — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Maintenance dues, payments, complaints and notices at a glance." },
      { property: "og:title", content: "Resident Dashboard — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Maintenance dues, payments and society notices." },
    ],
  }),
  component: ResidentDashboard,
});

function ResidentDashboard() {
  const { maintenance, complaints } = useResidentState();
  const due = nextPayableMonth(maintenance);
  const last = lastPayment(maintenance);
  const openComplaints = complaints.filter((c) => c.status !== "Resolved").length;
  const recent = [...maintenance]
    .filter((m) => m.submittedDate)
    .reverse()
    .slice(0, 4);

  const stats = [
    { label: "Current Maintenance Due", value: due ? formatINR(due.amount) : "₹0", note: due ? due.month : "No dues" },
    { label: "Total Pending Dues", value: formatINR(totalPendingDues(maintenance)), note: `${maintenance.filter((m) => m.status !== "paid" && m.status !== "verification").length} month(s)` },
    { label: "Last Payment", value: last ? formatINR(last.amount) : "—", note: last ? `${last.month} · ${last.paidDate}` : "No payments yet" },
    { label: "Open Complaints", value: String(openComplaints), note: "Being tracked by the committee" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h1 className="text-3xl text-primary sm:text-4xl">Welcome, Resident</h1>
            <p className="mt-2 text-base text-muted-foreground">
              {resident.name} · Flat {resident.flat} · {resident.building}
            </p>
          </div>
          {due ? (
            <Link to="/resident/maintenance">
              <Button size="lg" className="w-full sm:w-auto">
                Pay {due.month.split(" ")[0]}
              </Button>
            </Link>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-primary">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <Card title="Maintenance Status" subtitle="Current month status">
        {due ? (
          <div className="grid gap-3 rounded-lg bg-secondary p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="font-heading text-2xl text-primary">{due.month}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{formatINR(due.amount)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please clear your oldest pending maintenance first.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MaintenanceBadge status={due.status} />
              <Link to="/resident/maintenance/pay">
                <Button>Pay {due.month.split(" ")[0]}</Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">All maintenance dues are cleared. Thank you.</p>
        )}
      </Card>

      <Card title="Recent Payments" subtitle="Latest submissions and approvals">
        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Month</th>
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 pr-4 font-medium">Payment date</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((m) => (
                <tr key={m.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base text-foreground">{m.month}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{formatINR(m.amount)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{m.paidDate ?? m.submittedDate}</td>
                  <td className="py-3">
                    <MaintenanceBadge status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
