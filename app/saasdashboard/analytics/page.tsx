"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { RevenueChart } from "@/components/saas/RevenueChart";
import { StatsCard } from "@/components/saas/StatsCard";
import { UsersIcon, EyeIcon, MousePointerClickIcon } from "lucide-react";
import { motion } from "framer-motion";

const trafficData = [
    { source: "Direct", value: 40, color: "bg-primary" },
    { source: "Social Media", value: 25, color: "bg-secondary" },
    { source: "Organic Search", value: 20, color: "bg-success" },
    { source: "Referral", value: 15, color: "bg-warning" },
];

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Analytics Overview</h2>
                <p className="text-default-500">Track your performance and growth metrics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Views"
                    value="1.2M"
                    trend={12.5}
                    icon={<EyeIcon />}
                />
                <StatsCard
                    title="Unique Visitors"
                    value="854k"
                    trend={8.2}
                    icon={<UsersIcon />}
                />
                <StatsCard
                    title="Bounce Rate"
                    value="42.3%"
                    trend={-2.1}
                    trendLabel="vs last month"
                    icon={<MousePointerClickIcon />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[400px]">
                    <RevenueChart />
                </div>

                <Card className="h-[400px] border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
                    <CardHeader className="flex flex-col items-start px-6 pt-6">
                        <h4 className="font-bold text-large">Traffic Sources</h4>
                        <p className="text-tiny text-default-500 uppercase font-bold">Where your users come from</p>
                    </CardHeader>
                    <CardBody className="flex flex-col justify-center gap-6 px-6">
                        {trafficData.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{item.source}</span>
                                    <span className="text-default-500">{item.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-default-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        className={`h-full rounded-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
