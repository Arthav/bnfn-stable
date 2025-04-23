import React, { useState } from "react";
import { Worker, BookingListStruct } from "@/components/types/massage";

type BookingListPageProps = {
  bookingList: BookingListStruct[];
};

export default function BookingListPage({
  bookingList,
}: BookingListPageProps) {

  const [status, setStatus] = useState("ACTIVE");
  // Filter workers to only include those with a "Booked" status.
  const bookedWorkers = bookingList.filter((booking) => booking.status === status);

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Booking List</h1>
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-200">
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
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                ID
              </th>
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
                  <td className="px-6 py-4">{booking.id}</td>
                  <td className="px-6 py-4">{booking.workerName}</td>
                  <td className="px-6 py-4">{booking.startTime}</td>
                  <td className="px-6 py-4">{booking.endTime}</td>
                  <td className="px-6 py-4">{booking.serviceName || "-"}</td>
                  <td className="px-6 py-4">{booking.customerName || "-"}</td>
                  <td className="px-6 py-4">{booking.customerPhone || "-"}</td>
                  <td className="px-6 py-4">{booking.transactionDate}</td>
                  <td className="px-6 py-4">{booking.workerName}</td>
                  <td className="px-6 py-4">{booking.createdBy?.name || "-"}</td>
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
    </div>
  );
}
