import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { vehicles } from "@/lib/resident-store";
import { logVehicleSearch } from "@/lib/watchman-store";

export const Route = createFileRoute("/watchman/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicle Search — Watchman — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Look up a society vehicle owner by registration number at the gate." },
      { property: "og:title", content: "Vehicle Search — Watchman — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Look up a society vehicle owner by registration number." },
    ],
  }),
  component: WatchmanVehicleSearch,
});

const normalize = (v: string) => v.replace(/[\s-]/g, "").toUpperCase();

function WatchmanVehicleSearch() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<typeof vehicles>([]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = normalize(query);
    setResults(q ? vehicles.filter((v) => normalize(v.number).includes(q)) : []);
    setSearched(true);
    if (q) logVehicleSearch(query.trim().toUpperCase());
  }

  function reset() {
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Vehicle Search</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Check the owner of a vehicle at the society entrance.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
          <Input
            id="vehicle"
            label="Vehicle Number"
            placeholder="MH 01 AB 1234"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Search
          </Button>
          <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={reset}>
            Clear
          </Button>
        </form>
      </Card>

      {searched ? (
        results.length > 0 ? (
          <div className="space-y-4">
            {results.map((v) => (
              <Card key={v.number}>
                <p className="font-heading text-3xl text-primary">{v.number}</p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Owner Name</dt>
                    <dd className="text-base font-medium text-foreground">{v.owner}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Flat Number</dt>
                    <dd className="text-base font-medium text-foreground">{v.flat}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Phone Number</dt>
                    <dd className="text-base font-medium text-foreground">{v.phone}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center">
            <p className="font-heading text-2xl text-primary">No vehicle found</p>
            <p className="mt-2 text-base text-muted-foreground">
              No record matches “{query}”. Please check the number and try again.
            </p>
          </Card>
        )
      ) : null}
    </div>
  );
}
