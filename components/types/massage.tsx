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

export interface Transaction {
  id: number;
  workerId: number;
  serviceId: number;
  startTime: string;
  serviceTime: number;
  endTime: string;
  sales: number;
  commission: number;
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
}

export interface AddOns {
  id: number;
  name: string;
  price: number;
  profit: number;
  status: "Active" | "Discontinued";
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
export interface Admins {
  id: number;
  name: string;
  password: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
