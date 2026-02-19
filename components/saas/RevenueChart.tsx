"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { motion } from "framer-motion";

const data = [
    { month: "Jan", value: 40 },
    { month: "Feb", value: 30 },
    { month: "Mar", value: 65 },
    { month: "Apr", value: 50 },
    { month: "May", value: 85 },
    { month: "Jun", value: 70 },
    { month: "Jul", value: 90 },
];

export const RevenueChart = () => {
    return (
        <Card className="h-full border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
            <CardHeader className="flex flex-col items-start px-6 pt-6">
                <h4 className="font-bold text-large">Revenue Overview</h4>
                <p className="text-tiny text-default-500 uppercase font-bold">Monthly Growth</p>
            </CardHeader>
            <CardBody className="pb-6 px-6 overflow-hidden">
                <div className="h-full flex items-end justify-between gap-2 mt-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group w-full">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${item.value}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/40 transition-colors"
                            >
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-default-900 text-default-50 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {item.value}%
                                </div>
                            </motion.div>
                            <span className="text-xs text-default-400 font-medium">{item.month}</span>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};
