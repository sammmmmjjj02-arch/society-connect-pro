import { useSyncExternalStore } from "react";
import {
  approveResidentMaintenance,
  formatINR,
  notices as seedNotices,
  rejectResidentMaintenance,
  resident,
  type MaintenanceRecord,
} from "@/lib/resident-store";

export { formatINR };

export const admin = {
  name: "Prakash V. Bhosale",
  role: "Secretary — Managing Committee",
  email: "secretary@saibhawanichs.in",
  phone: "+91 98201 77410",
  society: "Sai Bhawani CHS Ltd",
};

export type PaymentStatus = "Verification Pending" | "Approved" | "Rejected";

export type AdminPayment = {
  id: string;
  resident: string;
  flat: string;
  phone: string;
  months: string[];
  amount: number;
  utr: string;
  paymentDate?: string | undefined;
  submittedDate: string;
  status: PaymentStatus;
  rejectionReason?: string | undefined;
  approvedDate?: string | undefined;
  receiptNo?: string | undefined;
  screenshotName?: string | undefined;
  maintenanceId?: string | undefined;
};

export type AdminResident = {
  id: string;
  name: string;
  flat: string;
  building: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  memberSince: string;
};

export type MaintenanceRow = {
  id: string;
  resident: string;
  flat: string;
  month: string;
  amount: number;
  status: MaintenanceRecord["status"];
};

export type AdminComplaint = {
  id: string;
  resident: string;
  flat: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: "Open" | "In Progress" | "Resolved";
};

export type Notice = {
  id: string;
  title: string;
  date: string;
  important: boolean;
  summary: string;
  body: string;
};

export const residents: AdminResident[] = [
  { id: "R-01", name: resident.name, flat: resident.flat, building: "B", phone: resident.phone, email: resident.email, status: "Active", memberSince: resident.memberSince },
  { id: "R-02", name: "Meera Joshi", flat: "A-303", building: "A", phone: "+91 98330 77412", email: "meera.joshi@example.com", status: "Active", memberSince: "July 2018" },
  { id: "R-03", name: "Imran Shaikh", flat: "C-101", building: "C", phone: "+91 99201 33845", email: "imran.shaikh@example.com", status: "Active", memberSince: "January 2020" },
  { id: "R-04", name: "Sunita Deshmukh", flat: "A-1102", building: "A", phone: "+91 91678 22190", email: "sunita.deshmukh@example.com", status: "Active", memberSince: "May 2015" },
  { id: "R-05", name: "Anil Kulkarni", flat: "B-206", building: "B", phone: "+91 98191 55307", email: "anil.kulkarni@example.com", status: "Active", memberSince: "October 2012" },
  { id: "R-06", name: "Farida Merchant", flat: "C-802", building: "C", phone: "+91 99871 60422", email: "farida.merchant@example.com", status: "Inactive", memberSince: "February 2011" },
];

export const flats = [
  { number: "A-303", building: "Building A", resident: "Meera Joshi", maintenance: "Paid" },
  { number: "A-1102", building: "Building A", resident: "Sunita Deshmukh", maintenance: "Verification Pending" },
  { number: "B-206", building: "Building B", resident: "Anil Kulkarni", maintenance: "Pending" },
  { number: "B-704", building: "Building B", resident: resident.name, maintenance: "Pending" },
  { number: "C-101", building: "Building C", resident: "Imran Shaikh", maintenance: "Verification Pending" },
  { number: "C-802", building: "Building C", resident: "Farida Merchant", maintenance: "Pending" },
  { number: "C-903", building: "Building C", resident: "Vacant", maintenance: "Paid" },
];

const MONTHLY = 2500;

/* month-wise ledger for the other flats (Rajesh's own ledger comes from the resident store) */
const otherLedger: MaintenanceRow[] = [
  { id: "M-01", resident: "Meera Joshi", flat: "A-303", month: "June 2026", amount: MONTHLY, status: "paid" },
  { id: "M-02", resident: "Meera Joshi", flat: "A-303", month: "July 2026", amount: MONTHLY, status: "paid" },
  { id: "M-03", resident: "Sunita Deshmukh", flat: "A-1102", month: "June 2026", amount: MONTHLY, status: "paid" },
  { id: "M-04", resident: "Sunita Deshmukh", flat: "A-1102", month: "July 2026", amount: MONTHLY, status: "verification" },
  { id: "M-05", resident: "Anil Kulkarni", flat: "B-206", month: "June 2026", amount: MONTHLY, status: "pending" },
  { id: "M-06", resident: "Anil Kulkarni", flat: "B-206", month: "July 2026", amount: MONTHLY, status: "pending" },
  { id: "M-07", resident: "Imran Shaikh", flat: "C-101", month: "June 2026", amount: MONTHLY, status: "paid" },
  { id: "M-08", resident: "Imran Shaikh", flat: "C-101", month: "July 2026", amount: MONTHLY, status: "verification" },
  { id: "M-09", resident: "Farida Merchant", flat: "C-802", month: "May 2026", amount: MONTHLY, status: "rejected" },
  { id: "M-10", resident: "Farida Merchant", flat: "C-802", month: "June 2026", amount: MONTHLY, status: "pending" },
];

