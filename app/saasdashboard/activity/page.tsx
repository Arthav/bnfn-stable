"use client";

import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import { CheckCircle2Icon, XCircleIcon, AlertCircleIcon, FileTextIcon, UserPlusIcon, SettingsIcon } from "lucide-react";

const activities = [
    {
        id: 1,
        type: "login",
        user: { name: "Tony Reichert", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
        action: "logged in",
        target: "from Chrome on Windows",
        time: "Just now",
        icon: <CheckCircle2Icon className="text-success" size={18} />
    },
    {
        id: 2,
        type: "file",
        user: { name: "Zoey Lang", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
        action: "uploaded a file",
        target: "project-requirements.pdf",
        time: "25 minutes ago",
        icon: <FileTextIcon className="text-primary" size={18} />
    },
    {
        id: 3,
        type: "user",
        user: { name: "Jane Fisher", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
        action: "invited a new user",
        target: "marketing@example.com",
        time: "2 hours ago",
        icon: <UserPlusIcon className="text-secondary" size={18} />
    },
    {
        id: 4,
        type: "error",
        user: { name: "System", avatar: "" },
        action: "reported an error",
        target: "Database connection timeout",
        time: "4 hours ago",
        icon: <XCircleIcon className="text-danger" size={18} />
    },
    {
        id: 5,
        type: "settings",
        user: { name: "William Howard", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d" },
        action: "updated settings",
        target: "Billing Information",
        time: "Yesterday",
        icon: <SettingsIcon className="text-warning" size={18} />
    },
    {
        id: 6,
        type: "warning",
        user: { name: "Tony Reichert", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
        action: "exceeded storage limit",
        target: "80% usage warning",
        time: "2 days ago",
        icon: <AlertCircleIcon className="text-warning" size={18} />
    }
];

export default function ActivityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Activity Log</h2>
        <p className="text-default-500">Track all events and actions in your workspace.</p>
      </div>

      <div className="flex flex-col gap-4">
        {activities.map((activity) => (
            <Card key={activity.id} className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm">
                <CardBody className="flex flex-row items-center gap-4 p-4">
                    <div className="p-2 rounded-full bg-default-100 dark:bg-default-200">
                        {activity.icon}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                        {activity.user.name !== "System" ? (
                            <User
                                name={activity.user.name}
                                avatarProps={{ src: activity.user.avatar, size: "sm" }}
                                className="justify-start min-w-[150px]"
                            />
                        ) : (
                            <div className="flex items-center gap-2 min-w-[150px] font-semibold text-sm pl-2">
                                System
                            </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-1 text-sm text-default-600">
                            <span>{activity.action}</span>
                            <span className="font-semibold text-default-900 dark:text-default-100">{activity.target}</span>
                        </div>
                    </div>
                    <div className="text-xs text-default-400 whitespace-nowrap">
                        {activity.time}
                    </div>
                </CardBody>
            </Card>
        ))}
      </div>
    </div>
  );
}
