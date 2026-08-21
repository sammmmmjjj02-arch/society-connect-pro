import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { watchman } from "@/lib/watchman-store";

export const Route = createFileRoute("/watchman/profile")({
  head: () => ({
    meta: [
      { title: "Watchman Profile — Sai Bhawani CHS Ltd" },
      { name: "description", content: "Watchman details, assigned society and duty role." },
      { property: "og:title", content: "Watchman Profile — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Watchman details, assigned society and duty role." },
    ],
  }),
  component: WatchmanProfile,
});

function WatchmanProfile() {
  const [editing, setEditing] = useState(false);

  const fields = [
    { label: "Watchman Name", value: watchman.name },
    { label: "Phone Number", value: watchman.phone },
    { label: "Assigned Society", value: watchman.society },
    { label: "Role", value: watchman.role },
    { label: "Duty Hours", value: watchman.shift },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">My Profile</h1>
          <p className="mt-1 text-base text-muted-foreground">Your gate duty details.</p>
        </div>
        <Button size="lg" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {editing ? (
        <Card title="Edit Profile" subtitle="Changes will be sent to the committee for approval">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input id="edit-name" label="Watchman Name" defaultValue={watchman.name} />
            <Input id="edit-phone" label="Phone Number" defaultValue={watchman.phone} />
            <Input id="edit-society" label="Assigned Society" defaultValue={watchman.society} disabled />
            <Input id="edit-role" label="Role" defaultValue={watchman.role} disabled />
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
