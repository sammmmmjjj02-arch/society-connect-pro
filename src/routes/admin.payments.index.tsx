import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import { useAllPayments, type PaymentStatus } from "@/lib/admin-store";
import { formatINR } from "@/lib/resident-store";

export const Route = createFileRoute("/admin/payments/")({
  head: () => ({
    meta: [
      { title: "Payment Verification — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Review maintenance payment submissions and approve or reject them." },
      { property: "og:title", content: "Payment Verification — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Review maintenance payment submissions from members." },
    ],
  }),
  component: PaymentsPage,
});

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge
      variant={status === "Approved" ? "gold" : status === "Verification Pending" ? "navy" : "muted"}
      className={status === "Rejected" ? "bg-destructive/10 text-destructive" : ""}
    >
      {status}
    </Badge>
  );
}

const tabs: Array<"Verification Pending" | "Approved" | "Rejected" | "All"> = [
  "Verification Pending",
  "Approved",
  "Rejected",
  "All",
];

function PaymentsPage() {
  const payments = useAllPayments();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Verification Pending");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const list = payments
    .filter((p) => tab === "All" || p.status === tab)
    .filter((p) => !q || [p.resident, p.flat, p.utr].some((v) => v.toLowerCase().includes(q)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Payment Verification</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Maintenance payments submitted by members for committee review.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Button key={t} variant={tab === t ? "primary" : "outline"} onClick={() => setTab(t)}>
              {t}
              {t !== "All" ? ` (${payments.filter((p) => p.status === t).length})` : ""}
            </Button>
          ))}
        </div>
        <div className="mt-5">
          <Input
            id="payment-search"
            label="Search submissions"
            placeholder="Resident, flat number or UTR"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Card>

      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Resident</th>
                <th className="py-3 pr-4 font-medium">Flat</th>
                <th className="py-3 pr-4 font-medium">Month(s)</th>
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 pr-4 font-medium">UTR</th>
                <th className="py-3 pr-4 font-medium">Submitted</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{p.resident}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{p.flat}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.months.join(", ")}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{formatINR(p.amount)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.utr}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.submittedDate || "—"}</td>
                  <td className="py-3 pr-4">
                    <PaymentBadge status={p.status} />
                  </td>
                  <td className="py-3">
                    <Link to="/admin/payments/$paymentId" params={{ paymentId: p.id }}>
                      <Button>Open</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 ? <p className="py-6 text-base text-muted-foreground">No payments in this list.</p> : null}
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        {list.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-2xl text-primary">{p.resident}</p>
              <PaymentBadge status={p.status} />
            </div>
            <p className="mt-1 text-base text-foreground">
              {p.flat} · {formatINR(p.amount)}
            </p>
            <p className="text-sm text-muted-foreground">{p.months.join(", ")}</p>
            <p className="text-sm text-muted-foreground">UTR {p.utr}</p>
            <Link to="/admin/payments/$paymentId" params={{ paymentId: p.id }} className="mt-4 block">
              <Button className="w-full">Open Payment</Button>
            </Link>
          </Card>
        ))}
        {list.length === 0 ? <Card>No payments in this list.</Card> : null}
      </div>
    </div>
  );
}
