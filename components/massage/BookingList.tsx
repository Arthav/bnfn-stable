import React, { useState, ChangeEvent, useEffect } from "react";
import { BookingListStruct, Worker, Staff } from "@/components/types/massage";


type BookingListPageProps = {
  workers: Worker[];
  activeStaff: Staff | null;
  bookingList: BookingListStruct[];
  setBookingList: React.Dispatch<React.SetStateAction<BookingListStruct[]>>;
};

export default function BookingListPage({
  workers,
  activeStaff,
  bookingList,
  setBookingList,
}: BookingListPageProps) {
  const [status, setStatus] = useState("ACTIVE");
  const [modalOpen, setModalOpen] = useState(false); // To manage modal visibility
  const emptyFormState: BookingListStruct = {
    id: 0,
    workerId: 0,
    serviceId: 0,
    startTime: "",
    serviceTime: 0,
    endTime: "",
    sales: 0,
    commission: 0,
    staffCommission: 0,
    workerName: "",
    serviceName: "",
    footTime: 0,
    bodyTime: 0,
    customerName: "",
    customerPhone: "",
    transactionDate: "",
    addOns: [],
    createdBy: null,
    status: "APPOINTMENT",
  };
  const [bookingFormData, setBookingFormData] = useState<BookingListStruct>(emptyFormState);

  useEffect(() => {
    if (bookingList.length === 0) return;
    localStorage.setItem("bookingList", JSON.stringify(bookingList));
  }, [bookingList]);

  // Filter workers to only include those with a "Booked" status.
  const bookedWorkers = bookingList
    .filter((booking) => booking.status === status)
    .sort((a, b) => {
      if (status === "APPOINTMENT" || status === "APPOINTMENT DONE") {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();

        if (dateA !== dateB) {
          return dateA - dateB; // Sort by transactionDate
        }

        const timeA = new Date(a.startTime).getTime();
        const timeB = new Date(b.startTime).getTime();
        return timeA - timeB; // Sort by startTime
      }

      return 0;
    });

  const handleAddAppointment = () => {
    const newAppointMentData: BookingListStruct = {
      ...bookingFormData,
      id: Date.now(),
      createdBy: activeStaff,
      status: "APPOINTMENT",
    };
    setBookingList((prev) => [...prev, newAppointMentData]);
    setModalOpen(false); 
    setBookingFormData(emptyFormState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Explicitly define the type of prevData as BookingListStruct
    setBookingFormData((prevData: BookingListStruct) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleWorkerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedWorkerId = parseInt(e.target.value, 10); // Get the worker's ID from the dropdown

    // Find the selected worker by ID
    const selectedWorker = workers.find((wrk) => wrk.id === selectedWorkerId);

    if (selectedWorker) {
      // Update the booking form data with the selected worker's details
      setBookingFormData((prevData) => ({
        ...prevData,
        workerId: selectedWorker.id,
        workerName: selectedWorker.name, // Set the worker's name
      }));
    }
  };

  const finishAppointment = (bookingId: number) => {
    setBookingList((prev) =>
      prev.map((booking) => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            status: "APPOINTMENT DONE",
          };
        }
        return booking;
      })
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Booking List</h1>
      <div className="flex items-center space-between mb-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-200 mr-2"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          className="py-2 px-3 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ACTIVE">Active Booking</option>
          <option value="DONE">Past Booking</option>
          <option value="APPOINTMENT">Appointment</option>
          <option value="APPOINTMENT DONE">Appointment Done</option>
        </select>
        <button
          onClick={() => setModalOpen(true)}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Appointment
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {status === "APPOINTMENT" && (
                <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                </th>
              )}
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Customer Phone
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Selected Therapist
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Staff
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {bookedWorkers.length > 0 ? (
              bookedWorkers.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-800">
                  {status === 'APPOINTMENT' && (
                    <td className="px-6 py-4">
                      <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => finishAppointment(booking.id)}
                      >
                        Done
                      </button>
                    </td>
                  )}
                  <td className="px-6 py-4">{booking.workerName}</td>
                  <td className="px-6 py-4">{booking.startTime}</td>
                  <td className="px-6 py-4">{booking.endTime}</td>
                  <td className="px-6 py-4">{booking.serviceName || "-"}</td>
                  <td className="px-6 py-4">{booking.customerName || "-"}</td>
                  <td className="px-6 py-4">{booking.customerPhone || "-"}</td>
                  <td className="px-6 py-4">{booking.transactionDate}</td>
                  <td className="px-6 py-4">{booking.workerName}</td>
                  <td className="px-6 py-4">
                    {booking.createdBy?.name || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  No booked workers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Appointment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add Appointment</h2>
            <form onSubmit={handleAddAppointment}>
              <div className="mb-4">
                <label
                  htmlFor="workerName"
                  className="block text-sm font-medium mb-1"
                >
                  Worker Name
                </label>
                <select
                  id="workerName"
                  name="workerName"
                  value={bookingFormData.workerId}
                  onChange={handleWorkerChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                >
                  <option value="">Select a Worker</option>
                  {workers?.map((wrk) => (
                    <option key={wrk.id} value={wrk.id}>
                      {wrk.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={bookingFormData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="customerPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Customer Phone
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="text"
                  value={bookingFormData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium mb-1"
                >
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={bookingFormData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium mb-1"
                >
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={bookingFormData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="transactionDate"
                  className="block text-sm font-medium mb-1"
                >
                  Booking Date
                </label>
                <input
                  id="transactionDate"
                  name="transactionDate"
                  type="date"
                  value={bookingFormData.transactionDate}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                />
              </div>


              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Add Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
