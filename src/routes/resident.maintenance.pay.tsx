import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { MaintenanceBadge } from "@/components/status-badge";
import {
  formatINR,
  nextPayableMonth,
  submitPayment,
  useResidentState,
} from "@/lib/resident-store";

export const Route = createFileRoute("/resident/maintenance/pay")({
  head: () => ({
    meta: [
      { title: "Pay Maintenance — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Submit your maintenance payment details for committee verification.",
      },
      {
        property: "og:title",
        content: "Pay Maintenance — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Submit maintenance payment details for verification.",
      },
    ],
  }),
  component: PayPage,
});

function PayPage() {
  const navigate = useNavigate();
  const { maintenance } = useResidentState();
  const due = nextPayableMonth(maintenance);

  const [utr, setUtr] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!due) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl text-primary">✓</span>
          </div>

          <h1 className="mt-4 font-heading text-3xl text-primary">
            No pending maintenance
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            All your maintenance dues are cleared.
          </p>

          <Link to="/resident/maintenance">
            <Button className="mt-6">Back to Maintenance</Button>
          </Link>
        </Card>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!due) return;

    submitPayment(
      due.id,
      utr.trim(),
      fileName || undefined,
    );

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="overflow-hidden p-0 text-center">
          <div className="bg-primary px-6 py-8 text-primary-foreground">
            <MaintenanceBadge status="verification" />

            <h1 className="mt-4 font-heading text-4xl">
              Verification Pending
            </h1>

            <p className="mt-2 text-sm text-primary-foreground/70">
              Your payment has been submitted successfully.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="rounded-xl bg-secondary p-5 text-left">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Month
                </span>
                <span className="font-medium text-foreground">
                  {due.month}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Transaction number
                </span>
                <span className="font-medium text-foreground">
                  {utr || "—"}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 border-t border-border pt-3">
                <span className="font-medium text-foreground">
                  Amount
                </span>
                <span className="font-heading text-xl font-semibold text-primary">
                  {formatINR(due.amount)}
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              The committee will review your payment and approve it
              shortly. The upload date is recorded for information only
              and does not affect approval.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() =>
                  navigate({ to: "/resident/maintenance" })
                }
              >
                Back to Maintenance
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate({ to: "/resident" })}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      {/* Heading */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Resident Portal
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Pay Maintenance
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          You are paying your oldest pending maintenance month.
        </p>
      </section>

      {/* Payment summary */}
      <Card title="Payment Summary" subtitle="Review the amount before submitting">
        <div className="overflow-hidden rounded-xl border border-primary/10">
          <div className="bg-primary px-5 py-4 text-primary-foreground">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
              Selected month
            </p>

            <p className="mt-1 font-heading text-2xl">
              {due.month}
            </p>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Monthly maintenance
              </dt>

              <dd className="font-medium text-foreground">
                {formatINR(due.amount)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <dt className="font-medium text-foreground">
                Total payable
              </dt>

              <dd className="font-heading text-2xl font-semibold text-primary">
                {formatINR(due.amount)}
              </dd>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment form */}
      <form onSubmit={handleSubmit}>
        <Card
          title="Payment Details"
          subtitle="Enter the transaction reference and upload your payment screenshot"
        >
          <div className="space-y-6">
            <Input
              id="utr"
              label="Transaction / UTR Number"
              placeholder="e.g. UTR904512377"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              required
            />

            {/* Screenshot upload */}
            <div className="space-y-2">
              <label
                htmlFor="screenshot"
                className="block text-sm font-medium text-foreground"
              >
                Payment Screenshot
              </label>

              <label
                htmlFor="screenshot"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/60 px-5 py-8 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.025]"
              >
                <span className="text-2xl text-primary">↑</span>

                <span className="mt-2 text-sm font-medium text-foreground">
                  {fileName || "Choose payment screenshot"}
                </span>

                <span className="mt-1 text-xs text-muted-foreground">
                  Upload an image of your payment confirmation
                </span>

                <input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFileName(
                      e.target.files?.[0]?.name ?? "",
                    )
                  }
                  className="sr-only"
                />
              </label>

              <p className="text-xs text-muted-foreground">
                You may upload the screenshot later than the payment
                date — it will still be accepted.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Button type="submit" size="lg" variant="gold">
                Submit Payment
              </Button>

              <Link to="/resident/maintenance">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}