const initialPayments: AdminPayment[] = [
  {
    id: "PAY-3051",
    resident: "Sunita Deshmukh",
    flat: "A-1102",
    phone: "+91 91678 22190",
    months: ["July 2026"],
    amount: MONTHLY,
    utr: "UTR904551238",
    paymentDate: "10 Aug 2026",
    submittedDate: "12 Aug 2026",
    status: "Verification Pending",
    screenshotName: "upi-payment-jul.jpg",
  },
  {
    id: "PAY-3050",
    resident: "Imran Shaikh",
    flat: "C-101",
    phone: "+91 99201 33845",
    months: ["July 2026"],
    amount: MONTHLY,
    utr: "UTR904488120",
    paymentDate: "08 Aug 2026",
    submittedDate: "09 Aug 2026",
    status: "Verification Pending",
    screenshotName: "payment-screenshot.png",
  },
  {
    id: "PAY-3049",
    resident: "Meera Joshi",
    flat: "A-303",
    phone: "+91 98330 77412",
    months: ["June 2026", "July 2026"],
    amount: MONTHLY * 2,
    utr: "UTR904102993",
    paymentDate: "02 Aug 2026",
    submittedDate: "02 Aug 2026",
    status: "Approved",
    approvedDate: "03 Aug 2026",
    receiptNo: "SB/2026/0049",
    screenshotName: "june-july-upi.jpg",
  },
  {
    id: "PAY-3048",
    resident: "Farida Merchant",
    flat: "C-802",
    phone: "+91 99871 60422",
    months: ["May 2026"],
    amount: MONTHLY,
    utr: "UTR903990117",
    paymentDate: "21 Jul 2026",
    submittedDate: "22 Jul 2026",
    status: "Rejected",
    rejectionReason: "Amount mismatch — ₹1,500 received against a due of ₹2,500.",
    screenshotName: "gpay-may.png",
  },
];

const initialComplaints: AdminComplaint[] = [
  { id: "AC-1042", resident: resident.name, flat: "B-704", title: "Lift making noise in B wing", category: "Lift", description: "The B wing lift makes a loud grinding noise between the 5th and 7th floor.", date: "02 Aug 2026", status: "In Progress" },
  { id: "AC-1041", resident: "Meera Joshi", flat: "A-303", title: "Seepage on bedroom ceiling", category: "Plumbing", description: "Seepage on the bedroom ceiling from the flat above during heavy rain.", date: "30 Jul 2026", status: "Open" },
  { id: "AC-1040", resident: "Anil Kulkarni", flat: "B-206", title: "Intercom not connecting to gate", category: "Security", description: "Intercom handset does not connect to the main gate since Monday.", date: "27 Jul 2026", status: "Open" },
  { id: "AC-1039", resident: resident.name, flat: "B-704", title: "Water leakage in parking area", category: "Plumbing", description: "Continuous water leakage near parking slot B-22 since last week.", date: "24 Jul 2026", status: "Open" },
  { id: "AC-1038", resident: "Imran Shaikh", flat: "C-101", title: "Garbage not collected on time", category: "Housekeeping", description: "Wet waste from C wing was not collected for two consecutive days.", date: "19 Jul 2026", status: "Resolved" },
  { id: "AC-1037", resident: "Sunita Deshmukh", flat: "A-1102", title: "Corridor light not working", category: "Electrical", description: "11th floor corridor light has been off for four days.", date: "11 Jul 2026", status: "Resolved" },
];

