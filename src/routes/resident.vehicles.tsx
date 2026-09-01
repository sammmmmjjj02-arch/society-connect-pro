import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import {
  addVehicle,
  removeVehicle,
  updateVehicle,
  useResidentState,
  type Vehicle,
} from "@/lib/resident-store";

export const Route = createFileRoute("/resident/vehicles")({
  head: () => ({
    meta: [
      { title: "My Vehicles — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content: "Manage your registered vehicles and search society vehicles.",
      },
      {
        property: "og:title",
        content: "My Vehicles — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Manage your registered vehicles and search society vehicles.",
      },
    ],
  }),
  component: VehiclePage,
});

const normalize = (value: string) =>
  value.replace(/[\s-]/g, "").toUpperCase();

const vehicleTypes: Vehicle["type"][] = [
  "Car",
  "Bike",
  "Scooter",
  "Other",
];

function VehiclePage() {
  const { vehicles } = useResidentState();

  const [tab, setTab] = useState<"my" | "search">("my");

  const [showForm, setShowForm] = useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  const [number, setNumber] = useState("");
  const [type, setType] = useState<Vehicle["type"]>("Car");
  const [model, setModel] = useState("");
  const [parking, setParking] = useState("");

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Vehicle[]>([]);

  const myVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.owner === "Rajesh S. Patil" &&
      vehicle.flat === "B-704",
  );

  function resetForm() {
    setNumber("");
    setType("Car");
    setModel("");
    setParking("");
    setEditingVehicle(null);
    setShowForm(false);
  }

  function openAddForm() {
    setEditingVehicle(null);
    setNumber("");
    setType("Car");
    setModel("");
    setParking("");
    setShowForm(true);
  }

  function openEditForm(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setNumber(vehicle.number);
    setType(vehicle.type);
    setModel(vehicle.model);
    setParking(vehicle.parking);
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!number.trim() || !model.trim() || !parking.trim()) {
      return;
    }

    if (editingVehicle) {
      updateVehicle(editingVehicle.number, {
        number,
        type,
        model,
        parking,
      });
    } else {
      const added = addVehicle({
        number,
        type,
        model,
        parking,
      });

      if (!added) {
        alert("This vehicle is already registered.");
        return;
      }
    }

    resetForm();
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    const q = normalize(query);

    if (!q) {
      setResults([]);
      setSearched(true);
      return;
    }

    setResults(
      vehicles.filter((vehicle) =>
        normalize(vehicle.number).includes(q),
      ),
    );

    setSearched(true);
  }

  function handleDelete(vehicle: Vehicle) {
    const confirmed = window.confirm(
      `Remove ${vehicle.number} from your registered vehicles?`,
    );

    if (!confirmed) {
      return;
    }

    removeVehicle(vehicle.number);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">
            Vehicles
          </h1>

          <p className="mt-1 text-base text-muted-foreground">
            Manage your vehicles and search registered society vehicles.
          </p>
        </div>

        {tab === "my" ? (
          <Button size="lg" onClick={openAddForm}>
            + Add Vehicle
          </Button>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg bg-secondary p-1">
        <button
          type="button"
          onClick={() => setTab("my")}
          className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
            tab === "my"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Vehicles
        </button>

        <button
          type="button"
          onClick={() => setTab("search")}
          className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
            tab === "search"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Search Vehicle
        </button>
      </div>

      {/* Add / Edit Vehicle */}
      {tab === "my" && showForm ? (
        <Card
          title={
            editingVehicle ? "Edit Vehicle" : "Add Vehicle"
          }
          subtitle="Enter your vehicle details"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="vehicle-number"
              label="Vehicle Number"
              placeholder="MH 01 AB 1234"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label
                htmlFor="vehicle-type"
                className="block text-sm font-medium text-foreground"
              >
                Vehicle Type
              </label>

              <select
                id="vehicle-type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as Vehicle["type"])
                }
                className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
              >
                {vehicleTypes.map((vehicleType) => (
                  <option
                    key={vehicleType}
                    value={vehicleType}
                  >
                    {vehicleType}
                  </option>
                ))}
              </select>
            </div>

            <Input
              id="vehicle-model"
              label="Vehicle Model"
              placeholder="e.g. Honda City"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />

            <Input
              id="parking-slot"
              label="Parking Slot"
              placeholder="e.g. B-22"
              value={parking}
              onChange={(e) => setParking(e.target.value)}
              required
            />

            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg">
                {editingVehicle
                  ? "Save Changes"
                  : "Add Vehicle"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {/* My Vehicles */}
      {tab === "my" ? (
        <Card
          title="My Registered Vehicles"
          subtitle="Vehicles linked to your society membership"
        >
          {myVehicles.length > 0 ? (
            <div className="space-y-4">
              {myVehicles.map((vehicle) => (
                <div
                  key={vehicle.number}
                  className="rounded-xl border border-border p-5"
                >
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <div>
                      <p className="font-heading text-3xl text-primary">
                        {vehicle.number}
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Type
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {vehicle.type}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Model
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {vehicle.model}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Parking Slot
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {vehicle.parking}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          openEditForm(vehicle)
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleDelete(vehicle)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="font-heading text-2xl text-primary">
                No vehicles registered
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Add your vehicle to keep your society records
                updated.
              </p>

              <Button
                className="mt-5"
                onClick={openAddForm}
              >
                Add Your First Vehicle
              </Button>
            </div>
          )}
        </Card>
      ) : null}

      {/* Search */}
      {tab === "search" ? (
        <>
          <Card>
            <form
              onSubmit={handleSearch}
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
            >
              <Input
                id="vehicle-search"
                label="Vehicle Number"
                placeholder="MH 01 AB 1234"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
              >
                Search
              </Button>
            </form>
          </Card>

          {searched ? (
            results.length > 0 ? (
              <div className="space-y-4">
                {results.map((vehicle) => (
                  <Card key={vehicle.number}>
                    <p className="font-heading text-3xl text-primary">
                      {vehicle.number}
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Owner Name
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {vehicle.owner}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Flat Number
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {vehicle.flat}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Vehicle
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {vehicle.type} · {vehicle.model}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Parking
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {vehicle.parking}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center">
                <p className="font-heading text-2xl text-primary">
                  No vehicle found
                </p>

                <p className="mt-2 text-base text-muted-foreground">
                  No record matches "{query}". Please check the
                  vehicle number and try again.
                </p>
              </Card>
            )
          ) : null}
        </>
      ) : null}
    </div>
  );
}