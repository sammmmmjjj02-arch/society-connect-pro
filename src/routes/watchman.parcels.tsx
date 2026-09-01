import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import {
  addParcel,
  formatDateTime,
  markCollected,
  toInputValue,
  useWatchmanState,
  type Parcel,
} from "@/lib/watchman-store";

export const Route = createFileRoute("/watchman/parcels")({
  head: () => ({
    meta: [
      { title: "Parcels — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Log parcels received at the gate and mark them collected by residents.",
      },
      {
        property: "og:title",
        content: "Parcels — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Log parcels received at the gate and mark them collected.",
      },
    ],
  }),
  component: ParcelsPage,
});

function ParcelBadge({
  status,
}: {
  status: Parcel["status"];
}) {
  return (
    <Badge
      variant={status === "Collected" ? "gold" : "navy"}
    >
      {status}
    </Badge>
  );
}

const empty = {
  tracking: "",
  resident: "",
  flat: "",
  company: "",
};

function ParcelsPage() {
  const { parcels } = useWatchmanState();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const [receivedAt, setReceivedAt] = useState(() =>
    toInputValue(new Date()),
  );

  const [error, setError] = useState("");

  const set =
    (key: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({
        ...current,
        [key]: e.target.value,
      }));

  const pendingCount = parcels.filter(
    (parcel) => parcel.status === "Received",
  ).length;

  const collectedCount = parcels.filter(
    (parcel) => parcel.status === "Collected",
  ).length;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !form.tracking.trim() ||
      !form.resident.trim() ||
      !form.flat.trim() ||
      !form.company.trim()
    ) {
      setError("Please fill in all the parcel details.");
      return;
    }

    const when = receivedAt
      ? new Date(receivedAt)
      : new Date();

    addParcel({
      tracking: form.tracking.trim().toUpperCase(),
      resident: form.resident.trim(),
      flat: form.flat.trim().toUpperCase(),
      company: form.company.trim(),
      receivedAt: formatDateTime(
        isNaN(when.getTime()) ? new Date() : when,
      ),
    });

    setForm(empty);
    setReceivedAt(toInputValue(new Date()));
    setError("");
    setOpen(false);
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Gate Desk
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            Parcels
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Record deliveries received at the gate and track their collection.
          </p>
        </div>

        <Button
          size="lg"
          variant="gold"
          className="w-full sm:w-auto"
          onClick={() => {
            setOpen((value) => !value);
            setError("");
          }}
        >
          {open ? "Close Form" : "+ Add Parcel"}
        </Button>
      </section>

      {/* Quick summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted-foreground">
            Total parcels
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold text-primary">
            {parcels.length}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            All gate entries
          </p>
        </div>

        <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Pending collection
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold text-primary">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Waiting for residents
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground shadow-sm">
          <p className="text-sm text-primary-foreground/70">
            Collected
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold">
            {collectedCount}
          </p>

          <p className="mt-1 text-xs text-primary-foreground/60">
            Successfully handed over
          </p>
        </div>
      </div>

      {/* Add parcel */}
      {open ? (
        <Card
          title="Add Parcel"
          subtitle="Record a new delivery received at the gate"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="tracking"
                label="Tracking Number"
                placeholder="AWB458912337"
                value={form.tracking}
                onChange={set("tracking")}
                required
              />

              <Input
                id="resident"
                label="Resident Name"
                placeholder="Rajesh S. Patil"
                value={form.resident}
                onChange={set("resident")}
                required
              />

              <Input
                id="flat"
                label="Flat Number"
                placeholder="B-704"
                value={form.flat}
                onChange={set("flat")}
                required
              />

              <Input
                id="company"
                label="Delivery Company"
                placeholder="Blue Dart"
                value={form.company}
                onChange={set("company")}
                required
              />

              <Input
                id="receivedAt"
                label="Received Date / Time"
                type="datetime-local"
                value={receivedAt}
                onChange={(e) =>
                  setReceivedAt(e.target.value)
                }
              />
            </div>

            {error ? (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Button
                type="submit"
                size="lg"
                variant="gold"
              >
                Save Parcel
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {/* Desktop/tablet */}
      <Card
        title="Parcel Register"
        subtitle={`${pendingCount} parcel${pendingCount === 1 ? "" : "s"} currently awaiting collection`}
        className="hidden md:block"
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Tracking Number
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Resident
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Flat
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Company
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Received
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
                {parcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-primary">
                        {parcel.tracking}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-medium text-foreground">
                      {parcel.resident}
                    </td>

                    <td className="px-5 py-4 text-foreground">
                      {parcel.flat}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {parcel.company}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {parcel.receivedAt}

                      {parcel.collectedAt ? (
                        <span className="mt-1 block text-xs">
                          Collected: {parcel.collectedAt}
                        </span>
                      ) : null}
                    </td>

                    <td className="px-5 py-4">
                      <ParcelBadge status={parcel.status} />
                    </td>

                    <td className="px-5 py-4">
                      {parcel.status === "Received" ? (
                        <Button
                          onClick={() =>
                            markCollected(parcel.id)
                          }
                        >
                          Mark Collected
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parcels.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-heading text-2xl text-primary">
                No parcels recorded
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                New deliveries will appear here after they are logged
                at the gate.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {parcels.map((parcel) => (
          <Card key={parcel.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-2xl text-primary">
                  {parcel.tracking}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {parcel.company}
                </p>
              </div>

              <ParcelBadge status={parcel.status} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Resident
                </dt>

                <dd className="mt-1 text-sm font-medium text-foreground">
                  {parcel.resident}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Flat
                </dt>

                <dd className="mt-1 text-sm font-medium text-foreground">
                  {parcel.flat}
                </dd>
              </div>

              <div className="col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Received
                </dt>

                <dd className="mt-1 text-sm font-medium text-foreground">
                  {parcel.receivedAt}
                </dd>
              </div>

              {parcel.collectedAt ? (
                <div className="col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Collected
                  </dt>

                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {parcel.collectedAt}
                  </dd>
                </div>
              ) : null}
            </dl>

            {parcel.status === "Received" ? (
              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={() =>
                  markCollected(parcel.id)
                }
              >
                Mark Collected
              </Button>
            ) : null}
          </Card>
        ))}

        {parcels.length === 0 ? (
          <Card className="text-center">
            <p className="font-heading text-2xl text-primary">
              No parcels recorded
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              New deliveries will appear here after they are logged.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}