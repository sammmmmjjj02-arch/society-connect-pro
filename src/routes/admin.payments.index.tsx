import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import { useAllPayments, type PaymentStatus } from "@/lib/admin-store";
import { formatINR } from "@/lib/resident-store";

export const Route = createFileRoute("/admin/payments/")({
  head: () => ({
    meta: [
      { title: "Payment Verification — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Review maintenance payment submissions and approve or reject them.",
      },
      {
        property: "og:title",
        content: "Payment Verification — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Review maintenance payment submissions from members.",
      },
    ],
  }),
  component: PaymentsPage,
});

export function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <Badge
      variant={
        status === "Approved"
          ? "gold"
          : status === "Verification Pending"
            ? "navy"
            : "muted"
      }
      className={
        status === "Rejected"
          ? "bg-destructive/10 text-destructive"
          : ""
      }
    >
      {status}
    </Badge>
  );
}

const tabs: Array<
  "Verification Pending" | "Approved" | "Rejected" | "All"
> = ["Verification Pending", "Approved", "Rejected", "All"];

function PaymentsPage() {
  const payments = useAllPayments();

  const [tab, setTab] =
    useState<(typeof tabs)[number]>("Verification Pending");

  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const list = payments
    .filter((payment) =>
      tab === "All" ? true : payment.status === tab,
    )
    .filter(
      (payment) =>
        !q ||
        [payment.resident, payment.flat, payment.utr].some(
          (value) => value.toLowerCase().includes(q),
        ),
    );

  const pendingCount = payments.filter(
    (payment) => payment.status === "Verification Pending",
  ).length;

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Admin Portal
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Payment Verification
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Review maintenance payments submitted by residents and
          verify their transaction details.
        </p>
      </section>

      {/* Pending action banner */}
      {pendingCount > 0 ? (
        <div className="flex flex-col gap-4 rounded-xl border border-accent/30 bg-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-accent-foreground">
              Verification queue
            </p>

            <p className="mt-1 font-heading text-2xl text-primary">
              {pendingCount} payment
              {pendingCount === 1 ? "" : "s"} awaiting review
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Open each submission to review the payment screenshot
              and transaction details.
            </p>
          </div>

          {tab !== "Verification Pending" ? (
            <Button
              variant="gold"
              onClick={() => setTab("Verification Pending")}
            >
              View Pending
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-primary/10 bg-primary/[0.035] p-5">
          <p className="font-medium text-primary">
            Verification queue is clear.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            There are no payment submissions waiting for review.
          </p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tabName) => {
            const count =
              tabName === "All"
                ? payments.length
                : payments.filter(
                    (payment) => payment.status === tabName,
                  ).length;

            return (
              <button
                key={tabName}
                type="button"
                onClick={() => setTab(tabName)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  tab === tabName
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {tabName}
                <span
                  className={`ml-2 ${
                    tab === tabName
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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

      {/* Desktop table */}
      <Card className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Resident
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Flat
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Month(s)
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    UTR
                  </th>
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Submitted
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
                {list.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {payment.resident}
                    </td>

                    <td className="px-5 py-4 text-foreground">
                      {payment.flat}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {payment.months.join(", ")}
                    </td>

                    <td className="px-5 py-4 font-medium text-primary">
                      {formatINR(payment.amount)}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {payment.utr}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {payment.submittedDate || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <PaymentBadge status={payment.status} />
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to="/admin/payments/$paymentId"
                        params={{ paymentId: payment.id }}
                      >
                        <Button>Open</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {list.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-heading text-2xl text-primary">
                No payments found
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Try a different filter or search term.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {list.map((payment) => (
          <Card key={payment.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-2xl text-primary">
                  {payment.resident}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {payment.flat}
                </p>
              </div>

              <PaymentBadge status={payment.status} />
            </div>

            <div className="mt-5 grid gap-4 border-t border-border pt-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Month(s)
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {payment.months.join(", ")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Amount
                </p>

                <p className="mt-1 font-heading text-xl text-primary">
                  {formatINR(payment.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  UTR
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {payment.utr}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Submitted
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {payment.submittedDate || "—"}
                </p>
              </div>
            </div>

            <Link
              to="/admin/payments/$paymentId"
              params={{ paymentId: payment.id }}
              className="mt-5 block"
            >
              <Button className="w-full">
                Open Payment
              </Button>
            </Link>
          </Card>
        ))}

        {list.length === 0 ? (
          <Card className="text-center">
            <p className="font-heading text-2xl text-primary">
              No payments found
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Try a different filter or search term.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}