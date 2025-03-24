import React from "react";
import { Transaction } from "@/components/types/massage";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{transaction.id}</td>
                <td className="px-6 py-4">
                  {new Date(transaction.transactionDate).toLocaleDateString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </td>

                <td className="px-6 py-4">
                  {transaction.workerName || transaction.workerId}
                </td>
                <td className="px-6 py-4">
                  {transaction.serviceName || transaction.serviceId}
                </td>
                <td className="px-6 py-4">
                  {transaction.customerName ? transaction.customerName : "N/A"}
                  {transaction.customerPhone &&
                    ` (${transaction.customerPhone})`}
                </td>
                <td className="px-6 py-4">{transaction.startTime}</td>
                <td className="px-6 py-4">{transaction.endTime}</td>
                <td className="px-6 py-4">${transaction.sales}</td>
                <td className="px-6 py-4">${transaction.commission}</td>
                <td className="px-6 py-4">Unknown?</td>
              </tr>
            ))}
            {transactions.length === 0 && (
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
