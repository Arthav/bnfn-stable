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

export interface BookingListStruct {
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
  customerName?: string;
  customerPhone?: string;
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
  profit: number;
  status: "Active" | "Discontinued";
  createdBy: Staff | null;
  staffCommission: number | null;
  workerCommission: number | null;
}

export interface Membership {
  /** Unique identifier for the member */
  id: number;
  /** Member's first name */
  firstName: string;
  /** Member's last name */
  lastName: string;
  /** Email address for the member */
  email: string;
  /** Primary phone number */
  phoneNumber: string;
  /** Optional mailing address */
  address?: string;
  /** Membership type (e.g., Basic, Premium, VIP) */
  membershipType: "Basic" | "Premium" | "VIP" | string;
  /** Date when the membership started (ISO string) */
  membershipStartDate: string;
  /** Optional membership end or expiration date (ISO string) */
  membershipEndDate?: string;
  /** Indicates if the membership is currently active */
  isActive: boolean;
  /** Loyalty or membership points accumulated */
  points: number;
  /** Record creation timestamp (ISO string) */
  createdAt: string;
  /** Optional record last update timestamp (ISO string) */
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