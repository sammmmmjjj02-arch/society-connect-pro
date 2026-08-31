import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { vehicles } from "@/lib/resident-store";

export const Route = createFileRoute("/admin/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Registered society vehicles with owner, flat number and contact details." },
      { property: "og:title", content: "Vehicles — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Registered society vehicles and their owners." },
    ],
  }),
  component: AdminVehicles,
});

function AdminVehicles() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  const list = q
    ? vehicles.filter((v) => v.number.toLowerCase().replace(/\s+/g, "").includes(q))
    : vehicles;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Vehicles</h1>
        <p className="mt-1 text-base text-muted-foreground">Vehicles registered with the society office.</p>
      </div>

      <Card>
        <Input
          id="vehicle-search"
          label="Search by vehicle number"
          placeholder="MH 01 AB 1234"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <Button variant="outline" className="mt-4" onClick={() => setQuery("")}>
            Clear
          </Button>
        ) : null}
      </Card>

      {list.length === 0 ? (
        <Card>
          <p className="text-base text-muted-foreground">No vehicle found.</p>
        </Card>
      ) : null}

      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Vehicle Number</th>
                <th className="py-3 pr-4 font-medium">Owner</th>
                <th className="py-3 pr-4 font-medium">Flat</th>
                <th className="py-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.number} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{v.number}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{v.owner}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{v.flat}</td>
                  <td className="py-3 text-muted-foreground">{v.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        {list.map((v) => (
          <Card key={v.number}>
            <p className="font-heading text-2xl text-primary">{v.number}</p>
            <p className="mt-1 text-base text-foreground">{v.owner}</p>
            <p className="text-sm text-muted-foreground">{v.flat}</p>
            <p className="text-sm text-muted-foreground">{v.phone}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
