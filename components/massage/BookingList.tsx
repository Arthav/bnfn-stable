import React from "react";
import { Worker } from "@/components/types/massage";

type BookingListPageProps = {
  workers: Worker[];
};

export default function BookingListPage({ workers }: BookingListPageProps) {
  // Filter workers to only include those with a "Booked" status.
  const bookedWorkers = workers.filter(worker => worker.status === "Booked");

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Booking List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">ID</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Name</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">End Time</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Service</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {bookedWorkers.length > 0 ? (
              bookedWorkers.map(worker => (
                <tr key={worker.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4">{worker.id}</td>
                  <td className="px-6 py-4">{worker.name}</td>
                  <td className="px-6 py-4">{worker.startTime}</td>
                  <td className="px-6 py-4">{worker.endTime}</td>
                  <td className="px-6 py-4">{worker.serviceName || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
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
