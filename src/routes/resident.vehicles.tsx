import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { vehicles } from "@/lib/resident-store";

export const Route = createFileRoute("/resident/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicle Search — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Search a society vehicle by its registration number." },
      { property: "og:title", content: "Vehicle Search — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Search a society vehicle by its registration number." },
    ],
  }),
  component: VehicleSearchPage,
});

const normalize = (v: string) => v.replace(/[\s-]/g, "").toUpperCase();

function VehicleSearchPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<typeof vehicles>([]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = normalize(query);
    setResults(q ? vehicles.filter((v) => normalize(v.number).includes(q)) : []);
    setSearched(true);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Vehicle Search</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Find the owner of a vehicle parked in the society.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
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
