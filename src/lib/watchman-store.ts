import { useSyncExternalStore } from "react";

export type ParcelStatus = "Received" | "Collected";

export type Parcel = {
  id: string;
  tracking: string;
  resident: string;
  flat: string;
  company: string;
  receivedAt: string;
  collectedAt?: string | undefined;
  status: ParcelStatus;
};

export type Activity = { id: string; text: string; time: string };

export const watchman = {
  name: "Ramesh Yadav",
  phone: "+91 98765 43210",
  society: "Sai Bhawani CHS Ltd",
  role: "Watchman — Main Gate",
  shift: "Morning shift · 7:00 AM – 7:00 PM",
};

export function formatDateTime(d: Date) {
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const today = new Date();
const at = (h: number, m: number) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return formatDateTime(d);
};

const initialParcels: Parcel[] = [
  { id: "P-1007", tracking: "AWB458912337", resident: "Rajesh S. Patil", flat: "B-704", company: "Blue Dart", receivedAt: at(9, 20), status: "Received" },
  { id: "P-1006", tracking: "AMZ773310928", resident: "Meera Joshi", flat: "A-303", company: "Amazon", receivedAt: at(10, 5), status: "Received" },
  { id: "P-1005", tracking: "FLP220981774", resident: "Imran Shaikh", flat: "C-101", company: "Flipkart", receivedAt: at(11, 40), status: "Collected", collectedAt: at(13, 15) },
  { id: "P-1004", tracking: "DTDC90114562", resident: "Sunita Deshmukh", flat: "A-1102", company: "DTDC", receivedAt: at(8, 10), status: "Collected", collectedAt: at(9, 5) },
  { id: "P-1003", tracking: "DLV556677881", resident: "Anil Kulkarni", flat: "B-206", company: "Delhivery", receivedAt: at(12, 25), status: "Received" },
];

const initialActivity: Activity[] = [
  { id: "A-5", text: "Parcel AWB458912337 received for Flat B-704", time: at(9, 20) },
  { id: "A-4", text: "Parcel FLP220981774 collected by Flat C-101", time: at(13, 15) },
  { id: "A-3", text: "Vehicle MH 01 AB 1234 searched at the main gate", time: at(12, 50) },
  { id: "A-2", text: "Parcel DLV556677881 received for Flat B-206", time: at(12, 25) },
  { id: "A-1", text: "Parcel DTDC90114562 collected by Flat A-1102", time: at(9, 5) },
];

type State = { parcels: Parcel[]; activity: Activity[] };

let state: State = { parcels: initialParcels, activity: initialActivity };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useWatchmanState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

let seq = 1008;
let actSeq = 6;

function logActivity(text: string) {
  return { id: `A-${actSeq++}`, text, time: formatDateTime(new Date()) };
}

export function addParcel(input: {
  tracking: string;
  resident: string;
  flat: string;
  company: string;
  receivedAt: string;
}) {
  const parcel: Parcel = { id: `P-${seq++}`, ...input, status: "Received" };
  state = {
    parcels: [parcel, ...state.parcels],
    activity: [logActivity(`Parcel ${input.tracking} received for Flat ${input.flat}`), ...state.activity],
  };
  emit();
}

export function markCollected(id: string) {
  const now = formatDateTime(new Date());
  const parcel = state.parcels.find((p) => p.id === id);
  state = {
    parcels: state.parcels.map((p) => (p.id === id ? { ...p, status: "Collected", collectedAt: now } : p)),
    activity: parcel
      ? [logActivity(`Parcel ${parcel.tracking} collected by Flat ${parcel.flat}`), ...state.activity]
      : state.activity,
  };
  emit();
}

export function logVehicleSearch(number: string) {
  state = { ...state, activity: [logActivity(`Vehicle ${number} searched at the main gate`), ...state.activity] };
  emit();
}

export function isToday(receivedAt: string) {
  return receivedAt.startsWith(
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  );
}

export function toInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
