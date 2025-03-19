import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";

interface Worker {
  id: number;
  name: string;
  startTime: string;
  serviceTime: string | number;
  endTime: string;
  status: "Available" | "Busy" | "On Leave";
}

const initialWorkers: Worker[] = [
  {
    id: 1,
    name: "Alice",
    startTime: "",
    serviceTime: "",
    endTime: "",
    status: "Available",
  },
  {
    id: 2,
    name: "Bob",
    startTime: "",
    serviceTime: "",
    endTime: "",
    status: "On Leave",
  },
  {
    id: 3,
    name: "Charlie",
    startTime: "",
    serviceTime: "",
    endTime: "",
    status: "Available",
  },
];

const statusOrder: Record<Worker["status"], number> = {
  Available: 0,
  Busy: 1,
  "On Leave": 2,
};

const statusClasses: Record<Worker["status"], string> = {
  Available: "bg-green-600",
  Busy: "bg-blue-600",
  "On Leave": "bg-red-600",
};

interface FormData {
  startTime: string;
  serviceTime: string;
}

type ModalType = "workTime" | "editWorker" | "addWorker" | null;

export default function MassageShift() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [workTimeFormData, setWorkTimeFormData] = useState<FormData>({
    startTime: "",
    serviceTime: "",
  });
  const [nameFormData, setNameFormData] = useState<string>("");

  // Check every second if a worker's end time is reached and update status accordingly.
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers((prev) =>
        prev.map((worker) => {
          if (worker.status === "Busy" && worker.endTime) {
            // Compare current time with the stored endTime (assumed format HH:MM:SS)
            if (new Date() >= new Date(`1970-01-01T${worker.endTime}`)) {
              return {
                ...worker,
                status: "Available",
                startTime: "",
                serviceTime: "",
                endTime: "",
              };
            }
          }
          return worker;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Open the working time modal.
  const openWorkTimeModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setWorkTimeFormData({ startTime: "", serviceTime: "" });
    setModalType("workTime");
  };

  // Open the edit worker modal.
  const openEditWorkerModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setNameFormData(worker.name);
    setModalType("editWorker");
  };

  // Open the add worker modal.
  const openAddWorkerModal = () => {
    setCurrentWorker(null);
    setNameFormData("");
    setModalType("addWorker");
  };

  // Submits the working time form.
  const handleWorkTimeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !workTimeFormData.startTime ||
      !workTimeFormData.serviceTime ||
      !currentWorker
    )
      return;

    const now = new Date();
    const [hours, minutes] = workTimeFormData.startTime.split(":").map(Number);
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    const serviceMins = parseInt(workTimeFormData.serviceTime, 10);
    const end = new Date(start.getTime() + serviceMins * 60000);

    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === currentWorker.id
          ? {
              ...worker,
              startTime: start.toLocaleTimeString(),
              serviceTime: serviceMins,
              endTime: end.toLocaleTimeString(),
              status: "Busy",
            }
          : worker
      )
    );
    setModalType(null);
  };

  // Immediately sets the worker status to Available.
  const finishWorker = (workerId: number) => {
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId
          ? {
              ...worker,
              status: "Available",
              startTime: "",
              serviceTime: "",
              endTime: "",
            }
          : worker
      )
    );
  };

  // Submits the edit worker name form.
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentWorker) return;
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === currentWorker.id
          ? { ...worker, name: nameFormData }
          : worker
      )
    );
    setModalType(null);
  };

  // Submits the add worker form.
  const handleAddWorkerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameFormData) return;
    const newId = Math.max(...workers.map((w) => w.id)) + 1;
    const newWorker: Worker = {
      id: newId,
      name: nameFormData,
      startTime: "",
      serviceTime: "",
      endTime: "",
      status: "Available",
    };
    setWorkers((prev) => [...prev, newWorker]);
    setModalType(null);
  };

  // Always sort the workers by status order.
  const sortedWorkers = [...workers].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Massage Shift</h1>
        <button
          onClick={openAddWorkerModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Worker
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
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
          {sortedWorkers.map((worker) => (
            <tr key={worker.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 max-w-[150px] truncate">
                {worker.name}
              </td>
              <td className="px-6 py-4">{worker.startTime}</td>
              <td className="px-6 py-4">{worker.serviceTime}</td>
              <td className="px-6 py-4">{worker.endTime}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs text-white ${statusClasses[worker.status]}`}
                >
                  {worker.status}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => openWorkTimeModal(worker)}
                  disabled={worker.status === "Busy"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Work
                </button>
                <button
                  onClick={() => openEditWorkerModal(worker)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => finishWorker(worker.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Finish
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            {modalType === "workTime" && currentWorker && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Input Working Time for {currentWorker.name}
                </h2>
                <form onSubmit={handleWorkTimeSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Start Time:
                    </label>
                    <input
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
                    <label className="block text-sm font-medium mb-1">
                      Service Time (minutes):
                    </label>
                    <input
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
                      onClick={() => setModalType(null)}
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
              </>
            )}
            {modalType === "editWorker" && currentWorker && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Edit Name for {currentWorker.name}
                </h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Worker Name:
                    </label>
                    <input
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
                      onClick={() => setModalType(null)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalType === "addWorker" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Add New Worker</h2>
                <form onSubmit={handleAddWorkerSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Worker Name:
                    </label>
                    <input
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
                      onClick={() => setModalType(null)}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
