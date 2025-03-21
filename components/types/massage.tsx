export interface Services {
  id: number;
  name: string;
  description: string;
  price: number;
  status: "Active" | "On Hold" | "Discontinued";
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
