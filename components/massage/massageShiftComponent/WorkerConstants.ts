import { Worker } from "@/components/types/massage";

export const statusOrder: Record<Worker["status"], number> = {
  Available: 0,
  Busy: 1,
  "On Leave": 2,
  Booked: 3,
};

export const statusClasses: Record<Worker["status"], string> = {
  Available: "bg-green-600",
  Busy: "bg-blue-600",
  "On Leave": "bg-red-600",
  Booked: "bg-yellow-600",
};
