"use client";

import { useState, useEffect } from "react";
import { Services } from "@/components/types/massage";
import MassageShift from "@/components/massage/MassageShift";
import ComingSoon from "@/components/comingsoon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TemplatePage from "@/components/massage/TemplatePage";
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

  const tabs = [
    {
      key: "massage-shift",
      title: "Massage Shift",
      icon: <FaSpa />,
      component: <MassageShift services={services} />,
    },
    {
      key: "booking",
      title: "Booking",
      icon: <FaCalendarAlt />,
      component: <ComingSoon />,
    },
    {
      key: "manage-service",
      title: "Service",
      icon: <FaConciergeBell />,
      component: <ComingSoon />,
    },
    {
      key: "manage-addons",
      title: "Add-ons",
      icon: <FaPlusSquare />,
      component: <ComingSoon />,
    },
    {
      key: "transaction",
      title: "Transaction",
      icon: <FaMoneyBillAlt />,
      component: <ComingSoon />,
    },
    {
      key: "report",
      title: "Report",
      icon: <FaChartBar />,
      component: <ComingSoon />,
    },
    {
      key: "template",
      title: "Template",
      icon: <FaFileAlt />,
      component: <TemplatePage />,
    },
  ];

  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <div className="pb-5 mb-4">
        <p className="flex-1 flex flex-col items-center justify-center text-center px-4 py-2 font-bold text-white">
          ADMIN MENU PANEL
        </p>
        <nav className="-mb-px flex gap-x-4">
          <ToastContainer />

          {tabs.map(({ key, title, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center justify-center text-center px-4 py-2 font-medium transition-colors duration-200 ${
                activeTab === key
                  ? "bg-lime-500 border-b border-orange-500 text-white-900 font-bold shadow-md shadow-purple-400/50"
                  : "border-b-2 border-transparent text-white-400 hover:text-purple-400"
              }`}
            >
              {icon}
              <span className="mt-1">{title}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
    </div>
  );
}
