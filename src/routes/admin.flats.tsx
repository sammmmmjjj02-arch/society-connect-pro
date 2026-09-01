import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import { flats, residents } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/flats")({
  head: () => ({
    meta: [
      { title: "Flats — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Society flats with building, occupying resident and maintenance status.",
      },
      {
        property: "og:title",
        content: "Flats — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Society flats, residents and maintenance status.",
      },
    ],
  }),
  component: FlatsPage,
});

type Flat = (typeof flats)[number];

function flatBadge(status: string) {
  if (status === "Paid") {
    return "gold";
  }

  if (status === "Pending") {
    return "muted";
  }

  return "navy";
}

function FlatsPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Flat | null>(null);

  const q = query.trim().toLowerCase();

  const list = q
    ? flats.filter((flat) =>
        [
          flat.number,
          flat.building,
          flat.resident,
        ].some((value) =>
          value.toLowerCase().includes(q),
        ),
      )
    : flats;

  const detail = open
    ? residents.find(
        (resident) => resident.flat === open.number,
      )
    : undefined;

  const occupiedCount = flats.filter(
    (flat) => flat.resident !== "Vacant",
  ).length;

  const vacantCount = flats.filter(
    (flat) => flat.resident === "Vacant",
  ).length;

  const pendingCount = flats.filter(
    (flat) =>
      flat.maintenance === "Pending" ||
      flat.maintenance === "Verification Pending",
  ).length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Admin Portal
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Flats
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          View all society flats, residents and current maintenance
          status.
        </p>
      </section>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted-foreground">
            Total flats
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold text-primary">
            {flats.length}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Society inventory
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground shadow-sm">
          <p className="text-sm text-primary-foreground/70">
            Occupied
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold">
            {occupiedCount}
          </p>

          <p className="mt-1 text-xs text-primary-foreground/60">
            Flats with a resident
          </p>
        </div>

        <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Attention needed
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold text-primary">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Pending or verification
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <Input
          id="flat-search"
          label="Search flats"
          placeholder="Flat number, building or resident"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query ? (
          <div className="mt-3">
            <Button
              variant="outline"
              onClick={() => setQuery("")}
            >
              Clear Search
            </Button>
          </div>
        ) : null}
      </Card>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Flat Number
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Building
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Resident
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Maintenance
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.map((flat) => (
                  <tr
                    key={flat.number}
                    className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                  >
                    <td className="px-5 py-4 font-heading text-xl text-primary">
                      {flat.number}
                    </td>

                    <td className="px-5 py-4 text-foreground">
                      {flat.building}
                    </td>

                    <td className="px-5 py-4 text-foreground">
                      {flat.resident}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={flatBadge(flat.maintenance)}>
                        {flat.maintenance}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <Button
                        variant="outline"
                        onClick={() => setOpen(flat)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {list.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-heading text-2xl text-primary">
                No flat found
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Try another flat number, building or resident name.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {list.map((flat) => (
          <button
            key={flat.number}
            type="button"
            onClick={() => setOpen(flat)}
            className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:border-primary/20 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-2xl text-primary">
                  {flat.number}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {flat.building}
                </p>
              </div>

              <Badge variant={flatBadge(flat.maintenance)}>
                {flat.maintenance}
              </Badge>
            </div>

            <p className="mt-4 text-base font-medium text-foreground">
              {flat.resident}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Tap to view details
            </p>
          </button>
        ))}

        {list.length === 0 ? (
          <Card className="text-center">
            <p className="font-heading text-2xl text-primary">
              No flat found
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term.
            </p>
          </Card>
        ) : null}
      </div>

      {/* Details modal */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden p-0">
              <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                  Flat Details
                </p>

                <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-heading text-3xl sm:text-4xl">
                    Flat {open.number}
                  </h2>

                  <Badge variant={flatBadge(open.maintenance)}>
                    {open.maintenance}
                  </Badge>
                </div>

                <p className="mt-2 text-sm text-primary-foreground/70">
                  {open.building}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Flat Number
                    </dt>

                    <dd className="mt-1 font-heading text-2xl text-primary">
                      {open.number}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Building
                    </dt>

                    <dd className="mt-1 text-base font-medium text-foreground">
                      {open.building}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Resident
                    </dt>

                    <dd className="mt-1 text-base font-medium text-foreground">
                      {open.resident}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Maintenance Status
                    </dt>

                    <dd className="mt-2">
                      <Badge variant={flatBadge(open.maintenance)}>
                        {open.maintenance}
                      </Badge>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone
                    </dt>

                    <dd className="mt-1 text-base font-medium text-foreground">
                      {detail?.phone ?? "—"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Email
                    </dt>

                    <dd className="mt-1 break-all text-base font-medium text-foreground">
                      {detail?.email ?? "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 flex justify-end border-t border-border pt-5">
                  <Button onClick={() => setOpen(null)}>
                    Close
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