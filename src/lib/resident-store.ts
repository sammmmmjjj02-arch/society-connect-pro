import { useSyncExternalStore } from "react";

export type MaintenanceStatus = "paid" | "pending" | "verification" | "rejected";

export type MaintenanceRecord = {
  id: string;
  month: string;
  amount: number;
  status: MaintenanceStatus;
  utr?: string;
  submittedDate?: string;
  paidDate?: string;
  screenshotName?: string;
  rejectionReason?: string;
};

export type Complaint = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: "Open" | "In Progress" | "Resolved";
};

export const resident = {
  name: "Rajesh S. Patil",
  flat: "B-704",
  building: "Building B",
  phone: "+91 98200 41235",
  email: "rajesh.patil@example.com",
  memberSince: "March 2016",
};

const initialMaintenance: MaintenanceRecord[] = [
  { id: "2025-12", month: "December 2025", amount: 2500, status: "paid", utr: "UTR902113445", submittedDate: "05 Dec 2025", paidDate: "07 Dec 2025" },
  { id: "2026-01", month: "January 2026", amount: 2500, status: "paid", utr: "UTR902556781", submittedDate: "04 Jan 2026", paidDate: "06 Jan 2026" },
  { id: "2026-02", month: "February 2026", amount: 2500, status: "paid", utr: "UTR903117290", submittedDate: "06 Feb 2026", paidDate: "08 Feb 2026" },
  { id: "2026-03", month: "March 2026", amount: 2500, status: "rejected", utr: "UTR903882014", submittedDate: "09 Mar 2026", rejectionReason: "Transaction number did not match the society bank statement. Please re-submit with the correct UTR." },
  { id: "2026-04", month: "April 2026", amount: 2500, status: "pending" },
  { id: "2026-05", month: "May 2026", amount: 2500, status: "pending" },
  { id: "2026-06", month: "June 2026", amount: 2500, status: "pending" },
  { id: "2026-07", month: "July 2026", amount: 2500, status: "pending" },
];

const initialComplaints: Complaint[] = [
  { id: "C-1042", title: "Lift making noise in B wing", category: "Lift", description: "The B wing lift makes a loud grinding noise between the 5th and 7th floor.", date: "02 Aug 2026", status: "In Progress" },
  { id: "C-1036", title: "Water leakage in parking area", category: "Plumbing", description: "Continuous water leakage near parking slot B-22 since last week.", date: "24 Jul 2026", status: "Open" },
  { id: "C-1021", title: "Corridor light not working", category: "Electrical", description: "7th floor corridor tube light has not been working for four days.", date: "11 Jul 2026", status: "Resolved" },
];

export const notices = [
  {
    id: "N-21",
    title: "Annual General Meeting — 30 August 2026",
    date: "12 Aug 2026",
    important: true,
    summary: "All members are requested to attend the AGM in the society clubhouse at 6:00 PM.",
    body: "The Annual General Meeting of Sai Bhawani CHS Ltd will be held on Sunday, 30 August 2026 at 6:00 PM in the society clubhouse.\n\nAgenda:\n1. Approval of the previous meeting minutes\n2. Audited accounts for FY 2025-26\n3. Revision of monthly maintenance charges\n4. Lift modernisation proposal for B wing\n5. Any other matter with the permission of the chair\n\nMembers are requested to be seated by 5:45 PM. Please carry a valid society ID.",
  },
  {
    id: "N-20",
    title: "Water tank cleaning on 21 August",
    date: "08 Aug 2026",
    important: false,
    summary: "Water supply will remain closed from 10:00 AM to 3:00 PM for overhead tank cleaning.",
    body: "The overhead and underground water tanks will be cleaned on Friday, 21 August 2026.\n\nWater supply will remain closed from 10:00 AM to 3:00 PM. Residents are requested to store sufficient water in advance. Normal supply will resume by 4:00 PM the same day.",
  },
  {
    id: "N-19",
    title: "Maintenance dues for the quarter",
    date: "01 Aug 2026",
    important: true,
    summary: "Members with pending dues are requested to clear them at the earliest, oldest month first.",
    body: "Members are requested to clear all pending maintenance dues at the earliest. Payments must be made in order, starting from the oldest pending month.\n\nAfter submitting a payment, please allow up to 48 hours for the committee to verify the transaction. A receipt will be available once the payment is approved.",
  },
  {
    id: "N-18",
    title: "Visitor parking guidelines",
    date: "18 Jul 2026",
    important: false,
    summary: "Visitor vehicles must be parked only in the marked visitor bays near the main gate.",
    body: "To ease congestion in the compound, visitor vehicles must be parked only in the marked visitor bays near the main gate. Residents are requested to inform their guests in advance and share the vehicle number with the watchman at entry.",
  },
];

export const vehicles = [
  { number: "MH 01 AB 1234", owner: "Rajesh S. Patil", flat: "B-704", phone: "+91 98200 41235" },
  { number: "MH 02 CD 5678", owner: "Meera Joshi", flat: "A-303", phone: "+91 98330 77412" },
  { number: "MH 03 EF 9012", owner: "Imran Shaikh", flat: "C-101", phone: "+91 99201 33845" },
  { number: "MH 04 GH 3456", owner: "Sunita Deshmukh", flat: "A-1102", phone: "+91 91678 22190" },
  { number: "MH 12 XY 7788", owner: "Anil Kulkarni", flat: "B-206", phone: "+91 98191 55307" },
];

/* ---------- tiny reactive store (mock data only) ---------- */
type State = { maintenance: MaintenanceRecord[]; complaints: Complaint[] };

let state: State = { maintenance: initialMaintenance, complaints: initialComplaints };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useResidentState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

export function submitPayment(id: string, utr: string, screenshotName?: string) {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  state = {
    ...state,
    maintenance: state.maintenance.map((m) =>
      m.id === id
        ? { ...m, status: "verification", utr, screenshotName, submittedDate: today, rejectionReason: undefined }
        : m,
    ),
  };
  emit();
}

export function addComplaint(input: { title: string; category: string; description: string }) {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  state = {
    ...state,
    complaints: [
      { id: `C-${1043 + state.complaints.length}`, ...input, date: today, status: "Open" },
      ...state.complaints,
    ],
  };
  emit();
}

/* ---------- derived helpers ---------- */
export function isUnpaid(m: MaintenanceRecord) {
  return m.status === "pending" || m.status === "rejected";
}

export function nextPayableMonth(records: MaintenanceRecord[]) {
  return records.find(isUnpaid);
}

export function totalPendingDues(records: MaintenanceRecord[]) {
  return records.filter(isUnpaid).reduce((sum, m) => sum + m.amount, 0);
}

export function lastPayment(records: MaintenanceRecord[]) {
  return [...records].reverse().find((m) => m.status === "paid");
}

export const statusLabel: Record<MaintenanceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  verification: "Verification Pending",
  rejected: "Rejected",
};

export function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
