import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { watchman } from "@/lib/watchman-store";

export const Route = createFileRoute("/watchman/profile")({
  head: () => ({
    meta: [
      { title: "Watchman Profile — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Watchman details, assigned society and duty role.",
      },
      {
        property: "og:title",
        content: "Watchman Profile — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Watchman details, assigned society and duty role.",
      },
    ],
  }),
  component: WatchmanProfile,
});

const NAME_KEY = "sai-bhawani-watchman-name";
const PHONE_KEY = "sai-bhawani-watchman-phone";
const PHOTO_KEY = "sai-bhawani-watchman-photo";

function WatchmanProfile() {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(watchman.name);
  const [phone, setPhone] = useState(watchman.phone);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem(NAME_KEY);
    const savedPhone = localStorage.getItem(PHONE_KEY);
    const savedPhoto = localStorage.getItem(PHOTO_KEY);

    if (savedName) {
      watchman.name = savedName;
      setName(savedName);
    }

    if (savedPhone) {
      watchman.phone = savedPhone;
      setPhone(savedPhone);
    }

    if (savedPhoto) {
      setProfileImage(savedPhoto);
    }
  }, []);

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setProfileImage(result);
        localStorage.setItem(PHOTO_KEY, result);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    const newName = name.trim();
    const newPhone = phone.trim();

    if (!newName || !newPhone) {
      return;
    }

    watchman.name = newName;
    watchman.phone = newPhone;

    localStorage.setItem(NAME_KEY, newName);
    localStorage.setItem(PHONE_KEY, newPhone);

    setName(newName);
    setPhone(newPhone);
    setEditing(false);
  }

  function handleCancel() {
    setName(watchman.name);
    setPhone(watchman.phone);
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Header */}
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Gate Desk
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your gate duty details and assigned society information.
          </p>
        </div>

        {!editing ? (
          <Button
            size="lg"
            variant="gold"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        ) : null}
      </section>

      {/* Profile header */}
      <Card className="overflow-hidden p-0">
        <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white text-primary shadow-lg sm:h-32 sm:w-32">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-heading text-5xl font-semibold">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
                Watchman
              </p>

              <h2 className="mt-1 font-heading text-4xl sm:text-5xl">
                {name}
              </h2>

              <p className="mt-2 text-sm text-primary-foreground/70 sm:text-base">
                {watchman.role}
              </p>

              <p className="mt-1 text-sm text-primary-foreground/60">
                {watchman.society}
              </p>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="flex flex-col gap-3 border-b border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-medium text-foreground">
              Profile Photo
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Upload a clear photo for your gate desk profile.
            </p>
          </div>

          <label
            htmlFor="watchman-profile-photo"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {profileImage ? "Change Photo" : "Upload Photo"}

            <input
              id="watchman-profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>
      </Card>

      {/* Edit form */}
      {editing ? (
        <Card
          title="Edit Profile"
          subtitle="Update the details that can be changed from the gate desk"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="edit-name"
              label="Watchman Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="edit-phone"
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              id="edit-society"
              label="Assigned Society"
              value={watchman.society}
              disabled
            />

            <Input
              id="edit-role"
              label="Role"
              value={watchman.role}
              disabled
            />

            <Input
              id="edit-shift"
              label="Duty Hours"
              value={watchman.shift}
              disabled
            />
          </div>

          <div className="mt-6 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
            Society, role and duty hours are controlled by the
            committee.
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
            <Button
              size="lg"
              variant="gold"
              onClick={handleSave}
            >
              Save Changes
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        /* Details */
        <Card
          title="Duty Details"
          subtitle="Information associated with your watchman account"
        >
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Watchman Name
              </dt>

              <dd className="mt-1 font-heading text-2xl text-primary">
                {name}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Phone Number
              </dt>

              <dd className="mt-1 text-base font-medium text-foreground">
                {phone}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Assigned Society
              </dt>

              <dd className="mt-1 font-heading text-2xl text-primary">
                {watchman.society}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </dt>

              <dd className="mt-1 text-base font-medium text-foreground">
                {watchman.role}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Duty Hours
              </dt>

              <dd className="mt-1 text-base font-medium text-foreground">
                {watchman.shift}
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}