import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card } from "@/components/kit";
import { MaintenanceBadge } from "@/components/status-badge";
import {
  formatINR,
  isUnpaid,
  nextPayableMonth,
  totalPendingDues,
  useResidentState,
} from "@/lib/resident-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resident/maintenance/")({
  head: () => ({
    meta: [
      { title: "Maintenance — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Month-wise maintenance records, dues and payment history.",
      },
      {
        property: "og:title",
        content: "Maintenance — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Month-wise maintenance records, dues and payment history.",
      },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const [tab, setTab] = useState<"records" | "history">("records");
  const { maintenance } = useResidentState();

  const due = nextPayableMonth(maintenance);
  const pendingTotal = totalPendingDues(maintenance);

  const history = [...maintenance]
    .filter((m) => m.submittedDate)
    .reverse();

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
              Resident Portal
            </p>

            <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
              Maintenance
            </h1>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Manage your monthly maintenance dues and payment records.
            </p>
          </div>

          <div className="rounded-xl border border-primary/10 bg-card px-5 py-4 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total pending dues
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold text-primary">
              {formatINR(pendingTotal)}
            </p>
          </div>
        </div>
      </section>

      {/* Next payment */}
      {due ? (
        <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg sm:p-7">
          <div className="absolute right-0 top-0 h-36 w-36 translate-x-12 -translate-y-12 rounded-full bg-accent/20" />

          <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  Next payable month
                </p>
              </div>

              <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
                {due.month}
              </h2>

              <p className="mt-1 text-2xl font-semibold">
                {formatINR(due.amount)}
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/70">
                Please clear your oldest pending maintenance first. Later
                months unlock only after this payment is submitted.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MaintenanceBadge status={due.status} />

              <Link to="/resident/maintenance/pay">
                <Button variant="gold" size="lg">
                  Pay {due.month.split(" ")[0]}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="font-medium text-primary">
            All maintenance dues are cleared.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            There are no pending payments at the moment.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-border bg-card p-1.5 shadow-sm">
        {(["records", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200",
              tab === t
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
            )}
          >
            {t === "records" ? "Month-wise Records" : "Payment History"}
          </button>
        ))}
      </div>

      {/* Records */}
      {tab === "records" ? (
        <Card
          title="Month-wise Maintenance"
          subtitle="Payments must be made in order, oldest month first"
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
                      Status
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {maintenance.map((m) => {
                    const isNext = due?.id === m.id;

                    return (
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

                        <td className="px-5 py-4">
                          <MaintenanceBadge status={m.status} />
                        </td>

                        <td className="px-5 py-4">
                          {isNext ? (
                            <Link to="/resident/maintenance/pay">
                              <Button variant="gold">
                                Pay {m.month.split(" ")[0]}
                              </Button>
                            </Link>
                          ) : isUnpaid(m) ? (
                            <span className="text-sm text-muted-foreground">
                              Locked — clear {due?.month} first
                            </span>
                          ) : m.status === "verification" ? (
                            <span className="text-sm text-muted-foreground">
                              Awaiting admin review
                            </span>
                          ) : (
                            <Button variant="outline">
                              View Receipt
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          title="Payment History"
          subtitle="All submitted maintenance payments"
        >
          <div className="space-y-3">
            {history.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/15 hover:shadow-sm"
              >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <p className="font-heading text-2xl text-primary">
                        {m.month}
                      </p>

                      <p className="font-semibold text-foreground">
                        {formatINR(m.amount)}
                      </p>
                    </div>

                    <dl className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div>
                        <dt className="inline font-medium text-foreground">
                          Transaction / UTR:{" "}
                        </dt>
                        <dd className="inline">{m.utr ?? "—"}</dd>
                      </div>

                      <div>
                        <dt className="inline font-medium text-foreground">
                          Submitted:{" "}
                        </dt>
                        <dd className="inline">
                          {m.submittedDate ?? "—"}
                        </dd>
                      </div>
                    </dl>

                    {m.status === "rejected" && m.rejectionReason ? (
                      <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        Rejection reason: {m.rejectionReason}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <MaintenanceBadge status={m.status} />

                    {m.status === "paid" ? (
                      <Button variant="outline">
                        View Receipt
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {history.length === 0 ? (
              <div className="rounded-xl bg-secondary p-5">
                <p className="text-sm text-muted-foreground">
                  No payments submitted yet.
                </p>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}