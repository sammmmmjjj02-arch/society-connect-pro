import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { resident } from "@/lib/resident-store";

export const Route = createFileRoute("/resident/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content: "View your resident profile and flat details.",
      },
      {
        property: "og:title",
        content: "My Profile — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content: "View your resident profile and flat details.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const fields = [
    { label: "Resident Name", value: resident.name },
    { label: "Flat Number", value: resident.flat },
    { label: "Building", value: resident.building },
    { label: "Phone Number", value: resident.phone },
    { label: "Email", value: resident.email },
    { label: "Member Since", value: resident.memberSince },
  ];

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Page heading */}
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Resident Portal
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your society membership and personal details.
          </p>
        </div>

        <Button
          size="lg"
          variant={editing ? "outline" : "gold"}
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </section>

      {/* Profile header */}
      <Card className="overflow-hidden p-0">
        <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Profile picture */}
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white text-primary shadow-lg sm:h-32 sm:w-32">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${resident.name} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-5xl font-semibold">
                    {resident.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile identity */}
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                Resident
              </p>

              <h2 className="mt-1 font-heading text-4xl sm:text-5xl">
                {resident.name}
              </h2>

              <p className="mt-2 text-sm text-primary-foreground/75 sm:text-base">
                Flat {resident.flat} · {resident.building}
              </p>
            </div>
          </div>
        </div>

        {/* Photo controls */}
        <div className="flex flex-col gap-3 border-b border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-medium text-foreground">
              Profile Photo
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Use a clear photo so the committee can identify your profile.
            </p>
          </div>

          <label
            htmlFor="profile-photo"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {profileImage ? "Change Photo" : "Upload Photo"}

            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>
      </Card>

      {/* Edit profile */}
      {editing ? (
        <Card
          title="Edit Profile"
          subtitle="Changes will be sent to the committee for approval"
        >
          <div className="space-y-6">
            {/* Edit photo */}
            <div className="flex flex-col items-center gap-4 rounded-xl bg-secondary p-5 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-card text-primary">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${resident.name} profile preview`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-3xl font-semibold">
                    {resident.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-foreground">
                  Profile Picture
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Upload or change your profile photo.
                </p>

                <label
                  htmlFor="profile-photo-edit"
                  className="mt-3 inline-flex cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  Choose Photo

                  <input
                    id="profile-photo-edit"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="edit-name"
                label="Resident Name"
                defaultValue={resident.name}
              />

              <Input
                id="edit-phone"
                label="Phone Number"
                defaultValue={resident.phone}
              />

              <Input
                id="edit-email"
                label="Email"
                defaultValue={resident.email}
              />

              <Input
                id="edit-flat"
                label="Flat Number"
                defaultValue={resident.flat}
                disabled
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-border pt-5">
              <Button
                size="lg"
                variant="gold"
                onClick={() => setEditing(false)}
              >
                Save Changes
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Profile details */
        <Card
          title="Membership Details"
          subtitle="Information associated with your society account"
        >
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.label}
                className="border-b border-border/70 pb-4 last:border-0 sm:last:border-b"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {field.label}
                </dt>

                <dd className="mt-1 font-heading text-2xl text-primary">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
    </div>
  );
}