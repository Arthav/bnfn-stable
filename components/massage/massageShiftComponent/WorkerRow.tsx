import React from "react";
import { Worker } from "@/components/types/massage";
import { statusClasses } from "./WorkerConstants";

export interface WorkerRowProps {
  worker: Worker;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (workerId: number) => void;
  onMoveDown: (workerId: number) => void;
  onWork: (worker: Worker) => void;
  onFinish: (workerId: number) => void;
  onToggleOnLeave: (workerId: number) => void;
  onEdit: (worker: Worker) => void;
  onDelete: (workerId: number) => void;
  actionMenuOpenId: number | null;
  setActionMenuOpenId: (id: number | null) => void;
}

const WorkerRow: React.FC<WorkerRowProps> = ({
  worker,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onWork,
  onFinish,
  onToggleOnLeave,
  onEdit,
  onDelete,
  actionMenuOpenId,
  setActionMenuOpenId,
}) => {
  return (
    <tr className="hover:bg-gray-800">
      <td className="px-6 py-4 flex flex-row gap-2">
        <button
          onClick={() => onMoveUp(worker.id)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded disabled:opacity-50"
          disabled={isFirst || worker.status === "Busy" || worker.status === "On Leave"}
        >
          ↑
        </button>
        <button
          onClick={() => onMoveDown(worker.id)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded disabled:opacity-50"
          disabled={isLast || worker.status === "Busy" || worker.status === "On Leave"}
        >
          ↓
        </button>
      </td>
      <td className="px-6 py-4 max-w-[150px] truncate">{worker.name}</td>
      <td className="px-6 py-4">{worker.startTime}</td>
      <td className="px-6 py-4 text-center">
        {worker.serviceTime}
        {worker.serviceTime === "" ? "" : " Minute(s)"}
      </td>
      <td className="px-6 py-4">{worker.endTime}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs text-white ${statusClasses[worker.status]}`}>
          {worker.status}
        </span>
      </td>
      <td className="px-6 py-4 md:space-x-2 flex flex-col md:flex-row md:items-center md:justify-center relative">
        <button
          onClick={() => onWork(worker)}
          disabled={worker.status === "Busy" || worker.status === "On Leave"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Work
        </button>
        <button
          onClick={() => onFinish(worker.id)}
          disabled={worker.status !== "Busy"}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Done
        </button>
        <button
          onClick={() => onToggleOnLeave(worker.id)}
          disabled={worker.status === "Busy"}
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          L
        </button>
        <div className="relative inline-block action-menu-container">
          <button
            onClick={() =>
              setActionMenuOpenId(actionMenuOpenId === worker.id ? null : worker.id)
            }
            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
          >
            ⋮
          </button>
          {actionMenuOpenId === worker.id && (
            <div className="absolute right-0 mt-1 w-28 bg-gray-700 rounded shadow-lg z-10">
              <button
                onClick={() => onEdit(worker)}
                className="bg-yellow-600 block w-full text-left px-3 py-1 mb-1 hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(worker.id)}
                className="bg-red-600 block w-full text-left px-3 py-1 mb-1 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default WorkerRow;
