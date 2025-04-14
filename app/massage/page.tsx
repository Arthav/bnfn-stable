"use client";

import { useState, useEffect } from "react";
import {
  Worker,
  Services,
  Transaction,
  AddOns,
  Staff,
  StaffChangeLog,
  // Item,
} from "@/components/types/massage";
import MassageShift from "@/components/massage/MassageShift";
import ManageService from "@/components/massage/ManageService";
import ComingSoon from "@/components/comingsoon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionList from "@/components/massage/TransactionList";
import ReportPage from "@/components/massage/ReportPage";
import BookingList from "@/components/massage/BookingList";
import ManageAddOnsPage from "@/components/massage/AddOns";
import StaffList from "@/components/massage/Staff";
import {
  FaSpa,
  FaCalendarAlt,
  FaConciergeBell,
  FaPlusSquare,
  FaMoneyBillAlt,
  FaChartBar,
  FaFileAlt,
} from "react-icons/fa";

export default function MassageShiftPage() {
  const [activeTab, setActiveTab] = useState("massage-shift");
  const [services, setServices] = useState<Services[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [addOns, setAddOns] = useState<AddOns[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [activeStaff, setActiveStaff] = useState<Staff | null>(null);
  const [staffChangeLog, setStaffChangeLog] = useState<StaffChangeLog[]>([]);
  const [showStaffChangeLog, setShowStaffChangeLog] = useState(false);

  const tabs = [
    {
      key: "massage-shift",
      title: "Massage Shift",
      icon: <FaSpa />,
      component: (
        <MassageShift
          services={services}
          transactions={transactions}
          workers={workers}
          setWorkers={setWorkers}
          setTransactions={setTransactions}
          addOns={addOns}
          activeStaff={activeStaff}
        />
      ),
    },
    {
      key: "booking",
      title: "Booking List",
      icon: <FaCalendarAlt />,
      component: <BookingList workers={workers} />,
    },
    {
      key: "manage-service",
      title: "Service and Add-Ons",
      icon: <FaConciergeBell />,
      component: (
        <div className="flex flex-col gap-0">
          <ManageService
            services={services}
            setServices={setServices}
            activeStaff={activeStaff}
          />
          <ManageAddOnsPage
            addOns={addOns}
            setAddOns={setAddOns}
            activeStaff={activeStaff}
          />
        </div>
      ),
    },
    {
      key: "staff",
      title: "Staff",
      icon: <FaPlusSquare />,
      component: (
        <StaffList staffList={staffList} setStaffList={setStaffList} />
      ),
    },
    {
      key: "membership",
      title: "Membership",
      icon: <FaFileAlt />,
      component: <ComingSoon />,
    },
    {
      key: "transaction",
      title: "Transaction",
      icon: <FaMoneyBillAlt />,
      component: (
        <TransactionList
          transactions={transactions}
          setTransactions={setTransactions}
          activeStaff={activeStaff}
        />
      ),
    },
    {
      key: "report",
      title: "Report",
      icon: <FaChartBar />,
      component: (
        <ReportPage
          workers={workers}
          services={services}
          transactions={transactions}
          addOns={addOns}
          staffList={staffList}
        />
      ),
    },
  ];

  // Load from localStorage on component mount
  useEffect(() => {
    console.log(`
========================================
Dear Developer, my name is Christian Bonafena

Welcome to the hidden gateway of our code. Your unexpected discovery is not only a testament to your keen curiosity but also a nod to the finer nuances of our craft. In this realm, every semicolon shines with precision, and every curly brace holds a story of excellence.

★ Embrace the Mystery ★

May your commits be legendary, your debugging swift, and your journey through code forever inspiring.

========================================
`);

    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }

    const storedWorkers = localStorage.getItem("workers");
    if (storedWorkers) {
      setWorkers(JSON.parse(storedWorkers));
    }

    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }

    const storedAddOns = localStorage.getItem("addOns");
    if (storedAddOns) {
      setAddOns(JSON.parse(storedAddOns));
    }

    const storedStaff = localStorage.getItem("staffList");
    if (storedStaff) {
      setStaffList(JSON.parse(storedStaff));
    }

    const storedActiveStaff = localStorage.getItem("activeStaff");
    if (storedActiveStaff) {
      setActiveStaff(JSON.parse(storedActiveStaff));
    }

    const storedStaffChangeLog = localStorage.getItem("staffChangeLog");
    if (storedStaffChangeLog) {
      const parsedLog = JSON.parse(storedStaffChangeLog);
      // Ensure the parsed value is an array; otherwise default to an empty array
      setStaffChangeLog(Array.isArray(parsedLog) ? parsedLog : []);
    }
  }, []);

  // Synchronize staffChangeLog state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("staffChangeLog", JSON.stringify(staffChangeLog));
  }, [staffChangeLog]);

  // Handle active staff change
  const handleActiveStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStaffId = parseInt(e.target.value);
    const selectedStaff =
      staffList.find((staff) => staff.id === selectedStaffId) || null;

    const newStaffChangeLog: StaffChangeLog = {
      id: Date.now(),
      staffId: selectedStaffId,
      changeFromId: activeStaff?.id || null,
      changeToId: selectedStaffId,
      changeDate: new Date().toISOString(),
    };

    // Append the new log entry and update the state
    setStaffChangeLog([...staffChangeLog, newStaffChangeLog]);
    setActiveStaff(selectedStaff);

    // Update activeStaff in localStorage (can also be synchronized via a useEffect)
    localStorage.setItem("activeStaff", JSON.stringify(selectedStaff));
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pb-5 mb-4">
        {/* Dropdown to select active staff */}
        <div className="mb-4 flex justify-end gap-5">
          <label htmlFor="activeStaff" className="block text-white mb-2">
            Active Receptionist:
          </label>
          <select
            id="activeStaff"
            onChange={handleActiveStaffChange}
            value={activeStaff ? activeStaff.id : ""}
            className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a staff member
            </option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowStaffChangeLog(true)}
            className="flex items-center p-2 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaCalendarAlt className="h-5 w-5 text-white" />
          </button>
        </div>

        <p className="flex flex-col items-center justify-center text-center px-4 py-2 font-bold text-white">
          ADMIN MENU PANEL
        </p>

        <div className="overflow-x-auto overflow-y-hidden">
          <nav className="-mb-px flex gap-x-4 whitespace-nowrap">
            <ToastContainer />
            {tabs.map(({ key, title, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex flex-col items-center justify-center text-center px-4 py-2 font-medium transition-colors duration-200 ${
                  activeTab === key
                    ? "bg-lime-500 border-b border-orange-500 text-white font-bold shadow-md shadow-purple-400/50"
                    : "border-b-2 border-transparent text-white hover:text-purple-400"
                }`}
              >
                {icon}
                <span className="mt-1 text-sm">{title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {showStaffChangeLog && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            {/* Backdrop with click-to-close */}
            <div
              className="fixed inset-0 bg-black bg-opacity-75"
              onClick={() => setShowStaffChangeLog(false)}
            ></div>
            {/* This element is to center the modal contents */}
            <span
              className="hidden sm:inline-block sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-middle bg-black rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3">
                <h3
                  className="text-lg font-medium text-white-900"
                  id="modal-title"
                >
                  Staff Change Log
                </h3>
                <button
                  type="button"
                  className="text-white hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowStaffChangeLog(false)}
                  aria-label="Close modal"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Modal Body with table */}
              <div className="px-4 py-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-black">
                      <tr>
                        <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">
                          Staff
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">
                          To
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black divide-y divide-gray-200">
                      {staffChangeLog.map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {staffList.find((s) => s.id === log.staffId)?.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {log.changeFromId
                              ? staffList.find((s) => s.id === log.changeFromId)
                                  ?.name
                              : "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {log.changeToId
                              ? staffList.find((s) => s.id === log.changeToId)
                                  ?.name
                              : "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(log.changeDate).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="px-4 py-3 flex justify-end border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => setShowStaffChangeLog(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
    </div>
  );
}
