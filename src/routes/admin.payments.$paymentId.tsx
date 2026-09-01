import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { PaymentScreenshot } from "@/components/payment-screenshot";
import {
  approvePayment,
  rejectPayment,
  useAllPayments,
} from "@/lib/admin-store";
import { formatINR } from "@/lib/resident-store";
import { PaymentBadge } from "./admin.payments.index";

export const Route = createFileRoute("/admin/payments/$paymentId")({
  head: () => ({
    meta: [
      { title: "Payment Review — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Review a maintenance payment submission, inspect the screenshot and approve or reject it.",
      },
      {
        property: "og:title",
        content: "Payment Review — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Review a maintenance payment submission and its screenshot.",
      },
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
  const { paymentId } = useParams({
    from: "/admin/payments/$paymentId",
  });

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
      <div className="mx-auto max-w-xl">
        <Card className="text-center">
          <h1 className="font-heading text-3xl text-primary">
            Payment not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This payment submission is no longer available.
          </p>

          <Link to="/admin/payments">
            <Button className="mt-6">
              Back to Payment Verification
            </Button>
          </Link>
        </Card>
      </div>
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
    {
      label: "Maintenance Month(s)",
      value: payment.months.join(", "),
    },
    {
      label: "Amount",
      value: formatINR(payment.amount),
    },
    {
      label: "UTR / Transaction ID",
      value: payment.utr,
    },
    {
      label: "Payment Date",
      value: payment.paymentDate ?? "Not provided",
    },
    {
      label: "Submission Date",
      value: payment.submittedDate || "—",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Admin Portal
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            Payment Review
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Review payment <span className="font-medium">{payment.id}</span>{" "}
            before approving or rejecting it.
          </p>
        </div>

        <Link to="/admin/payments">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Back to List
          </Button>
        </Link>
      </section>

      {/* Approval banner */}
      {approved && payment.status === "Approved" ? (
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
          <p className="font-medium text-primary">
            Payment approved successfully.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {payment.months.join(", ")} marked as Paid and the receipt
            is now available.
          </p>
        </div>
      ) : null}

      {/* Rejection banner */}
      {payment.status === "Rejected" && payment.rejectionReason ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            Rejection reason
          </p>

          <p className="mt-1 font-medium text-destructive">
            {payment.rejectionReason}
          </p>
        </div>
      ) : null}

      {/* Main review */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {/* Resident details */}
          <Card
            title="Resident Details"
            subtitle="Member information associated with this payment"
          >
            <dl className="grid gap-5 sm:grid-cols-2">
              {residentFields.map((field) => (
                <div key={field.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {field.label}
                  </dt>

                  <dd className="mt-1 font-heading text-2xl text-primary">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* Payment details */}
          <Card
            title="Payment Details"
            subtitle="Transaction information submitted by the resident"
          >
            <dl className="grid gap-5 sm:grid-cols-2">
              {paymentFields.map((field) => (
                <div key={field.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {field.label}
                  </dt>

                  <dd className="mt-1 text-base font-medium text-foreground">
                    {field.value}
                  </dd>
                </div>
              ))}

              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Current Status
                </dt>

                <dd className="mt-2">
                  <PaymentBadge status={payment.status} />
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-lg bg-secondary p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                A screenshot uploaded after the payment date is still
                valid. Verify the transaction details rather than the
                upload time.
              </p>
            </div>
          </Card>
        </div>

        {/* Screenshot */}
        <Card
          title="Payment Screenshot"
          subtitle="Submitted payment proof"
          className="h-fit"
        >
          <PaymentScreenshot
            amount={payment.amount}
            utr={payment.utr}
            paidOn={payment.paymentDate}
            payer={payment.resident}
            fileName={payment.screenshotName}
          />
        </Card>
      </div>

      {/* Actions */}
      <Card
        title="Review Action"
        subtitle="Take action on this payment submission"
      >
        {payment.status === "Verification Pending" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="gold"
              onClick={() => {
                approvePayment(payment);
                setApproved(true);
              }}
              className="sm:flex-1"
            >
              Approve Payment
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setRejecting(true)}
              className="sm:flex-1"
            >
              Reject Payment
            </Button>
          </div>
        ) : payment.status === "Approved" ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">
                Payment approved
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Approved on {payment.approvedDate ?? "—"} · Receipt{" "}
                {payment.receiptNo ?? "—"}
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => setReceiptOpen(true)}
            >
              View Receipt
            </Button>
          </div>
        ) : (
          <div className="rounded-lg bg-destructive/5 p-4">
            <p className="font-medium text-destructive">
              Payment rejected
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              This payment record has been retained for the society's
              records.
            </p>
          </div>
        )}
      </Card>

      {/* Reject modal */}
      {rejecting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setRejecting(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden p-0">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                  Payment Review
                </p>

                <h2 className="mt-1 font-heading text-3xl">
                  Reject Payment
                </h2>
              </div>

              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  Select the reason that should be shown to the
                  resident.
                </p>

                <div className="mt-5 space-y-3">
                  {reasons.map((item) => (
                    <label
                      key={item}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                        reason === item
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={item}
                        checked={reason === item}
                        onChange={() => {
                          setReason(item);
                          setError("");
                        }}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />

                      {item}
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
                      onChange={(e) => {
                        setCustom(e.target.value);
                        setError("");
                      }}
                    />
                  </div>
                ) : null}

                {error ? (
                  <p className="mt-3 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                  <Button
                    size="lg"
                    onClick={confirmReject}
                  >
                    Confirm Rejection
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setRejecting(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {/* Receipt modal */}
      {receiptOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setReceiptOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden p-0">
              <div className="bg-primary px-6 py-7 text-center text-primary-foreground">
                <p className="font-heading text-3xl">
                  SAI BHAWANI CHS LTD
                </p>

                <p className="mt-1 text-sm text-primary-foreground/70">
                  Maintenance Payment Receipt
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <dl className="space-y-3 text-sm">
                  {[
                    {
                      label: "Receipt Number",
                      value: payment.receiptNo ?? "—",
                    },
                    {
                      label: "Resident Name",
                      value: payment.resident,
                    },
                    {
                      label: "Flat Number",
                      value: payment.flat,
                    },
                    {
                      label: "Maintenance Month(s)",
                      value: payment.months.join(", "),
                    },
                    {
                      label: "Amount Paid",
                      value: formatINR(payment.amount),
                    },
                    {
                      label: "Transaction / UTR",
                      value: payment.utr,
                    },
                    {
                      label: "Payment Date",
                      value: payment.paymentDate ?? "—",
                    },
                    {
                      label: "Approval Date",
                      value: payment.approvedDate ?? "—",
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-wrap justify-between gap-3 border-b border-border/70 pb-3 last:border-0"
                    >
                      <dt className="text-muted-foreground">
                        {field.label}
                      </dt>

                      <dd className="font-medium text-foreground">
                        {field.value}
                      </dd>
                    </div>
                  ))}

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-accent/10 p-4">
                    <dt className="font-medium text-foreground">
                      Payment Status
                    </dt>

                    <dd className="font-heading text-2xl font-semibold text-accent-foreground">
                      PAID
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={() => setReceiptOpen(false)}
                  >
                    Close
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    title="Coming soon"
                  >
                    Download Receipt
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}