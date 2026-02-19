import { StatsCard } from "@/components/saas/StatsCard";
import { RevenueChart } from "@/components/saas/RevenueChart";
import { RecentActivity } from "@/components/saas/RecentActivity";
import { UsersIcon, DollarSignIcon, ActivityIcon, CreditCardIcon } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value="$45,231.89"
                    trend={20.1}
                    icon={<DollarSignIcon />}
                />
                <StatsCard
                    title="Active Users"
                    value="+2350"
                    trend={-180.1}
                    trendLabel="vs last week"
                    icon={<UsersIcon />}
                />
                <StatsCard
                    title="Sales"
                    value="+12,234"
                    trend={19.1}
                    icon={<CreditCardIcon />}
                />
                <StatsCard
                    title="Active Now"
                    value="+573"
                    trend={201}
                    trendLabel="since last hour"
                    icon={<ActivityIcon />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                <div className="lg:col-span-2 h-full">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-1 h-full">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}
