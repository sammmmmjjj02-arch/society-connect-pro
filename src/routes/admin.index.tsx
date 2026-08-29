import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Card } from "@/components/kit";
import { ComplaintBadge } from "@/components/status-badge";
import { activity, admin, flats, residents, useAdminState, useAllPayments, useLedger } from "@/lib/admin-store";
import { formatINR, vehicles } from "@/lib/resident-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Committee overview of residents, flats, maintenance dues and payment verification." },
      { property: "og:title", content: "Admin Dashboard — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Committee overview of residents, dues and payment verification." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { complaints } = useAdminState();
  const payments = useAllPayments();
  const ledger = useLedger();

  const pendingVerification = payments.filter((p) => p.status === "Verification Pending");
  const pendingMaintenance = ledger.filter((r) => r.status === "pending" || r.status === "rejected");
  const openComplaints = complaints.filter((c) => c.status !== "Resolved");

  const stats = [
    { label: "Total Residents", value: String(residents.length), note: "Registered members" },
    { label: "Total Flats", value: String(flats.length), note: "Across A, B and C wings" },
    {
      label: "Pending Maintenance",
      value: formatINR(pendingMaintenance.reduce((s, r) => s + r.amount, 0)),
      note: `${pendingMaintenance.length} month-wise dues`,
    },
    { label: "Pending Payment Verification", value: String(pendingVerification.length), note: "Awaiting committee review" },
    { label: "Open Complaints", value: String(openComplaints.length), note: "Open or in progress" },
    { label: "Registered Vehicles", value: String(vehicles.length), note: "Society records" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h1 className="text-3xl text-primary sm:text-4xl">Welcome, {admin.name}</h1>
            <p className="mt-2 text-base text-muted-foreground">{admin.role} · {admin.society}</p>
          </div>
          <Link to="/admin/payments">
            <Button size="lg" className="w-full sm:w-auto">
              Verify Payments
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-heading text-4xl text-primary">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Payment Submissions" subtitle="Latest maintenance payments submitted by members">
          <ul className="space-y-4">
            {payments.slice(0, 4).map((p) => (
              <li key={p.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-base font-medium text-foreground">
                    {p.resident} · {p.flat}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {p.months.join(", ")} · {formatINR(p.amount)} · {p.utr}
                  </p>
                </div>
                <Badge variant={p.status === "Approved" ? "gold" : p.status === "Rejected" ? "muted" : "navy"}>
                  {p.status}
                </Badge>
              </li>
            ))}
          </ul>
          <Link to="/admin/payments" className="mt-5 inline-block">
            <Button variant="outline">Open Payment Verification</Button>
          </Link>
        </Card>

        <Card title="Recent Complaints" subtitle="Latest issues raised by residents">
          <ul className="space-y-4">
            {complaints.slice(0, 4).map((c) => (
              <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-base font-medium text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.flat} · {c.category} · {c.date}
                  </p>
                </div>
                <ComplaintBadge status={c.status} />
              </li>
            ))}
          </ul>
          <Link to="/admin/complaints" className="mt-5 inline-block">
            <Button variant="outline">Manage Complaints</Button>
          </Link>
        </Card>
      </div>

      <Card title="Recent Activity" subtitle="Committee actions across the society">
        <ul className="space-y-4">
          {activity.map((a) => (
            <li key={a.id} className="border-b border-border/70 pb-4 last:border-0 last:pb-0">
              <p className="text-base text-foreground">{a.text}</p>
              <p className="text-sm text-muted-foreground">{a.time}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
