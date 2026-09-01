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
      {
        name: "description",
        content:
          "Maintenance dues, payments, complaints and notices at a glance.",
      },
      {
        property: "og:title",
        content: "Resident Dashboard — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Maintenance dues, payments and society notices.",
      },
    ],
  }),
  component: ResidentDashboard,
});

function ResidentDashboard() {
  const { maintenance, complaints } = useResidentState();

  const due = nextPayableMonth(maintenance);
  const last = lastPayment(maintenance);
  const openComplaints = complaints.filter(
    (c) => c.status !== "Resolved",
  ).length;

  const recent = [...maintenance]
    .filter((m) => m.submittedDate)
    .reverse()
    .slice(0, 4);

  const pendingMonths = maintenance.filter(
    (m) => m.status !== "paid" && m.status !== "verification",
  ).length;

  const stats = [
    {
      label: "Current Maintenance Due",
      value: due ? formatINR(due.amount) : "₹0",
      note: due ? due.month : "No dues",
      highlight: true,
    },
    {
      label: "Total Pending Dues",
      value: formatINR(totalPendingDues(maintenance)),
      note: `${pendingMonths} month(s)`,
    },
    {
      label: "Last Payment",
      value: last ? formatINR(last.amount) : "—",
      note: last ? `${last.month} · ${last.paidDate}` : "No payments yet",
    },
    {
      label: "Open Complaints",
      value: String(openComplaints),
      note: "Being tracked by the committee",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-16 -translate-y-16 rounded-full bg-accent/20" />
        <div className="absolute bottom-0 right-20 h-24 w-24 translate-y-12 rounded-full bg-white/5" />

        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
              Resident Portal
            </p>

            <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">
              Welcome, {resident.name}
            </h1>

            <p className="mt-3 text-sm text-primary-foreground/70 sm:text-base">
              Flat {resident.flat} · {resident.building}
            </p>
          </div>

          {due ? (
            <Link to="/resident/maintenance">
              <Button
                variant="gold"
                size="lg"
                className="w-full sm:w-auto"
              >
                Pay {due.month.split(" ")[0]}
              </Button>
            </Link>
          ) : null}
        </div>
      </section>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`
              rounded-xl border p-5 shadow-[var(--shadow-card)] transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg
              ${
                stat.highlight
                  ? "border-primary/20 bg-primary text-primary-foreground"
                  : "border-border bg-card"
              }
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <p
                className={
                  stat.highlight
                    ? "text-sm text-primary-foreground/70"
                    : "text-sm text-muted-foreground"
                }
              >
                {stat.label}
              </p>

              {stat.highlight ? (
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              ) : null}
            </div>

            <p
              className={`
                mt-3 font-heading text-3xl font-semibold
                ${
                  stat.highlight
                    ? "text-primary-foreground"
                    : "text-primary"
                }
              `}
            >
              {stat.value}
            </p>

            <p
              className={
                stat.highlight
                  ? "mt-1 text-xs text-primary-foreground/60"
                  : "mt-1 text-xs text-muted-foreground"
              }
            >
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Maintenance */}
      <Card
        title="Maintenance Status"
        subtitle="Your current maintenance obligation"
      >
        {due ? (
          <div className="overflow-hidden rounded-xl border border-primary/10">
            <div className="grid gap-5 bg-primary/[0.035] p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  <p className="text-sm font-medium uppercase tracking-wide text-primary">
                    Payment due
                  </p>
                </div>

                <p className="mt-3 font-heading text-3xl text-primary">
                  {due.month}
                </p>

                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {formatINR(due.amount)}
                </p>

                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Please clear your oldest pending maintenance first.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MaintenanceBadge status={due.status} />

                <Link to="/resident/maintenance/pay">
                  <Button variant="gold">
                    Pay now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-secondary p-5">
            <p className="font-medium text-primary">
              All maintenance dues are cleared.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thank you for keeping your payments up to date.
            </p>
          </div>
        )}
      </Card>

      {/* Recent payments */}
      <Card
        title="Recent Payments"
        subtitle="Latest submissions and approvals"
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Month
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Payment date
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recent.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {m.month}
                    </td>

                    <td className="px-5 py-4 font-medium text-primary">
                      {formatINR(m.amount)}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {m.paidDate ?? m.submittedDate}
                    </td>

                    <td className="px-5 py-4">
                      <MaintenanceBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}