import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card } from "@/components/kit";
import { useNotices, type Notice } from "@/lib/admin-store";

export const Route = createFileRoute("/resident/notices")({
  head: () => ({
    meta: [
      { title: "Notices — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Official notices and announcements from the society committee.",
      },
      {
        property: "og:title",
        content: "Notices — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "Official notices and announcements from the committee.",
      },
    ],
  }),
  component: NoticesPage,
});

function NoticesPage() {
  const notices = useNotices();
  const [open, setOpen] = useState<Notice | null>(null);

  return (
    <div className="space-y-7">
      {/* Heading */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Resident Portal
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Notices
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Official announcements and updates from the society committee.
        </p>
      </section>

      {/* Notices */}
      <div className="space-y-4">
        {notices.map((n) => (
          <Card
            key={n.id}
            className={n.important ? "border-l-4 border-l-accent" : ""}
          >
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-2xl text-primary sm:text-3xl">
                    {n.title}
                  </h2>

                  {n.important ? (
                    <Badge variant="gold">Important</Badge>
                  ) : null}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{n.date}</span>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground sm:text-base">
                  {n.summary}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setOpen(n)}
              >
                Read More
              </Button>
            </div>
          </Card>
        ))}

        {notices.length === 0 ? (
          <Card className="text-center">
            <p className="font-heading text-2xl text-primary">
              No notices available
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              New society announcements will appear here.
            </p>
          </Card>
        ) : null}
      </div>

      {/* Notice details modal */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden p-0">
              {/* Modal header */}
              <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                      Society Notice
                    </p>

                    <h2 className="mt-1 font-heading text-3xl sm:text-4xl">
                      {open.title}
                    </h2>
                  </div>

                  {open.important ? (
                    <Badge variant="gold">Important</Badge>
                  ) : null}
                </div>

                <p className="mt-3 text-sm text-primary-foreground/70">
                  {open.date}
                </p>
              </div>

              {/* Modal content */}
              <div className="p-6 sm:p-8">
                <p className="whitespace-pre-line text-base leading-7 text-foreground">
                  {open.body}
                </p>

                <div className="mt-7 border-t border-border pt-5">
                  <Button onClick={() => setOpen(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
