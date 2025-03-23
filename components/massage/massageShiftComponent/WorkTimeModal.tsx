import React, { FormEvent, ChangeEvent } from "react";
import { Worker } from "@/components/types/massage";

interface FormData {
  startTime: string;
  serviceTime: string;
}

export interface WorkTimeModalProps {
  currentWorker: Worker;
  workTimeFormData: FormData;
  setWorkTimeFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const WorkTimeModal: React.FC<WorkTimeModalProps> = ({
  currentWorker,
  workTimeFormData,
  setWorkTimeFormData,
  onSubmit,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">
        Input Working Time for {currentWorker.name}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium mb-1">
            Start Time:
          </label>
          <input
            id="startTime"
            type="time"
            value={workTimeFormData.startTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWorkTimeFormData({
                ...workTimeFormData,
                startTime: e.target.value,
              })
            }
            required
            className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="serviceTime" className="block text-sm font-medium mb-1">
            Service Time (minutes):
          </label>
          <input
            id="serviceTime"
            type="number"
            value={workTimeFormData.serviceTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWorkTimeFormData({
                ...workTimeFormData,
                serviceTime: e.target.value,
              })
            }
            required
            className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default WorkTimeModal;
