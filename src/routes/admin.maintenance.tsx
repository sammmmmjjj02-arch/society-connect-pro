import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/kit";
import { MaintenanceBadge } from "@/components/status-badge";
import { useLedger } from "@/lib/admin-store";
import {
  formatINR,
  statusLabel,
  type MaintenanceStatus,
} from "@/lib/resident-store";

export const Route = createFileRoute("/admin/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content:
          "Month-wise maintenance records and yearly maintenance report.",
      },
      {
        property: "og:title",
        content: "Maintenance — Sai Bhawani CHS Ltd",
      },
      {
        property: "og:description",
        content:
          "Month-wise maintenance records and yearly maintenance report.",
      },
    ],
  }),
  component: AdminMaintenance,
});

const selectClass =
  "h-11 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type ReportStatus =
  | "paid"
  | "pending"
  | "verification"
  | "rejected"
  | "none";

type YearlyReportRow = {
  resident: string;
  flat: string;
  months: Record<(typeof months)[number], ReportStatus>;
};

function getMonthName(monthValue: string) {
  return monthValue.split(" ")[0] ?? "";
}

function AdminMaintenance() {
  const ledger = useLedger();

  const [view, setView] =
    useState<"monthly" | "yearly">("monthly");

  const [month, setMonth] = useState("all");

  const [status, setStatus] =
    useState<"all" | MaintenanceStatus>("all");

  const [year, setYear] = useState("2026");

  const availableMonths = Array.from(
    new Set(ledger.map((record) => record.month)),
  );

  const rows = ledger.filter(
    (record) =>
      (month === "all" || record.month === month) &&
      (status === "all" || record.status === status),
  );

  /* ---------- Yearly report ---------- */

  const yearlyMap = new Map<string, YearlyReportRow>();

  ledger
    .filter((record) => record.month.includes(year))
    .forEach((record) => {
      const key = `${record.resident}-${record.flat}`;

      if (!yearlyMap.has(key)) {
        yearlyMap.set(key, {
          resident: record.resident,
          flat: record.flat,
          months: Object.fromEntries(
            months.map((monthName) => [
              monthName,
              "none" as ReportStatus,
            ]),
          ) as Record<(typeof months)[number], ReportStatus>,
        });
      }

      const reportRow = yearlyMap.get(key);

      if (!reportRow) {
        return;
      }

      const monthName = getMonthName(record.month);

      if (
        months.includes(
          monthName as (typeof months)[number],
        )
      ) {
        reportRow.months[
          monthName as (typeof months)[number]
        ] = record.status;
      }
    });

  const yearlyRows = Array.from(yearlyMap.values());

  const fullyPaidCount = yearlyRows.filter((row) =>
    months.every(
      (monthName) => row.months[monthName] === "paid",
    ),
  ).length;

  const pendingCount = yearlyRows.filter((row) =>
    months.some(
      (monthName) =>
        row.months[monthName] === "pending" ||
        row.months[monthName] === "rejected",
    ),
  ).length;

  const verificationCount = yearlyRows.filter((row) =>
    months.some(
      (monthName) =>
        row.months[monthName] === "verification",
    ),
  ).length;

  const paidAmount = ledger
    .filter(
      (record) =>
        record.month.includes(year) &&
        record.status === "paid",
    )
    .reduce((sum, record) => sum + record.amount, 0);

  function statusSymbol(value: ReportStatus) {
    switch (value) {
      case "paid":
        return "✓";

      case "pending":
        return "!";

      case "verification":
        return "…";

      case "rejected":
        return "!";

      default:
        return "—";
    }
  }

  function statusClass(value: ReportStatus) {
    switch (value) {
      case "paid":
        return "bg-primary/10 text-primary";

      case "pending":
        return "bg-accent/15 text-accent-foreground";

      case "verification":
        return "bg-primary/5 text-primary";

      case "rejected":
        return "bg-destructive/10 text-destructive";

      default:
        return "bg-secondary text-muted-foreground";
    }
  }

  function statusText(value: ReportStatus) {
    switch (value) {
      case "paid":
        return "Paid";

      case "pending":
        return "Pending";

      case "verification":
        return "Verification Pending";

      case "rejected":
        return "Rejected";

      default:
        return "No Record";
    }
  }

  /* ---------- Download yearly report ---------- */

  function downloadYearlyReport() {
    if (yearlyRows.length === 0) {
      return;
    }

    const escapeXml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const headerCells = [
      "Name",
      "Flat No.",
      ...months,
    ];

    const titleRow = `
      <Row>
        <Cell ss:MergeAcross="13" ss:StyleID="Title">
          <Data ss:Type="String">
            SAI BHAWANI CHS LTD - ANNUAL MAINTENANCE REPORT ${escapeXml(
              year,
            )}
          </Data>
        </Cell>
      </Row>
    `;

    const generatedRow = `
      <Row>
        <Cell ss:MergeAcross="13">
          <Data ss:Type="String">
            Generated from Society Connect
          </Data>
        </Cell>
      </Row>
    `;

    const headerRow = `
      <Row>
        ${headerCells
          .map(
            (cell) => `
              <Cell ss:StyleID="Header">
                <Data ss:Type="String">
                  ${escapeXml(cell)}
                </Data>
              </Cell>
            `,
          )
          .join("")}
      </Row>
    `;

    const dataRows = yearlyRows
      .map(
        (row) => `
          <Row>
            <Cell>
              <Data ss:Type="String">
                ${escapeXml(row.resident)}
              </Data>
            </Cell>

            <Cell>
              <Data ss:Type="String">
                ${escapeXml(row.flat)}
              </Data>
            </Cell>

            ${months
              .map(
                (monthName) => `
                  <Cell>
                    <Data ss:Type="String">
                      ${escapeXml(
                        statusText(
                          row.months[monthName],
                        ),
                      )}
                    </Data>
                  </Cell>
                `,
              )
              .join("")}
          </Row>
        `,
      )
      .join("");

    const summaryRow = `
      <Row>
        <Cell>
          <Data ss:Type="String">
            Fully Paid Members
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="Number">
            ${fullyPaidCount}
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="String">
            Pending Members
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="Number">
            ${pendingCount}
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="String">
            Verification Members
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="Number">
            ${verificationCount}
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="String">
            Paid Amount
          </Data>
        </Cell>

        <Cell>
          <Data ss:Type="String">
            ${escapeXml(formatINR(paidAmount))}
          </Data>
        </Cell>
      </Row>
    `;

    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>

<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
>
  <Styles>

    <Style ss:ID="Title">
      <Font ss:Bold="1" ss:Size="14"/>
      <Alignment ss:Horizontal="Center"/>
    </Style>

    <Style ss:ID="Header">
      <Font ss:Bold="1"/>
      <Alignment ss:Horizontal="Center"/>
      <Interior
        ss:Color="#E5E7EB"
        ss:Pattern="Solid"
      />
    </Style>

  </Styles>

  <Worksheet ss:Name="Maintenance ${escapeXml(year)}">

    <Table>

      ${titleRow}

      ${generatedRow}

      ${headerRow}

      ${dataRows}

      ${summaryRow}

    </Table>

  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `Maintenance_Report_${year}.xls`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent-foreground">
          Admin Portal
        </p>

        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">
          Maintenance
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Monitor monthly maintenance records and yearly payment
          status.
        </p>
      </section>

      {/* View tabs */}
      <div className="inline-flex rounded-xl border border-border bg-card p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setView("monthly")}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
            view === "monthly"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
          }`}
        >
          Monthly Records
        </button>

        <button
          type="button"
          onClick={() => setView("yearly")}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
            view === "yearly"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
          }`}
        >
          Yearly Report
        </button>
      </div>

      {/* Monthly records */}
      {view === "monthly" ? (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <p className="text-sm text-muted-foreground">
                Records shown
              </p>

              <p className="mt-2 font-heading text-3xl font-semibold text-primary">
                {rows.length}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Matching current filters
              </p>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Pending in view
              </p>

              <p className="mt-2 font-heading text-3xl font-semibold text-primary">
                {formatINR(
                  rows
                    .filter(
                      (record) =>
                        record.status === "pending" ||
                        record.status === "rejected",
                    )
                    .reduce(
                      (sum, record) => sum + record.amount,
                      0,
                    ),
                )}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Pending or rejected records
              </p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary p-5 text-primary-foreground shadow-sm">
              <p className="text-sm text-primary-foreground/70">
                Current filter
              </p>

              <p className="mt-2 font-heading text-2xl">
                {status === "all"
                  ? "All statuses"
                  : statusLabel[status]}
              </p>

              <p className="mt-1 text-xs text-primary-foreground/60">
                {month === "all" ? "All months" : month}
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="month-filter"
                  className="block text-sm font-medium text-foreground"
                >
                  Month
                </label>

                <select
                  id="month-filter"
                  className={selectClass}
                  value={month}
                  onChange={(e) =>
                    setMonth(e.target.value)
                  }
                >
                  <option value="all">
                    All months
                  </option>

                  {availableMonths.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-foreground"
                >
                  Status
                </label>

                <select
                  id="status-filter"
                  className={selectClass}
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "all"
                        | MaintenanceStatus,
                    )
                  }
                >
                  <option value="all">
                    All statuses
                  </option>

                  {(
                    [
                      "paid",
                      "pending",
                      "verification",
                      "rejected",
                    ] as MaintenanceStatus[]
                  ).map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {statusLabel[item]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Desktop table */}
          <Card className="hidden md:block">
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-secondary">
                    <tr className="border-b border-border">
                      <th className="px-5 py-3.5 font-medium text-primary">
                        Resident
                      </th>

                      <th className="px-5 py-3.5 font-medium text-primary">
                        Flat
                      </th>

                      <th className="px-5 py-3.5 font-medium text-primary">
                        Month
                      </th>

                      <th className="px-5 py-3.5 font-medium text-primary">
                        Amount
                      </th>

                      <th className="px-5 py-3.5 font-medium text-primary">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]"
                      >
                        <td className="px-5 py-4 font-medium text-foreground">
                          {record.resident}
                        </td>

                        <td className="px-5 py-4 text-foreground">
                          {record.flat}
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {record.month}
                        </td>

                        <td className="px-5 py-4 font-medium text-primary">
                          {formatINR(record.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <MaintenanceBadge
                            status={record.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rows.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="font-heading text-2xl text-primary">
                    No records found
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Try changing the month or status filter.
                  </p>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Mobile */}
          <div className="space-y-4 md:hidden">
            {rows.map((record) => (
              <Card key={record.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-2xl text-primary">
                      {record.month}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {record.resident} · {record.flat}
                    </p>
                  </div>

                  <MaintenanceBadge
                    status={record.status}
                  />
                </div>

                <div className="mt-5 border-t border-border pt-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Amount
                  </p>

                  <p className="mt-1 font-heading text-xl text-primary">
                    {formatINR(record.amount)}
                  </p>
                </div>
              </Card>
            ))}

            {rows.length === 0 ? (
              <Card className="text-center">
                <p className="font-heading text-2xl text-primary">
                  No records found
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Try changing the filters.
                </p>
              </Card>
            ) : null}
          </div>
        </>
      ) : (
        /* Yearly report */
        <>
          {/* Report header */}
          <Card className="overflow-hidden p-0">
            <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                    Annual Statement
                  </p>

                  <h2 className="mt-1 font-heading text-3xl sm:text-4xl">
                    Maintenance Report {year}
                  </h2>

                  <p className="mt-2 text-sm text-primary-foreground/70">
                    Month-wise payment status for registered society
                    members.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
                  <div className="w-full sm:w-32">
                    <label
                      htmlFor="report-year"
                      className="mb-2 block text-xs font-medium text-primary-foreground/70"
                    >
                      Year
                    </label>

                    <select
                      id="report-year"
                      value={year}
                      onChange={(e) =>
                        setYear(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-primary-foreground outline-none"
                    >
                      <option
                        value="2026"
                        className="text-foreground"
                      >
                        2026
                      </option>

                      <option
                        value="2027"
                        className="text-foreground"
                      >
                        2027
                      </option>

                      <option
                        value="2028"
                        className="text-foreground"
                      >
                        2028
                      </option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={downloadYearlyReport}
                    disabled={yearlyRows.length === 0}
                    className="h-11 rounded-lg bg-white px-4 text-sm font-medium text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Download Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid gap-px bg-border sm:grid-cols-4">
              <div className="bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Members in report
                </p>

                <p className="mt-2 font-heading text-3xl text-primary">
                  {yearlyRows.length}
                </p>
              </div>

              <div className="bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Fully paid
                </p>

                <p className="mt-2 font-heading text-3xl text-primary">
                  {fullyPaidCount}
                </p>
              </div>

              <div className="bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Pending
                </p>

                <p className="mt-2 font-heading text-3xl text-primary">
                  {pendingCount}
                </p>
              </div>

              <div className="bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Paid amount
                </p>

                <p className="mt-2 font-heading text-2xl text-primary">
                  {formatINR(paidAmount)}
                </p>
              </div>
            </div>
          </Card>

          {/* Legend */}
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <p className="mr-2 text-sm font-medium text-foreground">
                Status:
              </p>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                ✓ Paid
              </span>

              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground">
                ! Pending
              </span>

              <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                … Verification
              </span>

              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                ! Rejected
              </span>

              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                — No record
              </span>
            </div>
          </Card>

          {/* Yearly table */}
          <Card>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px] border-collapse text-center text-sm">
                  <thead className="bg-secondary">
                    <tr className="border-b border-border">
                      <th className="sticky left-0 z-10 bg-secondary px-4 py-3.5 text-left font-medium text-primary">
                        Name
                      </th>

                      <th className="sticky left-[220px] z-10 bg-secondary px-4 py-3.5 text-left font-medium text-primary">
                        Flat No.
                      </th>

                      {months.map((monthName) => (
                        <th
                          key={monthName}
                          className="px-3 py-3.5 font-medium text-primary"
                        >
                          {monthName.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {yearlyRows.map((row) => (
                      <tr
                        key={`${row.resident}-${row.flat}`}
                        className="border-b border-border/70 last:border-0 hover:bg-primary/[0.025]"
                      >
                        <td className="sticky left-0 z-[1] bg-card px-4 py-4 text-left font-medium text-foreground">
                          {row.resident}
                        </td>

                        <td className="sticky left-[220px] z-[1] bg-card px-4 py-4 text-left text-muted-foreground">
                          {row.flat}
                        </td>

                        {months.map((monthName) => {
                          const value: ReportStatus =
                            row.months[monthName];

                          return (
                            <td
                              key={monthName}
                              className="px-2 py-3"
                            >
                              <span
                                title={statusText(value)}
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${statusClass(
                                  value,
                                )}`}
                              >
                                {statusSymbol(value)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {yearlyRows.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="font-heading text-2xl text-primary">
                    No records available for {year}
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Yearly records will appear here once maintenance
                    data is available.
                  </p>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Verification note */}
          {verificationCount > 0 ? (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-5">
              <p className="font-medium text-primary">
                {verificationCount} member
                {verificationCount === 1 ? "" : "s"} has payment
                verification pending.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Review the payment verification queue before treating
                those months as paid.
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}