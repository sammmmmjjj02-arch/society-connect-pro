import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout, type NavItem } from "@/components/society-layout";

export const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin", exact: true },
  { label: "Residents", to: "/admin/residents" },
  { label: "Flats", to: "/admin/flats" },
  { label: "Maintenance", to: "/admin/maintenance" },
  { label: "Payment Verification", to: "/admin/payments" },
  { label: "Complaints", to: "/admin/complaints" },
  { label: "Vehicles", to: "/admin/vehicles" },
  { label: "Notices", to: "/admin/notices" },
  { label: "Profile", to: "/admin/profile" },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardLayout role="Admin" navItems={adminNav}>
      <Outlet />
    </DashboardLayout>
  );
}
