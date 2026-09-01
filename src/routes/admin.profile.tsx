import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/kit";
import { admin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Committee administrator details for Sai Bhawani CHS Ltd.",
      },
      {
        property: "og:title",
        content: "Admin Profile — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Committee administrator details and contact information.",
      },
    ],
  }),
  component: AdminProfile,
});

type AdminProfileData = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

const STORAGE_KEY = "sai-bhawani-admin-profile";

function AdminProfile() {
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [phone, setPhone] = useState(admin.phone);
  const [role, setRole] = useState(admin.role);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AdminProfileData;

        setName(parsed.name);
        setEmail(parsed.email);
        setPhone(parsed.phone);
        setRole(parsed.role);

        admin.name = parsed.name;
        admin.email = parsed.email;
        admin.phone = parsed.phone;
        admin.role = parsed.role;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const savedPhoto = localStorage.getItem(
      "sai-bhawani-admin-photo",
    );

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
        localStorage.setItem(
          "sai-bhawani-admin-photo",
          result,
        );
      }
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    const updated: AdminProfileData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role.trim(),
    };

    if (
      !updated.name ||
      !updated.email ||
      !updated.phone ||
      !updated.role
    ) {
      return;
    }

    admin.name = updated.name;
    admin.email = updated.email;
    admin.phone = updated.phone;
    admin.role = updated.role;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated),
    );

    setName(updated.name);
    setEmail(updated.email);
    setPhone(updated.phone);
    setRole(updated.role);

    setEditing(false);
  }

  function handleCancel() {
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone);
    setRole(admin.role);
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      {/* Header */}
      <section className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
            Admin Portal
          </p>

          <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Committee administrator details and contact information.
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

      {/* Profile hero */}
      <Card className="overflow-hidden p-0">
        <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative">
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
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm uppercase tracking-[0.12em] text-primary-foreground/70">
                Committee Administrator
              </p>

              <h2 className="mt-1 font-heading text-4xl sm:text-5xl">
                {name}
              </h2>

              <p className="mt-2 text-sm text-primary-foreground/70 sm:text-base">
                {role}
              </p>
            </div>
          </div>
        </div>

        {/* Photo control */}
        <div className="flex flex-col gap-3 border-b border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-medium text-foreground">
              Profile Photo
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Upload a photo for your administrator profile.
            </p>
          </div>

          <label
            htmlFor="admin-profile-photo"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {profileImage ? "Change Photo" : "Upload Photo"}

            <input
              id="admin-profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>
      </Card>

      {/* Edit */}
      {editing ? (
        <Card
          title="Edit Profile"
          subtitle="Update your committee administrator information"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="admin-name"
              label="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="admin-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="admin-phone"
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              id="admin-role"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <Input
              id="admin-society"
              label="Society"
              value={admin.society}
              disabled
            />
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
          title="Administrator Details"
          subtitle="Information associated with your committee account"
        >
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Admin Name
              </dt>
              <dd className="mt-1 font-heading text-2xl text-primary">
                {name}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {role}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 break-all text-base font-medium text-foreground">
                {email}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Phone
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {phone}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Society
              </dt>
              <dd className="mt-1 font-heading text-2xl text-primary">
                {admin.society}
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}