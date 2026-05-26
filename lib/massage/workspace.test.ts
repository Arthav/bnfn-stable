import { describe, expect, it } from "vitest";
import { emptyMassageWorkspaceState } from "@/lib/massage/storage";
import {
  createRefundTransaction,
  createStaffChangeLogEntry,
  finishExpiredWorkerShifts,
  finishWorkerShift,
  redeemMembershipPoints,
  startWorkerShift,
} from "@/lib/massage/workspace";
import type {
  AddOns,
  BookingListStruct,
  Membership,
  Services,
  Staff,
  Transaction,
  Worker,
} from "@/types/massage";

const staff: Staff = {
  id: 1,
  name: "Reception",
  createdAt: "2026-05-26T00:00:00.000Z",
  updatedAt: "2026-05-26T00:00:00.000Z",
};

const service: Services = {
  id: 10,
  name: "Deep Tissue",
  description: "Massage",
  price: 100,
  status: "Active",
  serviceTimeMin: 60,
  footTimeMin: 20,
  bodyTimeMin: 40,
  commission: 15,
  staffCommission: 5,
  createdBy: staff,
};

const addOn: AddOns = {
  id: 20,
  name: "Hot Stone",
  price: 25,
  status: "Active",
  createdBy: staff,
  staffCommission: 2,
  workerCommission: 3,
};

const worker: Worker = {
  id: 30,
  name: "Maya",
  startTime: "",
  serviceTime: 0,
  endTime: "",
  status: "Available",
};

describe("massage workspace Module", () => {
  it("starts a worker and creates transaction, customer, and booking records", () => {
    const now = new Date(2026, 4, 26, 8, 0, 0);
    const result = startWorkerShift(
      {
        ...emptyMassageWorkspaceState,
        activeStaff: staff,
        services: [service],
        addOns: [addOn],
        workers: [worker],
      },
      {
        workerId: worker.id,
        serviceId: service.id,
        startTime: "10:00",
        serviceTimeMinutes: 90,
        isBooked: true,
        selectedAddOnIds: [addOn.id],
        customerName: "Chris",
        customerPhone: "123",
        nationality: "ID",
        identityNumber: "ABC",
      },
      now
    );

    expect(result.workerName).toBe("Maya");
    expect(result.state.workers[0]).toMatchObject({
      status: "Booked",
      serviceId: service.id,
      serviceName: service.name,
      addOns: [addOn],
    });
    expect(result.state.transactions[0]).toMatchObject({
      sales: 100,
      commission: 18,
      staffCommission: 7,
      customerName: "Chris",
    });
    expect(result.state.bookingList[0]).toMatchObject({
      status: "ACTIVE",
      workerName: "Maya",
      commission: 18,
    });
    expect(result.state.customerEntry[0]).toMatchObject({
      name: "Chris",
      phone: "123",
      identityNumber: "ABC",
    });
  });

  it("finishes active worker bookings and moves busy workers to the end", () => {
    const busyWorker = { ...worker, status: "Busy" as const };
    const otherWorker = { ...worker, id: 31, name: "Nina" };
    const booking = activeBooking({ workerId: worker.id });

    const result = finishWorkerShift([busyWorker, otherWorker], [booking], worker.id);

    expect(result.finishedWorkerName).toBe("Maya");
    expect(result.workers.map((item) => item.id)).toEqual([31, 30]);
    expect(result.bookingList[0].status).toBe("DONE");
  });

  it("finishes expired shifts based on worker end time", () => {
    const result = finishExpiredWorkerShifts(
      [{ ...worker, status: "Busy", endTime: "09:00:00" }],
      [activeBooking({ workerId: worker.id })],
      new Date(2026, 4, 26, 10, 0, 0)
    );

    expect(result.finishedNames).toEqual(["Maya"]);
    expect(result.workers[0].status).toBe("Available");
    expect(result.bookingList[0].status).toBe("DONE");
  });

  it("marks original transactions and appends refund transactions", () => {
    const transaction: Transaction = {
      id: 1,
      workerId: worker.id,
      serviceId: service.id,
      startTime: "10:00:00",
      serviceTime: 60,
      endTime: "11:00:00",
      sales: 100,
      commission: 15,
      staffCommission: 5,
      workerName: worker.name,
      serviceName: service.name,
      footTime: 20,
      bodyTime: 40,
      transactionDate: "2026-05-26T00:00:00.000Z",
      createdBy: staff,
    };

    const result = createRefundTransaction(
      [transaction],
      transaction,
      "Customer request",
      staff,
      new Date("2026-05-26T12:00:00.000Z")
    );

    expect(result[0].isRefunded).toBe(true);
    expect(result[1]).toMatchObject({
      id: 2,
      isRefundTransaction: true,
      refundAmount: 100,
      refundReason: "Customer request",
      createdBy: staff,
    });
  });

  it("logs active staff changes and redeems membership points", () => {
    const secondStaff = { ...staff, id: 2, name: "Front Desk" };
    const log = createStaffChangeLogEntry(
      [staff, secondStaff],
      staff,
      secondStaff.id,
      new Date("2026-05-26T10:00:00.000Z")
    );
    const membership: Membership = {
      id: 5,
      firstName: "Chris",
      lastName: "B",
      email: "chris@example.com",
      phoneNumber: "123",
      nationality: "ID",
      identityNumber: "ABC",
      membershipTypeId: 1,
      membershipStartDate: "2026-05-26",
      isActive: true,
      points: 30,
      createdAt: "2026-05-26T00:00:00.000Z",
    };
    const redeem = redeemMembershipPoints(
      [membership],
      [],
      membership,
      10,
      new Date("2026-05-26T10:00:00.000Z")
    );

    expect(log).toMatchObject({
      selectedStaff: secondStaff,
      logEntry: {
        staffId: 2,
        changeFromId: 1,
        changeToId: 2,
      },
    });
    expect(redeem.memberships[0].points).toBe(20);
    expect(redeem.redeemHistory[0]).toMatchObject({
      membershipId: 5,
      points: 10,
    });
  });
});

function activeBooking(overrides: Partial<BookingListStruct> = {}): BookingListStruct {
  return {
    id: 1,
    workerId: worker.id,
    serviceId: service.id,
    startTime: "10:00:00",
    serviceTime: 60,
    sales: 100,
    commission: 15,
    staffCommission: 5,
    workerName: worker.name,
    serviceName: service.name,
    footTime: 20,
    bodyTime: 40,
    transactionDate: "2026-05-26T00:00:00.000Z",
    createdBy: staff,
    status: "ACTIVE",
    ...overrides,
  };
}
