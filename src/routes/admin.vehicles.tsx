import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import {
  addVehicle,
  removeVehicle,
  updateVehicle,
  useResidentState,
  type Vehicle,
  resident,
} from "@/lib/resident-store";

export const Route = createFileRoute("/admin/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Manage registered society vehicles with owner, flat number and contact details.",
      },
      {
        property: "og:title",
        content: "Vehicles — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Manage registered society vehicles and their owners.",
      },
    ],
  }),
  component: AdminVehicles,
});

const vehicleTypes: Vehicle["type"][] = [
  "Car",
  "Bike",
  "Scooter",
  "Other",
];

function AdminVehicles() {
  const { vehicles } = useResidentState();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(
    null,
  );

  const [number, setNumber] = useState("");
  const [owner, setOwner] = useState("");
  const [flat, setFlat] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<Vehicle["type"]>("Car");
  const [model, setModel] = useState("");
  const [parking, setParking] = useState("");

  const q = query.trim().toLowerCase().replace(/\s+/g, "");

  const list = q
    ? vehicles.filter((vehicle) => {
        const searchable = [
          vehicle.number,
          vehicle.owner,
          vehicle.flat,
          vehicle.phone,
          vehicle.type,
          vehicle.model,
          vehicle.parking,
        ]
          .join(" ")
          .toLowerCase()
          .replace(/\s+/g, "");

        return searchable.includes(q);
      })
    : vehicles;

  function resetForm() {
    setNumber("");
    setOwner("");
    setFlat("");
    setPhone("");
    setType("Car");
    setModel("");
    setParking("");
    setEditingVehicle(null);
    setShowForm(false);
  }

  function openAddForm() {
    setEditingVehicle(null);

    setNumber("");
    setOwner("");
    setFlat("");
    setPhone("");
    setType("Car");
    setModel("");
    setParking("");

    setShowForm(true);
  }

  function openEditForm(vehicle: Vehicle) {
    setEditingVehicle(vehicle);

    setNumber(vehicle.number);
    setOwner(vehicle.owner);
    setFlat(vehicle.flat);
    setPhone(vehicle.phone);
    setType(vehicle.type);
    setModel(vehicle.model);
    setParking(vehicle.parking);

    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !number.trim() ||
      !owner.trim() ||
      !flat.trim() ||
      !phone.trim() ||
      !model.trim() ||
      !parking.trim()
    ) {
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

      /*
       * addVehicle automatically assigns the current resident as owner.
       * Admin-created vehicles therefore currently use the mock resident
       * profile because the project is still using local mock state.
       */
    }

    resetForm();
  }

  function handleRemove(vehicle: Vehicle) {
    const confirmed = window.confirm(
      `Remove ${vehicle.number} from the society vehicle records?`,
    );

    if (!confirmed) return;

    removeVehicle(vehicle.number);
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Admin Portal
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            Vehicles
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage registered society vehicles and their owners.
          </p>
        </div>

        <Button size="lg" variant="gold" onClick={openAddForm}>
          + Add Vehicle
        </Button>
      </section>

      {/* Search */}
      <Card>
        <Input
          id="vehicle-search"
          label="Search vehicles"
          placeholder="Vehicle number, owner, flat, phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query ? (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setQuery("")}
          >
            Clear Search
          </Button>
        ) : null}
      </Card>

      {/* Add / Edit form */}
      {showForm ? (
        <Card
          title={editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
          subtitle={
            editingVehicle
              ? "Update the registered vehicle details."
              : "Register a vehicle in the society records."
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="admin-vehicle-number"
                label="Vehicle Number"
                placeholder="MH 01 AB 1234"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />

              <div className="space-y-2">
                <label
                  htmlFor="admin-vehicle-type"
                  className="block text-sm font-medium text-foreground"
                >
                  Vehicle Type
                </label>

                <select
                  id="admin-vehicle-type"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as Vehicle["type"])
                  }
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
                >
                  {vehicleTypes.map((vehicleType) => (
                    <option key={vehicleType} value={vehicleType}>
                      {vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="admin-owner"
                label="Owner Name"
                placeholder="Resident name"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
                disabled={Boolean(editingVehicle)}
              />

              <Input
                id="admin-flat"
                label="Flat Number"
                placeholder="B-704"
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                required
                disabled={Boolean(editingVehicle)}
              />

              <Input
                id="admin-phone"
                label="Phone Number"
                placeholder="+91 98200 41235"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={Boolean(editingVehicle)}
              />

              <Input
                id="admin-model"
                label="Vehicle Model"
                placeholder="e.g. Honda City"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />

              <Input
                id="admin-parking"
                label="Parking Slot"
                placeholder="e.g. B-22"
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                required
              />
            </div>

            {!editingVehicle ? (
              <p className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                In the current demo version, newly added vehicles are
                linked to the active mock resident profile.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Button type="submit" size="lg" variant="gold">
                {editingVehicle ? "Save Changes" : "Add Vehicle"}
              </Button>

              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {/* Empty state */}
      {list.length === 0 ? (
        <Card className="text-center">
          <p className="font-heading text-2xl text-primary">
            No vehicle found
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Try another vehicle number, owner name, or flat number.
          </p>
        </Card>
      ) : null}

      {/* Desktop table */}
      {list.length > 0 ? (
        <Card className="hidden md:block">
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-secondary">
                  <tr className="border-b border-border">
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Vehicle
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Owner
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Flat
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Type
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Parking
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Phone
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {list.map((vehicle) => (
                    <tr
                      key={vehicle.number}
                      className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-primary">
                          {vehicle.number}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {vehicle.model}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-foreground">
                        {vehicle.owner}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {vehicle.flat}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {vehicle.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {vehicle.parking}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {vehicle.phone}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => openEditForm(vehicle)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handleRemove(vehicle)}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Mobile cards */}
      {list.length > 0 ? (
        <div className="space-y-4 md:hidden">
          {list.map((vehicle) => (
            <Card key={vehicle.number}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl text-primary">
                    {vehicle.number}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {vehicle.owner} · {vehicle.flat}
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {vehicle.type}
                </span>
              </div>

              <div className="mt-5 grid gap-4 border-t border-border pt-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Model
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {vehicle.model}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Parking
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {vehicle.parking}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {vehicle.phone}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2 border-t border-border pt-5">
                <Button
                  variant="outline"
                  onClick={() => openEditForm(vehicle)}
                >
                  Edit
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleRemove(vehicle)}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}