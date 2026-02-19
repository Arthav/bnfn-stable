"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";


const activities = [
    {
        id: 1,
        user: {
            name: "Tony Reichert",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            email: "tony.reichert@example.com"
        },
        amount: "+$450.00",
        date: "2 mins ago",
        status: "Completed",
        statusColor: "success"
    },
    {
        id: 2,
        user: {
            name: "Zoey Lang",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            email: "zoey.lang@example.com"
        },
        amount: "-$59.00",
        date: "1 hour ago",
        status: "Declined",
        statusColor: "danger"
    },
    {
        id: 3,
        user: {
            name: "Jane Fisher",
            avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            email: "jane.fisher@example.com"
        },
        amount: "+$250.00",
        date: "2 hours ago",
        status: "Pending",
        statusColor: "warning"
    },
    {
        id: 4,
        user: {
            name: "William Howard",
            avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
            email: "william.h@example.com"
        },
        amount: "+$120.50",
        date: "3 hours ago",
        status: "Completed",
        statusColor: "success"
    }
];

export const RecentActivity = () => {
    return (
        <Card className="h-full border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 pt-6">
                <div>
                    <h4 className="font-bold text-large">Recent Transactions</h4>
                    <p className="text-tiny text-default-500 uppercase font-bold">Latest activity</p>
                </div>
                <button className="text-primary text-xs font-semibold hover:underline">View All</button>
            </CardHeader>
            <CardBody className="px-3 pb-3">
                <div className="flex flex-col gap-3">
                    {activities.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 hover:bg-default-100 rounded-xl transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <Avatar src={item.user.avatar} size="sm" isBordered color="default" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{item.user.name}</span>
                                    <span className="text-xs text-default-400">{item.user.email}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-sm font-bold ${item.amount.startsWith('+') ? 'text-success' : 'text-default-500'}`}>
                                    {item.amount}
                                </span>
                                <span className="text-[10px] text-default-400">{item.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};
