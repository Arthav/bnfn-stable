import React, { FormEvent, ChangeEvent } from "react";

export interface AddWorkerModalProps {
  nameFormData: string;
  setNameFormData: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  nameFormData,
  setNameFormData,
  onSubmit,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Add New Worker</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="addWorkerName" className="block text-sm font-medium mb-1">
            Worker Name:
          </label>
          <input
            id="addWorkerName"
            type="text"
            value={nameFormData}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNameFormData(e.target.value)
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AddWorkerModal;
