import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import { residents, type AdminResident } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/residents")({
  head: () => ({
    meta: [
      { title: "Residents — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Society member records with flat number, contact details and membership status." },
      { property: "og:title", content: "Residents — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Society member records and contact details." },
    ],
  }),
  component: ResidentsPage,
});

function ResidentsPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<AdminResident | null>(null);

  const q = query.trim().toLowerCase();
  const list = q
    ? residents.filter((r) =>
        [r.name, r.flat, r.phone, r.email].some((v) => v.toLowerCase().includes(q)),
      )
    : residents;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Residents</h1>
        <p className="mt-1 text-base text-muted-foreground">All registered members of the society.</p>
      </div>

      <Card>
        <Input
          id="resident-search"
          label="Search residents"
          placeholder="Name, flat number, phone or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Flat</th>
                <th className="py-3 pr-4 font-medium">Phone</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{r.name}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{r.flat}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.phone}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.email}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={r.status === "Active" ? "gold" : "muted"}>{r.status}</Badge>
                  </td>
                  <td className="py-3">
                    <Button variant="outline" onClick={() => setOpen(r)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 ? <p className="py-6 text-base text-muted-foreground">No resident found.</p> : null}
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        {list.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-2xl text-primary">{r.name}</p>
              <Badge variant={r.status === "Active" ? "gold" : "muted"}>{r.status}</Badge>
            </div>
            <p className="mt-1 text-base text-foreground">{r.flat}</p>
            <p className="text-sm text-muted-foreground">{r.phone}</p>
            <p className="text-sm text-muted-foreground">{r.email}</p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setOpen(r)}>
              View Details
            </Button>
          </Card>
        ))}
        {list.length === 0 ? <Card>No resident found.</Card> : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Card title={open.name} subtitle={`${open.flat} · Building ${open.building}`}>
              <dl className="grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Flat Number", value: open.flat },
                  { label: "Building", value: `Building ${open.building}` },
                  { label: "Phone", value: open.phone },
                  { label: "Email", value: open.email },
                  { label: "Member Since", value: open.memberSince },
                  { label: "Status", value: open.status },
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
