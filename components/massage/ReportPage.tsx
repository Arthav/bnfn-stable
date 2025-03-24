import React from "react";
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
  // Overall Metrics
  const totalTransactions = transactions.length;
  const totalSales = transactions.reduce((acc, t) => acc + t.sales, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.commission, 0);
  const averageSales = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Service Performance Metrics
  const serviceMetrics = services.map((service) => {
    const txs = transactions.filter((t) => t.serviceId === service.id);
    return {
      ...service,
      transactionCount: txs.length,
      totalSales: txs.reduce((sum, t) => sum + t.sales, 0),
      totalCommission: txs.reduce((sum, t) => sum + t.commission, 0),
    };
  });

  // Worker Performance Metrics
  const workerMetrics = workers.map((worker) => {
    const txs = transactions.filter((t) => t.workerId === worker.id);
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
      ...transactions.map((tx) => {
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
      <h1 className="text-3xl font-bold mb-4">Report Page</h1>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Overall Metrics</h2>
          <p>Total Transactions: {totalTransactions}</p>
          <p>Total Sales: ${totalSales.toFixed(2)}</p>
          <p>Total Commission: ${totalCommission.toFixed(2)}</p>
          <p>
            Average Sales per Transaction: ${averageSales.toFixed(2)}
          </p>
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
            {transactions.map((tx) => (
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
            {!transactions.length && (
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
        <div>
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

        <div>
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
                  <td className="px-4 py-2">
                    ${worker.totalSales.toFixed(2)}
                  </td>
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
  );
}
