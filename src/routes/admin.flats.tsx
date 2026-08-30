import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import { flats, residents } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/flats")({
  head: () => ({
    meta: [
      { title: "Flats — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Society flats with building, occupying resident and maintenance status." },
      { property: "og:title", content: "Flats — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Society flats, residents and maintenance status." },
    ],
  }),
  component: FlatsPage,
});

type Flat = (typeof flats)[number];

function flatBadge(status: string) {
  return status === "Paid" ? "gold" : status === "Pending" ? "muted" : "navy";
}

function FlatsPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Flat | null>(null);

  const q = query.trim().toLowerCase();
  const list = q
    ? flats.filter((f) => [f.number, f.building, f.resident].some((v) => v.toLowerCase().includes(q)))
    : flats;

  const detail = open ? residents.find((r) => r.flat === open.number) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Flats</h1>
        <p className="mt-1 text-base text-muted-foreground">All flats in the society and their maintenance status.</p>
      </div>

      <Card>
        <Input
          id="flat-search"
          label="Search flats"
          placeholder="Flat number, building or resident"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Flat Number</th>
                <th className="py-3 pr-4 font-medium">Building</th>
                <th className="py-3 pr-4 font-medium">Resident</th>
                <th className="py-3 pr-4 font-medium">Maintenance Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.number} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{f.number}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{f.building}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{f.resident}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={flatBadge(f.maintenance)}>{f.maintenance}</Badge>
                  </td>
                  <td className="py-3">
                    <Button variant="outline" onClick={() => setOpen(f)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 ? <p className="py-6 text-base text-muted-foreground">No flat found.</p> : null}
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        {list.map((f) => (
          <Card key={f.number}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-2xl text-primary">{f.number}</p>
              <Badge variant={flatBadge(f.maintenance)}>{f.maintenance}</Badge>
            </div>
            <p className="mt-1 text-base text-foreground">{f.resident}</p>
            <p className="text-sm text-muted-foreground">{f.building}</p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setOpen(f)}>
              View Details
            </Button>
          </Card>
        ))}
        {list.length === 0 ? <Card>No flat found.</Card> : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Card title={`Flat ${open.number}`} subtitle={open.building}>
              <dl className="grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Flat Number", value: open.number },
                  { label: "Building", value: open.building },
                  { label: "Resident", value: open.resident },
                  { label: "Maintenance Status", value: open.maintenance },
                  { label: "Phone", value: detail?.phone ?? "—" },
                  { label: "Email", value: detail?.email ?? "—" },
                ].map((f) => (
                  <div key={f.label}>
                    <dt className="text-sm text-muted-foreground">{f.label}</dt>
                    <dd className="mt-1 text-lg font-medium text-foreground">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Button className="mt-6" onClick={() => setOpen(null)}>
                Close
              </Button>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
