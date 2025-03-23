export interface Services {
  id: number;
  name: string;
  description: string;
  price: number;
  status: "Active" | "On Hold" | "Discontinued";
  serviceTimeMin: number;
  footTimeMin: number;
  bodyTimeMin: number;
  commission: number;
}

export interface Worker {
  id: number;
  name: string;
  startTime: string;
  serviceTime: string | number;
  endTime: string;
  status: "Available" | "Busy" | "On Leave";
  availableSince?: number;
}

export interface Transaction {
  id: number;
  workerId: number;
  serviceId: number;
  startTime: string;
  serviceTime: string | number;
  endTime: string;
  sales: number;
  commission: number;
}