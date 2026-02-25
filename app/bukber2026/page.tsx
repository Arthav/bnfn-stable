"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";

interface BukberEntry {
    No: string;
    Nama: string;
    "Estimasi ": string;
}

const API_URL =
    "https://sheetdb.io/api/v1/elpny7bjh6192?sheet=estimasi%20biaya";

function parseNumber(val: string): number | null {
    if (!val || val === "#N/A" || val === "0") return null;
    return Number(val.replace(/,/g, ""));
}

function formatRupiah(val: string): string {
    const num = parseNumber(val);
    if (num === null) return "-";
    return `Rp ${num.toLocaleString("id-ID")}`;
}

export default function Bukber2026Page() {
    const [data, setData] = useState<BukberEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error("Gagal mengambil data");
                return res.json();
            })
            .then((json: BukberEntry[]) => {
                const filtered = json.filter((item) => item.Nama && item.Nama.trim() !== "");
                setData(filtered);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const totalEstimasi = data.reduce((sum, item) => {
        const num = parseNumber(item["Estimasi "]);
        return sum + (num ?? 0);
    }, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex flex-col items-center px-4 py-12">
            <div className="w-full max-w-3xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                        🌙 Bukber 2026
                    </h1>
                    <p className="text-default-500 text-sm">
                        Estimasi Biaya Buka Bersama
                    </p>
                </div>

                {/* Summary Card */}
                {!loading && !error && (
                    <Card className="border border-default-200/50 bg-default-50/50 backdrop-blur-sm">
                        <CardBody className="flex flex-row items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-xs text-default-500 uppercase tracking-wider">
                                    Total Peserta
                                </p>
                                <p className="text-2xl font-bold">{data.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-default-500 uppercase tracking-wider">
                                    Total Estimasi
                                </p>
                                <p className="text-2xl font-bold text-amber-400">
                                    Rp {totalEstimasi.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* Table */}
                <Card className="border border-default-200/50 bg-default-50/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="px-6 pt-5 pb-0">
                        <h2 className="text-lg font-semibold">Daftar Peserta</h2>
                    </CardHeader>
                    <CardBody className="px-2 pb-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-default-500">Memuat data...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-danger">{error}</div>
                        ) : (
                            <Table
                                aria-label="Tabel estimasi biaya bukber 2026"
                                removeWrapper
                                classNames={{
                                    th: "bg-default-100/80 text-default-600 text-xs uppercase",
                                    td: "py-3",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn align="center" width={60}>
                                        No
                                    </TableColumn>
                                    <TableColumn>Nama</TableColumn>
                                    <TableColumn align="end">Estimasi</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow key={item.No}>
                                            <TableCell>
                                                <span className="text-default-400 text-sm">
                                                    {item.No}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{item.Nama}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={
                                                        parseNumber(item["Estimasi "]) === null
                                                            ? "danger"
                                                            : "warning"
                                                    }
                                                    className="font-mono"
                                                >
                                                    {formatRupiah(item["Estimasi "])}
                                                </Chip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>

                <p className="text-center text-xs text-default-400">
                    Data diambil secara real-time dari spreadsheet
                </p>
            </div>
        </div>
    );
}
