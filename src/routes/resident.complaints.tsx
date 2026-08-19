import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/components/kit";
import { ComplaintBadge } from "@/components/status-badge";
import { addComplaint, useResidentState, type Complaint } from "@/lib/resident-store";

export const Route = createFileRoute("/resident/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Raise and track society complaints as a resident." },
      { property: "og:title", content: "Complaints — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Raise and track society complaints as a resident." },
    ],
  }),
  component: ComplaintsPage,
});

const categories = ["Plumbing", "Electrical", "Lift", "Housekeeping", "Security", "Other"];

function ComplaintsPage() {
  const { complaints } = useResidentState();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]!);
  const [description, setDescription] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    addComplaint({ title: title.trim(), category, description: description.trim() });
    setTitle("");
    setDescription("");
    setCategory(categories[0]!);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">Complaints</h1>
          <p className="mt-1 text-base text-muted-foreground">Raise an issue and track its progress.</p>
        </div>
        <Button size="lg" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Close Form" : "New Complaint"}
        </Button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <Card title="New Complaint" subtitle="The committee will respond within 48 hours">
            <div className="space-y-5">
              <Input
                id="title"
                label="Complaint Title"
                placeholder="Brief title of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-foreground">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe the issue in detail"
                  className="w-full rounded-lg border border-input bg-card p-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="photo" className="block text-sm font-medium text-foreground">
                  Photo (optional)
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary"
                />
              </div>
              <Button type="submit" size="lg">
                Submit Complaint
              </Button>
            </div>
          </Card>
        </form>
      ) : null}

      <Card title="My Complaints">
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-5">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                  <p className="font-heading text-2xl text-primary">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.category} · {c.date} · {c.id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ComplaintBadge status={c.status} />
                  <Button variant="outline" onClick={() => setSelected(c)}>
                    View details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Card>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl text-primary">{selected.title}</h2>
                <ComplaintBadge status={selected.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {selected.category} · {selected.date} · {selected.id}
              </p>
              <p className="mt-4 text-base text-foreground">{selected.description}</p>
              <Button className="mt-6" onClick={() => setSelected(null)}>
                Close
              </Button>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
