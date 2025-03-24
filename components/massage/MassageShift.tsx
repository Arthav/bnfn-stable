import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Services, Worker, Transaction } from "@/components/types/massage";

const statusOrder: Record<Worker["status"], number> = {
  Available: 0,
  Busy: 1,
  "On Leave": 2,
  Booked: 0,
};

const statusClasses: Record<Worker["status"], string> = {
  Available: "bg-green-600",
  Busy: "bg-blue-600",
  "On Leave": "bg-red-600",
  Booked: "bg-yellow-600",
};

interface FormData {
  startTime: string;
  serviceTime: string;
}

type ModalType = "workTime" | "editWorker" | "addWorker" | null;

export default function MassageShift({
  services,
  transactions,
  workers,
  setWorkers,
  setTransactions,
}: {
  services: Services[];
  transactions: Transaction[];
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [workTimeFormData, setWorkTimeFormData] = useState<FormData>({
    startTime: "",
    serviceTime: "",
  });
  const [nameFormData, setNameFormData] = useState<string>("");
  // New states for optional customer name and phone for addWorker
  const [customerNameFormData, setCustomerNameFormData] = useState<string>("");
  const [customerPhoneFormData, setCustomerPhoneFormData] =
    useState<string>("");

  const [actionMenuOpenId, setActionMenuOpenId] = useState<number | null>(null);
  // New state for Booked checkbox and service selection.
  const [isBooked, setIsBooked] = useState(false);
  const [selectedService, setSelectedService] = useState<number>(
    services[0]?.id ?? 0
  );

  // Handle closing the action menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".action-menu-container")) {
        setActionMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save workers to localStorage whenever they change.
  useEffect(() => {
    if (workers.length === 0) return;
    localStorage.setItem("workers", JSON.stringify(workers));
  }, [workers]);

  const parseEndTime = (endTime: string): Date => {
    const [hours, minutes, seconds] = endTime.split(":").map(Number);
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      seconds || 0
    );
  };

  // Cron-like check: update worker status when the end time is reached.
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Date.now();
      setWorkers((prev) =>
        prev.map((worker) => {
          if (
            (worker.status === "Busy" || worker.status === "Booked") &&
            worker.endTime
          ) {
            const endDate = parseEndTime(worker.endTime);
            if (new Date() > endDate) {
              toast.success(`${worker.name} has done working`, {
                position: "top-center",
                autoClose: 5000,
              });
              return {
                ...worker,
                status: "Available",
                startTime: "",
                serviceTime: 0,
                endTime: "",
                availableSince:
                  worker.status === "Busy" ? timestamp : undefined,
                serviceId: undefined,
                serviceName: undefined,
              };
            }
          }
          return worker;
        })
      );
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const openWorkTimeModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setWorkTimeFormData({ startTime: "", serviceTime: "" });
    setIsBooked(false);
    setSelectedService(services[0]?.id ?? 0);
    setModalType("workTime");
  };

  const openEditWorkerModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setNameFormData(worker.name);
    setModalType("editWorker");
    setActionMenuOpenId(null);
  };

  const openAddWorkerModal = () => {
    setCurrentWorker(null);
    setNameFormData("");
    // Clear customer info fields
    setCustomerNameFormData("");
    setCustomerPhoneFormData("");
    setModalType("addWorker");
  };

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
    const padZero = (num: number) => num.toString().padStart(2, "0");
    const formattedEnd = `${padZero(end.getHours())}:${padZero(end.getMinutes())}:${padZero(end.getSeconds())}`;

    const selectedServiceObj = services.find(
      (service) => service.id === selectedService
    );
    if (!selectedServiceObj) return;

    // Determine the new status based on the checkbox.
    const newStatus = isBooked ? "Booked" : "Busy";

    // Update the worker with the work and service details.
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === currentWorker.id
          ? {
              ...worker,
              startTime: start.toLocaleTimeString("en-GB"),
              serviceTime: serviceMins,
              endTime: formattedEnd,
              status: newStatus,
              serviceId: selectedServiceObj.id,
              serviceName: selectedServiceObj.name,
            }
          : worker
      )
    );

    // Create a new transaction record.
    const newTransaction: Transaction = {
      id: Date.now(),
      workerId: currentWorker.id,
      serviceId: selectedServiceObj.id,
      startTime: start.toLocaleTimeString("en-GB"),
      serviceTime: serviceMins,
      endTime: formattedEnd,
      sales: selectedServiceObj.price,
      commission: selectedServiceObj.commission,
      workerName: currentWorker.name,
      serviceName: selectedServiceObj.name,
      footTime: selectedServiceObj.footTimeMin,
      bodyTime: selectedServiceObj.bodyTimeMin,
      customerName: customerNameFormData,
      customerPhone: customerPhoneFormData,
    };
    setTransactions([...transactions, newTransaction]);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    toast.success(`${currentWorker?.name} is set to work`, {
      position: "top-center",
      autoClose: 5000,
    });
    setModalType(null);
  };

  const finishWorker = (workerId: number) => {
    const timestamp = Date.now();
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId
          ? {
              ...worker,
              status: "Available",
              startTime: "",
              serviceTime: 0,
              endTime: "",
              availableSince: worker.status === "Busy" ? timestamp : undefined,
              serviceId: undefined,
              serviceName: undefined,
            }
          : worker
      )
    );
    const currentW = workers.find((w) => w.id === workerId);
    toast.success(`${currentW?.name} has done working`, {
      position: "top-center",
      autoClose: 5000,
    });
  };

  const toggleOnLeave = (workerId: number) => {
    setWorkers((prev) =>
      prev.map((worker) => {
        if (worker.id === workerId) {
          if (worker.status === "On Leave") {
            toast.success("Worker is available", {
              position: "top-center",
              autoClose: 5000,
            });
            return {
              ...worker,
              status: "Available",
              startTime: "",
              serviceTime: 0,
              endTime: "",
              serviceId: undefined,
              serviceName: undefined,
            };
          }
          if (worker.status === "Available") {
            toast.success("Worker is on leave", {
              position: "top-center",
              autoClose: 5000,
            });
            return {
              ...worker,
              status: "On Leave",
              startTime: "",
              serviceTime: 0,
              endTime: "",
              serviceId: undefined,
              serviceName: undefined,
            };
          }
        }
        return worker;
      })
    );
  };

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
    toast.success("Worker updated", {
      position: "top-center",
      autoClose: 5000,
    });
  };

  const handleDeleteWorker = (workerId: number) => {
    if (workers.length > 1) {
      if (window.confirm("Are you sure you want to delete this worker?")) {
        setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
        toast.success("Worker removed", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } else {
      toast.error("Minimum 1 worker is required", {
        position: "top-center",
        autoClose: 5000,
      });
    }
    setActionMenuOpenId(null);
  };

  const handleAddWorkerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameFormData) return;
    const newId = workers.length
      ? Math.max(...workers.map((w) => w.id)) + 1
      : 1;
    const newWorker = {
      id: newId,
      name: nameFormData,
      startTime: "",
      serviceTime: 0,
      endTime: "",
      status: "Available",
    } as Worker;
    setWorkers((prev) => [...prev, newWorker]);
    setModalType(null);
    setNameFormData("");
    setCustomerNameFormData("");
    setCustomerPhoneFormData("");
  };

  const handleMoveDown = (workerId: number) => {
    setWorkers((prev) => {
      const workerIndex = prev.findIndex((w) => w.id === workerId);
      if (workerIndex === -1 || workerIndex === prev.length - 1) return prev;
      const newWorkers = [...prev];
      [newWorkers[workerIndex], newWorkers[workerIndex + 1]] = [
        newWorkers[workerIndex + 1],
        newWorkers[workerIndex],
      ];
      return newWorkers;
    });
  };

  const handleMoveUp = (workerId: number) => {
    setWorkers((prev) => {
      const workerIndex = prev.findIndex((w) => w.id === workerId);
      if (workerIndex === -1 || workerIndex === 0) return prev;
      const newWorkers = [...prev];
      [newWorkers[workerIndex], newWorkers[workerIndex - 1]] = [
        newWorkers[workerIndex - 1],
        newWorkers[workerIndex],
      ];
      return newWorkers;
    });
  };

  const sortedWorkers = workers
    .map((worker, index) => ({ ...worker, originalIndex: index }))
    .sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      const availableSinceDiff =
        (a.availableSince ?? 0) - (b.availableSince ?? 0);
      if (availableSinceDiff !== 0) return availableSinceDiff;
      return a.originalIndex - b.originalIndex;
    });

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
            {sortedWorkers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleMoveUp(worker.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={
                      worker.id === sortedWorkers[0].id ||
                      worker.status === "Busy" ||
                      worker.status === "On Leave"
                    }
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(worker.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={
                      worker.id ===
                        sortedWorkers[sortedWorkers.length - 1].id ||
                      worker.status === "Busy" ||
                      worker.status === "On Leave"
                    }
                  >
                    ↓
                  </button>
                </td>
                <td className="px-6 py-4 max-w-[150px] truncate">
                  {worker.name}
                </td>
                <td className="px-6 py-4">{worker.startTime}</td>
                <td className="px-6 py-4 text-center">
                  {worker.serviceTime}{" "}
                  {worker.serviceTime === 0 ? "" : "Minute(s)"}
                </td>
                <td className="px-6 py-4">{worker.endTime}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${statusClasses[worker.status]}`}
                  >
                    {worker.status}
                  </span>
                </td>
                <td className="px-6 py-4 md:space-x-2 flex flex-col md:flex-row md:items-center md:justify-center relative">
                  <button
                    onClick={() => openWorkTimeModal(worker)}
                    disabled={
                      worker.status === "Busy" || worker.status === "On Leave"
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Work
                  </button>
                  <button
                    onClick={() => finishWorker(worker.id)}
                    disabled={
                      worker.status !== "Busy" && worker.status !== "Booked"
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => toggleOnLeave(worker.id)}
                    disabled={worker.status === "Busy"}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    L
                  </button>
                  <div className="relative inline-block action-menu-container">
                    <button
                      onClick={() =>
                        setActionMenuOpenId(
                          actionMenuOpenId === worker.id ? null : worker.id
                        )
                      }
                      className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
                    >
                      ⋮
                    </button>
                    {actionMenuOpenId === worker.id && (
                      <div className="absolute right-0 mt-1 w-28 bg-gray-700 rounded shadow-lg z-10">
                        <button
                          onClick={() => openEditWorkerModal(worker)}
                          className="bg-yellow-600 block w-full text-left px-3 py-1 mb-1 hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="bg-red-600 block w-full text-left px-3 py-1 mb-1 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!sortedWorkers.length && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No workers available. Please add workers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium mb-1"
                    >
                      Start Time:
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      value={workTimeFormData.startTime}
                      onChange={(e) =>
                        setWorkTimeFormData({
                          ...workTimeFormData,
                          startTime: e.target.value,
                        })
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="serviceTime"
                      className="block text-sm font-medium mb-1"
                    >
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
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4 flex items-center">
                    <input
                      id="bookedCheckbox"
                      type="checkbox"
                      checked={isBooked}
                      onChange={(e) => setIsBooked(e.target.checked)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="bookedCheckbox"
                      className="text-sm font-medium"
                    >
                      Booked
                    </label>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="selectService"
                      className="block text-sm font-medium mb-1"
                    >
                      Select Service:
                    </label>
                    <select
                      id="selectService"
                      value={selectedService}
                      onChange={(e) =>
                        setSelectedService(Number(e.target.value))
                      }
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    >
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          [${service.price}] - {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* New optional customer fields */}
                  <div className="mb-4">
                    <label
                      htmlFor="addCustomerName"
                      className="block text-sm font-medium mb-1"
                    >
                      Customer Name:
                    </label>
                    <input
                      id="addCustomerName"
                      type="text"
                      value={customerNameFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCustomerNameFormData(e.target.value)
                      }
                      placeholder="Optional"
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="addCustomerPhone"
                      className="block text-sm font-medium mb-1"
                    >
                      Customer Phone:
                    </label>
                    <input
                      id="addCustomerPhone"
                      type="text"
                      value={customerPhoneFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCustomerPhoneFormData(e.target.value)
                      }
                      placeholder="Optional"
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
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
                    <label
                      htmlFor="editWorkerName"
                      className="block text-sm font-medium mb-1"
                    >
                      Worker Name:
                    </label>
                    <input
                      id="editWorkerName"
                      type="text"
                      value={nameFormData}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNameFormData(e.target.value)
                      }
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
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
                    <label
                      htmlFor="addWorkerName"
                      className="block text-sm font-medium mb-1"
                    >
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
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
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
