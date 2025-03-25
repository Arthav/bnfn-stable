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
  availableSince?: number;
  serviceId?: number;
  serviceName?: string;
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

  isRefunded?: boolean;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;

  isRefundTransaction?: boolean;
}
