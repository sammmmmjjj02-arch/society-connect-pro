import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout, type NavItem } from "@/components/society-layout";

export const residentNav: NavItem[] = [
  { label: "Dashboard", to: "/resident", exact: true },
  { label: "Maintenance", to: "/resident/maintenance" },
  { label: "Complaints", to: "/resident/complaints" },
  { label: "Vehicle Search", to: "/resident/vehicles" },
  { label: "Notices", to: "/resident/notices" },
  { label: "Profile", to: "/resident/profile" },
];

export const Route = createFileRoute("/resident")({
  component: ResidentLayout,
});

function ResidentLayout() {
  return (
    <DashboardLayout role="Resident" navItems={residentNav}>
      <Outlet />
    </DashboardLayout>
  );
}
