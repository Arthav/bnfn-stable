"use client";

import { useState, useEffect } from "react";
import { Worker, Services, Transaction } from "@/components/types/massage";
import MassageShift from "@/components/massage/MassageShift";
import ManageService from "@/components/massage/ManageService";
import ComingSoon from "@/components/comingsoon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionList from "@/components/massage/TransactionList";
import ReportPage from "@/components/massage/ReportPage";
import BookingList from "@/components/massage/BookingList";
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
        />
      ),
    },
    {
      key: "booking",
      title: "Booking List",
      icon: <FaCalendarAlt />,
      component: (
        <BookingList
          workers={workers}
        />
      ),
    },
    {
      key: "manage-service",
      title: "Service",
      icon: <FaConciergeBell />,
      component: (
        <ManageService services={services} setServices={setServices} />
      ),
    },
    {
      key: "memberships",
      title: "Memberships",
      icon: <FaPlusSquare />,
      component: <ComingSoon />,
    },
    {
      key: "transaction",
      title: "Transaction",
      icon: <FaMoneyBillAlt />,
      component: <TransactionList transactions={transactions} />,
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
        />
      ),
    },
    // {
    //   key: "template",
    //   title: "Template",
    //   icon: <FaFileAlt />,
    //   component: <TemplatePage />,
    // },
  ];

  // Load from localStorage.
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
  }, []);

  useEffect(() => {
    const storedWorkers = localStorage.getItem("workers");
    if (storedWorkers) {
      setWorkers(JSON.parse(storedWorkers));
    }
  }, []);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pb-5 mb-4">
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
