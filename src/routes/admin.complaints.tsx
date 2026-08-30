import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/kit";
import { ComplaintBadge } from "@/components/status-badge";
import { setAdminComplaintStatus, useAdminState, type AdminComplaint } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Resident complaints with category, date and status the committee can update." },
      { property: "og:title", content: "Complaints — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Resident complaints the committee can track and update." },
    ],
  }),
  component: AdminComplaints,
});

const statuses: AdminComplaint["status"][] = ["Open", "In Progress", "Resolved"];
const selectClass =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25";

function AdminComplaints() {
  const { complaints } = useAdminState();
  const [filter, setFilter] = useState<"All" | AdminComplaint["status"]>("All");

  const list = complaints.filter((c) => filter === "All" || c.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-primary sm:text-4xl">Complaints</h1>
        <p className="mt-1 text-base text-muted-foreground">Issues raised by residents across the society.</p>
      </div>

      <Card>
        <div className="max-w-xs space-y-2">
          <label htmlFor="complaint-filter" className="block text-sm font-medium text-foreground">
            Filter by status
          </label>
          <select
            id="complaint-filter"
            className={selectClass}
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | AdminComplaint["status"])}
          >
            {["All", ...statuses].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Resident</th>
                <th className="py-3 pr-4 font-medium">Flat</th>
                <th className="py-3 pr-4 font-medium">Complaint</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-border/70 last:border-0">
                  <td className="py-3 pr-4 text-base font-medium text-foreground">{c.resident}</td>
                  <td className="py-3 pr-4 text-base text-foreground">{c.flat}</td>
                  <td className="py-3 pr-4 text-base text-foreground">
                    {c.title}
                    <span className="block text-sm text-muted-foreground">{c.description}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.category}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.date}</td>
                  <td className="py-3 pr-4">
                    <ComplaintBadge status={c.status} />
                  </td>
                  <td className="py-3">
                    <select
                      aria-label={`Update status for ${c.id}`}
                      className={selectClass}
                      value={c.status}
                      onChange={(e) => setAdminComplaintStatus(c.id, e.target.value as AdminComplaint["status"])}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 ? <p className="py-6 text-base text-muted-foreground">No complaints in this list.</p> : null}
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        {list.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-2xl text-primary">{c.title}</p>
              <ComplaintBadge status={c.status} />
            </div>
            <p className="mt-1 text-base text-foreground">
              {c.resident} · {c.flat}
            </p>
            <p className="text-sm text-muted-foreground">
              {c.category} · {c.date}
            </p>
            <p className="mt-3 text-base text-foreground">{c.description}</p>
            <select
              aria-label={`Update status for ${c.id}`}
              className={`${selectClass} mt-4`}
              value={c.status}
              onChange={(e) => setAdminComplaintStatus(c.id, e.target.value as AdminComplaint["status"])}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Card>
        ))}
        {list.length === 0 ? <Card>No complaints in this list.</Card> : null}
      </div>
    </div>
  );
}
