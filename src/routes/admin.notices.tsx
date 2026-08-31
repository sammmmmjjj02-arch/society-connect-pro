import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Input } from "@/components/kit";
import { addNotice, deleteNotice, updateNotice, useAdminState, type Notice } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/notices")({
  head: () => ({
    meta: [
      { title: "Notices — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Publish, edit and remove society notices shown to residents." },
      { property: "og:title", content: "Notices — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Publish and manage society notices for residents." },
    ],
  }),
  component: AdminNotices,
});

const empty = { title: "", summary: "", body: "", important: false };
const textareaClass =
  "min-h-32 w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25";

function AdminNotices() {
  const { notices } = useAdminState();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  function startEdit(n: Notice) {
    setEditingId(n.id);
    setForm({ title: n.title, summary: n.summary, body: n.body, important: n.important });
    setOpen(true);
  }

  function reset() {
    setForm(empty);
    setEditingId(null);
    setOpen(false);
    setError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      setError("Please enter a title and a short description.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      body: form.body.trim() || form.summary.trim(),
      important: form.important,
    };
    if (editingId) updateNotice(editingId, payload);
    else addNotice(payload);
    reset();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">Notices</h1>
          <p className="mt-1 text-base text-muted-foreground">Announcements published to all residents.</p>
        </div>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => (open ? reset() : setOpen(true))}
        >
          {open ? "Close" : "Add Notice"}
        </Button>
      </div>

      {open ? (
        <Card title={editingId ? "Edit Notice" : "Add Notice"} subtitle="Visible on the resident notices page">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="notice-title"
              label="Title"
              placeholder="Water tank cleaning on 21 August"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <Input
              id="notice-summary"
              label="Short description"
              placeholder="One-line summary shown in the list"
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            />
            <div className="space-y-2">
              <label htmlFor="notice-body" className="block text-sm font-medium text-foreground">
                Full description
              </label>
              <textarea
                id="notice-body"
                className={textareaClass}
                placeholder="Complete notice text for residents"
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-3 text-base text-foreground">
              <input
                type="checkbox"
                checked={form.important}
                onChange={(e) => setForm((f) => ({ ...f, important: e.target.checked }))}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              Mark as Important
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg">
                {editingId ? "Save Changes" : "Publish Notice"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={reset}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-4">
        {notices.map((n) => (
          <Card key={n.id}>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl text-primary">{n.title}</h2>
                  {n.important ? <Badge variant="gold">Important</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.date}</p>
                <p className="mt-3 text-base text-foreground">{n.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => startEdit(n)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => deleteNotice(n.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {notices.length === 0 ? <Card>No notices published yet.</Card> : null}
      </div>
    </div>
  );
}
