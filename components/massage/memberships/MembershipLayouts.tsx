"use client";

import { useState } from "react";
import {
  Membership,
  MembershipTypesStruct,
  RedeemPointHistoryStruct,
  CustomerEntryStruct
  // Item,
} from "@/components/types/massage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MemberShip from "@/components/massage/memberships/MemberShip";
import MemberShipTypes from "@/components/massage/memberships/MembershipTypePage";
import RedeemHistoryPage from "@/components/massage/memberships/RedeemHistoryPage";
import CustomerEntryPage from "@/components/massage/memberships/CustomerEntryPage";
import type { MassageWorkspaceActions } from "@/lib/massage/use-massage-workspace";

export default function MassageShiftPage({
  memberships,
  membershipTypes,
  redeemHistory,
  customerEntry,
  actions,
}: {
  memberships: Membership[];
  membershipTypes: MembershipTypesStruct[];
  redeemHistory: RedeemPointHistoryStruct[];
  customerEntry: CustomerEntryStruct[];
  actions: MassageWorkspaceActions;
}) {
  const [activeTab, setActiveTab] = useState("membership");

  const tabs = [
    {
      key: "membership",
      title: "Membership",
      component: (
        <MemberShip
          memberships={memberships}
          membershipTypes={membershipTypes}
          redeemHistory={redeemHistory}
          actions={actions}
        />
      ),
    },
    {
      key: "membership-types",
      title: "Membership Types",
      component: (
        <MemberShipTypes
          membershipTypes={membershipTypes}
          actions={actions}
        />
      ),
    },
    {
      key: "redeem-history",
      title: "Redeem History",
      component: (
        <RedeemHistoryPage
          redeemHistory={redeemHistory}
        />
      ),
    },
    {
      key: "customer-entry",
      title: "Customer Entry",
      component: (
        <CustomerEntryPage
          customerEntry={customerEntry}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pb-5 mb-4">
        <div className="overflow-x-auto overflow-y-hidden">
          <nav className="-mb-px flex gap-x-4 whitespace-nowrap">
            <ToastContainer />
            {tabs.map(({ key, title }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex flex-col items-center justify-center text-center px-4 py-2 font-medium transition-colors duration-200 rounded-lg ${
                  activeTab === key
                    ? "bg-teal-500 border-b border-teal-500 text-white font-bold shadow-md shadow-teal-400/50"
                    : "border-b-2 border-transparent text-white hover:text-teal-400"
                }`}
              >
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
