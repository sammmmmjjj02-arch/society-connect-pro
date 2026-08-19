import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { MaintenanceBadge } from "@/components/status-badge";
import { formatINR, nextPayableMonth, submitPayment, useResidentState } from "@/lib/resident-store";

export const Route = createFileRoute("/resident/maintenance/pay")({
  head: () => ({
    meta: [
      { title: "Pay Maintenance — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Submit your maintenance payment details for committee verification." },
      { property: "og:title", content: "Pay Maintenance — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Submit maintenance payment details for verification." },
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
      <Card title="No pending maintenance" subtitle="All your dues are cleared.">
        <Link to="/resident/maintenance">
          <Button>Back to Maintenance</Button>
        </Link>
      </Card>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!due) return;
    submitPayment(due.id, utr.trim(), fileName || undefined);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <MaintenanceBadge status="verification" />
        <h1 className="mt-4 text-3xl text-primary">Verification Pending</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Your payment for {due.month} has been submitted with transaction number {utr || "—"}. The committee
          will review and approve it shortly.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The upload date is recorded for information only and does not affect approval.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate({ to: "/resident/maintenance" })}>Back to Maintenance</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/resident" })}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Pay Maintenance</h1>
        <p className="mt-1 text-base text-muted-foreground">
          You are paying your oldest pending month.
        </p>
      </div>

      <Card title="Payment Summary">
        <dl className="space-y-3 text-base">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Selected month</dt>
            <dd className="font-medium text-foreground">{due.month}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Monthly maintenance</dt>
            <dd className="font-medium text-foreground">{formatINR(due.amount)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-3">
            <dt className="font-medium text-foreground">Total payable</dt>
            <dd className="font-heading text-2xl font-semibold text-primary">{formatINR(due.amount)}</dd>
          </div>
        </dl>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card title="Payment Details" subtitle="Enter the transaction reference and upload the screenshot">
          <div className="space-y-5">
            <Input
              id="utr"
              label="Transaction / UTR Number"
              placeholder="e.g. UTR904512377"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              required
            />
            <div className="space-y-2">
              <label htmlFor="screenshot" className="block text-sm font-medium text-foreground">
                Payment Screenshot
              </label>
              <input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary"
              />
              <p className="text-xs text-muted-foreground">
                You may upload the screenshot later than the payment date — it will still be accepted.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg">
                Submit Payment
              </Button>
              <Link to="/resident/maintenance">
                <Button type="button" variant="outline" size="lg">
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
