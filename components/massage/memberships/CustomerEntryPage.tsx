import React, { useState, useEffect, useMemo } from "react";
import { CustomerEntryStruct } from "@/components/types/massage";

export default function CustomerEntryPage({
  customerEntry,
}: {
  customerEntry: CustomerEntryStruct[];
}) {
  // Filter customer entry based on search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filterCustomerEntry = useMemo(
    () =>
      customerEntry.filter(
        (entry) =>
          entry.id.toString().includes(searchQuery) ||
          entry.phone.includes(searchQuery) ||
          entry.identityNumber.includes(searchQuery) ||
          entry.nationality.includes(searchQuery)
      ),
    [customerEntry, searchQuery]
  );

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Entry Page</h1>
        <div className="flex items-center ml-3">
          <input
            type="text"
            placeholder="Search Customer Entry"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[500px]">
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
                Phone
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Nationality
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Identity Number
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Time In
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Time Out
              </th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filterCustomerEntry?.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{entry.id}</td>
                <td className="px-6 py-4">{entry.name}</td>
                <td className="px-6 py-4">{entry.phone}</td>
                <td className="px-6 py-4">{entry.nationality}</td>
                <td className="px-6 py-4">{entry.identityNumber}</td>
                <td className="px-6 py-4">{entry.timeIn}</td>
                <td className="px-6 py-4">{entry.timeOut}</td>
                <td className="px-6 py-4">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {!filterCustomerEntry.length && (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No Customer Entry available. Please add a record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
