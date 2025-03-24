import React, { useState } from "react";
import { Services, Worker, Transaction } from "@/components/types/massage";

interface ReportPageProps {
  workers: Worker[];
  services: Services[];
  transactions: Transaction[];
}

export default function ReportPage({
  workers,
  services,
  transactions,
}: ReportPageProps) {
  // Filter states
  const [filterType, setFilterType] = useState<"dayRange" | "day" | "month" | "year">("dayRange");
  const [startDate, setStartDate] = useState<string>(""); // for day range: start date
  const [endDate, setEndDate] = useState<string>(""); // for day range: end date
  const [filterDate, setFilterDate] = useState<string>(""); // for day filter
  const [filterMonth, setFilterMonth] = useState<string>(""); // for month filter (YYYY-MM)
  const [filterYear, setFilterYear] = useState<string>(""); // for year filter

  // Filter transactions based on selected criteria.
  const filteredTransactions = transactions.filter((tx) => {
    // Assume tx.transactionDate is an ISO date string.
    const txDate = new Date(tx.transactionDate);
    if (filterType === "dayRange") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Allow txDate if it falls between start and end (inclusive)
        return txDate >= start && txDate <= end;
      }
      return true;
    }
    if (filterType === "day") {
      if (filterDate) {
        const selectedDate = new Date(filterDate);
        return (
          txDate.getFullYear() === selectedDate.getFullYear() &&
          txDate.getMonth() === selectedDate.getMonth() &&
          txDate.getDate() === selectedDate.getDate()
        );
      }
      return true;
    }
    if (filterType === "month") {
      if (filterMonth) {
        const [year, month] = filterMonth.split("-").map(Number);
        return (
          txDate.getFullYear() === year &&
          txDate.getMonth() === month - 1 // months are 0-indexed in JS
        );
      }
      return true;
    }
    if (filterType === "year") {
      if (filterYear) {
        return txDate.getFullYear() === parseInt(filterYear, 10);
      }
      return true;
    }
    return true;
  });

  // Overall Metrics using filtered transactions
  const totalTransactions = filteredTransactions.length;
  const totalSales = filteredTransactions.reduce((acc, t) => acc + t.sales, 0);
  const totalCommission = filteredTransactions.reduce((acc, t) => acc + t.commission, 0);
  const averageSales = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Service Performance Metrics using filtered transactions
  const serviceMetrics = services.map((service) => {
    const txs = filteredTransactions.filter((t) => t.serviceId === service.id);
    return {
      ...service,
      transactionCount: txs.length,
      totalSales: txs.reduce((sum, t) => sum + t.sales, 0),
      totalCommission: txs.reduce((sum, t) => sum + t.commission, 0),
    };
  });

  // Worker Performance Metrics using filtered transactions
  const workerMetrics = workers.map((worker) => {
    const txs = filteredTransactions.filter((t) => t.workerId === worker.id);
    return {
      ...worker,
      transactionCount: txs.length,
      totalSales: txs.reduce((sum, t) => sum + t.sales, 0),
      totalCommission: txs.reduce((sum, t) => sum + t.commission, 0),
    };
  });

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    const headers = [
      "ID",
      "Worker Name",
      "Service Name",
      "Start Time",
      "End Time",
      "Sales",
      "Commission",
      "Foot Time",
      "Body Time",
      "Customer Name",
      "Customer Phone",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredTransactions.map((tx) => {
        const row = [
          tx.id,
          tx.workerName || "",
          tx.serviceName || "",
          tx.startTime,
          tx.endTime,
          tx.sales,
          tx.commission,
          tx.footTime,
          tx.bodyTime,
          tx.customerName || "",
          tx.customerPhone || "",
        ];
        return row.join(",");
      }),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Report Page</h1>

        {/* Filter Controls */}
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Filter Transactions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-gray-700 text-white p-2 rounded"
            >
              <option value="dayRange">Day Range</option>
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>

            {filterType === "dayRange" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded"
                  placeholder="End Date"
                />
              </>
            )}

            {filterType === "day" && (
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              />
            )}

            {filterType === "month" && (
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              />
            )}

            {filterType === "year" && (
              <input
                type="number"
                placeholder="YYYY"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              />
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold">Overall Metrics</h2>
            <p>Total Transactions: {totalTransactions}</p>
            <p>Total Sales: ${totalSales.toFixed(2)}</p>
            <p>Total Commission: ${totalCommission.toFixed(2)}</p>
            <p>Average Sales per Transaction: ${averageSales.toFixed(2)}</p>
          </div>
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto mb-6">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Worker Name</th>
                <th className="px-4 py-2">Service Name</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2">Commission</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-4 py-2">{tx.id}</td>
                  <td className="px-4 py-2">{tx.workerName || "-"}</td>
                  <td className="px-4 py-2">{tx.serviceName || "-"}</td>
                  <td className="px-4 py-2">{tx.startTime}</td>
                  <td className="px-4 py-2">{tx.endTime}</td>
                  <td className="px-4 py-2">${tx.sales.toFixed(2)}</td>
                  <td className="px-4 py-2">${tx.commission.toFixed(2)}</td>
                </tr>
              ))}
              {!filteredTransactions.length && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Service & Worker Performance Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Service Performance</h2>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Transactions</th>
                  <th className="px-4 py-2">Total Sales</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {serviceMetrics.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-2">{service.name}</td>
                    <td className="px-4 py-2">{service.transactionCount}</td>
                    <td className="px-4 py-2">
                      ${service.totalSales.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!serviceMetrics.length && (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No services available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Worker Performance</h2>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Worker</th>
                  <th className="px-4 py-2">Transactions</th>
                  <th className="px-4 py-2">Total Sales</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {workerMetrics.map((worker) => (
                  <tr key={worker.id}>
                    <td className="px-4 py-2">{worker.name}</td>
                    <td className="px-4 py-2">{worker.transactionCount}</td>
                    <td className="px-4 py-2">${worker.totalSales.toFixed(2)}</td>
                  </tr>
                ))}
                {!workerMetrics.length && (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No workers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
