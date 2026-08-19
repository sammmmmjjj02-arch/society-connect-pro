import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/kit";
import { DashboardLayout, PlaceholderGrid } from "@/components/society-layout";

const items = [
  { label: "Dashboard" },
  { label: "Maintenance" },
  { label: "Payment" },
  { label: "Payment History" },
  { label: "Complaints" },
  { label: "Vehicle Search" },
  { label: "Notices" },
  { label: "Profile" },
];

export const Route = createFileRoute("/resident")({
  head: () => ({
    meta: [
      { title: "Resident Dashboard — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Resident portal for maintenance, payments, complaints and notices." },
      { property: "og:title", content: "Resident Dashboard — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Resident portal for maintenance, payments and notices." },
    ],
  }),
  component: ResidentDashboard,
});

function ResidentDashboard() {
  return (
    <DashboardLayout role="Resident" navItems={items}>
      <Card title="Welcome, Resident" subtitle="Your society services will appear here." className="mb-6">
        <p className="text-sm text-muted-foreground">
          This is a placeholder dashboard. Maintenance, payments, complaints and notices will be added in
          upcoming releases.
        </p>
      </Card>
      <PlaceholderGrid items={items.slice(1)} />
    </DashboardLayout>
  );
}
