import { formatINR } from "@/lib/resident-store";

/* A mock UPI payment screenshot so the committee can inspect the submission. */
export function PaymentScreenshot({
  amount,
  utr,
  paidOn,
  payer,
  fileName,
}: {
  amount: number;
  utr: string;
  paidOn?: string | undefined;
  payer: string;
  fileName?: string | undefined;
}) {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-secondary shadow-[var(--shadow-card)]">
      <div className="bg-primary px-4 py-3 text-center text-primary-foreground">
        <p className="text-xs tracking-wide opacity-80">UPI Payment</p>
        <p className="font-heading text-2xl">Payment Successful</p>
      </div>
      <div className="space-y-3 bg-card px-4 py-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-xl text-accent-foreground">
          ✓
        </div>
        <p className="font-heading text-4xl text-primary">{formatINR(amount)}</p>
        <p className="text-sm text-muted-foreground">Paid to SAI BHAWANI CHS LTD</p>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-left text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">From</dt>
            <dd className="text-right font-medium text-foreground">{payer}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">UPI Ref / UTR</dt>
            <dd className="text-right font-medium text-foreground">{utr}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Date</dt>
            <dd className="text-right font-medium text-foreground">{paidOn ?? "—"}</dd>
          </div>
        </dl>
      </div>
      <p className="bg-secondary px-4 py-2 text-center text-xs text-muted-foreground">
        {fileName ?? "payment-screenshot.jpg"}
      </p>
    </div>
  );
}
