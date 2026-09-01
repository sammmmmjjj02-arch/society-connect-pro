import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Card } from "@/components/kit";
import { ComplaintBadge } from "@/components/status-badge";
import {
  activity,
  admin,
  flats,
  residents,
  useAdminState,
  useAllPayments,
  useLedger,
} from "@/lib/admin-store";
import { formatINR, vehicles } from "@/lib/resident-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Committee overview of residents, flats, maintenance dues and payment verification.",
      },
      {
        property: "og:title",
        content: "Admin Dashboard — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Committee overview of residents, dues and payment verification.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { complaints } = useAdminState();
  const payments = useAllPayments();
  const ledger = useLedger();

  const pendingVerification = payments.filter(
    (p) => p.status === "Verification Pending",
  );

  const pendingMaintenance = ledger.filter(
    (r) => r.status === "pending" || r.status === "rejected",
  );

  const openComplaints = complaints.filter(
    (c) => c.status !== "Resolved",
  );

  const pendingMaintenanceAmount = pendingMaintenance.reduce(
    (sum, record) => sum + record.amount,
    0,
  );

  const stats = [
    {
      label: "Total Residents",
      value: String(residents.length),
      note: "Registered members",
      tone: "default",
    },
    {
      label: "Total Flats",
      value: String(flats.length),
      note: "Across A, B and C wings",
      tone: "default",
    },
    {
      label: "Pending Maintenance",
      value: formatINR(pendingMaintenanceAmount),
      note: `${pendingMaintenance.length} month-wise dues`,
      tone: "gold",
    },
    {
      label: "Payment Verification",
      value: String(pendingVerification.length),
      note: "Awaiting committee review",
      tone: "navy",
    },
    {
      label: "Open Complaints",
      value: String(openComplaints.length),
      note: "Open or in progress",
      tone: "default",
    },
    {
      label: "Registered Vehicles",
      value: String(vehicles.length),
      note: "Society records",
      tone: "default",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 translate-x-16 -translate-y-16 rounded-full bg-accent/20" />
        <div className="absolute bottom-0 right-24 h-20 w-20 translate-y-10 rounded-full bg-white/5" />

        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-accent">
              Admin Portal
            </p>

            <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">
              Welcome, {admin.name}
            </h1>

            <p className="mt-3 text-sm text-primary-foreground/70 sm:text-base">
              {admin.role} · {admin.society}
            </p>
          </div>

          <Link to="/admin/payments">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto"
            >
              Verify Payments
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              stat.tone === "navy"
                ? "border-primary/20 bg-primary text-primary-foreground"
                : stat.tone === "gold"
                  ? "border-accent/30 bg-accent/10"
                  : "border-border bg-card"
            }`}
          >
            <p
              className={
                stat.tone === "navy"
                  ? "text-sm text-primary-foreground/70"
                  : "text-sm text-muted-foreground"
              }
            >
              {stat.label}
            </p>

            <p
              className={`mt-3 font-heading text-3xl font-semibold ${
                stat.tone === "navy"
                  ? "text-primary-foreground"
                  : "text-primary"
              }`}
            >
              {stat.value}
            </p>

            <p
              className={
                stat.tone === "navy"
                  ? "mt-1 text-xs text-primary-foreground/60"
                  : "mt-1 text-xs text-muted-foreground"
              }
            >
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Verification alert */}
      {pendingVerification.length > 0 ? (
        <div className="flex flex-col gap-4 rounded-xl border border-accent/30 bg-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.1em] text-accent-foreground">
              Action required
            </p>

            <p className="mt-1 font-heading text-2xl text-primary">
              {pendingVerification.length} payment
              {pendingVerification.length === 1 ? "" : "s"} waiting
              for verification
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Review submitted transactions and approve or reject them.
            </p>
          </div>

          <Link to="/admin/payments">
            <Button variant="gold">Review Now</Button>
          </Link>
        </div>
      ) : null}

      {/* Payments + Complaints */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent Payment Submissions"
          subtitle="Latest maintenance payments submitted by members"
        >
          <ul className="space-y-4">
            {payments.slice(0, 4).map((payment) => (
              <li
                key={payment.id}
                className="border-b border-border/70 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-medium text-foreground">
                      {payment.resident} · {payment.flat}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {payment.months.join(", ")} ·{" "}
                      {formatINR(payment.amount)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      UTR: {payment.utr}
                    </p>
                  </div>

                  <Badge
                    variant={
                      payment.status === "Approved"
                        ? "gold"
                        : payment.status === "Rejected"
                          ? "muted"
                          : "navy"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>

          <Link to="/admin/payments" className="mt-5 inline-block">
            <Button variant="outline">
              Open Payment Verification
            </Button>
          </Link>
        </Card>

        <Card
          title="Recent Complaints"
          subtitle="Latest issues raised by residents"
        >
          <ul className="space-y-4">
            {complaints.slice(0, 4).map((complaint) => (
              <li
                key={complaint.id}
                className="border-b border-border/70 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-medium text-foreground">
                      {complaint.title}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {complaint.flat} · {complaint.category} ·{" "}
                      {complaint.date}
                    </p>
                  </div>

                  <ComplaintBadge status={complaint.status} />
                </div>
              </li>
            ))}
          </ul>

          <Link to="/admin/complaints" className="mt-5 inline-block">
            <Button variant="outline">
              Manage Complaints
            </Button>
          </Link>
        </Card>
      </div>

      {/* Activity */}
      <Card
        title="Recent Activity"
        subtitle="Committee actions across the society"
      >
        <ul className="space-y-0">
          {activity.map((item, index) => (
            <li
              key={item.id}
              className={`relative flex gap-4 ${
                index !== activity.length - 1
                  ? "pb-6"
                  : ""
              }`}
            >
              <div className="relative flex w-4 justify-center">
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent/10" />

                {index !== activity.length - 1 ? (
                  <span className="absolute left-1/2 top-4 h-full w-px -translate-x-1/2 bg-border" />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-sm leading-6 text-foreground">
                  {item.text}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}