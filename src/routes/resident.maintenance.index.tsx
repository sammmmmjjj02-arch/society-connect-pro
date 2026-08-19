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
      { name: "description", content: "Month-wise maintenance records, dues and payment history." },
      { property: "og:title", content: "Maintenance — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Month-wise maintenance records, dues and payment history." },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const [tab, setTab] = useState<"records" | "history">("records");
  const { maintenance } = useResidentState();
  const due = nextPayableMonth(maintenance);
  const history = [...maintenance].filter((m) => m.submittedDate).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Maintenance</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Total pending dues: {formatINR(totalPendingDues(maintenance))}
        </p>
      </div>

      {due ? (
        <Card className="border-accent/60">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="font-heading text-2xl text-primary">Next payable month: {due.month}</p>
              <p className="mt-1 text-base text-muted-foreground">
                Please clear your oldest pending maintenance first. Later months unlock only after this one is
                submitted.
              </p>
            </div>
            <Link to="/resident/maintenance/pay">
              <Button size="lg" className="w-full sm:w-auto">
                Pay {due.month.split(" ")[0]}
              </Button>
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="inline-flex rounded-lg bg-secondary p-1">
        {(["records", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              "rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "records" ? "Month-wise Records" : "Payment History"}
          </button>
        ))}
      </div>

      {tab === "records" ? (
        <Card title="Month-wise Maintenance" subtitle="Payments must be made in order, oldest month first">
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Month</th>
                  <th className="py-3 pr-4 font-medium">Amount</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((m) => {
                  const isNext = due?.id === m.id;
                  return (
                    <tr key={m.id} className="border-b border-border/70 last:border-0">
                      <td className="py-4 pr-4 text-base text-foreground">{m.month}</td>
                      <td className="py-4 pr-4 text-base text-foreground">{formatINR(m.amount)}</td>
                      <td className="py-4 pr-4">
                        <MaintenanceBadge status={m.status} />
                      </td>
                      <td className="py-4">
                        {isNext ? (
                          <Link to="/resident/maintenance/pay">
                            <Button>Pay {m.month.split(" ")[0]}</Button>
                          </Link>
                        ) : isUnpaid(m) ? (
                          <span className="text-sm text-muted-foreground">
                            Locked — clear {due?.month} first
                          </span>
                        ) : m.status === "verification" ? (
                          <span className="text-sm text-muted-foreground">Awaiting admin review</span>
                        ) : (
                          <Button variant="outline">View Receipt</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card title="Payment History" subtitle="All submitted maintenance payments">
          <div className="space-y-4">
            {history.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-5">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <p className="font-heading text-2xl text-primary">{m.month}</p>
                    <p className="mt-1 text-base text-foreground">{formatINR(m.amount)}</p>
                    <dl className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <div>
                        <dt className="inline font-medium">Transaction / UTR: </dt>
                        <dd className="inline">{m.utr ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">Submitted: </dt>
                        <dd className="inline">{m.submittedDate ?? "—"}</dd>
                      </div>
                    </dl>
                    {m.status === "rejected" && m.rejectionReason ? (
                      <p className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        Rejection reason: {m.rejectionReason}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <MaintenanceBadge status={m.status} />
                    {m.status === "paid" ? <Button variant="outline">View Receipt</Button> : null}
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments submitted yet.</p>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
