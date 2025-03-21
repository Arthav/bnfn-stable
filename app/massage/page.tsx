"use client";

import { useState, useEffect } from "react";
import { Services } from "@/components/types/massage";
import MassageShift from "@/components/massage/MassageShift";
import ComingSoon from "@/components/comingsoon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TemplatePage from "@/components/massage/TemplatePage";

export default function MassageShiftPage() {
  const [activeTab, setActiveTab] = useState("massage-shift");
  const [services, setServices] = useState<Services[]>([]);
  
  const tabs = [
    {
      key: "massage-shift",
      title: "Massage Shift",
      component: <MassageShift services={services} />,
    },
    { key: "booking", title: "Booking", component: <ComingSoon /> },
    { key: "manage-service", title: "Manage Service", component: <ComingSoon /> },
    { key: "manage-addons", title: "Manage Add-ons", component: <ComingSoon /> },
    { key: "transaction", title: "Transaction", component: <ComingSoon /> },
    { key: "report", title: "Report", component: <ComingSoon /> },
    { key: "template", title: "Template", component: <TemplatePage /> },
  ];

  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <div className="pb-5 mb-4 mb-2">
        <nav className="-mb-px flex justify-center space-x-6">
          <ToastContainer />
          {tabs.map(({ key, title }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 font-medium transition-colors duration-200 ${
                activeTab === key
                  ? "bg-lime-500 border-b border-orange-500 text-white-900 font-bold shadow-md shadow-purple-400/50"
                  : "border-b-2 border-transparent text-white-400 hover:text-purple-400"
              }`}
            >
              {title}
            </button>
          ))}
        </nav>
      </div>

      <div>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
    </div>
  );
}
