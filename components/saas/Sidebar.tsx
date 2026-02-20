"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
    HomeIcon,
    UserIcon,
    SettingsIcon,
    ActivityIcon,
    CreditCardIcon,
    BarChart2Icon
} from "lucide-react";
import { BNFNLogo } from "@/components/icons";

const sidebarItems = [
    { label: "Overview", icon: HomeIcon, href: "/saasdashboard" },
    { label: "Analytics", icon: BarChart2Icon, href: "/saasdashboard/analytics" },
    { label: "Customers", icon: UserIcon, href: "/saasdashboard/customers" },
    { label: "Transactions", icon: CreditCardIcon, href: "/saasdashboard/transactions" },
    { label: "Activity", icon: ActivityIcon, href: "/saasdashboard/activity" },
    { label: "Settings", icon: SettingsIcon, href: "/saasdashboard/settings" },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-default-200 bg-background/60 backdrop-blur-xl">
            <div className="p-6 flex items-center gap-2 border-b border-default-200/50">
                <BNFNLogo />
                <span className="font-bold text-xl">Saas Example</span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-default-500 uppercase px-2 mb-2">Main Menu</div>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-default-600 hover:bg-default-100 hover:text-default-900"
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-default-400 group-hover:text-default-600")} />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="mt-8 text-xs font-semibold text-default-500 uppercase px-2 mb-2">Support</div>
                <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-default-600 hover:bg-default-100 hover:text-default-900 transition-all duration-200 group"
                >
                    <div className="w-5 h-5 rounded-full border-2 border-default-400 group-hover:border-default-600 flex items-center justify-center text-[10px] font-bold">?</div>
                    Help Center
                </Link>
            </div>

            <div className="p-4 border-t border-default-200/50">
                <div className="bg-primary/5 rounded-xl p-4">
                    <h4 className="font-semibold text-sm mb-1">Pro Plan</h4>
                    <p className="text-xs text-default-500 mb-3">You have 12 days left in your trial.</p>
                    <button className="w-full bg-primary text-white text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
};
