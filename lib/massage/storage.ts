import {
  AddOns,
  BookingListStruct,
  CustomerEntryStruct,
  Membership,
  MembershipTypesStruct,
  RedeemPointHistoryStruct,
  Services,
  Staff,
  StaffChangeLog,
  Transaction,
  Worker,
} from "@/types/massage";

export type MassageWorkspaceState = {
  services: Services[];
  transactions: Transaction[];
  workers: Worker[];
  addOns: AddOns[];
  staffList: Staff[];
  activeStaff: Staff | null;
  staffChangeLog: StaffChangeLog[];
  bookingList: BookingListStruct[];
  memberships: Membership[];
  membershipTypes: MembershipTypesStruct[];
  redeemHistory: RedeemPointHistoryStruct[];
  customerEntry: CustomerEntryStruct[];
};

export const emptyMassageWorkspaceState: MassageWorkspaceState = {
  services: [],
  transactions: [],
  workers: [],
  addOns: [],
  staffList: [],
  activeStaff: null,
  staffChangeLog: [],
  bookingList: [],
  memberships: [],
  membershipTypes: [],
  redeemHistory: [],
  customerEntry: [],
};

const storageKeys = {
  services: "services",
  transactions: "transactions",
  workers: "workers",
  addOns: "addOns",
  staffList: "staffList",
  activeStaff: "activeStaff",
  staffChangeLog: "staffChangeLog",
  bookingList: "bookingList",
  memberships: "memberships",
  membershipTypes: "membershipTypes",
  redeemHistory: "redeemHistory",
  customerEntry: "customerEntry",
} satisfies Record<keyof MassageWorkspaceState, string>;

function readJson<T>(storage: Storage, key: string, fallback: T): T {
  const value = storage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadMassageWorkspaceSnapshot(
  storage: Storage = window.localStorage
): MassageWorkspaceState {
  return {
    services: readJson(storage, storageKeys.services, []),
    transactions: readJson(storage, storageKeys.transactions, []),
    workers: readJson(storage, storageKeys.workers, []),
    addOns: readJson(storage, storageKeys.addOns, []),
    staffList: readJson(storage, storageKeys.staffList, []),
    activeStaff: readJson(storage, storageKeys.activeStaff, null),
    staffChangeLog: readJson(storage, storageKeys.staffChangeLog, []),
    bookingList: readJson(storage, storageKeys.bookingList, []),
    memberships: readJson(storage, storageKeys.memberships, []),
    membershipTypes: readJson(storage, storageKeys.membershipTypes, []),
    redeemHistory: readJson(storage, storageKeys.redeemHistory, []),
    customerEntry: readJson(storage, storageKeys.customerEntry, []),
  };
}

export function saveMassageWorkspaceSnapshot(
  state: MassageWorkspaceState,
  storage: Storage = window.localStorage
) {
  Object.entries(storageKeys).forEach(([stateKey, storageKey]) => {
    storage.setItem(
      storageKey,
      JSON.stringify(state[stateKey as keyof MassageWorkspaceState])
    );
  });
}
