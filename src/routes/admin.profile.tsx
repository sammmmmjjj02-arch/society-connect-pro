import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { admin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Committee administrator details for Sai Bhawani CHS Ltd." },
      { property: "og:title", content: "Admin Profile — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Committee administrator details and contact information." },
    ],
  }),
  component: AdminProfile,
});

function AdminProfile() {
  const [editing, setEditing] = useState(false);

  const fields = [
    { label: "Admin Name", value: admin.name },
    { label: "Email", value: admin.email },
    { label: "Phone", value: admin.phone },
    { label: "Role", value: admin.role },
    { label: "Society", value: admin.society },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">My Profile</h1>
          <p className="mt-1 text-base text-muted-foreground">Committee administrator details.</p>
        </div>
        <Button size="lg" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {editing ? (
        <Card title="Edit Profile" subtitle="Changes are recorded in the society register">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input id="admin-name" label="Admin Name" defaultValue={admin.name} />
            <Input id="admin-email" label="Email" defaultValue={admin.email} />
            <Input id="admin-phone" label="Phone" defaultValue={admin.phone} />
            <Input id="admin-role" label="Role" defaultValue={admin.role} />
            <Input id="admin-society" label="Society" defaultValue={admin.society} disabled />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setEditing(false)}>
              Save Changes
            </Button>
            <Button variant="outline" size="lg" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <dl className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-lg font-medium text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </div>
  );
}
