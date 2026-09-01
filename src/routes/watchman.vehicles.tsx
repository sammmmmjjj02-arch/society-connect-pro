import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { useResidentState } from "@/lib/resident-store";
import { logVehicleSearch } from "@/lib/watchman-store";

export const Route = createFileRoute("/watchman/vehicles")({
  head: () => ({
    meta: [
      {
        title: "Vehicle Search — Watchman — Sai Bhawani CHS Ltd",
      },
      {
        name: "description",
        content:
          "Look up a society vehicle owner by registration number at the gate.",
      },
      {
        property: "og:title",
        content:
          "Vehicle Search — Watchman — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Look up a society vehicle owner by registration number.",
      },
    ],
  }),
  component: WatchmanVehicleSearch,
});

const normalize = (value: string) =>
  value.replace(/[\s-]/g, "").toUpperCase();

function WatchmanVehicleSearch() {
  const { vehicles } = useResidentState();

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<typeof vehicles>([]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    const q = normalize(query);

    setResults(
      q
        ? vehicles.filter((vehicle) =>
            normalize(vehicle.number).includes(q),
          )
        : [],
    );

    setSearched(true);

    if (q) {
      logVehicleSearch(query.trim().toUpperCase());
    }
  }

  function reset() {
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Heading */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Gate Desk
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Vehicle Search
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Quickly check a registered vehicle before allowing entry.
        </p>
      </section>

      {/* Search */}
      <Card>
        <form
          onSubmit={handleSearch}
          className="space-y-5"
        >
          <div>
            <p className="font-heading text-2xl text-primary">
              Search Registered Vehicle
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the complete or partial vehicle registration number.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
            <Input
              id="vehicle"
              label="Vehicle Number"
              placeholder="MH 01 AB 1234"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              variant="gold"
              className="w-full sm:w-auto"
            >
              Search
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={reset}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      {searched ? (
        results.length > 0 ? (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Search Results
              </p>

              <p className="mt-1 text-sm text-foreground">
                {results.length} matching vehicle
                {results.length === 1 ? "" : "s"}
              </p>
            </div>

            {results.map((vehicle) => (
              <Card
                key={vehicle.number}
                className="border-l-4 border-l-accent"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                        Registration Number
                      </p>

                      <p className="mt-1 font-heading text-3xl font-semibold tracking-wide text-primary sm:text-4xl">
                        {vehicle.number}
                      </p>
                    </div>

                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Registered
                    </span>
                  </div>

                  <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Owner
                      </p>

                      <p className="mt-1 text-base font-semibold text-foreground">
                        {vehicle.owner}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Flat
                      </p>

                      <p className="mt-1 text-base font-semibold text-foreground">
                        {vehicle.flat}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Phone
                      </p>

                      <p className="mt-1 text-base font-semibold text-foreground">
                        {vehicle.phone}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Vehicle Type
                      </p>

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {vehicle.type}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Parking
                      </p>

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {vehicle.parking}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <Card className="text-center">
            <div className="mx-auto max-w-md">
              <p className="font-heading text-3xl text-primary">
                No vehicle found
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No registered vehicle matches{" "}
                <span className="font-medium text-foreground">
                  "{query}"
                </span>
                . Check the registration number and try again.
              </p>
            </div>
          </Card>
        )
      ) : (
        <Card className="bg-secondary text-center">
          <p className="font-heading text-2xl text-primary">
            Ready to search
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter a vehicle registration number above to view the
            registered owner and flat details.
          </p>
        </Card>
      )}
    </div>
  );
}