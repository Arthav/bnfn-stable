import React, { useState, useMemo, useEffect } from "react";
import { Transaction, Staff } from "@/components/types/massage";

interface TransactionListProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  activeStaff: Staff | null;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  setTransactions,
  activeStaff,
}) => {
  // Filter states
  const [timeFilter, setTimeFilter] = useState<"custom" | "week" | "month">("custom");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [weekDate, setWeekDate] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [filterWorker, setFilterWorker] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // State for refund modal
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundReason, setRefundReason] = useState<string>("");

  // New state for details modal
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<Transaction | null>(null);

  // Compute filtered and sorted transactions.
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    // Time filtering logic
    if (timeFilter === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return txDate >= start && txDate <= end;
      });
    } else if (timeFilter === "week" && weekDate) {
      const selectedDate = new Date(weekDate);
      const day = selectedDate.getDay();
      const adjustedDay = day === 0 ? 7 : day;
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - adjustedDay + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return txDate >= startOfWeek && txDate <= endOfWeek;
      });
    } else if (timeFilter === "month" && month) {
      const [year, monthNum] = month.split("-").map(Number);
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return (
          txDate.getFullYear() === year && txDate.getMonth() === monthNum - 1
        );
      });
    }

    // Filter by worker name (case-insensitive)
    if (filterWorker.trim() !== "") {
      const lowerWorker = filterWorker.toLowerCase();
      filtered = filtered.filter((tx) => {
        const workerName = tx.workerName ? tx.workerName.toLowerCase() : "";
        return workerName.includes(lowerWorker);
      });
    }

    // Sort transactions.
    if (sortBy) {
      filtered = filtered.slice().sort((a, b) => {
        if (sortBy === "dateAsc") {
          return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        } else if (sortBy === "dateDesc") {
          return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
        } else if (sortBy === "salesAsc") {
          return a.sales - b.sales;
        } else if (sortBy === "salesDesc") {
          return b.sales - a.sales;
        } else if (sortBy === "commissionAsc") {
          return a.commission - b.commission;
        } else if (sortBy === "commissionDesc") {
          return b.commission - a.commission;
        } else if (sortBy === "workerAsc") {
          return (a.workerName || "").localeCompare(b.workerName || "");
        } else if (sortBy === "workerDesc") {
          return (b.workerName || "").localeCompare(a.workerName || "");
        }
        return 0;
      });
    }
    return filtered;
  }, [transactions, timeFilter, customStartDate, customEndDate, weekDate, month, filterWorker, sortBy]);

  // Reset to page 1 when filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, customStartDate, customEndDate, weekDate, month, filterWorker, sortBy]);

  // Pagination calculations.
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle refund form submission.
  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    // Generate a new id (e.g., max current id + 1)
    const newId =
      transactions.length > 0
        ? Math.max(...transactions.map((tx) => tx.id)) + 1
        : 1;
    const now = new Date().toISOString();

    // Update the original transaction to mark it as refunded.
    const updatedOriginalTransaction = {
      ...selectedTransaction,
      isRefunded: true,
    };

    // Create a new refund transaction (full refund)
    const refundTransaction: Transaction = {
      ...updatedOriginalTransaction,
      id: newId,
      transactionDate: now, // refund date is now
      isRefundTransaction: true,
      refundAmount: selectedTransaction.sales, // full refund amount
      refundDate: now,
      refundReason,
      createdBy: activeStaff,
    };

    // Update transactions:
    // 1. Mark the original transaction as refunded.
    // 2. Append the new refund transaction.
    const updatedTransactions = transactions.map((tx) =>
      tx.id === selectedTransaction.id ? updatedOriginalTransaction : tx
    );
    updatedTransactions.push(refundTransaction);

    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    // Reset modal state.
    setSelectedTransaction(null);
    setRefundReason("");
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Transaction List</h1>

      {/* Filter Controls */}
      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          {/* Time Filter */}
          <div>
            <label htmlFor="timeFilter" className="block mb-1">
              Time Filter
            </label>
            <select
              id="timeFilter"
              value={timeFilter}
              onChange={(e) =>
                setTimeFilter(e.target.value as "custom" | "week" | "month")
              }
              className="bg-gray-700 p-2 rounded"
            >
              <option value="custom">Custom Days</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          {timeFilter === "custom" && (
            <>
              <div>
                <label htmlFor="customStartDate" className="block mb-1">
                  Start Date
                </label>
                <input
                  id="customStartDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                />
              </div>
              <div>
                <label htmlFor="customEndDate" className="block mb-1">
                  End Date
                </label>
                <input
                  id="customEndDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                />
              </div>
            </>
          )}
          {timeFilter === "week" && (
            <div>
              <label htmlFor="weekDate" className="block mb-1">
                Select a Date (Week)
              </label>
              <input
                id="weekDate"
                type="date"
                value={weekDate}
                onChange={(e) => setWeekDate(e.target.value)}
                className="bg-gray-700 p-2 rounded"
              />
            </div>
          )}
          {timeFilter === "month" && (
            <div>
              <label htmlFor="month" className="block mb-1">
                Select Month
              </label>
              <input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-gray-700 p-2 rounded"
              />
            </div>
          )}

          {/* Worker Filter */}
          <div>
            <label htmlFor="filterWorker" className="block mb-1">
              Filter by Worker Name
            </label>
            <input
              id="filterWorker"
              type="text"
              value={filterWorker}
              onChange={(e) => setFilterWorker(e.target.value)}
              placeholder="Enter worker name"
              className="bg-gray-700 p-2 rounded"
            />
          </div>

          {/* Sort Options */}
          <div>
            <label htmlFor="sortBy" className="block mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 p-2 rounded"
            >
              <option value="">None</option>
              <option value="dateAsc">Date Ascending</option>
              <option value="dateDesc">Date Descending</option>
              <option value="salesAsc">Sales Ascending</option>
              <option value="salesDesc">Sales Descending</option>
              <option value="commissionAsc">Commission Ascending</option>
              <option value="commissionDesc">Commission Descending</option>
              <option value="workerAsc">Worker Name Ascending</option>
              <option value="workerDesc">Worker Name Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Worker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Staff
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Refund Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {paginatedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{tx.id}</td>
                <td className="px-6 py-4">
                  {new Date(tx.transactionDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">{tx.workerName || tx.workerId}</td>
                <td className="px-6 py-4">
                  {tx.customerName ? tx.customerName : "N/A"}
                  {tx.customerPhone && ` (${tx.customerPhone})`}
                </td>
                <td className="px-6 py-4">{tx.createdBy?.name || "Has not been set"}</td>
                <td className="px-6 py-4">
                  {tx.isRefundTransaction ? (
                    <div className="text-green-400">
                      Refunded: ${tx.refundAmount}
                    </div>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs disabled:hover:bg-gray-200"
                      onClick={() => setSelectedTransaction(tx)}
                      disabled={tx.isRefunded}
                    >
                      Refund
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedTransactionDetails(tx)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No transactions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransactionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              Transaction #{selectedTransactionDetails.id}
            </h2>
            <div className="space-y-4">
              {/* Transaction Info */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Transaction Info</h3>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedTransactionDetails.transactionDate).toLocaleDateString(
                    "en-GB",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </p>
                <p>
                  <span className="font-semibold">Worker:</span>{" "}
                  {selectedTransactionDetails.workerName ||
                    selectedTransactionDetails.workerId}
                </p>
                <p>
                  <span className="font-semibold">Service:</span>{" "}
                  {selectedTransactionDetails.serviceName ||
                    selectedTransactionDetails.serviceId}
                </p>
              </div>

              {/* Add-Ons */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Add‑Ons</h3>
                {selectedTransactionDetails.addOns &&
                selectedTransactionDetails.addOns.length > 0 ? (
                  <>
                    <p>
                      <span className="font-semibold">List:</span>{" "}
                      {selectedTransactionDetails.addOns
                        .map((addon) => addon.name)
                        .join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Total Price:</span> $
                      {selectedTransactionDetails.addOns
                        .reduce((total, addon) => total + addon.price, 0)
                        .toFixed(2)}
                    </p>
                    <p>
                      <span className="font-semibold">Total Profit:</span> $
                      {selectedTransactionDetails.addOns
                        .reduce((total, addon) => total + addon.profit, 0)
                        .toFixed(2)}
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      {selectedTransactionDetails.addOns.map((addon) => (
                        <li key={addon.id}>
                          {addon.name} (${addon.price})
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              {/* Customer & Timing */}
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Customer & Timing
                </h3>
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {selectedTransactionDetails.customerName
                    ? selectedTransactionDetails.customerName
                    : "N/A"}{" "}
                  {selectedTransactionDetails.customerPhone &&
                    `(${selectedTransactionDetails.customerPhone})`}
                </p>
                <p>
                  <span className="font-semibold">Start Time:</span>{" "}
                  {selectedTransactionDetails.startTime}
                </p>
                <p>
                  <span className="font-semibold">End Time:</span>{" "}
                  {selectedTransactionDetails.endTime}
                </p>
              </div>

              {/* Financials */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Financials</h3>
                <p>
                  <span className="font-semibold">Sales:</span> $
                  {selectedTransactionDetails.sales}
                </p>
                <p>
                  <span className="font-semibold">Commission:</span> $
                  {selectedTransactionDetails.commission}
                </p>
                <p>
                  <span className="font-semibold">Foot Time:</span>{" "}
                  {selectedTransactionDetails.footTime} min
                </p>
                <p>
                  <span className="font-semibold">Body Time:</span>{" "}
                  {selectedTransactionDetails.bodyTime} min
                </p>
              </div>

              {/* Refund Info (if applicable) */}
              {selectedTransactionDetails.isRefundTransaction && (
                <div className="text-green-400">
                  <h3 className="text-lg font-semibold mb-1">Refund Info</h3>
                  <p>
                    <span className="font-semibold">Refunded Amount:</span> $
                    {selectedTransactionDetails.refundAmount}
                  </p>
                  <p>
                    <span className="font-semibold">Refund Date:</span>{" "}
                    {selectedTransactionDetails.refundDate
                      ? new Date(selectedTransactionDetails.refundDate).toLocaleDateString(
                          "en-GB",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Refund Reason:</span>{" "}
                    {selectedTransactionDetails.refundReason}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              {!selectedTransactionDetails.isRefunded &&
                !selectedTransactionDetails.isRefundTransaction && (
                  <button
                    onClick={() => {
                      setSelectedTransaction(selectedTransactionDetails);
                      setSelectedTransactionDetails(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                  >
                    Refund
                  </button>
                )}
              <button
                type="button"
                onClick={() => setSelectedTransactionDetails(null)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Refund Transaction #{selectedTransaction.id}
            </h2>
            <form onSubmit={handleRefundSubmit}>
              <div className="mb-4">
                <label htmlFor="refundReason" className="block mb-1">
                  Refund Reason
                </label>
                <textarea
                  id="refundReason"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Submit Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
