import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Card } from "@/components/kit";
import {
  formatDateTime,
  isToday,
  useWatchmanState,
  watchman,
} from "@/lib/watchman-store";
import { useResidentState } from "@/lib/resident-store";

export const Route = createFileRoute("/watchman/")({
  head: () => ({
    meta: [
      { title: "Watchman Dashboard — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Gate desk overview of parcels received, pending collections and vehicles.",
      },
      {
        property: "og:title",
        content: "Watchman Dashboard — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Gate desk overview of parcels and society vehicles.",
      },
    ],
  }),
  component: WatchmanDashboard,
});

function WatchmanDashboard() {
  const { parcels, activity } = useWatchmanState();
  const { vehicles } = useResidentState();

  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      setNow(formatDateTime(new Date()));
    };

    tick();

    const timer = setInterval(tick, 30000);

    return () => clearInterval(timer);
  }, []);

  const receivedToday = parcels.filter((parcel) =>
    isToday(parcel.receivedAt),
  ).length;

  const pendingCollection = parcels.filter(
    (parcel) => parcel.status === "Received",
  ).length;

  const stats = [
    {
      label: "Parcels Received Today",
      value: String(receivedToday),
      note: "Logged at the gate",
      tone: "default",
    },
    {
      label: "Pending Collection",
      value: String(pendingCollection),
      note: "Waiting for residents",
      tone: "gold",
    },
    {
      label: "Registered Vehicles",
      value: String(vehicles.length),
      note: "Society records",
      tone: "default",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-14 -translate-y-14 rounded-full bg-accent/20" />

        <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
              Gate Desk
            </p>

            <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">
              Welcome, {watchman.name}
            </h1>

            <p className="mt-3 text-sm text-primary-foreground/70 sm:text-base">
              {watchman.society} · Main Gate
            </p>

            <div className="mt-4 inline-flex rounded-lg bg-white/10 px-3 py-2 text-sm text-primary-foreground/80">
              {now || "Loading current time..."}
            </div>
          </div>

          <div className="grid gap-3 sm:w-44">
            <Link to="/watchman/parcels">
              <Button
                size="lg"
                variant="gold"
                className="w-full"
              >
                Add Parcel
              </Button>
            </Link>

            <Link to="/watchman/vehicles">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Search Vehicle
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              stat.tone === "gold"
                ? "border-accent/30 bg-accent/10"
                : "border-border bg-card"
            }`}
          >
            <p className="text-sm text-muted-foreground">
              {stat.label}
            </p>

            <p className="mt-3 font-heading text-3xl font-semibold text-primary">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Pending parcel alert */}
      {pendingCollection > 0 ? (
        <Link to="/watchman/parcels">
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 transition-colors hover:bg-accent/15">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-accent-foreground">
              Attention required
            </p>

            <p className="mt-1 font-heading text-2xl text-primary">
              {pendingCollection} parcel
              {pendingCollection === 1 ? "" : "s"} waiting for
              collection
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Open the parcel register to view resident details and
              update collection status.
            </p>
          </div>
        </Link>
      ) : null}

      {/* Activity */}
      <Card
        title="Recent Activity"
        subtitle="Latest entries recorded at the gate desk"
      >
        <ul className="space-y-3">
          {activity.slice(0, 6).map((item) => (
            <li
              key={item.id}
              className="flex gap-3 rounded-xl border border-border bg-secondary p-4"
            >
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />

              <div className="min-w-0">
                <p className="text-sm leading-6 text-foreground sm:text-base">
                  {item.text}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {activity.length === 0 ? (
          <div className="rounded-xl bg-secondary p-5 text-center">
            <p className="text-sm text-muted-foreground">
              No recent activity.
            </p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}