export const activity = [
  { id: "AA-6", text: "Payment PAY-3049 approved for Flat A-303 (June & July 2026)", time: "03 Aug 2026, 11:20 AM" },
  { id: "AA-5", text: "Notice “Annual General Meeting — 30 August 2026” published", time: "12 Aug 2026, 09:05 AM" },
  { id: "AA-4", text: "Payment PAY-3051 submitted by Flat A-1102", time: "12 Aug 2026, 08:12 AM" },
  { id: "AA-3", text: "Complaint AC-1042 moved to In Progress", time: "05 Aug 2026, 04:40 PM" },
  { id: "AA-2", text: "Payment PAY-3048 rejected for Flat C-802 (amount mismatch)", time: "23 Jul 2026, 10:15 AM" },
  { id: "AA-1", text: "Vehicle MH 12 XY 7788 registered for Flat B-206", time: "18 Jul 2026, 06:30 PM" },
];

/* ---------- reactive store ---------- */
type State = {
  payments: AdminPayment[];
  complaints: AdminComplaint[];
  notices: Notice[];
  ledger: MaintenanceRow[];
};

let state: State = {
  payments: initialPayments,
  complaints: initialComplaints,
  notices: seedNotices.map((n) => ({ ...n })),
  ledger: otherLedger,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAdminState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

let receiptSeq = 50;

export function nextReceiptNo() {
  return `SB/2026/${String(receiptSeq++).padStart(4, "0")}`;
}

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function approvePayment(payment: AdminPayment) {
  const receiptNo = nextReceiptNo();
  const today = todayLabel();
  if (payment.maintenanceId) {
    approveResidentMaintenance(payment.maintenanceId, receiptNo);
    return;
  }
  state = {
    ...state,
    payments: state.payments.map((p) =>
      p.id === payment.id
        ? { ...p, status: "Approved", approvedDate: today, receiptNo, rejectionReason: undefined }
        : p,
    ),
    ledger: state.ledger.map((row) =>
      row.flat === payment.flat && payment.months.includes(row.month) ? { ...row, status: "paid" } : row,
    ),
  };
  emit();
}

export function rejectPayment(payment: AdminPayment, reason: string) {
  if (payment.maintenanceId) {
    rejectResidentMaintenance(payment.maintenanceId, reason);
    return;
  }
  state = {
    ...state,
    payments: state.payments.map((p) =>
      p.id === payment.id ? { ...p, status: "Rejected", rejectionReason: reason } : p,
    ),
    ledger: state.ledger.map((row) =>
      row.flat === payment.flat && payment.months.includes(row.month) ? { ...row, status: "rejected" } : row,
    ),
  };
  emit();
}

export function setAdminComplaintStatus(id: string, status: AdminComplaint["status"]) {
  state = {
    ...state,
    complaints: state.complaints.map((c) => (c.id === id ? { ...c, status } : c)),
  };
  emit();
}

let noticeSeq = 22;

export function addNotice(input: { title: string; summary: string; body: string; important: boolean }) {
  const notice: Notice = { id: `N-${noticeSeq++}`, date: todayLabel(), ...input };
  state = { ...state, notices: [notice, ...state.notices] };
  emit();
}

export function updateNotice(id: string, input: { title: string; summary: string; body: string; important: boolean }) {
  state = { ...state, notices: state.notices.map((n) => (n.id === id ? { ...n, ...input } : n)) };
  emit();
}

export function deleteNotice(id: string) {
  state = { ...state, notices: state.notices.filter((n) => n.id !== id) };
  emit();
}

export function useNotices() {
  return useAdminState().notices;
}

/* ---------- derive resident (B-704) submissions into the admin payment queue ---------- */
export function residentPayments(records: MaintenanceRecord[]): AdminPayment[] {
  return records
    .filter((m) => m.utr && (m.status === "verification" || m.status === "rejected" || m.status === "paid"))
    .map((m) => ({
      id: `PAY-R${m.id.replace("-", "")}`,
      resident: resident.name,
      flat: resident.flat,
      phone: resident.phone,
      months: [m.month],
      amount: m.amount,
      utr: m.utr as string,
      paymentDate: m.submittedDate,
      submittedDate: m.submittedDate ?? "",
      status:
        m.status === "paid" ? "Approved" : m.status === "rejected" ? "Rejected" : "Verification Pending",
      rejectionReason: m.rejectionReason,
      approvedDate: m.approvedDate ?? m.paidDate,
      receiptNo: m.receiptNo,
      screenshotName: m.screenshotName ?? "payment-screenshot.jpg",
      maintenanceId: m.id,
    }))
    .reverse();
}

export function residentLedger(records: MaintenanceRecord[]): MaintenanceRow[] {
  return records.map((m) => ({
    id: `MR-${m.id}`,
    resident: resident.name,
    flat: resident.flat,
    month: m.month,
    amount: m.amount,
    status: m.status,
  }));
}
