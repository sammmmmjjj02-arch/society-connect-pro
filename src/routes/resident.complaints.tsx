import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { ComplaintBadge } from "@/components/status-badge";
import {
  addComplaint,
  useResidentState,
  type Complaint,
} from "@/lib/resident-store";

export const Route = createFileRoute("/resident/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content: "Raise and track society complaints as a resident.",
      },
      {
        property: "og:title",
        content: "Complaints — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Raise and track society complaints as a resident.",
      },
    ],
  }),
  component: ComplaintsPage,
});

const categories = [
  "Plumbing",
  "Electrical",
  "Lift",
  "Housekeeping",
  "Security",
  "Other",
];

function ComplaintsPage() {
  const { complaints } = useResidentState();

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]!);
  const [description, setDescription] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    addComplaint({
      title: title.trim(),
      category,
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
    setCategory(categories[0]!);
    setShowForm(false);
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Resident Portal
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            Complaints
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Raise an issue and track its progress with the committee.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => setShowForm((v) => !v)}
          variant={showForm ? "outline" : "gold"}
        >
          {showForm ? "Close Form" : "New Complaint"}
        </Button>
      </section>

      {/* New complaint form */}
      {showForm ? (
        <form onSubmit={handleSubmit}>
          <Card
            title="New Complaint"
            subtitle="The committee will respond within 48 hours"
          >
            <div className="space-y-6">
              <Input
                id="title"
                label="Complaint Title"
                placeholder="Brief title of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-foreground"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe the issue in detail"
                  className="w-full resize-y rounded-lg border border-input bg-card p-4 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/25"
                />
              </div>

              {/* Photo */}
              <div className="space-y-2">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-foreground"
                >
                  Photo <span className="font-normal text-muted-foreground">(optional)</span>
                </label>

                <label
                  htmlFor="photo"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/60 px-5 py-8 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.025]"
                >
                  <span className="text-2xl text-primary">↑</span>

                  <span className="mt-2 text-sm font-medium text-foreground">
                    Upload a photo
                  </span>

                  <span className="mt-1 text-xs text-muted-foreground">
                    Add an image that helps explain the issue
                  </span>

                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Form actions */}
              <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                <Button type="submit" size="lg" variant="gold">
                  Submit Complaint
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </form>
      ) : null}

      {/* Complaints list */}
      <Card
        title="My Complaints"
        subtitle={
          complaints.length > 0
            ? `${complaints.length} complaint${complaints.length === 1 ? "" : "s"} submitted`
            : "Your submitted complaints will appear here"
        }
      >
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-2xl text-primary">
                      {c.title}
                    </p>

                    <ComplaintBadge status={c.status} />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {c.category} · {c.date} · {c.id}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSelected(c)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {complaints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/50 px-6 py-10 text-center">
              <p className="font-heading text-2xl text-primary">
                No complaints yet
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                If there is an issue in the society, you can raise a new
                complaint using the button above.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Complaint details modal */}
      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-0 overflow-hidden">
              <div className="bg-primary px-6 py-5 text-primary-foreground">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                      Complaint Details
                    </p>

                    <h2 className="mt-1 font-heading text-3xl">
                      {selected.title}
                    </h2>
                  </div>

                  <ComplaintBadge status={selected.status} />
                </div>
              </div>

              <div className="p-6">
                <div className="rounded-lg bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">
                    {selected.category} · {selected.date} · {selected.id}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    Description
                  </p>

                  <p className="mt-2 text-base leading-7 text-foreground">
                    {selected.description}
                  </p>
                </div>

                <Button
                  className="mt-6"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}