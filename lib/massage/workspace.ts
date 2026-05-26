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
import type { MassageWorkspaceState } from "@/lib/massage/storage";

export type StartWorkerInput = {
  workerId: number;
  serviceId: number;
  startTime: string;
  serviceTimeMinutes: number;
  isBooked: boolean;
  selectedAddOnIds: number[];
  customerName?: string;
  customerPhone?: string;
  nationality?: string;
  identityNumber?: string;
};

export function nextNumericId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

export function resetWorkerAvailability(worker: Worker): Worker {
  return {
    ...worker,
    status: "Available",
    startTime: "",
    serviceTime: 0,
    endTime: "",
    availableSince: undefined,
    serviceId: undefined,
    serviceName: undefined,
    addOns: [],
  };
}

export function startWorkerShift(
  state: MassageWorkspaceState,
  input: StartWorkerInput,
  now = new Date()
) {
  const worker = state.workers.find((item) => item.id === input.workerId);
  const service = state.services.find((item) => item.id === input.serviceId);

  if (!worker || !service || !input.startTime || !input.serviceTimeMinutes) {
    return { state, workerName: undefined };
  }

  const [hours, minutes] = input.startTime.split(":").map(Number);
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );
  const end = new Date(start.getTime() + input.serviceTimeMinutes * 60000);
  const startTime = start.toLocaleTimeString("en-GB");
  const endTime = formatTime(end);
  const selectedAddOns = state.addOns.filter((addOn) =>
    input.selectedAddOnIds.includes(addOn.id)
  );
  const status: Worker["status"] = input.isBooked ? "Booked" : "Busy";
  const workerCommission = service.commission + sumAddOnCommission(selectedAddOns, "workerCommission");
  const staffCommission =
    (service.staffCommission || 0) + sumAddOnCommission(selectedAddOns, "staffCommission");
  const id = now.getTime();
  const transactionDate = now.toISOString();

  const transaction: Transaction = {
    id,
    workerId: worker.id,
    serviceId: service.id,
    startTime,
    serviceTime: input.serviceTimeMinutes,
    endTime,
    sales: service.price,
    commission: workerCommission,
    staffCommission,
    workerName: worker.name,
    serviceName: service.name,
    footTime: service.footTimeMin,
    bodyTime: service.bodyTimeMin,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    transactionDate,
    addOns: selectedAddOns,
    createdBy: state.activeStaff,
  };

  const booking: BookingListStruct = {
    id,
    workerId: worker.id,
    serviceId: service.id,
    startTime,
    serviceTime: input.serviceTimeMinutes,
    sales: service.price,
    commission: workerCommission,
    staffCommission,
    workerName: worker.name,
    serviceName: service.name,
    footTime: service.footTimeMin,
    bodyTime: service.bodyTimeMin,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    nationality: input.nationality,
    identityNumber: input.identityNumber,
    transactionDate,
    addOns: selectedAddOns,
    createdBy: state.activeStaff,
    status: "ACTIVE",
  };

  const customer: CustomerEntryStruct = {
    id,
    name: input.customerName || "",
    phone: input.customerPhone || "",
    nationality: input.nationality || "",
    identityNumber: input.identityNumber || "",
    timeIn: startTime,
    timeOut: endTime,
    createdAt: transactionDate,
  };

  return {
    state: {
      ...state,
      workers: state.workers.map((item) =>
        item.id === worker.id
          ? {
              ...item,
              startTime,
              serviceTime: input.serviceTimeMinutes,
              endTime,
              status,
              serviceId: service.id,
              serviceName: service.name,
              addOns: selectedAddOns,
            }
          : item
      ),
      bookingList: input.isBooked
        ? [...state.bookingList, booking]
        : state.bookingList,
      transactions: [...state.transactions, transaction],
      customerEntry: [...state.customerEntry, customer],
    },
    workerName: worker.name,
  };
}

export function finishWorkerShift(
  workers: Worker[],
  bookingList: BookingListStruct[],
  workerId: number
) {
  const worker = workers.find((item) => item.id === workerId);
  if (!worker) return { workers, bookingList, finishedWorkerName: undefined };

  const updatedWorker = resetWorkerAvailability(worker);
  const updatedWorkers =
    worker.status === "Busy"
      ? [...workers.filter((item) => item.id !== workerId), updatedWorker]
      : workers.map((item) => (item.id === workerId ? updatedWorker : item));

  return {
    workers: updatedWorkers,
    bookingList: bookingList.map((booking) =>
      booking.workerId === workerId && booking.status === "ACTIVE"
        ? { ...booking, status: "DONE" as BookingListStruct["status"] }
        : booking
    ),
    finishedWorkerName: worker.name,
  };
}

