import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/kit";
import { DashboardLayout, PlaceholderGrid } from "@/components/society-layout";

const items = [
  { label: "Dashboard" },
  { label: "Residents" },
  { label: "Flats" },
  { label: "Maintenance" },
  { label: "Payment Verification" },
  { label: "Complaints" },
  { label: "Vehicles" },
  { label: "Notices" },
  { label: "Profile" },
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Committee portal for residents, flats, maintenance and notices." },
      { property: "og:title", content: "Admin Dashboard — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Committee portal for residents, flats and maintenance." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <DashboardLayout role="Admin" navItems={items}>
      <Card title="Welcome, Admin" subtitle="Society administration tools will appear here." className="mb-6">
        <p className="text-sm text-muted-foreground">
          This is a placeholder dashboard. Resident records, maintenance, payment verification and notices
          will be added in upcoming releases.
        </p>
      </Card>
      <PlaceholderGrid items={items.slice(1)} />
    </DashboardLayout>
  );
}
