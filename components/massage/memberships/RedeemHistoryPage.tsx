import React, { useState, useEffect, useMemo } from "react";
import { RedeemPointHistoryStruct } from "@/components/types/massage";

export default function RedeemHistoryPage({
  redeemHistory,
}: {
  redeemHistory: RedeemPointHistoryStruct[];
}) {
  // Filter redeem history based on search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filterRedeemHistory = useMemo(
    () =>
      redeemHistory.filter(
        (history) =>
          history.membershipId.toString().includes(searchQuery) ||
          history.redeemDate.includes(searchQuery)
      ),
    [redeemHistory, searchQuery]
  );

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Redeem History Page</h1>
        <div className="flex items-center ml-3">
          <input
            type="text"
            placeholder="Search redeem history"
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
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">ID</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Membership ID</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Points</th>
              <th className="px-6 py-3 text-left uppercase text-xs font-medium tracking-wider">Redeem Date</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filterRedeemHistory?.map((history) => (
              <tr key={history.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{history.id}</td>
                <td className="px-6 py-4">{history.membershipId}</td>
                <td className="px-6 py-4">{history.points}</td>
                <td className="px-6 py-4">{history.redeemDate}</td>
              </tr>
            ))}
            {!filterRedeemHistory.length && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No redeem history available. Please add a redemption record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
