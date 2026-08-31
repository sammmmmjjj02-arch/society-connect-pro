import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card } from "@/components/kit";
import { useNotices, type Notice } from "@/lib/admin-store";

export const Route = createFileRoute("/resident/notices")({
  head: () => ({
    meta: [
      { title: "Notices — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Official notices and announcements from the society committee." },
      { property: "og:title", content: "Notices — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Official notices and announcements from the committee." },
    ],
  }),
  component: NoticesPage,
});

function NoticesPage() {
  const notices = useNotices();
  const [open, setOpen] = useState<Notice | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Notices</h1>
        <p className="mt-1 text-base text-muted-foreground">Announcements from the society committee.</p>
      </div>

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
              <Button variant="outline" onClick={() => setOpen(n)}>
                Read more
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Card>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl text-primary">{open.title}</h2>
                {open.important ? <Badge variant="gold">Important</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{open.date}</p>
              <p className="mt-4 whitespace-pre-line text-base text-foreground">{open.body}</p>
              <Button className="mt-6" onClick={() => setOpen(null)}>
                Close
              </Button>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
