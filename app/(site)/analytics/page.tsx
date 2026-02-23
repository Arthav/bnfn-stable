"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";
import { supabase } from "@/lib/supabase";

type AnalyticsData = {
    id: string;
    path: string;
    ip_address: string;
    user_agent: string;
    clicks: number;
    created_at: string;
};

type FilterType = "all" | "pages" | "ips";

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");

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

    const processedData = useMemo(() => {
        if (filter === "all") return data;

        if (filter === "pages") {
            const grouped = data.reduce((acc, curr) => {
                if (!acc[curr.path]) {
                    acc[curr.path] = { id: curr.path, path: curr.path, clicks: 0, unique_ips: new Set() };
                }
                acc[curr.path].clicks += curr.clicks;
                acc[curr.path].unique_ips.add(curr.ip_address);
                return acc;
            }, {} as Record<string, any>);

            return Object.values(grouped).map(item => ({
                ...item,
                unique_ips: item.unique_ips.size
            })).sort((a, b) => b.clicks - a.clicks);
        }

        if (filter === "ips") {
            const grouped = data.reduce((acc, curr) => {
                if (!acc[curr.ip_address]) {
                    acc[curr.ip_address] = { id: curr.ip_address, ip_address: curr.ip_address, clicks: 0, pages: new Set() };
                }
                acc[curr.ip_address].clicks += curr.clicks;
                acc[curr.ip_address].pages.add(curr.path);
                return acc;
            }, {} as Record<string, any>);

            return Object.values(grouped).map(item => ({
                ...item,
                unique_pages: item.pages.size
            })).sort((a, b) => b.clicks - a.clicks);
        }

        return data;
    }, [data, filter]);

    const columns = useMemo(() => {
        if (filter === "pages") {
            return [
                { key: "path", label: "PAGE" },
                { key: "clicks", label: "TOTAL HITS" },
                { key: "unique_ips", label: "UNIQUE VISITORS (IPs)" },
            ];
        }
        if (filter === "ips") {
            return [
                { key: "ip_address", label: "IP ADDRESS" },
                { key: "clicks", label: "TOTAL HITS" },
                { key: "unique_pages", label: "PAGES VISITED" },
            ];
        }
        return [
            { key: "path", label: "PAGE VISITED" },
            { key: "ip_address", label: "IP ADDRESS" },
            { key: "clicks", label: "HITS / CLICKS" },
            { key: "created_at", label: "LAST VISIT" },
        ];
    }, [filter]);


    return (
        <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-8">
            <h1 className="text-4xl font-bold font-heading mb-2">Analytics</h1>
            <p className="text-default-500 mb-6">View real-time site visitation data.</p>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
                <Chip
                    color={filter === "all" ? "primary" : "default"}
                    variant={filter === "all" ? "solid" : "flat"}
                    className="cursor-pointer"
                    onClick={() => setFilter("all")}
                >
                    Raw Logs
                </Chip>
                <Chip
                    color={filter === "pages" ? "primary" : "default"}
                    variant={filter === "pages" ? "solid" : "flat"}
                    className="cursor-pointer"
                    onClick={() => setFilter("pages")}
                >
                    Top Pages
                </Chip>
                <Chip
                    color={filter === "ips" ? "primary" : "default"}
                    variant={filter === "ips" ? "solid" : "flat"}
                    className="cursor-pointer"
                    onClick={() => setFilter("ips")}
                >
                    Top IPs
                </Chip>
            </div>

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
                <TableBody items={processedData} emptyContent={isLoading ? "Loading analytics..." : "No data to display."}>
                    {(item: any) => (
                        <TableRow key={item.id}>
                            {(columnKey) => {
                                if (columnKey === "created_at" && item[columnKey]) {
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
