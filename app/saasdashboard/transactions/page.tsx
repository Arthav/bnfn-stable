"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { SearchIcon, DownloadIcon } from "lucide-react";
import React from "react";

const columns = [
  { name: "TRANSACTION ID", uid: "id" },
  { name: "USER", uid: "user" },
  { name: "DATE", uid: "date" },
  { name: "AMOUNT", uid: "amount" },
  { name: "STATUS", uid: "status" },
];

const transactions = [
  {
    id: "#TRX-9821",
    user: { name: "Tony Reichert", email: "tony@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    date: "Feb 19, 2026",
    amount: "$450.00",
    status: "completed"
  },
  {
    id: "#TRX-9820",
    user: { name: "Zoey Lang", email: "zoey@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    date: "Feb 18, 2026",
    amount: "$59.00",
    status: "failed"
  },
  {
    id: "#TRX-9819",
    user: { name: "Jane Fisher", email: "jane@example.com", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
    date: "Feb 17, 2026",
    amount: "$250.00",
    status: "pending"
  },
  {
    id: "#TRX-9818",
    user: { name: "William Howard", email: "william@example.com", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d" },
    date: "Feb 16, 2026",
    amount: "$120.50",
    status: "completed"
  },
  {
    id: "#TRX-9817",
    user: { name: "Kristen Copper", email: "kristen@example.com", avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d" },
    date: "Feb 15, 2026",
    amount: "$89.99",
    status: "completed"
  }
];

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  completed: "success",
  failed: "danger",
  pending: "warning",
};

export default function TransactionsPage() {
  const [filterValue, setFilterValue] = React.useState("");

  const filteredItems = React.useMemo(() => {
    let filtered = [...transactions];
    if (filterValue) {
      filtered = filtered.filter((item) =>
        item.id.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [filterValue]);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof typeof item];

    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{ radius: "lg", src: item.user.avatar }}
            description={item.user.email}
            name={item.user.name}
          >
            {item.user.email}
          </User>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "amount":
        return <span className="font-bold">{cellValue}</span>;
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <p className="text-default-500">View recent payments and invoices.</p>
      </div>

      <div className="flex justify-between items-center bg-default-100/50 p-4 rounded-xl mb-2">
        <Input
          className="max-w-xs"
          placeholder="Search transactions..."
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <button className="text-white flex items-center gap-2 text-primary text-sm font-semibold">
          <DownloadIcon size={16} /> Export CSV
        </button>
      </div>

      <Table aria-label="Transactions table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "amount" ? "end" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
