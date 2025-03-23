import React, { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { Services, Worker, Transaction } from "@/components/types/massage";
import WorkerTable from "./WorkerTable";
import WorkTimeModal from "./WorkTimeModal";
import EditWorkerModal from "./EditWorkerModal";
import AddWorkerModal from "./AddWorkerModal";

type ModalType = "workTime" | "editWorker" | "addWorker" | null;

interface FormData {
  startTime: string;
  serviceTime: string;
}

const MassageShift: React.FC<{
  services: Services[];
  setTransactions: (transactions: Transaction[]) => void;
}> = ({ services, setTransactions }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [workTimeFormData, setWorkTimeFormData] = useState<FormData>({
    startTime: "",
    serviceTime: "",
  });
  const [nameFormData, setNameFormData] = useState<string>("");
  const [actionMenuOpenId, setActionMenuOpenId] = useState<number | null>(null);

  // Load workers from localStorage on mount.
  useEffect(() => {
    const storedWorkers = localStorage.getItem("workers");
    if (storedWorkers) {
      setWorkers(JSON.parse(storedWorkers));
    }
  }, []);

  // Close action menu on outside click.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".action-menu-container")) {
        setActionMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save workers to localStorage on change.
  useEffect(() => {
    if (workers.length === 0) return;
    localStorage.setItem("workers", JSON.stringify(workers));
  }, [workers]);

  // Helper to parse end time.
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

  // Cron-like check every 20 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Date.now();
      setWorkers((prev) =>
        prev.map((worker) => {
          if (worker.status === "Busy" && worker.endTime) {
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
                serviceTime: "",
                endTime: "",
                availableSince: timestamp,
              };
            }
          }
          return worker;
        })
      );
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Modal open handlers.
  const openWorkTimeModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setWorkTimeFormData({ startTime: "", serviceTime: "" });
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
    setModalType("addWorker");
  };

  // Form submission handlers.
  const handleWorkTimeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!workTimeFormData.startTime || !workTimeFormData.serviceTime || !currentWorker)
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
    const formattedEnd = `${padZero(end.getHours())}:${padZero(
      end.getMinutes()
    )}:${padZero(end.getSeconds())}`;

    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === currentWorker.id
          ? {
              ...worker,
              startTime: start.toLocaleTimeString("en-GB"),
              serviceTime: serviceMins,
              endTime: formattedEnd,
              status: "Busy",
            }
          : worker
      )
    );
    toast.success("Worker is set to work", { position: "top-center", autoClose: 5000 });
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
              serviceTime: "",
              endTime: "",
              availableSince: timestamp,
            }
          : worker
      )
    );
    const current = workers.find((w) => w.id === workerId);
    toast.success(`${current?.name} has done working`, { position: "top-center", autoClose: 5000 });
  };

  const toggleOnLeave = (workerId: number) => {
    setWorkers((prev) =>
      prev.map((worker) => {
        if (worker.id === workerId) {
          if (worker.status === "On Leave") {
            toast.success("Worker is available", { position: "top-center", autoClose: 5000 });
            return { ...worker, status: "Available", startTime: "", serviceTime: "", endTime: "" };
          }
          if (worker.status === "Available") {
            toast.success("Worker is on leave", { position: "top-center", autoClose: 5000 });
            return { ...worker, status: "On Leave", startTime: "", serviceTime: "", endTime: "" };
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
        worker.id === currentWorker.id ? { ...worker, name: nameFormData } : worker
      )
    );
    setModalType(null);
    toast.success("Worker updated", { position: "top-center", autoClose: 5000 });
  };

  const handleDeleteWorker = (workerId: number) => {
    if (workers.length > 1) {
      if (window.confirm("Are you sure you want to delete this worker?")) {
        setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
        toast.success("Worker removed", { position: "top-center", autoClose: 5000 });
      }
    } else {
      toast.error("Minimum 1 worker is required", { position: "top-center", autoClose: 5000 });
    }
    setActionMenuOpenId(null);
  };

  const handleAddWorkerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameFormData) return;
    const newId = workers.length ? Math.max(...workers.map((w) => w.id)) + 1 : 1;
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

  const handleMoveDown = (workerId: number) => {
    setWorkers((prev) => {
      const index = prev.findIndex((w) => w.id === workerId);
      if (index === -1 || index === prev.length - 1) return prev;
      const newWorkers = [...prev];
      [newWorkers[index], newWorkers[index + 1]] = [newWorkers[index + 1], newWorkers[index]];
      return newWorkers;
    });
  };

  const handleMoveUp = (workerId: number) => {
    setWorkers((prev) => {
      const index = prev.findIndex((w) => w.id === workerId);
      if (index === -1 || index === 0) return prev;
      const newWorkers = [...prev];
      [newWorkers[index], newWorkers[index - 1]] = [newWorkers[index - 1], newWorkers[index]];
      return newWorkers;
    });
  };

  // Sorting workers based on status and availability.
  const sortedWorkers = [...workers].sort((a, b) => {
    const diff = (a.status === "Busy" ? 1 : 0) - (b.status === "Busy" ? 1 : 0);
    if (diff !== 0) return diff;
    if (a.status === "Available" && b.status === "Available") {
      return (a.availableSince || 0) - (b.availableSince || 0);
    }
    return 0;
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
      <WorkerTable
        workers={sortedWorkers}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onWork={openWorkTimeModal}
        onFinish={finishWorker}
        onToggleOnLeave={toggleOnLeave}
        onEdit={openEditWorkerModal}
        onDelete={handleDeleteWorker}
        actionMenuOpenId={actionMenuOpenId}
        setActionMenuOpenId={setActionMenuOpenId}
      />

      {modalType === "workTime" && currentWorker && (
        <WorkTimeModal
          currentWorker={currentWorker}
          workTimeFormData={workTimeFormData}
          setWorkTimeFormData={setWorkTimeFormData}
          onSubmit={handleWorkTimeSubmit}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "editWorker" && currentWorker && (
        <EditWorkerModal
          currentWorker={currentWorker}
          nameFormData={nameFormData}
          setNameFormData={setNameFormData}
          onSubmit={handleEditSubmit}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "addWorker" && (
        <AddWorkerModal
          nameFormData={nameFormData}
          setNameFormData={setNameFormData}
          onSubmit={handleAddWorkerSubmit}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default MassageShift;
