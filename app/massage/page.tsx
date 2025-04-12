"use client";

import { useState, useEffect } from "react";
import {
  Worker,
  Services,
  Transaction,
  AddOns,
  Staff,
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
          activeStaff={activeStaff} // Pass active staff to the MassageShift component
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
        />
      ),
    },
  ];

  // Load from localStorage
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
  }, []);

  // Handle active staff change
  const handleActiveStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStaffId = parseInt(e.target.value);
    const selectedStaff =
      staffList.find((staff) => staff.id === selectedStaffId) || null;
    setActiveStaff(selectedStaff);

    // Store active staff in localStorage
    localStorage.setItem("activeStaff", JSON.stringify(selectedStaff));
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pb-5 mb-4">
        {/* Dropdown to select active staff */}
        <div className="mb-4 flex justify-end gap-5">
          <label htmlFor="activeStaff" className="block text-white mb-2">
            Select Active Staff:
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

      <div>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
    </div>
  );
}
