import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout, type NavItem } from "@/components/society-layout";

export const watchmanNav: NavItem[] = [
  { label: "Dashboard", to: "/watchman", exact: true },
  { label: "Parcels", to: "/watchman/parcels" },
  { label: "Vehicle Search", to: "/watchman/vehicles" },
  { label: "Profile", to: "/watchman/profile" },
];

export const Route = createFileRoute("/watchman")({
  component: WatchmanLayout,
});

function WatchmanLayout() {
  return (
    <DashboardLayout role="Watchman" navItems={watchmanNav}>
      <Outlet />
    </DashboardLayout>
  );
}
