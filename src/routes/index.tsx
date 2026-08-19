import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SocietyLogo } from "@/components/society-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sai Bhawani CHS Ltd — Society Management System" },
      {
        name: "description",
        content:
          "Secure society management portal for Sai Bhawani CHS Ltd residents, watchmen and administrators.",
      },
      { property: "og:title", content: "Sai Bhawani CHS Ltd — Society Management System" },
      {
        property: "og:description",
        content: "Secure society management portal for residents, watchmen and administrators.",
      },
    ],
  }),
  component: Intro,
});

function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/login", replace: true }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 text-center">
      <div className="animate-rise">
        <SocietyLogo className="h-24 w-24 bg-card p-2 shadow-[var(--shadow-card)]" />
      </div>
      <h1
        className="mt-8 font-heading text-4xl font-semibold tracking-wide text-primary-foreground animate-rise sm:text-6xl"
        style={{ animationDelay: "0.15s" }}
      >
        SAI BHAWANI CHS LTD
      </h1>
      <div className="mt-6 h-px w-56 bg-accent animate-line" />
      <p
        className="mt-6 text-sm tracking-[0.3em] text-primary-foreground/70 animate-rise"
        style={{ animationDelay: "0.5s" }}
      >
        SOCIETY MANAGEMENT SYSTEM
      </p>
    </div>
  );
}
