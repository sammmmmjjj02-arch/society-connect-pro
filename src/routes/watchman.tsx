import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/kit";
import { DashboardLayout, PlaceholderGrid } from "@/components/society-layout";

const items = [
  { label: "Dashboard" },
  { label: "Visitors" },
  { label: "Parcels" },
  { label: "Vehicle Search" },
  { label: "Profile" },
];

export const Route = createFileRoute("/watchman")({
  head: () => ({
    meta: [
      { title: "Watchman Dashboard — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Gate desk portal for visitors, parcels and vehicle lookups." },
      { property: "og:title", content: "Watchman Dashboard — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Gate desk portal for visitors, parcels and vehicle lookups." },
    ],
  }),
  component: WatchmanDashboard,
});

function WatchmanDashboard() {
  return (
    <DashboardLayout role="Watchman" navItems={items}>
      <Card title="Welcome, Watchman" subtitle="Gate desk tools will appear here." className="mb-6">
        <p className="text-sm text-muted-foreground">
          This is a placeholder dashboard. Visitor entries, parcels and vehicle search will be added in
          upcoming releases.
        </p>
      </Card>
      <PlaceholderGrid items={items.slice(1)} />
    </DashboardLayout>
  );
}
