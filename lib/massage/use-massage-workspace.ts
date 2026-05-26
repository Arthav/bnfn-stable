"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  emptyMassageWorkspaceState,
  loadMassageWorkspaceSnapshot,
  MassageWorkspaceState,
  saveMassageWorkspaceSnapshot,
} from "@/lib/massage/storage";
import {
  createRefundTransaction,
  createStaffChangeLogEntry,
  deleteMembershipRecord,
  deleteMembershipTypeRecord,
  finishExpiredWorkerShifts,
  finishWorkerShift,
  redeemMembershipPoints,
  saveAddOnRecord,
  saveMembershipRecord,
  saveMembershipTypeRecord,
  saveServiceRecord,
  startWorkerShift,
} from "@/lib/massage/workspace";
import type { StartWorkerInput } from "@/lib/massage/workspace";

export type MassageWorkspaceActions = {
  startWorker: (input: StartWorkerInput) => string | undefined;
  finishWorker: (workerId: number) => string | undefined;
  refreshExpiredWorkers: () => string[];
  changeActiveStaff: (staffId: number) => void;
  addBooking: (booking: BookingListStruct) => void;
  finishAppointment: (bookingId: number) => void;
  refundTransaction: (transaction: Transaction, reason: string) => void;
  saveService: (service: Services) => void;
  saveAddOn: (addOn: AddOns) => void;
  saveMembership: (membership: Membership) => void;
  deleteMembership: (membershipId: number) => void;
  redeemMembershipPoints: (membership: Membership, points: number) => string | undefined;
  saveMembershipType: (membershipType: MembershipTypesStruct) => void;
  deleteMembershipType: (membershipTypeId: number) => void;
};

