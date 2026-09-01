import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/kit";
import { ComplaintBadge } from "@/components/status-badge";
import {
  setAdminComplaintStatus,
  useAdminState,
  type AdminComplaint,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Resident complaints with category, date and status the committee can update.",
      },
      {
        property: "og:title",
        content: "Complaints — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Resident complaints the committee can track and update.",
      },
    ],
  }),
  component: AdminComplaints,
});

const statuses: AdminComplaint["status"][] = [
  "Open",
  "In Progress",
  "Resolved",
];

const selectClass =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25";

function AdminComplaints() {
  const { complaints } = useAdminState();

  const [filter, setFilter] = useState<
    "All" | AdminComplaint["status"]
  >("All");

  const list = complaints.filter(
    (complaint) =>
      filter === "All" || complaint.status === filter,
  );

  const counts = {
    All: complaints.length,
    Open: complaints.filter((c) => c.status === "Open").length,
    "In Progress": complaints.filter(
      (c) => c.status === "In Progress",
    ).length,
    Resolved: complaints.filter(
      (c) => c.status === "Resolved",
    ).length,
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Admin Portal
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Complaints
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Review issues raised by residents and keep track of their
          resolution status.
        </p>
      </section>

      {/* Filter */}
      <Card>
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Filter complaints
          </p>

          <div className="flex flex-wrap gap-2">
            {(["All", ...statuses] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  filter === status
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {status}
                <span
                  className={`ml-2 ${
                    filter === status
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/70"
                  }`}
                >
                  {counts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 font-medium text-primary">
                    Resident
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Flat
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Complaint
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Category
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Date
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Status
                  </th>

                  <th className="px-5 py-3.5 font-medium text-primary">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {complaint.resident}
                    </td>

                    <td className="px-5 py-4 text-foreground">
                      {complaint.flat}
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p className="font-medium text-foreground">
                        {complaint.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {complaint.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {complaint.category}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {complaint.date}
                    </td>

                    <td className="px-5 py-4">
                      <ComplaintBadge status={complaint.status} />
                    </td>

                    <td className="px-5 py-4">
                      <select
                        aria-label={`Update status for ${complaint.id}`}
                        className={selectClass}
                        value={complaint.status}
                        onChange={(e) =>
                          setAdminComplaintStatus(
                            complaint.id,
                            e.target.value as AdminComplaint["status"],
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {list.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-heading text-2xl text-primary">
                No complaints found
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                There are no complaints matching the selected filter.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {list.map((complaint) => (
          <Card key={complaint.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-2xl text-primary">
                  {complaint.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {complaint.resident} · {complaint.flat}
                </p>
              </div>

              <ComplaintBadge status={complaint.status} />
            </div>

            <div className="mt-5 grid gap-3 border-t border-border pt-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Category
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {complaint.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Date
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {complaint.date}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-foreground">
                  {complaint.description}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <label
                htmlFor={`mobile-status-${complaint.id}`}
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Update Status
              </label>

              <select
                id={`mobile-status-${complaint.id}`}
                aria-label={`Update status for ${complaint.id}`}
                className={selectClass}
                value={complaint.status}
                onChange={(e) =>
                  setAdminComplaintStatus(
                    complaint.id,
                    e.target.value as AdminComplaint["status"],
                  )
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        ))}

        {list.length === 0 ? (
          <Card className="text-center">
            <p className="font-heading text-2xl text-primary">
              No complaints found
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              There are no complaints matching the selected filter.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}