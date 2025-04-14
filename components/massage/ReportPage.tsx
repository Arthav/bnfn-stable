import React, { useState } from "react";
import {
  Services,
  Worker,
  Transaction,
  AddOns,
  Staff,
} from "@/components/types/massage";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

interface ReportPageProps {
  workers: Worker[];
  services: Services[];
  transactions: Transaction[];
  addOns: AddOns[];
  staffList: Staff[];
}

export default function ReportPage({
  workers,
  services,
  transactions,
  addOns,
  staffList,
}: ReportPageProps) {
  // Filter states
  const [filterType, setFilterType] = useState<
    "dayRange" | "day" | "month" | "year"
  >("dayRange");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");

  // Filter transactions based on selected criteria.
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.transactionDate);
    if (filterType === "dayRange") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
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
        return txDate.getFullYear() === year && txDate.getMonth() === month - 1;
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
  const totalCommission = filteredTransactions.reduce(
    (acc, t) => acc + t.commission,
    0
  );
  const averageSales =
    totalTransactions > 0 ? totalSales / totalTransactions : 0;

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
    const txs = filteredTransactions.filter(
      (t) => t.workerId === worker.id && !t.isRefundTransaction
    );
    return {
      ...worker,
      transactionCount: txs.length,
      totalSales: txs.reduce(
        (sum, t) => (t.isRefunded ? sum : sum + (t.sales || 0)),
        0
      ),
      totalCommission: txs.reduce((sum, t) => sum + t.commission, 0),
    };
  });

  // Service Performance Metrics using filtered transactions
  const addOnsMetrics = addOns.map((addOn) => {
    const txs = filteredTransactions.filter((t) =>
      t.addOns?.some((a) => a.id === addOn.id)
    );
    return {
      ...addOn,
      transactionCount: txs.length,
      totalSales: txs.length * addOn.price,
      totalProfit: txs.length * addOn.profit,
    };
  });

  // Staff Performance Metrics using filtered transactions
  const staffMetrics = staffList.map((staff) => {
    const txs = filteredTransactions.filter(
      (t) => t.createdBy?.id === staff.id && !t.isRefundTransaction
    );
    return {
      ...staff,
      transactionCount: txs.length,
      totalRefundCount: txs.reduce((sum, t) => sum + (t.isRefunded ? 1 : 0), 0),
      totalRefundAmount: txs.reduce(
        (sum, t) => sum + (t.isRefunded ? t.refundAmount || 0 : 0),
        0
      ),
      totalSales: txs.reduce(
        (sum, t) => (t.isRefunded ? sum : sum + (t.sales || 0)),
        0
      ),
      totalCommission: txs.reduce(
        (sum, t) => sum + (t.staffCommission || 0),
        0
      ),
    };
  });

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
      "Add Ons",
      "Refunded",
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
          tx.addOns?.map((addon) => addon.name).join(", ") || "",
          tx.isRefunded ? "Yes" : "No",
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

  // Export to PDF using jsPDF
  // Export to PDF using jsPDF
  const exportToPdf = () => {
    const doc = new jsPDF();

    // Helper to add a header to the current page.
    const addHeader = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFillColor(60, 60, 60);
      doc.rect(0, 0, pageWidth, 20, "F");

      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("Transactions Report", pageWidth / 2, 14, { align: "center" });
      doc.setTextColor(0, 0, 0);
    };

    // Helper to add a footer with page number.
    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(10);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageNumber = doc.getNumberOfPages();
      doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    };

    // Initialize first page with header.
    addHeader();
    let currentY = 30; // starting below header

    // ----------------
    // Summary Section
    // ----------------
    const summaryData = [
      ["Total Transactions", totalTransactions],
      ["Total Sales", `$${totalSales.toFixed(2)}`],
      ["Total Commission", `$${totalCommission.toFixed(2)}`],
      ["Average Sales per Transaction", `$${averageSales.toFixed(2)}`],
    ];

    doc.setFontSize(14);
    doc.text("Summary", 10, currentY);
    currentY += 5;

    autoTable(doc, {
      startY: currentY,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 10 },
      margin: { left: 10, right: 10 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // ----------------
    // Transactions Section
    // ----------------
    doc.setFontSize(14);
    doc.text("Transactions", 10, currentY);
    currentY += 5;

    const transactionsData = filteredTransactions.map((tx) => [
      tx.id,
      tx.workerName || "-",
      tx.serviceName || "-",
      `$${tx.sales.toFixed(2)}`,
      `$${tx.commission.toFixed(2)}`,
      tx.addOns?.map((addon) => addon.name).join(", ") || "-",
      tx.isRefunded ? "Yes" : "No",
      tx.createdBy?.name || "Has not been set",
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "ID",
          "Worker",
          "Service",
          "Sales",
          "Commission",
          "Add Ons",
          "Refunded",
          "Staff",
        ],
      ],
      body: transactionsData,
      theme: "grid",
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 10 },
      margin: { left: 10, right: 10 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // ---------------------------
    // Service Performance Section
    // ---------------------------
    if (serviceMetrics.length > 0) {
      doc.setFontSize(14);
      doc.text("Service Performance", 10, currentY);
      currentY += 5;

      const serviceData = serviceMetrics.map((service) => [
        service.name,
        service.transactionCount,
        `$${service.totalSales.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Service", "Transactions", "Total Sales"]],
        body: serviceData,
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60] },
        styles: { fontSize: 10 },
        margin: { left: 10, right: 10 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // ---------------------------
    // Worker Performance Section
    // ---------------------------
    if (workerMetrics.length > 0) {
      doc.setFontSize(14);
      doc.text("Worker Performance", 10, currentY);
      currentY += 5;

      const workerData = workerMetrics.map((worker) => [
        worker.name,
        worker.transactionCount,
        `$${worker.totalSales.toFixed(2)}`,
        `$${worker.totalCommission.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Worker", "Transactions", "Total Sales", "Total Commission"]],
        body: workerData,
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60] },
        styles: { fontSize: 10 },
        margin: { left: 10, right: 10 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // ---------------------------
    // Addons Performance Section
    // ---------------------------
    if (addOnsMetrics.length > 0) {
      doc.setFontSize(14);
      doc.text("Addons Performance", 10, currentY);
      currentY += 5;

      const addonsData = addOnsMetrics.map((addon) => [
        addon.name,
        addon.transactionCount,
        `$${addon.totalSales.toFixed(2)}`,
        `$${addon.totalProfit.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Add Ons", "Transactions", "Total Sales", "Total Profit"]],
        body: addonsData,
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60] },
        styles: { fontSize: 10 },
        margin: { left: 10, right: 10 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // ---------------------------
    // Staff Performance Section
    // ---------------------------
    if (staffMetrics.length > 0) {
      doc.setFontSize(14);
      doc.text("Staff Performance", 10, currentY);
      currentY += 5;

      const staffData = staffMetrics.map((staff) => [
        staff.name,
        staff.transactionCount,
        `$${staff.totalSales.toFixed(2)}`,
        `$${staff.totalCommission.toFixed(2)}`,
        staff.totalRefundCount,
        `$${staff.totalRefundAmount.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "Staff",
            "Transactions",
            "Total Sales",
            "Total Commission",
            "Total Refunds",
            "Total Refund Amount",
          ],
        ],
        body: staffData,
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60] },
        styles: { fontSize: 10 },
        margin: { left: 10, right: 10 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Final footer on last page.
    addFooter();
    doc.save("transactions_report.pdf");
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
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPdf}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Export to PDF
            </button>
          </div>
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
                  <th className="px-4 py-2">Total Commission</th>
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
                    <td className="px-4 py-2">
                      ${worker.totalCommission.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!workerMetrics.length && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No workers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Addons Performance & Staff Commission Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Addons Performance</h2>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Add Ons</th>
                  <th className="px-4 py-2">Transactions</th>
                  <th className="px-4 py-2">Total Sales</th>
                  <th className="px-4 py-2">Total Profit</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {addOnsMetrics.map((addon) => (
                  <tr key={addon.id}>
                    <td className="px-4 py-2">{addon.name}</td>
                    <td className="px-4 py-2">{addon.transactionCount}</td>
                    <td className="px-4 py-2">
                      ${addon.totalSales.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      ${addon.totalProfit.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!addOnsMetrics.length && (
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
            <h2 className="text-xl font-semibold mb-2">Staff Performance</h2>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Staff Name</th>
                  <th className="px-4 py-2">Total Transactions and Sales</th>
                  <th className="px-4 py-2">Total Commission</th>
                  <th className="px-4 py-2">Refund times</th>
                  <th className="px-4 py-2">Total Refund Amount</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {staffMetrics.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-4 py-2">{staff.name}</td>
                    <td className="px-4 py-2">
                      {staff.transactionCount}x | ${staff.totalSales.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      ${staff.totalCommission.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{staff.totalRefundCount}</td>
                    <td className="px-4 py-2">
                      ${staff.totalRefundAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!staffMetrics.length && (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No services available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                <th className="px-4 py-2">Add Ons</th>
                <th className="px-4 py-2">Refunded</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredTransactions.map((tx) => {
                if (tx.isRefundTransaction) return null;
                return (
                  <tr key={tx.id}>
                    <td className="px-4 py-2">{tx.id}</td>
                    <td className="px-4 py-2">{tx.workerName || "-"}</td>
                    <td className="px-4 py-2">{tx.serviceName || "-"}</td>
                    <td className="px-4 py-2">{tx.startTime}</td>
                    <td className="px-4 py-2">{tx.endTime}</td>
                    <td className="px-4 py-2">${tx.sales.toFixed(2)}</td>
                    <td className="px-4 py-2">${tx.commission.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      {tx.addOns?.map((addon) => addon.name).join(", ") || "-"}
                    </td>
                    <td
                      className="px-4 py-2"
                      style={{ color: tx.isRefunded ? "red" : "green" }}
                    >
                      {tx.isRefunded ? "Yes" : "No"}
                    </td>
                  </tr>
                );
              })}
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
      </div>
    </div>
  );
}