export function useMassageWorkspace() {
  const [state, setState] = useState<MassageWorkspaceState>(emptyMassageWorkspaceState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setState(loadMassageWorkspaceSnapshot());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveMassageWorkspaceSnapshot(state);
  }, [isLoaded, state]);

  const setServices = useStateSetter<Services[]>(setState, "services");
  const setTransactions = useStateSetter<Transaction[]>(setState, "transactions");
  const setWorkers = useStateSetter<Worker[]>(setState, "workers");
  const setAddOns = useStateSetter<AddOns[]>(setState, "addOns");
  const setStaffList = useStateSetter<Staff[]>(setState, "staffList");
  const setActiveStaff = useStateSetter<Staff | null>(setState, "activeStaff");
  const setStaffChangeLog = useStateSetter<StaffChangeLog[]>(setState, "staffChangeLog");
  const setBookingList = useStateSetter<BookingListStruct[]>(setState, "bookingList");
  const setMemberships = useStateSetter<Membership[]>(setState, "memberships");
  const setMembershipTypes = useStateSetter<MembershipTypesStruct[]>(setState, "membershipTypes");
  const setRedeemHistory = useStateSetter<RedeemPointHistoryStruct[]>(setState, "redeemHistory");
  const setCustomerEntry = useStateSetter<CustomerEntryStruct[]>(setState, "customerEntry");

  const startWorker = useCallback((input: StartWorkerInput) => {
    let workerName: string | undefined;
    setState((current) => {
      const result = startWorkerShift(current, input);
      workerName = result.workerName;
      return result.state;
    });
    return workerName;
  }, []);

  const finishWorker = useCallback((workerId: number) => {
    let finishedWorkerName: string | undefined;
    setState((current) => {
      const result = finishWorkerShift(current.workers, current.bookingList, workerId);
      finishedWorkerName = result.finishedWorkerName;
      return {
        ...current,
        workers: result.workers,
        bookingList: result.bookingList,
      };
    });
    return finishedWorkerName;
  }, []);

  const refreshExpiredWorkers = useCallback(() => {
    let finishedNames: string[] = [];
    setState((current) => {
      const result = finishExpiredWorkerShifts(current.workers, current.bookingList);
      finishedNames = result.finishedNames;
      return {
        ...current,
        workers: result.workers,
        bookingList: result.bookingList,
      };
    });
    return finishedNames;
  }, []);

  const changeActiveStaff = useCallback((staffId: number) => {
    setState((current) => {
      const { selectedStaff, logEntry } = createStaffChangeLogEntry(
        current.staffList,
        current.activeStaff,
        staffId
      );

      return {
        ...current,
        activeStaff: selectedStaff,
        staffChangeLog: [...current.staffChangeLog, logEntry],
      };
    });
  }, []);

  const addBooking = useCallback((booking: BookingListStruct) => {
    setBookingList((current) => [...current, booking]);
  }, [setBookingList]);

  const finishAppointment = useCallback((bookingId: number) => {
    setBookingList((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "APPOINTMENT DONE" }
          : booking
      )
    );
  }, [setBookingList]);

  const refundTransaction = useCallback((transaction: Transaction, reason: string) => {
    setTransactions((current) =>
      createRefundTransaction(current, transaction, reason, state.activeStaff)
    );
  }, [setTransactions, state.activeStaff]);

  const saveService = useCallback((service: Services) => {
    setServices((current) => saveServiceRecord(current, service));
  }, [setServices]);

  const saveAddOn = useCallback((addOn: AddOns) => {
    setAddOns((current) => saveAddOnRecord(current, addOn));
  }, [setAddOns]);

  const saveMembership = useCallback((membership: Membership) => {
    setMemberships((current) => saveMembershipRecord(current, membership));
  }, [setMemberships]);

  const deleteMembership = useCallback((membershipId: number) => {
    setMemberships((current) => deleteMembershipRecord(current, membershipId));
  }, [setMemberships]);

  const redeemPoints = useCallback((membership: Membership, points: number) => {
    let error: string | undefined;
    setState((current) => {
      const result = redeemMembershipPoints(
        current.memberships,
        current.redeemHistory,
        membership,
        points
      );
      error = result.error;
      return {
        ...current,
        memberships: result.memberships,
        redeemHistory: result.redeemHistory,
      };
    });
    return error;
  }, []);

  const saveMembershipType = useCallback((membershipType: MembershipTypesStruct) => {
    setMembershipTypes((current) =>
      saveMembershipTypeRecord(current, membershipType)
    );
  }, [setMembershipTypes]);

  const deleteMembershipType = useCallback((membershipTypeId: number) => {
    setMembershipTypes((current) =>
      deleteMembershipTypeRecord(current, membershipTypeId)
    );
  }, [setMembershipTypes]);

  const actions = useMemo(
    () =>
      ({
        startWorker,
        finishWorker,
        refreshExpiredWorkers,
        changeActiveStaff,
        addBooking,
        finishAppointment,
        refundTransaction,
        saveService,
        saveAddOn,
        saveMembership,
        deleteMembership,
        redeemMembershipPoints: redeemPoints,
        saveMembershipType,
        deleteMembershipType,
      }) satisfies MassageWorkspaceActions,
    [
      startWorker,
      finishWorker,
      refreshExpiredWorkers,
      changeActiveStaff,
      addBooking,
      finishAppointment,
      refundTransaction,
      saveService,
      saveAddOn,
      saveMembership,
      deleteMembership,
      redeemPoints,
      saveMembershipType,
      deleteMembershipType,
    ]
  );

  return {
    ...state,
    setServices,
    setTransactions,
    setWorkers,
    setAddOns,
    setStaffList,
    setActiveStaff,
    setStaffChangeLog,
    setBookingList,
    setMemberships,
    setMembershipTypes,
    setRedeemHistory,
    setCustomerEntry,
    actions,
  };
}

function useStateSetter<T>(
  setState: React.Dispatch<React.SetStateAction<MassageWorkspaceState>>,
  key: keyof MassageWorkspaceState
) {
  return useCallback(
    (value: React.SetStateAction<T>) => {
      setState((current) => ({
        ...current,
        [key]:
          typeof value === "function"
            ? (value as (previous: T) => T)(current[key] as T)
            : value,
      }));
    },
    [key, setState]
  );
}
