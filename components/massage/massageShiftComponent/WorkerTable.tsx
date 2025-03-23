import React from "react";
import { Worker } from "@/components/types/massage";
import WorkerRow from "./WorkerRow";

export interface WorkerTableProps {
  workers: Worker[];
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

const WorkerTable: React.FC<WorkerTableProps> = ({
  workers,
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
    <div className="overflow-x-auto min-h-[500px]">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3"></th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Worker Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Service Time (minute)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              End Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {workers.map((worker, index) => (
            <WorkerRow
              key={worker.id}
              worker={worker}
              isFirst={index === 0}
              isLast={index === workers.length - 1}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onWork={onWork}
              onFinish={onFinish}
              onToggleOnLeave={onToggleOnLeave}
              onEdit={onEdit}
              onDelete={onDelete}
              actionMenuOpenId={actionMenuOpenId}
              setActionMenuOpenId={setActionMenuOpenId}
            />
          ))}
          {workers.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No workers available. Please add workers.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkerTable;
