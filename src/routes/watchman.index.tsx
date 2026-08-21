import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Card } from "@/components/kit";
import { vehicles } from "@/lib/resident-store";
import { formatDateTime, isToday, useWatchmanState, watchman } from "@/lib/watchman-store";

export const Route = createFileRoute("/watchman/")({
  head: () => ({
    meta: [
      { title: "Watchman Dashboard — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Gate desk overview of parcels received, pending collections and vehicles." },
      { property: "og:title", content: "Watchman Dashboard — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Gate desk overview of parcels and society vehicles." },
    ],
  }),
  component: WatchmanDashboard,
});

function WatchmanDashboard() {
  const { parcels, activity } = useWatchmanState();
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const tick = () => setNow(formatDateTime(new Date()));
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: "Parcels Received Today", value: String(parcels.filter((p) => isToday(p.receivedAt)).length), note: "Logged at the gate" },
    { label: "Parcels Pending Collection", value: String(parcels.filter((p) => p.status === "Received").length), note: "Waiting for residents" },
    { label: "Registered Vehicles", value: String(vehicles.length), note: "Society records" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <h1 className="text-3xl text-primary sm:text-4xl">Welcome, {watchman.name}</h1>
            <p className="mt-2 text-base text-muted-foreground">{watchman.society} · Main Gate</p>
            <p className="mt-1 text-sm text-muted-foreground">{now}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/watchman/parcels" search={{ add: true }}>
              <Button size="lg" className="w-full sm:w-auto">
                Add Parcel
              </Button>
            </Link>
            <Link to="/watchman/vehicles">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Search Vehicle
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-primary">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <Card title="Recent Activity" subtitle="Latest entries at the gate desk">
        <ul className="space-y-3">
          {activity.slice(0, 6).map((a) => (
            <li
              key={a.id}
              className="grid gap-1 rounded-lg bg-secondary p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <p className="text-base text-foreground">{a.text}</p>
              <p className="text-sm text-muted-foreground">{a.time}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
