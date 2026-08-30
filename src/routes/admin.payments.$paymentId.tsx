import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { PaymentScreenshot } from "@/components/payment-screenshot";
import { approvePayment, rejectPayment, useAllPayments } from "@/lib/admin-store";
import { formatINR } from "@/lib/resident-store";
import { PaymentBadge } from "./admin.payments.index";

export const Route = createFileRoute("/admin/payments/$paymentId")({
  head: () => ({
    meta: [
      { title: "Payment Review — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Review a maintenance payment submission, inspect the screenshot and approve or reject it." },
      { property: "og:title", content: "Payment Review — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Review a maintenance payment submission and its screenshot." },
    ],
  }),
  component: PaymentReview,
});

const reasons = [
  "Amount mismatch",
  "Invalid transaction details",
  "Duplicate transaction",
  "Screenshot unclear",
  "Payment could not be verified",
  "Other",
];

function PaymentReview() {
  const { paymentId } = useParams({ from: "/admin/payments/$paymentId" });
  const payments = useAllPayments();
  const payment = payments.find((p) => p.id === paymentId);

  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState(reasons[0] as string);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!payment) {
    return (
      <Card title="Payment not found" subtitle="This submission is no longer available.">
        <Link to="/admin/payments">
          <Button>Back to Payment Verification</Button>
        </Link>
      </Card>
    );
  }

  function confirmReject() {
    if (!payment) return;
    const text = reason === "Other" ? custom.trim() : reason;
    if (!text) {
      setError("Please enter a rejection reason.");
      return;
    }
    rejectPayment(payment, text);
    setRejecting(false);
    setError("");
  }

  const residentFields = [
    { label: "Resident Name", value: payment.resident },
    { label: "Flat Number", value: payment.flat },
    { label: "Phone Number", value: payment.phone },
  ];

  const paymentFields = [
    { label: "Maintenance Month(s)", value: payment.months.join(", ") },
    { label: "Amount", value: formatINR(payment.amount) },
    { label: "UTR / Transaction ID", value: payment.utr },
    { label: "Payment Date", value: payment.paymentDate ?? "Not provided" },
    { label: "Submission Date", value: payment.submittedDate || "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">Payment {payment.id}</h1>
          <p className="mt-1 text-base text-muted-foreground">Review the submission before approving.</p>
        </div>
        <Link to="/admin/payments">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Back to list
          </Button>
        </Link>
      </div>

      {approved && payment.status === "Approved" ? (
        <Card className="border-accent bg-accent/10">
          <p className="text-base font-medium text-foreground">
            Payment approved. {payment.months.join(", ")} marked as Paid and a receipt is now available.
          </p>
        </Card>
      ) : null}

      {payment.status === "Rejected" && payment.rejectionReason ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <p className="text-sm text-muted-foreground">Rejection reason</p>
          <p className="mt-1 text-base font-medium text-destructive">{payment.rejectionReason}</p>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-6">
          <Card title="Resident Details">
            <dl className="grid gap-5 sm:grid-cols-2">
              {residentFields.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-muted-foreground">{f.label}</dt>
                  <dd className="mt-1 text-lg font-medium text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Payment Details">
            <dl className="grid gap-5 sm:grid-cols-2">
              {paymentFields.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-muted-foreground">{f.label}</dt>
                  <dd className="mt-1 text-lg font-medium text-foreground">{f.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-sm text-muted-foreground">Current Status</dt>
                <dd className="mt-2">
                  <PaymentBadge status={payment.status} />
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-muted-foreground">
              Note: a screenshot uploaded after the payment date is still valid — verify the transaction, not the
              upload time.
            </p>
          </Card>
        </div>

        <Card title="Payment Screenshot" className="lg:w-96">
          <PaymentScreenshot
            amount={payment.amount}
            utr={payment.utr}
            paidOn={payment.paymentDate}
            payer={payment.resident}
            fileName={payment.screenshotName}
          />
        </Card>
      </div>

      <Card>
        {payment.status === "Verification Pending" ? (
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                approvePayment(payment);
                setApproved(true);
              }}
            >
              Approve Payment
            </Button>
            <Button variant="outline" size="lg" onClick={() => setRejecting(true)}>
              Reject Payment
            </Button>
          </div>
        ) : payment.status === "Approved" ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base text-foreground">
              Approved on {payment.approvedDate ?? "—"} · Receipt {payment.receiptNo ?? "—"}
            </p>
            <Button size="lg" onClick={() => setReceiptOpen(true)}>
              View Receipt
            </Button>
          </div>
        ) : (
          <p className="text-base text-muted-foreground">
            This payment was rejected. The record is kept for the society’s files.
          </p>
        )}
      </Card>

      {rejecting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto">
            <Card title="Reject Payment" subtitle="Please provide a reason for the resident">
              <div className="space-y-3">
                {reasons.map((r) => (
                  <label key={r} className="flex items-center gap-3 text-base text-foreground">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    {r}
                  </label>
                ))}
              </div>
              {reason === "Other" ? (
                <div className="mt-4">
                  <Input
                    id="custom-reason"
                    label="Custom reason"
                    placeholder="Describe the reason"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </div>
              ) : null}
              {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={confirmReject}>
                  Confirm Rejection
                </Button>
                <Button variant="outline" size="lg" onClick={() => setRejecting(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {receiptOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setReceiptOpen(false)}
        >
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Card>
              <div className="text-center">
                <p className="font-heading text-3xl text-primary">SAI BHAWANI CHS LTD</p>
                <p className="mt-1 text-sm text-muted-foreground">Maintenance Payment Receipt</p>
              </div>
              <dl className="mt-6 space-y-3 border-t border-border pt-6 text-base">
                {[
                  { label: "Receipt Number", value: payment.receiptNo ?? "—" },
                  { label: "Resident Name", value: payment.resident },
                  { label: "Flat Number", value: payment.flat },
                  { label: "Maintenance Month(s)", value: payment.months.join(", ") },
                  { label: "Amount Paid", value: formatINR(payment.amount) },
                  { label: "Transaction / UTR", value: payment.utr },
                  { label: "Payment Date", value: payment.paymentDate ?? "—" },
                  { label: "Approval Date", value: payment.approvedDate ?? "—" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-wrap justify-between gap-3">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="font-medium text-foreground">{f.value}</dd>
                  </div>
                ))}
                <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-3">
                  <dt className="text-muted-foreground">Payment Status</dt>
                  <dd className="font-heading text-2xl text-accent-foreground">PAID</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setReceiptOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" size="lg" title="Coming soon">
                  Download Receipt
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
