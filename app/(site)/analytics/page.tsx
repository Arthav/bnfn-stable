"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { supabase } from "@/lib/supabase";

type AnalyticsData = {
    id: string;
    path: string;
    ip_address: string;
    user_agent: string;
    clicks: number;
    created_at: string;
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            const { data: visits, error } = await supabase
                .from("analytics_visits")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching analytics:", error);
            } else if (visits) {
                setData(visits);
            }
            setIsLoading(false);
        };

        fetchAnalytics();
    }, []);

    const columns = [
        { key: "path", label: "PAGE VISITED" },
        { key: "ip_address", label: "IP ADDRESS" },
        { key: "clicks", label: "HITS / CLICKS" },
        { key: "created_at", label: "LAST VISIT" },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-8">
            <h1 className="text-4xl font-bold font-heading mb-2">Analytics</h1>
            <p className="text-default-500 mb-8">View real-time site visitation data.</p>

            <Table
                aria-label="Analytics Table"
                classNames={{
                    wrapper: "bg-content1 border border-default-200 shadow-sm",
                    th: "bg-default-100 text-default-600 font-semibold",
                    td: "py-3"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={data} emptyContent={isLoading ? "Loading analytics..." : "No data to display."}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => {
                                if (columnKey === "created_at") {
                                    return <TableCell>{new Date(item[columnKey]).toLocaleString()}</TableCell>;
                                }
                                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
