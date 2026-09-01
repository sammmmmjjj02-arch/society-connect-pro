import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import {
  addResident,
  deactivateResident,
  restoreResident,
  updateResident,
  useAdminState,
  type AdminResident,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/residents")({
  head: () => ({
    meta: [
      { title: "Residents — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Society member records with flat number, contact details and membership status.",
      },
      {
        property: "og:title",
        content: "Residents — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Society member records and contact details.",
      },
    ],
  }),
  component: ResidentsPage,
});

function ResidentsPage() {
  const { residents } = useAdminState();

  const [query, setQuery] = useState("");
  const [selected, setSelected] =
    useState<AdminResident | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [flat, setFlat] = useState("");
  const [building, setBuilding] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");

  const q = query.trim().toLowerCase();

  const list = q
    ? residents.filter((resident) =>
        [
          resident.name,
          resident.flat,
          resident.phone,
          resident.email,
        ].some((value) =>
          value.toLowerCase().includes(q),
        ),
      )
    : residents;

  function resetForm() {
    setName("");
    setFlat("");
    setBuilding("");
    setPhone("");
    setEmail("");
    setMemberSince("");
    setShowForm(false);
    setEditing(false);
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openResident(residentRecord: AdminResident) {
    setSelected(residentRecord);
    setEditing(false);
  }

  function openEdit(residentRecord: AdminResident) {
    setSelected(residentRecord);
    setEditing(true);

    setName(residentRecord.name);
    setFlat(residentRecord.flat);
    setBuilding(residentRecord.building);
    setPhone(residentRecord.phone);
    setEmail(residentRecord.email);
    setMemberSince(residentRecord.memberSince);
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();

    if (
      !name.trim() ||
      !flat.trim() ||
      !building.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !memberSince.trim()
    ) {
      return;
    }

    addResident({
      name,
      flat,
      building,
      phone,
      email,
      memberSince,
    });

    resetForm();
  }

  function handleUpdate(e: FormEvent) {
    e.preventDefault();

    if (!selected) return;

    updateResident(selected.id, {
      name,
      flat,
      building,
      phone,
      email,
      memberSince,
    });

    const updated = residents.find(
      (residentRecord) =>
        residentRecord.id === selected.id,
    );

    if (updated) {
      setSelected(updated);
    }

    setEditing(false);
  }

  function handleDeactivate() {
    if (!selected) return;

    const confirmed = window.confirm(
      `Deactivate ${selected.name}? Their existing maintenance, payment and complaint records will be preserved.`,
    );

    if (!confirmed) return;

    deactivateResident(selected.id);

    setSelected(null);
    setEditing(false);
  }

  function handleRestore() {
    if (!selected) return;

    restoreResident(selected.id);
    setSelected(null);
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
            Residents
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage society members without deleting their historical records.
          </p>
        </div>

        <Button
          size="lg"
          variant="gold"
          onClick={openAddForm}
        >
          + Add Resident
        </Button>
      </section>

      {/* Search */}
      <Card>
        <Input
          id="resident-search"
          label="Search residents"
          placeholder="Name, flat number, phone or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      {/* Add form */}
      {showForm ? (
        <Card
          title="Add Resident"
          subtitle="Create a new active society member"
        >
          <form
            onSubmit={handleAdd}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="add-name"
                label="Full Name"
                placeholder="Resident name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                id="add-flat"
                label="Flat Number"
                placeholder="B-704"
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                required
              />

              <Input
                id="add-building"
                label="Building"
                placeholder="B"
                value={building}
                onChange={(e) =>
                  setBuilding(e.target.value)
                }
                required
              />

              <Input
                id="add-phone"
                label="Phone Number"
                placeholder="+91 98200 41235"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                id="add-email"
                label="Email"
                type="email"
                placeholder="resident@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                id="add-member-since"
                label="Member Since"
                placeholder="August 2026"
                value={memberSince}
                onChange={(e) =>
                  setMemberSince(e.target.value)
                }
                required
              />
            </div>

            <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
              New residents are created with <strong>Active</strong>{" "}
              status. Their historical records will be created as
              they use the system.
            </div>

            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Button
                type="submit"
                size="lg"
                variant="gold"
              >
                Add Resident
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

      {/* Residents */}
      <Card
        title="Society Members"
        subtitle={`${list.length} resident${list.length === 1 ? "" : "s"} shown`}
      >
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-secondary">
                  <tr className="border-b border-border">
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Name
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Flat
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Phone
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Status
                    </th>
                    <th className="px-5 py-3.5 font-medium text-primary">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {list.map((residentRecord) => (
                    <tr
                      key={residentRecord.id}
                      onClick={() =>
                        openResident(residentRecord)
                      }
                      className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">
                          {residentRecord.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {residentRecord.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-foreground">
                        {residentRecord.flat}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {residentRecord.phone}
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            residentRecord.status === "Active"
                              ? "gold"
                              : "muted"
                          }
                        >
                          {residentRecord.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-4">
                        <Button
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            openResident(residentRecord);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-4 md:hidden">
          {list.map((residentRecord) => (
            <button
              key={residentRecord.id}
              type="button"
              onClick={() =>
                openResident(residentRecord)
              }
              className="w-full rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/20 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-2xl text-primary">
                    {residentRecord.name}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {residentRecord.flat} · Building{" "}
                    {residentRecord.building}
                  </p>
                </div>

                <Badge
                  variant={
                    residentRecord.status === "Active"
                      ? "gold"
                      : "muted"
                  }
                >
                  {residentRecord.status}
                </Badge>
              </div>

              <p className="mt-3 text-sm text-foreground">
                {residentRecord.phone}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {residentRecord.email}
              </p>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-heading text-2xl text-primary">
              No residents found
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term.
            </p>
          </div>
        ) : null}
      </Card>

      {/* Resident details */}
      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setSelected(null);
            setEditing(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Card className="overflow-hidden p-0">
              {/* Modal header */}
              <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                      Resident Profile
                    </p>

                    <h2 className="mt-1 font-heading text-3xl sm:text-4xl">
                      {selected.name}
                    </h2>

                    <p className="mt-2 text-sm text-primary-foreground/70">
                      Flat {selected.flat} · Building{" "}
                      {selected.building}
                    </p>
                  </div>

                  <Badge
                    variant={
                      selected.status === "Active"
                        ? "gold"
                        : "muted"
                    }
                  >
                    {selected.status}
                  </Badge>
                </div>
              </div>

              {!editing ? (
                <div className="p-6 sm:p-8">
                  <dl className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Flat Number
                      </dt>
                      <dd className="mt-1 font-heading text-2xl text-primary">
                        {selected.flat}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Building
                      </dt>
                      <dd className="mt-1 text-base font-medium text-foreground">
                        Building {selected.building}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Phone
                      </dt>
                      <dd className="mt-1 text-base font-medium text-foreground">
                        {selected.phone}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Email
                      </dt>
                      <dd className="mt-1 break-all text-base font-medium text-foreground">
                        {selected.email}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Member Since
                      </dt>
                      <dd className="mt-1 text-base font-medium text-foreground">
                        {selected.memberSince}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </dt>
                      <dd className="mt-2">
                        <Badge
                          variant={
                            selected.status === "Active"
                              ? "gold"
                              : "muted"
                          }
                        >
                          {selected.status}
                        </Badge>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 rounded-xl border border-accent/30 bg-accent/10 p-4">
                    <p className="text-sm font-medium text-primary">
                      Historical records are preserved
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Deactivating this resident will not delete
                      their maintenance, payment or complaint
                      history.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3 border-t border-border pt-5">
                    <Button
                      size="lg"
                      variant="gold"
                      onClick={() => openEdit(selected)}
                    >
                      Edit Resident
                    </Button>

                    {selected.status === "Active" ? (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleDeactivate}
                      >
                        Deactivate Resident
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        onClick={handleRestore}
                      >
                        Reactivate Resident
                      </Button>
                    )}

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() =>
                        setSelected(null)
                      }
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleUpdate}
                  className="space-y-5 p-6 sm:p-8"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      id="edit-resident-name"
                      label="Full Name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                    <Input
                      id="edit-resident-flat"
                      label="Flat Number"
                      value={flat}
                      onChange={(e) =>
                        setFlat(e.target.value)
                      }
                      required
                    />

                    <Input
                      id="edit-resident-building"
                      label="Building"
                      value={building}
                      onChange={(e) =>
                        setBuilding(e.target.value)
                      }
                      required
                    />

                    <Input
                      id="edit-resident-phone"
                      label="Phone Number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      required
                    />

                    <Input
                      id="edit-resident-email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                    <Input
                      id="edit-resident-member-since"
                      label="Member Since"
                      value={memberSince}
                      onChange={(e) =>
                        setMemberSince(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                    <Button
                      type="submit"
                      size="lg"
                      variant="gold"
                    >
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}