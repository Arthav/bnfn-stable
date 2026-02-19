"use client";

import { Card, CardBody } from "@nextui-org/card";
import { MoveUpRightIcon, MoveDownRightIcon } from "lucide-react";
import clsx from "clsx";

interface StatsCardProps {
    title: string;
    value: string;
    trend: number;
    trendLabel?: string;
    icon?: React.ReactNode;
}

export const StatsCard = ({ title, value, trend, trendLabel = "vs last month", icon }: StatsCardProps) => {
    const isPositive = trend >= 0;

    return (
        <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
            <CardBody className="gap-2 p-4">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="text-tiny text-default-500 font-medium uppercase tracking-wider">{title}</span>
                        <span className="text-2xl font-bold text-default-900">{value}</span>
                    </div>
                    {icon && <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>}
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <div className={clsx(
                        "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                        isPositive ? "text-success bg-success/10" : "text-danger bg-danger/10"
                    )}>
                        {isPositive ? <MoveUpRightIcon size={12} /> : <MoveDownRightIcon size={12} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                    <span className="text-xs text-default-400">{trendLabel}</span>
                </div>
            </CardBody>
        </Card>
    );
};
