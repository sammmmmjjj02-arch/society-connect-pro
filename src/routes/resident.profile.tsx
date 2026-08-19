import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { resident } from "@/lib/resident-store";

export const Route = createFileRoute("/resident/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Sai Bhawani CHS Ltd" },
      { name: "description", content: "View your resident profile and flat details." },
      { property: "og:title", content: "My Profile — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "View your resident profile and flat details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);

  const fields = [
    { label: "Resident Name", value: resident.name },
    { label: "Flat Number", value: resident.flat },
    { label: "Building", value: resident.building },
    { label: "Phone Number", value: resident.phone },
    { label: "Email", value: resident.email },
    { label: "Member Since", value: resident.memberSince },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="text-3xl text-primary sm:text-4xl">My Profile</h1>
          <p className="mt-1 text-base text-muted-foreground">Your society membership details.</p>
        </div>
        <Button size="lg" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {editing ? (
        <Card title="Edit Profile" subtitle="Changes will be sent to the committee for approval">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input id="edit-name" label="Resident Name" defaultValue={resident.name} />
            <Input id="edit-phone" label="Phone Number" defaultValue={resident.phone} />
            <Input id="edit-email" label="Email" defaultValue={resident.email} />
            <Input id="edit-flat" label="Flat Number" defaultValue={resident.flat} disabled />
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