export function finishExpiredWorkerShifts(
  workers: Worker[],
  bookingList: BookingListStruct[],
  now = new Date()
) {
  const finishedIds: number[] = [];
  const finishedNames: string[] = [];

  const nextWorkers = workers
    .map((worker) => {
      if (
        (worker.status === "Busy" || worker.status === "Booked") &&
        worker.endTime &&
        now > parseEndTime(worker.endTime, now)
      ) {
        finishedIds.push(worker.id);
        finishedNames.push(worker.name);
        return {
          worker: resetWorkerAvailability(worker),
          moveToEnd: worker.status === "Busy",
        };
      }

      return { worker, moveToEnd: false };
    });

  return {
    workers: [
      ...nextWorkers.filter((item) => !item.moveToEnd).map((item) => item.worker),
      ...nextWorkers.filter((item) => item.moveToEnd).map((item) => item.worker),
    ],
    bookingList: bookingList.map((booking) =>
      finishedIds.includes(booking.workerId ?? 0) && booking.status === "ACTIVE"
        ? { ...booking, status: "DONE" as BookingListStruct["status"] }
        : booking
    ),
    finishedNames,
  };
}

export function createStaffChangeLogEntry(
  staffList: Staff[],
  activeStaff: Staff | null,
  selectedStaffId: number,
  now = new Date()
) {
  const selectedStaff = staffList.find((staff) => staff.id === selectedStaffId) || null;
  const logEntry: StaffChangeLog = {
    id: now.getTime(),
    staffId: selectedStaffId,
    changeFromId: activeStaff?.id || null,
    changeToId: selectedStaffId,
    changeDate: now.toISOString(),
  };

  return { selectedStaff, logEntry };
}

export function createRefundTransaction(
  transactions: Transaction[],
  selectedTransaction: Transaction,
  refundReason: string,
  activeStaff: Staff | null,
  now = new Date()
) {
  const refundDate = now.toISOString();
  const updatedOriginalTransaction = {
    ...selectedTransaction,
    isRefunded: true,
  };
  const refundTransaction: Transaction = {
    ...updatedOriginalTransaction,
    id: nextNumericId(transactions),
    transactionDate: refundDate,
    isRefundTransaction: true,
    refundAmount: selectedTransaction.sales,
    refundDate,
    refundReason,
    createdBy: activeStaff,
  };

  return [
    ...transactions.map((transaction) =>
      transaction.id === selectedTransaction.id
        ? updatedOriginalTransaction
        : transaction
    ),
    refundTransaction,
  ];
}

export function saveServiceRecord(services: Services[], service: Services) {
  return services.some((item) => item.id === service.id)
    ? services.map((item) => (item.id === service.id ? service : item))
    : [...services, service];
}

export function saveAddOnRecord(addOns: AddOns[], addOn: AddOns) {
  return addOns.some((item) => item.id === addOn.id)
    ? addOns.map((item) => (item.id === addOn.id ? addOn : item))
    : [...addOns, addOn];
}

export function saveMembershipRecord(
  memberships: Membership[],
  membership: Membership
) {
  return memberships.some((item) => item.id === membership.id)
    ? memberships.map((item) => (item.id === membership.id ? membership : item))
    : [...memberships, membership];
}

export function deleteMembershipRecord(memberships: Membership[], membershipId: number) {
  return memberships.filter((membership) => membership.id !== membershipId);
}

export function redeemMembershipPoints(
  memberships: Membership[],
  redeemHistory: RedeemPointHistoryStruct[],
  membership: Membership,
  points: number,
  now = new Date()
) {
  if (points <= 0 || points > membership.points) {
    return {
      memberships,
      redeemHistory,
      error: "Invalid points to redeem",
    };
  }

  const timestamp = now.toISOString();
  const updatedMembership: Membership = {
    ...membership,
    points: membership.points - points,
    updatedAt: timestamp,
  };
  const redeemEntry: RedeemPointHistoryStruct = {
    id: now.getTime(),
    membershipId: membership.id,
    points,
    redeemDate: timestamp,
    createdAt: timestamp,
  };

  return {
    memberships: saveMembershipRecord(memberships, updatedMembership),
    redeemHistory: [...redeemHistory, redeemEntry],
    error: undefined,
  };
}

export function saveMembershipTypeRecord(
  membershipTypes: MembershipTypesStruct[],
  membershipType: MembershipTypesStruct
) {
  return membershipTypes.some((item) => item.id === membershipType.id)
    ? membershipTypes.map((item) =>
        item.id === membershipType.id ? membershipType : item
      )
    : [...membershipTypes, membershipType];
}

export function deleteMembershipTypeRecord(
  membershipTypes: MembershipTypesStruct[],
  membershipTypeId: number
) {
  return membershipTypes.filter((membershipType) => membershipType.id !== membershipTypeId);
}

function parseEndTime(endTime: string, date: Date) {
  const [hours, minutes, seconds] = endTime.split(":").map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    seconds || 0
  );
}

function formatTime(date: Date) {
  const padZero = (num: number) => num.toString().padStart(2, "0");
  return `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
    date.getSeconds()
  )}`;
}

function sumAddOnCommission(
  addOns: AddOns[],
  key: "workerCommission" | "staffCommission"
) {
  return addOns.reduce((total, addOn) => total + (addOn[key] || 0), 0);
}
