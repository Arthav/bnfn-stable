export interface Services {
  id: number;
  name: string;
  description: string;
  price: number;
  status: "Active" | "Discontinued";
  serviceTimeMin: number;
  footTimeMin: number;
  bodyTimeMin: number;
  commission: number;
  createdBy: Staff | null;
  staffCommission: number | null;
}

export interface Worker {
  id: number;
  name: string;
  startTime: string;
  serviceTime: number;
  endTime: string;
  status: "Available" | "Busy" | "On Leave" | "Booked";
  availableSince?: number; // deprecated
  serviceId?: number;
  serviceName?: string;
  addOns?: AddOns[];
}

export interface CustomerEntryStruct {
  id: number;
  name: string;
  phone: string;
  nationality: string;
  identityNumber: string;
  timeIn: string;
  timeOut?: string
  createdAt: string;
}
export interface BookingListStruct {
  id: number;
  workerId?: number;
  serviceId: number;
  startTime: string;
  serviceTime: number;
  sales: number;
  commission: number;
  staffCommission: number | null;
  workerName?: string;
  serviceName?: string;
  footTime: number;
  bodyTime: number;
  customerName?: string;
  customerPhone?: string;
  nationality?: string;
  identityNumber?: string;
  transactionDate: string;
  addOns?: AddOns[];
  createdBy: Staff | null;
  status: "ACTIVE" | "DONE" | "APPOINTMENT" | "APPOINTMENT DONE";
}

export interface Transaction {
  id: number;
  workerId: number;
  serviceId: number;
  startTime: string;
  serviceTime: number;
  endTime: string;
  sales: number;
  commission: number;
  staffCommission: number | null;
  workerName?: string;
  serviceName?: string;
  footTime: number;
  bodyTime: number;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  transactionDate: string;
  addOns?: AddOns[];

  isRefunded?: boolean;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;

  isRefundTransaction?: boolean;
  createdBy: Staff | null;
}

export interface AddOns {
  id: number;
  name: string;
  price: number;
  profit?: number;
  status: "Active" | "Discontinued";
  createdBy: Staff | null;
  staffCommission: number | null;
  workerCommission: number | null;
}

export interface Membership {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // unique
  nationality: string;
  identityNumber: string;
  address?: string;
  membershipTypeId: number;
  membershipStartDate: string;
  membershipEndDate?: string;
  isActive: boolean;
  points: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MembershipTypesStruct {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt?: string;
}

export interface RedeemPointHistoryStruct {
  id: number;
  membershipId: number;
  points: number;
  redeemDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Companies {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
export interface Staff {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffChangeLog {
  id: number;
  staffId: number;
  changeFromId: number | null;
  changeToId: number | null;
  changeDate: string;
}

export interface Item {
  id: number;
  name: string;
  // Add additional fields if needed.
}