import React, { useState, useMemo } from "react";
import { Transaction } from "@/components/types/massage";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  // Time filter states: "custom" (custom days), "week", "month"
  const [timeFilter, setTimeFilter] = useState<"custom" | "week" | "month">("custom");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [weekDate, setWeekDate] = useState<string>("");
  const [month, setMonth] = useState<string>("");

  // Other filter & sort states
  const [filterWorker, setFilterWorker] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // Compute filtered and sorted transactions.
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply time filter.
    if (timeFilter === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return txDate >= start && txDate <= end;
      });
    } else if (timeFilter === "week" && weekDate) {
      const selectedDate = new Date(weekDate);
      // Assuming week starts on Monday.
      const day = selectedDate.getDay();
      // If Sunday (0), treat it as 7.
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
        return txDate.getFullYear() === year && txDate.getMonth() === monthNum - 1;
      });
    }

    // Filter by worker name (case-insensitive).
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

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Transaction List</h1>

      {/* Filter Controls */}
      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          {/* Time Filter */}
          <div>
            <label className="block mb-1">Time Filter</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as "custom" | "week" | "month")}
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
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">End Date</label>
                <input
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
              <label className="block mb-1">Select a Date (Week)</label>
              <input
                type="date"
                value={weekDate}
                onChange={(e) => setWeekDate(e.target.value)}
                className="bg-gray-700 p-2 rounded"
              />
            </div>
          )}
          {timeFilter === "month" && (
            <div>
              <label className="block mb-1">Select Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-gray-700 p-2 rounded"
              />
            </div>
          )}

          {/* Worker Filter */}
          <div>
            <label className="block mb-1">Filter by Worker Name</label>
            <input
              type="text"
              value={filterWorker}
              onChange={(e) => setFilterWorker(e.target.value)}
              placeholder="Enter worker name"
              className="bg-gray-700 p-2 rounded"
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="block mb-1">Sort By</label>
            <select
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
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Transaction Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Worker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Commission
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{transaction.id}</td>
                <td className="px-6 py-4">
                  {new Date(transaction.transactionDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  {transaction.workerName || transaction.workerId}
                </td>
                <td className="px-6 py-4">
                  {transaction.serviceName || transaction.serviceId}
                </td>
                <td className="px-6 py-4">
                  {transaction.customerName ? transaction.customerName : "N/A"}
                  {transaction.customerPhone && ` (${transaction.customerPhone})`}
                </td>
                <td className="px-6 py-4">{transaction.startTime}</td>
                <td className="px-6 py-4">{transaction.endTime}</td>
                <td className="px-6 py-4">${transaction.sales}</td>
                <td className="px-6 py-4">${transaction.commission}</td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No transactions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
