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
      { name: "description", content: "Log parcels received at the gate and mark them collected by residents." },
      { property: "og:title", content: "Parcels — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Log parcels received at the gate and mark them collected." },
    ],
  }),
  component: ParcelsPage,
});

function ParcelBadge({ status }: { status: Parcel["status"] }) {
  return <Badge variant={status === "Collected" ? "gold" : "navy"}>{status}</Badge>;
}

const empty = { tracking: "", resident: "", flat: "", company: "" };

function ParcelsPage() {
  const { parcels } = useWatchmanState();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [receivedAt, setReceivedAt] = useState(() => toInputValue(new Date()));
  const [error, setError] = useState("");

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.tracking.trim() || !form.resident.trim() || !form.flat.trim() || !form.company.trim()) {
      setError("Please fill in all the parcel details.");
      return;
    }
    const when = receivedAt ? new Date(receivedAt) : new Date();
    addParcel({
      tracking: form.tracking.trim().toUpperCase(),
      resident: form.resident.trim(),
      flat: form.flat.trim().toUpperCase(),
      company: form.company.trim(),
      receivedAt: formatDateTime(isNaN(when.getTime()) ? new Date() : when),
    });
    setForm(empty);
    setReceivedAt(toInputValue(new Date()));
    setError("");
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">Parcels</h1>
          <p className="mt-1 text-base text-muted-foreground">
            Parcels received at the gate and their collection status.
          </p>
        </div>
        <Button size="lg" className="w-full sm:w-auto" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Add Parcel"}
        </Button>
      </div>

      {open ? (
        <Card title="Add Parcel" subtitle="Record a new delivery received at the gate">
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <Input id="tracking" label="Tracking Number" placeholder="AWB458912337" value={form.tracking} onChange={set("tracking")} />
            <Input id="resident" label="Resident Name" placeholder="Rajesh S. Patil" value={form.resident} onChange={set("resident")} />
            <Input id="flat" label="Flat Number" placeholder="B-704" value={form.flat} onChange={set("flat")} />
            <Input id="company" label="Delivery Company" placeholder="Blue Dart" value={form.company} onChange={set("company")} />
            <Input
              id="receivedAt"
              label="Received Date / Time"
              type="datetime-local"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
            <div className="sm:col-span-2">
              {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" size="lg">
                  Save Parcel
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>
      ) : null}

      {/* Desktop / tablet table */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Tracking Number</th>
                <th className="py-3 pr-4 font-medium">Resident</th>
                <th className="py-3 pr-4 font-medium">Flat</th>
                <th className="py-3 pr-4 font-medium">Company</th>
                <th className="py-3 pr-4 font-medium">Received</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{p.tracking}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{p.resident}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{p.flat}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.company}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {p.receivedAt}
                    {p.collectedAt ? (
                      <span className="block text-xs">Collected: {p.collectedAt}</span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">
                    <ParcelBadge status={p.status} />
                  </td>
                  <td className="py-3">
                    {p.status === "Received" ? (
                      <Button onClick={() => markCollected(p.id)}>Mark Collected</Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {parcels.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-2xl text-primary">{p.tracking}</p>
              <ParcelBadge status={p.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-sm text-muted-foreground">Resident</dt>
                <dd className="text-base font-medium text-foreground">{p.resident}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Flat</dt>
                <dd className="text-base font-medium text-foreground">{p.flat}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Company</dt>
                <dd className="text-base font-medium text-foreground">{p.company}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Received</dt>
                <dd className="text-base font-medium text-foreground">{p.receivedAt}</dd>
              </div>
              {p.collectedAt ? (
                <div className="col-span-2">
                  <dt className="text-sm text-muted-foreground">Collected</dt>
                  <dd className="text-base font-medium text-foreground">{p.collectedAt}</dd>
                </div>
              ) : null}
            </dl>
            {p.status === "Received" ? (
              <Button size="lg" className="mt-5 w-full" onClick={() => markCollected(p.id)}>
                Mark Collected
              </Button>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
