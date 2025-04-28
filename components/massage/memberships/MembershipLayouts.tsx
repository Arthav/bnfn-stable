"use client";

import { useState, useEffect } from "react";
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

export default function MassageShiftPage({
  memberships,
  setMemberships,
  membershipTypes,
  setMembershipTypes,
  redeemHistory,
  setRedeemHistory,
  customerEntry
}: {
  memberships: Membership[];
  setMemberships: React.Dispatch<React.SetStateAction<Membership[]>>;
  membershipTypes: MembershipTypesStruct[];
  setMembershipTypes: React.Dispatch<
    React.SetStateAction<MembershipTypesStruct[]>
  >;
  redeemHistory: RedeemPointHistoryStruct[];
  setRedeemHistory: React.Dispatch<
    React.SetStateAction<RedeemPointHistoryStruct[]>
  >;
  customerEntry: CustomerEntryStruct[];
}) {
  const [activeTab, setActiveTab] = useState("membership");

  const tabs = [
    {
      key: "membership",
      title: "Membership",
      component: (
        <MemberShip
          memberships={memberships}
          setMemberships={setMemberships}
          membershipTypes={membershipTypes}
          redeemHistory={redeemHistory}
          setRedeemHistory={setRedeemHistory}
        />
      ),
    },
    {
      key: "membership-types",
      title: "Membership Types",
      component: (
        <MemberShipTypes
          membershipTypes={membershipTypes}
          setMembershipTypes={setMembershipTypes}
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
